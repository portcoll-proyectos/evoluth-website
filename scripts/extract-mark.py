"""Extract the Evoluth network mark from the colour reference image.

The mark overlaps the wordmark horizontally in the reference, so the script keeps
only the largest connected component of the teal mask. This removes the faint
anti-aliased edge of the letter "h" from the crop.
"""

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "material" / "Evoluth Color ultima edicion 16092026.jpg"
OUT = ROOT / "public" / "brand"

image = Image.open(SOURCE).convert("RGB")
crop = image.crop((1880, 300, 2544, 1520))
pixels = crop.load()

result = Image.new("RGBA", crop.size)
out = result.load()
mask = np.zeros((crop.height, crop.width), dtype=bool)

for y in range(crop.height):
    for x in range(crop.width):
        r, g, b = pixels[x, y]
        chroma = max(r, g, b) - min(r, g, b)
        if g > 100 and g > r + 15 and b > r + 10 and chroma > 8:
            alpha = min(255, round(chroma * 5.5))
            out[x, y] = (r, g, b, alpha)
            mask[y, x] = True
        else:
            out[x, y] = (255, 255, 255, 0)

# Keep the largest connected component (the network mark).
height, width = mask.shape
visited = np.zeros_like(mask, dtype=bool)
best = []
for start_y in range(height):
    for start_x in range(width):
        if not mask[start_y, start_x] or visited[start_y, start_x]:
            continue
        queue = deque([(start_y, start_x)])
        visited[start_y, start_x] = True
        component = []
        while queue:
            y, x = queue.popleft()
            component.append((y, x))
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = y + dy, x + dx
                if 0 <= ny < height and 0 <= nx < width:
                    if mask[ny, nx] and not visited[ny, nx]:
                        visited[ny, nx] = True
                        queue.append((ny, nx))
        if len(component) > len(best):
            best = component

keep = Image.new("L", crop.size, 0)
keep_pixels = keep.load()
for y, x in best:
    keep_pixels[x, y] = 255

# Expand slightly so anti-aliased edges survive, then apply to the alpha.
keep = keep.filter(ImageFilter.MaxFilter(5))
keep_array = np.array(keep)
alpha_array = np.array(result.getchannel("A"))
alpha_array[keep_array == 0] = 0
result.putalpha(Image.fromarray(alpha_array))

bbox = result.getbbox()
print("mark bbox", bbox)
if bbox:
    result = result.crop(bbox)

# Tight mark: recolour the alpha silhouette with the brand loader gradient so
# the JPEG background never contaminates the edges.
bbox = result.getbbox()
tight = result.crop(bbox)
pixels = tight.load()
top = (155, 234, 234)  # loader-light
bottom = (42, 106, 146)  # loader-deep
for y in range(tight.height):
    t = y / max(1, tight.height - 1)
    color = tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
    for x in range(tight.width):
        alpha = pixels[x, y][3]
        if alpha:
            pixels[x, y] = (*color, alpha)

mask = Image.new("RGBA", tight.size, (255, 255, 255, 0))
mask_pixels = mask.load()
for y in range(tight.height):
    for x in range(tight.width):
        alpha = pixels[x, y][3]
        if alpha:
            mask_pixels[x, y] = (255, 255, 255, alpha)

tight.save(OUT / "evoluth-mark.png", optimize=True)
mask.save(OUT / "evoluth-mark-mask.png", optimize=True)

# Square app icon on brand navy.
size = 512
canvas = Image.new("RGBA", (size, size), (18, 64, 94, 255))
inner = round(size * 0.72)
scale = min(inner / tight.width, inner / tight.height)
resized = tight.resize(
    (max(1, round(tight.width * scale)), max(1, round(tight.height * scale))),
    Image.LANCZOS,
)
canvas.alpha_composite(
    resized,
    ((size - resized.width) // 2, (size - resized.height) // 2),
)
canvas.save(ROOT / "app" / "icon.png", optimize=True)
canvas.resize((180, 180), Image.LANCZOS).save(
    ROOT / "app" / "apple-icon.png", optimize=True
)
print("saved", tight.size, "icon", canvas.size)
