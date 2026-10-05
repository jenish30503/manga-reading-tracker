# EXPLANATION.md — Manga Reading Tracker

This file explains how the project works so you can answer any question in a viva.

---

## 1. How the Three Files Connect

- **index.html** is the page the browser loads. It has the structure: the header, the form, the search box, the tabs, the summary row, the cards container, and the footer. At the bottom it loads `style.css` for styling and `script.js` for behavior.
- **style.css** is linked in the `<head>` of the HTML. It controls how everything looks — colors, spacing, layout, fonts, and the responsive design for phones.
- **script.js** is loaded at the bottom of `<body>` so the HTML elements exist before the script runs. It reads the form inputs, manages the `titles` array, saves to localStorage, and builds the cards dynamically using `document.createElement`.

The HTML is the skeleton, CSS is the skin, and JS is the brain.

---

## 2. Step-by-Step Explanation of script.js

### Variables at the top

- `titles` — the main array that holds all the title objects. This is the single source of truth.
- `currentStatus` — a string like `'All'` or `'Reading'` that tracks which tab is selected.
- `editingId` — holds the id of the title being edited, or `null` when we are adding a new one.
- Then we grab references to all the HTML elements we need (form, inputs, buttons, sections) using `document.getElementById` and `document.querySelectorAll`.

### loadTitles()

Reads the `'manga-titles'` key from localStorage. If there is saved data, it parses the JSON string back into an array. If there is nothing (first visit), it returns an empty array.

### saveTitles()

Takes the `titles` array, turns it into a JSON string with `JSON.stringify`, and stores it in localStorage under the key `'manga-titles'`.

### addTitle(event)

Called when the form is submitted. It:
1. Stops the page from reloading (`event.preventDefault()`).
2. Reads all the form values.
3. Validates: title must not be empty, chapter must be a number >= 0.
4. If `editingId` is not null, it finds that title in the array and updates its values, then resets back to add mode.
5. If `editingId` is null, it creates a new title object with `Date.now()` as the id and pushes it into the array.
6. Resets the form, saves, and re-renders.

### deleteTitle(id)

Shows a `window.confirm('Delete this title?')` dialog. If the user clicks OK, it filters the array to remove the title with that id, then saves and re-renders.

### addChapter(id)

Loops through the array to find the title with the given id, adds 1 to its chapter number, saves, and re-renders.

### editTitle(id)

Finds the title with the given id and fills the form inputs with its values. Changes the submit button text to `'Save changes'`, shows the Cancel button, and sets `editingId` to that title's id. Scrolls to the top so the user sees the form.

### cancelEdit()

Resets `editingId` to null, changes the button back to `'Add Title'`, hides the Cancel button, and resets the form.

### changeTab(event)

Reads the `data-status` attribute from the clicked tab button using `event.target.dataset.status`. Sets `currentStatus` to that value. Removes the `active` class from all tab buttons and adds it to the clicked one. Then re-renders so only matching titles show.

### updateSummary()

Loops through all titles (not the filtered ones) to count:
- Total number of titles
- How many have status `'Reading'`
- How many have status `'Completed'`
- The sum and count of numeric ratings

Then updates the four summary spans with these numbers. If no titles have a rating, it shows `'No ratings yet'`.

### renderTitles()

This is the main display function. It:
1. Removes all existing cards from the page.
2. Gets the search text from the search box.
3. Filters the titles array by both the active tab and the search text.
4. For each matching title, builds a card using `document.createElement` for every element (cover, name, type, status, chapter, rating, notes, buttons).
5. Attaches click listeners to the +1 Chapter, Edit, and Delete buttons.
6. Appends each card to the cards section.
7. Calls `updateSummary()` at the end.

### Event listeners at the bottom

- `titleForm` listens for `'submit'` and calls `addTitle`.
- `cancelBtn` listens for `'click'` and calls `cancelEdit`.
- `searchBox` listens for `'keyup'` and calls `renderTitles` so cards filter instantly.
- Each tab button listens for `'click'` and calls `changeTab`.

### Startup

The last two lines load the saved titles from localStorage and render them. This is how the page restores data after a refresh.

---

## 3. How Search and Tabs Work Together

Both search and tabs filter the same `titles` array inside `renderTitles()`.

The filter checks two conditions at the same time:

```
let matchesTab = currentStatus === 'All' || title.status === currentStatus;
let matchesSearch = title.name.toLowerCase().indexOf(searchTerm) !== -1;
return matchesTab && matchesSearch;
```

A title only shows if it passes BOTH checks.

**Example:**
Say we have three titles:
1. "Dragon Quest" — status: Reading
2. "Dragon Ball" — status: Completed
3. "One Piece" — status: Reading

If the user clicks the "Reading" tab and types "dragon" in the search box:
- "Dragon Quest" — Reading matches the tab, "dragon" is in the name → SHOWN
- "Dragon Ball" — Completed does not match Reading tab → HIDDEN
- "One Piece" — Reading matches the tab, but "dragon" is not in "one piece" → HIDDEN

Only "Dragon Quest" shows up.

---

## 4. How the Average Rating Is Calculated

In `updateSummary()`, we loop through all titles. For each title whose rating is not `'No rating'`, we add its numeric rating to `ratingSum` and add 1 to `ratingNum`.

At the end:
```
let avg = (ratingSum / ratingNum).toFixed(1);
```

**Worked example:**
Say we have 4 titles:
- Title A — rating: 8
- Title B — rating: No rating
- Title C — rating: 6
- Title D — rating: 9

We skip Title B because it has no rating.
- ratingSum = 8 + 6 + 9 = 23
- ratingNum = 3
- avg = 23 / 3 = 7.666...
- toFixed(1) rounds it to 7.7

The summary shows: "Avg Rating: 7.7"

If all titles have "No rating", ratingNum is 0, and we show "Avg Rating: No ratings yet" instead of dividing by zero.

---

## 5. How localStorage Works

localStorage is a simple key-value store built into every browser. It saves strings that stay even after you close the browser.

We use two functions:
- `localStorage.setItem('manga-titles', JSON.stringify(titles))` — converts the titles array to a JSON string and stores it.
- `localStorage.getItem('manga-titles')` — reads the string back. We then use `JSON.parse()` to turn it back into an array.

**Tiny example:**
```
// Saving
let fruits = ['apple', 'banana'];
localStorage.setItem('my-fruits', JSON.stringify(fruits));
// Now the string '["apple","banana"]' is stored.

// Loading
let saved = localStorage.getItem('my-fruits');
let loaded = JSON.parse(saved);
// loaded is now the array ['apple', 'banana'] again.
```

On the first visit, `localStorage.getItem('manga-titles')` returns `null`, so `loadTitles()` returns an empty array. After the user adds a title, `saveTitles()` writes the data. On the next visit, the data is loaded back.

---

## 6. Viva Questions and Answers

**Q1: What does `event.preventDefault()` do in addTitle?**
It stops the form from doing its default action, which is reloading the page. We want to handle the form with JavaScript instead.

**Q2: Why do you use `Date.now()` as the id?**
`Date.now()` returns the current time in milliseconds. Since no two titles are added at the exact same millisecond, each title gets a unique id. This helps us find, edit, and delete specific titles.

**Q3: What is the difference between `textContent` and `innerHTML`?**
`textContent` sets plain text only — it does not interpret HTML tags. `innerHTML` can parse HTML, which can be a security risk (XSS). We use `textContent` because it is safer and we only need plain text.

**Q4: Why is the script tag at the bottom of the body?**
So that all the HTML elements already exist in the page before the script tries to find them with `getElementById`. If the script ran first, it would not find the elements yet.

**Q5: How does CSS Grid's `repeat(auto-fill, minmax(280px, 1fr))` work?**
It tells the browser to make as many columns as it can fit, where each column is at least 280px wide and can grow to fill available space. On a wide screen you get 3 or 4 columns, on a phone you get 1.

**Q6: What does `JSON.stringify` do?**
It converts a JavaScript value (like an array or object) into a JSON-formatted string. This is needed because localStorage can only store strings, not arrays or objects directly.

**Q7: How does the search filter work?**
On every `keyup` event in the search box, `renderTitles()` runs. It gets the search text, converts it to lowercase, and uses `indexOf` to check if each title's name (also lowercased) contains the search text. Titles that do not match are not shown.

**Q8: What is `dataset` and how do you use it?**
When you add a `data-` attribute to an HTML element (like `data-status="Reading"`), JavaScript can read it with `element.dataset.status`. We use this on the tab buttons to know which status was clicked.

**Q9: Why do you use `let` and `const` instead of `var`?**
`let` and `const` have block scope, which means they only exist inside the curly braces where they are declared. `var` has function scope, which can cause confusing bugs. `const` is for values that do not change (like element references), and `let` is for values that do change (like the titles array or loop counters).

**Q10: How do tabs and search work together?**
Both filters are combined with `&&` in the `filter()` callback. A title must match the active tab AND the search text to appear. If either condition is false, the title is hidden.

**Q11: What happens if localStorage is empty?**
`localStorage.getItem` returns `null`. In `loadTitles`, we check `if (saved)` — null is falsy, so we return an empty array. The page starts with no cards and the summary shows zeros.

**Q12: How does the edit feature work?**
Clicking Edit calls `editTitle(id)`, which finds the title and fills the form with its values. It sets `editingId` to that title's id and changes the button to "Save changes". When the form is submitted, `addTitle` checks if `editingId` is not null — if so, it updates the existing title instead of creating a new one. Clicking Cancel calls `cancelEdit`, which resets everything back to add mode.

---

## 7. Concepts Used (Revision List)

### HTML
- Semantic tags: `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<form>`
- Form elements: `<input>`, `<select>`, `<option>`, `<textarea>`, `<button>`, `<label>`
- Attributes: `type`, `id`, `for`, `placeholder`, `min`, `value`, `class`, `data-status`
- Viewport meta tag for responsive design

### CSS
- Box model and `box-sizing: border-box`
- Flexbox: `display: flex`, `flex-direction`, `flex-wrap`, `gap`, `align-items`, `justify-content`
- CSS Grid: `display: grid`, `grid-template-columns`, `repeat()`, `auto-fill`, `minmax()`
- Selectors: class, id, type, descendant, pseudo-class (`:hover`, `:focus`, `.active`)
- Media query: `@media (max-width: 768px)`
- Units: `rem`, `px`, `%`, `fr`, `vh`
- Colors: hex values, rgba

### JavaScript
- Variables: `let`, `const`
- Functions: function declarations, function expressions (in callbacks)
- DOM: `getElementById`, `querySelectorAll`, `createElement`, `appendChild`, `removeChild`, `textContent`, `classList.add`, `classList.remove`
- Events: `addEventListener`, `submit`, `click`, `keyup`, `event.preventDefault()`
- Arrays: `push`, `filter`, `forEach`
- Objects: creating objects with properties, accessing properties with dot notation
- Strings: `trim()`, `toLowerCase()`, `indexOf()`, `charAt()`
- Numbers: `parseInt()`, `isNaN()`, `toFixed()`
- JSON: `JSON.stringify()`, `JSON.parse()`
- localStorage: `setItem()`, `getItem()`
- `Date.now()` for unique IDs
- `window.confirm()` for delete confirmation
- `window.scrollTo()` for scrolling
