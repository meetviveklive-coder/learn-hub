# Design System

## 1. Design Direction
Style: Calm editorial — a well-made textbook, not a SaaS dashboard.
Mood: Quiet, focused, easy on the eyes for 10 minutes of reading.
Design Principles:
- Reading comes first: comfortable line length (~70 characters), generous line height.
- The same lesson shape every time, so the eye knows where to look.
- Colour carries meaning (callout types), never decoration only.

## 2. Brand
Brand Name: Learn Hub (placeholder)
Logo: Text wordmark only in MVP.
Brand Voice: See CONTENT_STYLE.md.

## 3. Color Palette
Start from the Fumadocs UI default theme and its light/dark modes. Override only:
Primary (links, focus): one accent, set as the Fumadocs primary CSS variable. Pick once; don't change per page.
Callouts (semantic):
- Analogy: info/blue family
- Remember this: success/green family
- Common mistakes: warning/amber family
- Outdated / needs update banner: error/red family
All text must meet WCAG AA contrast (4.5:1) in both light and dark mode.

## 4. Typography
Use Fumadocs defaults (system/Geist stack) in MVP. Body ≥ 16px, line height ≥ 1.6. Code: monospace from the theme.

## 5. Spacing
Use the theme's Tailwind scale. Lesson sections separated by H2 with clear top margin.

## 6. Border Radius / 7. Shadows
Theme defaults. No custom shadows.

## 8. Buttons
Only used inside `<Quiz>` and `/review`: theme primary for "Check answer"/"Mark learned", secondary for "Next". Disabled while no option selected.

## 9. Inputs
Quiz options are radio-style buttons, full-width, large tap target (≥ 44px tall). Selected, correct, and wrong states must differ by icon + text, not colour only.

## 10. Cards
Domain landing pages use Fumadocs `Cards` for topics.

## 11. Navigation
Header: site title, search, theme toggle, GitHub link, "Review today".
Sidebar: Domain → Topic → Lesson (from folders + `meta.json`), ordered as a learning path.
Mobile: Fumadocs default drawer.
Lesson footer: previous/next lesson + prerequisites.

## 12. States
Quiz: unanswered / correct / wrong + explanation shown.
Review page: empty (explains "nothing due" or "storage is per-device"), due list, done.
Lesson with `status: needs_update`: red banner at top saying facts may be outdated.

## 13. Icons
Library: lucide-react (ships with Fumadocs UI). Default 16–20px, outline style.

## 14. Responsive Design
Mobile-first. Tables scroll horizontally inside their container; page never scrolls sideways.

## 15. Accessibility
- Semantic HTML; quiz uses fieldset/legend.
- Keyboard: every quiz option and button reachable and usable by keyboard.
- Visible focus states.
- Don't rely only on colour for right/wrong.
- Text diagrams get a one-line text summary below them.
