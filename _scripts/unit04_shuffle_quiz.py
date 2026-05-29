"""
Shuffle Unit 4 quiz answer positions to fix position bias.
Currently 41/42 questions have correct=1. We rotate so correct is distributed across 0,1,2,3.

Strategy: For each comprehensionCheck (in file order), determine target position via
  target = global_idx % 4
Then swap options[1] <-> options[target] and optionExplanations[1] <-> optionExplanations[target],
and update correct value.

Uses tolerant TS parsing — finds quoted strings inside [] arrays.
"""
import re
from pathlib import Path

SECTIONS_DIR = Path(r"C:\Users\Ori-PC\political-system-app\src\content\units\unit04\sections")

# Regex to capture each comprehensionCheck block
# We look for: options: [...]   correct: N,   rationale: ...   optionExplanations: [...]
# Then we'll re-assemble.

# Tolerant string-literal regex: matches "..." with escaped chars on potentially multiple lines (but TS strings here are mostly single-line)
STR_RE = re.compile(r'"((?:[^"\\]|\\.)*)"', re.DOTALL)


def parse_string_array(src: str, start: int) -> tuple[list[str], int]:
    """
    Starting at `start` which points at '[', extract 4 string literals and return them + position after ']'.
    """
    assert src[start] == '[', f"Expected [ at {start}, got {src[start:start+20]!r}"
    depth = 1
    i = start + 1
    strings: list[str] = []
    while depth > 0 and i < len(src):
        c = src[i]
        if c == '"':
            # parse string
            m = STR_RE.match(src, i)
            if m is None:
                raise ValueError(f"Bad string at {i}: {src[i:i+50]!r}")
            strings.append(m.group(0))  # keep with quotes
            i = m.end()
        elif c == '[':
            depth += 1
            i += 1
        elif c == ']':
            depth -= 1
            i += 1
        else:
            i += 1
    return strings, i


def rotate(opts: list[str], from_idx: int, to_idx: int) -> list[str]:
    new = opts[:]
    new[from_idx], new[to_idx] = new[to_idx], new[from_idx]
    return new


def process_file(path: Path, global_counter: list[int]) -> str:
    src = path.read_text(encoding="utf-8")

    # Find each occurrence of "options:" "["
    out = []
    pos = 0
    while True:
        m = re.search(r"options:\s*\[", src[pos:])
        if m is None:
            out.append(src[pos:])
            break
        # Append text up to options: [
        out.append(src[pos: pos + m.start()])
        options_start = pos + m.end() - 1  # position of '['
        options, options_end = parse_string_array(src, options_start)
        if len(options) != 4:
            raise ValueError(f"Expected 4 options at {options_start} in {path.name}, got {len(options)}")

        # After options end, find: ],
        # Then need to find `correct: N,` (might have whitespace)
        # And then later `optionExplanations: [...]`
        rest = src[options_end:]
        correct_m = re.search(r"correct:\s*(\d+)\s*,", rest)
        if correct_m is None:
            raise ValueError(f"No 'correct:' found after options at {options_end} in {path.name}")
        current_correct = int(correct_m.group(1))

        # Find optionExplanations: [
        opt_exp_m = re.search(r"optionExplanations:\s*\[", rest)
        if opt_exp_m is None:
            raise ValueError(f"No optionExplanations found after options at {options_end} in {path.name}")
        opt_exp_start_abs = options_end + opt_exp_m.end() - 1
        opt_exps, opt_exp_end_abs = parse_string_array(src, opt_exp_start_abs)
        if len(opt_exps) != 4:
            raise ValueError(f"Expected 4 optionExplanations at {opt_exp_start_abs} in {path.name}, got {len(opt_exps)}")

        # Compute target
        target = global_counter[0] % 4
        global_counter[0] += 1

        # Rotate options and explanations: swap current_correct <-> target
        if current_correct != target:
            new_options = rotate(options, current_correct, target)
            new_opt_exps = rotate(opt_exps, current_correct, target)
        else:
            new_options = options
            new_opt_exps = opt_exps

        # Reconstruct options block: "[ <new_options joined with ",\n        "> ]"
        # We'll reuse existing indentation by reading original src[options_start:options_end]
        original_options_block = src[options_start:options_end]
        new_options_block = re.sub(
            r"\[.*\]",
            lambda _: "[\n        " + ",\n        ".join(new_options) + ",\n      ]",
            original_options_block,
            count=1,
            flags=re.DOTALL,
        )

        original_opt_exp_block = src[opt_exp_start_abs:opt_exp_end_abs]
        new_opt_exp_block = re.sub(
            r"\[.*\]",
            lambda _: "[\n        " + ",\n        ".join(new_opt_exps) + ",\n      ]",
            original_opt_exp_block,
            count=1,
            flags=re.DOTALL,
        )

        # Reconstruct middle (options_end to opt_exp_start_abs) with correct: N updated
        middle = src[options_end:opt_exp_start_abs]
        new_middle = re.sub(
            r"correct:\s*\d+\s*,",
            f"correct: {target},",
            middle,
            count=1,
        )

        out.append(new_options_block)
        out.append(new_middle)
        out.append(new_opt_exp_block)
        pos = opt_exp_end_abs

    return "".join(out)


def main() -> None:
    files = sorted(SECTIONS_DIR.glob("*.ts"))
    counter = [0]
    for f in files:
        new_src = process_file(f, counter)
        f.write_text(new_src, encoding="utf-8")
        print(f"Processed {f.name} (counter now {counter[0]})")
    print(f"\nTotal questions processed: {counter[0]}")
    # Distribution
    dist = [0, 0, 0, 0]
    for i in range(counter[0]):
        dist[i % 4] += 1
    print(f"Distribution: 0={dist[0]}, 1={dist[1]}, 2={dist[2]}, 3={dist[3]}")


if __name__ == "__main__":
    main()
