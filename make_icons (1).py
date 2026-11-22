"""Draws the জনদূত launcher icons (run by the build workflow; needs Pillow)."""
import os
from PIL import Image, ImageDraw

GREEN, PAPER, AMBER, INK = (7, 82, 56), (255, 255, 255), (232, 163, 23), (13, 24, 20)
RES = "android/app/src/main/res"


def art(size, scale=0.78, rounded=False, bg=True):
    """Green tile with a white page, three text lines and an amber check badge."""
    k = 4
    s = size * k
    im = Image.new("RGBA", (s, s), GREEN + (255,) if bg else (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    pw = int(s * scale * 0.72)
    ph = int(s * scale * 0.86)
    x0 = (s - pw) // 2
    y0 = (s - ph) // 2
    d.rounded_rectangle([x0, y0, x0 + pw, y0 + ph], radius=int(pw * 0.1), fill=PAPER + (255,))
    for i, frac in enumerate((0.3, 0.46, 0.62)):
        y = y0 + int(ph * frac)
        w = int(pw * (0.62 if i < 2 else 0.4))
        d.rounded_rectangle([x0 + int(pw * 0.16), y, x0 + int(pw * 0.16) + w, y + max(3, int(ph * 0.03))],
                            radius=int(ph * 0.015), fill=GREEN + (255,))
    r = int(pw * 0.2)
    cx, cy = x0 + pw - int(pw * 0.1), y0 + ph - int(pw * 0.08)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=AMBER + (255,))
    d.line([cx - r * 0.5, cy, cx - r * 0.1, cy + r * 0.4, cx + r * 0.55, cy - r * 0.4],
           fill=INK + (255,), width=max(3, int(r * 0.28)), joint="curve")
    im = im.resize((size, size), Image.LANCZOS)
    if rounded:
        mask = Image.new("L", (s, s), 0)
        ImageDraw.Draw(mask).ellipse([0, 0, s - 1, s - 1], fill=255)
        im.putalpha(mask.resize((size, size), Image.LANCZOS))
    return im


legacy = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}
fore = {"mdpi": 108, "hdpi": 162, "xhdpi": 216, "xxhdpi": 324, "xxxhdpi": 432}
for name, px in legacy.items():
    d = f"{RES}/mipmap-{name}"
    os.makedirs(d, exist_ok=True)
    art(px).convert("RGB").save(f"{d}/ic_launcher.png")
    art(px, rounded=True).save(f"{d}/ic_launcher_round.png")
for name, px in fore.items():
    d = f"{RES}/mipmap-{name}"
    os.makedirs(d, exist_ok=True)
    art(px, scale=0.6, bg=False).save(f"{d}/ic_launcher_foreground.png")
print("icons written")
