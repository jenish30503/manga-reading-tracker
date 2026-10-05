// the main array that holds all titles
let titles = [];

// which status tab is active right now
let currentStatus = 'All';

// grab the form and input elements
const titleForm = document.getElementById('title-form');
const titleInput = document.getElementById('title-input');
const typeSelect = document.getElementById('type-select');
const statusSelect = document.getElementById('status-select');
const chapterInput = document.getElementById('chapter-input');
const ratingSelect = document.getElementById('rating-select');
const notesInput = document.getElementById('notes-input');
const submitBtn = document.getElementById('submit-btn');
const searchBox = document.getElementById('search-box');
const cardsSection = document.getElementById('cards-section');
const tabButtons = document.querySelectorAll('.tab-btn');

// load titles from localStorage, or return empty array on first visit
function loadTitles() {
    let saved = localStorage.getItem('manga-titles');
    if (saved) {
        return JSON.parse(saved);
    }
    return [];
}

// save the titles array to localStorage
function saveTitles() {
    localStorage.setItem('manga-titles', JSON.stringify(titles));
}

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

    saveTitles();
    renderTitles();
}

// delete a title after the user confirms
function deleteTitle(id) {
    if (window.confirm('Delete this title?')) {
        titles = titles.filter(function (title) {
            return title.id !== id;
        });
        saveTitles();
        renderTitles();
    }
}

// add 1 to the chapter number and save
function addChapter(id) {
    for (let i = 0; i < titles.length; i++) {
        if (titles[i].id === id) {
            titles[i].chapter = titles[i].chapter + 1;
            break;
        }
    }
    saveTitles();
    renderTitles();
}

// switch the active status tab and re-render
function changeTab(event) {
    currentStatus = event.target.dataset.status;

    // remove active from all tabs and add it to the clicked one
    tabButtons.forEach(function (btn) {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    renderTitles();
}

// build and show the title cards on the page
function renderTitles() {
    // clear old cards first
    while (cardsSection.firstChild) {
        cardsSection.removeChild(cardsSection.firstChild);
    }

    // get the search text and make it lowercase for matching
    let searchTerm = searchBox.value.trim().toLowerCase();

    // filter titles by the active tab and the search text
    let filtered = titles.filter(function (title) {
        let matchesTab = currentStatus === 'All' || title.status === currentStatus;
        let matchesSearch = title.name.toLowerCase().indexOf(searchTerm) !== -1;
        return matchesTab && matchesSearch;
    });

    // build a card for each title that matches
    filtered.forEach(function (title) {
        let card = document.createElement('article');
        card.classList.add('card');

        // cover block with the first letter of the title
        let cover = document.createElement('div');
        cover.classList.add('card-cover');
        cover.textContent = title.name.charAt(0).toUpperCase();
        card.appendChild(cover);

        // title name
        let nameEl = document.createElement('h3');
        nameEl.classList.add('card-title');
        nameEl.textContent = title.name;
        card.appendChild(nameEl);

        // type label
        let typeEl = document.createElement('p');
        typeEl.classList.add('card-info');
        typeEl.textContent = 'Type: ' + title.type;
        card.appendChild(typeEl);

        // status label
        let statusEl = document.createElement('p');
        statusEl.classList.add('card-info');
        statusEl.textContent = 'Status: ' + title.status;
        card.appendChild(statusEl);

        // current chapter
        let chapterEl = document.createElement('p');
        chapterEl.classList.add('card-info');
        chapterEl.textContent = 'Chapter: ' + title.chapter;
        card.appendChild(chapterEl);

        // rating
        let ratingEl = document.createElement('p');
        ratingEl.classList.add('card-info');
        ratingEl.textContent = 'Rating: ' + title.rating;
        card.appendChild(ratingEl);

        // only show notes if the user wrote something
        if (title.notes !== '') {
            let notesEl = document.createElement('p');
            notesEl.classList.add('card-notes');
            notesEl.textContent = title.notes;
            card.appendChild(notesEl);
        }

        // buttons row
        let buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('card-buttons');

        // +1 chapter button
        let plusBtn = document.createElement('button');
        plusBtn.textContent = '+1 Chapter';
        plusBtn.addEventListener('click', function () {
            addChapter(title.id);
        });
        buttonsDiv.appendChild(plusBtn);

        // delete button
        let delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.classList.add('btn-delete');
        delBtn.addEventListener('click', function () {
            deleteTitle(title.id);
        });
        buttonsDiv.appendChild(delBtn);

        card.appendChild(buttonsDiv);
        cardsSection.appendChild(card);
    });
}

// listen for form submit
titleForm.addEventListener('submit', addTitle);

// filter cards as the user types in the search box
searchBox.addEventListener('keyup', function () {
    renderTitles();
});

// listen for tab clicks
tabButtons.forEach(function (btn) {
    btn.addEventListener('click', changeTab);
});

// load saved titles when the page opens
titles = loadTitles();
renderTitles();
