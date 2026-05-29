"""Shuffle Unit 5 quiz answer positions to balance distribution."""
import re
from pathlib import Path

SECTIONS_DIR = Path(r"C:\Users\Ori-PC\political-system-app\src\content\units\unit05\sections")

STR_RE = re.compile(r'"((?:[^"\\]|\\.)*)"', re.DOTALL)


def parse_string_array(src: str, start: int) -> tuple[list[str], int]:
    assert src[start] == '['
    depth = 1
    i = start + 1
    strings: list[str] = []
    while depth > 0 and i < len(src):
        c = src[i]
        if c == '"':
            m = STR_RE.match(src, i)
            if m is None:
                raise ValueError(f"Bad string at {i}")
            strings.append(m.group(0))
            i = m.end()
        elif c == '[':
            depth += 1; i += 1
        elif c == ']':
            depth -= 1; i += 1
        else:
            i += 1
    return strings, i


def rotate(opts: list[str], from_idx: int, to_idx: int) -> list[str]:
    new = opts[:]
    new[from_idx], new[to_idx] = new[to_idx], new[from_idx]
    return new


def process_file(path: Path, global_counter: list[int]) -> str:
    src = path.read_text(encoding="utf-8")
    out = []
    pos = 0
    while True:
        m = re.search(r"options:\s*\[", src[pos:])
        if m is None:
            out.append(src[pos:])
            break
        # Keep "options: " prefix in the output
        prefix_end = pos + m.end() - 1  # at '['
        out.append(src[pos:prefix_end])  # includes "options: " up to but not including '['
        options_start = prefix_end
        options, options_end = parse_string_array(src, options_start)
        if len(options) != 4:
            raise ValueError(f"Expected 4 options at {options_start} in {path.name}, got {len(options)}")

        rest = src[options_end:]
        correct_m = re.search(r"correct:\s*(\d+)\s*,", rest)
        if correct_m is None:
            raise ValueError(f"No 'correct:' found in {path.name}")
        current_correct = int(correct_m.group(1))

        opt_exp_m = re.search(r"optionExplanations:\s*\[", rest)
        if opt_exp_m is None:
            raise ValueError(f"No optionExplanations found in {path.name}")
        opt_exp_start_abs = options_end + opt_exp_m.end() - 1
        opt_exps, opt_exp_end_abs = parse_string_array(src, opt_exp_start_abs)

        target = global_counter[0] % 4
        global_counter[0] += 1

        if current_correct != target:
            new_options = rotate(options, current_correct, target)
            new_opt_exps = rotate(opt_exps, current_correct, target)
        else:
            new_options = options
            new_opt_exps = opt_exps

        new_options_block = "[\n        " + ",\n        ".join(new_options) + ",\n      ]"
        new_opt_exp_block = "[\n        " + ",\n        ".join(new_opt_exps) + ",\n      ]"
        middle = src[options_end:opt_exp_start_abs]
        new_middle = re.sub(r"correct:\s*\d+\s*,", f"correct: {target},", middle, count=1)

        out.append(new_options_block)
        out.append(new_middle)
        out.append(new_opt_exp_block)
        pos = opt_exp_end_abs

    return "".join(out)


def main() -> None:
    files = sorted(SECTIONS_DIR.glob("*.ts"))
    counter = [0]
    for f in files:
        if f.name == "index.ts": continue
        new_src = process_file(f, counter)
        f.write_text(new_src, encoding="utf-8")
        print(f"Processed {f.name} (counter now {counter[0]})")
    print(f"\nTotal: {counter[0]}")


if __name__ == "__main__":
    main()
