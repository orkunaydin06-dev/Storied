---
name: figma-design-review
description: "Reviews a Figma design using node info and posts individual comments at the exact locations. Use when (1) user asks to review a Figma design (2) engineer-perspective feedback is needed (3) user wants comments posted directly on the Figma canvas. Checks padding/margin consistency, color contrast, grid alignment. Requires Figma MCP connection and FIGMA_TOKEN environment variable."
---

# Figma Design Review

Reviews Figma designs using node data (padding, color, size etc.) and posts individual comments at precise locations on the canvas.

## Prerequisites

1. **Figma MCP**: `mcp__figma__*` tools must be available
2. **FIGMA_TOKEN**: must be set as env var or in `~/.claude/settings.json` under `env.FIGMA_TOKEN`
3. **Figma Desktop App**: target file must be open in the Figma desktop app

## Arguments

- `figma_url` (required): URL in format `https://figma.com/design/{FILE_KEY}/{name}?node-id={NODE_ID}`

## Workflow

### Step 0: Prerequisites Check

1. Verify `figma_url` was provided
2. Check FIGMA_TOKEN: `test -n "$FIGMA_TOKEN" && echo "set" || echo "not set"`
3. Confirm Figma Desktop app is open with the target file
4. Test MCP connection with `get_screenshot(nodeId="{NODE_ID}")`

### Step 1: Parse URL and Fetch Design Info

Extract FILE_KEY and NODE_ID from URL:
- `https://figma.com/design/{FILE_KEY}/{name}?node-id=1-2` → NODE_ID: `1:2` (replace `-` with `:`)

Then:
1. `get_screenshot(nodeId="{NODE_ID}")`
2. `get_design_context(nodeId="{NODE_ID}")`
3. Fetch REST API node info:
```bash
python3 .claude/skills/figma-design-review/scripts/get_node_info.py <file_key> <node_id> --detail
```

### Step 2: Review

**Phase A — Basic design (from node data):**
1. Spacing — padding/margin consistency, 4px/8px grid alignment
2. Color — too many colors, contrast ratios
3. Size — same-role elements have consistent sizing
4. Structure — Auto Layout usage, nesting depth

**Phase B — Engineer perspective (screenshot + node data):**
1. Data structure / state complexity
2. Tables/lists — scroll, fixed headers, performance
3. Forms / inputs — validation, error display
4. UI consistency — color meaning, format unification
5. Permissions / security — edit access, audit logs
6. Spec questions — ambiguous cases, edge cases

### Step 3: Post Comments

Post a separate comment at each problem location:

```bash
python3 .claude/skills/figma-design-review/scripts/post_comment.py <file_key> <node_id> <x> <y> "<comment>"
```

**Coordinates:** Use x/y from `get_node_info.py` output (already relative to root node). Place comment at element center:
```
center_x = x + (width / 2)
center_y = y + (height / 2)
```

**Comment format:** `【Category】One-line problem + suggestion`

Examples:
```bash
python3 .../post_comment.py ABC123 1:197 354 870 "【Spacing】padding 24/16/20px mixed → unify to 16px"
python3 .../post_comment.py ABC123 1:197 200 100 "【Color】bg #f0f0f0 + text #888 contrast ratio 2.5:1 → needs 4.5:1"
```

### Step 4: Report Summary

```markdown
## Review Complete

| # | Category | Issue |
|---|----------|-------|
| 1 | Spacing | padding 24/16/20px mixed → unify to 16px |
| 2 | Color | 12 background colors → unify to design system |
```

## Troubleshooting

**get_design_context fails:** Usually too many nodes. Select a smaller child element in Figma and use its node-id. REST API scripts still work independently of MCP.

**FIGMA_TOKEN not set:** Add to `~/.claude/settings.json`:
```json
{ "env": { "FIGMA_TOKEN": "figd_..." } }
```
