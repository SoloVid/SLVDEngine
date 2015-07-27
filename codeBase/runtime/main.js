//Include user files
//$.getScript("files/SLVDEngine.main/initialize.js");
//alert("got script");

//Engine code

SLVDEngine.see.font="20px Arial";
SLVDEngine.see.fillText("If this message persists for more than a few seconds,", 10, 30);
SLVDEngine.see.fillText("this game will not run on your browser.", 10, 60);
SLVDEngine.see.font="30px Arial";

SLVD.randomSeed();

//*-*-*-*-*-*-*-*-*-*-*-*Main Loop
SLVDEngine.main = function() {
//console.log(SLVDEngine.counter);
	var a = new Date(); //for speed checking
	switch(SLVDEngine.process)
	{
		case "loading":
		{
			SLVDEngine.loadUpdate(); //in load.js
			break;
		}
		case "zelda":
		{
			//Advance one second per second (given 20ms SLVDEngine.main interval)
			if(SLVDEngine.counter%SLVDEngine.FPS == 0) SLVDEngine.Time.advance(1); //in time.js
			var b = new SLVD.speedCheck("SLVDEngine.Time.advance", a);
			b.logUnusual();
			
			SLVDEngine.zeldaPlayerMotion();
			var c = new SLVD.speedCheck("SLVDEngine.zeldaPlayerMotion", b.date);
			c.logUnusual();
			
			SLVDEngine.zeldaNPCMotion();
			var d = new SLVD.speedCheck("SLVDEngine.zeldaNPCMotion", c.date);
			d.logUnusual();
			
			if(SLVDEngine.boardSprite.length == 0) SLVDEngine.restartBoardC();
			else SLVDEngine.sortBoardC();
			var e = new SLVD.speedCheck("SLVDEngine.sortBoardC", d.date);
			e.logUnusual();

			if(SLVDEngine.process != "zelda") break;
			
			//Render board, SLVDEngine.see below
			SLVDEngine.renderBoardState(true);
			var f = new SLVD.speedCheck("SLVDEngine.renderBoardState", e.date);
			f.logUnusual(5);
			
			break;
		}
		case "TRPG":
		{
			if(SLVDEngine.cTeam == SLVDEngine.player)
			{
				SLVDEngine.TRPGPlayerMotion();
			}
			else if(SLVDEngine.cTeam == boardNPC)
			{
				SLVDEngine.TRPGNPCMotion();
			}
			SLVDEngine.sortBoardC();
			
			SLVDEngine.renderBoardState(true);
			break;
		}
		case "menu":
		{
			//alert("start SLVDEngine.menu");
			SLVDEngine.currentMenu.handleMenu(); //in menuFunctions.js
			//alert("handled SLVDEngine.menu");
			SLVDEngine.currentMenu.update(); //in SLVDEngine.menu object declaration
			//alert("ran update check");
			//Draw SLVDEngine.menu background
			SLVDEngine.see.drawImage(SLVDEngine.currentMenu.background, 0, 0);
			//Draw cursor
			SLVDEngine.see.drawImage(SLVDEngine.currentMenu.cursor, SLVDEngine.currentMenu.point[SLVDEngine.currentMenu.currentPoint].x, SLVDEngine.currentMenu.point[SLVDEngine.currentMenu.currentPoint].y);
			if(SLVDEngine.keyFirstDown == "enter" || SLVDEngine.keyFirstDown == "space") //Select
			{
				SLVDEngine.currentMenu.chosenPoint = SLVDEngine.currentMenu.currentPoint;
				SLVDEngine.mainPromise.resolve(SLVDEngine.currentMenu.chosenPoint);
			}	
			delete SLVDEngine.keyFirstDown;
			break;
		}
		case "delay":
		{
			if(SLVDEngine.countdown <= 0)
			{
				if(SLVDEngine.mainPromise) 
				{
					SLVDEngine.mainPromise.resolve();
				}
				else 
				{
					SLVDEngine.process = SLVDEngine.currentLevel.type;
				}
			}
			else SLVDEngine.countdown--;
			break;
		}
		default: { }
	}
	SLVDEngine.counter++;
	if(SLVDEngine.counter == 25600)
	{
		SLVDEngine.counter = 0;
	}
//	document.getElementById("timey").innerHTML = SLVDEngine.counter;
	if((SLVDEngine.counter%8) == 0)
	{
		SLVDEngine.frameClock = 1;
	}
	else
	{
		SLVDEngine.frameClock = 0;
	}
};

//*-*-*-*-*-*-*-*-*-*-*-*End Main Loop


SLVDEngine.keyCodeKey = {
	65: 'a',
	83: 's',
	68: 'd',
	87: 'w',
	32: 'space',
	13: 'enter',
	37: 'left',
	40: 'down',
	39: 'right',
	38: 'up',
	74: 'j',
	75: 'k',
	76: 'l',
	73: 'i'
};

//Main (master) functions
//Sets variables useful for determining what keys are down at any time.
document.onkeydown = function(e) {
	//Prevent scrolling with arrows
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

	var key = SLVDEngine.keyCodeKey[e.which || e.keyCode];//e.key.toLowerCase();
	
	if(key == " ")
	{
		key = "space";
	}
	//alert(key);

	if(key == "t")
	{
		alert("saving...");
		//alert("test second alert");
		SLVDEngine.fileSave("testFile");
		alert("saved!");
	}
	else if(key == "y")
	{
	/*	var seen = [];
		
		var alerter = JSON.stringify(SLVDEngine.player[SLVDEngine.currentPlayer], function(key, val) {
			if(val != null && typeof val == "object") {
				if(seen.indexOf(val) >= 0) return seen.push(val); }
				return val; });
		alert(alerter);*/
		alert(SLVDEngine.player[SLVDEngine.currentPlayer].x + ", " + SLVDEngine.player[SLVDEngine.currentPlayer].y + ", " + SLVDEngine.player[SLVDEngine.currentPlayer].layer);
	}

	if(SLVDEngine.keyDown[key] === undefined)
	{
		SLVDEngine.keyFirstDown = key;
	}
	SLVDEngine.keyDown[key] = true;
	
	if(SLVDEngine.process == "wait" && SLVDEngine.mainPromise)
	{
		SLVDEngine.mainPromise.resolve(key);
	}
	else if(SLVDEngine.process == "SLVDEngine.waitForEnterOrSpace" && (key == "enter" || key == "space"))
	{
		SLVDEngine.mainPromise.resolve(key);
	}
}

//The clean-up of the above function.
document.onkeyup = function(e) {
	var key = SLVDEngine.keyCodeKey[e.keyCode];//e.key.toLowerCase();
	
	if(key == SLVDEngine.keyFirstDown)
	{
		delete SLVDEngine.keyFirstDown;
	}
	
	delete SLVDEngine.keyDown[key];
}

//Set SLVDEngine.wX and SLVDEngine.wY (references for relative SLVDEngine.image drawing) based on current SLVDEngine.player's (or in some cases SLVDEngine.NPC's) position.
SLVDEngine.orientScreen = function() {
	var person = SLVDEngine.cTeam[SLVDEngine.currentPlayer];
	var x = person.x + person.offX;
	var y = person.y + person.offY;
  if(SLVDEngine.currentLevel.layerImg[0].width <= SLVDEngine.SCREENX) {
	SLVDEngine.wX = (SLVDEngine.currentLevel.layerImg[0].width - SLVDEngine.SCREENX)/2;
  }
  else if (x + SLVDEngine.SCREENX/2 >= SLVDEngine.currentLevel.layerImg[0].width) {
    SLVDEngine.wX = SLVDEngine.currentLevel.layerImg[0].width - SLVDEngine.SCREENX;
  }
  else if (x >= SLVDEngine.SCREENX/2) {
    SLVDEngine.wX = x - (SLVDEngine.SCREENX/2);
  }
  else {
    SLVDEngine.wX = 0;
  }
  
  if(SLVDEngine.currentLevel.layerImg[0].height <= SLVDEngine.SCREENY) {
	SLVDEngine.wY = (SLVDEngine.currentLevel.layerImg[0].height - SLVDEngine.SCREENY)/2;
  }
  else if (y + SLVDEngine.SCREENY/2 >= SLVDEngine.currentLevel.layerImg[0].height) {
    SLVDEngine.wY = SLVDEngine.currentLevel.layerImg[0].height - SLVDEngine.SCREENY;
  }
  else if (y >= SLVDEngine.SCREENY/2) {
    SLVDEngine.wY = y - (SLVDEngine.SCREENY/2);
  }
  else {
    SLVDEngine.wY = 0;
  }
};

//Sort all board characters into the array SLVDEngine.boardSprite in order of y location (in order to properly render sprite overlap).
SLVDEngine.restartBoardC = function() {
	SLVDEngine.boardSprite.length = 0;
	
	//Figure out which NPCs are onboard
	for(var index = 0; index < SLVDEngine.NPC.length; index++)
	{
		if(SLVDEngine.NPC[index].lvl == SLVDEngine.currentLevel.name)
		{
			SLVDEngine.insertBoardC(SLVDEngine.NPC[index]);
		}
	}
	
	//Pull board objects from file
	for(var index = 0; index < SLVDEngine.currentLevel.filedata.getElementsByTagName("boardObj").length; index++)
	{
		var template = SLVDEngine.currentLevel.filedata.getElementsByTagName("boardObj")[index].getAttribute("template")
		var objCode = SLVDEngine.currentLevel.filedata.getElementsByTagName("boardObj")[index].textContent;
		
		SLVDEngine.insertBoardC(SLVDEngine.evalObj(template, objCode));
		//boardObj[current].lvl = SLVDEngine.currentLevel.name;
	}

	for(var index = 0; index < SLVDEngine.player.length; index++)
	{
		if(index == SLVDEngine.currentPlayer || SLVDEngine.currentLevel.type == "TRPG") SLVDEngine.insertBoardC(SLVDEngine.player[index]);
	}
};

//Sort the array SLVDEngine.boardSprite in order of y location (in order to properly render sprite overlap).
SLVDEngine.sortBoardC = function() {
	if(SLVDEngine.boardSprite.length == 0) SLVDEngine.restartBoardC();
	else
	{
		for(var index = 1; index < SLVDEngine.boardSprite.length; index++)
		{
			var second = index;
			while(second > 0 && SLVDEngine.boardSprite[second].y < SLVDEngine.boardSprite[second - 1].y)
			{
				var tempC = SLVDEngine.boardSprite[second];
				SLVDEngine.boardSprite[second] = SLVDEngine.boardSprite[second - 1];
				SLVDEngine.boardSprite[second - 1] = tempC;
				second--;
			}
		}
	}
};

SLVDEngine.insertBoardC = function(element) {
	var index = 0;
	while(index < SLVDEngine.boardSprite.length && element.y > SLVDEngine.boardSprite[index].y)
	{
		index++;
	}
	SLVDEngine.boardSprite.splice(index, 0, element);
/*	var second = SLVDEngine.boardSprite.length;
	SLVDEngine.boardSprite[second] = element;
	while(second > 0)
	{
		if(SLVDEngine.boardSprite[second].y < SLVDEngine.boardSprite[second - 1].y)
		{
			var tempC = SLVDEngine.boardSprite[second];
			SLVDEngine.boardSprite[second] = SLVDEngine.boardSprite[second - 1];
			SLVDEngine.boardSprite[second - 1] = tempC;
		}
		second--;
	}*/
};

SLVDEngine.deleteBoardC = function(element) {
	for(var index = 0; index < SLVDEngine.boardSprite.length; index++)
	{
		if(element == SLVDEngine.boardSprite[index])
		{
			SLVDEngine.boardSprite.splice(index, 1);
			index = SLVDEngine.boardSprite.length;
		}
	}
};

//Based on keys down (ASDW and arrows), set current SLVDEngine.player's direction. Used in SLVDEngine.zeldaPlayerMotion().
SLVDEngine.figurePlayerDirection = function() {
	var dKeys = 0;
	var dir = 0;
	if(SLVDEngine.keyDown['a'] || SLVDEngine.keyDown['left']) //West
	{
		//How many directional keys down
		dKeys++;
		//Average in the new direction to the current direction
		dir = ((dir*(dKeys - 1)) + 2)/dKeys;
	}
	if(SLVDEngine.keyDown['w'] || SLVDEngine.keyDown['up']) //North
	{
		dKeys++;
		dir = ((dir*(dKeys - 1)) + 1)/dKeys;
	}
	if(SLVDEngine.keyDown['d'] || SLVDEngine.keyDown['right']) //East
	{
		dKeys++;
		dir = ((dir*(dKeys - 1)) + 0)/dKeys;
	}
	if(SLVDEngine.keyDown['s'] || SLVDEngine.keyDown['down']) //South
	{
		dKeys++;
		dir = ((dir*(dKeys - 1)) + 3)/dKeys;
	}
	if((SLVDEngine.keyDown['s'] || SLVDEngine.keyDown['down']) && (SLVDEngine.keyDown['d'] || SLVDEngine.keyDown['right'])) //Southeast
	{
		dir += 2;
	}

	if(dKeys)
	{
		SLVDEngine.player[SLVDEngine.currentPlayer].dir = dir % 4;
		return true;
	}
	return false;
};

SLVDEngine.renderBoardState = function() {
	SLVDEngine.orientScreen();
	var lightedThing = [];
	
	//Black out screen (mainly for the case of board being smaller than the screen)
	SLVDEngine.see.fillStyle="#000000";
	SLVDEngine.see.fillRect(0, 0, SLVDEngine.SCREENX, SLVDEngine.SCREENY);
	
	//Rendering sequence
	for(var index = 0; index < SLVDEngine.currentLevel.layerImg.length; index++)
	{
		SLVDEngine.snapShotCtx.clearRect(0, 0, SLVDEngine.SCREENX, SLVDEngine.SCREENY);
	
		if(SLVDEngine.process == "TRPG")
		{
			//Draw blue range squares
			if(index == SLVDEngine.cTeam[SLVDEngine.currentPlayer].layer && SLVDEngine.cTeam[SLVDEngine.currentPlayer].squares != null)
			{
				for(var second = 0; second < SLVDEngine.cTeam[SLVDEngine.currentPlayer].squares.length; second++)
				{
					SLVDEngine.see.fillStyle = "rgba(0, 100, 255, .5)";
					SLVDEngine.see.fillRect(SLVDEngine.cTeam[SLVDEngine.currentPlayer].squares[second].x*32 - SLVDEngine.wX, SLVDEngine.cTeam[SLVDEngine.currentPlayer].squares[second].y*32 - SLVDEngine.wY, 32, 32);
					//SLVDEngine.see.drawImage(SLVDEngine.image["blueSquare.png"], 0, 0, 32, 32, SLVDEngine.cTeam[SLVDEngine.currentPlayer].squares[second].x*32 - SLVDEngine.wX, SLVDEngine.cTeam[SLVDEngine.currentPlayer].squares[second].y*32 - SLVDEngine.wY, 32, 32);
				}
			}
		}
		
		//Loop through SLVDEngine.boardSprite (to render)
		for(var second = 0; second < SLVDEngine.boardSprite.length; second++)
		{
			var cSprite = SLVDEngine.boardSprite[second];
			if(cSprite.layer == index) //ensure proper layering
			{
				cSprite.see(SLVDEngine.snapShotCtx);
				//SpriteF.see.call(cSprite, SLVDEngine.snapShotCtx);
				
				//Determine if SLVDEngine.boardSprite is lighted
				if(cSprite.isLight)
				{
					lightedThing[lightedThing.length] = cSprite;
				}
				
				cSprite.resetStance();
				cSprite.resetCans();
			}
		}
		SLVDEngine.snapShotCtx.globalAlpha = 1;
		
		//Work out details of smaller-than-screen dimensions
		if(SLVDEngine.wX < 0) var xDif = Math.abs(SLVDEngine.wX);
		else var xDif = 0;
		if(SLVDEngine.wY < 0) var yDif = Math.abs(SLVDEngine.wY);
		else var yDif = 0;
		
		SLVDEngine.snapShotCtx.globalCompositeOperation = "destination-over";
		
		//Draw layer based on values found in SLVDEngine.orientScreen() and altered above
		SLVDEngine.snapShotCtx.drawImage(SLVDEngine.currentLevel.layerImg[index], SLVDEngine.wX + xDif, SLVDEngine.wY + yDif, SLVDEngine.SCREENX - 2*xDif, SLVDEngine.SCREENY - 2*yDif, xDif, yDif, SLVDEngine.SCREENX - 2*xDif, SLVDEngine.SCREENY - 2*yDif);

		SLVDEngine.snapShotCtx.globalCompositeOperation = "source-over";
		
		SLVDEngine.see.drawImage(SLVDEngine.snapShot, 0, 0);
	}
	
	//Weather
	if(SLVDEngine.weather.rain) SLVDEngine.see.drawImage(SLVDEngine.image["rain.png"], -((SLVDEngine.counter%100)/100)*SLVDEngine.SCREENX, ((SLVDEngine.counter%25)/25)*SLVDEngine.SCREENY - SLVDEngine.SCREENY);
	if(SLVDEngine.weather.clouds) SLVDEngine.see.drawImage(SLVDEngine.image["stormClouds.png"], SLVDEngine.counter%1280 - 1280, 0);
	//Light in dark
	if(SLVDEngine.weather.dark > 0)
	{
		//Transparentize SLVDEngine.buffer
		SLVDEngine.bufferCtx.clearRect(0, 0, SLVDEngine.SCREENX, SLVDEngine.SCREENY);

		//Put lighted things on the SLVDEngine.buffer as white radial gradients with opaque centers and transparent edges
		for(var index = 0; index < lightedThing.length; index++)
		{
			var xCoord = (lightedThing[index].x) - SLVDEngine.wX; 
			var yCoord = (lightedThing[index].y) - SLVDEngine.wY;
			var grd = SLVDEngine.bufferCtx.createRadialGradient(xCoord, yCoord, 1, xCoord, yCoord, 150);
			grd.addColorStop(0, "rgba(255, 255, 255, " + SLVDEngine.weather.dark + ")");
			grd.addColorStop(1, "rgba(255, 255, 255, 0)");
			SLVDEngine.bufferCtx.fillStyle = grd;
			SLVDEngine.bufferCtx.beginPath();
			SLVDEngine.bufferCtx.arc(xCoord, yCoord, 150, 2*Math.PI, false);
			SLVDEngine.bufferCtx.closePath();
			SLVDEngine.bufferCtx.fill();				
		}

		//XOR lights placed with black overlay (the result being holes in the black)
		SLVDEngine.bufferCtx.globalCompositeOperation = "xor";
		SLVDEngine.bufferCtx.fillStyle = "rgba(0, 0, 0, " + SLVDEngine.weather.dark + ")";//"#000000";
		SLVDEngine.bufferCtx.fillRect(0, 0, SLVDEngine.SCREENX, SLVDEngine.SCREENY);

		//Render SLVDEngine.buffer
		SLVDEngine.see.drawImage(SLVDEngine.buffer, 0, 0, SLVDEngine.SCREENX, SLVDEngine.SCREENY);
		
		//Return to default SLVDEngine.image layering
		SLVDEngine.bufferCtx.globalCompositeOperation = "source-over";
	}
	
	//Display current SLVDEngine.player stats
	SLVDEngine.see.fillStyle="#FFFFFF";
	SLVDEngine.see.font="12px Verdana";
	SLVDEngine.see.fillText(SLVDEngine.player[SLVDEngine.currentPlayer].name + ": " + SLVDEngine.player[SLVDEngine.currentPlayer].hp + " HP | " + SLVDEngine.player[SLVDEngine.currentPlayer].strg + " Strength | " + SLVDEngine.player[SLVDEngine.currentPlayer].spd + " Agility", 10, 20);

	SLVDEngine.Time.renderClock(SLVDEngine.see); //in time.js
	
	//Save screen into SLVDEngine.snapShot
	SLVDEngine.snapShotCtx.drawImage(SLVDEngine.seeB, 0, 0);
};
