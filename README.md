# Library

## About
A library web app portfolio project titled **myReadList** that can add book information, then displays to a digital catalog.

## Objective
Create a library that stores books and display information for the user. This project practices use of Objects to store, edit and retrieve data, as well as utilizing prototypes and prototypal inheritance. In addition, this project exemplify organizing the code written, and encourages use of objects as a design pattern.

Improve on designing functional layout and interactive display elements.

## Features
The library project loads with default pre made books displayed in the catalog. The books are in the main display while *myStats*, the user's reading stats are displayed in the side.

The user can then press the **Add Book** button to open a modal with a form which will ask the user what information to include for the new book. The form requires a Title, the Author and at least one genre to successfully add a new book. Meanwhile, optional information publish month and year, number of book pages and a link to a cover photo can also be added. Furthermore, the user is asked if the book has been read, with choices "not yet", "on-going" and "yes". 
Pressing save will finalize the new book then adds it to the catalog.

The newly added book will be displayed along with the other books in the catalog. A book, displayed with information is also assigned with functional buttons. On the upper right corner, the user can change reading status of a book with a click. Said button will cycle the user's reading status from "Not Yet Started", "On-going", to "Done", which also updates the user's reading activity in *myStats*. Another button assigned to a book on the left upper corner, is a menu button that opens "Edit" and "Delete" buttons. The user can then perform respective functions.

The *myStats* side bar displays the number of books in the library, the user's reading activity and book preferences according to genre.

The *Reading Activity* section features a visual representation of the user's activity which expose a metric for the user on how well they are reading.  

The *Preferences* section also features a visual representation according to which genre the user is mostly reading. The font size scales according to user preference metric. Also, the genres in this section can be clicked to filter the catalog. The filter can then be removed by clicking the close button in the genre tag displayed on the catalog.

This library project is responsive, and can be viewed on smaller screens. The layout changes by hiding the *myStats* side bar, which can then be accessed by a new stats button located on the upper right corner of the main display. A **+** add book button is used to add new book in smaller screen display.

Unfortunately, no storage is used to save information between page reloads. Refreshing the page will load the default contents. 


## Live Preview
This project can be viewed at [Library - myReadList](https://makieldeviso.github.io/library/)