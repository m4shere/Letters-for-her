# Letters for her ♡

A mobile-first, hand-drawn storybook for five personal letters. It uses plain HTML, CSS and JavaScript—no build step or framework. All letter text is placeholder copy; replace it with your own words before sharing.


## Personalise the site

### Change the recipient name and code
Open `script.js` and edit the two constants at the top:
- `RECIPIENT_NAME`: recipient's name. Matching ignores case and repeated/outer whitespace.
- `DELIVERY_PIN`: your chosen code. It is intentionally a visible text field, not a password field.

**Privacy note:** this is a visual gate only. On a static site, the name, code and letter content can be inspected in the downloaded source. Do not put sensitive information here. Real privacy requires server-side verification and only sending the letters after successful verification.

### Edit the five letters
Open `letters.js`. Each entry has four fields:
- `date`: date displayed on the paper
- `title`: heading on the paper
- `body`: letter text; use `\n\n` between paragraphs
- `signoff`: closing line

The five envelopes are mapped by their order in this array. Keep five entries unless you also update the envelope buttons in `index.html`. The envelope covers intentionally have **no date or title overlays**; add those to your own envelope PNG in Figma.

### Replace the artwork with Figma exports
The replaceable illustrations are in `assets/svg/`. Export transparent SVGs from Figma and keep the same filename to replace an asset without editing code. Keep a sensible viewBox and avoid embedding a full page as one SVG.

| File | Used for |
|---|---|
| `stamp-love.svg` | Landing page and delivery receipt |
| `ribbon.svg` | Unread ribbon on each envelope; fades away after opening for the current page session |
| `envelope-border-pink.svg` | Envelope 1 border/background |
| `envelope-border-blue.svg` | Envelope 2 border/background |
| `envelope-border-mint.svg` | Envelope 3 border/background |
| `envelope-border-yellow.svg` | Envelope 4 border/background |
| `envelope-border-rose.svg` | Envelope 5 border/background |
| `sticky-note.svg` | Optional random desk accessory |
| `polaroid-frame.svg` | Optional random desk accessory |
| `flower.svg` | Landing card and paper decoration |
| `flower-bunch.svg` | Desk edge decoration |
| `fountain-pen.svg` | Desk edge decoration |
| `thread-spool.svg` | Desk edge decoration |
| `squiggle.svg` | Desk edge decoration |
| `doodle-stars.svg`, `doodle-heart.svg` | Landing and receipt decoration |
| `postmark.svg` | Receipt and letter paper |

The desk accessories are separate files. The small polaroid, sticky note, flower and postmark doodles are selected and placed randomly in free space on the desk; the script checks their rectangles against all five envelopes, the reader note, other random doodles and the larger edge accessories before showing them. If no safe space is found, a doodle stays hidden rather than covering something. You can remove a random accessory by removing its `<img class="random-decor">` line inside `#randomDecorations`.

### Replace the envelope artwork
Export each envelope as a transparent PNG from Figma and place it in `assets/svg/` or create an `assets/envelopes/` folder. In `index.html`, find each button with class `letter-card` and replace the `src` of its `.cover-border` image with your PNG path. The site uses a regular image element, so PNG files work too. Keep the `.cover-ribbon` image as a separate element so the unread ribbon can animate away. The cover no longer adds its own stamp, date or title.

### Replace the green desk with your own artwork
The desk is plain deep leafy green by default, with a larger fountain pen, a small reader note and optional randomized accessories around the envelopes. To use an exported desk image, place it at `assets/textures/desk-background.jpg`, then in `styles.css` change the `.desk-surface` rule to:

```css
.desk-surface {
  background-color: var(--green);
  background-image: url("assets/textures/desk-background.jpg");
  background-size: cover;
  background-position: center;
}
```

Keep the artwork separate from the envelopes and decorations. The folder `assets/textures/` is included for this optional image.

## Publish with GitHub Pages
1. Create or open a GitHub repository and upload the **contents** of the `letter-for-her` folder (not the outer folder itself, unless you want it hosted as a subdirectory).
2. Go to **Settings → Pages**.
3. Under build/deployment, choose **Deploy from a branch**, select `main` and `/(root)`, then save.
4. Wait for GitHub Pages to publish and open the URL it provides.

## Project map
- `index.html` — semantic page structure and asset placements
- `styles.css` — palette, typography, responsive layout, motion and letter styling
- `letters.js` — all letter content, kept separate from interaction code
- `script.js` — visual name/code check, transitions, ribbon state, heart burst, reader controls and keyboard shortcuts
- `assets/svg/` — separate replaceable illustrations, ribbons and optional desk doodles
- `assets/textures/` — optional replacement desk background

The ribbon state is held only in the current page, not in localStorage; a full reload restores all ribbons. Escape closes the reader; left/right arrow keys navigate letters. Reduced-motion preferences are respected.
