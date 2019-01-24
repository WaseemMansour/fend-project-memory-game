/*
 * Create a list that holds all of your cards
 */

const iconsVariation = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
const iconsArr = [...iconsVariation,...iconsVariation];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Build Game's Cards
const randomCards = shuffle(iconsArr);
const fragment = document.createDocumentFragment();
const deck = document.querySelector('.deck');
const ratingStars = document.querySelector('.stars');
const timeClock = document.querySelector('.timer span');
const modal = document.querySelector('.modal-window');
const totalTime = document.querySelector('.game-time');
const rating = document.querySelector('.rating-score');

for (card of randomCards) {
    const element = document.createElement('li');
    element.className = 'card';
    element.innerHTML = '<i class="fa '+card+'"></i>';
    fragment.appendChild(element);
}
deck.appendChild(fragment);


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


const cards = document.querySelectorAll('.card');
const gameCounter = document.querySelector('.moves');
const openedCards = [];
const matchedCards = [];
let matched = 0;
let counter = 0;


// Timer Object
let seconds = 0;
const timer = {
    update() {
        seconds++;
        timeClock.innerHTML = seconds;
    },
    start() {
        timerStart = setInterval(this.update, 1000);
    },
    stop() {
        seconds = 0;
        clearInterval(timerStart);
    }
};

// Start Timer
document.addEventListener('DOMContentLoaded', timer.start());

// Listen mouse click events
document.addEventListener('click', function(e) {

    let target = e.target;
    if ( openedCards.length < 2 && target.matches('.card') ) {
        openCard(target);
        count();
        ratePlayer(counter);
        if (openedCards.length === 2 ) {
            if ( openedCards[0].firstChild.className === openedCards[1].firstChild.className ) {
                matchFound(openedCards);
                openedCards.length = 0;
            } else {
                setTimeout(function(){
                    for (card of openedCards ) {
                        card.classList.remove('animated', 'flipInY');
                        card.classList.add('animated', 'shake', 'orange-bg');
                    }
                }, 500);
                setTimeout(function () {
                    for (card of openedCards ) {
                        card.classList.remove('orange-bg');
                        toggleCardIcon(card);
                    }
                    openedCards.length = 0;
                }, 1500);
            }
        }
    }

    if ( target.matches('.fa-repeat') || target.matches('.btn-primary') ) {
        resetGame(cards);
        closeModal(e);
    }

    if ( target.matches('.modal-close') || target.matches('.btn-secondary') ) {
        closeModal(e);
    }

}, false);

// Toggle cards visibility
function toggleCardIcon(i) {
    i.classList.toggle('open');
    i.classList.toggle('show');
}

// Lock cards matched in open position
function matchFound(cardsOpened) {
    for (card of cardsOpened) {
        card.className = 'card match animated jello';
    }

    matched = matched + 2;
    matchedCards.push(matched);
    if ( matchedCards.length === 8) {
        openModal();
        setTimeout(function(){
            timer.stop();
            winningModal();
        },1000);
    }
}

// if opened cards is < 2 ? Show and add card to openedCards Array : hide and empty opened cards array
function openCard(target){
    if(openedCards.length < 2) {
        openedCards.push(target);
        toggleCardIcon(target);
        target.classList.toggle('animated');
        target.classList.toggle('flipInY');
    } else {
        openedCards.length = 0;
    }
}

// Increment counter and update UI
function count() {
    counter++;
    gameCounter.innerHTML = counter;
}

// Reset Game : counter, timer and hide cards
function resetGame(cards) {
    counter = 0;
    gameCounter.innerHTML = counter;
    openedCards.length = 0;
    matchedCards.length = 0;

    for (card of cards) {
        card.className = 'card';
    }

    timer.stop();
    timer.start();
    ratingStars.innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
}

// Rating System
function ratePlayer(count) {
    if (count > 20 && ratingStars.children.length === 3) {
        ratingStars.lastElementChild.remove();
    } else if (count > 40 && ratingStars.children.length === 2) {
        ratingStars.lastElementChild.remove();
    }
}

// Set Winning Statistics & Open Modal
function winningModal() {
    totalTime.innerHTML = timeClock.innerHTML;
    rating.innerHTML = ratingStars.outerHTML;
    setTimeout(function(){
        openModal();
    }, 500);
}

// Open Modal
function openModal() {
    modal.classList.add('show-modal');
}

// Close Modal
function closeModal() {
    modal.classList.remove('show-modal');
}

