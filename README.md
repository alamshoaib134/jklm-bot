Developed with 🧠 by **[Shoaib Alam](https://alamshoaib134.github.io/)** (AI Engineer at JPMC | NLP Researcher @ IIT Gandhinagar | Hybrid RAG Pioneer)
---
# jklm-bot
# JKLM BombParty AutoPlayer - Installation Guide

## Option 1: Tampermonkey Script (Recommended)

### Step 1: Install Tampermonkey
- **Chrome**: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
- **Firefox**: https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/
- **Edge**: https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd

### Step 2: Install the Script
1. Click Tampermonkey icon → **Create a new script**
2. Delete all template code
3. Paste the contents of `jklm-autoplay.user.js`
4. Press **Ctrl+S** / **Cmd+S** to save

### Step 3: Play
1. Go to https://jklm.fun
2. Join a BombParty room
3. You'll see a **💣 JKLM Bot v3** overlay
4. Click **Auto-join** in the game
5. The bot auto-plays when it's your turn!

---

## Option 2: Browser Console (Quick Test)

If Tampermonkey doesn't work, you can paste this directly in the browser console:

1. Join a JKLM BombParty room
2. Press **F12** to open Developer Tools
3. Click the **Console** tab
4. Right-click the iframe area and select "Inspect"
5. In the console, switch context to the **game iframe** (dropdown at top of console)
6. Paste and run the code from `jklm-autoplay.user.js`

---

## Troubleshooting

### Script not running?
- Make sure Tampermonkey shows the script as **enabled** (green toggle)
- Check that the @match patterns include your current URL
- Try refreshing the JKLM page after installing

### Overlay not appearing?
- The overlay only shows inside the game iframe
- Make sure you've joined a BombParty room (not just the lobby)

### Not auto-playing?
- Make sure "Auto-play" checkbox is checked in the overlay
- Click "Auto-join" button in the game first
- The bot only plays when it's YOUR turn

---

## How It Works

1. **Detects syllable** - Watches for the current syllable (e.g., "qsu")
2. **Finds shortest word** - Searches 5000+ word dictionary
3. **Types instantly** - Types the word character-by-character
4. **Auto-submits** - Presses Enter to submit the word

---

## Word List

The bot includes 5000+ common English words optimized for BombParty, including:
- Short 2-4 letter words for speed
- Rare letter combinations (qsu, xyl, zym, etc.)
- Common long words for tough syllables
