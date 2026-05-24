---
name: figma-implement-design
description: Translates Figma designs into production-ready application code with 1:1 visual fidelity. Use when implementing UI code from Figma files, when user mentions "implement design", "generate code", "implement component", provides Figma URLs, or asks to build components matching Figma specs. For Figma canvas writes via `use_figma`, use `figma-use`.
---

# Implement Design

## Overview

This skill provides a structured workflow for translating Figma designs into production-ready code with pixel-perfect accuracy. It ensures consistent integration with the Figma MCP server, proper use of design tokens, and 1:1 visual parity with designs.

## Skill Boundaries

- Use this skill when the deliverable is code in the user's repository.
- If the user asks to create/edit/delete nodes inside Figma itself, switch to figma-use.
- If the user asks to build or update a full-page screen in Figma from code or a description, switch to figma-generate-design.

## Prerequisites

- Figma MCP server must be connected and accessible
- User must provide a Figma URL in the format: `https://figma.com/design/:fileKey/:fileName?node-id=1-2`
  - `:fileKey` is the file key
  - `1-2` is the node ID (the specific component or frame to implement)

## Required Workflow

**Follow these steps in order. Do not skip steps.**

### Step 1: Get Node ID

Parse from Figma URL:
- URL format: `https://figma.com/design/:fileKey/:fileName?node-id=1-2`
- Extract file key: segment after `/design/`
- Extract node ID: value of `node-id` query param

### Step 2: Fetch Design Context

```
get_design_context(fileKey=":fileKey", nodeId="1-2")
```

**If the response is too large or truncated:**
1. Run `get_metadata(fileKey=":fileKey", nodeId="1-2")` to get the high-level node map
2. Identify specific child nodes needed
3. Fetch individual child nodes with `get_design_context`

### Step 3: Capture Visual Reference

```
get_screenshot(fileKey=":fileKey", nodeId="1-2")
```

This screenshot is the source of truth for visual validation.

### Step 4: Download Required Assets

- If Figma MCP returns a `localhost` source for an image or SVG, use that source directly
- DO NOT import or add new icon packages
- DO NOT create placeholders if a `localhost` source is provided

### Step 5: Translate to Project Conventions

- Treat Figma MCP output (typically React + Tailwind) as a design representation, not final code
- Replace Tailwind utility classes with the project's preferred system (Storied uses CSS variables + Tailwind)
- Reuse existing components (Button, etc.) instead of duplicating
- Use the project's color tokens: `text-fg-primary`, `text-accent-warm`, `bg-bg-primary`, etc.
- Use the project's font classes: `font-serif`, `font-mono`, `font-sans`

### Step 6: Achieve 1:1 Visual Parity

- Prioritize Figma fidelity
- Avoid hardcoded values — use design tokens
- Follow WCAG accessibility requirements

### Step 7: Validate Against Figma

- [ ] Layout matches (spacing, alignment, sizing)
- [ ] Typography matches (font, size, weight, line height)
- [ ] Colors match exactly
- [ ] Interactive states work (hover, active, disabled)
- [ ] Responsive behavior follows Figma constraints
- [ ] Assets render correctly
- [ ] Accessibility standards met

## Implementation Rules

- Place UI components in `components/` following existing naming conventions
- ALWAYS use existing Storied components when possible
- Map Figma design tokens to Storied's CSS variable system
- Add TypeScript types for component props

## Common Issues

**Figma output truncated:** Use `get_metadata` first, then fetch specific child nodes individually.

**Design doesn't match after implementation:** Compare side-by-side with Step 3 screenshot. Check spacing, colors, typography in design context data.
