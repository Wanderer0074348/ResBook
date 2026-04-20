# Contributing to ResBook

Welcome! This guide covers how to contribute to ResBook.

##Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/ResBook.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feat/your-feature`

## Development

```bash
# Development server
npm run dev

# Build
npm run build

# Lint
npm run lint

# Validate content
npm run validate:content
```

## Adding Content

### Tools
Add new tools in `content/tools/`:
```markdown
---
title: Tool Name
slug: tool-slug
category: LLM
pricing: Free
worthIt: true
dateAdded: 2026-04-19
---

Your review content here...
```

### Workflows
Add workflows in `content/workflows/`:
```markdown
---
title: Workflow Name
slug: workflow-slug
author: Your Name
complexity: Intermediate
toolsUsed: [tool-slug]
---

## Steps

<WorkflowStep title="Step 1">

## Prompts

<PromptBlock>
Your prompt here...
</PromptBlock>
```

## Pull Request Guidelines

- Keep PRs small and focused
- Run `npm run lint` and `npm run build` before submitting
- Update content frontmatter fields
- Add descriptive commit messages

## Code Review

- All PRs require 1 approval
- CI must pass
- Build must succeed

## Recognition

Contributors will be acknowledged in the README.