const genreGrid = document.querySelector('div#genre-grid');
const genreFieldset = document.querySelector('div#genre-cont fieldset');
const genreMax = 3;

const selectMonthButton = document.querySelector('button#get-month');
    selectMonthButton.addEventListener('click', popMonthSelect);
const selectMonthButtonText = document.querySelector('button#get-month span#month-label');
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
const genreCountText = document.querySelector('span#genre-count');

// Form input Fields
const title = document.querySelector('input#get-title');
const author = document.querySelector('input#get-author');
const pages = document.querySelector('input#get-pages');
const publishMonth = document.querySelector('button#get-month');
const publishYear = document.querySelector('input#get-year');
const coverURL = document.querySelector('textarea#get-cover');
const readRadio = document.querySelectorAll('input[name="read-status"]');



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
    genreCheckbox.setAttribute('value', `${genre.labelText}`);

    const genreLabel = document.createElement('label');
    genreLabel.setAttribute('for', `${genre.id}`);
    genreLabel.textContent = `${genre.labelText}`;

    genreContainer.appendChild(genreCheckbox);
    genreContainer.appendChild(genreLabel);

    genreGrid.appendChild(genreContainer);
}

genreArray.forEach(genre => addGenre(genre));
const genreCheckboxes = document.querySelectorAll('input[name="genre"]');
// Adds genre (end) - 

// Pops and close Month Selector (start) -
function popMonthSelect() {
    monthSelector.showModal();

    const buttonPos = selectMonthButton.getBoundingClientRect();
    // const modalHeight = monthSelector.offsetHeight;

    const dialogTop = buttonPos.top + 15;
    const dialogLeft = buttonPos.left;  

    monthSelector.style.top = `${dialogTop}px`;
    monthSelector.style.left = `${dialogLeft}px`;

    function detectScroll() {
        monthSelector.close();
        window.removeEventListener('scroll', detectScroll);
    }
    window.addEventListener('scroll', detectScroll);
    
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
function CreateBook ( id, title, author, pages, month, year, published, cover, readStatus, genre ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.month = month;
    this.year = year
    this.published = published;
    this.cover = cover;
    this.readStatus = readStatus;
    this.genre = genre;
    // bookArray.push(this);
}
//  Creates book objects (end) -

// Genre Limiter function (start) -
function checkGenreLength () {
    const genreChecked = Array.from(genreCheckboxes).filter(checkbox => checkbox.checked);
    const genreUnchecked = Array.from(genreCheckboxes).filter(checkbox => !checkbox.checked);

    // Disables genre checkboxes when max is reached
    if (genreChecked.length === genreMax) {
        genreUnchecked.forEach(genre => {
            genre.setAttribute('disabled', 'true');
            genre.nextSibling.classList.add('disabled');
        });
    } else if (genreChecked.length < genreMax ) {
        genreCheckboxes.forEach(genre => {
            if (genre.getAttribute('disabled')) {
                genre.removeAttribute('disabled');
                genre.nextSibling.classList.remove('disabled');
            }
        })
    }

    // Note: classList methods is used to ensure validation guide only triggers after faulty first submit
    if (genreFieldset.getAttribute('class') === 'error') {
        genreFieldset.classList.remove('error');
    } else if (genreFieldset.getAttribute('class') === '' && genreChecked.length === 0) {
        genreFieldset.classList.add('error');
    }

    genreCountText.textContent = `(${genreChecked.length} / ${genreMax})`;
}
// Genre Limiter function (end) -

// Guides user for error/ validation (start) -
function activeListening (event) {
    if (event.type === 'focus') {
        this.classList.remove('error');
    }

    if (event.type === 'blur') {
        if (this.value.trim() === '') {
            this.setAttribute('class', 'error');
        } else {
            this.classList.remove('error');
        }
    }
}

function addActiveListening (inputField) {
    inputField.classList.add('error');
    inputField.addEventListener('focus', activeListening);
    inputField.addEventListener('blur', activeListening);
}
// Guides user for error/ validation (end) -

// Changes Read Status from button (start) - 
function changeReadStatus () {
    const readStatusArray = ['nys', 'ongoing', 'done'];
    const buttonId = this.dataset.id;
    const bookObj = bookArray.filter(obj => obj.id === buttonId)[0];

    const indexOfCurrent = readStatusArray.findIndex(status => status === bookObj.readStatus);

    // Cycles the read Status upon button press
    // Changes object property
    if ((indexOfCurrent + 1) === readStatusArray.length) {
        bookObj.readStatus = readStatusArray[0];
    } else {
        bookObj.readStatus = readStatusArray[indexOfCurrent + 1];
    }

    // Changes DOM properties
    this.setAttribute('class', bookObj.readStatus);

    const readStatusLabel = document.querySelector(`section[data-id='${buttonId}'] p[data-class='read-status']`);

    readStatusLabel.setAttribute('class', bookObj.readStatus);

    switch (bookObj.readStatus) {
        case 'nys': 
            readStatusLabel.textContent = 'Not Yet Started';
            break;
        case 'ongoing': 
            readStatusLabel.textContent = 'On-going';
            break;
        case 'done': 
            readStatusLabel.textContent = 'Done';
            break;
        default :
            readStatusLabel.textContent = 'Not Yet Started';
    }
}
// Changes Read Status from button (end) -

// Add Book content to page function (start) -
function addBookContent (book) {
    const template = document.querySelector('section[data-template="template"]');

    // Clones template from HTML as reference to new content
    const newBookContainer = template.cloneNode(true);
    newBookContainer.removeAttribute('data-template');

    // Add data id to relevant elements
    const dataIdNodes = newBookContainer.querySelectorAll('[data-id]');
    dataIdNodes.forEach(node => node.setAttribute('data-id', book.id));
    newBookContainer.setAttribute('data-id', `${book.id}`);
    
    // Adds title
    newBookContainer.querySelector('h3').textContent = book.title;

    // Adds event listener to edit button
    const newEditBtn = newBookContainer.querySelector('button[data-class="edit"]');
    newEditBtn.addEventListener('click', showBookForm);

    // Styles Read Status button by adding class
    const newReadBtn = newBookContainer.querySelector('button[data-class="read-status"]');
    newReadBtn.setAttribute('class', `${book.readStatus}`);

    // Adds event listener to read button
    newReadBtn.addEventListener('click', changeReadStatus);
    
    // Adds genre
    const genreList = newBookContainer.querySelector('div.genre ul');
    book.genre.forEach(genre => {
        const newList = document.createElement('li');
        newList.setAttribute('data-class', 'genre-tag');
        newList.textContent = genre;

        genreList.appendChild(newList);
    })

    // Adds cover image, with fallback
    const fallbackImage = 'url(./images/book-preview.svg)';
    const newCoverImage = newBookContainer.querySelector('div[data-class="cover-image"]');
    newCoverImage.setAttribute('style', `background-image:url('${book.cover}'), ${fallbackImage}`);

    // Adds read status text
    const newReadStatus = newBookContainer.querySelector('p[data-class="read-status"]');
    newReadStatus.setAttribute('class', `${book.readStatus}`);

    switch (book.readStatus) {
        case 'nys': 
            newReadStatus.textContent = 'Not Yet Started';
            break;
        case 'ongoing': 
            newReadStatus.textContent = 'On-going';
            break;
        case 'done': 
            newReadStatus.textContent = 'Done';
            break;
        default :
            newReadStatus.textContent = 'Not Yet Started';
    }

    // Adds author, published, pages
    const newAuthor = newBookContainer.querySelector('div.author p.content');
    newAuthor.textContent = `${book.author}`;

    const newPublished = newBookContainer.querySelector('div.published p.content');
    newPublished.textContent = `${book.published}`;

    const newPages = newBookContainer.querySelector('div.pages p.content');
    newPages.textContent = `${book.pages}`;

    // Appends final structure to DOM
    libraryGrid.appendChild(newBookContainer);
}
// Add Book content to page function (end) -
    

// Open and Close Add Book Form (start) -
// Open Add Book Form (start) --
function showBookForm () {
    const editBtnId = this.dataset.id;
    const bookObj = bookArray.filter(obj => obj.id === editBtnId)[0];
    console.log(bookObj);
    
    if ( this === addBookButton || this.dataset.class === 'edit') {
        formDialog.showModal();
    } else if ( this === formDialogExit ) {
        formDialog.close();
    }

    // Adds max attribute to get-year input field
    const currentYear = new Date().getFullYear();
    const getYearInput = document.querySelector('input#get-year');
    getYearInput.setAttribute('max', currentYear);

    // Limits genre checks to max=3
    genreCountText.textContent = `(0 / ${genreMax})`; 
    genreCheckboxes.forEach(genreInput => genreInput.addEventListener('change', checkGenreLength));

    // Specified content for addBook
    if (this === addBookButton) {
        const formHeader = document.querySelector('div#add-book-cont h3');
        formHeader.textContent = 'Add Book';
        saveButton.setAttribute('data-action', 'save-add');

        // document.querySelector('form#add-book-form').reset();
        // publishMonth.setAttribute('class', 'empty');
        // publishMonth.setAttribute('value', '');
        // selectMonthButtonText.textContent = 'Select Month';
        // genreCheckboxes.forEach(checkbox => {
        //     if (checkbox.hasAttribute('disabled')) {
        //         checkbox.removeAttribute('disabled');
        //         checkbox.nextSibling.classList.remove('disabled');
        //     }
        // });
    }

    // Adds data to form if dialog was triggered by "edit"
    if (this.dataset.class === 'edit') {
        const formHeader = document.querySelector('div#add-book-cont h3');
        formHeader.textContent = 'Edit Book';
        saveButton.setAttribute('data-action', 'save-edit');

        title.setAttribute('value', `${bookObj.title}`);
        author.setAttribute('value', `${bookObj.author}`);

        if (bookObj.pages === 'unknown') {
            pages.setAttribute('value', '');
        } else {
            pages.setAttribute('value', `${bookObj.pages}`);
        }
        
        if (bookObj.month === '') {
            publishMonth.setAttribute('value', '');
            publishMonth.setAttribute('class', 'empty');
            selectMonthButtonText.textContent = `Select Month`;
        } else {
            publishMonth.setAttribute('value', `${bookObj.month}`);
            publishMonth.setAttribute('class', '');
            selectMonthButtonText.textContent = `${bookObj.month}`;
        }
        publishYear.setAttribute('value', `${bookObj.year}`);

        coverURL.setAttribute('value', `${bookObj.cover}`);

        genreCheckboxes.forEach(checkbox => {
            const genreCheckbox = checkbox;
            if (bookObj.genre.includes(checkbox.value)) {
                genreCheckbox.checked = true;
            } else {
                genreCheckbox.checked = false;
            }
        });
        checkGenreLength();

        readRadio.forEach(radio => {
            const readRadioBox = radio;
            if (readRadioBox.value === bookObj.readStatus) {
                readRadioBox.checked = true;
            }
        });
    }
}
// Open Add Book Form (end) --

// Close Add Book Form (start) --   
function saveBook () {
    const errors = [];

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

        if ( !validateResult) {
            addActiveListening(inputField);
        }
        
        return "unknown";
    }

    // Creates Book ID
    function createId () {
        const bookIdString =  title.value.split(" "); // creates an array of words from title
        const bookId = bookIdString.map(word => word.toUpperCase().slice(0, 1)); // get title first letters in uppercase

        let year = '00';

        if (publishYear.value !== '') {
            year = publishYear.value;
        }

        let newId = `${bookId.join("")}_${year}`;

        // Check if there is duplicate book (Allow but Id is numbered)
        const bookIds = bookArray.map(book => book.id);
        const sameId = bookIds.filter(id => id.includes(newId));
        if (sameId.length > 0) {
            newId += `(${sameId.length + 1})`;
        }

        return newId ; // creates book ID
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

        // const errorsPublished = [];

        if (month === '' && year.length === 4) {
            published = year;
        } else if (month !== '' && year.length !== 4) {
            addActiveListening(publishYear);
            errors.push(publishYear); // throws error of month without year
        } else if (month !== '' && year.length === 4) {
            published = `${month}, ${year}`;
        } else if (month === '' && year.length === 0) {
            published = 'unknown';
        } else if (month === '' && year.length !== 4) {
            addActiveListening(publishYear);
            errors.push(publishYear);
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

        if (genreCheckedArray.length === 0) {
            errors.push(genreFieldset);
            genreFieldset.classList.add('error');
        }

        return genreCheckedArray;
    }

    // Gathers return data for object creation
    function createBook() {
        const bookId = createId();
        const titleValue = createStringValue(title);
        const authorValue = createStringValue(author);
        const pagesValue = createPages();
        const monthValue = publishMonth.value;
        const yearValue = publishYear.value;
        const publishedValue = createPublished();
        const cover = createCover();
        const readValue = createRead();
        const genreChecked = createGenre();

        if (errors.length === 0) {
            return new CreateBook (bookId, titleValue , authorValue, pagesValue, monthValue, yearValue, publishedValue, cover, readValue ,genreChecked);
        }
        
        return 'pendingError';
    }
    
    // Remove event listeners used in validation
    function removeValidation(...elements) {
        elements.forEach(element => {
            element.removeEventListener('focus', activeListening);
            element.removeEventListener('blur', activeListening);
        })
    }

    // Check for errors before closing
    const newBook = createBook();
    const saveBookAction = this.dataset.action;

    if (newBook !== 'pendingError' && saveBookAction === 'save-add') {
        genreCheckboxes.forEach(genreInput => genreInput.removeEventListener('change', checkGenreLength));
        removeValidation(title, author);
        bookArray.push(newBook);
        addBookContent(newBook);
        formDialog.close();

        // Clears the form upon successful save
        document.querySelector('form#add-book-form').reset();
        publishMonth.setAttribute('class', 'empty');
        publishMonth.setAttribute('value', '');
        selectMonthButtonText.textContent = 'Select Month';
        genreCheckboxes.forEach(checkbox => {
            if (checkbox.hasAttribute('disabled')) {
                checkbox.removeAttribute('disabled');
                checkbox.nextSibling.classList.remove('disabled');
            }
        });

    } else if (newBook !== 'pendingError' && saveBookAction === 'save-edit') {
        console.log('edit');
    }













    console.log(bookArray);
   
}
// Close Add Book Form (end) -- 
// Open and Close Add Book Form (end) -
