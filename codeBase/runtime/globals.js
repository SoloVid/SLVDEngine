console.log("globals.js");

var t;

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

SLVDEngine.frameClock = 0; //= 1 every 8 ticks
SAVE.timeSeconds = 0; //Second hand displayed on clock out of 2560
SAVE.timeMinutes = 0;
SAVE.timeHours = 0;
SAVE.timeDays = 0;

SLVDEngine.keyDown = {}; //1 if down, null if up

var currentPlayer = 0;
var cTeam; //For TRPG, either player or boardNPC

var loading = 0;
var loadCheck = [];

SLVDEngine.weather = { rain: false, clouds: false, dark: 0};

//Somehow related to relative positioning of board to player
SLVDEngine.wX = 0;
SLVDEngine.wY = 0;

SLVDEngine.SCREENX = 640;
SLVDEngine.SCREENY = 480;

SLVDEngine.FPS = 50;