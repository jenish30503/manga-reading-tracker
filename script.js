// the main array that holds all titles
let titles = [];

// grab the form and input elements
const titleForm = document.getElementById('title-form');
const titleInput = document.getElementById('title-input');
const typeSelect = document.getElementById('type-select');
const statusSelect = document.getElementById('status-select');
const chapterInput = document.getElementById('chapter-input');
const ratingSelect = document.getElementById('rating-select');
const notesInput = document.getElementById('notes-input');
const submitBtn = document.getElementById('submit-btn');
const cardsSection = document.getElementById('cards-section');

// add a new title to the list
function addTitle(event) {
    event.preventDefault();

    let name = titleInput.value.trim();
    let type = typeSelect.value;
    let status = statusSelect.value;
    let chapter = parseInt(chapterInput.value);
    let rating = ratingSelect.value;
    let notes = notesInput.value.trim();

    // don't allow empty title
    if (name === '') {
        alert('Please enter a title.');
        return;
    }

    // chapter must be a number and not negative
    if (isNaN(chapter) || chapter < 0) {
        alert('Chapter must be a number that is 0 or more.');
        return;
    }

    // create a new title object with a unique id
    let newTitle = {
        id: Date.now(),
        name: name,
        type: type,
        status: status,
        chapter: chapter,
        rating: rating,
        notes: notes
    };

    titles.push(newTitle);

    // reset the form after adding
    titleForm.reset();
    chapterInput.value = '0';
}

// listen for form submit
titleForm.addEventListener('submit', addTitle);
