using System.Collections.Concurrent;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using Umbraco.Community.uAccessible.Models;

namespace Umbraco.Community.uAccessible.Services
{
    public class ScanHistoryService
    {
        /// <summary>Hard safety cap per content key — prevents runaway growth on frequently-scanned pages.</summary>
        private const int MaxEntriesPerKey = 500;
        private static readonly TimeSpan MaxAge = TimeSpan.FromDays(365);
        private static readonly JsonSerializerOptions JsonOptions = new() { WriteIndented = true };

        private readonly ILogger<ScanHistoryService> _logger;
        private readonly string _historyFilePath;
        private readonly ConcurrentDictionary<Guid, List<ScanHistoryEntry>> _history = new();
        private readonly SemaphoreSlim _saveLock = new(1, 1);
        private bool _loaded;

        public ScanHistoryService(IWebHostEnvironment env, ILogger<ScanHistoryService> logger)
        {
            _logger = logger;
            var dir = Path.Combine(env.ContentRootPath, "App_Data", "uAccessible");
            Directory.CreateDirectory(dir);
            _historyFilePath = Path.Combine(dir, "scan-history.json");
        }

        public void Record(Guid contentKey, AuditResult result)
        {
            EnsureLoaded();
            var entry = new ScanHistoryEntry
            {
                ScannedAt      = DateTime.UtcNow,
                Score          = result.Score,
                Grade          = result.Grade,
                ViolationCount = result.Summary.TotalViolations,
                CriticalCount  = result.Summary.Critical,
                SeriousCount   = result.Summary.Serious,
                ModerateCount  = result.Summary.Moderate,
                MinorCount     = result.Summary.Minor,
                PassingCount   = result.Summary.Passes,
                Result         = result,
            };

            _history.AddOrUpdate(
                contentKey,
                _ => [entry],
                (_, existing) =>
                {
                    existing.Insert(0, entry);
                    // Safety cap — trim the oldest beyond MaxEntriesPerKey
                    if (existing.Count > MaxEntriesPerKey)
                        existing.RemoveRange(MaxEntriesPerKey, existing.Count - MaxEntriesPerKey);
                    return existing;
                });

            _ = SaveAsync();
        }

        public IReadOnlyList<ScanHistoryEntry> GetHistory(Guid contentKey)
        {
            EnsureLoaded();
            return _history.TryGetValue(contentKey, out var list)
                ? list.AsReadOnly()
                : [];
        }

        public ScanHistoryEntry? GetEntry(Guid contentKey, int index)
        {
            EnsureLoaded();
            if (!_history.TryGetValue(contentKey, out var list)) return null;
            return index >= 0 && index < list.Count ? list[index] : null;
        }

        public bool DeleteEntry(Guid contentKey, int index)
        {
            EnsureLoaded();
            if (!_history.TryGetValue(contentKey, out var list)) return false;
            if (index < 0 || index >= list.Count) return false;
            list.RemoveAt(index);
            _ = SaveAsync();
            return true;
        }

        public void ClearHistory(Guid contentKey)
        {
            EnsureLoaded();
            _history.TryRemove(contentKey, out _);
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
                var dict = JsonSerializer.Deserialize<Dictionary<Guid, List<ScanHistoryEntry>>>(json, JsonOptions);
                if (dict is null) return;
                var cutoff = DateTime.UtcNow - MaxAge;
                foreach (var (key, value) in dict)
                {
                    // Purge entries older than 1 year on load
                    var fresh = value.Where(e => e.ScannedAt >= cutoff).ToList();
                    if (fresh.Count > 0) _history[key] = fresh;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "uAccessible: could not load scan history from {Path}", _historyFilePath);
            }
        }

        private async Task SaveAsync()
        {
            await _saveLock.WaitAsync();
            try
            {
                var dict = new Dictionary<Guid, List<ScanHistoryEntry>>(_history);
                var json = JsonSerializer.Serialize(dict, JsonOptions);
                await File.WriteAllTextAsync(_historyFilePath, json);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "uAccessible: could not save scan history to {Path}", _historyFilePath);
            }
            finally
            {
                _saveLock.Release();
            }
        }
    }
}
