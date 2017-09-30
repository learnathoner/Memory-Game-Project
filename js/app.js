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

  // Initializes Timer.startTime to current time in ms
  startTimer() {
    let curDate = new Date();
    let curTime = curDate.getTime();

    this.startTime = curTime;
  },

  // Sets Timer.endTime to time stopped in ms
  endTimer() {
    let endDate = new Date();
    let endTime = endDate.getTime();

    this.endTime = endTime;
  },

  // Returns difference between time started and stopped
  calculateTime() {
    let timeInSeconds = Math.floor((this.endTime - this.startTime) / 1000);

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
  success: new Audio('sounds/success.wav')
};

/*
*
*********** IMAGE STORAGE
*
*/

// 8 icons From Maki font set, must be used as a class and prefaced by maki-
const ICONS = [
  'aboveground-rail',
  'art-gallery',
  'basketball',
  'cafe',
  'cinema',
  'fire-station',
  'library',
  'skiing'
];

// Star shape from Maki set
const STAR = "maki-religious-jewish";

// Converts 8 icons from ICONS into 16 icon array and returns
function createIconArray() {
  let iconArray = [];

  for (let icon of ICONS) {
    iconArray.push(`maki-${icon}`);
    iconArray.push(`maki-${icon}`);
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

  // Checks if same tile clicked on twice
  doubleClick(clickedTile) {
    // If same tile, hides and resets selected. No move penalty
    if (clickedTile.is(Tile.selected)) {
      Tile.toggleHidden(clickedTile);
      Tile.resetSelected();
      return true;
    }
    // If different tile, returns false
    return false;
  },

  // Checks if clickedTile is a match with selected tile
  checkMatch(clickedTile) {
    // Check that it's not a doubleclick before proceeding
    if (!Tile.doubleClick(clickedTile)) {
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
        //TODO: Create match and fail effects
        selectedDiv.effect('shake');
        clickedDiv.effect('shake');
        SOUNDS.fail.play();

        window.setTimeout(function() {
          Tile.toggleHidden(Tile.selected);
          Tile.toggleHidden(clickedTile);
          Tile.selected = '';
        }, 600);
      }
      Game.updateMoves();
    };
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
      oneStar = 18,
      noStars = 21;

    if (this.moveCount === twoStars ||
        this.moveCount === oneStar ||
        this.moveCount === noStars) {
      let lastStar = $('ul#star_cont li.full').last();
      lastStar.toggleClass('full');
    }
  },

  resetStars() {
    $('#star_cont li').each(function() {
      $( this ).attr('class', `full ${STAR}`)
    })
  },

  checkWin() {
    let numTiles = $('td.tile').length;
    let numMatch = $('td.matched').length;

    if (numMatch === numTiles) {
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
    let starsLeft = $('ul#star_cont li.full').length;

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
  if (!clickedTile.hasClass('matched')) {
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
  Timer.startTimer();
});
