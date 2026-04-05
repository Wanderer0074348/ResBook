# Contributing to ResBook

Thanks for helping improve ResBook.

## Quick Workflow

1. Add or update MDX files in `content/tools` or `content/workflows`.
2. Run content checks:

```bash
npm run validate:content
npm run lint
npm run build
```

3. Commit and open a PR.

## Tool Entry Template

Create `content/tools/your-tool-slug.mdx`:

```mdx
---
title: Tool Name
slug: your-tool-slug
description: One-line practical summary.
category: LLM
pricing: Free
worthIt: true
dateAdded: 2026-04-05
---

<Verdict isWorthIt={true} cost="free" />

## Overview
What the tool does and where it helps.

## Best For
Who should use it and in what scenario.

## Strengths
- Point 1
- Point 2

## Limitations
- Limitation 1
- Limitation 2

## Final Verdict
Clear recommendation and when to skip.
```

## Workflow Entry Template

Create `content/workflows/your-workflow-slug.mdx`:

```mdx
---
title: Workflow Name
slug: your-workflow-slug
description: One-line expected outcome.
author: Your Name
complexity: Intermediate
toolsUsed: [tool-slug-1, tool-slug-2]
dateAdded: 2026-04-05
---

## Goal
What this workflow produces.

## Prerequisites
- Required accounts/tools
- Baseline skills

<WorkflowStep step={1} title="Set Up">
Explain setup action.
</WorkflowStep>

<WorkflowStep step={2} title="Execute">
Main action and key prompt.
</WorkflowStep>

## Expected Output
How to verify success.
```

## Validation Rules

- Frontmatter fields are required.
- Slug must match filename.
- Slugs must be unique per section.
- Enum values must match allowed options:
  - Tool category: `LLM`, `Agent`, `IDE`, `CLI`
  - Tool pricing: `Free`, `Freemium`, `Paid`
  - Workflow complexity: `Beginner`, `Intermediate`, `Advanced`

## Review Quality Guidelines

- Keep reviews practical, not hype-heavy.
- Include both pros and limitations.
- Mention cost-value tradeoffs.
- Write for broad audiences: beginners to power users.
