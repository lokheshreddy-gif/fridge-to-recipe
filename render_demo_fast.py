import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import subprocess
from gtts import gTTS
import scipy.io.wavfile as wavfile

FRAME_WIDTH = 1920
FRAME_HEIGHT = 1080
FPS = 60
TOTAL_DURATION = 90 # seconds
TOTAL_FRAMES = FPS * TOTAL_DURATION # 5400 frames

ARTIFACT_DIR = "/Users/mallelajayaswaroopreddy/.gemini/antigravity-ide/brain/5cf80903-9a95-491c-a16e-1122ebcfca90"
RAW_FRAMES_DIR = "/Users/mallelajayaswaroopreddy/flam/scratch_frames"
OUTPUT_VIDEO_PATH = os.path.join(ARTIFACT_DIR, "fridge_to_recipe_demo.mp4")

FONT_PATH = "/System/Library/Fonts/HelveticaNeue.ttc"
try:
  FONT_LARGE = ImageFont.truetype(FONT_PATH, 72)
  FONT_TITLE = ImageFont.truetype(FONT_PATH, 54)
  FONT_OVERLAY = ImageFont.truetype(FONT_PATH, 42)
  FONT_SUB = ImageFont.truetype(FONT_PATH, 32)
except Exception:
  FONT_LARGE = FONT_TITLE = FONT_OVERLAY = FONT_SUB = ImageFont.load_default()

def load_ui_image(filename):
  filepath = os.path.join(RAW_FRAMES_DIR, filename)
  if not os.path.exists(filepath):
    img = Image.new('RGB', (FRAME_WIDTH, FRAME_HEIGHT), color=(15, 23, 42))
    return img
  img = Image.open(filepath).convert('RGB')
  if img.size != (FRAME_WIDTH, FRAME_HEIGHT):
    img = img.resize((FRAME_WIDTH, FRAME_HEIGHT), Image.Resampling.LANCZOS)
  return img

img_welcome = load_ui_image("01_welcome_intro.png")
img_input = load_ui_image("02_input_interface.png")
img_camera = load_ui_image("03_camera_modal.png")
img_recipe = load_ui_image("04_recipe_overview.png")
img_ingredients = load_ui_image("05_ingredients_swaps.png")
img_step1 = load_ui_image("06_cooking_step1.png")
img_step2 = load_ui_image("07_cooking_step2.png")
img_step4 = load_ui_image("08_cooking_step4.png")
img_done = load_ui_image("09_cooking_done_100.png")

def apply_color_grading(pil_img, contrast_factor=1.15, desat_bg=0.9):
  enhancer = ImageEnhance.Contrast(pil_img)
  img_contrast = enhancer.enhance(contrast_factor)
  sat_enhancer = ImageEnhance.Color(img_contrast)
  return sat_enhancer.enhance(desat_bg)

def draw_text_overlay(base_img, text, font=FONT_OVERLAY):
  img = base_img.copy().convert('RGBA')
  draw = ImageDraw.Draw(img)
  bbox = draw.textbbox((0, 0), text, font=font)
  txt_w = bbox[2] - bbox[0]
  txt_h = bbox[3] - bbox[1]
  cx = FRAME_WIDTH // 2
  cy = int(FRAME_HEIGHT * 0.88)
  pad_x = 36
  pad_y = 18
  rect_bounds = [cx - txt_w//2 - pad_x, cy - txt_h//2 - pad_y, cx + txt_w//2 + pad_x, cy + txt_h//2 + pad_y]
  
  pill = Image.new('RGBA', (FRAME_WIDTH, FRAME_HEIGHT), (0,0,0,0))
  pill_draw = ImageDraw.Draw(pill)
  pill_draw.rounded_rectangle(rect_bounds, radius=24, fill=(15, 23, 42, 210), outline=(99, 102, 241, 180), width=2)
  img = Image.alpha_composite(img, pill)
  draw = ImageDraw.Draw(img)
  draw.text((cx - txt_w//2 + 2, cy - txt_h//2 + 2), text, font=font, fill=(0, 0, 0, 180))
  draw.text((cx - txt_w//2, cy - txt_h//2), text, font=font, fill=(255, 255, 255, 255))
  return img.convert('RGB')

def render_title_card(title, tagline):
  base = Image.new('RGBA', (FRAME_WIDTH, FRAME_HEIGHT), (15, 23, 42, 255))
  draw = ImageDraw.Draw(base)
  
  eyebrow = "✨ AI-POWERED MEAL MAGIC"
  e_bbox = draw.textbbox((0, 0), eyebrow, font=FONT_SUB)
  e_w = e_bbox[2] - e_bbox[0]
  e_x = FRAME_WIDTH // 2 - e_w // 2
  e_y = FRAME_HEIGHT // 2 - 120
  draw.rounded_rectangle([e_x - 20, e_y - 10, e_x + e_w + 20, e_y + 36], radius=20, fill=(79, 70, 229, 60), outline=(129, 140, 248, 120), width=2)
  draw.text((e_x, e_y), eyebrow, font=FONT_SUB, fill=(165, 180, 252, 255))
  
  t_bbox = draw.textbbox((0, 0), title, font=FONT_LARGE)
  t_w = t_bbox[2] - t_bbox[0]
  t_x = FRAME_WIDTH // 2 - t_w // 2
  t_y = FRAME_HEIGHT // 2 - 30
  draw.text((t_x, t_y), title, font=FONT_LARGE, fill=(255, 255, 255, 255))
  
  sub_bbox = draw.textbbox((0, 0), tagline, font=FONT_TITLE)
  sub_w = sub_bbox[2] - sub_bbox[0]
  sub_x = FRAME_WIDTH // 2 - sub_w // 2
  sub_y = FRAME_HEIGHT // 2 + 70
  draw.text((sub_x, sub_y), tagline, font=FONT_TITLE, fill=(203, 213, 225, 255))
  return base.convert('RGB')

def render_outro_card(title, tech_stack, github_url):
  base = Image.new('RGBA', (FRAME_WIDTH, FRAME_HEIGHT), (15, 23, 42, 255))
  draw = ImageDraw.Draw(base)
  t_bbox = draw.textbbox((0, 0), title, font=FONT_LARGE)
  t_w = t_bbox[2] - t_bbox[0]
  t_x = FRAME_WIDTH // 2 - t_w // 2
  t_y = FRAME_HEIGHT // 2 - 110
  draw.text((t_x, t_y), title, font=FONT_LARGE, fill=(255, 255, 255, 255))
  
  s_bbox = draw.textbbox((0, 0), tech_stack, font=FONT_TITLE)
  s_w = s_bbox[2] - s_bbox[0]
  s_x = FRAME_WIDTH // 2 - s_w // 2
  s_y = FRAME_HEIGHT // 2 + 10
  draw.rounded_rectangle([s_x - 30, s_y - 12, s_x + s_w + 30, s_y + 55], radius=24, fill=(30, 41, 59, 220), outline=(99, 102, 241, 160), width=2)
  draw.text((s_x, s_y), tech_stack, font=FONT_TITLE, fill=(165, 180, 252, 255))
  
  g_bbox = draw.textbbox((0, 0), github_url, font=FONT_SUB)
  g_w = g_bbox[2] - g_bbox[0]
  g_x = FRAME_WIDTH // 2 - g_w // 2
  g_y = FRAME_HEIGHT // 2 + 110
  draw.text((g_x, g_y), github_url, font=FONT_SUB, fill=(148, 163, 184, 255))
  return base.convert('RGB')

print("[Fast Demo Render] Pre-rendering key sequence frames...")
graded_welcome = apply_color_grading(img_welcome)
graded_input = apply_color_grading(img_input)
graded_camera = apply_color_grading(img_camera)
graded_recipe = apply_color_grading(img_recipe)
graded_ingredients = apply_color_grading(img_ingredients)
graded_step1 = apply_color_grading(img_step1)
graded_step2 = apply_color_grading(img_step2)
graded_done = apply_color_grading(img_done)

intro_card = render_title_card("Fridge to Recipe", "Instant AI Meal Magic")
outro_card = render_outro_card("Fridge to Recipe", "Made with React, Claude AI, Node.js", "github.com/yourrepo/fridge-to-recipe")

# Pre-render text overlays
frame_prob = draw_text_overlay(graded_welcome, "Stop wondering what to cook")
frame_input_txt = draw_text_overlay(graded_input, "Input any ingredient")
frame_scan_txt = draw_text_overlay(graded_camera, "Real-time food scanning")
frame_recipe_txt = draw_text_overlay(graded_recipe, "AI recipes tailored to your tastes")
frame_cook_txt = draw_text_overlay(graded_step1, "Step-by-step guidance")

# Convert PIL Images to OpenCV BGR arrays
cv_intro = cv2.cvtColor(np.array(intro_card), cv2.COLOR_RGB2BGR)
cv_welcome = cv2.cvtColor(np.array(graded_welcome), cv2.COLOR_RGB2BGR)
cv_prob = cv2.cvtColor(np.array(frame_prob), cv2.COLOR_RGB2BGR)
cv_input_txt = cv2.cvtColor(np.array(frame_input_txt), cv2.COLOR_RGB2BGR)
cv_scan_txt = cv2.cvtColor(np.array(frame_scan_txt), cv2.COLOR_RGB2BGR)
cv_recipe_txt = cv2.cvtColor(np.array(frame_recipe_txt), cv2.COLOR_RGB2BGR)
cv_ing = cv2.cvtColor(np.array(graded_ingredients), cv2.COLOR_RGB2BGR)
cv_step1 = cv2.cvtColor(np.array(graded_step1), cv2.COLOR_RGB2BGR)
cv_cook_txt = cv2.cvtColor(np.array(frame_cook_txt), cv2.COLOR_RGB2BGR)
cv_step2 = cv2.cvtColor(np.array(graded_step2), cv2.COLOR_RGB2BGR)
cv_done = cv2.cvtColor(np.array(graded_done), cv2.COLOR_RGB2BGR)
cv_outro = cv2.cvtColor(np.array(outro_card), cv2.COLOR_RGB2BGR)

# Synthesize Audio Track
print("[Fast Demo Render] Generating audio track...")
tts_path = os.path.join(ARTIFACT_DIR, "intro_voice.mp3")
tts = gTTS("Welcome to Fridge to Recipe. AI powered meal magic.", lang='en')
tts.save(tts_path)

sample_rate = 44100
n_samples = sample_rate * TOTAL_DURATION
t = np.linspace(0, TOTAL_DURATION, n_samples, False)

notes = [349.23, 440.00, 523.25, 659.25, 392.00, 493.88]
music_wave = np.zeros(n_samples)
for i, freq in enumerate(notes):
  lfo = 0.5 + 0.5 * np.sin(2 * np.pi * 0.2 * t + i)
  music_wave += 0.15 * lfo * np.sin(2 * np.pi * freq * t)

pulse = 0.3 * np.sin(2 * np.pi * (70 / 60) * t)**4
music_wave += pulse * np.sin(2 * np.pi * 180 * t)
music_wave = music_wave / np.max(np.abs(music_wave)) * 0.25

music_wav_path = os.path.join(ARTIFACT_DIR, "ambient_music.wav")
wavfile.write(music_wav_path, sample_rate, (music_wave * 32767).astype(np.int16))

# Pipe frames directly into FFmpeg stdin for ultra-fast encoding
print("[Fast Demo Render] Streaming frames into FFmpeg pipeline...")
ffmpeg_cmd = [
  "ffmpeg", "-y",
  "-f", "rawvideo",
  "-vcodec", "rawvideo",
  "-s", f"{FRAME_WIDTH}x{FRAME_HEIGHT}",
  "-pix_fmt", "bgr24",
  "-r", str(FPS),
  "-i", "-",
  "-i", music_wav_path,
  "-i", tts_path,
  "-filter_complex", "[1:a][2:a]amerge=inputs=2[aout]",
  "-map", "0:v",
  "-map", "[aout]",
  "-c:v", "libx264",
  "-preset", "ultrafast",
  "-crf", "18",
  "-pix_fmt", "yuv420p",
  "-c:a", "aac",
  "-b:a", "192k",
  "-r", "60",
  OUTPUT_VIDEO_PATH
]

proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def get_frame(f):
  # 0 - 3s: Intro
  if f < 180: return cv_intro
  # 3 - 4.5s: Dissolve Intro -> Problem
  elif f < 270:
    alpha = float(f - 180) / 90.0
    return cv2.addWeighted(cv_intro, 1.0 - alpha, cv_prob, alpha, 0.0)
  # 4.5 - 8s: Problem Statement
  elif f < 480: return cv_prob
  # 8 - 9.5s: Dissolve -> Input
  elif f < 570:
    alpha = float(f - 480) / 90.0
    return cv2.addWeighted(cv_prob, 1.0 - alpha, cv_input_txt, alpha, 0.0)
  # 9.5 - 12s: Input Interface
  elif f < 720: return cv_input_txt
  # 12 - 18s: Real-time scanning overlay
  elif f < 1080: return cv_scan_txt
  # 18 - 25s: Input Interface
  elif f < 1500: return cv_input_txt
  # 25 - 26.5s: Dissolve -> Recipe
  elif f < 1590:
    alpha = float(f - 1500) / 90.0
    return cv2.addWeighted(cv_input_txt, 1.0 - alpha, cv_recipe_txt, alpha, 0.0)
  # 26.5 - 36s: Recipe & Overlay
  elif f < 2160: return cv_recipe_txt
  # 36 - 45s: Ingredients
  elif f < 2700: return cv_ing
  # 45 - 46.5s: Dissolve -> Step 1
  elif f < 2790:
    alpha = float(f - 2700) / 90.0
    return cv2.addWeighted(cv_ing, 1.0 - alpha, cv_step1, alpha, 0.0)
  # 46.5 - 50s: Step 1
  elif f < 3000: return cv_step1
  # 50 - 56s: Step guidance overlay
  elif f < 3360: return cv_cook_txt
  # 56 - 62s: Step 2
  elif f < 3720: return cv_step2
  # 62 - 70s: 100% Done
  elif f < 4200: return cv_done
  # 70 - 71.5s: Dissolve -> Outro
  elif f < 4290:
    alpha = float(f - 4200) / 90.0
    return cv2.addWeighted(cv_done, 1.0 - alpha, cv_outro, alpha, 0.0)
  # 71.5 - 88.5s: Outro
  elif f < 5310: return cv_outro
  # 88.5 - 90s: Fade black
  else:
    alpha = float(5400 - f) / 90.0
    black = np.zeros_like(cv_outro)
    return cv2.addWeighted(cv_outro, alpha, black, 1.0 - alpha, 0.0)

for f in range(TOTAL_FRAMES):
  frame = get_frame(f)
  proc.stdin.write(frame.tobytes())

proc.stdin.close()
proc.wait()

if os.path.exists(music_wav_path): os.remove(music_wav_path)
if os.path.exists(tts_path): os.remove(tts_path)

print(f"[Fast Demo Render] SUCCESS! 90-second 1080p 60fps MP4 saved to:\n{OUTPUT_VIDEO_PATH}")
