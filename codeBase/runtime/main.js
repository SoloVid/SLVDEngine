//Include user files
//$.getScript("files/main/initialize.js");
//alert("got script");

//Engine code

see.font="20px Arial";
see.fillText("If this message persists for more than a few seconds,", 10, 30);
see.fillText("this game will not run on your browser.", 10, 60);
see.font="30px Arial";

randomSeed();

//*-*-*-*-*-*-*-*-*-*-*-*Main Loop
resumeFunc = startUp; //in initialize.js

SLVDEngine.main = function() {
//console.log(SLVDEngine.counter);
	var a = new Date(); //for speed checking
	switch(SLVDEngine.process)
	{
		case "loading":
		{
			loadUpdate(); //in load.js
			break;
		}
		case "zelda":
		{
			//Advance one second per second (given 20ms main interval)
			if(SLVDEngine.counter%FPS == 0) Time.advance(1); //in time.js
			var b = new SLVD.speedCheck("Time.advance", a);
			b.logUnusual();
			
			zeldaPlayerMotion();
			var c = new SLVD.speedCheck("zeldaPlayerMotion", b.date);
			c.logUnusual();
			
			zeldaNPCMotion();
			var d = new SLVD.speedCheck("zeldaNPCMotion", c.date);
			d.logUnusual();
			
			if(SLVDEngine.boardSprite.length == 0) restartBoardC();
			else sortBoardC();
			var e = new SLVD.speedCheck("sortBoardC", d.date);
			e.logUnusual();

			if(SLVDEngine.process != "zelda") break;
			
			//Render board, see below
			renderBoardState(true);
			var f = new SLVD.speedCheck("renderBoardState", e.date);
			f.logUnusual(5);
			
			break;
		}
		case "TRPG":
		{
			if(cTeam == player)
			{
				TRPGPlayerMotion();
			}
			else if(cTeam == boardNPC)
			{
				TRPGNPCMotion();
			}
			sortBoardC();
			
			renderBoardState(true);
			/*orientScreen();
			for(var index = 0; index < SLVDEngine.currentLevel.layerImg.length; index++)
			{
				//Draw layer
				see.drawImage(SLVDEngine.currentLevel.layerImg[index], wX, wY, SCREENX, SCREENY, 0, 0, SCREENX, SCREENY);
				//Draw blue range squares
				if(index == cTeam[currentPlayer].layer && cTeam[currentPlayer].squares != null)
				{
					for(var second = 0; second < cTeam[currentPlayer].squares.length; second++)
					{
						see.drawImage(image["blueSquare.png"], 0, 0, 32, 32, cTeam[currentPlayer].squares[second].x*32 - wX, cTeam[currentPlayer].squares[second].y*32 - wY, 32, 32);
					}
				}
				for(var second = 0; second < SLVDEngine.boardSprite.length; second++)
				{
					if(SLVDEngine.boardSprite[second].act == "slash") 
					{ 
						//If done slashing, move on.
						if(SLVDEngine.boardSprite[second].countdown <= 0)
						{
							SLVDEngine.boardSprite[second].act = null;
							TRPGNextTurn();
						}
						else
						{
							//Cycle through opponents
							for(var third = 0; third < SLVDEngine.boardSprite[second].oppTeam.length; third++)
							{
								//If distance < 40
								//if(Math.sqrt(Math.pow(SLVDEngine.boardSprite[second].oppTeam[third].x - SLVDEngine.boardSprite[second].x, 2) + Math.pow(SLVDEngine.boardSprite[second].oppTeam[third].y - SLVDEngine.boardSprite[second].y, 2)) <= 36)
								//If one tile away
								if(Math.pow(xPixToTile(SLVDEngine.boardSprite[second].oppTeam[third].x) - xPixToTile(SLVDEngine.boardSprite[second].x), 2) + Math.pow(yPixToTile(SLVDEngine.boardSprite[second].oppTeam[third].y) - yPixToTile(SLVDEngine.boardSprite[second].y), 2) == 1)
								{
									//Determine angle between slasher and opponent (in terms of PI/2)
									var angle = Math.atan(-(SLVDEngine.boardSprite[second].oppTeam[third].y - SLVDEngine.boardSprite[second].y)/(SLVDEngine.boardSprite[second].oppTeam[third].x - SLVDEngine.boardSprite[second].x))/(Math.PI/2);

									if(SLVDEngine.boardSprite[second].oppTeam[third].x > SLVDEngine.boardSprite[second].x && SLVDEngine.boardSprite[second].oppTeam[third].y > SLVDEngine.boardSprite[second].y)
									{	
										angle += 4;
									}
									else if(SLVDEngine.boardSprite[second].oppTeam[third].x < SLVDEngine.boardSprite[second].x)
									{
										angle += 2;
									}
									//Compare angle to direction of slasher. If in range of PI...
									if((Math.abs(angle - SLVDEngine.boardSprite[second].dir) <= .5 || Math.abs(angle - SLVDEngine.boardSprite[second].dir) >= 3.5) && SLVDEngine.boardSprite[second].oppTeam[third].status != "hurt")
									{
										damage(SLVDEngine.boardSprite[second], SLVDEngine.boardSprite[second].oppTeam[third]);
										SLVDEngine.boardSprite[second].oppTeam[third].status = "hurt";
										SLVDEngine.boardSprite[second].oppTeam[third].countdown = 4;
									}
								}
							}
							see.lineWidth = 8;
							see.beginPath();
							see.arc((SLVDEngine.boardSprite[second].x - ((SLVDEngine.boardSprite[second].xres)/2)) - wX + 24, (SLVDEngine.boardSprite[second].y - (SLVDEngine.boardSprite[second].yres)) - wY + 56, 32, .5*((3 - SLVDEngine.boardSprite[second].dir) - .5 + (SLVDEngine.boardSprite[second].countdown/8))*Math.PI, .5*((3 - SLVDEngine.boardSprite[second].dir) + .5 + (SLVDEngine.boardSprite[second].countdown/8))*Math.PI);
							see.strokeStyle = "white";
							see.stroke();
							SLVDEngine.boardSprite[second].countdown--;
							if(SLVDEngine.boardSprite[second].countdown < 0)
							{
								SLVDEngine.boardSprite[second].countdown = 0;
							}
						}
					}
					if(SLVDEngine.boardSprite[second].layer == index)
					{
						if((SLVDEngine.boardSprite[second].status == "hurt" && frameClock != 1) || SLVDEngine.boardSprite[second].status != "hurt")
						{
							var col = determineColumn(SLVDEngine.boardSprite[second].dir);
							see.drawImage(SLVDEngine.boardSprite[second].img, 32*col, 64*SLVDEngine.boardSprite[second].frame, SLVDEngine.boardSprite[second].xres, SLVDEngine.boardSprite[second].yres, (SLVDEngine.boardSprite[second].x - (((SLVDEngine.boardSprite[second].xres)/2) - 8)) - wX, (SLVDEngine.boardSprite[second].y - (SLVDEngine.boardSprite[second].yres - 8)) - wY, SLVDEngine.boardSprite[second].xres, SLVDEngine.boardSprite[second].yres);
							if(SLVDEngine.boardSprite[second].holding != null && Math.round(SLVDEngine.boardSprite[second].dir) != 1)
							{
								see.drawImage(SLVDEngine.boardSprite[second].holding, (SLVDEngine.boardSprite[second].holding.width/4)*col, 0, (SLVDEngine.boardSprite[second].holding.width/4), 32, (SLVDEngine.boardSprite[second].x - (((SLVDEngine.boardSprite[second].xres)/2) - 8)) - wX + 16*Math.round(Math.cos(SLVDEngine.boardSprite[second].dir*Math.PI/2)), (SLVDEngine.boardSprite[second].y - (SLVDEngine.boardSprite[second].yres - 18)) - wY - 5*Math.round(Math.sin(SLVDEngine.boardSprite[second].dir*Math.PI/2)), 32, 32);	
							}
						}
						if(SLVDEngine.boardSprite[second].status == "hurt" && frameClock == 1)
						{
								SLVDEngine.boardSprite[second].countdown--;
								if(SLVDEngine.boardSprite[second].countdown <= 0) 
								{
									SLVDEngine.boardSprite[second].status = null;
								}
						}
					}
					if(SLVDEngine.boardSprite[second].dart.layer == index)
					{
						var col = determineColumn(SLVDEngine.boardSprite[second].dart.dir);
						see.drawImage(SLVDEngine.boardSprite[second].dart.img, SLVDEngine.boardSprite[second].dart.xres*col, SLVDEngine.boardSprite[second].dart.yres*SLVDEngine.boardSprite[second].dart.frame, SLVDEngine.boardSprite[second].dart.xres, SLVDEngine.boardSprite[second].dart.yres, SLVDEngine.boardSprite[second].dart.x - wX, SLVDEngine.boardSprite[second].dart.y - wY, SLVDEngine.boardSprite[second].dart.xres, SLVDEngine.boardSprite[second].dart.yres);
					}
				}
			}
			//Weather
			see.fillStyle = "rgba(0, 0, 0, " + shade + ")";
			see.fillRect(0, 0, SCREENX, SCREENY);
			if(rainy)
			{
				see.drawImage(image["rain.png"], -((SLVDEngine.counter%100)/100)*SCREENX, ((SLVDEngine.counter%25)/25)*SCREENY - SCREENY);
				if(SLVDEngine.counter%8 == randomInt(12))
				{
					for(var index = 0; index < randomInt(3); index++)
					{
						see.drawImage(image["lightning.png"], 0, 0);
					}
				}
			}
			if(cloudy) see.drawImage(image["stormClouds.png"], SLVDEngine.counter%1280 - 1280, 0);
			//document.getElementById("info").innerHTML = player[0].dir + ", " + player[0].x + ", " + player[0].y + ", " + dKeys
			see.fillStyle="#FFFFFF";
			see.font="12px Verdana";
			see.fillText(cTeam[currentPlayer].name + ": " + cTeam[currentPlayer].hp + " HP | " + cTeam[currentPlayer].strg + " Strength | " + cTeam[currentPlayer].spd + " Speed", 10, 20);
			*/
			break;
		}
		case "menu":
		{
			//alert("start menu");
			SLVDEngine.currentMenu.handleMenu(); //in menuFunctions.js
			//alert("handled menu");
			SLVDEngine.currentMenu.update(); //in menu object declaration
			//alert("ran update check");
			//Draw menu background
			see.drawImage(SLVDEngine.currentMenu.background, 0, 0);
			//Draw cursor
			see.drawImage(SLVDEngine.currentMenu.cursor, SLVDEngine.currentMenu.point[SLVDEngine.currentMenu.currentPoint].x, SLVDEngine.currentMenu.point[SLVDEngine.currentMenu.currentPoint].y);
			if(SLVDEngine.keyFirstDown == "enter" || SLVDEngine.keyFirstDown == "space") //Select
			{
				delete SLVDEngine.keyFirstDown;
				SLVDEngine.currentMenu.chosenPoint = SLVDEngine.currentMenu.currentPoint;
				SLVDEngine.mainPromise.resolve(SLVDEngine.currentMenu.chosenPoint);
			}			
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
		frameClock = 1;
	}
	else
	{
		frameClock = 0;
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

	keys++;
	key = SLVDEngine.keyCodeKey[e.which || e.keyCode];//e.key.toLowerCase();
	
	if(key == " ")
	{
		key = "space";
	}
	//alert(key);

	if(key == "t")
	{
		alert("saving...");
		//alert("test second alert");
		fileSave("testFile");
		alert("saved!");
	}
	else if(key == "y")
	{
	/*	var seen = [];
		
		var alerter = JSON.stringify(player[currentPlayer], function(key, val) {
			if(val != null && typeof val == "object") {
				if(seen.indexOf(val) >= 0) return seen.push(val); }
				return val; });
		alert(alerter);*/
		alert(player[currentPlayer].x + ", " + player[currentPlayer].y + ", " + player[currentPlayer].layer);
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
	else if(SLVDEngine.process == "waitForEnterOrSpace" && (key == "enter" || key == "space"))
	{
		SLVDEngine.mainPromise.resolve(key);
	}
}

//The clean-up of the above function.
document.onkeyup = function(e) {
	keys--;
	key = SLVDEngine.keyCodeKey[e.keyCode];//e.key.toLowerCase();
	
	if(key == SLVDEngine.keyFirstDown)
	{
		delete SLVDEngine.keyFirstDown;
	}
	
	delete SLVDEngine.keyDown[key];
}

//Set wX and wY (references for relative image drawing) based on current player's (or in some cases NPC's) position.
function orientScreen() {
	var person = cTeam[currentPlayer];
	var x = person.x + person.offX;
	var y = person.y + person.offY;
  if(SLVDEngine.currentLevel.layerImg[0].width <= SCREENX) {
	wX = (SLVDEngine.currentLevel.layerImg[0].width - SCREENX)/2;
  }
  else if (x + SCREENX/2 >= SLVDEngine.currentLevel.layerImg[0].width) {
    wX = SLVDEngine.currentLevel.layerImg[0].width - SCREENX;
  }
  else if (x >= SCREENX/2) {
    wX = x - (SCREENX/2);
  }
  else {
    wX = 0;
  }
  
  if(SLVDEngine.currentLevel.layerImg[0].height <= SCREENY) {
	wY = (SLVDEngine.currentLevel.layerImg[0].height - SCREENY)/2;
  }
  else if (y + SCREENY/2 >= SLVDEngine.currentLevel.layerImg[0].height) {
    wY = SLVDEngine.currentLevel.layerImg[0].height - SCREENY;
  }
  else if (y >= SCREENY/2) {
    wY = y - (SCREENY/2);
  }
  else {
    wY = 0;
  }
}

//Sort all board characters into the array SLVDEngine.boardSprite in order of y location (in order to properly render sprite overlap).
function restartBoardC() {
	SLVDEngine.boardSprite.length = 0;
	
	//Figure out which NPCs are onboard
	for(var index = 0; index < NPC.length; index++)
	{
		if(NPC[index].lvl == SLVDEngine.currentLevel.name)
		{
			insertBoardC(NPC[index]);
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

	for(var index = 0; index < player.length; index++)
	{
		if(index == currentPlayer || SLVDEngine.currentLevel.type == "TRPG") insertBoardC(player[index]);
	}
}

//Sort the array SLVDEngine.boardSprite in order of y location (in order to properly render sprite overlap).
function sortBoardC() {
	if(SLVDEngine.boardSprite.length == 0) restartBoardC();
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
}

function insertBoardC(element) {
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
}

function deleteBoardC(element) {
	for(var index = 0; index < SLVDEngine.boardSprite.length; index++)
	{
		if(element == SLVDEngine.boardSprite[index])
		{
			SLVDEngine.boardSprite.splice(index, 1);
			index = SLVDEngine.boardSprite.length;
		}
	}
}

//Based on keys down (ASDW and arrows), set current player's direction. Used in zeldaPlayerMotion().
function figurePlayerDirection() {
	dKeys = 0;
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
		player[currentPlayer].dir = dir;
	}
}

function renderBoardState() {
	orientScreen();
	var lightedThing = [];
	
	//Black out screen (mainly for the case of board being smaller than the screen)
	see.fillStyle="#000000";
	see.fillRect(0, 0, SCREENX, SCREENY);
	
	//Rendering sequence
	for(var index = 0; index < SLVDEngine.currentLevel.layerImg.length; index++)
	{
		snapShotCtx.clearRect(0, 0, SCREENX, SCREENY);
	
		if(SLVDEngine.process == "TRPG")
		{
			//Draw blue range squares
			if(index == cTeam[currentPlayer].layer && cTeam[currentPlayer].squares != null)
			{
				for(var second = 0; second < cTeam[currentPlayer].squares.length; second++)
				{
					see.fillStyle = "rgba(0, 100, 255, .5)";
					see.fillRect(cTeam[currentPlayer].squares[second].x*32 - wX, cTeam[currentPlayer].squares[second].y*32 - wY, 32, 32);
					//see.drawImage(image["blueSquare.png"], 0, 0, 32, 32, cTeam[currentPlayer].squares[second].x*32 - wX, cTeam[currentPlayer].squares[second].y*32 - wY, 32, 32);
				}
			}
		}
		
		//Loop through SLVDEngine.boardSprite (to render)
		for(var second = 0; second < SLVDEngine.boardSprite.length; second++)
		{
			var cSprite = SLVDEngine.boardSprite[second];
			if(cSprite.layer == index) //ensure proper layering
			{
				//cSprite.see(see);
				SpriteF.see.call(cSprite, snapShotCtx);
				
				//Determine if SLVDEngine.boardSprite is lighted
				if(cSprite.isLight)
				{
					lightedThing[lightedThing.length] = cSprite;
				}
				
				SpriteF.resetStance.call(cSprite);
				SpriteF.resetCans.call(cSprite);
			}
		}
		snapShotCtx.globalAlpha = 1;
		
		//Work out details of smaller-than-screen dimensions
		if(wX < 0) var xDif = Math.abs(wX);
		else var xDif = 0;
		if(wY < 0) var yDif = Math.abs(wY);
		else var yDif = 0;
		
		snapShotCtx.globalCompositeOperation = "destination-over";
		
		//Draw layer based on values found in orientScreen() and altered above
		snapShotCtx.drawImage(SLVDEngine.currentLevel.layerImg[index], wX + xDif, wY + yDif, SCREENX - 2*xDif, SCREENY - 2*yDif, xDif, yDif, SCREENX - 2*xDif, SCREENY - 2*yDif);

		snapShotCtx.globalCompositeOperation = "source-over";
		
		see.drawImage(snapShot, 0, 0);
	}
	
	//Weather
	if(rainy) see.drawImage(image["rain.png"], -((SLVDEngine.counter%100)/100)*SCREENX, ((SLVDEngine.counter%25)/25)*SCREENY - SCREENY);
	if(cloudy) see.drawImage(image["stormClouds.png"], SLVDEngine.counter%1280 - 1280, 0);
	//Light in dark
	if(dark > 0)
	{
		//Transparentize buffer
		bufferCtx.clearRect(0, 0, SCREENX, SCREENY);

		//Put lighted things on the buffer as white radial gradients with opaque centers and transparent edges
		for(var index = 0; index < lightedThing.length; index++)
		{
			var xCoord = (lightedThing[index].x) - wX; 
			var yCoord = (lightedThing[index].y) - wY;
			var grd = bufferCtx.createRadialGradient(xCoord, yCoord, 1, xCoord, yCoord, 150);
			grd.addColorStop(0, "rgba(255, 255, 255, " + dark + ")");
			grd.addColorStop(1, "rgba(255, 255, 255, 0)");
			bufferCtx.fillStyle = grd;
			bufferCtx.beginPath();
			bufferCtx.arc(xCoord, yCoord, 150, 2*Math.PI, false);
			bufferCtx.closePath();
			bufferCtx.fill();				
		}

		//XOR lights placed with black overlay (the result being holes in the black)
		bufferCtx.globalCompositeOperation = "xor";
		bufferCtx.fillStyle = "rgba(0, 0, 0, " + dark + ")";//"#000000";
		bufferCtx.fillRect(0, 0, SCREENX, SCREENY);

		//Render buffer
		see.drawImage(buffer, 0, 0, SCREENX, SCREENY);
		
		//Return to default image layering
		bufferCtx.globalCompositeOperation = "source-over";
	}
	
	//Display current player stats
	see.fillStyle="#FFFFFF";
	see.font="12px Verdana";
	see.fillText(player[currentPlayer].name + ": " + player[currentPlayer].hp + " HP | " + player[currentPlayer].strg + " Strength | " + player[currentPlayer].spd + " Agility", 10, 20);

	Time.renderClock(see); //in time.js
	
	//Save screen into snapShot
	snapShotCtx.drawImage(seeB, 0, 0);
}