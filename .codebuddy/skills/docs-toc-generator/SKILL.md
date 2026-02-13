---
name: docs-toc-generator
description: "自动扫描指定 docs 目录，读取所有文档的 frontmatter 和 _category_.json，生成结构化的总目录页面内容。This skill should be used when the user wants to generate or update a table-of-contents / index page (e.g., 0-learn.md) that lists all documents under a given docs section."
---

# Docs TOC Generator - 文档总目录生成器

## Purpose

Scan a docs directory (e.g., `docs/tech/`), read all `_category_.json` and markdown frontmatter, then generate a structured table-of-contents page that links to every document in the section.

## When to Use

- When the user mentions generating, updating, or refreshing a table of contents / index page
- When the user says "生成总目录", "更新目录", "刷新目录索引" or similar phrases
- When the user references an index file like `0-learn.md` and asks to populate it
- When the user adds new documents and wants the TOC updated

## Workflow

### Step 1: Identify Target

Determine:
1. **Scan directory**: The docs section to scan (e.g., `docs/tech/`). Default to the parent directory of the target file.
2. **Target file**: The index/TOC file to update (e.g., `docs/tech/0-learn.md`).

### Step 2: Scan Directory Structure

Recursively scan the target directory:

1. **Read `_category_.json`** files to get:
   - `label`: Display name of the category
   - `position`: Sort order among sibling categories
2. **Read markdown/mdx file frontmatter** to get:
   - `title`: Document title
   - `sidebar_position`: Sort order within the category
3. **Skip** image files, source code files, and the TOC file itself.
4. **Note** subdirectories as nested categories.

### Step 3: Build TOC Structure

Organize the data into a tree:

```
Section (from _category_.json label, sorted by position)
├── Doc 1 (sorted by sidebar_position)
├── Doc 2
└── Subsection (nested _category_.json)
    ├── Doc 3
    └── Doc 4
```

Sort rules:
- Categories sorted by `position` field in `_category_.json`
- Documents sorted by `sidebar_position` in frontmatter
- Documents without `sidebar_position` appear at the end
- Use the `title` from frontmatter as display text
- For documents without frontmatter title, derive from filename

### Step 4: Generate Markdown Content

Generate the TOC content in this format:

```markdown
---
id: index
title: <Section Title>
sidebar_position: 0
---

## 总目录

### <Category 1 Label>

- [Doc Title 1](./relative/path/to/doc1)
- [Doc Title 2](./relative/path/to/doc2)

### <Category 2 Label>

- [Doc Title 3](./relative/path/to/doc3)
  - [Subdoc Title](./relative/path/to/subdoc)
```

Link format rules:
- Use relative paths from the TOC file location
- For `index.md` files, link to the directory (e.g., `./go/` instead of `./go/index.md`)
- For `readme.md` files, treat them the same as `index.md` — link to the directory (e.g., `./devtools/fix/` instead of `./devtools/fix/readme`), because Docusaurus treats `readme.md` as a directory index page
- For filenames with numeric prefixes used for sorting (e.g., `0-openwrt.md`, `1-intro.md`), the link path must **omit the numeric prefix** (e.g., `./network/openwrt` instead of `./network/0-openwrt`), because Docusaurus strips `numberPrefix` from the generated route by default
- Exception: The TOC file itself (e.g., `0-learn.md`) is excluded from scanning, so this rule does not apply to it
- For `.mdx` files, include the extension in the path
- Nested categories use indented sub-lists

### Step 5: Preserve Custom Content

If the target file already has custom content sections (like "技术文章" with external links):
- Keep those sections intact at the bottom of the file
- Only regenerate the "总目录" section
- Identify custom sections as any `## heading` that is NOT "总目录"

### Step 6: Write the File

Update the target file with the generated content, preserving:
- Original frontmatter (if any)
- Custom content sections appended after the generated TOC

## Important Notes

- Always sort categories and documents by their position/sidebar_position values
- Use Chinese display names from `_category_.json` label fields when available
- Generate relative links that work with Docusaurus routing
- **Docusaurus strips numeric prefixes** (e.g., `0-`, `1-`) from filenames when generating routes. Links must use the path **without** the numeric prefix (e.g., `./network/openwrt` not `./network/0-openwrt`)
- **`readme.md` is treated as a directory index** by Docusaurus, so link to the directory path (e.g., `./devtools/fix/`) instead of `./devtools/fix/readme`
- The skill works for any docs section (tech, life, essay), not just tech
- If a category has an `index.md`, link the category heading to it
