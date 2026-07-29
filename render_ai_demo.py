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
TOTAL_DURATION = 96 # 96 seconds for 25% slowed down pacing & clarity
TOTAL_FRAMES = FPS * TOTAL_DURATION # 5760 frames

ARTIFACT_DIR = "/Users/mallelajayaswaroopreddy/.gemini/antigravity-ide/brain/5cf80903-9a95-491c-a16e-1122ebcfca90"
RAW_FRAMES_DIR = "/Users/mallelajayaswaroopreddy/flam/scratch_frames"
OUTPUT_VIDEO_PATH = os.path.join(ARTIFACT_DIR, "fridge_to_recipe_ai_portfolio_demo.mp4")

FONT_PATH = "/System/Library/Fonts/HelveticaNeue.ttc"
try:
  FONT_LARGE = ImageFont.truetype(FONT_PATH, 76)
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
img_done = load_ui_image("09_cooking_done_100.png")

def apply_color_grading(pil_img, contrast_factor=1.15, desat_bg=0.92):
  enhancer = ImageEnhance.Contrast(pil_img)
  img_contrast = enhancer.enhance(contrast_factor)
  sat_enhancer = ImageEnhance.Color(img_contrast)
  return sat_enhancer.enhance(desat_bg)

def draw_ai_feature_overlay(base_img, main_label, sub_label=""):
  img = base_img.copy().convert('RGBA')
  draw = ImageDraw.Draw(img)
  
  # Calculate dimensions
  bbox = draw.textbbox((0, 0), main_label, font=FONT_OVERLAY)
  txt_w = bbox[2] - bbox[0]
  txt_h = bbox[3] - bbox[1]
  
  cx = FRAME_WIDTH // 2
  cy = int(FRAME_HEIGHT * 0.86)
  pad_x = 40
  pad_y = 20
  rect_bounds = [cx - txt_w//2 - pad_x, cy - txt_h//2 - pad_y, cx + txt_w//2 + pad_x, cy + txt_h//2 + pad_y]
  
  pill = Image.new('RGBA', (FRAME_WIDTH, FRAME_HEIGHT), (0,0,0,0))
  pill_draw = ImageDraw.Draw(pill)
  
  # AI Accent Glow Pill (Purple to Cyan border)
  pill_draw.rounded_rectangle(rect_bounds, radius=24, fill=(15, 23, 42, 220), outline=(99, 102, 241, 200), width=3)
  
  img = Image.alpha_composite(img, pill)
  draw = ImageDraw.Draw(img)
  
  # Text Shadow & Bright White Fill
  draw.text((cx - txt_w//2 + 2, cy - txt_h//2 + 2), main_label, font=FONT_OVERLAY, fill=(0, 0, 0, 200))
  draw.text((cx - txt_w//2, cy - txt_h//2), main_label, font=FONT_OVERLAY, fill=(255, 255, 255, 255))
  
  return img.convert('RGB')

def render_ai_title_card(title, tagline):
  base = Image.new('RGBA', (FRAME_WIDTH, FRAME_HEIGHT), (15, 23, 42, 255))
  draw = ImageDraw.Draw(base)
  
  # AI Badge
  eyebrow = "🤖 MULTI-MODAL AI RECIPE ENGINE"
  e_bbox = draw.textbbox((0, 0), eyebrow, font=FONT_SUB)
  e_w = e_bbox[2] - e_bbox[0]
  e_x = FRAME_WIDTH // 2 - e_w // 2
  e_y = FRAME_HEIGHT // 2 - 130
  draw.rounded_rectangle([e_x - 24, e_y - 12, e_x + e_w + 24, e_y + 38], radius=22, fill=(79, 70, 229, 70), outline=(129, 140, 248, 140), width=2)
  draw.text((e_x, e_y), eyebrow, font=FONT_SUB, fill=(165, 180, 252, 255))
  
  # Title
  t_bbox = draw.textbbox((0, 0), title, font=FONT_LARGE)
  t_w = t_bbox[2] - t_bbox[0]
  t_x = FRAME_WIDTH // 2 - t_w // 2
  t_y = FRAME_HEIGHT // 2 - 35
  draw.text((t_x + 3, t_y + 3), title, font=FONT_LARGE, fill=(0, 0, 0, 180))
  draw.text((t_x, t_y), title, font=FONT_LARGE, fill=(255, 255, 255, 255))
  
  # Tagline
  sub_bbox = draw.textbbox((0, 0), tagline, font=FONT_TITLE)
  sub_w = sub_bbox[2] - sub_bbox[0]
  sub_x = FRAME_WIDTH // 2 - sub_w // 2
  sub_y = FRAME_HEIGHT // 2 + 75
  draw.text((sub_x, sub_y), tagline, font=FONT_TITLE, fill=(203, 213, 225, 255))
  return base.convert('RGB')

def render_tech_outro_card(title, tech_stack, github_url):
  base = Image.new('RGBA', (FRAME_WIDTH, FRAME_HEIGHT), (15, 23, 42, 255))
  draw = ImageDraw.Draw(base)
  
  t_bbox = draw.textbbox((0, 0), title, font=FONT_LARGE)
  t_w = t_bbox[2] - t_bbox[0]
  t_x = FRAME_WIDTH // 2 - t_w // 2
  t_y = FRAME_HEIGHT // 2 - 120
  draw.text((t_x, t_y), title, font=FONT_LARGE, fill=(255, 255, 255, 255))
  
  s_bbox = draw.textbbox((0, 0), tech_stack, font=FONT_TITLE)
  s_w = s_bbox[2] - s_bbox[0]
  s_x = FRAME_WIDTH // 2 - s_w // 2
  s_y = FRAME_HEIGHT // 2 + 10
  draw.rounded_rectangle([s_x - 32, s_y - 14, s_x + s_w + 32, s_y + 58], radius=26, fill=(30, 41, 59, 230), outline=(99, 102, 241, 180), width=2)
  draw.text((s_x, s_y), tech_stack, font=FONT_TITLE, fill=(165, 180, 252, 255))
  
  g_bbox = draw.textbbox((0, 0), github_url, font=FONT_SUB)
  g_w = g_bbox[2] - g_bbox[0]
  g_x = FRAME_WIDTH // 2 - g_w // 2
  g_y = FRAME_HEIGHT // 2 + 115
  draw.text((g_x, g_y), github_url, font=FONT_SUB, fill=(148, 163, 184, 255))
  return base.convert('RGB')

print("[AI Demo Render] Pre-rendering key sequence frames with AI feature overlays...")
graded_welcome = apply_color_grading(img_welcome)
graded_input = apply_color_grading(img_input)
graded_camera = apply_color_grading(img_camera)
graded_recipe = apply_color_grading(img_recipe)
graded_ingredients = apply_color_grading(img_ingredients)
graded_step1 = apply_color_grading(img_step1)
graded_step2 = apply_color_grading(img_step2)
graded_done = apply_color_grading(img_done)

intro_card = render_ai_title_card("Fridge to Recipe", "AI-Powered Meal Magic")
outro_card = render_tech_outro_card("Fridge to Recipe", "Made with React, Gemini AI, Node.js", "github.com/yourrepo/fridge-to-recipe")

# Feature labels emphasizing AI capabilities
frame_welcome_txt = draw_ai_feature_overlay(graded_welcome, "Smart AI Kitchen Assistant")
frame_multimodal_txt = draw_ai_feature_overlay(graded_input, "Multi-Modal Input: Photo, Voice & Text")
frame_vision_txt = draw_ai_feature_overlay(graded_camera, "AI Computer Vision & Color Feature Scan")
frame_generation_txt = draw_ai_feature_overlay(graded_recipe, "Instant Structured AI Recipe Generation")
frame_age_txt = draw_ai_feature_overlay(graded_ingredients, "Age-Adaptive & Simple English AI Recipes")
frame_step_txt = draw_ai_feature_overlay(graded_step1, "Interactive AI Step-by-Step Cooking Guidance")
frame_done_txt = draw_ai_feature_overlay(graded_done, "100% Meal Preparation Completed!")

# Convert PIL Images to OpenCV BGR arrays
cv_intro = cv2.cvtColor(np.array(intro_card), cv2.COLOR_RGB2BGR)
cv_welcome_txt = cv2.cvtColor(np.array(frame_welcome_txt), cv2.COLOR_RGB2BGR)
cv_multimodal_txt = cv2.cvtColor(np.array(frame_multimodal_txt), cv2.COLOR_RGB2BGR)
cv_vision_txt = cv2.cvtColor(np.array(frame_vision_txt), cv2.COLOR_RGB2BGR)
cv_generation_txt = cv2.cvtColor(np.array(frame_generation_txt), cv2.COLOR_RGB2BGR)
cv_age_txt = cv2.cvtColor(np.array(frame_age_txt), cv2.COLOR_RGB2BGR)
cv_step_txt = cv2.cvtColor(np.array(frame_step_txt), cv2.COLOR_RGB2BGR)
cv_step2 = cv2.cvtColor(np.array(graded_step2), cv2.COLOR_RGB2BGR)
cv_done_txt = cv2.cvtColor(np.array(frame_done_txt), cv2.COLOR_RGB2BGR)
cv_outro = cv2.cvtColor(np.array(outro_card), cv2.COLOR_RGB2BGR)

# Synthesize Lofi / Ambient Background Music & Spoken Voiceover
print("[AI Demo Render] Generating Lofi / Ambient audio track...")
tts_path = os.path.join(ARTIFACT_DIR, "ai_intro_voice.mp3")
tts = gTTS("Fridge to Recipe. AI powered meal magic.", lang='en')
tts.save(tts_path)

sample_rate = 44100
n_samples = sample_rate * TOTAL_DURATION
t = np.linspace(0, TOTAL_DURATION, n_samples, False)

# Lofi Warm Ambient Chord Frequencies (Cmaj7 / Am7: 261.63, 329.63, 392.00, 493.88, 220.00, 349.23)
lofi_notes = [261.63, 329.63, 392.00, 493.88, 220.00, 349.23]
music_wave = np.zeros(n_samples)

for i, freq in enumerate(lofi_notes):
  lfo = 0.5 + 0.5 * np.sin(2 * np.pi * 0.15 * t + i) # warm lofi filter modulation
  music_wave += 0.12 * lfo * np.sin(2 * np.pi * freq * t)

# Relaxed Lofi Heartbeat Pulse (65 BPM = 1.083 Hz)
pulse = 0.25 * np.sin(2 * np.pi * (65 / 60) * t)**6
music_wave += pulse * np.sin(2 * np.pi * 140 * t) # soft lofi kick
music_wave = music_wave / np.max(np.abs(music_wave)) * 0.22 # gentle lofi background volume

music_wav_path = os.path.join(ARTIFACT_DIR, "lofi_ambient_music.wav")
wavfile.write(music_wav_path, sample_rate, (music_wave * 32767).astype(np.int16))

# Pipe frames into FFmpeg for high-quality MP4 rendering
print("[AI Demo Render] Streaming frames into FFmpeg pipeline...")
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
  "-preset", "medium",
  "-crf", "18",
  "-pix_fmt", "yuv420p",
  "-c:a", "aac",
  "-b:a", "192k",
  "-r", "60",
  OUTPUT_VIDEO_PATH
]

proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# Timeline for 96 Seconds (5,760 frames total)
# Fade duration = 1.5s (90 frames)
def get_frame(f):
  # 0 - 3s (0 - 180): Title Card (3s)
  if f < 180:
    return cv_intro
  # 3s - 4.5s (180 - 270): Fade Title -> Welcome Screen (1.5s)
  elif f < 270:
    alpha = float(f - 180) / 90.0
    return cv2.addWeighted(cv_intro, 1.0 - alpha, cv_welcome_txt, alpha, 0.0)
  # 4.5s - 12s (270 - 720): Welcome Entrance Screen (7.5s)
  elif f < 720:
    return cv_welcome_txt
  # 12s - 13.5s (720 - 810): Fade Welcome -> Multi-Modal Input (1.5s)
  elif f < 810:
    alpha = float(f - 720) / 90.0
    return cv2.addWeighted(cv_welcome_txt, 1.0 - alpha, cv_multimodal_txt, alpha, 0.0)
  # 13.5s - 24s (810 - 1440): Multi-Modal Input Walkthrough (10.5s)
  elif f < 1440:
    return cv_multimodal_txt
  # 24s - 25.5s (1440 - 1530): Fade -> Computer Vision Camera Scan (1.5s)
  elif f < 1530:
    alpha = float(f - 1440) / 90.0
    return cv2.addWeighted(cv_multimodal_txt, 1.0 - alpha, cv_vision_txt, alpha, 0.0)
  # 25.5s - 38s (1530 - 2280): Computer Vision Scanner (12.5s)
  elif f < 2280:
    return cv_vision_txt
  # 38s - 39.5s (2280 - 2370): Fade -> AI Recipe Generation (1.5s)
  elif f < 2370:
    alpha = float(f - 2280) / 90.0
    return cv2.addWeighted(cv_vision_txt, 1.0 - alpha, cv_generation_txt, alpha, 0.0)
  # 39.5s - 50s (2370 - 3000): Structured AI Recipe Generation (10.5s)
  elif f < 3000:
    return cv_generation_txt
  # 50s - 51.5s (3000 - 3090): Fade -> Age-Adaptive & Ingredients (1.5s)
  elif f < 3090:
    alpha = float(f - 3000) / 90.0
    return cv2.addWeighted(cv_generation_txt, 1.0 - alpha, cv_age_txt, alpha, 0.0)
  # 51.5s - 64s (3090 - 3840): Age-Adaptive Ingredients & Swaps (12.5s)
  elif f < 3840:
    return cv_age_txt
  # 64s - 65.5s (3840 - 3930): Fade -> Step-by-Step Guidance (1.5s)
  elif f < 3930:
    alpha = float(f - 3840) / 90.0
    return cv2.addWeighted(cv_age_txt, 1.0 - alpha, cv_step_txt, alpha, 0.0)
  # 65.5s - 76s (3930 - 4560): Interactive AI Cooking Scene (10.5s)
  elif f < 4560:
    return cv_step_txt
  # 76s - 77.5s (4560 - 4650): Fade -> Cooking Done 100% (1.5s)
  elif f < 4650:
    alpha = float(f - 4560) / 90.0
    return cv2.addWeighted(cv_step_txt, 1.0 - alpha, cv_done_txt, alpha, 0.0)
  # 77.5s - 85s (4650 - 5100): 100% Completion Pause (7.5s)
  elif f < 5100:
    return cv_done_txt
  # 85s - 86.5s (5100 - 5190): Fade -> Tech Stack Outro (1.5s)
  elif f < 5190:
    alpha = float(f - 5100) / 90.0
    return cv2.addWeighted(cv_done_txt, 1.0 - alpha, cv_outro, alpha, 0.0)
  # 86.5s - 94.5s (5190 - 5670): Tech Stack Outro Slide (8s)
  elif f < 5670:
    return cv_outro
  # 94.5s - 96s (5670 - 5760): Fade to Black (1.5s)
  else:
    alpha = float(5760 - f) / 90.0
    black = np.zeros_like(cv_outro)
    return cv2.addWeighted(cv_outro, alpha, black, 1.0 - alpha, 0.0)

for f in range(TOTAL_FRAMES):
  frame = get_frame(f)
  proc.stdin.write(frame.tobytes())

proc.stdin.close()
proc.wait()

if os.path.exists(music_wav_path): os.remove(music_wav_path)
if os.path.exists(tts_path): os.remove(tts_path)

print(f"[AI Demo Render] SUCCESS! Portfolio AI product demo video saved to:\n{OUTPUT_VIDEO_PATH}")
