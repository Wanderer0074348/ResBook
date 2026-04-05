# ResBook

A markdown-driven directory for AI tools, agentic workflows, and developer tips. Built with Next.js, React, and Tailwind CSS 4.0.

## Features

- **Markdown-driven content**: All content is stored as `.mdx` files in `/content`
- **MDX Components**: Extensible React components for enhanced Markdown:
  - `<Verdict>`: Display whether a tool is worth using with pricing info
  - `<WorkflowStep>`: Create step-by-step workflow guides
  - `<PromptBlock>`: Display AI prompts with agent labels
  - `<ToolLink>`: Internal links to other tools
- **Static Site Generation**: Pre-rendered pages for optimal performance
- **Search**: Client-side search across tools and workflows
- **Monospace Typography**: Terminal-inspired aesthetic with strict grayscale
- **Dark Mode**: Full dark mode support

## Quick Start

```bash
cd resbook
bun install
bun run dev
```

Open http://localhost:3000

## Adding Content

### New Tool (content/tools/my-tool.mdx)

```mdx
---
title: Tool Name
slug: my-tool
description: Brief description
category: LLM | Agent | IDE | CLI
pricing: Free | Freemium | Paid
worthIt: true
dateAdded: 2025-02-20
---

<Verdict isWorthIt={true} cost="free" />

## Overview
Content here...
```

### New Workflow (content/workflows/my-workflow.mdx)

```mdx
---
title: Workflow Name
slug: my-workflow
description: Description
author: Your Name
complexity: Beginner | Intermediate | Advanced
toolsUsed: [tool-slug-1]
dateAdded: 2025-02-20
---

<WorkflowStep step={1} title="Step One">
Content for step 1
</WorkflowStep>
```

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4.0
- MDX (next-mdx-remote)
- TypeScript

## Structure

```
resbook/
├── app/                    # Routes
├── components/             # React components
│   ├── layout/            # Navbar, Footer, Container
│   └── mdx/               # Verdict, WorkflowStep, etc.
├── content/               # Markdown files
│   ├── tools/
│   └── workflows/
└── lib/                   # Utilities and types
```

## Build & Deploy

```bash
bun run build      # Production build
bun start          # Run production
```

## Content Validation

Before publishing or opening a PR, run:

```bash
npm run validate:content
npm run lint
npm run build
```

See `CONTRIBUTING.md` for templates, rules, and review guidelines.

Deploy to Vercel, Netlify, or any static host.

---

**Terminal-inspired, markdown-powered AI tools & workflows directory.**
