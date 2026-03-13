using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PublishedCache;
using Umbraco.Cms.Core.Routing;
using Umbraco.Community.uAccessible.Models;
using Umbraco.Community.uAccessible.Services;

namespace Umbraco.Community.uAccessible.Controllers
{
    [ApiVersion("1.0")]
    [ApiExplorerSettings(GroupName = "Umbraco.Community.uAccessible")]
    public class UmbracoCommunityuAccessibleApiController : UmbracoCommunityuAccessibleApiControllerBase
    {
        private readonly ICacheManager _cacheManager;
        private readonly IPublishedUrlProvider _urlProvider;
        private readonly AxeScanService _axeService;

        public UmbracoCommunityuAccessibleApiController(
            ICacheManager cacheManager,
            IPublishedUrlProvider urlProvider,
            AxeScanService axeService)
        {
            _cacheManager = cacheManager;
            _urlProvider  = urlProvider;
            _axeService   = axeService;
        }

        [HttpGet("audit/key/{key:guid}")]
        [ProducesResponseType<AuditResult>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AuditByKey(Guid key, CancellationToken ct)
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
            return Ok(result);
        }
    }
}
