import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
import subprocess
from gtts import gTTS
import scipy.io.wavfile as wavfile

FRAME_FPS = 60
TOTAL_SEC = 90
TOTAL_FRAMES = FRAME_FPS * TOTAL_SEC # 5400 frames

ARTIFACT_DIR = "/Users/mallelajayaswaroopreddy/.gemini/antigravity-ide/brain/5cf80903-9a95-491c-a16e-1122ebcfca90"
RAW_FRAMES_DIR = "/Users/mallelajayaswaroopreddy/flam/scratch_frames"

FONT_PATH = "/System/Library/Fonts/HelveticaNeue.ttc"
try:
  FONT_HEADER = ImageFont.truetype(FONT_PATH, 72)
  FONT_TITLE = ImageFont.truetype(FONT_PATH, 50)
  FONT_BODY = ImageFont.truetype(FONT_PATH, 38)
  FONT_SMALL = ImageFont.truetype(FONT_PATH, 28)
except Exception:
  FONT_HEADER = FONT_TITLE = FONT_BODY = FONT_SMALL = ImageFont.load_default()

def load_base_image(filename, w=1920, h=1080):
  path_img = os.path.join(RAW_FRAMES_DIR, filename)
  if not os.path.exists(path_img):
    img = Image.new('RGB', (w, h), (15, 23, 42))
    return img
  img = Image.open(path_img).convert('RGB')
  if img.size != (w, h):
    img = img.resize((w, h), Image.Resampling.LANCZOS)
  return img

img_welcome = load_base_image("01_welcome_intro.png")
img_input = load_base_image("02_input_interface.png")
img_camera = load_base_image("03_camera_modal.png")
img_recipe = load_base_image("04_recipe_overview.png")
img_ingredients = load_base_image("05_ingredients_swaps.png")
img_step1 = load_base_image("06_cooking_step1.png")
img_step2 = load_base_image("07_cooking_step2.png")
img_done = load_base_image("09_cooking_done_100.png")

# AUTO-ENHANCEMENT: +15% Saturation boost & +15% Contrast boost
def enhance_color_and_contrast(pil_img):
  # 1. Color saturation boost (+15%)
  col_enhancer = ImageEnhance.Color(pil_img)
  img_sat = col_enhancer.enhance(1.15)
  # 2. Contrast boost (+15%)
  con_enhancer = ImageEnhance.Contrast(img_sat)
  return con_enhancer.enhance(1.15)

e_welcome = enhance_color_and_contrast(img_welcome)
e_input = enhance_color_and_contrast(img_input)
e_camera = enhance_color_and_contrast(img_camera)
e_recipe = enhance_color_and_contrast(img_recipe)
e_ingredients = enhance_color_and_contrast(img_ingredients)
e_step1 = enhance_color_and_contrast(img_step1)
e_step2 = enhance_color_and_contrast(img_step2)
e_done = enhance_color_and_contrast(img_done)

# LOWER THIRDS TEMPLATE
def draw_lower_third(base_img, title, subtitle):
  w, h = base_img.size
  img = base_img.copy().convert('RGBA')
  draw = ImageDraw.Draw(img)
  
  # Lower third bar at bottom left
  bar_x = 80
  bar_y = int(h * 0.78)
  bar_w = 640
  bar_h = 100
  
  overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
  odraw = ImageDraw.Draw(overlay)
  
  # Gradient glass container
  odraw.rounded_rectangle([bar_x, bar_y, bar_x + bar_w, bar_y + bar_h], radius=20, fill=(15, 23, 42, 220), outline=(99, 102, 241, 200), width=2)
  # Accent left border strip
  odraw.rounded_rectangle([bar_x, bar_y, bar_x + 8, bar_y + bar_h], radius=4, fill=(129, 140, 248, 255))
  
  img = Image.alpha_composite(img, overlay)
  draw = ImageDraw.Draw(img)
  
  draw.text((bar_x + 24, bar_y + 16), title, font=FONT_TITLE, fill=(255, 255, 255, 255))
  draw.text((bar_x + 24, bar_y + 60), subtitle, font=FONT_SMALL, fill=(165, 180, 252, 255))
  
  return img.convert('RGB')

# AUTO-CAPTIONS & TEXT FLASH OVERLAY
def draw_autocaption_flash(base_img, caption_text, flash_word=""):
  w, h = base_img.size
  img = base_img.copy().convert('RGBA')
  draw = ImageDraw.Draw(img)
  
  bbox = draw.textbbox((0, 0), caption_text, font=FONT_BODY)
  txt_w = bbox[2] - bbox[0]
  txt_h = bbox[3] - bbox[1]
  
  cx = w // 2
  cy = int(h * 0.88)
  pad_x = 32
  pad_y = 16
  
  overlay = Image.new('RGBA', (w, h), (0,0,0,0))
  odraw = ImageDraw.Draw(overlay)
  odraw.rounded_rectangle([cx - txt_w//2 - pad_x, cy - txt_h//2 - pad_y, cx + txt_w//2 + pad_x, cy + txt_h//2 + pad_y], radius=22, fill=(15, 23, 42, 215), outline=(99, 102, 241, 180), width=2)
  
  img = Image.alpha_composite(img, overlay)
  draw = ImageDraw.Draw(img)
  
  draw.text((cx - txt_w//2, cy - txt_h//2), caption_text, font=FONT_BODY, fill=(255, 255, 255, 255))
  return img.convert('RGB')

# GLITCH EFFECT FOR AI BADGES
def apply_glitch_effect(bgr_array):
  b, g, r = cv2.split(bgr_array)
  # Shift blue and red channels slightly for chromatic aberration glitch
  b_shifted = np.roll(b, 6, axis=1)
  r_shifted = np.roll(r, -6, axis=1)
  return cv2.merge([b_shifted, g, r_shifted])

# RENDER FULL 16:9 LANDSCAPE MASTER
print("[Antigravity Suite] Pre-rendering 16:9 Landscape master frames...")

c_welcome = draw_lower_third(e_welcome, "Smart AI Kitchen", "Multi-modal recipe generation")
c_input = draw_autocaption_flash(e_input, "Multi-Modal Input: Photo, Voice & Text")
c_camera = draw_autocaption_flash(e_camera, "AI Computer Vision & Color Feature Scan")
c_recipe = draw_autocaption_flash(e_recipe, "Instant Structured AI Recipe Output")
c_ingredients = draw_autocaption_flash(e_ingredients, "Age-Adaptive & Simple English AI Recipes")
c_step1 = draw_autocaption_flash(e_step1, "Interactive AI Step-by-Step Guidance")
c_done = draw_autocaption_flash(e_done, "100% Meal Preparation Completed!")

# Title Card
title_card = Image.new('RGB', (1920, 1080), (15, 23, 42))
t_draw = ImageDraw.Draw(title_card)
t_draw.text((600, 480), "Fridge to Recipe", font=FONT_HEADER, fill=(255, 255, 255))
t_draw.text((640, 580), "🤖 AI-POWERED MEAL MAGIC", font=FONT_TITLE, fill=(165, 180, 252))

# Outro Card
outro_card = Image.new('RGB', (1920, 1080), (15, 23, 42))
o_draw = ImageDraw.Draw(outro_card)
o_draw.text((600, 420), "Fridge to Recipe", font=FONT_HEADER, fill=(255, 255, 255))
o_draw.text((540, 540), "Made with React, Gemini AI, Node.js", font=FONT_TITLE, fill=(165, 180, 252))
o_draw.text((640, 640), "github.com/yourrepo/fridge-to-recipe", font=FONT_BODY, fill=(148, 163, 184))

# Convert to OpenCV BGR arrays
cv_title = cv2.cvtColor(np.array(title_card), cv2.COLOR_RGB2BGR)
cv_welcome = cv2.cvtColor(np.array(c_welcome), cv2.COLOR_RGB2BGR)
cv_input = cv2.cvtColor(np.array(c_input), cv2.COLOR_RGB2BGR)
cv_camera = cv2.cvtColor(np.array(c_camera), cv2.COLOR_RGB2BGR)
cv_recipe = cv2.cvtColor(np.array(c_recipe), cv2.COLOR_RGB2BGR)
cv_ingredients = cv2.cvtColor(np.array(c_ingredients), cv2.COLOR_RGB2BGR)
cv_step1 = cv2.cvtColor(np.array(c_step1), cv2.COLOR_RGB2BGR)
cv_step2 = cv2.cvtColor(np.array(e_step2), cv2.COLOR_RGB2BGR)
cv_done = cv2.cvtColor(np.array(c_done), cv2.COLOR_RGB2BGR)
cv_outro = cv2.cvtColor(np.array(outro_card), cv2.COLOR_RGB2BGR)

# Apply Glitch Effect to AI Camera Scan frame
cv_camera_glitch = apply_glitch_effect(cv_camera)

# SYNTHESIZE MULTI-LEVEL AUDIO TRACK WITH AMBIENT MUSIC & VOICEOVER
print("[Antigravity Suite] Synthesizing audio track with multi-level mixing...")
tts_path = os.path.join(ARTIFACT_DIR, "suite_intro_voice.mp3")
tts = gTTS("Welcome to Fridge to Recipe. AI powered meal magic.", lang='en')
tts.save(tts_path)

sample_rate = 44100
n_samples = sample_rate * TOTAL_SEC
t = np.linspace(0, TOTAL_SEC, n_samples, False)

# Beat Sync Grid (70 BPM = 1.166 Hz)
notes = [261.63, 329.63, 392.00, 493.88, 220.00, 349.23]
music_wave = np.zeros(n_samples)
for i, freq in enumerate(notes):
  lfo = 0.5 + 0.5 * np.sin(2 * np.pi * 0.15 * t + i)
  music_wave += 0.12 * lfo * np.sin(2 * np.pi * freq * t)

pulse = 0.25 * np.sin(2 * np.pi * (70 / 60) * t)**6
music_wave += pulse * np.sin(2 * np.pi * 140 * t)
music_wave = music_wave / np.max(np.abs(music_wave)) * 0.25

music_wav_path = os.path.join(ARTIFACT_DIR, "suite_ambient_music.wav")
wavfile.write(music_wav_path, sample_rate, (music_wave * 32767).astype(np.int16))

# EXPORT VARIATION 1: 16:9 LANDSCAPE (1920x1080)
print("[Antigravity Suite] Exporting Variation 1: 16:9 Landscape MP4...")
out_16x9 = os.path.join(ARTIFACT_DIR, "fridge_to_recipe_demo_16x9_landscape.mp4")

ffmpeg_cmd_16x9 = [
  "ffmpeg", "-y",
  "-f", "rawvideo", "-vcodec", "rawvideo",
  "-s", "1920x1080", "-pix_fmt", "bgr24", "-r", "60",
  "-i", "-",
  "-i", music_wav_path, "-i", tts_path,
  "-filter_complex", "[1:a][2:a]amerge=inputs=2[aout]",
  "-map", "0:v", "-map", "[aout]",
  "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
  "-c:a", "aac", "-b:a", "192k", "-r", "60",
  out_16x9
]

proc1 = subprocess.Popen(ffmpeg_cmd_16x9, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def get_16x9_frame(f):
  if f < 180: return cv_title
  elif f < 270:
    a = float(f - 180) / 90.0
    return cv2.addWeighted(cv_title, 1.0 - a, cv_welcome, a, 0.0)
  elif f < 720: return cv_welcome
  elif f < 810:
    a = float(f - 720) / 90.0
    return cv2.addWeighted(cv_welcome, 1.0 - a, cv_input, a, 0.0)
  elif f < 1440: return cv_input
  elif f < 1530:
    a = float(f - 1440) / 90.0
    return cv2.addWeighted(cv_input, 1.0 - a, cv_camera_glitch, a, 0.0)
  elif f < 2280: return cv_camera_glitch
  elif f < 2370:
    a = float(f - 2280) / 90.0
    return cv2.addWeighted(cv_camera_glitch, 1.0 - a, cv_recipe, a, 0.0)
  elif f < 3000: return cv_recipe
  elif f < 3090:
    a = float(f - 3000) / 90.0
    return cv2.addWeighted(cv_recipe, 1.0 - a, cv_ingredients, a, 0.0)
  elif f < 3840: return cv_ingredients
  elif f < 3930:
    a = float(f - 3840) / 90.0
    return cv2.addWeighted(cv_ingredients, 1.0 - a, cv_step1, a, 0.0)
  elif f < 4560: return cv_step1
  elif f < 4650:
    a = float(f - 4560) / 90.0
    return cv2.addWeighted(cv_step1, 1.0 - a, cv_done, a, 0.0)
  elif f < 5100: return cv_done
  elif f < 5190:
    a = float(f - 5100) / 90.0
    return cv2.addWeighted(cv_done, 1.0 - a, cv_outro, a, 0.0)
  else: return cv_outro

for f in range(TOTAL_FRAMES):
  proc1.stdin.write(get_16x9_frame(f).tobytes())

proc1.stdin.close()
proc1.wait()

# EXPORT VARIATION 2: 9:16 VERTICAL REELS/SHORTS (1080x1920)
print("[Antigravity Suite] Exporting Variation 2: 9:16 Vertical Mobile Reels MP4...")
out_9x16 = os.path.join(ARTIFACT_DIR, "fridge_to_recipe_demo_9x16_vertical.mp4")

ffmpeg_cmd_9x16 = [
  "ffmpeg", "-y",
  "-i", out_16x9,
  "-vf", "split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,gblur=sigma=20[bg];[b]scale=1080:-1[fg];[bg][fg]overlay=0:(H-h)/2",
  "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-c:a", "copy",
  out_9x16
]
subprocess.run(ffmpeg_cmd_9x16, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# EXPORT VARIATION 3: 1:1 SQUARE INSTAGRAM (1080x1080)
print("[Antigravity Suite] Exporting Variation 3: 1:1 Square Feed MP4...")
out_1x1 = os.path.join(ARTIFACT_DIR, "fridge_to_recipe_demo_1x1_square.mp4")

ffmpeg_cmd_1x1 = [
  "ffmpeg", "-y",
  "-i", out_16x9,
  "-vf", "split[a][b];[a]scale=1080:1080:force_original_aspect_ratio=increase,crop=1080:1080,gblur=sigma=15[bg];[b]scale=1080:-1[fg];[bg][fg]overlay=0:(H-h)/2",
  "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-c:a", "copy",
  out_1x1
]
subprocess.run(ffmpeg_cmd_1x1, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

if os.path.exists(music_wav_path): os.remove(music_wav_path)
if os.path.exists(tts_path): os.remove(tts_path)

print("[Antigravity Suite] ALL MULTI-FORMAT DEMO VARIATIONS CREATED SUCCESSFULLY!")
