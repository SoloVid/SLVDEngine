//Create an audio element
function audioCreate(source, iden) {
	var aud = document.createElement("audio");
	aud.setAttribute("src", source);
	aud.setAttribute("id", iden);
	return aud;
	//document.write('<audio preload src="' + source + '" id="' + iden + '"></audio>');
	//return document.getElementById(iden);
}

//Pause current audio
function audioPause() {
	currentAudio.pause();
}

//Play new audio, string audi
function audioPlay(audi, boolContinue) {
	var audiovar = audio[audi]; //added var
	//Set volume to current volume
	audiovar.volume = volume;
	if(boolContinue != 1)
	{
		audiovar.currentTime = 0;
	}
	audiovar.play();
	currentAudio = audiovar;
}

//Resume current audio
function audioResume() {
	currentAudio.play();
}

//Black out canvas
function canvasBlackout(canv) {
	canv.fillStyle="#000000";
	canv.fillRect(0, 0, 640, 480);
}

//Get a cookie by its name
function cookieGet(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

//Save a cookie: name, value, days until expiration
function cookieSet(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

//Deal damage from, to
function damage(attacker, victim) {
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
}

//Setup delay process
function delay(seconds) {
	process = "delay";
	countdown = Math.round(seconds*50);
}

//Determine column in spritesheet to use based on direction
function determineColumn(direction) {
	var dir = Math.round(direction)%4;
	if(dir == 0) { return 2; }
	else if(dir == 1) { return 1; } 
	else if(dir == 2) { return 3; }
	else if(dir == 3) { return 0; }
}

//Get direction from one point to another (both in Maven orientation)
function dirFromTo(px, py, ox, oy) {
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
}

//Change level (Sprites and map) by name of level (in level's xml)
function enterLevelByName(nam) {
	console.log(currentPlayer);
	console.log(player[currentPlayer].name);
	
	//Finish all paths
	for(var i = 0; i < boardC.length; i++)
	{
		if(boardC.path.x.length > 0)
		{
			boardC.x = boardC.path.x[boardC.path.x.length - 1];
			boardC.y = boardC.path.y[boardC.path.y.length - 1];
		}
	}

	delete player[currentPlayer].pet;

	for(var index = 0; index < level.length; index++)
	{
		if(level[index].name == nam)
		{
			currentLevel = level[index];
			index = level.length + 1;
		}
	}
	process = currentLevel.type;
	if(process == "zelda") cTeam = player;
	else if(process == "TRPG")
	{
		cTeam = player;
		currentPlayer = -1;
		TRPGNextTurn();
	}

	boardNPC.length = 0;
	for(var index = 0; index < NPC.length; index++)
	{
		if(NPC[index].lvl == currentLevel.name)
		{
			if(NPC[index].oppTeam == player) boardNPC[boardNPC.length] = NPC[index];
			else if(NPC[index].oppTeam == boardNPC) player[player.length] = NPC[index];
		}
	}
	
	//Pull board objects from file
	boardObj.length = 0;
	for(var index = 0; index < currentLevel.filedata.getElementsByTagName("boardObj").length; index++)
	{
		var ObjCode = "";
		
		var template = currentLevel.filedata.getElementsByTagName("boardObj")[index].getAttribute("template")
		if(template != "" && template != null) ObjCode += getTXT("files/templates/" + template);
		ObjCode += currentLevel.filedata.getElementsByTagName("boardObj")[index].textContent;
		
		boardObj[current] = evalObj(ObjCode);
		boardObj[current].lvl = currentLevel.name;


		/*boardObj[current] = new Object;
		var lin = currentLevel.filedata.getElementsByTagName("boardObj")[index].childNodes[0].nodeValue.split(";");
		for(var second = 0; second < lin.length; second++)
		{
			var side = lin[second].split("=");
			boardObj[current][side[0].trim()] = eval(side[1].trim());
		}*/
	}
	
	boardC.length = 0;
	//restartBoardC();
	//alert("entering level");
	//alert(currentLevel.name);
	//alert(player[currentPlayer].layer);
}

//Return object from JSON-ish string
function evalObj(code) {
	var temp = new Sprite(null, null);
	console.log("new Sprite");
	//Loop until all code is handled, remove code as things go
	while(code != "")
	{
		var tLine = /[^;]+;/.exec(code)[0];
//		console.log("evalObjs() - " + tLine);
		//return temp;
		if(/=/.test(tLine))
		{	
			var leftRegex = /[\s]*[\w\.]+[\s]*/;
			var left = leftRegex.exec(code)[0];
			left = left.trim();
			code = code.replace(leftRegex, "");
			code = code.replace(/[\s]*=[\s]*/, "");
			
			//Handle functions differently than simple assignments
			if(code.substr(0, 8) == "function")
			{
				var index = 0;
				openB = 0;
				while(openB != 0 || code.charAt(index - 1) != "}")
				{
					if(code.charAt(index) == "{")
					{
						openB++;
					}
					else if(code.charAt(index) == "}")
					{
						openB--;
					}
					index++;
				}
				
				var funcCode = code.substring(0, index);
				
				var innerFuncCode = funcCode.substr(0, funcCode.length - 1);
				innerFuncCode = innerFuncCode.replace(/function[^{]*{/, "");
				
				eval("temp[\"" + left + "\"] = function(cue) { " + evalFunc(innerFuncCode) + " };");
				
				code = code.replace(funcCode, "");
				code = code.replace(/[\s]*/, "");
			}
			else
			{
				var rightRegex = /[\s]*[^;]+;[\s]*/;
				var right = rightRegex.exec(code)[0].trim();
				
				right = right.replace(";", "");
				
				code = code.replace(rightRegex, "");
				
				if(left == "img")
				{
					if(!(right in image))
					{
						image[right] = new Image();
						image[right].src = "files/images/" + right.replace(/\"/g, "");
					}
					temp["img"] = image[right];
				}
				else
				{
					temp[left] = eval(right);
				}
			}
		}
		else //Handle function calls differently than assignments
		{
			eval("temp." + tLine);
		}
	}
	console.log("evaled obj");
	return temp;
}

//Make a valid switch-case resumeFunc out of function. "waitForEngine();" will signal a return from a case.
function evalFunc(code) {
	var returnCode = "switch(cue) { case 0: {";
	
	var caseNum = 0;
	
	returnCode += code.replace(/waitForEngine\(\);/gi, function(n){ 
		caseNum++;
		return "return " + caseNum + ";}; case " + caseNum + ": {";
	});
	
	returnCode += "} default: { }; }";
	
	return returnCode;
}

//Load from localStorage save "file" of fileName, returns level name to be passed to enterLevelByName()
function fileLoad(fileName) {
	var keyList = { level: "", x: "", y: "", layer: "", mvmt: "", speech: "", dmnr: "", dir: "", steps: "", pushy: "", hp: "", maxHp: "", strg: "", spd: "" }; 

	for(var index = 0; index < NPC.length; index++)
	{
		for(var key in keyList)
		{
			var item = localStorage.getItem(GAMEID + "_" + fileName + "_NPC" + index + "_" + key);
			if(item != null) 
			{ 
				if(key != "level" && key != "speech") NPC[index][key] = Number(item); 
				else NPC[index][key] = item;
			}
			else { console.log(item + "=null"); }
		}
	}
	for(var index = 0; index < player.length; index++)
	{
		for(var key in keyList)
		{
			var item = localStorage.getItem(GAMEID + "_" + fileName + "_player" + index + "_" + key);
			if(item != null) 
			{ 
				if(key != "level" && key != "speech") player[index][key] = Number(item); 
				else player[index][key] = item;
			}
			else { console.log(index + key + "=null"); }
		}
	}
	
	//localStorage.getItem(GAMEID + "_" + fileName + "_currentLevelName");
	currentPlayer = eval(localStorage.getItem(GAMEID + "_" + fileName + "_currentPlayer"));	
	var item = localStorage.getItem(GAMEID + "_" + fileName + "_SAVE");
	SAVE = JSON.parse(item);

	//Return level name
	return localStorage.getItem(GAMEID + "_" + fileName + "_currentLevelName");
}

//Save current game to localStorage "file" of fileName
function fileSave(fileName) {
	console.log("starting save...");
	var keyList = { level: "", x: "", y: "", layer: "", mvmt: "", speech: "", dmnr: "", dir: "", steps: "", pushy: "", hp: "", maxHp: "", strg: "", spd: "" }; 
	console.log("listed keys");
	for(var index in NPC)
	{
		//console.log("saving NPC" + index);
		for(var key in keyList)
		{
			//console.log("saving" + key);
			try {
			localStorage.setItem(GAMEID + "_" + fileName + "_NPC" + index + "_" + key, NPC[index][key]); }
			catch(e) { console.log("failed on NPC " + index + " " + key); }
		}
	}
	console.log("between loops");
	for(var index in player)
	{
		for(var key in keyList)
		{
			try {
			localStorage.setItem(GAMEID + "_" + fileName + "_player" + index + "_" + key, player[index][key]); }
			catch(e) { console.log("failed on player " + index + " " + key); }
		}
	}
	console.log("through loops");

	localStorage.setItem(GAMEID + "_" + fileName + "_currentLevelName", currentLevel.name);
	console.log("saved level name as " + currentLevel.name);
	localStorage.setItem(GAMEID + "_" + fileName + "_currentPlayer", currentPlayer);
	localStorage.setItem(GAMEID + "_" + fileName + "_SAVE", JSON.stringify(SAVE));
	console.log("done");
}

function getNPCByName(name) {
	return NPC[name];
}

function getPixel(x, y, data) {
	var i = pixCoordToIndex(x, y, data);
	
	return data.data.slice(i, i + 4);
}

function getScriptAlt(url, callback) {
      var head = document.getElementsByTagName("head")[0];
      var script = document.createElement("script");
      script.src = url;

      // Handle Script loading
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
   }

//Create object for XML file. (Locally only works in Firefox)
function getXML(fil) {
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttp.open("GET",fil,false);
	xmlhttp.send();
	xmlDoc=xmlhttp.responseXML;
	return xmlDoc;
}

//Get text from file
function getTXT(fil) {
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttp.open("GET",fil,false);
	xmlhttp.send();
	var txt = xmlhttp.responseText;
	console.log("got text");
	return txt;
}

//Disguised HTTP GET request
function include(fil) {
	$.getScript("files/code/" + fil);
}

function includeScripts() {
	if(arguments.length == 1)
	{
		getScriptAlt(arguments[0]);
	}
	else
	{
		var fil = arguments[0];
		var args = Array.prototype.slice.call(arguments);
		args.splice(0, 1);
		console.log("getting |" + fil + "|");
		getScriptAlt(fil, function() { includeScripts.apply(this, args); });//.done(function() { }).fail(function() { console.log("includeInOrder() failed with " + args.length + " arguments left to go."); });
	}
}

//Gets the index on canvas data of given coordinates
function pixCoordToIndex(x,y,dat) {
 return (y*dat.width + x)*4;
}

//random integer between 1 and num
function randomInt(num) {
	return Math.floor((Math.random() * num) + 1);
}

function randomSeed() {
	var limit = (new Date()).getTime() % 1000000;
	for(var i = 0; i < limit; i++)
	{
		Math.random();
	}
}

//Like enterLevelByName() with coordinates
function send(board, x, y, z) {
	player[currentPlayer].x = x;
	player[currentPlayer].y = y;
	player[currentPlayer].layer = z;
	enterLevelByName(board);
}

//Functions to convert between actual pixel locations and tile-based locations. All begin with 0, 0 as top left. Rounding is employed to ensure all return values are integers
function xPixToTile(x) {
	return Math.round((x-7)/32);
}
function xTileToPix(x) {
	return (x*32)+7;
}
function yPixToTile(y) {
	return Math.round((y-21)/32);
}
function yTileToPix(y) {
	return (y*32)+21;
}