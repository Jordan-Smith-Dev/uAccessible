namespace Umbraco.Community.uAccessible.Models
{
    public class SiteAuditHistorySummary
    {
        public int Index { get; set; }
        public DateTime ScannedAt { get; set; }
        public string RootName { get; set; } = "";
        public int TotalPages { get; set; }
        public int ScannedPages { get; set; }
        public int SkippedPages { get; set; }
        public double AverageScore { get; set; }
        public int TotalViolations { get; set; }
        public int TotalCritical { get; set; }
        public int TotalSerious { get; set; }
        public int TotalModerate { get; set; }
        public int TotalMinor { get; set; }
        public int TotalPasses { get; set; }
        /// <summary>False for legacy entries recorded before full result storage was added.</summary>
        public bool HasResult { get; set; }
    }

    public class SiteAuditHistoryEntry
    {
        public DateTime ScannedAt { get; set; }
        public string RootName { get; set; } = "";
        public int TotalPages { get; set; }
        public int ScannedPages { get; set; }
        public int SkippedPages { get; set; }
        public double AverageScore { get; set; }
        public int TotalViolations { get; set; }
        public int TotalCritical { get; set; }
        public int TotalSerious { get; set; }
        public int TotalModerate { get; set; }
        public int TotalMinor { get; set; }
        public int TotalPasses { get; set; }
        public SiteAuditResult? Result { get; set; }
    }

    public class PageAuditSummary
    {
        public Guid Key { get; set; }
        public string? Name { get; set; }
        public string? Url { get; set; }
        public int Score { get; set; }
        public string Grade { get; set; } = "";
        public int ViolationCount { get; set; }
        public int CriticalCount { get; set; }
        public int SeriousCount { get; set; }
        public int PassingCount { get; set; }
        public bool Skipped { get; set; }
        public string? SkipReason { get; set; }
        public int Depth { get; set; }
        public int ModerateCount { get; set; }
        public int MinorCount { get; set; }
        public string ContentTypeAlias { get; set; } = "";
        public string ContentTypeIcon { get; set; } = "icon-document";
    }

    public class SiteAuditResult
    {
        public int TotalPages { get; set; }
        public int ScannedPages { get; set; }
        public int SkippedPages { get; set; }
        public double AverageScore { get; set; }
        public int TotalViolations { get; set; }
        public int TotalCritical { get; set; }
        public int TotalSerious { get; set; }
        public int TotalModerate { get; set; }
        public int TotalMinor { get; set; }
        public int TotalPasses { get; set; }
        public List<PageAuditSummary> Pages { get; set; } = [];
    }
}
