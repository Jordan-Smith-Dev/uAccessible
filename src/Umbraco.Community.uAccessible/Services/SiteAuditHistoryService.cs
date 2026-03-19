using System.Collections.Concurrent;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using Umbraco.Community.uAccessible.Models;

namespace Umbraco.Community.uAccessible.Services
{
    /// <summary>
    /// Persists site-wide audit results per root content key, shared across all editors.
    /// Stored in App_Data/uAccessible/site-audit-history.json.
    /// </summary>
    public class SiteAuditHistoryService
    {
        private const int MaxEntriesPerKey = 20;
        private static readonly TimeSpan MaxAge = TimeSpan.FromDays(365);
        private static readonly JsonSerializerOptions JsonOptions = new() { WriteIndented = true };

        private readonly ILogger<SiteAuditHistoryService> _logger;
        private readonly string _historyFilePath;
        private readonly ConcurrentDictionary<Guid, List<SiteAuditHistoryEntry>> _history = new();
        private readonly SemaphoreSlim _saveLock = new(1, 1);
        private bool _loaded;

        public SiteAuditHistoryService(IWebHostEnvironment env, ILogger<SiteAuditHistoryService> logger)
        {
            _logger = logger;
            var dir = Path.Combine(env.ContentRootPath, "App_Data", "uAccessible");
            Directory.CreateDirectory(dir);
            _historyFilePath = Path.Combine(dir, "site-audit-history.json");
        }

        public void Record(Guid rootKey, string rootName, SiteAuditResult result)
        {
            EnsureLoaded();
            var entry = new SiteAuditHistoryEntry
            {
                ScannedAt       = DateTime.UtcNow,
                RootName        = rootName,
                TotalPages      = result.TotalPages,
                ScannedPages    = result.ScannedPages,
                SkippedPages    = result.SkippedPages,
                AverageScore    = result.AverageScore,
                TotalViolations = result.TotalViolations,
                TotalCritical   = result.TotalCritical,
                TotalSerious    = result.TotalSerious,
                TotalModerate   = result.TotalModerate,
                TotalMinor      = result.TotalMinor,
                TotalPasses     = result.TotalPasses,
                Result          = result,
            };

            _history.AddOrUpdate(
                rootKey,
                _ => [entry],
                (_, existing) =>
                {
                    existing.Insert(0, entry);
                    if (existing.Count > MaxEntriesPerKey)
                        existing.RemoveRange(MaxEntriesPerKey, existing.Count - MaxEntriesPerKey);
                    return existing;
                });

            _ = SaveAsync();
        }

        public IReadOnlyList<SiteAuditHistoryEntry> GetHistory(Guid rootKey)
        {
            EnsureLoaded();
            return _history.TryGetValue(rootKey, out var list)
                ? list.AsReadOnly()
                : [];
        }

        public SiteAuditHistoryEntry? GetEntry(Guid rootKey, int index)
        {
            EnsureLoaded();
            if (!_history.TryGetValue(rootKey, out var list)) return null;
            return index >= 0 && index < list.Count ? list[index] : null;
        }

        public bool DeleteEntry(Guid rootKey, int index)
        {
            EnsureLoaded();
            if (!_history.TryGetValue(rootKey, out var list)) return false;
            if (index < 0 || index >= list.Count) return false;
            list.RemoveAt(index);
            _ = SaveAsync();
            return true;
        }

        public void ClearHistory(Guid rootKey)
        {
            EnsureLoaded();
            _history.TryRemove(rootKey, out _);
            _ = SaveAsync();
        }

        private void EnsureLoaded()
        {
            if (_loaded) return;
            _loaded = true;
            try
            {
                if (!File.Exists(_historyFilePath)) return;
                var json = File.ReadAllText(_historyFilePath);
                var dict = JsonSerializer.Deserialize<Dictionary<Guid, List<SiteAuditHistoryEntry>>>(json, JsonOptions);
                if (dict is null) return;
                var cutoff = DateTime.UtcNow - MaxAge;
                foreach (var (key, value) in dict)
                {
                    var fresh = value.Where(e => e.ScannedAt >= cutoff).ToList();
                    if (fresh.Count > 0) _history[key] = fresh;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "uAccessible: could not load site audit history from {Path}", _historyFilePath);
            }
        }

        private async Task SaveAsync()
        {
            await _saveLock.WaitAsync();
            try
            {
                var dict = new Dictionary<Guid, List<SiteAuditHistoryEntry>>(_history);
                var json = JsonSerializer.Serialize(dict, JsonOptions);
                await File.WriteAllTextAsync(_historyFilePath, json);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "uAccessible: could not save site audit history to {Path}", _historyFilePath);
            }
            finally
            {
                _saveLock.Release();
            }
        }
    }
}
