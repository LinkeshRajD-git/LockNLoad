#!/usr/bin/env python3
"""Generate the Lock N Load logo matching the brand image"""
from PIL import Image, ImageDraw, ImageFont
import os

WIDTH, HEIGHT = 500, 500
BG_COLOR = (233, 78, 36)  # #E94E24 - the red-orange brand color
TEXT_COLOR = (0, 0, 0)

img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
draw = ImageDraw.Draw(img)

# Try to find a bold font
font_paths = [
    '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    '/usr/share/fonts/dejavu-sans-fonts/DejaVuSans-Bold.ttf',
    '/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf',
    '/usr/share/fonts/TTF/DejaVuSans-Bold.ttf',
    '/usr/share/fonts/google-noto/NotoSans-Bold.ttf',
    '/usr/share/fonts/liberation-sans/LiberationSans-Bold.ttf',
]

font_big = None
font_small = None
for fp in font_paths:
    if os.path.exists(fp):
        font_big = ImageFont.truetype(fp, 80)
        font_small = ImageFont.truetype(fp, 50)
        break

if font_big is None:
    font_big = ImageFont.load_default()
    font_small = ImageFont.load_default()

# Draw "LOCK" text
lock_bbox = draw.textbbox((0, 0), "LOCK", font=font_big)
lock_w = lock_bbox[2] - lock_bbox[0]
draw.text(((WIDTH - lock_w) / 2, 100), "LOCK", fill=TEXT_COLOR, font=font_big)

# Draw "N" text (smaller, centered)
n_bbox = draw.textbbox((0, 0), "N", font=font_small)
n_w = n_bbox[2] - n_bbox[0]
draw.text(((WIDTH - n_w) / 2, 200), "N", fill=TEXT_COLOR, font=font_small)

# Draw "LOAD" text
load_bbox = draw.textbbox((0, 0), "LOAD", font=font_big)
load_w = load_bbox[2] - load_bbox[0]
draw.text(((WIDTH - load_w) / 2, 270), "LOAD", fill=TEXT_COLOR, font=font_big)

# Save to both locations
customer_path = '/home/rajsystem/LockNLoad/campus-bites/customer-app/public/logo.png'
admin_path = '/home/rajsystem/LockNLoad/campus-bites/admin-app/public/logo.png'

img.save(customer_path, 'PNG')
img.save(admin_path, 'PNG')

# Also save a smaller version for favicon
favicon = img.resize((64, 64), Image.LANCZOS)
favicon.save('/home/rajsystem/LockNLoad/campus-bites/customer-app/public/favicon.ico')
favicon.save('/home/rajsystem/LockNLoad/campus-bites/admin-app/public/favicon.ico')

print(f"Logo saved to {customer_path}")
print(f"Logo saved to {admin_path}")
print("Done!")
