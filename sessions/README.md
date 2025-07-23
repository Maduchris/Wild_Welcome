# Session Tracking

This folder tracks debugging sessions, issues, and things that aren't working properly.

## Structure

```text
sessions/
├── issues/           # Current known issues
├── debugging/        # Active debugging sessions
├── resolved/         # Resolved issues (for reference)
└── templates/        # Templates for consistent logging
```

## Quick Start

1. **New Issue**: Copy `templates/issue-template.md` to `issues/`
2. **Debugging Session**: Copy `templates/debug-session.md` to `debugging/`
3. **When Resolved**: Move from `issues/` or `debugging/` to `resolved/`

## Naming Convention

- Issues: `YYYY-MM-DD-brief-description.md`
- Debug sessions: `YYYY-MM-DD-component-issue.md`
- Use lowercase with hyphens
