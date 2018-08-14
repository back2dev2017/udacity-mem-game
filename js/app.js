/*
 * Create a list that holds all of your cards
 */

/*
 * Basically, the design concept is
 *  - use an array to set up the initial "cards"
 *  - use a property of that array to store random numbers to be used to sort (essentially yields random sorting)
 *  - use a listener for a click, reveal the card (show pick, change bg, etc) (only concerned about clicks on a "card" class element)
 *    + when revealed, if no other card revealed, leave as-is
 *       * if other card showing, check for match and if they do, change both cards to "match" class (locks them in place)
 *       * but if not matching, unflip the cards (hide the pic/symbol, etc)
 *    + every click on a card increments a counter and displays. Also, star rating goes down after 36 clicks and again after 70 clicks
 *    + When all cards get matched (all 16 have "match" class), display "win" message with stats
 *    + a "reset" of game (click reset button) reshuffles cards, clears timer, sets star rating to original, etc
 */

// TODO: remove various testing support code (it is mostly commented out now - leaving it in for project evaluation at the moment)
// TODO: trap keystrokes for reload, perhaps copying winning message (stats)
// TODO: timer - showing elapsed time (aka, use setInterval() to update..., stop updating when wins or resets game, etc)
// TODO: input for name, save results to local storage (nothing in course about that up to this point)
// TODO: top 3 leaderboard (by name: minimum moves basis) - requires above item (local storage)
// TODO: there is no protection from cheating in the game (aka can use console to view hidden content). a server-side card position
//       and match check, etc would protect against this
// TODO: hook this up to a server database to get card info (could then do custom pictures, custom deckface, user stats, etc)


function appSetup() {
    // initialize the so-called card deck. this could have been done in the main index.html file, but I prefer
    // having a setup function. That way, it is available to call at any given time in other code without
    // forcing a "refresh" of the page

    // set the 16 cards - because the other 8 are going to essentially be "copies"
    cardObjects[0] = {cardid: 1, specClass: "fa-diamond", flipped: false, locked: false, sortVal: 0}
    cardObjects[1] = {cardid: 2, specClass: "fa-paper-plane-o", flipped: false, locked: false, sortVal: 0}
    cardObjects[2] = {cardid: 3, specClass: "fa-anchor", flipped: false, locked: false, sortVal: 0}
    cardObjects[3] = {cardid: 4, specClass: "fa-bolt", flipped: false, locked: false, sortVal: 0}
    cardObjects[4] = {cardid: 5, specClass: "fa-cube", flipped: false, locked: false, sortVal: 0}
    cardObjects[5] = {cardid: 6, specClass: "fa-leaf", flipped: false, locked: false, sortVal: 0}
    cardObjects[6] = {cardid: 7, specClass: "fa-bicycle", flipped: false, locked: false, sortVal: 0}
    cardObjects[7] = {cardid: 8, specClass: "fa-bomb", flipped: false, locked: false, sortVal: 0}
    cardObjects[8] = {cardid: 9, specClass: "fa-diamond", flipped: false, locked: false, sortVal: 0}
    cardObjects[9] = {cardid: 10, specClass: "fa-paper-plane-o", flipped: false, locked: false, sortVal: 0}
    cardObjects[10] = {cardid: 11, specClass: "fa-anchor", flipped: false, locked: false, sortVal: 0}
    cardObjects[11] = {cardid: 12, specClass: "fa-bolt", flipped: false, locked: false, sortVal: 0}
    cardObjects[12] = {cardid: 13, specClass: "fa-cube", flipped: false, locked: false, sortVal: 0}
    cardObjects[13] = {cardid: 14, specClass: "fa-leaf", flipped: false, locked: false, sortVal: 0}
    cardObjects[14] = {cardid: 15, specClass: "fa-bicycle", flipped: false, locked: false, sortVal: 0}
    cardObjects[15] = {cardid: 16, specClass: "fa-bomb", flipped: false, locked: false, sortVal: 0}

    // TODO: set up initialization of array so that only half the cards have to be specificed. AKA, re-copy half to a 2nd half
    // it is a "match" game after all. Also, this could be hooked up to a database of objects (pictures), etc and therefore
    // only needing to specify one picture that would then be duplicated for a match would be more useable/flexible

    // grab the HTML of the "starlist" (aka the star rating). Doing it this way makes it easy to reset later, and don't have to
    // worry about changing code: e.g. if we decide later for total of 4, 5, or 10 stars, this will catch it
    starshtml = document.getElementById("starlist").innerHTML;
    shuffleCards();
    setupListeners();
    
    // console.log('finished appsetup');
}

function shuffleCards() {
    //   Note: the shuffleCards() function is basically a "reset" of the game. so re-initialize things accordingly
    
    // reset the stars and the number of moves
    document.getElementById("moves").innerText = "0";
    document.getElementById("starlist").innerHTML = starshtml;

    // make sure and hide the win message in case they just won a game
    document.getElementById("win-msg").classList.add("hidden");

    //   the way to shuffle the deck is to change the sortvals, sort the deck on that sortval, then, step through the array, 
    // adding the 'cards' into the "deck" element with appropriate classes assigned
    cardObjects.forEach( function(arritem) {
        arritem.sortVal = Math.floor((Math.random() * 1000));
    });
    cardObjects.sort( function(comp1, comp2) {
        // note the "sort" usually functions on "string" values. But a custom sorting function can be supplied. The main need
        // for the custom function is to return function of an array is supposed to return < 0, 0, or >0.
        return comp1.sortVal - comp2.sortVal;
    });
    //   now "deal" them out by creating the 'innter HTML' string to put inside the deck. Recall the "card" class should be 
    // applied to each "<li>" and "fa" class to each "<i>" (which is inside the <li>). Also, each "<i>" element gets a
    // class assignment based on the "specClass" property in cardObjects (although supplied documentation was not clear, it
    // seems that class assignment is what provides the "image" for the card (anchor, diamond, etc))
    //   also, will add a unique DOM id to each card - mainly for debugging (note: "card" is the containing <li>)
    let tmpstr = "";
    cardObjects.forEach( function(arritem) {
        tmpstr = tmpstr + "<li class='card' id=cardid" + arritem.cardid + ">" +
                            "<i class='fa " + arritem.specClass + "'></i> </li>";
    });
    // note: would be much better to have and "ID" on the deck element because there is only 1 deck in the page, but whatever...
    let tmpdeck = document.getElementsByClassName("deck");
    tmpdeck[0].innerHTML = tmpstr;
}

function setupListeners() {
    let deck = document.getElementsByClassName("deck");
    deck[0].addEventListener("click", cardClick);
}

function cardClick (evnt) {
    // if the user is being shown cards that don't match, do not do anything. they will unflip in a few secs
    if (showingCards == true) {
        // wait for the cards to be unflipped so they don't get penalized for extra clicks
    } else {
        let tmp = evnt.target;
        setStarsAndCounter();
        if (tmp.classList.contains("card")) {
            // show the card, but then the code below will take care of re-hiding it if needed
            let selcard = document.getElementById(tmp.id);
            selcard.classList.add("show");
            selcard.classList.add("open");
            let cardsShowing = document.getElementsByClassName("open");
            if (cardsShowing.length < 2) {
                // only 1 card "open", so nothing to do, the card has been made visible
            } else {
                // check for match, if not, flip cards back over. There should never be more than 2 cards turned over at a time
                let card1 = cardsShowing[0].firstElementChild.classList.toString();
                let card2 = cardsShowing[1].firstElementChild.classList.toString();
                if (cardsShowing.length == 2 && (card1 == card2)) {
                    // it matches, "lock it" so to speak and reset other things
                    gotMatches();
                } else {
                    showingCards = true;
                    // console.log('show unflip cards');
                    setTimeout(function() { unFlipCards(); }, 2000);
                }
            }
        } //end of check for card click
    } // end of checking showingCards
}

function setStarsAndCounter() {
    let countclick = document.getElementById("moves");
    let numClicks = Number(countclick.innerText);
    // WARNING: setting the number of stars using the removeChild() is a "brittle" design. I am going to remove a star based on an "exact"
    // click count. This means if a click event is missed for whatever reason, the star count could be off.
    switch (numClicks) {
        case 1:
            // on the first card click, "start" the timer (aka, record the start time)
            gameStart = performance.now()
            break;
        case 36:
            document.getElementById("starlist").removeChild(document.getElementById("starlist").firstElementChild);
            break;
        case 70: 
            document.getElementById("starlist").removeChild(document.getElementById("starlist").firstElementChild);
            break;
        default:
    }
    countclick.innerText = Number(countclick.innerText) + 1;
}

function gotMatches() {
    //   the user got a match, now there are 2 "card" items that have the 'open' class assigned to them. so, add the "match" class to those, taking off
    // the open class
    let cards2Work = document.getElementsByClassName("open");
    for (let i = cards2Work.length - 1; i >= 0; i--) {
        cards2Work[i].classList.add("match");
        cards2Work[i].classList.remove("open");
    }
    // check to see if all the cards have been matched ("match" class is on 16 elements) - if so, show the win message
    if (document.getElementsByClassName("match").length >= 16) {
        showWinMessage()
    } else {
        document.getElementById("match-msg").classList.remove("hidden");
        setTimeout(function() {document.getElementById("match-msg").classList.add("hidden");}, 2000);
    }
}

function unFlipCards() {
    // they did not get a match, so 'unflip' the cards: aka remove the show and open classes
    let unflip = document.getElementsByClassName("open");
    let numitems = unflip.length;
    // console.log('num elements: ' + numitems);
    for (let ix = numitems - 1; ix >= 0; ix-- ) {
        unflip.item(0).classList.remove("show");
        unflip.item(0).classList.remove("open");
    }
    showingCards = false;
}

function showWinMessage() {
    gameEnd = performance.now();
    let gameTime = Math.floor((gameEnd - gameStart)/1000);
    document.getElementById("fintime").innerText = gameTime;
    document.getElementById("finmoves").innerText = document.getElementById("moves").innerText;
    document.getElementById("finstars").innerText = document.getElementById("starlist").children.length;
    document.getElementById("win-msg").classList.remove("hidden");
}