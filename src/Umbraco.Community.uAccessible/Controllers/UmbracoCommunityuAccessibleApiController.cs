using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PublishedCache;
using Umbraco.Cms.Core.Routing;
using Umbraco.Cms.Core.Services;
using Umbraco.Community.uAccessible.Configuration;
using Umbraco.Community.uAccessible.Models;
using Umbraco.Community.uAccessible.Services;
using Umbraco.Extensions;

namespace Umbraco.Community.uAccessible.Controllers
{
    [ApiVersion("1.0")]
    [ApiExplorerSettings(GroupName = "Umbraco.Community.uAccessible")]
    public class UmbracoCommunityuAccessibleApiController : UmbracoCommunityuAccessibleApiControllerBase
    {
        private readonly ICacheManager _cacheManager;
        private readonly IPublishedUrlProvider _urlProvider;
        private readonly AxeScanService _axeService;
        private readonly ScanHistoryService _historyService;
        private readonly SiteAuditHistoryService _siteHistoryService;
        private readonly IContentTypeService _contentTypeService;
        private readonly ScanLockService _scanLock;
        private readonly UAccessibleSettings _settings;

        public UmbracoCommunityuAccessibleApiController(
            ICacheManager cacheManager,
            IPublishedUrlProvider urlProvider,
            AxeScanService axeService,
            ScanHistoryService historyService,
            SiteAuditHistoryService siteHistoryService,
            IContentTypeService contentTypeService,
            ScanLockService scanLock,
            IOptions<UAccessibleSettings> settings)
        {
            _cacheManager        = cacheManager;
            _urlProvider         = urlProvider;
            _axeService          = axeService;
            _historyService      = historyService;
            _siteHistoryService  = siteHistoryService;
            _contentTypeService  = contentTypeService;
            _scanLock            = scanLock;
            _settings            = settings.Value;
        }

        [HttpGet("audit/key/{key:guid}")]
        [ProducesResponseType<AuditResult>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> AuditByKey(Guid key, CancellationToken ct)
        {
            if (!_scanLock.TryAcquirePage(key))
                return Conflict(new { error = "A scan is already in progress for this page. Please wait and try again shortly." });

            try
            {
                var content = await _cacheManager.Content.GetByIdAsync(key, preview: false);
                if (content is null)
                    return NotFound(new { error = "Content not found or not published." });

                var url = _urlProvider.GetUrl(content, UrlMode.Absolute);
                if (string.IsNullOrWhiteSpace(url) || url == "#")
                {
                    return Ok(new AuditResult
                    {
                        Published  = false,
                        FetchError = "This page does not have a published URL. Publish the page first."
                    });
                }

                var result = await _axeService.ScanUrlAsync(url, ct);

                if (result.FetchError is null)
                    _historyService.Record(key, result);

                return Ok(result);
            }
            finally
            {
                _scanLock.ReleasePage(key);
            }
        }

        [HttpGet("audit/history/{key:guid}")]
        [ProducesResponseType<IReadOnlyList<ScanHistorySummary>>(StatusCodes.Status200OK)]
        public IActionResult GetHistory(Guid key)
        {
            var entries = _historyService.GetHistory(key);
            var summaries = entries.Select((e, i) => new ScanHistorySummary
            {
                Index          = i,
                ScannedAt      = e.ScannedAt,
                Score          = e.Score,
                Grade          = e.Grade,
                ViolationCount = e.ViolationCount,
                CriticalCount  = e.CriticalCount,
                SeriousCount   = e.SeriousCount,
                ModerateCount  = e.ModerateCount,
                MinorCount     = e.MinorCount,
                PassingCount   = e.PassingCount,
                HasResult      = e.Result is not null,
            });
            return Ok(summaries);
        }

        [HttpGet("audit/history/{key:guid}/{index:int}")]
        [ProducesResponseType<AuditResult>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetHistoryEntry(Guid key, int index)
        {
            var entry = _historyService.GetEntry(key, index);
            if (entry?.Result is null)
                return NotFound(new { error = "History entry not found." });
            return Ok(entry.Result);
        }

        [HttpDelete("audit/history/{key:guid}/{index:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteHistoryEntry(Guid key, int index)
        {
            return _historyService.DeleteEntry(key, index)
                ? NoContent()
                : NotFound(new { error = "History entry not found." });
        }

        [HttpDelete("audit/history/{key:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult ClearHistory(Guid key)
        {
            _historyService.ClearHistory(key);
            return NoContent();
        }

        [HttpGet("audit/tree/{key:guid}")]
        [ProducesResponseType<SiteAuditResult>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> AuditTree(Guid key, CancellationToken ct)
        {
            if (!_scanLock.TryAcquireTree(key))
                return Conflict(new { error = "A site-wide audit is already in progress for this root node. Please wait and try again shortly." });

            try
            {
            var root = await _cacheManager.Content.GetByIdAsync(key, preview: false);
            if (root is null)
                return NotFound(new { error = "Content not found or not published." });

            var nodes = root.DescendantsOrSelf()
                .Where(n => !_settings.ExcludedContentKeys.Contains(n.Key)
                         && !_settings.ExcludedDocumentTypes.Contains(n.ContentType.Alias, StringComparer.OrdinalIgnoreCase))
                .ToList();

            // Build icon lookup from content type service (alias → icon string)
            var iconLookup = nodes
                .Select(n => n.ContentType.Alias)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToDictionary(
                    alias => alias,
                    alias => _contentTypeService.Get(alias)?.Icon ?? "icon-document",
                    StringComparer.OrdinalIgnoreCase);

            int rootLevel = root.Level;

            var summaries = new List<PageAuditSummary>();
            var urlsToScan = new List<(IPublishedContent Node, string Url)>();

            foreach (var node in nodes)
            {
                var url = _urlProvider.GetUrl(node, UrlMode.Absolute);
                if (string.IsNullOrWhiteSpace(url) || url == "#")
                {
                    summaries.Add(new PageAuditSummary
                    {
                        Key              = node.Key,
                        Name             = node.Name,
                        Skipped          = true,
                        SkipReason       = "No published URL",
                        Depth            = node.Level - rootLevel,
                        ContentTypeAlias = node.ContentType.Alias,
                        ContentTypeIcon  = iconLookup.GetValueOrDefault(node.ContentType.Alias, "icon-document"),
                    });
                }
                else
                {
                    urlsToScan.Add((node, url));
                }
            }

            var auditResults = await _axeService.ScanUrlsAsync(urlsToScan.Select(x => x.Url), ct);

            for (int i = 0; i < urlsToScan.Count; i++)
            {
                var (node, url) = urlsToScan[i];
                var result = auditResults[i];

                if (result.FetchError is not null)
                {
                    summaries.Add(new PageAuditSummary
                    {
                        Key              = node.Key,
                        Name             = node.Name,
                        Url              = url,
                        Skipped          = true,
                        SkipReason       = result.FetchError,
                        Depth            = node.Level - rootLevel,
                        ContentTypeAlias = node.ContentType.Alias,
                        ContentTypeIcon  = iconLookup.GetValueOrDefault(node.ContentType.Alias, "icon-document"),
                    });
                }
                else
                {
                    summaries.Add(new PageAuditSummary
                    {
                        Key              = node.Key,
                        Name             = node.Name,
                        Url              = url,
                        Score            = result.Score,
                        Grade            = result.Grade,
                        ViolationCount   = result.Summary.TotalViolations,
                        CriticalCount    = result.Summary.Critical,
                        SeriousCount     = result.Summary.Serious,
                        ModerateCount    = result.Summary.Moderate,
                        MinorCount       = result.Summary.Minor,
                        PassingCount     = result.Summary.Passes,
                        Depth            = node.Level - rootLevel,
                        ContentTypeAlias = node.ContentType.Alias,
                        ContentTypeIcon  = iconLookup.GetValueOrDefault(node.ContentType.Alias, "icon-document"),
                    });
                    _historyService.Record(node.Key, result);
                }
            }

            var scanned = summaries.Where(s => !s.Skipped).ToList();
            var siteResult = new SiteAuditResult
            {
                TotalPages      = summaries.Count,
                ScannedPages    = scanned.Count,
                SkippedPages    = summaries.Count(s => s.Skipped),
                AverageScore    = scanned.Count > 0 ? Math.Round(scanned.Average(s => s.Score), 1) : 0,
                TotalViolations = scanned.Sum(s => s.ViolationCount),
                TotalCritical   = scanned.Sum(s => s.CriticalCount),
                TotalSerious    = scanned.Sum(s => s.SeriousCount),
                TotalModerate   = scanned.Sum(s => s.ModerateCount),
                TotalMinor      = scanned.Sum(s => s.MinorCount),
                TotalPasses     = scanned.Sum(s => s.PassingCount),
                Pages           = summaries,
            };

            _siteHistoryService.Record(key, root.Name ?? key.ToString(), siteResult);

            return Ok(siteResult);
            }
            finally
            {
                _scanLock.ReleaseTree(key);
            }
        }

        // ── Site audit history ──────────────────────────────────────────────

        [HttpGet("audit/site-history/{key:guid}")]
        [ProducesResponseType<IReadOnlyList<SiteAuditHistorySummary>>(StatusCodes.Status200OK)]
        public IActionResult GetSiteHistory(Guid key)
        {
            var entries = _siteHistoryService.GetHistory(key);
            var summaries = entries.Select((e, i) => new SiteAuditHistorySummary
            {
                Index           = i,
                ScannedAt       = e.ScannedAt,
                RootName        = e.RootName,
                TotalPages      = e.TotalPages,
                ScannedPages    = e.ScannedPages,
                SkippedPages    = e.SkippedPages,
                AverageScore    = e.AverageScore,
                TotalViolations = e.TotalViolations,
                TotalCritical   = e.TotalCritical,
                TotalSerious    = e.TotalSerious,
                TotalModerate   = e.TotalModerate,
                TotalMinor      = e.TotalMinor,
                TotalPasses     = e.TotalPasses,
                HasResult       = e.Result is not null,
            });
            return Ok(summaries);
        }

        [HttpGet("audit/site-history/{key:guid}/{index:int}")]
        [ProducesResponseType<SiteAuditResult>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetSiteHistoryEntry(Guid key, int index)
        {
            var entry = _siteHistoryService.GetEntry(key, index);
            if (entry?.Result is null)
                return NotFound(new { error = "Site audit history entry not found." });
            return Ok(entry.Result);
        }

        [HttpDelete("audit/site-history/{key:guid}/{index:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteSiteHistoryEntry(Guid key, int index)
        {
            return _siteHistoryService.DeleteEntry(key, index)
                ? NoContent()
                : NotFound(new { error = "Site audit history entry not found." });
        }

        [HttpDelete("audit/site-history/{key:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult ClearSiteHistory(Guid key)
        {
            _siteHistoryService.ClearHistory(key);
            return NoContent();
        }
    }
}
