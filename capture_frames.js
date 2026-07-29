import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT_DIR = path.join(process.cwd(), 'scratch_frames');
const delay = (ms) => new Promise(r => setTimeout(r, ms));

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function findButtonByText(page, textSubstring) {
  const btns = await page.$$('button');
  for (const b of btns) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && txt.toLowerCase().includes(textSubstring.toLowerCase())) {
      return b;
    }
  }
  return null;
}

async function capture() {
  console.log('[Puppeteer] Launching Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 }
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await delay(1000);

  // Frame 1: Welcome Intro Landing Screen
  console.log('[Puppeteer] Capturing Screen 1: Welcome Intro Landing...');
  await page.screenshot({ path: path.join(OUT_DIR, '01_welcome_intro.png') });

  // Click 'Open Fridge & Start Cooking'
  console.log('[Puppeteer] Clicking Open Fridge...');
  const openBtn = await findButtonByText(page, 'Open Fridge');
  if (openBtn) await openBtn.click();
  await delay(1500);

  // Frame 2: Input Screen (Empty / Initial state)
  console.log('[Puppeteer] Capturing Screen 2: Food Input Interface...');
  await page.screenshot({ path: path.join(OUT_DIR, '02_input_interface.png') });

  // Frame 3: Live Camera Modal Open
  console.log('[Puppeteer] Opening Live Camera Scanner modal...');
  const camBtn = await page.$('button[title*="Camera"]');
  if (camBtn) {
    await camBtn.click();
    await delay(600);
  }
  await page.screenshot({ path: path.join(OUT_DIR, '03_camera_modal.png') });

  // Close Camera Modal if open
  const closeCamBtn = await findButtonByText(page, 'Close') || await page.$('button svg');
  if (closeCamBtn) await closeCamBtn.click();
  await delay(500);

  // Select Hero Dish Card (Paneer Butter Masala)
  console.log('[Puppeteer] Selecting Paneer Butter Masala card...');
  const paneerCard = await page.$('.group');
  if (paneerCard) {
    await paneerCard.click();
  }
  await delay(2500);

  // Frame 4: Generated Recipe Overview & Ingredients
  console.log('[Puppeteer] Capturing Screen 4: AI Recipe Overview & Ingredients...');
  await page.screenshot({ path: path.join(OUT_DIR, '04_recipe_overview.png') });

  // Scroll down smoothly to show ingredients & prep
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
  await delay(1000);
  console.log('[Puppeteer] Capturing Screen 5: Recipe Ingredients & Swaps...');
  await page.screenshot({ path: path.join(OUT_DIR, '05_ingredients_swaps.png') });

  // Click 'Start Cooking Mode' button
  console.log('[Puppeteer] Starting Step-by-Step Cooking Mode...');
  const startCookBtn = await findButtonByText(page, 'Cooking Mode') || await findButtonByText(page, 'Start');
  if (startCookBtn) {
    await startCookBtn.click();
    await delay(1200);
  }

  // Frame 6: Step 1 Cooking Scene
  console.log('[Puppeteer] Capturing Screen 6: Cooking Step 1...');
  await page.screenshot({ path: path.join(OUT_DIR, '06_cooking_step1.png') });

  // Click Next Step (Step 2)
  let nextStepBtn = await findButtonByText(page, 'Next Step');
  if (nextStepBtn) {
    await nextStepBtn.click();
    await delay(1000);
  }
  console.log('[Puppeteer] Capturing Screen 7: Cooking Step 2...');
  await page.screenshot({ path: path.join(OUT_DIR, '07_cooking_step2.png') });

  // Click Next Step (Step 3)
  nextStepBtn = await findButtonByText(page, 'Next Step');
  if (nextStepBtn) {
    await nextStepBtn.click();
    await delay(1000);
  }

  // Click Next Step (Step 4)
  nextStepBtn = await findButtonByText(page, 'Next Step') || await findButtonByText(page, 'Finish Cooking');
  if (nextStepBtn) {
    await nextStepBtn.click();
    await delay(1000);
  }
  console.log('[Puppeteer] Capturing Screen 8: Cooking Step 4...');
  await page.screenshot({ path: path.join(OUT_DIR, '08_cooking_step4.png') });

  // Click Finish Cooking if present
  const finishBtn = await findButtonByText(page, 'Finish Cooking');
  if (finishBtn) {
    await finishBtn.click();
    await delay(1200);
  }
  console.log('[Puppeteer] Capturing Screen 9: Cooking Done 100% Finished Screen...');
  await page.screenshot({ path: path.join(OUT_DIR, '09_cooking_done_100.png') });

  await browser.close();
  console.log('[Puppeteer] High-res frame capture complete!');
}

capture().catch(err => {
  console.error('[Puppeteer Error]', err);
  process.exit(1);
});
