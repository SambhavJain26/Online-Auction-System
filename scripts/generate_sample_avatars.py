import os
import math
from PIL import Image, ImageDraw, ImageFont

def create_gradient_avatar(filename, title, subtitle, bg_color1, bg_color2, accent_color, icon_type):
    width, height = 500, 500
    base = Image.new('RGB', (width, height), bg_color1)
    draw = ImageDraw.Draw(base)

    # Vertical gradient
    for y in range(height):
        ratio = y / height
        r = int(bg_color1[0] * (1 - ratio) + bg_color2[0] * ratio)
        g = int(bg_color1[1] * (1 - ratio) + bg_color2[1] * ratio)
        b = int(bg_color1[2] * (1 - ratio) + bg_color2[2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    # Outer decorative ring
    cx, cy, r_out = 250, 210, 140
    draw.ellipse([cx - r_out, cy - r_out, cx + r_out, cy + r_out], outline=accent_color, width=4)
    draw.ellipse([cx - r_out + 12, cy - r_out + 12, cx + r_out - 12, cy + r_out - 12], fill=(20, 24, 33, 200))

    # Draw stylized athlete silhouette or emblem inside ring
    # Head
    draw.ellipse([cx - 40, cy - 75, cx + 40, cy + 5], fill=accent_color)
    # Shoulders / Torso
    draw.chord([cx - 95, cy + 10, cx + 95, cy + 170], start=180, end=0, fill=accent_color)

    # Inner neckline cutout for jersey feel
    draw.polygon([(cx - 20, cy + 20), (cx + 20, cy + 20), (cx, cy + 60)], fill=(20, 24, 33))

    # Draw jersey number or sport indicator
    if icon_type == "cricket":
        # Draw cricket bat shape
        draw.line([cx + 50, cy - 50, cx + 90, cy + 30], fill=(255, 255, 255), width=8)
    elif icon_type == "futsal":
        # Small ball circle
        draw.ellipse([cx + 65, cy + 10, cx + 95, cy + 40], fill=(255, 255, 255), outline=accent_color, width=2)
    elif icon_type == "esports":
        # Controller outline or headset arc
        draw.arc([cx - 50, cy - 85, cx + 50, cy - 20], start=180, end=0, fill=(255, 255, 255), width=5)
    elif icon_type == "kabaddi":
        # Arm / power arc
        draw.arc([cx - 105, cy - 10, cx + 105, cy + 120], start=160, end=20, fill=(255, 255, 255), width=4)
    elif icon_type == "host":
        # Crown / star crest
        draw.polygon([(cx, cy - 95), (cx - 20, cy - 80), (cx - 10, cy - 65), (cx + 10, cy - 65), (cx + 20, cy - 80)], fill=(255, 215, 0))

    # Bottom Banner for Category
    draw.rectangle([50, 390, 450, 440], fill=(15, 23, 42), outline=accent_color, width=2)
    
    # Try loading default font or write centered text
    # Pillow default bitmap font
    font = ImageFont.load_default()
    
    # Centered texts
    t_bbox = draw.textbbox((0, 0), title, font=font)
    tw = t_bbox[2] - t_bbox[0]
    draw.text(((width - tw) // 2, 400), title, fill=(255, 255, 255), font=font)

    s_bbox = draw.textbbox((0, 0), subtitle, font=font)
    sw = s_bbox[2] - s_bbox[0]
    draw.text(((width - sw) // 2, 455), subtitle, fill=accent_color, font=font)

    base.save(filename, quality=95)
    print(f"Generated: {os.path.basename(filename)}")

def main():
    dest_dir = r"D:\antigravity_projects\tidy-up-projects\Online-Auction-System\public\imgs\uploads"
    os.makedirs(dest_dir, exist_ok=True)

    # 1. Remove all old real people photos
    for f in os.listdir(dest_dir):
        if f.endswith(('.png', '.jpg', '.jpeg')) and not f.startswith('.'):
            p = os.path.join(dest_dir, f)
            try:
                os.remove(p)
            except Exception as e:
                print(f"Failed to remove {f}: {e}")

    # 2. Generate clean stylized sample avatars
    avatars = [
        ("sample_host.png", "LEAGUE COMMISSIONER", "OFFICIAL HOST CONSOLE", (30, 41, 59), (15, 23, 42), (235, 94, 40), "host"),
        ("sample_franchise_apex.png", "APEX TITANS", "FRANCHISE OWNER #01", (15, 23, 42), (30, 58, 138), (56, 189, 248), "franchise"),
        ("sample_franchise_strikers.png", "ROYAL STRIKERS", "FRANCHISE OWNER #02", (24, 24, 27), (88, 28, 135), (192, 132, 252), "franchise"),
        ("sample_athlete.png", "SAMPLE ATHLETE", "PLAYER PROFILE #00", (15, 23, 42), (51, 65, 85), (235, 94, 40), "cricket"),
        
        # Cricket
        ("cricket_01.png", "ALEX STERLING", "TOP ORDER BATSMAN", (15, 23, 42), (6, 78, 59), (52, 211, 153), "cricket"),
        ("cricket_02.png", "LIAM VANCE", "EXPRESS FAST BOWLER", (15, 23, 42), (19, 78, 74), (45, 212, 191), "cricket"),
        ("cricket_03.png", "JORDAN COLE", "SPIN ALL-ROUNDER", (15, 23, 42), (22, 101, 52), (74, 222, 128), "cricket"),
        
        # Esports / Impetus
        ("esports_01.png", "MARCUS CHEN", "GRANDMASTER TACTICIAN", (24, 24, 27), (76, 29, 149), (167, 139, 250), "esports"),
        ("esports_02.png", "TYLER BROOKS", "ESPORTS IN-GAME LEADER", (15, 23, 42), (67, 56, 202), (129, 140, 248), "esports"),
        
        # Futsal
        ("futsal_01.png", "LUCAS SILVA", "PIVOT FORWARD STRIKER", (15, 23, 42), (12, 74, 110), (56, 189, 248), "futsal"),
        ("futsal_02.png", "DAVID MILLER", "DEFENSIVE GOALKEEPER", (15, 23, 42), (8, 145, 178), (103, 232, 249), "futsal"),
        
        # Kabaddi
        ("kabaddi_01.png", "VIKRAM THAPA", "CORNER DEFENDER", (24, 24, 27), (124, 45, 18), (251, 146, 60), "kabaddi"),
        ("kabaddi_02.png", "RAJESH RANA", "POWER RAIDER", (24, 24, 27), (154, 52, 18), (249, 115, 22), "kabaddi"),
    ]

    for fname, title, sub, c1, c2, acc, itype in avatars:
        fpath = os.path.join(dest_dir, fname)
        create_gradient_avatar(fpath, title, sub, c1, c2, acc, itype)

    print("All sample avatars generated successfully.")

if __name__ == "__main__":
    main()
