using Microsoft.Extensions.Logging;
using Deque.AxeCore.Commons;
using Deque.AxeCore.Playwright;
using Microsoft.Playwright;
using Umbraco.Community.uAccessible.Models;

namespace Umbraco.Community.uAccessible.Services
{
    public class AxeScanService
    {
        private readonly ILogger<AxeScanService> _logger;

        public AxeScanService(ILogger<AxeScanService> logger)
        {
            _logger = logger;
        }

        public async Task<AuditResult> ScanUrlAsync(string url, CancellationToken ct = default)
        {
            IPlaywright playwright;
            try
            {
                playwright = await Microsoft.Playwright.Playwright.CreateAsync();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "uAccessible: Playwright could not initialise. Run 'playwright install chromium'.");
                return new AuditResult
                {
                    Url        = url,
                    Published  = true,
                    FetchError = "Playwright could not initialise. Run 'pwsh playwright.ps1 install chromium' from the project's bin folder, then rebuild."
                };
            }

            IBrowser browser;
            try
            {
                browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
                {
                    Headless = true,
                });
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "uAccessible: Chromium could not launch. Run 'playwright install chromium'.");
                return new AuditResult
                {
                    Url        = url,
                    Published  = true,
                    FetchError = "Chromium is not installed. Run 'pwsh playwright.ps1 install chromium' from your project's bin folder.",
                };
            }

            await using var _ = browser;
            var page = await browser.NewPageAsync();

            try
            {
                var response = await page.GotoAsync(url, new PageGotoOptions
                {
                    WaitUntil = WaitUntilState.NetworkIdle,
                    Timeout   = 30_000,
                });

                if (response is null || !response.Ok)
                {
                    return new AuditResult
                    {
                        Url        = url,
                        Published  = true,
                        FetchError = $"Page returned HTTP {response?.Status ?? 0}. Ensure the page is publicly accessible."
                    };
                }
            }
            catch (TimeoutException)
            {
                return new AuditResult
                {
                    Url        = url,
                    Published  = true,
                    FetchError = "Page load timed out after 30 seconds."
                };
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "uAccessible: failed to load {Url}", url);
                return new AuditResult
                {
                    Url        = url,
                    Published  = true,
                    FetchError = $"Could not load the page: {ex.Message}"
                };
            }

            AxeResult axeResults;
            try
            {
                axeResults = await page.RunAxe();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "uAccessible: axe-core scan failed for {Url}", url);
                return new AuditResult
                {
                    Url        = url,
                    Published  = true,
                    FetchError = $"Accessibility scan failed: {ex.Message}"
                };
            }

            return BuildResult(url, axeResults);
        }

        private static AuditResult BuildResult(string url, AxeResult axeResults)
        {
            var violations     = axeResults.Violations.Select(MapViolation).ToList();
            var incomplete     = axeResults.Incomplete.Select(MapViolation).ToList();
            var passingChecks  = axeResults.Passes.Select(MapViolation).ToList();

            var summary = new AuditSummary
            {
                TotalViolations = violations.Count,
                Passes          = axeResults.Passes.Length,
                IncompleteCount = incomplete.Count,
                Critical  = violations.Count(v => v.Impact == "critical"),
                Serious   = violations.Count(v => v.Impact == "serious"),
                Moderate  = violations.Count(v => v.Impact == "moderate"),
                Minor     = violations.Count(v => v.Impact == "minor"),
            };

            int score = ComputeScore(violations);
            return new AuditResult
            {
                Url        = url,
                Published  = true,
                Grade      = ScoreToGrade(score),
                Score      = score,
                Summary    = summary,
                Violations    = violations,
                Incomplete    = incomplete,
                PassingChecks = passingChecks,
            };
        }

        private static ViolationDetail MapViolation(AxeResultItem item) => new()
        {
            Id          = item.Id,
            Impact      = item.Impact,
            Description = item.Description,
            Help        = item.Help,
            HelpUrl     = item.HelpUrl,
            Tags        = item.Tags,
            Nodes       = item.Nodes.Select(n => new ViolationNode
            {
                Html           = n.Html,
                Target         = n.Target.ToString() ?? "",
                // FailureSummary removed in v4 — derive from Any/All/None check messages
                FailureSummary = string.Join("; ",
                    n.Any.Concat(n.All).Concat(n.None)
                        .Where(c => !string.IsNullOrWhiteSpace(c.Message))
                        .Select(c => c.Message)),
            }).ToArray(),
        };

        private static int ComputeScore(IList<ViolationDetail> violations)
        {
            var impactOrder = new[] { "critical", "serious", "moderate", "minor" };
            var worstPerRule = violations
                .GroupBy(v => v.Id)
                .Select(g => g.OrderBy(v => Array.IndexOf(impactOrder, v.Impact ?? "minor")).First().Impact ?? "minor");

            int penalty = 0;
            foreach (var impact in worstPerRule)
            {
                penalty += impact switch
                {
                    "critical" => 15,
                    "serious"  => 8,
                    "moderate" => 3,
                    "minor"    => 1,
                    _          => 0,
                };
            }

            return Math.Max(0, 100 - penalty);
        }

        private static string ScoreToGrade(int score) => score switch
        {
            >= 95 => "A",
            >= 80 => "B",
            >= 65 => "C",
            >= 50 => "D",
            _     => "F",
        };
    }
}
