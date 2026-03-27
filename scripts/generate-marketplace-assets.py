#!/usr/bin/env python3

from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont, ImageOps


ROOT = Path("/Users/worajedt/GitHub/daisyui-vscode-snippets")
IMAGES = ROOT / "images"

random.seed(7)


def load_font(size: int, kind: str = "sans") -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = {
        "sans": [
            "/System/Library/Fonts/Avenir Next.ttc",
            "/System/Library/Fonts/HelveticaNeue.ttc",
            "/System/Library/Fonts/SFNS.ttf",
        ],
        "mono": [
            "/System/Library/Fonts/SFNSMono.ttf",
            "/System/Library/Fonts/Menlo.ttc",
            "/System/Library/Fonts/Monaco.ttf",
        ],
        "sketch": [
            "/System/Library/Fonts/Supplemental/ChalkboardSE.ttc",
            "/System/Library/Fonts/Supplemental/Chalkboard.ttc",
            "/System/Library/Fonts/MarkerFelt.ttc",
        ],
    }
    for path in candidates[kind]:
        if Path(path).exists():
            return ImageFont.truetype(path, size=size)
    return ImageFont.load_default()


FONT_TITLE = load_font(74, "sketch")
FONT_SUBTITLE = load_font(34, "sans")
FONT_SMALL = load_font(24, "sans")
FONT_MONO = load_font(26, "mono")
FONT_MONO_SMALL = load_font(20, "mono")
FONT_SKETCH_MED = load_font(42, "sketch")


PAPER = (249, 244, 232)
PAPER_SHADOW = (235, 227, 210)
INK = (68, 52, 45)
MUTED = (102, 89, 76)
YELLOW = (252, 205, 74)
ORANGE = (246, 157, 74)
PINK = (234, 120, 150)
BLUE = (86, 148, 214)
GREEN = (113, 173, 84)
PURPLE = (140, 109, 193)
DARK_PANEL = (38, 41, 52)
PANEL = (247, 243, 235)


def paper_texture(size: tuple[int, int], strength: int = 12) -> Image.Image:
    width, height = size
    img = Image.new("RGB", size, PAPER)
    px = img.load()
    for y in range(height):
        for x in range(width):
            drift = int(10 * math.sin((x + y) / 33.0))
            grain = random.randint(-strength, strength)
            r = max(0, min(255, PAPER[0] + grain + drift // 6))
            g = max(0, min(255, PAPER[1] + grain))
            b = max(0, min(255, PAPER[2] + grain - drift // 5))
            px[x, y] = (r, g, b)
    return img.filter(ImageFilter.GaussianBlur(0.4))


def jittered_outline(draw: ImageDraw.ImageDraw, pts: list[tuple[int, int]], color: tuple[int, int, int], width: int, passes: int = 4) -> None:
    for i in range(passes):
        offset_pts = [(x + random.randint(-2, 2), y + random.randint(-2, 2)) for x, y in pts]
        draw.line(offset_pts, fill=color, width=max(1, width - i), joint="curve")


def pencil_hatch(base: Image.Image, bbox: tuple[int, int, int, int], color: tuple[int, int, int], spacing: int = 12, alpha: int = 70) -> None:
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    x0, y0, x1, y1 = bbox
    for x in range(x0 - 80, x1 + 80, spacing):
        draw.line([(x, y1), (x + 110, y0)], fill=(*color, alpha), width=2)
    for x in range(x0 - 80, x1 + 80, spacing * 2):
        draw.line([(x, y1), (x + 90, y0)], fill=(*color, alpha // 2), width=1)
    base.alpha_composite(overlay)


def draw_cloud_mascot(base: Image.Image, center: tuple[int, int], scale: float = 1.0) -> None:
    draw = ImageDraw.Draw(base)
    cx, cy = center
    radius = int(92 * scale)
    puffs = [
        (cx - radius, cy, radius),
        (cx - radius // 2, cy - radius // 2, int(radius * 0.92)),
        (cx + radius // 5, cy - radius // 2, int(radius * 0.96)),
        (cx + radius, cy - radius // 8, int(radius * 0.88)),
        (cx + radius // 2, cy + radius // 2, int(radius * 0.92)),
        (cx - radius // 3, cy + radius // 2, int(radius * 1.0)),
    ]
    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    for px, py, pr in puffs:
        shadow_draw.ellipse((px - pr, py - pr + 14, px + pr, py + pr + 14), fill=(188, 170, 124, 45))
    shadow = shadow.filter(ImageFilter.GaussianBlur(16))
    base.alpha_composite(shadow)

    body = Image.new("RGBA", base.size, (0, 0, 0, 0))
    body_draw = ImageDraw.Draw(body)
    for px, py, pr in puffs:
        body_draw.ellipse((px - pr, py - pr, px + pr, py + pr), fill=YELLOW)
    highlight = Image.new("RGBA", base.size, (0, 0, 0, 0))
    hdraw = ImageDraw.Draw(highlight)
    hdraw.ellipse((cx - int(radius * 1.6), cy - int(radius * 1.5), cx + int(radius * 0.9), cy + int(radius * 0.2)), fill=(255, 244, 179, 70))
    highlight = highlight.filter(ImageFilter.GaussianBlur(20))
    body = Image.alpha_composite(body, highlight)
    base.alpha_composite(body)

    outline_points = []
    for angle in range(0, 361, 8):
        rad = math.radians(angle)
        wobble = math.sin(rad * 3) * radius * 0.22 + math.cos(rad * 5) * radius * 0.08
        r = radius * 1.5 + wobble
        outline_points.append((int(cx + math.cos(rad) * r), int(cy + math.sin(rad) * r)))
    jittered_outline(draw, outline_points, ORANGE, max(3, int(6 * scale)))
    pencil_hatch(base, (cx - int(radius * 1.7), cy - int(radius * 1.5), cx + int(radius * 1.7), cy + int(radius * 1.5)), ORANGE, spacing=max(10, int(14 * scale)), alpha=55)

    eye_offset_x = int(52 * scale)
    eye_y = cy - int(12 * scale)
    eye_r = int(19 * scale)
    for ex in (cx - eye_offset_x, cx + eye_offset_x):
        draw.ellipse((ex - eye_r, eye_y - eye_r, ex + eye_r, eye_y + eye_r), fill=(24, 20, 22))
        draw.ellipse((ex - eye_r + 8, eye_y - eye_r + 7, ex + 2, eye_y + 1), fill=(255, 255, 255))
        draw.ellipse((ex + 2, eye_y - eye_r + 3, ex + 11, eye_y - 4), fill=(255, 255, 255))
        draw.ellipse((ex + 11, eye_y + 8, ex + 17, eye_y + 14), fill=(255, 219, 91))

    blush_r = int(14 * scale)
    for bx in (cx - int(82 * scale), cx + int(82 * scale)):
        draw.ellipse((bx - blush_r, cy + int(38 * scale) - blush_r, bx + blush_r, cy + int(38 * scale) + blush_r), fill=(255, 171, 191, 135))
        jittered_outline(draw, [(bx - blush_r, cy + int(52 * scale)), (bx + blush_r, cy + int(38 * scale))], PINK, max(1, int(2 * scale)), passes=2)

    smile_bbox = (cx - int(25 * scale), cy + int(8 * scale), cx + int(25 * scale), cy + int(44 * scale))
    draw.arc(smile_bbox, 18, 160, fill=INK, width=max(2, int(4 * scale)))


def rounded_box(draw: ImageDraw.ImageDraw, bbox: tuple[int, int, int, int], radius: int, fill, outline=None, width: int = 1):
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont | ImageFont.ImageFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textlength(candidate, font=font) <= max_width or not current:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_editor_window(base: Image.Image, bbox: tuple[int, int, int, int], title: str, suggestions: list[str], body_lines: list[tuple[str, tuple[int, int, int]]], accent: tuple[int, int, int] = BLUE) -> None:
    draw = ImageDraw.Draw(base)
    x0, y0, x1, y1 = bbox
    rounded_box(draw, (x0 + 8, y0 + 14, x1 + 8, y1 + 14), 26, (185, 172, 150, 60))
    rounded_box(draw, bbox, 26, PANEL, outline=(204, 191, 176), width=2)
    rounded_box(draw, (x0, y0, x1, y0 + 60), 26, (245, 236, 221))
    draw.rectangle((x0, y0 + 30, x1, y0 + 60), fill=(245, 236, 221))
    for idx, dot in enumerate(((236, 110, 94), (244, 190, 79), (112, 189, 120))):
        draw.ellipse((x0 + 20 + idx * 22, y0 + 20, x0 + 34 + idx * 22, y0 + 34), fill=dot)
    draw.text((x0 + 72, y0 + 16), title, fill=MUTED, font=FONT_SMALL)

    sidebar_w = 68
    draw.rectangle((x0, y0 + 60, x0 + sidebar_w, y1), fill=DARK_PANEL)
    for idx, color in enumerate(((98, 184, 255), (241, 164, 87), (140, 109, 193), (112, 189, 120))):
        top = y0 + 94 + idx * 50
        rounded_box(draw, (x0 + 18, top, x0 + 50, top + 32), 10, color)

    editor_x = x0 + sidebar_w
    draw.rectangle((editor_x, y0 + 60, x1, y1), fill=(255, 252, 246))
    line_y = y0 + 96
    for idx, (content, color) in enumerate(body_lines, start=1):
        draw.text((editor_x + 26, line_y), f"{idx:>2}", fill=(170, 159, 145), font=FONT_MONO_SMALL)
        draw.text((editor_x + 78, line_y), content, fill=color, font=FONT_MONO)
        line_y += 42

    suggestion_top = y1 - 220
    rounded_box(draw, (editor_x + 60, suggestion_top, x1 - 24, y1 - 26), 20, (254, 252, 247), outline=(208, 194, 178), width=2)
    highlight_y = suggestion_top + 20
    rounded_box(draw, (editor_x + 74, highlight_y, x1 - 38, highlight_y + 42), 14, (*accent, 55))
    for idx, item in enumerate(suggestions):
        item_y = suggestion_top + 22 + idx * 44
        label_fill = PURPLE if idx == 0 else INK
        draw.text((editor_x + 94, item_y + 5), item, fill=label_fill, font=FONT_MONO_SMALL)


def make_icon() -> None:
    size = 512
    base = paper_texture((size, size)).convert("RGBA")
    fade = Image.new("RGBA", (size, size), (255, 255, 255, 0))
    d = ImageDraw.Draw(fade)
    d.ellipse((40, 30, 460, 450), fill=(255, 255, 255, 34))
    fade = fade.filter(ImageFilter.GaussianBlur(28))
    base.alpha_composite(fade)
    draw_cloud_mascot(base, (258, 258), 1.42)
    IMAGES.mkdir(parents=True, exist_ok=True)
    base.save(IMAGES / "icon.png")


def make_banner() -> None:
    width, height = 1600, 900
    base = paper_texture((width, height)).convert("RGBA")
    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.ellipse((-120, -20, 760, 780), fill=(255, 228, 141, 44))
    od.ellipse((980, 90, 1720, 860), fill=(245, 176, 127, 46))
    overlay = overlay.filter(ImageFilter.GaussianBlur(46))
    base.alpha_composite(overlay)

    draw_cloud_mascot(base, (350, 420), 1.68)
    draw = ImageDraw.Draw(base)
    draw.text((720, 170), "DaisyUI HTML Snippets", fill=INK, font=FONT_TITLE)
    subtitle = "Curated HTML snippets with clean prefixes, valid markup, and tab-ready placeholders."
    for idx, line in enumerate(wrap_text(draw, subtitle, FONT_SUBTITLE, 720)):
        draw.text((728, 270 + idx * 40), line, fill=MUTED, font=FONT_SUBTITLE)
    rounded_box(draw, (724, 345, 952, 402), 24, (255, 241, 195), outline=(242, 186, 87), width=2)
    draw.text((752, 356), "!d   d-card   d-alert", fill=INK, font=FONT_SMALL)

    body_lines = [
        ("<!DOCTYPE html>", BLUE),
        ('<html lang=\"en\">', BLUE),
        ("<head>", BLUE),
        ('  <title>${1:DaisyUI Page}</title>', GREEN),
        ("</head>", BLUE),
        ('<body class=\"min-h-screen bg-base-200\">', BLUE),
        ("  <div class=\"hero\">", BLUE),
        ("    ${0}", ORANGE),
    ]
    suggestions = ["d-card-image", "d-card", "d-alert-info", "d-btn"]
    draw_editor_window(base, (820, 420, 1490, 820), "demo.html", suggestions, body_lines, accent=GREEN)
    base.convert("RGB").save(IMAGES / "banner.png", quality=92)


def make_screenshot(filename: str, title: str, suggestions: list[str], lines: list[tuple[str, tuple[int, int, int]]], accent: tuple[int, int, int]) -> None:
    width, height = 1600, 920
    base = paper_texture((width, height)).convert("RGBA")
    draw = ImageDraw.Draw(base)
    draw.text((70, 48), title, fill=INK, font=FONT_SKETCH_MED)
    draw.text((72, 102), "HTML-only DaisyUI snippets with practical defaults and editor-friendly placeholders.", fill=MUTED, font=FONT_SMALL)
    draw_editor_window(base, (58, 160, 1542, 844), "landing-page.html", suggestions, lines, accent=accent)
    base.convert("RGB").save(IMAGES / filename, quality=92)


def gif_frames() -> list[Image.Image]:
    frames: list[Image.Image] = []
    steps = [
        ("!", []),
        ("!d", ["!d", "d-dropdown", "d-btn"]),
        ("d-c", ["d-card-image", "d-card", "d-checkbox-primary"]),
        ("d-card", ["d-card-image", "d-card", "d-card-horizontal"]),
        ("d-card-image", []),
    ]
    for text, suggestions in steps:
        width, height = 1280, 760
        base = paper_texture((width, height)).convert("RGBA")
        draw = ImageDraw.Draw(base)
        draw.text((58, 34), "Snippet flow demo", fill=INK, font=FONT_SKETCH_MED)
        body_lines = [
            ("<!DOCTYPE html>", BLUE),
            ('<html lang=\"en\">', BLUE),
            ("<body>", BLUE),
            (f"  {text}", PURPLE),
            ("</body>", BLUE),
            ("</html>", BLUE),
        ]
        draw_editor_window(base, (40, 96, 1240, 700), "demo.html", suggestions or ["Press Tab to expand"], body_lines, accent=PURPLE)
        frames.append(base.convert("P", palette=Image.ADAPTIVE))
    return frames


def make_gif() -> None:
    frames = gif_frames()
    frames[0].save(
        IMAGES / "demo.gif",
        save_all=True,
        append_images=frames[1:],
        duration=[500, 700, 700, 700, 1100],
        loop=0,
        disposal=2,
    )


def main() -> None:
    IMAGES.mkdir(parents=True, exist_ok=True)
    make_icon()
    make_banner()
    make_screenshot(
        "screenshot.jpg",
        "Fast starter and predictable prefixes",
        ["!d", "d-card-image", "d-card", "d-alert"],
        [
            ("<!DOCTYPE html>", BLUE),
            ('<html lang=\"en\">', BLUE),
            ("<head>", BLUE),
            ('  <title>${1:Marketing Page}</title>', GREEN),
            ("</head>", BLUE),
            ('<body class=\"min-h-screen bg-base-200\">', BLUE),
            ("  !d", PURPLE),
            ("", INK),
        ],
        GREEN,
    )
    make_screenshot(
        "screenshot-2.jpg",
        "Curated completions for common DaisyUI flows",
        ["d-card-image", "d-card", "d-dropdown-end", "d-modal"],
        [
            ("<section class=\"p-8\">", BLUE),
            ("  <div class=\"max-w-5xl mx-auto\">", BLUE),
            ("    d-card", PURPLE),
            ("  </div>", BLUE),
            ("</section>", BLUE),
        ],
        BLUE,
    )
    make_gif()


if __name__ == "__main__":
    main()
