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

// Delete Dialog
const deleteDialog = document.querySelector('dialog#delete-book-dialog');
const deleteDialogExit = document.querySelector('button#exit-delete-form');
const yesDeleteBtn = document.querySelector('button#delete-yes');
const noDeleteBtn = document.querySelector('button#delete-no');

// Library
const libraryGrid = document.querySelector('section#library-grid');
const genreCountText = document.querySelector('span#genre-count');

// Statistics side bar
const menuBtn = document.querySelector('button#menu-btn');
const exitMenuBtn = document.querySelector('button#exit-menu-btn');
    menuBtn.addEventListener('click', showStat);
    exitMenuBtn.addEventListener('click', showStat);
const statsSideBar = document.querySelector('section#stats');

// Statistics Elements
const overAllValue = document.querySelector('p#overall-stat');
const nysValue = document.querySelector('p#nys-count');
const ongoingValue = document.querySelector('p#ongoing-count');
const doneValue = document.querySelector('p#done-count');

// Read Status bar graph
const nysLevel = document.querySelector('div#nys-level');
const ongoingLevel = document.querySelector('div#ongoing-level');
const doneLevel = document.querySelector('div#done-level');

// Form input Fields
const title = document.querySelector('input#get-title');
const author = document.querySelector('input#get-author');
const pages = document.querySelector('input#get-pages');
const publishMonth = document.querySelector('button#get-month');
const publishYear = document.querySelector('input#get-year');
const coverURL = document.querySelector('textarea#get-cover');
const readRadio = document.querySelectorAll('input[name="read-status"]');

// Shows stats through menu-btn click and touch screen (start) - 
let startX;
let moveX;
let screenWidth;

function getTouchStart (event) {
    startX = event.touches[0].clientX;
    screenWidth = window.screen.width;
}

function getTouchCurrent (event) {
    moveX = event.touches[0].clientX;
    const distanceX = moveX - startX;
    
    if (distanceX > 0) {
        const transition = distanceX / screenWidth * 100;
        statsSideBar.style.transform = `translateX(${transition}%)`;
    }
}

function closeStat() {
    statsSideBar.classList.remove('shown');

    statsSideBar.removeEventListener('touchstart', closeStatsBySlide);
    statsSideBar.addEventListener('touchmove',  getTouchCurrent);
    statsSideBar.removeEventListener('touchend', closeStatsBySlide);
}

function closeStatsBySlide () {
    const distanceX = moveX - startX;
    const transition = distanceX / screenWidth * 100;

    if (transition > 40) {
        statsSideBar.removeAttribute('style');
        closeStat();
    } else {
        statsSideBar.removeAttribute('style');
    }
}

function showStat () {
    if (this === menuBtn) {
        statsSideBar.classList.add('shown');
        statsSideBar.addEventListener('touchstart', getTouchStart);
        statsSideBar.addEventListener('touchmove', getTouchCurrent);
        statsSideBar.addEventListener('touchend', closeStatsBySlide);

    } else if (this === exitMenuBtn) {
        closeStat();
    }

    // Closes Options
    showOptions();
}
// Shows stats through menu-btn click and touch screen (end) - 

// Change stats functions (start) -
function countBook() {
    return bookArray.length;
}

function changeBookStats (arrayCount) {
    // Logs number of books in the library to the DOM
    overAllValue.setAttribute('data-value', `${arrayCount}`);
    overAllValue.textContent = `${arrayCount}`;
}

// filters bookArray according to read status --
function filterBooksRead (required) {
    const nysArray = bookArray.filter(book => book.readStatus === 'nys');
    const ongoingArray = bookArray.filter(book => book.readStatus === 'ongoing');
    const doneArray = bookArray.filter(book => book.readStatus === 'done');

    let filteredArray = nysArray;

    if (required === 'ongoing') {
        filteredArray =  ongoingArray;
    }

    if (required === 'done') {
        filteredArray =  doneArray;
    }

    if (required === 'all') {
        filteredArray =  [nysArray, ongoingArray, doneArray];
    }

    return filteredArray;
}

// Changes read Status in the Stats sidebar in the DOM
function changeReadStats () {
    // Note: Uses array and object for optimized code
    const specsArray = [];
    function ReadStatsObj (node, filteredArray, levelBar) {
        this.node = node;
        this.filteredArray = filteredArray;
        this.levelBar = levelBar;
        specsArray.push(this);
    }

    const nys = new ReadStatsObj (nysValue, filterBooksRead('nys'), nysLevel);
    const ongoing = new ReadStatsObj (ongoingValue, filterBooksRead('ongoing'), ongoingLevel);
    const done = new ReadStatsObj (doneValue, filterBooksRead('done'), doneLevel);

    specsArray.forEach(obj => {
        const pElement = obj.node;
        const levelBarElement = obj.levelBar;
        const booksArr = obj.filteredArray;

        pElement.setAttribute('data-value', `${booksArr.length}`);
        pElement.textContent = `${booksArr.length}`

        const levelPercentage = (booksArr.length / countBook()) * 100;
        levelBarElement.style.width = `${levelPercentage}%`;
    })    
}
// Change stats functions (end) -

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

// Adds genre checkboxes in the DOM function (start) --
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
// Adds genre checkboxes in the DOM function (end) --

// Note: Executes the addGenre function then contain NodeList to a variable
//  to be used for other functions. Variable should be defined after object creation
//  and DOM append.
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
const bookArray = []; // Note: Book is pushed manually 
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
}

CreateBook.prototype.pushBookToArray = function () {
    bookArray.push(this);
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
        });
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
    const bookContainer = document.querySelector(`section[data-id='${buttonId}']`);

    const indexOfCurrent = readStatusArray.findIndex(status => status === bookObj.readStatus);

    // Cycles the read Status upon button press
    // Changes object property
    if ((indexOfCurrent + 1) === readStatusArray.length) {
        bookObj.readStatus = readStatusArray[0];
    } else {
        bookObj.readStatus = readStatusArray[indexOfCurrent + 1];
    }

    // Changes DOM properties
    bookContainer.setAttribute('data-read', `${bookObj.readStatus}`); //! !!!!!!!!
    
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

    // Logs user stats
    changeReadStats();

    // Close Options
    showOptions();
}
// Changes Read Status from button (end) -

// Delete Book (start) -

function getChoice () {
    const userResponse = this.value;
    const bookId = this.dataset.id;

    if (userResponse === 'yes') {
        // Removes the book in the DOM
        const bookContent = document.querySelector(`section[data-id='${bookId}']`);
        libraryGrid.removeChild(bookContent);

        // Removes the book in the bookArray/ library
        // Note: This mutates the bookArray 
        const bookObj = bookArray.filter(book => book.id === `${bookId}`)[0];
        const bookObjIndex = bookArray.findIndex(book => book === bookObj);
        bookArray.splice(bookObjIndex, 1);
    } 

    deleteDialog.close();

    // Log user stats/ Changes statistics
    changeBookStats(countBook());
    changeReadStats();
}



function showDeletePrompt () {
    //  If delete button was pressed
    if (this.dataset.class === 'delete') {
        deleteDialog.showModal();

        // Assign variables
        const bookId = this.dataset.id;
        const bookObj = bookArray.filter(book => book.id === `${bookId}`)[0];

        // Add event listeners
        deleteDialogExit.addEventListener('click', showDeletePrompt);
        yesDeleteBtn.addEventListener('click', getChoice);
        noDeleteBtn.addEventListener('click', getChoice);

        // Assign data-id to yes/ no buttons 
        yesDeleteBtn.setAttribute('data-id', `${bookId}`);
        noDeleteBtn.setAttribute('data-id', `${bookId}`);

        
        
       // Change/ manipulate DOM
        const deleteTitleNode = document.querySelector('p#delete-title strong');
        const deleteAuthorNode = document.querySelector('p#delete-author em');

        deleteTitleNode.textContent = `${bookObj.title}`;
        deleteAuthorNode.textContent = `${bookObj.author}`;

    }
    
    // if exit modal button was pressed
    if (this === deleteDialogExit) {
        deleteDialogExit.removeEventListener('click', showDeletePrompt);

        // Remove event listeners
        deleteDialogExit.removeEventListener('click', showDeletePrompt);
        yesDeleteBtn.removeEventListener('click', getChoice);
        noDeleteBtn.removeEventListener('click', getChoice);

        deleteDialog.close();
    }
}
// Delete Book (end) -

// Show Options function (start) -
function showOptions (event) {
    // Select NodeList for all options buttons container in the DOM
    const allOptionsCont = document.querySelectorAll('div[data-class="edit-delete-cont"]');

    // Conditional to allow toggling outside Options Button press
    if (typeof event === 'object') { // If triggered by clicking options button
        const optionsBtnIcon = this.querySelector('i');

        const buttonId = this.dataset.id;
        const buttonsCont = document.querySelector(`div[data-id='${buttonId}'][data-class='edit-delete-cont']`);
        
        const editButton = buttonsCont.querySelector('button[data-class="edit"]');
        const deleteButton = buttonsCont.querySelector('button[data-class="delete"]');

        // Ensures only one options menu is opened
        allOptionsCont.forEach(container => {
            if (container.hasAttribute('class') && container !== buttonsCont) {
                container.removeAttribute('class');

                //  Change options button icon
                changeIcon(container);

                // Remove Event Listeners of buttons inside container
                removeEvent(container);
            }
        });

        buttonsCont.classList.toggle('shown');

        const buttonShown = buttonsCont.getAttribute('class');
        if (buttonShown === 'shown') {
            editButton.addEventListener('click', showBookForm);
            deleteButton.addEventListener('click', showDeletePrompt);

            //  Change options button icon
            optionsBtnIcon.setAttribute('class', 'fa-solid fa-xmark');
        } else {
            editButton.removeEventListener('click', showBookForm);
            deleteButton.removeEventListener('click', showDeletePrompt);

            //  Change options button icon
            optionsBtnIcon.setAttribute('class', 'fa-solid fa-ellipsis-vertical');
        }

    } else { // If triggered by another function
        // Closes all possible opened option
        allOptionsCont.forEach(container => {
            if (container.hasAttribute('class')) {
                container.removeAttribute('class');

                //  Change options button icon
                changeIcon(container);

                // Remove Event Listeners of buttons inside container
                removeEvent(container);
            }
        });
    }

    // Note: Made as reusable changeIcon function to different instance
    // Changes options button icon upon toggling
    function changeIcon(buttonsContainer) {
        const containerId = buttonsContainer.dataset.id;
        const assignedOptionsBtn = document.querySelector(`button[data-id='${containerId}'][data-class='options'] i`);

        assignedOptionsBtn.setAttribute('class', 'fa-solid fa-ellipsis-vertical');
    }

    // Note: Made as reusable remove event listeners function to different instance
    // Removes event listeners upon close
    function removeEvent (buttonsContainer) {
        const otherEditButtons = buttonsContainer.querySelector('button[data-class="edit"]');
        const otherDeleteButtons = buttonsContainer.querySelector('button[data-class="delete"]');
        otherEditButtons.removeEventListener('click', showBookForm);
        otherDeleteButtons.removeEventListener('click', showDeletePrompt);
    }
}
// Show Options function (end) -

// Add Book content to page function (start) -
function addBookContent (book, action) {
    let newBookContainer;

    if (action === 'addBook') {
        const template = document.querySelector('section[data-template="template"]');

        // Clones template from HTML as reference to new content
        newBookContainer = template.cloneNode(true);
        newBookContainer.removeAttribute('data-template');
    } else if (action === 'editBook') {
       newBookContainer = document.querySelector(`section[data-id='${book.id}']`);
    }

    // Add data id to relevant elements
    const dataIdNodes = newBookContainer.querySelectorAll('[data-id]');
    dataIdNodes.forEach(node => node.setAttribute('data-id', book.id));
    newBookContainer.setAttribute('data-id', `${book.id}`);
    
    // Adds title
    newBookContainer.querySelector('h3').textContent = book.title;

    // Adds event listener to options button
    const newOptionsBtn = newBookContainer.querySelector('button[data-class="options"]');
    newOptionsBtn.addEventListener('click', showOptions);

    // Styles Read Status button by adding class
    const newReadBtn = newBookContainer.querySelector('button[data-class="read-status"]');
    newReadBtn.setAttribute('class', `${book.readStatus}`);

    // Adds event listener to read button
    newReadBtn.addEventListener('click', changeReadStatus);
    
    // Adds genre
    const genreList = newBookContainer.querySelector('div.genre ul');
    const genreListContent = newBookContainer.querySelectorAll('div.genre ul li');
    
    // Removes previous genre list before adding new
    // Note: check existence to avoid error
    if (genreListContent !== null) {
        genreListContent.forEach(genre => {
            genreList.removeChild(genre);
        });
    }
    
    book.genre.forEach(genre => {
        const newList = document.createElement('li');
        newList.setAttribute('data-class', 'genre-tag');
        newList.setAttribute('data-genre', genre);
        newList.textContent = genre;
        newList.addEventListener('click', filterByGenre);

        genreList.appendChild(newList);
    })

    // Adds cover image, with fallback
    const fallbackImage = 'url(./images/book-preview.svg)';
    const newCoverImage = newBookContainer.querySelector('div[data-class="cover-image"]');
    newCoverImage.setAttribute('style', `background-image:url('${book.cover}'), ${fallbackImage}`);

    // Adds read status text
    const newReadStatus = newBookContainer.querySelector('p[data-class="read-status"]');
    newReadStatus.setAttribute('class', `${book.readStatus}`);
    newBookContainer.setAttribute('data-read', `${book.readStatus}`);

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

    // Log user stats/ Change statistics
    changeBookStats(countBook());
    changeReadStats();

    // Appends final structure to DOM if new book
    if (action === 'addBook') {
        // Newly added book appends as first entry
        const firstBook = document.querySelector('section[data-class="book-container"]');
        libraryGrid.insertBefore(newBookContainer, firstBook);
    }
}
// Add Book content to page function (end) -
   
// Open and Close Add Book Form (start) -
// Open Add Book Form (start) --
function showBookForm () {
    
    if ( this === addBookButton || this.dataset.class === 'edit') {
        formDialog.showModal();

        // Clears the form 
        document.querySelector('form#add-book-form').reset();
        title.setAttribute('value', '');
        author.setAttribute('value', '');
        pages.setAttribute('value', '');
        publishYear.setAttribute('value', '');
        publishMonth.setAttribute('class', 'empty');
        publishMonth.setAttribute('value', '');
        selectMonthButtonText.textContent = 'Select Month';
        coverURL.setAttribute('value', '');
        coverURL.textContent = '';
        genreCheckboxes.forEach(checkbox => {
            if (checkbox.hasAttribute('disabled')) {
                checkbox.removeAttribute('disabled');
                checkbox.nextSibling.classList.remove('disabled');
            }
        });
        
        // Closes Options Button if opened
        showOptions();

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
        saveButton.setAttribute('data-id', '');
    }

    // Adds data to form if dialog was triggered by "edit"
    if (this.dataset.class === 'edit') {
        // id
        const editBtnId = this.dataset.id;

        // Get Book Object 
        const bookObj = bookArray.filter(obj => obj.id === editBtnId)[0];

        const formHeader = document.querySelector('div#add-book-cont h3');
        formHeader.textContent = 'Edit Book';
        saveButton.setAttribute('data-action', 'save-edit');
        saveButton.setAttribute('data-id', editBtnId);

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

        coverURL.textContent= `${bookObj.cover}`;

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
    const saveBtnId = this.dataset.id;
    const saveBookAction = this.dataset.action;

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
    let idChange = false;
    function createBookObj(buttonId) {
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

        if (errors.length === 0  && saveBookAction === 'save-add') {
            return new CreateBook (bookId, titleValue , authorValue, pagesValue, monthValue, yearValue, publishedValue, cover, readValue ,genreChecked);
        } 
        
        if (errors.length === 0  && saveBookAction === 'save-edit') {
            
            const bookForEditId = buttonId;
            const bookForEdit = bookArray.filter(obj => obj.id === bookForEditId)[0];

            const oldTitle =  bookForEdit.title;
            const oldYear = bookForEdit.year;

            bookForEdit.title = titleValue;
            bookForEdit.author = authorValue;
            bookForEdit.pages = pagesValue;
            bookForEdit.month = monthValue;
            bookForEdit.year = yearValue;
            bookForEdit.published = publishedValue;
            bookForEdit.cover = cover;
            bookForEdit.readStatus = readValue;
            bookForEdit.published = publishedValue;
            bookForEdit.genre = genreChecked;

            // Detects change in title and year for re-ID
            if (oldTitle !== bookForEdit.title || oldYear !== bookForEdit.year) {
                idChange = true;
            }

            return bookForEdit;
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
    const newBook = createBookObj(saveBtnId);

    if (newBook !== 'pendingError' && saveBookAction === 'save-add') {
        genreCheckboxes.forEach(genreInput => genreInput.removeEventListener('change', checkGenreLength));
        removeValidation(title, author);
        newBook.pushBookToArray();
        addBookContent(newBook, 'addBook');
        formDialog.close();

    } else if (newBook !== 'pendingError' && saveBookAction === 'save-edit') {
        addBookContent(newBook, 'editBook');
        
        // Check/ changes to book ID
        if (idChange) {
            const bookEdited = document.querySelector(`section[data-id='${newBook.id}']`);
            newBook.id = createId(); // Assigns new ID

            // Add data id to relevant elements
            const dataIdNodes = bookEdited.querySelectorAll('[data-id]');
            dataIdNodes.forEach(node => node.setAttribute('data-id', newBook.id));
            bookEdited.setAttribute('data-id', `${newBook.id}`);
        }

        formDialog.close();
    }

    console.log(bookArray);
}
// Close Add Book Form (end) -- 
// Open and Close Add Book Form (end) -

// Filter books with specific genre (start) -

// Returns array of bookId with/ without (depends on argument) given genre
function getIdFromGenre (genre, includes) {
    let bookIdArray;

    if (includes === true) {
        // Gets array of book objects with the given genre
        const booksWithGenre = bookArray.filter(book => book.genre.includes(genre));

        // Gets the id of filtered books
        bookIdArray = booksWithGenre.map(book => book.id);

    } else if (includes === false) {
        // Gets array of book objects WITHOUT the given genre
        const booksWithoutGenre = bookArray.filter(book => !book.genre.includes(genre));

        // Gets the id of filtered books
        bookIdArray = booksWithoutGenre.map(book => book.id);
    }

    return bookIdArray;
}

// Remove class="hidden"/ display:none to book containers
function displayBooks () {
    const allBooksContainer = document.querySelectorAll('section[data-class="book-container"]');
    allBooksContainer.forEach(book => {
        book.removeAttribute('class');
    });
}

function filterByGenre () {
    // Gets genre to filter
    const genreToFilter = this.dataset.genre;
    
    // Get id of books WITHOUT the clicked genre
    const booksWithoutGenre =  getIdFromGenre(genreToFilter, false);

    // Remove class="hidden"/ display:none to book containers
    displayBooks();

    // Removes book without the genre in the display
    booksWithoutGenre.forEach(bookId => {
        const bookContainer = document.querySelector(`section[data-id='${bookId}']`);
        bookContainer.classList.add('hidden');
    })

}



// Filter books with specific genre (end) -























// Book Presets (start) -
const chainsawMan = new CreateBook( 
    'CM_2018', // id
    'Chainsaw Man', // title
    'Tatsuki Fujimoto', // author
    'unknown', // pages
    'December', // month
    2018, // year
    'December, 2018', // published
    'https://upload.wikimedia.org/wikipedia/en/2/24/Chainsawman.jpg', // cover
    'ongoing', // readStatus
    ['Thriller', 'Romance', 'Mystery'] // genre
);

const katanagatari = new CreateBook( 
    'K_2007', // id
    'Katanagatari', // title
    'Nisio Isin', // author
    'unknown', // pages
    'January', // month
    2007, // year
    'January, 2007', // published
    'https://upload.wikimedia.org/wikipedia/en/a/a9/Katanagatari_volume_one.jpg', // cover
    'nys', // readStatus
    ['Fantasy', 'Romance', 'Magical Realism'] // genre
);

const dune = new CreateBook( 
    'D_1965', // id
    'Dune', // title
    'Frank Herbert', // author
    '896', // pages
    'August', // month
    1965, // year
    'August, 1965', // published
    'https://upload.wikimedia.org/wikipedia/en/d/de/Dune-Frank_Herbert_%281965%29_First_edition.jpg', // cover
    'done', // readStatus
    ['Science Fiction', 'Romance', 'Dystopian'] // genre
);

const fellowship = new CreateBook( 
    'FOTR_1954', // id
    'The Fellowship of the Ring', // title
    'J. R. R. Tolkien', // author
    '423', // pages
    'July', // month
    1954, // year
    'July, 1954', // published
    'https://upload.wikimedia.org/wikipedia/en/8/8e/The_Fellowship_of_the_Ring_cover.gif', // cover
    'done', // readStatus
    ['Fantasy', 'Magical Realism', 'Romance'] // genre
);

const presetsArray = [chainsawMan, katanagatari, dune, fellowship];
presetsArray.forEach(book => {
    book.pushBookToArray()
    addBookContent(book, 'addBook');
})
// Book Presets (end) -
