import os
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance, ImageOps

W, H = 1200, 750

# Load source service images
sms = Image.open('assets/images/services/bulk-sms.png').convert('RGBA')
wa = Image.open('assets/images/services/bulk-whatsapp.png').convert('RGBA')
rcs = Image.open('assets/images/services/rcs-messaging.png').convert('RGBA')
voice = Image.open('assets/images/services/voice-calls.png').convert('RGBA')

def apply_edge_vignette(image, strength=0.45):
    arr = np.array(image, dtype=np.float32)
    h, w = arr.shape[:2]
    y, x = np.mgrid[0:h, 0:w]
    nx = (x - w / 2.0) / (w / 2.0)
    ny = (y - h / 2.0) / (h / 2.0)
    dist = np.sqrt(nx**4 + ny**4)
    vig = np.clip((dist - 0.72) / 0.55, 0, 1)
    for c in range(3):
        arr[:, :, c] = arr[:, :, c] * (1.0 - vig * strength)
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))

# ==========================================
# SLIDE 1: OMNICHANNEL 4-CHANNEL HUB
# ==========================================
print("Generating Slide 1...")
scale_h1 = int(H * 1.18)
sms_s1 = sms.resize((int(sms.width * scale_h1 / sms.height), scale_h1), Image.Resampling.LANCZOS)
wa_s1 = wa.resize((int(wa.width * scale_h1 / wa.height), scale_h1), Image.Resampling.LANCZOS)
rcs_s1 = rcs.resize((int(rcs.width * scale_h1 / rcs.height), scale_h1), Image.Resampling.LANCZOS)
voice_s1 = voice.resize((int(voice.width * scale_h1 / voice.height), scale_h1), Image.Resampling.LANCZOS)

# Slide 1 Aurora Background
bg1 = np.zeros((H, W, 4), dtype=np.float32)
y, x = np.mgrid[0:H, 0:W]
nx = x / float(W)
ny = y / float(H)

g_cyan = np.clip(1.0 - np.sqrt((nx - 0.12)**2 + (ny - 0.4)**2) * 1.4, 0, 1)**2
g_magenta = np.clip(1.0 - np.sqrt((nx - 0.88)**2 + (ny - 0.35)**2) * 1.4, 0, 1)**2
g_violet = np.clip(1.0 - np.sqrt((nx - 0.5)**2 + (ny - 0.5)**2) * 1.2, 0, 1)**2

bg1[:, :, 0] = 16 + g_cyan * 15 + g_magenta * 155 + g_violet * 85
bg1[:, :, 1] = 10 + g_cyan * 130 + g_magenta * 20 + g_violet * 45
bg1[:, :, 2] = 34 + g_cyan * 195 + g_magenta * 185 + g_violet * 195
bg1[:, :, 3] = 255
canvas1 = Image.fromarray(np.clip(bg1, 0, 255).astype(np.uint8))

# WhatsApp element on left
m_wa1 = np.zeros((scale_h1, wa_s1.width), dtype=np.float32)
for i in range(wa_s1.width):
    p = i / float(wa_s1.width)
    if p < 0.42:
        m_wa1[:, i] = 1.0
    elif p < 0.62:
        m_wa1[:, i] = 0.5 * (1.0 + np.cos(np.pi * (p - 0.42) / 0.20))
wa_s1.putalpha(Image.fromarray((m_wa1 * 255).astype(np.uint8), mode='L'))

# Voice element on right
m_v1 = np.zeros((scale_h1, voice_s1.width), dtype=np.float32)
for i in range(voice_s1.width):
    p = i / float(voice_s1.width)
    if p > 0.58:
        m_v1[:, i] = 1.0
    elif p > 0.38:
        m_v1[:, i] = 0.5 * (1.0 - np.cos(np.pi * (p - 0.38) / 0.20))
voice_s1.putalpha(Image.fromarray((m_v1 * 255).astype(np.uint8), mode='L'))

# Central RCS Master device
m_rcs1 = np.ones((scale_h1, rcs_s1.width), dtype=np.float32)
fade_w = int(rcs_s1.width * 0.26)
for i in range(fade_w):
    factor = 0.5 * (1.0 - np.cos(np.pi * i / fade_w))
    m_rcs1[:, i] *= factor
    m_rcs1[:, rcs_s1.width - 1 - i] *= factor
rcs_s1.putalpha(Image.fromarray((m_rcs1 * 255).astype(np.uint8), mode='L'))

# Extract floating 3D OTP Shield from SMS
shield_box = (370, 75, 520, 235)
shield = sms.crop(shield_box)
# scale shield to floating size
s_shield = int(shield.height * 1.15)
shield_scaled = shield.resize((int(shield.width * 1.15), s_shield), Image.Resampling.LANCZOS)
# feather shield edges
s_mask = np.ones((s_shield, shield_scaled.width), dtype=np.float32)
for iy in range(s_shield):
    for ix in range(shield_scaled.width):
        dx = (ix - shield_scaled.width/2.0)/(shield_scaled.width/2.0)
        dy = (iy - s_shield/2.0)/(s_shield/2.0)
        d = np.sqrt(dx**2 + dy**2)
        if d > 0.70:
            s_mask[iy, ix] = np.clip(1.0 - (d - 0.70)/0.30, 0, 1)**1.5
shield_scaled.putalpha(Image.fromarray((s_mask * 255).astype(np.uint8), mode='L'))

# Assemble Slide 1
canvas1.paste(wa_s1, (-80, (H - scale_h1)//2), wa_s1)
canvas1.paste(voice_s1, (W - voice_s1.width + 80, (H - scale_h1)//2), voice_s1)
canvas1.paste(rcs_s1, ((W - rcs_s1.width)//2, (H - scale_h1)//2), rcs_s1)
# Paste glowing shield near bottom-left/center to represent SMS
canvas1.paste(shield_scaled, (140, 480), shield_scaled)

final_slide1 = apply_edge_vignette(canvas1)
final_slide1.convert('RGB').save('assets/images/hero/hero-slide-1.png', 'PNG')
final_slide1.convert('RGB').save('assets/images/hero/hero-slide-1.webp', 'WEBP', quality=92)
print("Slide 1 generated successfully.")

# ==========================================
# SLIDE 2: HIGH-REACH BULK SMS & WHATSAPP
# ==========================================
print("Generating Slide 2...")
scale_h2 = int(H * 1.18)
sms_s2 = sms.resize((int(sms.width * scale_h2 / sms.height), scale_h2), Image.Resampling.LANCZOS)
wa_s2 = wa.resize((int(wa.width * scale_h2 / wa.height), scale_h2), Image.Resampling.LANCZOS)

# Background for Slide 2 (Cyan / Emerald Green / Indigo)
bg2 = np.zeros((H, W, 4), dtype=np.float32)
g_cyan2 = np.clip(1.0 - np.sqrt((nx - 0.2)**2 + (ny - 0.5)**2) * 1.4, 0, 1)**2
g_green2 = np.clip(1.0 - np.sqrt((nx - 0.8)**2 + (ny - 0.5)**2) * 1.4, 0, 1)**2
g_mid2 = np.clip(1.0 - np.sqrt((nx - 0.5)**2 + (ny - 0.6)**2) * 1.3, 0, 1)**2

bg2[:, :, 0] = 10 + g_cyan2 * 20 + g_green2 * 10 + g_mid2 * 20
bg2[:, :, 1] = 14 + g_cyan2 * 125 + g_green2 * 185 + g_mid2 * 75
bg2[:, :, 2] = 28 + g_cyan2 * 215 + g_green2 * 125 + g_mid2 * 145
bg2[:, :, 3] = 255
canvas2 = Image.fromarray(np.clip(bg2, 0, 255).astype(np.uint8))

# SMS mask (smooth fade into center)
m_sms2 = np.ones((scale_h2, sms_s2.width), dtype=np.float32)
for i in range(sms_s2.width):
    p = i / float(sms_s2.width)
    if p > 0.72:
        m_sms2[:, i] = 0.0
    elif p > 0.40:
        m_sms2[:, i] = 0.5 * (1.0 + np.cos(np.pi * (p - 0.40) / 0.32))
sms_s2.putalpha(Image.fromarray((m_sms2 * 255).astype(np.uint8), mode='L'))

# WhatsApp mask (smooth fade into center)
m_wa2 = np.ones((scale_h2, wa_s2.width), dtype=np.float32)
for i in range(wa_s2.width):
    p = i / float(wa_s2.width)
    if p < 0.28:
        m_wa2[:, i] = 0.0
    elif p < 0.60:
        m_wa2[:, i] = 0.5 * (1.0 - np.cos(np.pi * (p - 0.28) / 0.32))
wa_s2.putalpha(Image.fromarray((m_wa2 * 255).astype(np.uint8), mode='L'))

canvas2.paste(sms_s2, (-40, (H - scale_h2)//2), sms_s2)
canvas2.paste(wa_s2, (W - wa_s2.width + 40, (H - scale_h2)//2), wa_s2)

final_slide2 = apply_edge_vignette(canvas2)
final_slide2.convert('RGB').save('assets/images/hero/hero-slide-2.png', 'PNG')
final_slide2.convert('RGB').save('assets/images/hero/hero-slide-2.webp', 'WEBP', quality=92)
print("Slide 2 generated successfully.")

# ==========================================
# SLIDE 3: VOICE CALLS & RCS MESSAGING
# ==========================================
print("Generating Slide 3...")
scale_h3 = int(H * 1.18)
voice_s3 = voice.resize((int(voice.width * scale_h3 / voice.height), scale_h3), Image.Resampling.LANCZOS)
rcs_s3 = rcs.resize((int(rcs.width * scale_h3 / rcs.height), scale_h3), Image.Resampling.LANCZOS)

# Background for Slide 3 (Magenta / Electric Purple / Dark Midnight)
bg3 = np.zeros((H, W, 4), dtype=np.float32)
g_voice3 = np.clip(1.0 - np.sqrt((nx - 0.15)**2 + (ny - 0.4)**2) * 1.4, 0, 1)**2
g_rcs3 = np.clip(1.0 - np.sqrt((nx - 0.85)**2 + (ny - 0.4)**2) * 1.4, 0, 1)**2
g_mid3 = np.clip(1.0 - np.sqrt((nx - 0.5)**2 + (ny - 0.6)**2) * 1.3, 0, 1)**2

bg3[:, :, 0] = 18 + g_voice3 * 125 + g_rcs3 * 155 + g_mid3 * 65
bg3[:, :, 1] = 8 + g_voice3 * 40 + g_rcs3 * 25 + g_mid3 * 20
bg3[:, :, 2] = 32 + g_voice3 * 145 + g_rcs3 * 195 + g_mid3 * 165
bg3[:, :, 3] = 255
canvas3 = Image.fromarray(np.clip(bg3, 0, 255).astype(np.uint8))

# Voice mask
m_v3 = np.ones((scale_h3, voice_s3.width), dtype=np.float32)
for i in range(voice_s3.width):
    p = i / float(voice_s3.width)
    if p > 0.70:
        m_v3[:, i] = 0.0
    elif p > 0.38:
        m_v3[:, i] = 0.5 * (1.0 + np.cos(np.pi * (p - 0.38) / 0.32))
voice_s3.putalpha(Image.fromarray((m_v3 * 255).astype(np.uint8), mode='L'))

# RCS mask
m_rcs3 = np.ones((scale_h3, rcs_s3.width), dtype=np.float32)
for i in range(rcs_s3.width):
    p = i / float(rcs_s3.width)
    if p < 0.25:
        m_rcs3[:, i] = 0.0
    elif p < 0.58:
        m_rcs3[:, i] = 0.5 * (1.0 - np.cos(np.pi * (p - 0.25) / 0.33))
rcs_s3.putalpha(Image.fromarray((m_rcs3 * 255).astype(np.uint8), mode='L'))

canvas3.paste(voice_s3, (-50, (H - scale_h3)//2), voice_s3)
canvas3.paste(rcs_s3, (W - rcs_s3.width + 45, (H - scale_h3)//2), rcs_s3)

final_slide3 = apply_edge_vignette(canvas3)
final_slide3.convert('RGB').save('assets/images/hero/hero-slide-3.png', 'PNG')
final_slide3.convert('RGB').save('assets/images/hero/hero-slide-3.webp', 'WEBP', quality=92)
print("Slide 3 generated successfully.")

