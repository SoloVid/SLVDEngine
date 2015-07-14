console.log("globals.js");

var t;

var SLVD = {};
var SLVDEngine = { counter: 0 };

//implied SAVE object from load.js
var SAVE = {};

var seeB, see, buffer, bufferCtx, snapShot, snapShotCtx;
var image = [];
var audio = [];
var level = [];

var player = [];
var NPC = [] //Universal, absolute list of NPC objects (on all boards)
SLVDEngine.boardAgent = []; //NPCs and players, for functional interaction
SLVDEngine.boardSprite = []; //NPCs, players, and boardObjs, for drawing purposes
var Teams = {};

SLVDEngine.process = "loading"; //Input of master setInterval switch-case
var opMenu;// = new menu();

var currentAudio;
var volume = 1;

var resumeFunc;// = startUp; //Function to be resumed upon end of lesser cases (e.g. message, menu, image), unless null
var resumeCue = 0; //Value resumeFunc can use to pick up where it was left off to do a menu, message, image, etc.

var frameClock = 0; //= 1 every 8 ticks
SAVE.timeSeconds = 0; //Second hand displayed on clock out of 2560
SAVE.timeMinutes = 0;
SAVE.timeHours = 0;
SAVE.timeDays = 0;

var keys = 0; //number of keys down
var key; //value used in onkey____ functions
var dKeys = 0; //Number of directions pressed
SLVDEngine.keyDown = {}; //1 if down, null if up
//var keyFirstDown = {}; //set to 1 when key is initially pressed, manually set to null

var currentPlayer = 0;
var cTeam; //For TRPG, either player or boardNPC

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