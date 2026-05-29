"""Fix the broken `options:` label that the shuffle script accidentally removed."""
import re
from pathlib import Path

SECTIONS_DIR = Path(r"C:\Users\Ori-PC\political-system-app\src\content\units\unit04\sections")

# Pattern: a line containing just whitespace + `[` that comes immediately after
# a line ending with `question:` followed by a quoted-string-ended line.
# Actually simpler: find lines that are exactly `      [` (6 spaces+[) when they're
# preceded by a question block (question line + closing quote+,) and add "options: "
#
# Even simpler: the breakage signature is two consecutive lines:
#   "....",
#   [
# where the second is exactly /^      \[$/. Just replace those bare [ with "      options: [".

for path in sorted(SECTIONS_DIR.glob("*.ts")):
    src = path.read_text(encoding="utf-8")
    # Replace bare "      [" lines (6 spaces + [) with "      options: ["
    # but only when followed by a quoted string (option content)
    new = re.sub(
        r'(\n      )\[(\n        ")',
        r'\1options: [\2',
        src,
    )
    if new != src:
        path.write_text(new, encoding="utf-8")
        print(f"Fixed {path.name}")
    else:
        print(f"No change {path.name}")
