# ResBook

The AI Ops Manual — A curated, opinionated directory of AI tools, executable workflows, and developer configurations. Built with Next.js, React, and Tailwind CSS.

## Features

### Core
- **Markdown-driven content**: All content stored as `.mdx` files in `/content`
- **MDX Components**: `<Verdict>`, `<WorkflowStep>`, `<PromptBlock>`, `<ToolLink>`, `<WorkflowGraph>`
- **Static Site Generation**: Pre-rendered pages for optimal performance
- **Search**: Client-side search across tools, workflows, and dotfiles
- **Dark Mode**: Full dark mode support

### New in v2.0

- **Workflow Runner**: Track workflow step completion with progress bar and localStorage persistence
- **AI Chat Assistant**: Ask natural language questions like "What tool for code review?"
- **Personal Stack Builder**: Save tools/workflows and export as Markdown, JSON, or Shell script
- **Analytics Dashboard**: View content statistics and breakdowns
- **Community Submissions**: Submit tools/workflows/dotfiles via GitHub issues
- **Content Status**: Draft, In-Review, Published, Deprecated statuses
- **Endorsements**: Community voting on tools

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## New Features

### Workflow Runner
Click "Run Workflow" on any workflow page to track your progress step-by-step. Progress is saved locally.

### AI Assistant
On the home page, ask: "What tool for web development?" or "How to build an MVP?"

### Personal Stack
Add tools and workflows to your personal stack, then export as:
- Markdown README
- JSON config
- Shell installation script

### Submit
Use `/submit` to contribute new tools, workflows, or dotfiles via GitHub issues.

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
status: published
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
status: published
---

<WorkflowStep step={1} title="Step One">
Content for step 1
</WorkflowStep>
```

## Tech Stack

- Next.js 15 (App Router)
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
│   ├── mdx/               # Verdict, WorkflowStep, etc.
│   ├── ai/                # AI Chat Assistant
│   ├── stack/             # Personal Stack Builder
│   └── workflows/         # Workflow Runner
├── content/               # Markdown files
│   ├── tools/
│   ├── workflows/
│   └── dotfiles/
└── lib/                   # Utilities and types
```

## Build & Deploy

```bash
npm run build      # Production build
npm start          # Run production
```

## Content Validation

Before publishing or opening a PR:

```bash
npm run validate:content
npm run lint
npm run build
```

See `CONTRIBUTING.md` for templates and review guidelines.

Deploy to Vercel, Netlify, or any static host.

---

**The AI Ops Manual — Curated tools, executable workflows, and your personal AI stack.**

## Testing bot

Added to verify manavarya-bot review flow.

retest 1776536045
retest2 1776536742
