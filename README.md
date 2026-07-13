# Anil & Priyanka — Our Love Story

A romantic multi-page website celebrating Anil and Priyanka. Elegant
typography, floating hearts, a live clock, a photo gallery, love quotes, and
a guestbook where visitors can leave a lovely message.

## Preview

Open `index.html` in any modern browser. No build step, no dependencies.

```bash
# Option 1: just open the file
open index.html

# Option 2: run a tiny local server (recommended for multi-page navigation)
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Pages

| Page            | File            | What's on it                                   |
|-----------------|-----------------|------------------------------------------------|
| Home            | `index.html`    | Grand hero + explore-gateway cards             |
| Our Story       | `story.html`    | Your love story text and a photo               |
| Journey         | `journey.html`  | Timeline of milestones                         |
| This Moment     | `moment.html`   | Live clock + "Together For" counter            |
| Gallery         | `gallery.html`  | Photo grid with hover captions                 |
| Love Notes      | `notes.html`    | Auto-rotating love-quote carousel              |
| Send Us Love    | `wishes.html`   | Message form + guestbook                       |

Each page shares the same navigation, footer, and styles. A prev/next
navigator at the bottom of each subpage lets visitors walk through the whole
story in order.

## File structure

```
.
├── index.html      # Home
├── story.html      # Our Story
├── journey.html    # Journey / Timeline
├── moment.html     # Live clock + together counter
├── gallery.html    # Photo gallery
├── notes.html      # Love quotes carousel
├── wishes.html     # Wishes form + guestbook
├── styles.css      # All theme, layout, and animations
├── script.js       # Nav/footer injection, clock, form, animations
└── README.md
```

## How the shared layout works

Each page has two placeholder divs:

```html
<div id="nav-placeholder"></div>
<!-- ... your page content ... -->
<div id="footer-placeholder"></div>
```

`script.js` swaps these for the shared navbar and footer on load. Subpages
also include:

```html
<div id="page-nav-placeholder"></div>
```

which is replaced with a "Previous / Next" navigator. Because the whole nav
lives in `script.js`, adding a new page only means editing the `PAGES` array:

```js
const PAGES = [
  { file: "index.html",   label: "Home",         short: "Home"     },
  { file: "story.html",   label: "Our Story",    short: "Story"    },
  // ... add new entries here
];
```

## Customising it for you two

### 1. Change the names
Search for `Anil` and `Priyanka` across the HTML files and replace with your
names. They also appear in `script.js` inside `buildNav()` and `buildFooter()`.

### 2. Set your special date
Open `script.js` and find the config block near the top:

```js
const TOGETHER_SINCE = "2025-07-16T00:00:00"; // The day we first met
const TOGETHER_LABEL = "Since our first hello";
const USE_24H_CLOCK  = false;
```

### 3. Add real photos
Replace the `<div class="story-photo-placeholder">` in `story.html` with
`<img src="images/us.jpg" alt="Anil and Priyanka" />` — create an `images/`
folder alongside the HTML files. Do the same for each
`<div class="gallery-placeholder">` in `gallery.html`.

### 4. Personalise the story
Edit the paragraphs in `story.html`, the milestones in `journey.html`, and
the quotes in `notes.html`.

### 5. Receive love notes by email
Open `script.js` and set `COUPLE_EMAIL`:

```js
const COUPLE_EMAIL = "youremail@example.com";
```

When set, the "Send with Love" button will also open the visitor's email app
pre-filled with their note, ready to send to you.

### 6. Change the colour theme
Open `styles.css` and edit the CSS variables at the top:

```css
:root {
  --rose: #e91e63;
  --rose-deep: #c2185b;
  --burgundy: #6d1a36;
  --gold: #d4af37;
  ...
}
```

## Features

- Multi-page navigation with active-state highlighting
- Prev / Next navigator at the bottom of every subpage
- Fully responsive (mobile, tablet, desktop)
- Elegant Google Fonts: Great Vibes, Playfair Display, Poppins
- Floating hearts background animation
- Scroll-triggered reveal animations
- Grand animated hero: gold shimmer, sparkles, radiant aura
- Live-ticking clock with seconds and "Together For" counter
- Vertical timeline of milestones
- Photo gallery with hover captions
- Auto-rotating love-quotes carousel
- Message form with heart-burst animation and mini guestbook
- Mobile hamburger navigation
- Respects `prefers-reduced-motion` for accessibility

## Deploying (optional)

To share the site with family and friends, push to GitHub and enable Pages:

```bash
git add .
git commit -m "Romantic multi-page website for Anil & Priyanka"
git push
```

Then in the repo settings → Pages → source: `main` / root. Your site will be
live at `https://<username>.github.io/<repo-name>/`.

Made with love.
