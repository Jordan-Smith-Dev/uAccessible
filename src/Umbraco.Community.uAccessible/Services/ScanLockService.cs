using System.Collections.Concurrent;

namespace Umbraco.Community.uAccessible.Services
{
    /// <summary>
    /// Tracks in-progress scans so that concurrent requests from multiple editors
    /// are detected and rejected with a 409 Conflict instead of spinning up
    /// duplicate headless-browser sessions.
    /// </summary>
    public class ScanLockService
    {
        /// <summary>Maximum time a lock is held before it auto-expires (guards against crashes).</summary>
        private static readonly TimeSpan LockTimeout = TimeSpan.FromMinutes(10);

        private readonly ConcurrentDictionary<string, DateTimeOffset> _locks = new();

        public bool TryAcquirePage(Guid key) => TryAcquire($"page:{key}");
        public bool TryAcquireTree(Guid key) => TryAcquire($"tree:{key}");

        public void ReleasePage(Guid key) => Release($"page:{key}");
        public void ReleaseTree(Guid key) => Release($"tree:{key}");

        private bool TryAcquire(string lockKey)
        {
            var now = DateTimeOffset.UtcNow;
            // Expire stale locks left by a crashed request
            if (_locks.TryGetValue(lockKey, out var started) && now - started >= LockTimeout)
                _locks.TryRemove(lockKey, out _);

            return _locks.TryAdd(lockKey, now);
        }

        private void Release(string lockKey) => _locks.TryRemove(lockKey, out _);
    }
}
