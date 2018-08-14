# Memory Game Project

## Table of Contents

* [Purpose](#purpose)
* [Instructions](#instructions)
* [Contributing](#contributing)
* [Dependencies](#Dependencies)
* [References & Credits](#References & Credits)

## Purpose

This is a simple memory exercise game. Click on boxes (cards) to expose an image beneath. Click a second card to try to match images. 
Once all 16 boxes (8 matches) have been accomplished, you win.

## Instructions

To install the game, the following files (with subfolder names if applicable) should be copied:

	+ index.html
		js/app.js
		css/app.css

The function of the game makes extensive use of class assignments to DOM elements. For example, to determine how many cards are matched
a call to document.getElementsByClassName("match").length is used. A Javascript event listener is the main "engine" of the page: it has
code and calls other functions to watch for clicks on "cards", check for matches, collect stats, etc. CSS features were used to add some
animation effects on the page. As this was a class project, the index.html and app.css files were left alone as much as possible except for
cases where such changes would facilitate cleaner or more efficient code (e.g. adding an "id" attribute on an singular element in the page).

## Contributing

As this particular page is for a Udacity Nano degree program, no contributions will be accepted. No contributing instructions are provided


## Dependencies

No dependencies for frameworks or libraries are required. Note, however, specific css files are referenced in the project: <br />
    https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css <br />
    https://fonts.googleapis.com/css?family=Coda <br />


## References & Credits

This project was cloned from https://github.com/udacity/fend-project-memory-game as per course instruction

