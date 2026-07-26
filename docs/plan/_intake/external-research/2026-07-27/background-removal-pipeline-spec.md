---
id: csps.intake.external-research.2026-07-27.background-removal-pipeline-spec
name: background-removal-pipeline-spec
description: >
  Complete, standalone technical specification for a product-photo background-removal +
  multi-channel export pipeline (rembg / isnet-general-use model, 6 export channels, known
  unsolved reflective-surface problem). Pasted by the Governor S089 as source material for the
  "Background Removal SaaS" idea (domain_path business.marketing.design.pictures.image-processing
  .background-removal, placeholder in domain-taxonomy.md). Preserved verbatim per harvest-before-
  boundary discipline — this is the technical crystallization input for a future app-pipeline
  INTAKE, not yet formally entered into that pipeline.
source: external (pasted by Governor, origin document unspecified beyond its own text)
date_received: 2026-07-27
session: S089
schema_anchor: external_research
lifecycle: experimental
lifecycle_state: active
links:
  - { rel: schema-placement-proto, href: ../../../protos/PROTO-S089-BACKGROUND-REMOVAL-SCHEMA-PLACEMENT.md }
  - { rel: domain-taxonomy, href: ../../../pillar-0-governance/domain-taxonomy.md }
---

# Product Photo Background Removal + Multi-Channel Export Pipeline

> Preserved verbatim as pasted. See PROTO-S089-BACKGROUND-REMOVAL-SCHEMA-PLACEMENT.md for how
> this maps into CSPS's own schema/pipeline structure — this document is the source material,
> unedited.

**What this document is**: a complete, standalone specification of a working background-removal
and image-export pipeline, including every technical decision made, why it was made, what was
tried and rejected, and what is still unsolved. Written so someone with no prior context on the
project it came from can read it and rebuild the same thing (or something better) without
guessing at any of the reasoning.

**What problem this solves**: you have product photos (e.g. taken on a phone, on a table, on a
white sheet, whatever) and you want, for each photo, a clean version with the background removed
(replaced with pure white), automatically resized and cropped into several different fixed
dimensions for different marketing channels (Instagram, a website, LinkedIn, WhatsApp catalogs,
etc.) — all without a human manually cropping/editing each photo in Photoshop.

## 1. Background — what "background removal" actually means technically

A normal photo is a grid of pixels, each with a color (red/green/blue). There is no built-in
concept of "this pixel is the product" vs "this pixel is the background" — a computer has to
guess that, pixel by pixel, from the image content alone. This guessing task is called image
segmentation (specifically, in this case, "salient object segmentation" — finding the one main
object in the frame and separating it from everything else).

The output of a segmentation model is a mask: a grayscale image the same size as the input, where
white = "this pixel belongs to the foreground object" and black = "this pixel is background."
Once you have that mask, "removing the background" just means: for every pixel, keep the original
color if the mask says foreground, and make it transparent (or replace it with a solid color) if
the mask says background.

The hard part is not the mechanical mask-application step — it's producing a good mask. Models
routinely get confused by:

- Shadows the product casts on the surface below it (the model isn't sure if a shadow "belongs" to
  the product or the background)
- Reflective/glossy/transparent materials, where the model can't tell where the object's edge
  actually is because the object is partially see-through or mirror-like
- Thin or fine detail (hair, wisps, small protrusions) getting cut off or blurred

All three of these are real, encountered problems in this project — see Section 5.

## 2. Tool choice: why an open-source library instead of a paid API

There are two broad categories of tools for this:

**Paid cloud APIs** — e.g. Remove.bg, Photoroom, Adobe's background-removal APIs. You send an
image over the network, they run a (usually excellent, purpose-tuned) model on their servers, and
send back the result. Pros: typically higher quality out of the box, zero setup. Cons: per-image
cost that scales with volume, a network dependency for every single image, your images leave your
own infrastructure, and no ability to inspect/tune what's happening when a result is wrong.

**Open-source libraries you run yourself** — the one used here is rembg, a Python library that
wraps several pre-trained segmentation models and gives you a simple
`remove(image_bytes) -> image_bytes` function. Pros: free at any volume, runs entirely on your own
infrastructure (no per-image network call, no third party seeing your images), and — critically —
it ships multiple interchangeable models you can swap between with a one-line code change. Cons:
you are responsible for picking a good model and handling failure cases yourself.

**Decision made**: rembg. For a product-photo pipeline processing potentially thousands of images,
the zero-marginal-cost + full-control tradeoff won out over the convenience of a paid API. This is
worth reconsidering if quality on your specific images turns out to be dramatically better with a
paid API and volume stays low enough that the API cost is trivial — but test rembg's alternative
models first (Section 3) before concluding you need a paid API, because the difference is often
just picking the right bundled model, not a fundamental limitation of doing this yourself.

## 3. Model selection inside rembg — the actual investigation and result

rembg does not have one model — it bundles several, and you choose which one runs via a session
object:

```python
from rembg import remove, new_session
session = new_session("isnet-general-use")   # <- the model name goes here
result_bytes = remove(input_image_bytes, session=session)
```

The default model most tutorials/examples use is u2net (a 2020-era architecture). It works, but on
real test images in this project it was leaving a visible cast shadow behind on the white
background for certain products — specifically:

- A matte cardboard/packaging box, photographed on a surface, casting a soft shadow to one side.
- A composite item made of wood, acrylic, and metal parts, similarly casting a shadow.

In both cases, u2net correctly identified the product's silhouette but included part of the shadow
as if it were part of the foreground, leaving a visible gray smudge trailing off the product in
the "background-removed" result — which looks unprofessional and defeats the purpose.

**What was tried:**

| Model | Result on shadow cases | Result on glossy/reflective case |
|---|---|---|
| u2net (default) | ❌ Shadow left behind | ❌ Also fails |
| isnet-general-use | ✅ Shadow completely removed, clean white background | ❌ Still fails |
| birefnet-general | (not re-tested on shadow case, isnet already solved it) | ❌ Still fails |

**Decision made**: use isnet-general-use as the model for all processing. This was a real, tested,
before/after comparison on the actual problem images — not a guess or a default left unchanged.
Switching models cost nothing (same library, zero added dependencies, one line of code) and fully
solved the shadow problem for matte/composite items.

**What is still unsolved**: a separate test case — a glossy or crystal-like product photographed
on a reflective surface — was NOT fixed by either isnet-general-use or birefnet-general. The model
gets confused by the reflection/refraction and produces a wrong edge. This is a genuinely harder,
different failure mode (optical, not shadow-related) and remains an open problem. If your friend's
product photos include glass, crystal, glossy plastic, mirrors, or similarly reflective materials,
expect this to still be an issue and budget time to research it further (candidates to try: other
rembg models not yet tested here such as bria-rmbg; a dedicated reflection-aware segmentation model
if one exists; or accepting manual touch-up for that specific product category rather than chasing
a fully automated fix).

**Takeaway for whoever builds this next**: before assuming you need custom model training or a
paid API to fix a segmentation quality problem, check whether the library you're already using
ships alternative pre-trained models you haven't tried. This one swap (one line of code) fixed an
entire class of real problem images at zero cost.

## 4. The full processing pipeline, step by step

Given one input photo, the pipeline produces 7 output files: one transparent cutout, and 6
differently-sized/cropped final images for different marketing channels.

**Step 1 — Remove the background.** Run the input image through rembg with the
isnet-general-use model. The output is a PNG with an alpha (transparency) channel. Saved as
`_NOBG.png` — useful standalone and feeds every subsequent step.

**Step 2 — Crop to the product's tight bounding box.** Use `img.getbbox()` (Python PIL/Pillow) to
crop to the smallest rectangle containing every non-transparent pixel.

**Step 3 — Add proportional padding (the part that's easy to get wrong).** Naive approach
(canvas-relative padding, e.g. 5% of a 1080×1080 target) was tried and rejected: a wide/landscape
product placed into a square canvas gets correct-looking side margins but ballooning 20-30%
vertical margins, because the padding was calculated against the canvas, not the product. Correct
approach used here: padding as a percentage of the product's OWN width/height (5% of the product's
width added left+right, 5% of height added top+bottom) BEFORE placing into any target canvas —
guarantees a visually consistent margin regardless of the product's own aspect ratio.

**Step 4 — Generate each of the 6 channel-specific exports.** For each target size: scale
(preserving aspect ratio) to fit as large as possible inside the target canvas; center on a plain
white canvas of exactly the target dimensions; flatten RGBA to RGB with white background (JPEG
doesn't support transparency — this is the point "background removed" becomes "background is now
solid white").

**Step 5 — Apply mild, uniform image enhancement.** Every export gets, via Pillow's
`ImageEnhance`: Brightness ×1.03, Contrast ×1.08, Saturation ×1.04, Sharpness ×1.15. Deliberately
conservative ("tasteful," not "filtered-looking"). These four numbers are the only tuning knobs.

**Step 6 — Save as JPEG at a channel-appropriate quality setting.** Higher quality/bigger file for
uses where fidelity matters more (website hero image); lower for a thumbnail.

## 5. The 6 channel export specifications

| File suffix | Dimensions (px) | JPEG quality | Intended use |
|---|---|---|---|
| `_IG_SQ` | 1080 × 1080 | 90 | Instagram square post |
| `_IG_PORT` | 1080 × 1350 | 90 | Instagram portrait post |
| `_WEB_MAIN` | 1200 × 1200 | 92 | Main/hero product image on a website product page |
| `_WEB_THUMB` | 600 × 600 | 80 | Small thumbnail (search results, category grid, cart) |
| `_LI_POST` | 1200 × 628 | 85 | LinkedIn post image |
| `_WA_CAT` | 800 × 800 | 85 | WhatsApp Business catalog product image |

Plus the intermediate `_NOBG.png` (full original resolution, transparent, not resized).

These 6 targets are specific to the marketing channels this project needed — the pipeline logic
(Steps 1-6) is generic and doesn't care how many/which target sizes are configured.

## 6. Reference implementation (working Python code)

Depends on `rembg` and `Pillow` (`pip install rembg pillow`).

```python
"""
Background Removal + Channel Export
Usage: python remove_bg.py <input_image> <base_name> <output_dir>
"""
import sys
import os
from pathlib import Path
from PIL import Image, ImageEnhance

from rembg import remove, new_session

# Tested against real problem images: isnet-general-use fully removes cast shadows on
# matte/composite items that the default u2net model left behind. Does NOT fix
# glossy-crystal-on-reflective-surface reflections (birefnet-general doesn't either --
# separately tracked, unsolved).
REMBG_MODEL = "isnet-general-use"
_session = None


def _get_session():
    global _session
    if _session is None:
        _session = new_session(REMBG_MODEL)
    return _session


# Mild, tasteful auto-enhancement applied to every export. Conservative defaults --
# tune here if output looks over/under-processed.
ENHANCE = {
    "brightness": 1.03,
    "contrast":   1.08,
    "sharpness":  1.15,
    "color":      1.04,   # saturation
}


def _enhance(img_rgb):
    """Apply brightness/contrast/sharpness/saturation enhancement to an RGB image."""
    out = img_rgb
    out = ImageEnhance.Brightness(out).enhance(ENHANCE["brightness"])
    out = ImageEnhance.Contrast(out).enhance(ENHANCE["contrast"])
    out = ImageEnhance.Color(out).enhance(ENHANCE["color"])
    out = ImageEnhance.Sharpness(out).enhance(ENHANCE["sharpness"])
    return out


def process(input_path, base_name, out_dir):
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"Step 1: Removing background from {Path(input_path).name}...")
    with open(input_path, "rb") as f:
        input_data = f.read()

    result = remove(input_data, session=_get_session())

    nobg_path = out_dir / f"{base_name}_NOBG.png"
    with open(nobg_path, "wb") as f:
        f.write(result)
    print(f"  Saved: {nobg_path.name}")

    # Load transparent PNG
    img = Image.open(nobg_path).convert("RGBA")
    w, h = img.size
    print(f"  Source size: {w}x{h}")

    print("Step 2: Generating channel exports...")

    exports = [
        {"suffix": "_IG_SQ",     "w": 1080, "h": 1080, "quality": 90,  "label": "Instagram Square"},
        {"suffix": "_IG_PORT",   "w": 1080, "h": 1350, "quality": 90,  "label": "Instagram Portrait"},
        {"suffix": "_WEB_MAIN",  "w": 1200, "h": 1200, "quality": 92,  "label": "Website Main"},
        {"suffix": "_WEB_THUMB", "w": 600,  "h": 600,  "quality": 80,  "label": "Website Thumbnail"},
        {"suffix": "_LI_POST",   "w": 1200, "h": 628,  "quality": 85,  "label": "LinkedIn Post"},
        {"suffix": "_WA_CAT",    "w": 800,  "h": 800,  "quality": 85,  "label": "WhatsApp Catalog"},
    ]

    # Crop transparent PNG to tight product bounding box
    bbox = img.getbbox()
    product = img.crop(bbox) if bbox else img
    prod_w, prod_h = product.size

    # Add 5% padding relative to product dimensions (equal visual margin on all sides,
    # regardless of the product's own aspect ratio -- see Section 3 of the spec for why
    # this must be relative to the product, not the target canvas)
    PAD_PCT = 0.05
    pad_x = int(prod_w * PAD_PCT)
    pad_y = int(prod_h * PAD_PCT)
    padded_w = prod_w + pad_x * 2
    padded_h = prod_h + pad_y * 2
    padded = Image.new("RGBA", (padded_w, padded_h), (0, 0, 0, 0))
    padded.paste(product, (pad_x, pad_y), product)

    for exp in exports:
        tw, th = exp["w"], exp["h"]

        # Scale padded product to fill canvas as much as possible
        scale = min(tw / padded_w, th / padded_h)
        new_w = int(padded_w * scale)
        new_h = int(padded_h * scale)
        resized = padded.resize((new_w, new_h), Image.LANCZOS)

        # Center on white canvas
        canvas = Image.new("RGBA", (tw, th), (255, 255, 255, 255))
        paste_x = (tw - new_w) // 2
        paste_y = (th - new_h) // 2
        canvas.paste(resized, (paste_x, paste_y), resized)

        # Enhance (brightness/contrast/saturation/sharpness) then save as JPG
        final_rgb = _enhance(canvas.convert("RGB"))
        out_path = out_dir / f"{base_name}{exp['suffix']}.jpg"
        final_rgb.save(out_path, "JPEG", quality=exp["quality"])
        print(f"  OK  {exp['label']} ({tw}x{th}) -> {out_path.name}")

    print(f"\nDone. All files in:\n  {out_dir}")


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python remove_bg.py <input_image> <base_name> <output_dir>")
        sys.exit(1)
    process(sys.argv[1], sys.argv[2], sys.argv[3])
```

Note on the truststore/SSL block you may see in some versions of this code: on some
corporate/antivirus-monitored Windows machines, a security tool (e.g. Avast) intercepts outbound
SSL connections in a way that breaks the first-time model download rembg does. Wrapping the import
in a try/except around a `truststore.inject_into_ssl()` call works around this. Environment-specific
quirk, not inherent to the pipeline.

## 7. Architecture decisions beyond the image-processing code itself

**7a. Background removal is a final-export-only step — never apply it earlier in a pipeline.** If
this pipeline is one piece of a larger system that also does something else with the photos (e.g.
a classifier), do not run background removal before that other step. Whatever consumes the final,
real-world images will always see photos WITH backgrounds; tuning/training anything on
background-removed images creates a mismatch with what production actually sees. **Rule:**
background removal is the very last step, applied only to the export copy.

**7b. Raw source photos are immutable — never overwrite or edit the original file.** Every
processing step writes a NEW derivative file, keyed back to the original. Why: preserves the
ability to reprocess with a better method later (e.g. the isnet-general-use shadow fix); limits
blast radius of a buggy batch job to derivatives only, never permanent source-data loss.

## 8. Known unsolved problem (disclosed honestly, not oversold)

Glossy, crystal, or reflective-surface products are not reliably handled by either
isnet-general-use or birefnet-general. Realistic paths forward, none tested/proven yet:
- Try other rembg-bundled models not yet tested (e.g. bria-rmbg).
- Try a paid API specifically for this photo category only (untested — needs the same kind of
  real before/after comparison as Section 3 before trusting it).
- Photograph this specific product category against a plain, non-reflective background from the
  start (cheapest fix is sometimes upstream of the software entirely).
- Accept manual masking/touch-up as a fallback for this product category.

## 9. Optional context: how this runs in production (not required to replicate)

The pipeline logic (Sections 4-6) is completely self-contained and runs as a plain local Python
script. The system this came from also wraps it in infrastructure for running at scale unattended
— included only as context, not required to get value from the pipeline itself: a serverless cloud
function (Modal) for auto-scaling; cloud object storage (Supabase Storage, S3-compatible) for
durable availability; a message queue for coordinating concurrent processing jobs. None of this
changes what the pipeline does — start with the plain script; only reach for this once volume
requires it.

## 10. Summary of every real decision made, for quick reference

| Decision | Choice made | Why |
|---|---|---|
| Which library | rembg (open source, self-hosted) | Zero marginal cost at volume, full control, no per-image network dependency |
| Which model inside rembg | isnet-general-use (not default u2net) | Tested on real problem images; fully fixed a cast-shadow failure |
| Padding calculation | Relative to the product's own bounding box, not the target canvas | Canvas-relative padding produces wildly inconsistent margins |
| Enhancement | Small fixed multipliers, applied uniformly | Subtle, consistent polish without looking artificially filtered |
| Output format | JPEG (final exports), PNG (intermediate transparent cutout) | JPEG for compatibility/size; PNG needed for transparency |
| Where in a larger pipeline | Only at final export, never before classification/other analysis | Avoids tuning-vs-production mismatch |
| Raw file handling | Never overwrite originals; every step produces a new derivative | Preserves reprocessing option; limits blast radius of bugs |
| Glossy/reflective products | Explicitly unsolved, disclosed honestly | Two different models both failed; don't claim it works when it doesn't |
