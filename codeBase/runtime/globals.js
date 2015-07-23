console.log("globals.js");

var t;

var SLVDEngine = { counter: 0 };

//implied SLVDEngine.SAVE object from load.js
SLVDEngine.SAVE = {};

//var SLVDEngine.seeB, SLVDEngine.see, SLVDEngine.buffer, SLVDEngine.bufferCtx, SLVDEngine.snapShot, SLVDEngine.snapShotCtx;
SLVDEngine.image = [];
SLVDEngine.audio = [];
SLVDEngine.level = [];

SLVDEngine.player = [];
SLVDEngine.NPC = [] //Universal, absolute list of SLVDEngine.NPC objects (on all boards)
SLVDEngine.boardAgent = []; //NPCs and players, for functional interaction
SLVDEngine.boardSprite = []; //NPCs, players, and boardObjs, for drawing purposes
SLVDEngine.Teams = {};

SLVDEngine.process = "loading"; //Input of master setInterval switch-case

SLVDEngine.currentAudio;
SLVDEngine.volume = 1;

SLVDEngine.frameClock = 0; //= 1 every 8 ticks
SLVDEngine.SAVE.timeSeconds = 0; //Second hand displayed on clock out of 2560
SLVDEngine.SAVE.timeMinutes = 0;
SLVDEngine.SAVE.timeHours = 0;
SLVDEngine.SAVE.timeDays = 0;

SLVDEngine.keyDown = {}; //1 if down, null if up

SLVDEngine.currentPlayer = 0;
SLVDEngine.cTeam; //For TRPG, either SLVDEngine.player or boardNPC

SLVDEngine.loading = 0;
SLVDEngine.loadCheck = [];

SLVDEngine.weather = { rain: false, clouds: false, dark: 0};

//Somehow related to relative positioning of board to player
SLVDEngine.wX = 0;
SLVDEngine.wY = 0;

SLVDEngine.SCREENX = 640;
SLVDEngine.SCREENY = 480;

SLVDEngine.FPS = 50;