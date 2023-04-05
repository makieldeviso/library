const genreField = document.querySelector("div#genre-cont fieldset");
const genreGrid = document.querySelector('div#genre-grid');

const selectMonthButton = document.querySelector('button#get-month');
    selectMonthButton.addEventListener('click', popMonthSelect);
    const selectMonthButtonText = document.querySelector('button#get-month span');
const monthSelector = document.querySelector('dialog#month-selector');
const months = document.querySelectorAll('button.month');
    months.forEach(month => {month.addEventListener('click', selectMonth)});

const addBookButton = document.querySelector('button#add-book');
    addBookButton.addEventListener('click', showBookForm);

const formDialog = document.querySelector('dialog#add-book-dialog');
const formDialogExit = document.querySelector('button#exit-add-form');
    formDialogExit.addEventListener('click', showBookForm);
const saveButton = document.querySelector('button#save-book');
    saveButton.addEventListener('click', saveBook);


// Adds genre (start) - 
const genreArray = [];
function Genre(id, labelText ) {
    this.id = id;
    this.labelText = labelText;
    this.name = 'genre';
    genreArray.push(this);
}

const literaryFiction = new Genre('literary-fiction', 'Literary Fiction');
const mystery = new Genre('mystery', 'Mystery');
const thriller = new Genre('thriller', 'Thriller');
const horror = new Genre('horror', 'Horror');
const historical = new Genre('historical', 'Historical');
const romance = new Genre('romance', 'Romance');
const western = new Genre('western', 'Western');
const bildungsroman = new Genre('bildungsroman', 'Bildungsroman');
const speculativeFiction = new Genre('speculative-fiction', 'Speculative Fiction');
const scienceFiction = new Genre('science-fiction', 'Science Fiction');
const fantasy = new Genre('fantasy', 'Fantasy');
const dystopian = new Genre('dystopian', 'Dystopian');
const magicalRealism = new Genre('magical-realism', 'Magical Realism');
const realistLiterature = new Genre('realist-literature', 'Realist Literature');

// Sorts the genre alphabetically (start) --
genreArray.sort((a, b) => {
    const idA = a.id.toUpperCase();
    const idB = b.id.toUpperCase();

    if (idA < idB) {
        return -1;
      }
    
    if (idA > idB) {
        return 1;
      }
      
    return 0;
});
// Sorts the genre alphabetically (end) --

function addGenre(genre) {
    const genreContainer = document.createElement('div');
    genreContainer.setAttribute('class', 'checkbox-cont');

    const genreCheckbox = document.createElement('input');
    genreCheckbox.setAttribute('type', 'checkbox');
    genreCheckbox.setAttribute('name', `${genre.name}`);
    genreCheckbox.setAttribute('id', `${genre.id}`);
    genreCheckbox.setAttribute('value', `${genre.id}`);

    const genreLabel = document.createElement('label');
    genreLabel.setAttribute('for', `${genre.id}`);
    genreLabel.textContent = `${genre.labelText}`;

    genreContainer.appendChild(genreCheckbox);
    genreContainer.appendChild(genreLabel);

    genreGrid.appendChild(genreContainer);
}

genreArray.forEach(genre => addGenre(genre));
// Adds genre (end) - 

// Pops and close Month Selector (start) -
function popMonthSelect() {
    monthSelector.showModal();

    const buttonPos = selectMonthButton.getBoundingClientRect();
    const modalHeight = monthSelector.offsetHeight;

    const dialogTop = buttonPos.top - modalHeight - 10;
    const dialogLeft = buttonPos.left;

    monthSelector.style.top = `${dialogTop}px`;
    monthSelector.style.left = `${dialogLeft}px`;

    window.addEventListener('scroll', detectScroll);
    function detectScroll() {
        monthSelector.close();
        window.removeEventListener('scroll', detectScroll);
    }
}

function selectMonth() {
    const monthValue = this.getAttribute('value');
    selectMonthButton.setAttribute('value', monthValue);
    
    if (monthValue === '') {
        selectMonthButtonText.textContent = 'Select Month';
        selectMonthButton.setAttribute( 'class', 'empty' );
    } else if(monthValue === 'exit') {
        monthSelector.close();
        return;
    } else {
        selectMonthButtonText.textContent = monthValue;
        selectMonthButton.setAttribute('class', '');
    }

    monthSelector.close();
}
// Pops and close Month Selector (end) -

//  Creates book objects (start) - 
const bookArray = [];
function CreateBook ( name, title, author, pages, published, cover, genre ) {
    this.name = name;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.published = published;
    this.cover = cover;
    this.readStatus = 'Not Yet Started';
    this.genre = genre;
    bookArray.push(this);
}

//  Creates book objects (end) -

// Open and Close Add Book Form (start) -

function showBookForm () {
    if ( this === addBookButton ) {
        formDialog.showModal();
    } else if ( this === formDialogExit ) {
        formDialog.close();
    }
}

function saveBook () {
    // formDialog.close();

    const errors = [];

    const title = document.querySelector('input#get-title');
    const author = document.querySelector('input#get-author');
    const pages = document.querySelector('input#get-pages');
    const publishMonth = document.querySelector('button#get-month');
    const publishYear = document.querySelector('input#get-year');
    const coverURL = document.querySelector('textarea#get-cover');
    const genreCheckboxes = document.querySelectorAll('input[name="genre"]');

    // Validates the Title, Author, Pages
    function validate (...inputField) {
        inputField.forEach(input => {
            if ( input.value.length === 0 ) {
                errors.push(input);
            } 
        });        
    }
    validate(title, author);

    // Creates Book ID
    function createId () {
        const bookIdString =  title.value.split(" "); // creates an array of words from title
        const bookId = bookIdString.map(word => word.toUpperCase().slice(0, 1)); // get title first letters in uppercase

        return `${bookId.join("")}_${publishYear.value}`; // creates book ID
    }

    // Create Published Date value
    function createPublished () {
        const month = publishMonth.value;
        const year = publishYear.value;
        let published = '';

        const errorsPublished = [];

        if (month.length === 0 && year.length !== 0) {
            published = year;
        } else if (month.length !== 0 && year.length === 0) {
            errorsPublished.push(publishMonth); // throws error of month without year
        } else if (month.length !== 0 && year.length !== 0) {
            published = `${month}, ${year}`;
        } else if (month.length === 0 && year.length === 0) {
            published = 'unknown';
        }

        return published;
    }

    // Validates/ Create coverURL 
    function createCover () {
        let cover = '';

        if (coverURL.value.length === 0) {
            cover = '';
        } else {
            cover = coverURL.value;
        }
        return cover;
    }


    // Creates genre Array
    function createGenre () {
        const genreCheckedArray = [];
        genreCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                genreCheckedArray.push(checkbox.value);
            }
        });

        return genreCheckedArray;
    }



    function createBook() {
        const bookId = createId();
        const published = createPublished();
        const cover = createCover();
        const genreChecked = createGenre();

        return new CreateBook (bookId, author.value, pages.value, published, cover, genreChecked, );
    }


   createBook();
   console.log(bookArray);
}










// Open and Close Add Book Form (end) -
