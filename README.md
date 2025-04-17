## <span style="color: #00BE67;">GooseOS: A Win95-Style Goose Playground</span>

An immersive retro-style web application inspired by Windows 95, featuring:

- A goose-themed educational minigame on affine matrix transformations
- An image upload interface with drag-and-drop support and preview
- A voting carousel for uploaded goose art
- A fully styled brutalist desktop UI powered by jQuery, D3.js, Flask, and pixel aesthetics
- Interactive boot sequence with a simulated BSOD and cosmic terminal corruption

The original goal was to make a game my kids could enjoy (and maybe trick them into learning matrix math), but it’s grown into a full desktop environment with dynamic modules and components — all styled like a late-'90s operating system.

---

### <span style="color: #00BE67;">Project Structure</span>

```
.
├── Makefile
├── api                      # Flask backend
│   ├── app
│   │   ├── models           # Image model, vote state
│   │   ├── util             # Heimdahl debugger, color output
│   │   └── routes.py        # Image upload, image list, vote API
│   └── run.py
├── frontend
│   ├── assets               # Goose icons, TV overlays, user-submitted images
│   ├── css                 # All modular and themed CSS
│   ├── js                  # All functional modules (BSOD, terminal, goose logic, etc.)
│   └── pages               # All HTML pages
```

---

### <span style="color: #00BE67;">Quick Setup</span>

There is a `Makefile` for convenience. To launch the frontend:

```bash
make client
```

This runs:

```bash
python3 -m http.server 8002
```

You can also run it manually from the `frontend/` folder.

> NOTE: The frontend and backend are run separately. Flask handles the API. The frontend is served statically.

To run the Flask API:

```bash
make dev-host
```

This runs:
```bash
cd api && python run.py -D -V
```

>Note: the `d` and `v` flags are for "developement" and "verbose"; the program is riddled with print statements to track the program flow for debugging.

Make sure you have `Flask` and any additional `requirements.txt` dependencies installed.

---

### <span style="color: #00BE67;">Goose Game (goose.html)</span>

- Controls: `Arrow keys`, `WASD`, or `wasd`
- Objective: Avoid affine matrices (which appear every ~5 seconds)
- You have `3 lives`
- Each time you collide with a matrix, the goose undergoes a transformation:
  - Visually transformed
  - Movement direction adjusted
- The entire scene runs on `D3.js` and a DOM-based game loop

---

### <span style="color: #00BE67;">Upload Page (upload.html)</span>

A styled drag-and-drop form:

- Fully supports `drag-and-drop` or `manual browse`
- Image preview displays the dragged image inside the upload zone
- Submits to Flask API `/upload` endpoint via `jQuery AJAX`
- Optional description field
- Returns a status message with success/failure
- Respects the pixelated Win95 design (brutal-button styling, shadow, outlines)

---

### <span style="color: #00BE67;">Voting Carousel (belles-lettres.html)</span>

- Carousel for viewing uploaded images
- Includes `Thumbs Up` / `Thumbs Down` buttons
- Live vote counts updated after each interaction
- Carousel navigation with ❮ and ❯
- All images pulled from Flask backend via `/images`
- jQuery-based logic with minimal overhead

---

### <span style="color: #00BE67;">Cosmic Boot Sequence</span>

Before accessing the desktop, users are presented with:

- A `blue screen of death` (bsod.js)
- Followed by a `cosmic-terminal` glitch animation where characters fragment and warp
- Finally, a `goose` flies by — randomly selected from uploaded images (fairygoosemother.js)

These are organized as timed sequences, waiting for global flags `window.bsodCompleted` and `window.cosmicCompleted`.

---

### <span style="color: #00BE67;">Pages</span>

- `index.html`: the Win95 desktop hub
- `upload.html`: image drag-and-drop upload
- `belles-lettres.html`: voting carousel
- `goose.html`: matrix-avoidance game
- `vibes.html`: a TV-style aesthetic view
- `afghan.html`: includes user-defined imagery from deployment (easter egg)

---

### <span style="color: #00BE67;">Requirements</span>

- Python 3.0+ (for backend)
- Browser: Works best on Firefox or Chromium
- jQuery, D3.js, Bootstrap, and retro-style CSS via CDN
- No build tools required

---

### <span style="color: #00BE67;">Motivation</span>

This project was designed with kids in mind — something engaging, funny, and oddly educational. And like any chaotic goose, it grew into an operating system unto itself.

> "Yield thine ballads of galactic conquest."
