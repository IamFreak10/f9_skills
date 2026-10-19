#!/usr/bin/env python3
"""Validate canonical .agents/skills files using only Python's standard library.

This intentionally performs conservative frontmatter checks, not full YAML parsing.
It validates a simple top-level `name:` and quoted/unquoted `description:` scalar;
it does not validate every YAML feature or any host agent's runtime discovery.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILLS_DIR = ROOT / ".agents" / "skills"
REQUIRED_SECTIONS = (
    "Purpose and scope",
    "Activation conditions",
    "Required context",
    "Step-by-step workflow",
    "Engineering standards",
    "Common anti-patterns",
    "Security considerations",
    "Verification requirements",
    "Completion-report format",
)
EXPECTED_SKILLS = {
    "feature-planner", "typescript-engineering", "react-next-frontend",
    "state-management", "ui-system", "express-nest-backend",
    "database-engineering", "auth-security", "debugging",
    "testing-quality-gates", "git-cicd", "deployment-ops",
    "production-code-review",
}
MINIMUM_FILE_CHARS = 900
errors: list[str] = []
warnings: list[str] = []


def error(message: str) -> None:
    errors.append(message)


def parse_frontmatter(text: str, path: Path) -> dict[str, str] | None:
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        error(f"{path.relative_to(ROOT)}: missing YAML frontmatter opening '---'")
        return None
    try:
        end = next(i for i in range(1, len(lines)) if lines[i].strip() == "---")
    except StopIteration:
        error(f"{path.relative_to(ROOT)}: missing YAML frontmatter closing '---'")
        return None

    fields: dict[str, str] = {}
    for line_number, line in enumerate(lines[1:end], start=2):
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        match = re.match(r"^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*?)\s*$", line)
        if not match:
            error(f"{path.relative_to(ROOT)}:{line_number}: unsupported frontmatter line")
            continue
        key, value = match.groups()
        if key in fields:
            error(f"{path.relative_to(ROOT)}:{line_number}: duplicate field '{key}'")
            continue
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
            value = value[1:-1]
        fields[key] = value
    return fields


def main() -> int:
    if not SKILLS_DIR.is_dir():
        print(f"ERROR: skill directory not found: {SKILLS_DIR}")
        return 1

    skill_dirs = sorted(p for p in SKILLS_DIR.iterdir() if p.is_dir())
    found = {p.name for p in skill_dirs}
    for missing in sorted(EXPECTED_SKILLS - found):
        error(f"missing expected skill directory: {missing}")
    for unexpected in sorted(found - EXPECTED_SKILLS):
        warnings.append(f"unexpected skill directory (review inventory): {unexpected}")

    seen_names: dict[str, Path] = {}
    for directory in skill_dirs:
        skill_file = directory / "SKILL.md"
        if not skill_file.is_file():
            error(f"{directory.relative_to(ROOT)}: missing SKILL.md")
            continue
        content = skill_file.read_text(encoding="utf-8")
        relative = skill_file.relative_to(ROOT)
        if len(content.strip()) < MINIMUM_FILE_CHARS:
            error(f"{relative}: suspiciously short ({len(content.strip())} chars; minimum {MINIMUM_FILE_CHARS})")
        if not content.strip():
            error(f"{relative}: empty file")
            continue

        fields = parse_frontmatter(content, skill_file)
        if fields is None:
            continue
        for required in ("name", "description"):
            if not fields.get(required, "").strip():
                error(f"{relative}: missing or empty frontmatter field '{required}'")
        declared = fields.get("name", "").strip()
        if declared and declared != directory.name:
            error(f"{relative}: name '{declared}' does not match directory '{directory.name}'")
        if declared:
            if declared in seen_names:
                error(f"{relative}: duplicate skill name '{declared}' also in {seen_names[declared].relative_to(ROOT)}")
            else:
                seen_names[declared] = skill_file

        description = fields.get("description", "").strip()
        if description and len(description) < 45:
            error(f"{relative}: description is too short to route reliably ({len(description)} chars)")
        if description and not re.search(r"\b(use|when|for|during|across|while)\b", description, re.I):
            warnings.append(f"{relative}: description may need clearer activation wording")

        body = content.split("---", 2)[-1]
        for section in REQUIRED_SECTIONS:
            if not re.search(r"^##\s+" + re.escape(section) + r"\s*$", body, re.M):
                error(f"{relative}: missing required section '## {section}'")

    # Required top-level support files
    for rel in ("README.md", "AGENTS.md", "CLAUDE.md",
                "templates/feature-plan.md", "templates/code-review.md",
                "templates/deployment-checklist.md"):
        path = ROOT / rel
        if not path.is_file() or not path.read_text(encoding="utf-8").strip():
            error(f"required support file missing or empty: {rel}")

    # Check that every canonical skill is referenced in the inventory/router.
    readme = (ROOT / "README.md").read_text(encoding="utf-8") if (ROOT / "README.md").exists() else ""
    for name in sorted(EXPECTED_SKILLS):
        if f"`{name}`" not in readme:
            error(f"README.md does not reference skill '{name}'")

    for item in warnings:
        print(f"WARNING: {item}")
    if errors:
        for item in errors:
            print(f"ERROR: {item}")
        print(f"\nValidation FAILED: {len(errors)} error(s), {len(warnings)} warning(s).")
        return 1

    print(f"Validated {len(skill_dirs)} skill file(s); required sections, simple frontmatter, names, descriptions, and support files passed.")
    print(f"Warnings: {len(warnings)}. This is a structural check, not full YAML or host-agent discovery validation.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
