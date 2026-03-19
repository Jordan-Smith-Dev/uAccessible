namespace Umbraco.Community.uAccessible.Models
{
    public class AuditResult
    {
        public string? Url { get; set; }
        public bool Published { get; set; }
        public string? FetchError { get; set; }
        public string Grade { get; set; } = "?";
        public int Score { get; set; }
        public AuditSummary Summary { get; set; } = new();
        public List<ViolationDetail> Violations { get; set; } = [];
        public List<ViolationDetail> Incomplete { get; set; } = [];
        public List<ViolationDetail> PassingChecks { get; set; } = [];
    }

    public class AuditSummary
    {
        public int Critical { get; set; }
        public int Serious { get; set; }
        public int Moderate { get; set; }
        public int Minor { get; set; }
        public int TotalViolations { get; set; }
        public int Passes { get; set; }
        public int IncompleteCount { get; set; }
    }

    public class ViolationDetail
    {
        public string Id { get; set; } = "";
        public string? Impact { get; set; }
        public string Description { get; set; } = "";
        public string Help { get; set; } = "";
        public string HelpUrl { get; set; } = "";
        public string[] Tags { get; set; } = [];
        public string? WcagLevel { get; set; }
        public ViolationNode[] Nodes { get; set; } = [];
    }

    public class ViolationNode
    {
        public string Html { get; set; } = "";
        public string Target { get; set; } = "";
        public string FailureSummary { get; set; } = "";
    }
}
