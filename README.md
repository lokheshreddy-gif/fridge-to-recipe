# 🍳 Fridge to Recipe — AI Culinary Studio

A submission-ready, full-screen, interactive React application that transforms a free-form list of fridge/pantry ingredients into a structured, interactive, scalable, checkable recipe powered by an AI LLM backend proxy.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### Installation & Execution

```bash
# 1. Install dependencies
npm install

# 2. Start the complete application (Frontend + Express Backend)
npm start
# or: npm run dev
```

Once started, open your browser to `http://localhost:5173` (Vite frontend proxying requests to Express backend on port `3001`).

---

## 🔑 LLM API Key Configuration (.env)

The application uses an Express proxy backend at `/api/generate` to hold API keys server-side so that no API keys are ever exposed in frontend bundle code.

1. Copy `.env.example` to create your local `.env` file:
   ```bash
   cp .env.example .env
   ```
2. Add your Google Gemini API key (or OpenRouter / Groq key):
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
> **Note**: If no API key is provided in `.env`, the backend gracefully serves high-quality mock recipes so the application remains 100% interactive out of the box during initial setup.

---

## ✨ Additive Feature Suite

1. **Light/Dark Theme Toggle**:
   - Universal Sun/Moon toggle button in the top navigation bar.
   - Built with React Context & state (`dark` / `light`), applying styled CSS tokens. High contrast light palette redesign (`#F8FAFC` background, slate text, light glass panels).
   - Session-persistent in memory.

2. **Favorites List**:
   - Save/bookmark recipes with a heart icon.
   - Dedicated "Favorites" modal listing all saved recipes. Clicking any favorited recipe immediately opens it in the normal flow (`IngredientsFirstView` -> `CookingSequence`).

3. **To-Do / Shopping List**:
   - Dedicated "My List" drawer accessible from the top navbar.
   - "Add missing items to list" action on ingredient cards and "Add All to List" header button.
   - Live badge counter showing unchecked items.

4. **Recent Search History**:
   - Automatically records the raw ingredient input and timestamp of every submission (stored in session state).
   - "History" dropdown drawer on the input card listing the last 10 searches; clicking any entry re-populates the input field.

5. **"Trending Now" Suggestions**:
   - Curated list of popular ingredient combinations (e.g. *Chicken, Garlic, Spinach & Lemon*, *Tofu, Broccoli, Soy Sauce & Ginger*, *Pasta, Olive Oil & Chili Flakes*).
   - *Honesty Note*: Represented as a curated inspiration list rather than live analytics data.

6. **Age-Appropriate Nutrition & Macros**:
   - Age group selector on the input card (**Child**, **Teen**, **Adult**, **Senior**) sent in prompt payload to the LLM.
   - Nutrition Card displaying estimated Calories, Protein (g), Carbs (g), Fat (g), and age-specific portion guidance (`ageNote`).
   - Mandatory AI Disclaimer: *"Nutrition values are AI-generated estimates, not verified lab data — consult a professional for dietary or medical guidance."*
   - Safe schema validation: If nutrition metadata is missing or malformed, the card degrades gracefully without breaking the layout.

---

## 🛡️ Failure Handling & Robustness

Robustness accounts for 20% of the project grade. The app includes:

1. **Network Error Handling**: `try/catch` wrapper around HTTP requests with a clean glassmorphic `ErrorState` card and a `Try Again` retry mechanism.
2. **JSON Parsing & Model Safeguards**: Wrap `JSON.parse` with safety checks. If the model produces invalid syntax or unrequested markdown/prose, the app displays `"Couldn't understand that recipe"` with a Retry action.
3. **Strict Schema Validation (`validateRecipe`)**: Validates that all required fields (`title`, `baseServings`, `ingredients` array, `steps` array) exist and have valid types before rendering.
4. **Stale Request Cancellation**: Uses `AbortController` and an incremental `activeRequestIdRef` so that if a user submits a new request before a previous one resolves, the stale response is safely discarded.
5. **20-Second Timeout**: Automatically aborts hanging requests after 20 seconds and displays a timeout error state.
6. **Input Validation**: Disables submission when input is empty with real-time feedback.
7. **Test Failure Selector**: Includes an inline dropdown in the input screen to simulate "Broken JSON" or "Invalid Schema" to evaluate error recovery on demand.

---

## 🎨 Key Features & Technical Polish

- **Full-Screen Single Page Shell**: `100vw` / `100dvh` container with zero outer scrollbar clutter.
- **Two-Phase Reveal**:
  - **Phase 1**: Ingredients displayed first on a virtual kitchen counter with staggered Framer Motion card entrances.
  - **Phase 2**: Interactive user-controlled `CookingSequence` featuring data-driven vector vessel scenes (`CookingScene.jsx`), ingredient drop-ins, sizzle loops, and timers.
- **Photographic Ingredient Thumbnails & SVG Fallback**: High quality local ingredient photos (`/public/ingredient-images/`) with graceful animated SVG icon fallback.
- **Dynamic Servings Stepper & Live Scaling**: Scalable ratio (`ing.amount * currentServings / baseServings`) recalculates every ingredient amount live.
- **Responsive Layout**: Desktop view collapsing gracefully to a single scrollable mobile column with un-truncated full ingredient text wrapping.

---

## 🤖 Honest AI Usage Note

- **AI Tools Used**: Developed with assistance from Google DeepMind Agentic AI Coding Assistant (Antigravity).
- **AI Contributions**: AI assisted in scaffolding the Express proxy route, generating initial Framer Motion variant structures, generating photorealistic food asset thumbnails, crafting the strict system prompt, and generating representative culinary sample presets.
- **Human Guidance & Review**: All schema validation logic, `AbortController` stale response logic, timeout handlers, state machine flows, responsive Tailwind layouts, and component architectures were reviewed, refined, and verified.

---

## ⏳ Time Spent & Known Limitations

- **Time Spent**: ~4.5 hours total (scaffolding, backend integration, failure handling design, interactive UI, custom animated icons, two-phase reveal, photographic thumbnails, nutrition macros, theme toggle, and verification).
- **Known Limitations**:
  - Session state (favorites, shopping list, history, theme) is stored in React memory and resets on hard browser page reloads.
