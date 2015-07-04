//Include user files
//$.getScript("files/main/initialize.js");
alert("got script");

//Engine code

see.font="20px Arial";
see.fillText("If this message persists for more than a few seconds,", 10, 30);
see.fillText("this game will not run on your browser.", 10, 60);
see.font="30px Arial";

randomSeed();

//*-*-*-*-*-*-*-*-*-*-*-*Main Loop
resumeFunc = startUp; //in initialize.js

setInterval(function(){
console.log(SLVDEngine.counter);
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
			
			zeldaPlayerMotion();
			zeldaNPCMotion();
			
			if(boardC.length == 0) restartBoardC();
			else sortBoardC();

			if(SLVDEngine.process != "zelda") break;
			
			//Render board, see below
			renderBoardState(true);
			
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
			for(var index = 0; index < currentLevel.layerImg.length; index++)
			{
				//Draw layer
				see.drawImage(currentLevel.layerImg[index], wX, wY, SCREENX, SCREENY, 0, 0, SCREENX, SCREENY);
				//Draw blue range squares
				if(index == cTeam[currentPlayer].layer && cTeam[currentPlayer].squares != null)
				{
					for(var second = 0; second < cTeam[currentPlayer].squares.length; second++)
					{
						see.drawImage(image["blueSquare.png"], 0, 0, 32, 32, cTeam[currentPlayer].squares[second].x*32 - wX, cTeam[currentPlayer].squares[second].y*32 - wY, 32, 32);
					}
				}
				for(var second = 0; second < boardC.length; second++)
				{
					if(boardC[second].act == "slash") 
					{ 
						//If done slashing, move on.
						if(boardC[second].countdown <= 0)
						{
							boardC[second].act = null;
							TRPGNextTurn();
						}
						else
						{
							//Cycle through opponents
							for(var third = 0; third < boardC[second].oppTeam.length; third++)
							{
								//If distance < 40
								//if(Math.sqrt(Math.pow(boardC[second].oppTeam[third].x - boardC[second].x, 2) + Math.pow(boardC[second].oppTeam[third].y - boardC[second].y, 2)) <= 36)
								//If one tile away
								if(Math.pow(xPixToTile(boardC[second].oppTeam[third].x) - xPixToTile(boardC[second].x), 2) + Math.pow(yPixToTile(boardC[second].oppTeam[third].y) - yPixToTile(boardC[second].y), 2) == 1)
								{
									//Determine angle between slasher and opponent (in terms of PI/2)
									var angle = Math.atan(-(boardC[second].oppTeam[third].y - boardC[second].y)/(boardC[second].oppTeam[third].x - boardC[second].x))/(Math.PI/2);

									if(boardC[second].oppTeam[third].x > boardC[second].x && boardC[second].oppTeam[third].y > boardC[second].y)
									{	
										angle += 4;
									}
									else if(boardC[second].oppTeam[third].x < boardC[second].x)
									{
										angle += 2;
									}
									//Compare angle to direction of slasher. If in range of PI...
									if((Math.abs(angle - boardC[second].dir) <= .5 || Math.abs(angle - boardC[second].dir) >= 3.5) && boardC[second].oppTeam[third].status != "hurt")
									{
										damage(boardC[second], boardC[second].oppTeam[third]);
										boardC[second].oppTeam[third].status = "hurt";
										boardC[second].oppTeam[third].countdown = 4;
									}
								}
							}
							see.lineWidth = 8;
							see.beginPath();
							see.arc((boardC[second].x - ((boardC[second].xres)/2)) - wX + 24, (boardC[second].y - (boardC[second].yres)) - wY + 56, 32, .5*((3 - boardC[second].dir) - .5 + (boardC[second].countdown/8))*Math.PI, .5*((3 - boardC[second].dir) + .5 + (boardC[second].countdown/8))*Math.PI);
							see.strokeStyle = "white";
							see.stroke();
							boardC[second].countdown--;
							if(boardC[second].countdown < 0)
							{
								boardC[second].countdown = 0;
							}
						}
					}
					if(boardC[second].layer == index)
					{
						if((boardC[second].status == "hurt" && frameClock != 1) || boardC[second].status != "hurt")
						{
							var col = determineColumn(boardC[second].dir);
							see.drawImage(boardC[second].img, 32*col, 64*boardC[second].frame, boardC[second].xres, boardC[second].yres, (boardC[second].x - (((boardC[second].xres)/2) - 8)) - wX, (boardC[second].y - (boardC[second].yres - 8)) - wY, boardC[second].xres, boardC[second].yres);
							if(boardC[second].holding != null && Math.round(boardC[second].dir) != 1)
							{
								see.drawImage(boardC[second].holding, (boardC[second].holding.width/4)*col, 0, (boardC[second].holding.width/4), 32, (boardC[second].x - (((boardC[second].xres)/2) - 8)) - wX + 16*Math.round(Math.cos(boardC[second].dir*Math.PI/2)), (boardC[second].y - (boardC[second].yres - 18)) - wY - 5*Math.round(Math.sin(boardC[second].dir*Math.PI/2)), 32, 32);	
							}
						}
						if(boardC[second].status == "hurt" && frameClock == 1)
						{
								boardC[second].countdown--;
								if(boardC[second].countdown <= 0) 
								{
									boardC[second].status = null;
								}
						}
					}
					if(boardC[second].dart.layer == index)
					{
						var col = determineColumn(boardC[second].dart.dir);
						see.drawImage(boardC[second].dart.img, boardC[second].dart.xres*col, boardC[second].dart.yres*boardC[second].dart.frame, boardC[second].dart.xres, boardC[second].dart.yres, boardC[second].dart.x - wX, boardC[second].dart.y - wY, boardC[second].dart.xres, boardC[second].dart.yres);
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
					SLVDEngine.process = currentLevel.type;
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
},1000/FPS);

//*-*-*-*-*-*-*-*-*-*-*-*End Main Loop


//Main (master) functions
//Sets variables useful for determining what keys are down at any time.
document.onkeydown = function(e) {
	//Prevent scrolling with arrows
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

	keys++;
	key = e.key.toLowerCase();
	
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
	key = e.key.toLowerCase();
	
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
  if(currentLevel.layerImg[0].width <= SCREENX) {
	wX = (currentLevel.layerImg[0].width - SCREENX)/2;
  }
  else if (x + SCREENX/2 >= currentLevel.layerImg[0].width) {
    wX = currentLevel.layerImg[0].width - SCREENX;
  }
  else if (x >= SCREENX/2) {
    wX = x - (SCREENX/2);
  }
  else {
    wX = 0;
  }
  
  if(currentLevel.layerImg[0].height <= SCREENY) {
	wY = (currentLevel.layerImg[0].height - SCREENY)/2;
  }
  else if (y + SCREENY/2 >= currentLevel.layerImg[0].height) {
    wY = currentLevel.layerImg[0].height - SCREENY;
  }
  else if (y >= SCREENY/2) {
    wY = y - (SCREENY/2);
  }
  else {
    wY = 0;
  }
}

//Sort all board characters into the array boardC in order of y location (in order to properly render sprite overlap).
function restartBoardC() {
	boardC.length = 0;
	
	//Figure out which NPCs are onboard
	for(var index = 0; index < NPC.length; index++)
	{
		if(NPC[index].lvl == currentLevel.name)
		{
			insertBoardC(NPC[index]);
		}
	}
	
	//Pull board objects from file
	for(var index = 0; index < currentLevel.filedata.getElementsByTagName("boardObj").length; index++)
	{
		var template = currentLevel.filedata.getElementsByTagName("boardObj")[index].getAttribute("template")
		var objCode = currentLevel.filedata.getElementsByTagName("boardObj")[index].textContent;
		
		insertBoardC(SLVDEngine.evalObj(template, objCode));
		//boardObj[current].lvl = currentLevel.name;
	}

	for(var index = 0; index < player.length; index++)
	{
		if(index == currentPlayer || currentLevel.type == "TRPG") insertBoardC(player[index]);
	}
}

//Sort the array boardC in order of y location (in order to properly render sprite overlap).
function sortBoardC() {
	if(boardC.length == 0) restartBoardC();
	else
	{
		for(var index = 1; index < boardC.length; index++)
		{
			var second = index;
			while(second > 0 && boardC[second].y < boardC[second - 1].y)
			{
				var tempC = boardC[second];
				boardC[second] = boardC[second - 1];
				boardC[second - 1] = tempC;
				second--;
			}
		}
	}
}

function insertBoardC(element) {
	var index = 0;
	while(index < boardC.length && element.y > boardC[index].y)
	{
		index++;
	}
	boardC.splice(index, 0, element);
/*	var second = boardC.length;
	boardC[second] = element;
	while(second > 0)
	{
		if(boardC[second].y < boardC[second - 1].y)
		{
			var tempC = boardC[second];
			boardC[second] = boardC[second - 1];
			boardC[second - 1] = tempC;
		}
		second--;
	}*/
}

function deleteBoardC(element) {
	for(var index = 0; index < boardC.length; index++)
	{
		if(element == boardC[index])
		{
			boardC.splice(index, 1);
			index = boardC.length;
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
	for(var index = 0; index < currentLevel.layerImg.length; index++)
	{
		//Work out details of smaller-than-screen dimensions
		if(wX < 0) var xDif = Math.abs(wX);
		else var xDif = 0;
		if(wY < 0) var yDif = Math.abs(wY);
		else var yDif = 0;
		//Draw layer based on values found in orientScreen() and altered above
		see.drawImage(currentLevel.layerImg[index], wX + xDif, wY + yDif, SCREENX - 2*xDif, SCREENY - 2*yDif, xDif, yDif, SCREENX - 2*xDif, SCREENY - 2*yDif);

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
		
		//Loop through boardC (to render)
		for(var second = 0; second < boardC.length; second++)
		{
			var cSprite = boardC[second];
			if(cSprite.layer == index) //ensure proper layering
			{
				cSprite.see(see);
				
				//Determine if boardC is lighted
				if(cSprite.isLight)
				{
					lightedThing[lightedThing.length] = cSprite;
				}
				
				cSprite.resetStance();
				cSprite.resetCans();
			}
		}
		see.globalAlpha = 1;
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