import argparse
import os
import pandas as pd
from pathlib import Path

# Import the student's function
from solution import count_steps

PASS_REL_ERR = 0.20  # ±20%

REQUIRED_COLS = ["file", "true_steps", "placement"]
def _validate_manifest(df: pd.DataFrame, manifest_path: str):
    missing = [c for c in REQUIRED_COLS if c not in df.columns]
    if missing:
        raise ValueError(f"Manifest missing required columns {missing}. Path: {manifest_path}")
    if (df["true_steps"] <= 0).any():
        raise ValueError("All true_steps must be positive integers.")
    # File existence
    base = Path(manifest_path).parent
    bad = []
    for p in df["file"]:
        fp = (base / p) if not p.startswith("data/") else Path(p)
        if not fp.exists():
            bad.append(p)
    if bad:
        raise FileNotFoundError(f"These files listed in manifest do not exist: {bad}")

def run_evaluation(manifest_path: str) -> pd.DataFrame:
    df = pd.read_csv(manifest_path)
    _validate_manifest(df, manifest_path)

    # Resolve file paths relative to repo root if needed
    def _abs_path(p):
        return p if Path(p).exists() else str((Path(manifest_path).parent / p).resolve())

    results = []
    for _, row in df.iterrows():
        fpath = _abs_path(row["file"])
        try:
            detected = int(count_steps(fpath))
        except Exception as e:
            detected = None
            err = str(e)
        else:
            err = ""
        true_steps = int(row["true_steps"])
        if detected is None:
            abs_err = None
            rel_err = None
            passed = False
        else:
            abs_err = abs(detected - true_steps)
            rel_err = abs_err / max(true_steps, 1)
            passed = rel_err <= PASS_REL_ERR
        results.append({
            "file": row["file"],
            "placement": row["placement"],
            "true_steps": true_steps,
            "detected_steps": detected,
            "abs_error": abs_err,
            "rel_error": rel_err,
            "pass_20pct": passed,
            "error_msg": err
        })
    res_df = pd.DataFrame(results)
    return res_df
def write_report(res_df: pd.DataFrame, out_dir: str):
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    # CSV
    res_csv = out / "results.csv"
    res_df.to_csv(res_csv, index=False)

    # Summary
    ok = res_df["pass_20pct"].sum() if "pass_20pct" in res_df else 0
    total = len(res_df)
    # Compute aggregates ignoring failed/None
    valid = res_df.dropna(subset=["rel_error"])
    mean_rel = valid["rel_error"].mean() if not valid.empty else None
    med_rel  = valid["rel_error"].median() if not valid.empty else None

    # Markdown table
    md = out / "results.md"
    with md.open("w") as f:
        f.write("# Step Counting – Evaluation Results\n\n")
        f.write(f"- Files evaluated: **{total}**\n")
        f.write(f"- Passed (≤20% rel. error): **{ok}/{total}**\n")
        f.write(f"- Mean rel. error: **{mean_rel:.2%}**\n" if mean_rel is not None else "- Mean rel. error: N/A\n")
        f.write(f"- Median rel. error: **{med_rel:.2%}**\n\n" if med_rel is not None else "- Median rel. error: N/A\n\n")

        # Compact table
        show = res_df[[
            "file","placement",
            "true_steps","detected_steps","abs_error","rel_error","pass_20pct"
        ]].copy()
        # Pretty rel_error
        show["rel_error"] = show["rel_error"].apply(lambda x: f"{x:.2%}" if pd.notnull(x) else "N/A")
        f.write(show.to_markdown(index=False))
        f.write("\n")

    return {"csv": str(res_csv), "md": str(md)}

def main():
    parser = argparse.ArgumentParser(description="Evaluate step counting across a manifest.")
    parser.add_argument("--manifest", required=True, help="Path to manifest CSV.")
    parser.add_argument("--report-dir", required=True, help="Directory to write results into.")
    args = parser.parse_args()

    res_df = run_evaluation(args.manifest)
    paths = write_report(res_df, args.report_dir)

    # Exit non-zero if any row fails threshold
    # (You can soften this if you want CI to pass even with failures.)
    if (~res_df["pass_20pct"]).any():
        print(f"One or more files failed threshold. See {paths['md']}")
        raise SystemExit(1)
    else:
        print(f"All files passed threshold. See {paths['md']}")

if __name__ == "__main__":
    main()
