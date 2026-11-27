"""Downscale the 2x render to the 1024x1024 entry PNG (256 colours)."""

from pathlib import Path

from PIL import Image

here = Path(__file__).resolve().parent
raw = here / "raw_2x.png"
out = here / "entry.png"

big = Image.open(raw)
if big.size != (2048, 2048):
    raise SystemExit(f"raw render is {big.size}, expected 2048x2048")

small = big.resize((1024, 1024), Image.Resampling.LANCZOS).convert("RGB")
quant = small.quantize(
    colors=256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE
)
quant.save(out, format="PNG", optimize=True)
raw.unlink()

print(f"wrote {out} ({out.stat().st_size} bytes)")
