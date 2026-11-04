import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1672, 941

# Base reference
ref_path = r'C:\Users\DELL\Downloads\Smarter Communication, Stronger Connections.png'
ref = Image.open(ref_path).convert('RGB')

# Fonts
font_title = ImageFont.truetype('segoeuib.ttf', 62)
font_body = ImageFont.truetype('segoeui.ttf', 24)
font_btn = ImageFont.truetype('segoeuib.ttf', 22)
font_card_title = ImageFont.truetype('segoeuib.ttf', 28)
font_card_sub = ImageFont.truetype('segoeui.ttf', 17)

def create_feathered_patch(base_img, x1, y1, x2, y2, feather=25):
    patch = base_img.crop((x1, y1, x2, y2)).copy()
    draw = ImageDraw.Draw(patch)
    pw, ph = patch.size
    for y in range(ph):
        # soft vertical blend matching white background
        draw.line([(0, y), (pw, y)], fill=(254, 252, 254))
    
    # Create alpha mask with feathered edges
    mask = np.ones((ph, pw), dtype=np.float32)
    for x in range(min(feather, pw)):
        f = (x / float(feather))
        mask[:, x] *= f
        mask[:, pw - 1 - x] *= f
    for y in range(min(feather, ph)):
        f = (y / float(feather))
        mask[y, :] *= f
        mask[ph - 1 - y, :] *= f
        
    mask_img = Image.fromarray((mask * 255).astype(np.uint8), mode='L')
    return patch, mask_img

def draw_tricolor_bar(draw, x, y, width=220, height=6):
    for i in range(width):
        p = i / float(width)
        if p < 0.44:
            col = (255, 110, 20)
        elif p < 0.54:
            col = (255, 200, 100)
        else:
            col = (16, 160, 60)
        draw.line([(x + i, y), (x + i, y + height)], fill=col)

def tint_wave_and_glow(img, target_color=(16, 185, 129), strength=0.35):
    # Tint the lower portion of the image with a target color glow
    arr = np.array(img, dtype=np.float32)
    h, w = arr.shape[:2]
    y, x = np.mgrid[0:h, 0:w]
    
    # Focus on lower wave area (y > 720) and central ring (x ~ 800-1100, y ~ 300-600)
    wave_weight = np.clip((y - 700) / 200.0, 0, 1)**1.5
    ring_dist = np.sqrt(((x - 920)/250.0)**2 + ((y - 450)/200.0)**2)
    ring_weight = np.clip(1.0 - np.abs(ring_dist - 1.0) * 2.5, 0, 1)**2 * 0.4
    
    total_weight = np.clip(wave_weight + ring_weight, 0, 1) * strength
    
    for c in range(3):
        arr[:, :, c] = arr[:, :, c] * (1.0 - total_weight) + target_color[c] * total_weight
        
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))

# ==========================================
# BUILD SLIDE 2: BULK SMS & WHATSAPP
# ==========================================
print("Creating Slide 2...")
slide2 = ref.copy()

# 1. Clear text area
patch, mask = create_feathered_patch(slide2, 50, 160, 670, 715, feather=30)
slide2.paste(patch, (50, 160), mask)

draw2 = ImageDraw.Draw(slide2)

# Headline
draw2.text((65, 175), 'Reach', font=font_title, fill=(15, 23, 42))
draw2.text((65, 245), 'Thousands.', font=font_title, fill=(15, 23, 42))
draw2.text((65, 320), 'Make Every', font=font_title, fill=(5, 150, 105)) # Emerald Green
draw2.text((65, 395), 'Message Count.', font=font_title, fill=(5, 150, 105))

# Tricolor bar
draw_tricolor_bar(draw2, 65, 485, width=220, height=6)

# Body text
body_text2 = 'Deliver meaningful business communication through reliable\nBulk SMS and WhatsApp messaging solutions designed for scale.'
draw2.text((65, 515), body_text2, font=font_body, fill=(51, 65, 85), spacing=8)

# Buttons
# Button 1: Solid Emerald Green
draw2.rounded_rectangle([65, 625, 425, 688], radius=31, fill=(5, 150, 105))
draw2.text((95, 642), 'Explore Messaging Solutions \u2192', font=font_btn, fill=(255, 255, 255))

# Button 2: White Outlined
draw2.rounded_rectangle([445, 625, 630, 688], radius=31, fill=(255, 255, 255), outline=(15, 23, 42), width=2)
draw2.text((490, 642), 'Get a Quote', font=font_btn, fill=(15, 23, 42))

# Tint Slide 2 slightly towards emerald/teal
slide2_final = tint_wave_and_glow(slide2, target_color=(16, 185, 129), strength=0.28)

# Save Slide 2
slide2_final.save('assets/images/hero/hero-slide-2.png', 'PNG')
slide2_final.save('assets/images/hero/hero-slide-2.webp', 'WEBP', quality=95)
print("Slide 2 created successfully.")

# ==========================================
# BUILD SLIDE 3: VOICE CALLS & RCS MESSAGING
# ==========================================
print("Creating Slide 3...")
slide3 = ref.copy()

# 1. Clear text area
patch3, mask3 = create_feathered_patch(slide3, 50, 160, 670, 715, feather=30)
slide3.paste(patch3, (50, 160), mask3)

draw3 = ImageDraw.Draw(slide3)

# Headline
draw3.text((65, 175), 'The Future of', font=font_title, fill=(15, 23, 42))
draw3.text((65, 245), 'Business', font=font_title, fill=(15, 23, 42))
draw3.text((65, 320), 'Communication', font=font_title, fill=(219, 39, 119)) # Magenta/Pink
draw3.text((65, 395), 'Is Here.', font=font_title, fill=(219, 39, 119))

# Tricolor bar
draw_tricolor_bar(draw3, 65, 485, width=220, height=6)

# Body text
body_text3 = 'Make your customer interactions more engaging with automated\nVoice Calls and next-generation interactive RCS Messaging.'
draw3.text((65, 515), body_text3, font=font_body, fill=(51, 65, 85), spacing=8)

# Buttons
# Button 1: Solid Magenta/Pink
draw3.rounded_rectangle([65, 625, 400, 688], radius=31, fill=(219, 39, 119))
draw3.text((95, 642), 'Discover Our Solutions \u2192', font=font_btn, fill=(255, 255, 255))

# Button 2: White Outlined
draw3.rounded_rectangle([420, 625, 600, 688], radius=31, fill=(255, 255, 255), outline=(15, 23, 42), width=2)
draw3.text((465, 642), 'Contact Us', font=font_btn, fill=(15, 23, 42))

# Tint Slide 3 slightly towards magenta/pink
slide3_final = tint_wave_and_glow(slide3, target_color=(219, 39, 119), strength=0.28)

# Save Slide 3
slide3_final.save('assets/images/hero/hero-slide-3.png', 'PNG')
slide3_final.save('assets/images/hero/hero-slide-3.webp', 'WEBP', quality=95)
print("Slide 3 created successfully.")

