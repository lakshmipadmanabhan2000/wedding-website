# Aswin & Lakshmi — Wedding Website

A single-page static wedding invitation. No backend, no database — just
HTML/CSS/JS, free to host on GitHub Pages.

## What's already filled in

Pulled from your printed invitation (`LakshmiWedsAswin.pdf`):
- Names, wedding date (Sun 15 Nov 2026 / 1202 Thulam 29), muhurtham time
- Reception at RDR Convention Centre on Monday, 16th November 2026
- Venue: RDR Convention Centre, Edapazhanji, Thiruvananthapuram (with an embedded map)
- Parents' names for both families

**Left out on purpose:** home addresses and phone numbers from the invitation,
and the "presents in blessings only" / "no reception previous day" lines
(dropped per your request) — those are fine on a printed card handed to
invitees, but this site is public on the internet.

**Downloadable invite card:** the "Download Invite Card" button on the site
serves `assets/Aswin-Lakshmi-Wedding-Invitation.pdf` (a copy of your
`LakshmiWedsAswin.pdf`). Swap that file for a different one if you'd rather
guests download something else.

## What you need to fill in

Our Story is already written in `index.html` with your real story. Still to do:

1. **Photos** — two folders, each shown one photo at a time (auto-advancing
   every ~4.5s, with arrows, dots and swipe; click to open full-screen):
   - `images/gallery/save-the-date/` → 1.jpg, 2.jpg, 3.jpg, ... — shown at
     the **top of the homepage**, where the "A & L" monogram used to be
   - `images/gallery/engagement/` → same pattern — shown in the
     **Photo Gallery** section

   The page auto-detects up to 24 photos per folder; skipped numbers are just
   ignored, no code changes needed. Each spot shows a "coming soon"
   placeholder while its folder is empty.

   Your engagement shoot photos are full-resolution (~10MB each) — resize
   before adding, e.g. with macOS's built-in `sips`:
   ```bash
   mkdir -p resized
   for f in *.JPG; do sips -Z 1600 "$f" --out "resized/$f"; done
   ```
   then copy your picks into the matching `images/gallery/<category>/` folder
   as `1.jpg`, `2.jpg`, ...

2. **Save-the-date video** — drop it in as `assets/save-the-date.mp4`, with
   an optional cover frame at `assets/save-the-date-poster.jpg`. It plays in
   its own section directly below the homepage banner; until the file exists
   that section shows a "coming soon" placeholder. No code changes needed.

   Keep the file reasonably small (ideally under ~30MB) — GitHub Pages serves
   it as-is, so a huge file means a slow page for guests on mobile data.

3. **`images/hero-placeholder.jpg`** — currently your caricature image, used
   in the "Our Story" section. Replace with a couple photo if you'd prefer.

## Greetings

The "Send Your Greetings" form opens the guest's own email app, pre-addressed
to you (`lakshmipadmanabhan2000@gmail.com`) with their message filled in —
no backend needed. If you'd rather collect them without relying on the
guest having email set up on their phone, swap it later for a free
[Formspree](https://formspree.io) form endpoint.

## Preview locally

```bash
cd /Users/lakshmipadmanabhan/Documents/wedding-website
python3 -m http.server 8000
```
Then open http://localhost:8000

## Deploy to GitHub Pages

```bash
cd /Users/lakshmipadmanabhan/Documents/wedding-website
git init
git add .
git commit -m "Wedding website"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```
Then in the repo on GitHub: **Settings → Pages → Source: `main` branch, `/root`**.
Your site will be live at `https://<your-username>.github.io/<repo-name>/`
within a minute or two. You can also add a custom domain in the same Pages
settings if you have one.
