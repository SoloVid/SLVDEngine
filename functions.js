
//Create an SLVDEngine.audio element
SLVDEngine.audioCreate = function(source, iden) {
	var aud = document.createElement("SLVDEngine.audio");
	aud.setAttribute("src", source);
	aud.setAttribute("id", iden);
	return aud;
	//document.write('<SLVDEngine.audio preload src="' + source + '" id="' + iden + '"></SLVDEngine.audio>');
	//return document.getElementById(iden);
};

//Pause current SLVDEngine.audio
SLVDEngine.audioPause = function() {
	SLVDEngine.currentAudio.pause();
};

//Play new SLVDEngine.audio, string audi
SLVDEngine.audioPlay = function(audi, boolContinue) {
	var audiovar = SLVDEngine.audio[audi]; //added var
	//Set SLVDEngine.volume to current SLVDEngine.volume
	audiovar.SLVDEngine.volume = SLVDEngine.volume;
	if(boolContinue != 1)
	{
		audiovar.currentTime = 0;
	}
	audiovar.play();
	SLVDEngine.currentAudio = audiovar;
};

//Resume current SLVDEngine.audio
SLVDEngine.audioResume = function() {
	SLVDEngine.currentAudio.play();
};

//Black out canvas
SLVDEngine.canvasBlackout = function(canv) {
	canv.fillStyle="#000000";
	canv.fillRect(0, 0, 640, 480);
};

//Deal damage from, to
SLVDEngine.damage = function(attacker, victim) {
	if(victim.onHit === undefined)
	{
		if(attacker.hp)
		{
/*			var atk = (attacker.hp/attacker.maxHp)*(attacker.strg - attacker.weight) + attacker.atk;
			var def = (attacker.hp/attacker.maxHp)*(attacker.strg - attacker.weight) + attacker.def;*/
			var atk = (attacker.hp/attacker.strg)*(attacker.strg/* - attacker.weight*/) + 20;//attacker.atk;
			var def = (victim.hp/victim.strg)*(victim.strg/* - attacker.weight*/) + 20;//attacker.def;
			victim.hp -= atk - ((atk/(Math.PI/2))*Math.atan(Math.pow(def,0.7)/(atk/10)));//(attacker.hp/100)*(attacker.strg/victim.strg)*40;
		}
	}
	else// if(victim.hp != null)
	{
		resumeFunc = victim.onHit;
		resumeCue = victim.onHit(0, attacker);
	}
	//Make victim aggressive if excitable
	if(victim.dmnr == 1) victim.dmnr = 2;
};

//Determine column in spritesheet to use based on direction
SLVDEngine.determineColumn = function(direction) {
	var dir = Math.round(direction);//%4;
	if(dir == 0) { return 2; }
	else if(dir == 1) { return 1; } 
	else if(dir == 2) { return 3; }
	else if(dir == 3) { return 0; }
	else if(direction < 4 && direction > 3) { return 2; }
	else { return dir; }
};

//Get direction from one point to another (both in Maven orientation)
SLVDEngine.dirFromTo = function(px, py, ox, oy) {
	//N.B. ENWS = 0123

	if(px == ox)
	{
		if(py < oy) return 3;
		else return 1;
	}

	var baseDir = -Math.atan((py - oy)/(px - ox))/(Math.PI/2);
	
	if(px > ox) //not in atan range
	{
		baseDir += 2;
	}
	
	return (baseDir + 4)%4;
};

SLVDEngine.distanceEasy = function(x1, y1, x2, y2) {
	return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

SLVDEngine.distanceTrue = function(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

//Change SLVDEngine.level (Sprites and map) by name of SLVDEngine.level (in SLVDEngine.level's xml)
SLVDEngine.enterLevelByName = function(nam) {
	console.log(SLVDEngine.currentPlayer);
	console.log(SLVDEngine.player[SLVDEngine.currentPlayer].name);
	
	//Finish all paths
	for(var i = 0; i < SLVDEngine.boardSprite.length; i++)
	{
		if(SLVDEngine.boardSprite.path.x.length > 0)
		{
			SLVDEngine.boardSprite.x = SLVDEngine.boardSprite.path.x[SLVDEngine.boardSprite.path.x.length - 1];
			SLVDEngine.boardSprite.y = SLVDEngine.boardSprite.path.y[SLVDEngine.boardSprite.path.y.length - 1];
		}
	}

	SLVDEngine.boardAgent.length = 0;
	
	for(var index = 0; index < SLVDEngine.level.length; index++)
	{
		if(SLVDEngine.level[index].name == nam)
		{
			SLVDEngine.currentLevel = SLVDEngine.level[index];
			index = SLVDEngine.level.length + 1;
		}
	}
	SLVDEngine.process = SLVDEngine.currentLevel.type;
	if(SLVDEngine.process == "zelda") 
	{
		SLVDEngine.cTeam = SLVDEngine.player;
		SLVDEngine.boardAgent.push(SLVDEngine.player[SLVDEngine.currentPlayer]);
		insertBoardC(SLVDEngine.player[SLVDEngine.currentPlayer]);
	}
	else if(SLVDEngine.process == "TRPG")
	{
		SLVDEngine.cTeam = SLVDEngine.player;
		SLVDEngine.currentPlayer = -1;
		TRPGNextTurn();
	}

	//Figure out which NPCs are onboard
	for(var index = 0; index < SLVDEngine.NPC.length; index++)
	{
		if(SLVDEngine.NPC[index].lvl == SLVDEngine.currentLevel.name)
		{
			SLVDEngine.boardAgent.push(SLVDEngine.NPC[index]);
			insertBoardC(SLVDEngine.NPC[index]);
		}
	}
	
	//Pull board objects from file
	for(var index = 0; index < SLVDEngine.currentLevel.filedata.getElementsByTagName("boardObj").length; index++)
	{
		
		var template = SLVDEngine.currentLevel.filedata.getElementsByTagName("boardObj")[index].getAttribute("template")
		var objCode = SLVDEngine.currentLevel.filedata.getElementsByTagName("boardObj")[index].textContent;
		
		insertBoardC(SLVDEngine.evalObj(template, objCode));
		//boardObj[current].lvl = SLVDEngine.currentLevel.name;
	}
};

SLVDEngine.evalObj = function(template, code) {
	var obj;
	if(template)
	{
		obj = new SpriteTemplate[template]();
	}
	else
	{
		obj = new Sprite(null, null);
	}
	
	eval(code);

	if(obj.img)
	{
		if(!(obj.img in SLVDEngine.image))
		{
			SLVDEngine.image[obj.img] = new Image();
			SLVDEngine.image[obj.img].src = "files/images/" + obj.img.replace(/\"/g, "");
		}
		//obj.img = SLVDEngine.image[obj.img];
	}
	return obj;
};

//Make a valid switch-case resumeFunc out of function. "waitForEngine();" will signal a return from a case.
SLVDEngine.evalFunc = function(code) {
	var returnCode = "switch(cue) { case 0: {";
	
	var caseNum = 0;
	
	returnCode += code.replace(/waitForEngine\(\);/gi, function(n){ 
		caseNum++;
		return "return " + caseNum + ";}; case " + caseNum + ": {";
	});
	
	returnCode += "} default: { }; }";
	
	return returnCode;
};

SLVDEngine.getNPCByName = function(name) {
	return SLVDEngine.NPC[name];
};

SLVDEngine.getPixel = function(x, y, data) {
	var i = pixCoordToIndex(x, y, data);
	
	var pixArray = [];
	
	for(var j = 0; j < 4; j++)
	{
		pixArray[j] = data.data[i + j];
	}
	
	return pixArray;//data.data.slice(i, i + 4);
};

SLVDEngine.getScriptAlt = function(url, callback) {
	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement("script");
	script.src = url;

	// Handle Script SLVDEngine.loading
	{
	 var done = false;

	 // Attach handlers for all browsers
	 script.onload = script.onreadystatechange = function(){
		if ( !done && (!this.readyState ||
			  this.readyState == "loaded" || this.readyState == "complete") ) {
		   done = true;
		   if (callback)
			  callback();

		   // Handle memory leak in IE
		   script.onload = script.onreadystatechange = null;
		}
	 };
	}

	head.appendChild(script);

	// We handle everything using the script element injection
	return undefined;
};

//Get XML DOM from file; returns SLVD promise
SLVD.getXML = function(fil) {
	var promise = new SLVD.promise();

	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function() { if(xmlhttp.readyState == 4) promise.resolve(xmlhttp.responseXML); };
	xmlhttp.open("GET",fil,true);
	xmlhttp.send();
	return promise;
};  

//Get text from file; returns SLVD promise
SLVD.getTXT = function(fil) {
	var promise = new SLVD.promise();

	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function() { if(xmlhttp.readyState == 4) promise.resolve(xmlhttp.responseText); };
	xmlhttp.open("GET",fil,true);
	xmlhttp.send();
	return promise;
};

//Gets the index on canvas data of given coordinates
SLVDEngine.pixCoordToIndex = function(x,y,dat) {
 return (y*dat.width + x)*4;
};

//Like enterLevelByName() with coordinates
SLVDEngine.send = function(board, x, y, z) {
	SLVDEngine.player[SLVDEngine.currentPlayer].x = x;
	SLVDEngine.player[SLVDEngine.currentPlayer].y = y;
	SLVDEngine.player[SLVDEngine.currentPlayer].layer = z;
	enterLevelByName(board);
};

//Functions to convert between actual pixel locations and tile-based locations. All begin with 0, 0 as top left. Rounding is employed to ensure all return values are integers
SLVDEngine.xPixToTile = function(x) {
	return Math.round((x-7)/32);
};
SLVDEngine.xTileToPix = function(x) {
	return (x*32)+7;
};
SLVDEngine.yPixToTile = function(y) {
	return Math.round((y-21)/32);
};
SLVDEngine.yTileToPix = function(y) {
	return (y*32)+21;
};