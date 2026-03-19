namespace Umbraco.Community.uAccessible.Models
{
    /// <summary>Lightweight summary returned when listing history — no full result payload.</summary>
    public class ScanHistorySummary
    {
        public int Index { get; set; }
        public DateTime ScannedAt { get; set; }
        public int Score { get; set; }
        public string Grade { get; set; } = "";
        public int ViolationCount { get; set; }
        public int CriticalCount { get; set; }
        public int SeriousCount { get; set; }
        public int PassingCount { get; set; }
        public int ModerateCount { get; set; }
        public int MinorCount { get; set; }
        /// <summary>False for legacy entries recorded before full result storage was added.</summary>
        public bool HasResult { get; set; }
    }

    public class ScanHistoryEntry
    {
        public DateTime ScannedAt { get; set; }
        public int Score { get; set; }
        public string Grade { get; set; } = "";
        public int ViolationCount { get; set; }
        public int CriticalCount { get; set; }
        public int SeriousCount { get; set; }
        public int PassingCount { get; set; }
        public int ModerateCount { get; set; }
        public int MinorCount { get; set; }

        /// <summary>Full audit result snapshot — stored for historical report viewing.</summary>
        public AuditResult? Result { get; set; }
    }
}
