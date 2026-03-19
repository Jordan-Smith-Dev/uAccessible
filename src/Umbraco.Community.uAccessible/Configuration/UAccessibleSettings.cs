namespace Umbraco.Community.uAccessible.Configuration
{
    public class UAccessibleSettings
    {
        public const string SectionName = "uAccessible";

        /// <summary>Document type aliases to exclude from site-wide scans.</summary>
        public string[] ExcludedDocumentTypes { get; set; } = [];

        /// <summary>Content node keys (GUIDs) to exclude from site-wide scans.</summary>
        public Guid[] ExcludedContentKeys { get; set; } = [];
    }
}
