---
name: draft-organizer
description: "自动整理 docs/draft/ 草稿目录中的文件。This skill should be used when the user wants to organize, categorize, or move draft documents from docs/draft/ into the appropriate website section (tech/life/essay). It analyzes content, suggests categorization, auto-generates frontmatter (title, tags, sidebar_position), and moves files to the target directory."
---

# Draft Organizer - 草稿自动整理

## Purpose

Scan the `docs/draft/` directory, analyze each file's content, determine the appropriate target section, generate or supplement frontmatter, and move the file to the correct directory within the Docusaurus site.

## When to Use

- When the user mentions organizing, sorting, or categorizing drafts
- When the user asks to move content from draft to the main site sections
- When the user says "整理草稿", "归类", "整理 draft" or similar phrases
- When the user places new files in `docs/draft/` and wants them organized

## Site Structure

The website has three content sections under `docs/`:

| Section | Directory | Description | Example Topics |
|---------|-----------|-------------|----------------|
| 技术 (Tech) | `docs/tech/` | Technical articles, tutorials, and tool guides | Go, MySQL, Web dev, Network/OpenWrt, Bash, Git, DevOps, Windows tips, Hardware repair |
| 生活 (Life) | `docs/life/` | Daily life content | Music, Movies/TV, Toys/DIY, Cleaning tips |
| 随笔 (Essay) | `docs/essay/` | Personal thoughts and reading notes | Book notes, Quotes, Reflections |

### Existing Subdirectories

```
docs/tech/: go/, database/, web/, network/, devtools/, devtools/fix/, devtools/windows/
docs/life/: music/, music/ukulele/, toy/
docs/essay/: reading/
```

## Workflow

### Step 1: Scan Draft Directory

List all `.md` and `.mdx` files in `docs/draft/`. If the directory is empty, inform the user and exit.

### Step 2: Analyze Each File

For each file, read the content and determine:

1. **Content Theme**: Identify the primary topic by analyzing keywords, code blocks, and overall subject matter.
2. **Target Section**: Map the theme to one of the four sections (tech/life/tools/essay).
3. **Target Subdirectory**: If the content fits an existing subdirectory (e.g., Go code → `tech/go/`), prefer placing it there.

#### Classification Rules

Apply these rules in order:

1. Contains programming code, technical concepts, protocols, algorithms, DevOps, system administration, software/hardware repair, OS tips, or practical tool guides → **tech**
2. Contains music, movies, TV shows, hobbies, DIY projects, household tips → **life**
3. Contains personal reflections, book notes, quotes, opinions, philosophical thoughts → **essay**
4. If ambiguous, default to **essay**

### Step 3: Generate Frontmatter

Check if the file already has YAML frontmatter (starts with `---`).

- **If frontmatter exists**: Preserve it, only add missing fields (`title`, `tags`).
- **If no frontmatter**: Generate a complete frontmatter block:

```yaml
---
title: "Derived from first heading or content summary, in the language of the content"
tags: ["relevant tags based on content"]
---
```

#### Title Generation Rules

- If the file has a `# Heading`, use it as the title
- If no heading exists, generate a concise descriptive title based on content (max 20 characters)
- Keep the title in the same language as the content

#### Tag Generation Rules

- Extract 1-5 relevant tags from the content
- Use lowercase for English tags
- Tags should reflect the main topics discussed

### Step 4: Present Plan to User

Display a summary table showing the proposed changes:

```
| File | Target | Title | Tags | Action |
|------|--------|-------|------|--------|
| draft/xxx.md | tech/go/ | Go并发模式 | [go, concurrency] | Move + Add frontmatter |
```

Ask the user to confirm before proceeding. The user may:
- Confirm all changes
- Modify individual file destinations
- Skip specific files

### Step 5: Execute Changes

After user confirmation:

1. Add/update frontmatter in the file content
2. Move the file to the target directory using the file system tools
3. Report the results

## Important Notes

- Always preserve the original content of the file; only add/modify frontmatter
- If a file with the same name already exists in the target directory, append a numeric suffix (e.g., `xxx-2.md`)
- Image files or other assets referenced in the markdown should be moved along with the markdown file if they exist in `docs/draft/`
- Non-markdown files in `docs/draft/` should be reported but not processed
