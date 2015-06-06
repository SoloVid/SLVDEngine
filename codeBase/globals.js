console.log("globals.js");

//implied SAVE object from load.js
var SAVE = {};

var player = [];
var NPC = [] //Universal, absolute list of NPC objects
var boardNPC = []; //List of NPC objects on current board
var boardObj = [];
var boardC = []; //NPCs and players, for drawing purposes

var process = "loading"; //Input of master setInterval switch-case
var opMenu;// = new menu();

var currentAudio;
var volume = 1;

var resumeFunc;// = startUp; //Function to be resumed upon end of lesser cases (e.g. message, menu, image), unless null
var resumeCue = 0; //Value resumeFunc can use to pick up where it was left off to do a menu, message, image, etc.

var countdown = 0; //A value which some code may decrement and check if 0
var counter = 0; //Ticks since setInterval start. Used primarily to check if setInterval is running and to regulate frames, mod 25600
var frameClock = 0; //= 1 every 8 ticks
SAVE.timeSeconds = 0; //Second hand displayed on clock out of 2560
SAVE.timeMinutes = 0;
SAVE.timeHours = 0;
SAVE.timeDays = 0;

var keys = 0; //number of keys down
var key; //value used in onkey____ functions
var dKeys = 0; //Number of directions pressed
var keyDown = []; //1 if down, null if up
var keyFirstDown = []; //set to 1 when key is initially pressed, manually set to null

var currentPlayer = 0;
var cTeam; //For TRPG, either player or boardNPC

var otherkey;

var loading = 0;
var loadCheck = [];

var rainy = 0;
var cloudy = 0;
var dark = 0;

//Somehow related to relative positioning of board to player
var wX = 0;
var wY = 0;

var SCREENX = 640;
var SCREENY = 480;

var FPS = 50;

var currentLevel;