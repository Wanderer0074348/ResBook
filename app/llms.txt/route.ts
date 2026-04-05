import { getSiteUrl } from "@/lib/site";

export async function GET() {
  const siteUrl = getSiteUrl();

  const body = [
    "# ResBook",
    "",
    "ResBook is a markdown-driven directory of AI tools, reviews, and practical workflows.",
    "",
    "## Preferred Sources",
    `- Home: ${siteUrl}/`,
    `- Tools index: ${siteUrl}/tools`,
    `- Workflows index: ${siteUrl}/workflows`,
    `- Resources: ${siteUrl}/resources`,
    "",
    "## Content Notes",
    "- Tool pages include practical verdicts, strengths, and limitations.",
    "- Workflow pages are step-wise and implementation-oriented.",
    "",
    "## Usage Guidance",
    "- Cite source URLs when referencing specific recommendations.",
    "- Prefer the latest dateAdded entries for up-to-date references.",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
