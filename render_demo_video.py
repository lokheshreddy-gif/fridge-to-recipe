import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
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

# Font helpers
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
    # Fallback solid frame
    img = Image.new('RGB', (FRAME_WIDTH, FRAME_HEIGHT), color=(15, 23, 42))
    return img
  img = Image.open(filepath).convert('RGB')
  if img.size != (FRAME_WIDTH, FRAME_HEIGHT):
    img = img.resize((FRAME_WIDTH, FRAME_HEIGHT), Image.Resampling.LANCZOS)
  return img

# Load base screen images
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
  # 1. Boost Contrast +15%
  enhancer = ImageEnhance.Contrast(pil_img)
  img_contrast = enhancer.enhance(contrast_factor)
  
  # 2. Desaturate slightly (10% desaturation)
  sat_enhancer = ImageEnhance.Color(img_contrast)
  img_graded = sat_enhancer.enhance(desat_bg)
  return img_graded

def create_vignette(width=1920, height=1080, opacity=0.10):
  # Generate radial vignette gradient
  x = np.linspace(-1, 1, width)
  y = np.linspace(-1, 1, height)
  xx, yy = np.meshgrid(x, y)
  radius = np.sqrt(xx**2 + yy**2)
  vignette_mask = np.clip((radius - 0.5) / 0.7, 0, 1) * opacity
  vignette_img = np.zeros((height, width, 4), dtype=np.uint8)
  vignette_img[:, :, 3] = (vignette_mask * 255).astype(np.uint8)
  return Image.fromarray(vignette_img, mode='RGBA')

VIGNETTE_OVERLAY = create_vignette()

def apply_zoom(pil_img, zoom_scale=1.0):
  if zoom_scale <= 1.0:
    return pil_img
  w, h = pil_img.size
  new_w = int(w / zoom_scale)
  new_h = int(h / zoom_scale)
  left = (w - new_w) // 2
  top = (h - new_h) // 2
  cropped = pil_img.crop((left, top, left + new_w, top + new_h))
  return cropped.resize((w, h), Image.Resampling.LANCZOS)

def draw_text_overlay(base_img, text, font=FONT_OVERLAY):
  # Positioned at bottom 15% of screen (Y ~ 880)
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
  
  # Frosted glass background pill
  pill = Image.new('RGBA', (FRAME_WIDTH, FRAME_HEIGHT), (0,0,0,0))
  pill_draw = ImageDraw.Draw(pill)
  pill_draw.rounded_rectangle(rect_bounds, radius=24, fill=(15, 23, 42, 210), outline=(99, 102, 241, 180), width=2)
  
  img = Image.alpha_composite(img, pill)
  draw = ImageDraw.Draw(img)
  
  # Text with shadow
  shadow_offset = 2
  draw.text((cx - txt_w//2 + shadow_offset, cy - txt_h//2 + shadow_offset), text, font=font, fill=(0, 0, 0, 180))
  draw.text((cx - txt_w//2, cy - txt_h//2), text, font=font, fill=(255, 255, 255, 255))
  
  return img.convert('RGB')

def render_title_card(title, tagline, progress=1.0):
  # Sleek dark slate gradient background
  base = Image.new('RGBA', (FRAME_WIDTH, FRAME_HEIGHT), (15, 23, 42, 255))
  draw = ImageDraw.Draw(base)
  
  # Glowing background aura
  aura = Image.new('RGBA', (FRAME_WIDTH, FRAME_HEIGHT), (0, 0, 0, 0))
  aura_draw = ImageDraw.Draw(aura)
  aura_draw.ellipse([FRAME_WIDTH//2 - 400, FRAME_HEIGHT//2 - 300, FRAME_WIDTH//2 + 400, FRAME_HEIGHT//2 + 300], fill=(99, 102, 241, 60))
  base = Image.alpha_composite(base, aura)
  draw = ImageDraw.Draw(base)
  
  # Eyebrow Pill
  eyebrow = "✨ AI-POWERED MEAL MAGIC"
  e_bbox = draw.textbbox((0, 0), eyebrow, font=FONT_SUB)
  e_w = e_bbox[2] - e_bbox[0]
  e_x = FRAME_WIDTH // 2 - e_w // 2
  e_y = FRAME_HEIGHT // 2 - 120
  
  draw.rounded_rectangle([e_x - 20, e_y - 10, e_x + e_w + 20, e_y + 36], radius=20, fill=(79, 70, 229, 60), outline=(129, 140, 248, 120), width=2)
  draw.text((e_x, e_y), eyebrow, font=FONT_SUB, fill=(165, 180, 252, 255))
  
  # Main Title
  t_bbox = draw.textbbox((0, 0), title, font=FONT_LARGE)
  t_w = t_bbox[2] - t_bbox[0]
  t_x = FRAME_WIDTH // 2 - t_w // 2
  t_y = FRAME_HEIGHT // 2 - 30
  
  draw.text((t_x + 3, t_y + 3), title, font=FONT_LARGE, fill=(0, 0, 0, 180))
  draw.text((t_x, t_y), title, font=FONT_LARGE, fill=(255, 255, 255, 255))
  
  # Tagline
  sub_bbox = draw.textbbox((0, 0), tagline, font=FONT_TITLE)
  sub_w = sub_bbox[2] - sub_bbox[0]
  sub_x = FRAME_WIDTH // 2 - sub_w // 2
  sub_y = FRAME_HEIGHT // 2 + 70
  draw.text((sub_x, sub_y), tagline, font=FONT_TITLE, fill=(203, 213, 225, 255))
  
  return base.convert('RGB')

def render_outro_card(title, tech_stack, github_url):
  base = Image.new('RGBA', (FRAME_WIDTH, FRAME_HEIGHT), (15, 23, 42, 255))
  draw = ImageDraw.Draw(base)
  
  # Main Title
  t_bbox = draw.textbbox((0, 0), title, font=FONT_LARGE)
  t_w = t_bbox[2] - t_bbox[0]
  t_x = FRAME_WIDTH // 2 - t_w // 2
  t_y = FRAME_HEIGHT // 2 - 110
  draw.text((t_x, t_y), title, font=FONT_LARGE, fill=(255, 255, 255, 255))
  
  # Tech Stack Pill
  s_bbox = draw.textbbox((0, 0), tech_stack, font=FONT_TITLE)
  s_w = s_bbox[2] - s_bbox[0]
  s_x = FRAME_WIDTH // 2 - s_w // 2
  s_y = FRAME_HEIGHT // 2 + 10
  
  draw.rounded_rectangle([s_x - 30, s_y - 12, s_x + s_w + 30, s_y + 55], radius=24, fill=(30, 41, 59, 220), outline=(99, 102, 241, 160), width=2)
  draw.text((s_x, s_y), tech_stack, font=FONT_TITLE, fill=(165, 180, 252, 255))
  
  # GitHub Link
  g_bbox = draw.textbbox((0, 0), github_url, font=FONT_SUB)
  g_w = g_bbox[2] - g_bbox[0]
  g_x = FRAME_WIDTH // 2 - g_w // 2
  g_y = FRAME_HEIGHT // 2 + 110
  draw.text((g_x, g_y), github_url, font=FONT_SUB, fill=(148, 163, 184, 255))
  
  return base.convert('RGB')

def blend_images(img1, img2, alpha):
  # Alpha blend between two PIL images (0.0 = img1, 1.0 = img2)
  return Image.blend(img1.convert('RGB'), img2.convert('RGB'), alpha)

print("[Demo Render] Preparing high-resolution 1080p 60fps frame sequence...")

# Pre-render color graded screens
graded_welcome = apply_color_grading(img_welcome)
graded_input = apply_color_grading(img_input)
graded_camera = apply_color_grading(img_camera)
graded_recipe = apply_color_grading(img_recipe)
graded_ingredients = apply_color_grading(img_ingredients)
graded_step1 = apply_color_grading(img_step1)
graded_step2 = apply_color_grading(img_step2)
graded_step4 = apply_color_grading(img_step4)
graded_done = apply_color_grading(img_done)

intro_card = render_title_card("Fridge to Recipe", "Instant AI Meal Magic")
outro_card = render_outro_card("Fridge to Recipe", "Made with React, Claude AI, Node.js", "github.com/yourrepo/fridge-to-recipe")

# Setup OpenCV VideoWriter
temp_avi = os.path.join(ARTIFACT_DIR, "temp_video.avi")
fourcc = cv2.VideoWriter_fourcc(*'MJPG')
video_writer = cv2.VideoWriter(temp_avi, fourcc, FPS, (FRAME_WIDTH, FRAME_HEIGHT))

# Fade duration = 1.5s = 90 frames
FADE_FRAMES = 90

for f in range(TOTAL_FRAMES):
  sec = f / FPS
  current_frame = None

  # SECTION 1: Intro (0s - 3s)
  if f < 180:
    current_frame = intro_card
    
  # Transition Intro -> Problem / Welcome (3s - 4.5s)
  elif f < 270:
    alpha = (f - 180) / FADE_FRAMES
    current_frame = blend_images(intro_card, graded_welcome, alpha)
    
  # SECTION 2: Problem Statement (3s - 8s)
  elif f < 480:
    current_frame = draw_text_overlay(graded_welcome, "Stop wondering what to cook")
    
  # Transition Welcome -> Input Interface (8s - 9.5s)
  elif f < 570:
    alpha = (f - 480) / FADE_FRAMES
    base = blend_images(graded_welcome, graded_input, alpha)
    current_frame = draw_text_overlay(base, "Input any ingredient")
    
  # SECTION 3: Demo Part 1 - Input Interface & Scanning (8s - 25s)
  elif f < 1500:
    # 12s - 18s: Text overlay "Real-time food scanning" & Camera modal zoom
    if 720 <= f < 1080:
      zoom_p = min(1.1, 1.0 + 0.1 * ((f - 720) / 120))
      frame_src = apply_zoom(graded_camera, zoom_p)
      current_frame = draw_text_overlay(frame_src, "Real-time food scanning")
    else:
      current_frame = draw_text_overlay(graded_input, "Input any ingredient")
      
  # Transition Input -> Recipe Overview (25s - 26.5s)
  elif f < 1590:
    alpha = (f - 1500) / FADE_FRAMES
    base = blend_images(graded_input, graded_recipe, alpha)
    current_frame = draw_text_overlay(base, "AI recipes tailored to your tastes")
    
  # SECTION 4: Demo Part 2 - AI Recipe Suggestions & Zoom (25s - 45s)
  elif f < 2700:
    # Zoom 1.1x on AI-generated dishes
    zoom_p = 1.0 + 0.1 * (min(1.0, (f - 1500) / 300))
    if f < 2100:
      frame_src = apply_zoom(graded_recipe, zoom_p)
    else:
      frame_src = apply_zoom(graded_ingredients, zoom_p)
      
    if 1800 <= f < 2160: # 30s - 36s
      current_frame = draw_text_overlay(frame_src, "AI recipes tailored to your tastes")
    else:
      current_frame = frame_src
      
  # Transition Recipe -> Cooking Walkthrough (45s - 46.5s)
  elif f < 2790:
    alpha = (f - 2700) / FADE_FRAMES
    current_frame = blend_images(graded_ingredients, graded_step1, alpha)
    
  # SECTION 5: Demo Part 3 - Step-by-Step Cooking Walkthrough (45s - 70s)
  elif f < 4200:
    # 45s - 53s: Step 1
    if f < 3180:
      frame_src = graded_step1
    # 53s - 61s: Step 2
    elif f < 3660:
      frame_src = graded_step2
    # 61s - 70s: Step 4 / 100% Done
    else:
      frame_src = graded_done
      
    if 3000 <= f < 3360: # 50s - 56s
      current_frame = draw_text_overlay(frame_src, "Step-by-step guidance")
    else:
      current_frame = frame_src
      
  # Transition Cooking Done -> Outro (70s - 71.5s)
  elif f < 4290:
    alpha = (f - 4200) / FADE_FRAMES
    current_frame = blend_images(graded_done, outro_card, alpha)
    
  # SECTION 6: Outro (70s - 90s)
  else:
    # Fade to black on last 1.5s (88.5s - 90s)
    if f >= 5310:
      alpha = 1.0 - ((f - 5310) / 90)
      black_frame = Image.new('RGB', (FRAME_WIDTH, FRAME_HEIGHT), (0, 0, 0))
      current_frame = blend_images(black_frame, outro_card, alpha)
    else:
      current_frame = outro_card

  # Apply Vignette
  frame_rgba = current_frame.convert('RGBA')
  frame_vignette = Image.alpha_composite(frame_rgba, VIGNETTE_OVERLAY).convert('RGB')
  
  # Convert PIL RGB to OpenCV BGR
  cv_frame = cv2.cvtColor(np.array(frame_vignette), cv2.COLOR_RGB2BGR)
  video_writer.write(cv_frame)
  
  if (f + 1) % 600 == 0:
    print(f"[Demo Render] Progress: {f+1}/{TOTAL_FRAMES} frames ({int((f+1)/TOTAL_FRAMES*100)}%)")

video_writer.release()
print("[Demo Render] Video frames written to temp AVI file!")

# SYNTHESIZE AUDIO TRACK (VOICEOVER INTRO + UPLIFTING AMBIENT TECH MUSIC @ 70 BPM)
print("[Demo Render] Synthesizing ambient tech audio track + voiceover intro...")

# Generate 15s Voiceover using gTTS
tts_path = os.path.join(ARTIFACT_DIR, "intro_voice.mp3")
tts = gTTS("Welcome to Fridge to Recipe. AI powered meal magic.", lang='en', tld='com')
tts.save(tts_path)

# Generate 90s Ambient Music WAV (70 BPM, subtle synth pad chords)
sample_rate = 44100
n_samples = sample_rate * TOTAL_DURATION
t = np.linspace(0, TOTAL_DURATION, n_samples, False)

# Synth chord frequencies (F major / C major ambient pads: F4, A4, C5, E5)
notes = [349.23, 440.00, 523.25, 659.25, 392.00, 493.88]
music_wave = np.zeros(n_samples)

for i, freq in enumerate(notes):
  lfo = 0.5 + 0.5 * np.sin(2 * np.pi * 0.2 * t + i) # gentle 0.2 Hz filter sweep
  music_wave += 0.15 * lfo * np.sin(2 * np.pi * freq * t)

# Subtle pulse rhythm (70 BPM = 1.166 Hz pulse)
pulse = 0.3 * np.sin(2 * np.pi * (70 / 60) * t)**4
music_wave += pulse * np.sin(2 * np.pi * 180 * t) # soft low bass kick pulse

# Normalize music wave
music_wave = music_wave / np.max(np.abs(music_wave)) * 0.25 # keep ambient volume subtle

# Save ambient music WAV
music_wav_path = os.path.join(ARTIFACT_DIR, "ambient_music.wav")
wavfile.write(music_wav_path, sample_rate, (music_wave * 32767).astype(np.int16))

# COMBINE VIDEO + AUDIO INTO FINAL MP4 USING FFMPEG
print("[Demo Render] Multiplexing video and audio into final 1080p 60fps MP4 video...")
ffmpeg_cmd = [
  "ffmpeg", "-y",
  "-i", temp_avi,
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

res = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)
if res.returncode == 0:
  print(f"[Demo Render] SUCCESS! Final demo video created at:\n{OUTPUT_VIDEO_PATH}")
  if os.path.exists(temp_avi): os.remove(temp_avi)
  if os.path.exists(music_wav_path): os.remove(music_wav_path)
  if os.path.exists(tts_path): os.remove(tts_path)
else:
  print(f"[FFmpeg Error] {res.stderr}")
