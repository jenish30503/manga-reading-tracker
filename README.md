# Manga Reading Tracker

**Author:** Jenish Chaudhary

A personal tracker for manga, manhwa, webtoons and anime. Keep track of what you are reading, where you stopped, and what you thought about each title. Everything is saved in your browser using localStorage — no backend, no login needed.

## How to Run

1. Download or clone this repository.
2. Open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari).
3. That's it — no server, no install, no build step needed.

## Features

- **Add titles** with name, type, status, current chapter, rating and optional notes.
- **Title cards** with a cover block showing the first letter, plus all the details.
- **+1 Chapter button** on each card to quickly update your reading progress.
- **Delete button** with a confirmation prompt so you don't accidentally remove anything.
- **Search** titles by name as you type (case-insensitive, instant filtering).
- **Status tabs** (All, Reading, Plan to read, Completed, Dropped) to filter by reading status. Tabs and search work together.
- **Summary row** showing total titles, how many you are reading, how many are completed, and the average rating.
- **Edit a title** by clicking the Edit button on its card — the form fills up with the saved values and the button changes to "Save changes".
- **localStorage persistence** — everything is saved in the browser and loads again when you reopen the page.
- **Responsive layout** — works on laptops and phones without sideways scrolling.
- **Validation** — you cannot submit an empty title or a negative chapter number.

## Built With

- HTML5
- CSS3 (Flexbox, CSS Grid)
- Vanilla JavaScript (no frameworks or libraries)
