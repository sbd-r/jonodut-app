"""Draws the জনদূত launcher icons = the shield logo from the website header (run by the build workflow; needs Pillow)."""
import os
from PIL import Image, ImageDraw

BG = (13, 24, 20)
G1, G2 = (31, 163, 111), (7, 82, 56)
AMBER, PAPER, INK, LINE = (232, 163, 23), (255, 255, 255), (13, 24, 20), (11, 107, 74)
RES = "android/app/src/main/res"


def bez(p0, p1, p2, p3, n=40):
    out = []
    for i in range(n + 1):
        t = i / n
        a = (1 - t) ** 3
        b = 3 * (1 - t) ** 2 * t
        c = 3 * (1 - t) * t * t
        d = t ** 3
        out.append((a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]))
    return out


# website logo, viewBox 72 x 80
SHIELD = ([(36, 3), (66, 14), (66, 38)] + bez((66, 38), (66, 57), (54, 71), (36, 77))
          + bez((36, 77), (18, 71), (6, 57), (6, 38)) + [(6, 14)])


def logo(size, fill_frac, bg=True, circle=False):
    k = 4
    s = size * k
    im = Image.new("RGBA", (s, s), BG + (255,) if bg else (0, 0, 0, 0))
    u = s * fill_frac / 80.0
    ox, oy = (s - 72 * u) / 2, (s - 80 * u) / 2
    P = lambda x, y: (ox + x * u, oy + y * u)
    # gradient fill clipped to the shield
    grad = Image.new("RGB", (2, 2))
    mid = tuple((a + b) // 2 for a, b in zip(G1, G2))
    grad.putpixel((0, 0), G1); grad.putpixel((1, 1), G2); grad.putpixel((1, 0), mid); grad.putpixel((0, 1), mid)
    grad = grad.resize((s, s), Image.BILINEAR)
    mask = Image.new("L", (s, s), 0)
    pts = [P(x, y) for x, y in SHIELD]
    ImageDraw.Draw(mask).polygon(pts, fill=255)
    im.paste(grad, (0, 0), mask)
    d = ImageDraw.Draw(im)
    d.line(pts + [pts[0], pts[1]], fill=AMBER + (255,), width=max(3, int(3 * u)), joint="curve")
    # page
    x0, y0 = P(22, 20); x1, y1 = P(50, 54)
    d.rounded_rectangle([x0, y0, x1, y1], radius=3 * u, fill=PAPER + (255,))
    for (xa, xb, y) in ((27, 45, 29), (27, 45, 35), (27, 38, 41)):
        a, b = P(xa, y), P(xb, y)
        d.line([a, b], fill=LINE + (255,), width=max(2, int(2.5 * u)))
        for q in (a, b):
            r = 1.25 * u
            d.ellipse([q[0] - r, q[1] - r, q[0] + r, q[1] + r], fill=LINE + (255,))
    # amber check badge
    cx, cy = P(46, 50); r = 11 * u
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=AMBER + (255,))
    chk = [P(40.5, 50), P(44.5, 54), P(51.5, 46)]
    d.line(chk, fill=INK + (255,), width=max(3, int(3 * u)), joint="curve")
    for q in (chk[0], chk[2]):
        rr = 1.5 * u
        d.ellipse([q[0] - rr, q[1] - rr, q[0] + rr, q[1] + rr], fill=INK + (255,))
    im = im.resize((size, size), Image.LANCZOS)
    if circle:
        m = Image.new("L", (s, s), 0)
        ImageDraw.Draw(m).ellipse([0, 0, s - 1, s - 1], fill=255)
        im.putalpha(m.resize((size, size), Image.LANCZOS))
    return im


if __name__ == "__main__":
    legacy = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}
    fore = {"mdpi": 108, "hdpi": 162, "xhdpi": 216, "xxhdpi": 324, "xxxhdpi": 432}
    for name, px in legacy.items():
        d = f"{RES}/mipmap-{name}"
        os.makedirs(d, exist_ok=True)
        logo(px, 0.80).convert("RGB").save(f"{d}/ic_launcher.png")
        logo(px, 0.74, circle=True).save(f"{d}/ic_launcher_round.png")
    for name, px in fore.items():
        d = f"{RES}/mipmap-{name}"
        os.makedirs(d, exist_ok=True)
        logo(px, 0.56, bg=False).save(f"{d}/ic_launcher_foreground.png")
    # adaptive icon background colour = dark header colour of the app
    v = f"{RES}/values"
    os.makedirs(v, exist_ok=True)
    open(f"{v}/ic_launcher_background.xml", "w").write(
        '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#0D1814</color>\n</resources>\n')
    print("icons written")
            
