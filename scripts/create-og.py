"""Genera la imagen Open Graph de Evoluth.

Uso:
    python scripts/create-og.py

Requiere Pillow y numpy. La tipografía se descarga una vez en
assets/fonts/Montserrat-Variable.ttf para que el resultado sea reproducible.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FONT = ROOT / "assets" / "fonts" / "Montserrat-Variable.ttf"
MARK = ROOT / "public" / "brand" / "evoluth-mark.png"
WORDMARK = ROOT / "public" / "brand" / "evoluth-wordmark-negative.png"
OUT = ROOT / "public" / "og" / "evoluth-og.png"

W, H = 1200, 630
NAVY = (5, 10, 15)
TEAL = (120, 230, 230)
TEAL_SOFT = (155, 234, 234)
MUTED = (169, 185, 198)
WHITE = (255, 255, 255)


def load_font(size: int, weight: int) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(str(FONT), size)
    try:
        font.set_variation_by_axes([weight])
    except OSError:
        pass
    return font


def radial_glow(size, center, radius, color, strength):
    """Devuelve una capa RGBA con un resplandor radial suave."""
    width, height = size
    y, x = np.ogrid[:height, :width]
    distance = np.sqrt((x - center[0]) ** 2 + (y - center[1]) ** 2)
    falloff = np.clip(1 - distance / radius, 0, 1) ** 2
    alpha = (falloff * strength * 255).astype(np.uint8)
    layer = Image.new("RGBA", size, color + (0,))
    layer.putalpha(Image.fromarray(alpha, mode="L"))
    return layer


def fit_font(text, max_width, size, weight):
    while size > 24:
        font = load_font(size, weight)
        if font.getlength(text) <= max_width:
            return font
        size -= 2
    return load_font(size, weight)


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)

    image = Image.new("RGB", (W, H), NAVY)

    # Retícula técnica.
    grid = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(grid)
    for x in range(0, W, 60):
        draw.line([(x, 0), (x, H)], fill=(255, 255, 255, 9), width=1)
    for y in range(0, H, 60):
        draw.line([(0, y), (W, y)], fill=(255, 255, 255, 9), width=1)
    image = Image.alpha_composite(image.convert("RGBA"), grid)

    # Resplandores de marca.
    image = Image.alpha_composite(
        image, radial_glow((W, H), (900, 300), 460, (59, 167, 160), 0.38)
    )
    image = Image.alpha_composite(
        image, radial_glow((W, H), (640, 250), 620, (26, 88, 120), 0.55)
    )

    # Marca de red a la derecha, recortando el borde con texto del JPG original.
    mark = Image.open(MARK).convert("RGBA")
    mark = mark.crop((62, 0, mark.width, mark.height))
    target_h = 570
    ratio = target_h / mark.height
    mark = mark.resize((round(mark.width * ratio), target_h), Image.LANCZOS)
    mark_x = W - mark.width - 50
    mark_y = (H - target_h) // 2 + 6
    mark_glow = mark.copy()
    alpha = mark_glow.getchannel("A").point(lambda value: int(value * 0.35))
    mark_glow.putalpha(alpha)
    image.alpha_composite(mark_glow, (mark_x - 8, mark_y + 4))
    image.alpha_composite(mark, (mark_x, mark_y))

    draw = ImageDraw.Draw(image)

    # Wordmark.
    wordmark = Image.open(WORDMARK).convert("RGBA")
    word_h = 30
    wordmark = wordmark.resize(
        (round(wordmark.width * word_h / wordmark.height), word_h), Image.LANCZOS
    )
    image.alpha_composite(wordmark, (76, 58))

    # Antetítulo.
    eyebrow_font = load_font(13, 600)
    draw.text(
        (78, 122),
        "MADUREZ  ·  PROCESOS  ·  TECNOLOGÍA  ·  DATOS  ·  INDUSTRIA",
        font=eyebrow_font,
        fill=TEAL_SOFT,
    )

    # Titular.
    lines = [
        ("La confianza", WHITE),
        ("no se improvisa.", WHITE),
        ("Se diseña.", TEAL),
    ]
    title_size = 74
    title_font = load_font(title_size, 600)
    y = 196
    for text, color in lines:
        draw.text((74, y), text, font=title_font, fill=color, spacing=0)
        y += 86

    # Línea de acento.
    draw.rectangle([(78, 468), (78 + 68, 470)], fill=(59, 167, 160))

    # Bajada.
    sub_font = fit_font(
        "Consultoría en convergencia digital: madurez, procesos,", 560, 18, 400
    )
    draw.text(
        (78, 492),
        "Consultoría en convergencia digital: madurez, procesos,",
        font=sub_font,
        fill=MUTED,
    )
    draw.text(
        (78, 518),
        "tecnología, datos e industria.",
        font=sub_font,
        fill=MUTED,
    )

    # Pie.
    foot_font = load_font(13, 600)
    draw.text((78, 576), "evoluth.com", font=foot_font, fill=TEAL_SOFT)
    draw.text((930, 576), "Quito, Ecuador", font=load_font(12, 400), fill=MUTED)

    image.convert("RGB").save(OUT, "PNG", optimize=True)
    print(f"Imagen generada: {OUT.relative_to(ROOT)} · {W}×{H}")


if __name__ == "__main__":
    build()
