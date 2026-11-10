"""Prepare Evoluth brand assets from the supplied reference files.

The source only includes a raster positive logo on a white background. This script
creates a transparent positive version, a white negative version for dark surfaces,
and favicon/app-icon assets. It is intentionally deterministic so the assets can be
regenerated if the official SVG arrives.
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = (
    ROOT
    / "material"
    / "diccionario-ui"
    / "evoluth-ui-comercial"
    / "assets"
    / "logos"
    / "evoluth-logo-positivo.png"
)
OUT = ROOT / "public" / "brand"
OUT.mkdir(parents=True, exist_ok=True)


def remove_white(image: Image.Image) -> Image.Image:
    """Turn a flat white background into alpha and decontaminate the edges."""
    image = image.convert("RGB")
    result = Image.new("RGBA", image.size)
    src = image.load()
    dst = result.load()

    for y in range(image.height):
        for x in range(image.width):
            r, g, b = src[x, y]
            min_channel = min(r, g, b)

            if min_channel >= 248:
                alpha = 0.0
            elif min_channel <= 218:
                alpha = 1.0
            else:
                alpha = (248 - min_channel) / 30.0

            if alpha <= 0:
                dst[x, y] = (255, 255, 255, 0)
                continue

            # Unblend the pixel from white so anti-aliased edges do not get a
            # light halo on dark surfaces.
            channels = []
            for channel in (r, g, b):
                value = (channel - (1.0 - alpha) * 255.0) / alpha
                channels.append(max(0, min(255, round(value))))

            dst[x, y] = (*channels, round(alpha * 255))

    return result


def make_negative(transparent: Image.Image) -> Image.Image:
    """Create a monochrome white version of the mark for dark surfaces."""
    result = Image.new("RGBA", transparent.size)
    src = transparent.load()
    dst = result.load()

    for y in range(transparent.height):
        for x in range(transparent.width):
            alpha = src[x, y][3]
            dst[x, y] = (255, 255, 255, alpha)

    return result


def main() -> None:
    source = Image.open(SOURCE)
    transparent = remove_white(source)
    negative = make_negative(transparent)

    transparent.save(OUT / "evoluth-logo-positive.png", optimize=True)
    negative.save(OUT / "evoluth-logo-negative.png", optimize=True)

    # Header lockup: the main wordmark without the tagline.
    positive_wordmark = transparent.crop((0, 0, transparent.width, 138))
    negative_wordmark = negative.crop((0, 0, negative.width, 138))
    positive_wordmark = positive_wordmark.crop(positive_wordmark.getbbox())
    negative_wordmark = negative_wordmark.crop(negative_wordmark.getbbox())
    positive_wordmark.save(OUT / "evoluth-wordmark-positive.png", optimize=True)
    negative_wordmark.save(OUT / "evoluth-wordmark-negative.png", optimize=True)

    print("Brand assets written to", OUT)
    print("Logo size:", transparent.size)
    print("Wordmark and negative lockup ready")


if __name__ == "__main__":
    main()
