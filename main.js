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

const libraryGrid = document.querySelector('section#library-grid');


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
function CreateBook ( id, title, author, pages, published, cover, readStatus, genre ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.published = published;
    this.cover = cover;
    this.readStatus = readStatus;
    this.genre = genre;
    // bookArray.push(this);
}

//  Creates book objects (end) -

// Open and Close Add Book Form (start) -

function showBookForm () {
    if ( this === addBookButton ) {
        formDialog.showModal();
    } else if ( this === formDialogExit ) {
        formDialog.close();
    }

    // Adds max attribute to get-year input field
    const currentYear = new Date().getFullYear();
    const getYearInput = document.querySelector('input#get-year');
    getYearInput.setAttribute('max', currentYear);
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
    const readRadio = document.querySelectorAll('input[name="read-status"]');
    const genreCheckboxes = document.querySelectorAll('input[name="genre"]');

    function validate (inputField) {
        if (inputField.value.trim() === '') {
            errors.push(inputField);
            return false
        } 

        return true;
    }

    // Create Title and Author
    function createStringValue (inputField) {
        const validateResult = validate(inputField);

        if ( validateResult ) {
            return inputField.value;
        }

        return "unknown";
    }

    // Creates Book ID
    function createId () {
        const bookIdString =  title.value.split(" "); // creates an array of words from title
        const bookId = bookIdString.map(word => word.toUpperCase().slice(0, 1)); // get title first letters in uppercase

        return `${bookId.join("")}_${publishYear.value}`; // creates book ID
    }

    // Validates/ Create pages 
    function createPages () {
        let pageValue = 'unknown';

        if (pages.value.trim() === '' ) {
            pageValue = 'unknown';
        } else {
            pageValue = pages.value.trim();
        }

        return pageValue;

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

    // Creates/ checks ReadStatus
    function createRead() {
        let readRadioChecked = 'nys';
        
        readRadio.forEach(radio => {
            if (radio.checked) {
                readRadioChecked = radio.value;
            }
        });

        return readRadioChecked;
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
        const titleValue = createStringValue(title);
        const authorValue = createStringValue(author);
        const pagesValue = createPages();
        const publishedValue = createPublished();
        const cover = createCover();
        const readValue = createRead();
        const genreChecked = createGenre();

        return new CreateBook (bookId, titleValue , authorValue, pagesValue, publishedValue, cover, readValue ,genreChecked);
    }

   const newBook = createBook();
   bookArray.push(newBook);
//    console.log(bookArray);
//    console.log(newBook.id);

    function addBookContent () {
        const template = document.querySelector('section[data-template="template"]');

        const newBookContainer = template.cloneNode(true);
        newBookContainer.removeAttribute('data-template');

        const dataIdNodes = newBookContainer.querySelectorAll('[data-id]');
        dataIdNodes.forEach(node => node.setAttribute('data-id', newBook.id));

        newBookContainer.setAttribute('data-id', `${newBook.id}`);
        
        newBookContainer.querySelector('h3').textContent = newBook.title;






        libraryGrid.appendChild(newBookContainer);
        // console.log(newBookContainer);
    }

addBookContent();




}










// Open and Close Add Book Form (end) -
