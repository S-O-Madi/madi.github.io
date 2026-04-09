# Roblox Dev Portfolio

## File structure

```
portfolio/
├── index.html          ← skeleton only — no content, just IDs for JS to hook into
├── css/
│   └── style.css       ← all styles, no JS dependency, edit design tokens here
├── js/
│   └── render.js       ← reads JSON, builds & injects all HTML automatically
└── data/
    └── portfolio.json  ← ✅ THE ONLY FILE YOU NEED TO EDIT for content
```

---

## How to edit content

**Open `data/portfolio.json`** and change whatever you want.
The page rebuilds itself automatically on every load.

### Add a project

```json
"projects": [
  {
    "id":                      "my-game",
    "name":                    "My Awesome Game",
    "description":             "What the game is about.",
    "status":                  "live",          // "live" | "dev" | "done"
    "visits":                  "300K",
    "thumbnail":               "assets/my-game.jpg",   // leave "" for fallback
    "thumbnailFallbackLabel":  "GAME 04",
    "thumbnailFallbackGradient": "linear-gradient(135deg,#0a1828,#0f2240)",
    "thumbnailFallbackColor":  "#00d4ff",
    "tags":                    ["Luau", "UI/UX"],
    "robloxUrl":               "https://www.roblox.com/games/YOUR_ID",
    "linkLabel":               "Play on Roblox"
  }
]
```

### Add a social link

```json
"socials": [
  {
    "platform": "YouTube",
    "handle":   "@yourchannel",
    "icon":     "Y",
    "url":      "https://youtube.com/@yourchannel"
  }
]
```

### Add a screenshot

```json
"screenshots": [
  { "src": "assets/shot5.jpg", "alt": "Boss fight", "fallbackLabel": "SCR 05" }
]
```

### Embed a YouTube video

```json
"featuredVideo": {
  "type":      "youtube",
  "youtubeId": "dQw4w9WgXcQ",
  "localSrc":  "",
  "caption":   "Gameplay Trailer 2025"
}
```

---

## Run locally

Browsers block `fetch()` on `file://` URLs.
Use any static server — the easiest options:

- **VS Code** → install "Live Server" extension → right-click `index.html` → *Open with Live Server*
- **Node** → `npx serve .` in the portfolio folder
- **Python** → `python -m http.server 8080` then open `http://localhost:8080`

---

## Customise design

All design tokens (colors, fonts) are CSS variables at the top of `css/style.css`:

```css
:root {
  --accent:  #00d4ff;   /* main cyan  */
  --accent2: #ff4f78;   /* pink       */
  --accent3: #7fff6e;   /* green      */
  --bg:      #0a0c10;   /* page bg    */
  --text:    #e8eaf2;   /* body text  */
  --muted:   #6a7190;   /* dim text   */
}
```
