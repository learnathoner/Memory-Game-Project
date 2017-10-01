/*
Order: General functions, Images, Populate cells, Tile, Game,
Event Listeners, Starting actions
*/

/*
*
********* GENERAL FUNCTIONS - Random Number Gen and Timer
*
*/

// Random Int Generator
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is inclusive and the minimum is inclusive
}

// Timer functions
const Timer = {
  startTime: 0,
  endTime: 0,
  intervalID: '',

  // Initializes Timer.startTime to current time in ms
  startTimer() {
    $('#game_time').html('0 Seconds');

    let curDate = new Date();
    let curTime = curDate.getTime();

    this.startTime = curTime;
    // When starts, sets interval to showtime every second
    this.intervalID = setInterval(this.showTime, 1000);
  },

  // Sets Timer.endTime to time stopped in ms
  endTimer() {
    clearInterval(this.intervalID);
  },

  showTime() {
    $('#game_time').html(Timer.calculateTime);
  },

  // Returns difference between time started and stopped
  calculateTime() {
    let endDate = new Date();
    let endTime = endDate.getTime();

    // this.endTime = endTime;
    let timeInSeconds = Math.floor((endTime - Timer.startTime) / 1000);

    let seconds = 0,
        minutes = 0,
        totalTime = '';

    if (timeInSeconds > 60) {
      minutes = Math.floor(timeInSeconds / 60);
      seconds = timeInSeconds % 60;
      totalTime = `${minutes} Minutes and ${seconds} Seconds`;
    } else {
      totalTime = `${timeInSeconds} Seconds`;
    }

    return totalTime;
  }
}

/*
*
*********** SOUNDS
*
*/

const SOUNDS = {
  flip: new Audio('sounds/flip.wav'),
  fail: new Audio('sounds/fail.wav'),
  success: new Audio('sounds/success.wav'),
  win: new Audio('sounds/win.wav')
};

/*
*
*********** IMAGE STORAGE
*
*/

// 8 icons From Ion font set, must be used as a class and prefaced by icon ion-
const ICONS = [
  'help-buoy',
  'heart',
  'model-s',
  'beer',
  'pizza',
  'bug',
  'headphone',
  'cash'
];

// Star shape from ion
const STAR = "icon ion-ios-star";

// Converts 8 icons from ICONS into 16 icon array and returns
function createIconArray() {
  let iconArray = [];

  for (let icon of ICONS) {
    iconArray.push(`icon ion-${icon}`);
    iconArray.push(`icon ion-${icon}`);
  }
  return iconArray;
}

/*
*
******** POPULATE CELLS WITH IMAGES
*
*/

// Populates each tile with random icon from array
function populateTiles() {
  // Gathers list of tiles
  let tileList = $('.tile');
  let iconArray = createIconArray();

  // Sets toPopulate = number of tiles
  let toPopulate = tileList.length;

  // Loops over each tile, assigns icon, puts icon in back of array
  tileList.each(function () {
    let randomNum = randomInt(0, toPopulate);
    let drawnIcon = iconArray.splice(randomNum, 1);

    $( this ).html(`<div class="${drawnIcon} logo hidden"></div>`);

    // Places icon in back of array, draws from 0 - toPopulate-1
    iconArray.push(drawnIcon);
    toPopulate--;
  });
}


/*
*
******** GAME TILE FUNCTIONS
*
*/

// Functions related to clicking on the game tiles
const Tile = {
  selected: '',

  // Flips game tile over
  toggleHidden(tile) {
    SOUNDS.flip.play();
    $(tile).toggleClass('hidden');
  },

  resetSelected() {
    this.selected = '';
  },

  // Checks if there is another tile currently selected
  hasSelected(clickedTile) {
    // If no tile selected, sets selected to last clicked and flips
    if (this.selected === '') {
      this.selected = clickedTile;
      Tile.toggleHidden(clickedTile);
      return false;
    }
    // If another tile is selected, returns true
    return true;
  },

  // Checks if clickedTile is a match with selected tile
  checkMatch(clickedTile) {
    // Displays second tile
    Tile.toggleHidden(clickedTile);

    let selectedDiv = Tile.selected.find('div');
    let clickedDiv = clickedTile.find('div');
    // Gets class containing ICON name from tiles
    let selectedIcon = selectedDiv.attr('class');
    let clickedIcon = clickedDiv.attr('class');

    if (clickedIcon === selectedIcon) {

      Tile.selected.addClass('matched');
      clickedTile.addClass('matched');

      selectedDiv.effect('bounce');
      clickedDiv.effect('bounce');

      SOUNDS.success.play();

      Tile.selected = '';
    } else {
      // If tiles NOT a match

      // Stores selected in var, clears Tile.selected
      let selected = Tile.selected;
      Tile.selected = ''

      // Shakes the icon divs and plays fail noise
      selectedDiv.effect('shake');
      clickedDiv.effect('shake');
      SOUNDS.fail.play();

      // hides tiles after timeout, allowing time for shake effects
      window.setTimeout(function() {
        Tile.toggleHidden(selected);
        Tile.toggleHidden(clickedTile);
        ;
      }, 600);
    }
    // Updates move count after fail or match
    Game.updateMoves();
  }
};

/*
*
*********** GAME FUNCTIONS - updates moves, stars, resets, etc
*
*/

const Game = {
  moveCount: 0,
  moveLoc: $('#num_moves'),

  resetTiles() {
    let tiles = $('td.tile');
    tiles.each(function() {
      $(this).attr('class','tile hidden');
    });
  },

  updateStars() {
    let twoStars = 15,
      oneStar = 18;

    if (this.moveCount === twoStars ||
        this.moveCount === oneStar) {
      let lastStar = $('ul#star_cont li.ion-ios-star').last();
      //Changes last star to star outline after moves
      lastStar.attr('class', 'icon ion-ios-star-outline');
    }
  },

  resetStars() {
    $('#star_cont li').each(function() {
      $( this ).attr('class', `${STAR}`)
    })
  },

  checkWin() {
    let numTiles = $('td.tile').length;
    let numMatch = $('td.matched').length;

    if (numMatch === numTiles) {
      SOUNDS.win.play();
      Game.toggleWinScreen();
    }
  },

  // Updates moves and stars, checks if won
  updateMoves() {
    this.moveCount++;
    Game.updateStars();
    this.moveLoc.text(`${this.moveCount} Moves`);
    Game.checkWin();
  },

  resetMoves() {
    this.moveCount = 0;
    this.moveLoc.text(`${this.moveCount} Moves`);
  },

  reset() {
    Game.resetTiles();
    Game.resetMoves();
    Game.resetStars();
    Tile.resetSelected();
    populateTiles();
    Timer.startTimer();
  },

  toggleWinScreen() {
    Timer.endTimer();

    let winTime = Timer.calculateTime();
    let starsLeft = $('ul#star_cont li.ion-ios-star').length;

    $('#game_wrapper').toggleClass('hide');
    $('#win_screen').toggleClass('hide');

    $('#win_moves').html(Game.moveCount);
    $('#win_stars').html(starsLeft);
    $('#win_time').html(winTime);
  }
};

/*
*
************* EVENT LISTENERS
*
*/

// On tile click
$('td.tile').click(function() {
  let clickedTile = $(this);

  // Checks tile not already matched
  if (!clickedTile.hasClass('matched') && !clickedTile.is(Tile.selected)) {
    // If another tile selected, checks both for a match
    if (Tile.hasSelected(clickedTile)) {
      Tile.checkMatch(clickedTile)
    }
  }
});

$('#reset').click(Game.reset);

$('#play_again').click(function() {
  Game.reset();
  Game.toggleWinScreen();
});

/*
*
* INITIAL FUNCTIONS TO START
*
*/

$(document).ready(function() {
  populateTiles();
  Game.resetStars();
  Timer.startTimer();
});
