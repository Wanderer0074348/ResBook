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
    `- Compare tools: ${siteUrl}/compare`,
    `- Collections: ${siteUrl}/collections`,
    `- Workflows index: ${siteUrl}/workflows`,
    `- Dotfiles index: ${siteUrl}/dotfiles`,
    `- Resources: ${siteUrl}/resources`,
    "",
    "## Content Notes",
    "- Tool pages include practical verdicts, strengths, and limitations.",
    "- Compare page supports side-by-side selection of up to four tools.",
    "- Collections page stores personal saved stacks in local browser storage.",
    "- Workflow pages are step-wise and implementation-oriented.",
    "- Dotfiles package reusable prompts, configs, and structure templates.",
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
