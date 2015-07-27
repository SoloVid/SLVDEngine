			/*SLVDEngine.orientScreen();
			for(var index = 0; index < SLVDEngine.currentLevel.layerImg.length; index++)
			{
				//Draw layer
				SLVDEngine.see.drawImage(SLVDEngine.currentLevel.layerImg[index], SLVDEngine.wX, SLVDEngine.wY, SLVDEngine.SCREENX, SLVDEngine.SCREENY, 0, 0, SLVDEngine.SCREENX, SLVDEngine.SCREENY);
				//Draw blue range squares
				if(index == SLVDEngine.cTeam[SLVDEngine.currentPlayer].layer && SLVDEngine.cTeam[SLVDEngine.currentPlayer].squares != null)
				{
					for(var second = 0; second < SLVDEngine.cTeam[SLVDEngine.currentPlayer].squares.length; second++)
					{
						SLVDEngine.see.drawImage(SLVDEngine.image["blueSquare.png"], 0, 0, 32, 32, SLVDEngine.cTeam[SLVDEngine.currentPlayer].squares[second].x*32 - SLVDEngine.wX, SLVDEngine.cTeam[SLVDEngine.currentPlayer].squares[second].y*32 - SLVDEngine.wY, 32, 32);
					}
				}
				for(var second = 0; second < SLVDEngine.boardSprite.length; second++)
				{
					if(SLVDEngine.boardSprite[second].act == "slash") 
					{ 
						//If done slashing, move on.
						if(SLVDEngine.boardSprite[second].SLVDEngine.countdown <= 0)
						{
							SLVDEngine.boardSprite[second].act = null;
							SLVDEngine.TRPGNextTurn();
						}
						else
						{
							//Cycle through opponents
							for(var third = 0; third < SLVDEngine.boardSprite[second].oppTeam.length; third++)
							{
								//If distance < 40
								//if(Math.sqrt(Math.pow(SLVDEngine.boardSprite[second].oppTeam[third].x - SLVDEngine.boardSprite[second].x, 2) + Math.pow(SLVDEngine.boardSprite[second].oppTeam[third].y - SLVDEngine.boardSprite[second].y, 2)) <= 36)
								//If one tile away
								if(Math.pow(SLVDEngine.xPixToTile(SLVDEngine.boardSprite[second].oppTeam[third].x) - SLVDEngine.xPixToTile(SLVDEngine.boardSprite[second].x), 2) + Math.pow(SLVDEngine.yPixToTile(SLVDEngine.boardSprite[second].oppTeam[third].y) - SLVDEngine.yPixToTile(SLVDEngine.boardSprite[second].y), 2) == 1)
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
										SLVDEngine.damage(SLVDEngine.boardSprite[second], SLVDEngine.boardSprite[second].oppTeam[third]);
										SLVDEngine.boardSprite[second].oppTeam[third].status = "hurt";
										SLVDEngine.boardSprite[second].oppTeam[third].SLVDEngine.countdown = 4;
									}
								}
							}
							SLVDEngine.see.lineWidth = 8;
							SLVDEngine.see.beginPath();
							SLVDEngine.see.arc((SLVDEngine.boardSprite[second].x - ((SLVDEngine.boardSprite[second].xres)/2)) - SLVDEngine.wX + 24, (SLVDEngine.boardSprite[second].y - (SLVDEngine.boardSprite[second].yres)) - SLVDEngine.wY + 56, 32, .5*((3 - SLVDEngine.boardSprite[second].dir) - .5 + (SLVDEngine.boardSprite[second].SLVDEngine.countdown/8))*Math.PI, .5*((3 - SLVDEngine.boardSprite[second].dir) + .5 + (SLVDEngine.boardSprite[second].SLVDEngine.countdown/8))*Math.PI);
							SLVDEngine.see.strokeStyle = "white";
							SLVDEngine.see.stroke();
							SLVDEngine.boardSprite[second].SLVDEngine.countdown--;
							if(SLVDEngine.boardSprite[second].SLVDEngine.countdown < 0)
							{
								SLVDEngine.boardSprite[second].SLVDEngine.countdown = 0;
							}
						}
					}
					if(SLVDEngine.boardSprite[second].layer == index)
					{
						if((SLVDEngine.boardSprite[second].status == "hurt" && SLVDEngine.frameClock != 1) || SLVDEngine.boardSprite[second].status != "hurt")
						{
							var col = SLVDEngine.determineColumn(SLVDEngine.boardSprite[second].dir);
							SLVDEngine.see.drawImage(SLVDEngine.boardSprite[second].img, 32*col, 64*SLVDEngine.boardSprite[second].frame, SLVDEngine.boardSprite[second].xres, SLVDEngine.boardSprite[second].yres, (SLVDEngine.boardSprite[second].x - (((SLVDEngine.boardSprite[second].xres)/2) - 8)) - SLVDEngine.wX, (SLVDEngine.boardSprite[second].y - (SLVDEngine.boardSprite[second].yres - 8)) - SLVDEngine.wY, SLVDEngine.boardSprite[second].xres, SLVDEngine.boardSprite[second].yres);
							if(SLVDEngine.boardSprite[second].holding != null && Math.round(SLVDEngine.boardSprite[second].dir) != 1)
							{
								SLVDEngine.see.drawImage(SLVDEngine.boardSprite[second].holding, (SLVDEngine.boardSprite[second].holding.width/4)*col, 0, (SLVDEngine.boardSprite[second].holding.width/4), 32, (SLVDEngine.boardSprite[second].x - (((SLVDEngine.boardSprite[second].xres)/2) - 8)) - SLVDEngine.wX + 16*Math.round(Math.cos(SLVDEngine.boardSprite[second].dir*Math.PI/2)), (SLVDEngine.boardSprite[second].y - (SLVDEngine.boardSprite[second].yres - 18)) - SLVDEngine.wY - 5*Math.round(Math.sin(SLVDEngine.boardSprite[second].dir*Math.PI/2)), 32, 32);	
							}
						}
						if(SLVDEngine.boardSprite[second].status == "hurt" && SLVDEngine.frameClock == 1)
						{
								SLVDEngine.boardSprite[second].SLVDEngine.countdown--;
								if(SLVDEngine.boardSprite[second].SLVDEngine.countdown <= 0) 
								{
									SLVDEngine.boardSprite[second].status = null;
								}
						}
					}
					if(SLVDEngine.boardSprite[second].dart.layer == index)
					{
						var col = SLVDEngine.determineColumn(SLVDEngine.boardSprite[second].dart.dir);
						SLVDEngine.see.drawImage(SLVDEngine.boardSprite[second].dart.img, SLVDEngine.boardSprite[second].dart.xres*col, SLVDEngine.boardSprite[second].dart.yres*SLVDEngine.boardSprite[second].dart.frame, SLVDEngine.boardSprite[second].dart.xres, SLVDEngine.boardSprite[second].dart.yres, SLVDEngine.boardSprite[second].dart.x - SLVDEngine.wX, SLVDEngine.boardSprite[second].dart.y - SLVDEngine.wY, SLVDEngine.boardSprite[second].dart.xres, SLVDEngine.boardSprite[second].dart.yres);
					}
				}
			}
			//Weather
			SLVDEngine.see.fillStyle = "rgba(0, 0, 0, " + shade + ")";
			SLVDEngine.see.fillRect(0, 0, SLVDEngine.SCREENX, SLVDEngine.SCREENY);
			if(rainy)
			{
				SLVDEngine.see.drawImage(SLVDEngine.image["rain.png"], -((SLVDEngine.counter%100)/100)*SLVDEngine.SCREENX, ((SLVDEngine.counter%25)/25)*SLVDEngine.SCREENY - SLVDEngine.SCREENY);
				if(SLVDEngine.counter%8 == SLVD.randomInt(12))
				{
					for(var index = 0; index < SLVD.randomInt(3); index++)
					{
						SLVDEngine.see.drawImage(SLVDEngine.image["lightning.png"], 0, 0);
					}
				}
			}
			if(cloudy) SLVDEngine.see.drawImage(SLVDEngine.image["stormClouds.png"], SLVDEngine.counter%1280 - 1280, 0);
			//document.getElementById("info").innerHTML = SLVDEngine.player[0].dir + ", " + SLVDEngine.player[0].x + ", " + SLVDEngine.player[0].y + ", " + dKeys
			SLVDEngine.see.fillStyle="#FFFFFF";
			SLVDEngine.see.font="12px Verdana";
			SLVDEngine.see.fillText(SLVDEngine.cTeam[SLVDEngine.currentPlayer].name + ": " + SLVDEngine.cTeam[SLVDEngine.currentPlayer].hp + " HP | " + SLVDEngine.cTeam[SLVDEngine.currentPlayer].strg + " Strength | " + SLVDEngine.cTeam[SLVDEngine.currentPlayer].spd + " Speed", 10, 20);
			*/

SLVDEngine.TRPGNextTurn = function() //Function run at the end of a character's turn in TRPG mode. Most notably sets SLVDEngine.cTeam and SLVDEngine.currentPlayer.
{
	if(SLVDEngine.currentPlayer >= 0) 
	{
		SLVDEngine.cTeam[SLVDEngine.currentPlayer].dir = 3;
		SLVDEngine.PF.reformUnitsOnSquareWithout(SLVDEngine.xPixToTile(SLVDEngine.cTeam[SLVDEngine.currentPlayer].x), SLVDEngine.yPixToTile(SLVDEngine.cTeam[SLVDEngine.currentPlayer].y), SLVDEngine.cTeam, 0);
	}
	if(SLVDEngine.cTeam[SLVDEngine.currentPlayer] != null)
	{
		delete SLVDEngine.cTeam[SLVDEngine.currentPlayer].squares;
		delete SLVDEngine.cTeam[SLVDEngine.currentPlayer].target;
	}
	if(SLVDEngine.currentPlayer < SLVDEngine.cTeam.length - 1)
	{
		SLVDEngine.currentPlayer++;
	}
	else if(SLVDEngine.cTeam[SLVDEngine.currentPlayer].oppTeam.length != 0)
	{
		SLVDEngine.cTeam = SLVDEngine.cTeam[SLVDEngine.currentPlayer].oppTeam;
		SLVDEngine.currentPlayer = 0;
		
		if(SLVDEngine.cTeam == SLVDEngine.player)
		{
			SLVDEngine.Time.advance(12*60*60); //in time.js
		}
	}
	else
	{
		resumeFunc = die;
		resumeCue = resumeFunc(2);
		SLVDEngine.currentPlayer = 0;
	}
	//alert(SLVDEngine.cTeam[SLVDEngine.currentPlayer].name + SLVDEngine.currentPlayer);
	SLVDEngine.cTeam[SLVDEngine.currentPlayer].ix = SLVDEngine.cTeam[SLVDEngine.currentPlayer].x;
	SLVDEngine.cTeam[SLVDEngine.currentPlayer].iy = SLVDEngine.cTeam[SLVDEngine.currentPlayer].y;
	
	SLVDEngine.PF.reformUnitsOnSquareWithout(SLVDEngine.xPixToTile(SLVDEngine.cTeam[SLVDEngine.currentPlayer].x), SLVDEngine.yPixToTile(SLVDEngine.cTeam[SLVDEngine.currentPlayer].y), SLVDEngine.cTeam, SLVDEngine.cTeam[SLVDEngine.currentPlayer]);
	SLVDEngine.cTeam[SLVDEngine.currentPlayer].x = SLVDEngine.xTileToPix(SLVDEngine.xPixToTile(SLVDEngine.cTeam[SLVDEngine.currentPlayer].x));
	SLVDEngine.cTeam[SLVDEngine.currentPlayer].y = SLVDEngine.yTileToPix(SLVDEngine.yPixToTile(SLVDEngine.cTeam[SLVDEngine.currentPlayer].y));
/*	SLVDEngine.process = "wait";
	SLVDEngine.countdown = 8;*/
};

SLVDEngine.TRPGNPCMotion = function() //Function for a single SLVDEngine.NPC whose turn it is in TRPG mode.
{
	if(boardNPC[SLVDEngine.currentPlayer].dmnr != 2) //If SLVDEngine.NPC is non-aggressive (such as one for talking to), just move on to next SLVDEngine.NPC without moving.
	{
		SLVDEngine.TRPGNextTurn();
	}
	else
	{
		if(boardNPC[SLVDEngine.currentPlayer].target == -1) //If no path could be found to a target, end turn.
		{
			SLVDEngine.TRPGNextTurn();
		}
		else if(boardNPC[SLVDEngine.currentPlayer].path.x[0] != null) //If path is set up, follow path.
		{
			if(SLVDEngine.counter%4 == 0) { boardNPC[SLVDEngine.currentPlayer].frame = (boardNPC[SLVDEngine.currentPlayer].frame + 1)%4; }
			pathMotion(boardNPC[SLVDEngine.currentPlayer], 8);
		}
		else if(boardNPC[SLVDEngine.currentPlayer].target == null) //If no target (or -1 as "target"), pathfind (the pathfind function returns a target).
		{
			boardNPC[SLVDEngine.currentPlayer].target = SLVDEngine.pathToTeam(boardNPC[SLVDEngine.currentPlayer], boardNPC[SLVDEngine.currentPlayer].oppTeam);
		}
		else
		{
			//Turn SLVDEngine.NPC based on simple relativity. Since N and S are more picturesque for TRPG, those are preferred directions.
			if(boardNPC[SLVDEngine.currentPlayer].target.y > boardNPC[SLVDEngine.currentPlayer].y)
			{
				boardNPC[SLVDEngine.currentPlayer].dir = 3;
			}
			else if(boardNPC[SLVDEngine.currentPlayer].target.y < boardNPC[SLVDEngine.currentPlayer].y)
			{
				boardNPC[SLVDEngine.currentPlayer].dir = 1;
			}
			else if(boardNPC[SLVDEngine.currentPlayer].target.x > boardNPC[SLVDEngine.currentPlayer].x)
			{
				boardNPC[SLVDEngine.currentPlayer].dir = 0;
			}
			else if(boardNPC[SLVDEngine.currentPlayer].target.x < boardNPC[SLVDEngine.currentPlayer].x)
			{
				boardNPC[SLVDEngine.currentPlayer].dir = 2;
			}
			//If in range, attack
			if(Math.sqrt(Math.pow(boardNPC[SLVDEngine.currentPlayer].target.x - boardNPC[SLVDEngine.currentPlayer].x, 2) + Math.pow(boardNPC[SLVDEngine.currentPlayer].target.y - boardNPC[SLVDEngine.currentPlayer].y, 2)) <= 36 && boardNPC[SLVDEngine.currentPlayer].act != "slash")
			{
				SLVDEngine.Action.act.slash(boardNPC[SLVDEngine.currentPlayer]);
/*				boardNPC[SLVDEngine.currentPlayer].act = "slash";
				boardNPC[SLVDEngine.currentPlayer].SLVDEngine.countdown = 16;*/
			}
			else if(boardNPC[SLVDEngine.currentPlayer].act != "slash") //If not worth slashing or already slashing (end turn gets handled after slash), end turn
			{
				SLVDEngine.TRPGNextTurn();
			}
		}
	}
};

SLVDEngine.TRPGPlayerMotion = function() //Function for current SLVDEngine.player's motion and other key handlings in TRPG mode.
{
	if(SLVDEngine.player[SLVDEngine.currentPlayer].squares == null)
	{
		SLVDEngine.player[SLVDEngine.currentPlayer].squares = [];
		SLVDEngine.PF.getSquares(SLVDEngine.player[SLVDEngine.currentPlayer]);
		SLVDEngine.PF.reformUnitsOnSquareWithout(SLVDEngine.xPixToTile(SLVDEngine.player[SLVDEngine.currentPlayer].x), SLVDEngine.yPixToTile(SLVDEngine.player[SLVDEngine.currentPlayer].y), SLVDEngine.player, SLVDEngine.player[SLVDEngine.currentPlayer]);
	}
	if(SLVDEngine.player[SLVDEngine.currentPlayer].path.x[0] != null)
	{
		if(SLVDEngine.counter%4 == 0) { SLVDEngine.player[SLVDEngine.currentPlayer].frame = (SLVDEngine.player[SLVDEngine.currentPlayer].frame + 1)%4; }
		pathMotion(SLVDEngine.player[SLVDEngine.currentPlayer], 8);
	}
	else
	{
		if(SLVDEngine.PF.onSquare(SLVDEngine.player[SLVDEngine.currentPlayer]))
		{
		//alert("on square");
			if(SLVDEngine.keyFirstDown == "enter" || SLVDEngine.keyFirstDown == "space") //ENTER and SPACE
			{
/*				alert(SLVDEngine.NPC[30].x)
				alert(boardNPC[30].x);*/
				for(var index = 0; index < boardNPC.length; index++)
				{
					if(Math.abs(SLVDEngine.player[SLVDEngine.currentPlayer].x - boardNPC[index].x) < 20 && Math.abs(SLVDEngine.player[SLVDEngine.currentPlayer].y - boardNPC[index].y) < 12 && boardNPC[index].program != null)
					{
						resumeFunc = boardNPC[index].program;
						resumeCue = boardNPC[index].program(0);
					}
				}
			}
			if(SLVDEngine.keyFirstDown == "k" && SLVDEngine.player[SLVDEngine.currentPlayer].act == null && SLVDEngine.player[SLVDEngine.currentPlayer].inAir == null) //K
			{ 
				//alert("prepare for next turn");
				SLVDEngine.TRPGNextTurn();
				delete SLVDEngine.keyFirstDown;
				return;
			}
			if(SLVDEngine.keyFirstDown == "i") //I
			{
//				SLVDEngine.player[SLVDEngine.currentPlayer].iFunction();
				delete SLVDEngine.keyFirstDown;
			}
			if(SLVDEngine.keyFirstDown == "j") //J
			{
				SLVDEngine.Action.act.slash(SLVDEngine.player[SLVDEngine.currentPlayer]);
/*				SLVDEngine.player[SLVDEngine.currentPlayer].act = "slash";
				SLVDEngine.player[SLVDEngine.currentPlayer].SLVDEngine.countdown = 16;*/
				delete SLVDEngine.keyFirstDown;
//				SLVDEngine.TRPGNextTurn();
			}
			if(SLVDEngine.keyFirstDown == "l") //L
			{
				SLVDEngine.player[SLVDEngine.currentPlayer].lFunction();
				delete SLVDEngine.keyFirstDown;
			}
		}
		var dx = 0;
		var dy = 0;
/*		alert(SLVDEngine.player[SLVDEngine.currentPlayer].ix);
		alert(SLVDEngine.player[SLVDEngine.currentPlayer].x);
		alert(SLVDEngine.player[SLVDEngine.currentPlayer].ix - SLVDEngine.player[SLVDEngine.currentPlayer].x);
		alert(SLVDEngine.player[SLVDEngine.currentPlayer].iy - SLVDEngine.player[SLVDEngine.currentPlayer].y);
		alert(Math.abs(SLVDEngine.player[SLVDEngine.currentPlayer].ix - SLVDEngine.player[SLVDEngine.currentPlayer].x) + Math.abs(SLVDEngine.player[SLVDEngine.currentPlayer].iy - SLVDEngine.player[SLVDEngine.currentPlayer].y));*/

		//alert("still in range");
		if(SLVDEngine.keyDown[37] == 1 || SLVDEngine.keyDown[65] == 1) //West
		{
			dx = -32;
			SLVDEngine.player[SLVDEngine.currentPlayer].dir = 2;
		}
		else if(SLVDEngine.keyDown[38] == 1 || SLVDEngine.keyDown[87] == 1) //North
		{
			dy = -32;
			SLVDEngine.player[SLVDEngine.currentPlayer].dir = 1;
		}
		else if(SLVDEngine.keyDown[39] == 1 || SLVDEngine.keyDown[68] == 1) //East
		{
			dx = 32;
			SLVDEngine.player[SLVDEngine.currentPlayer].dir = 0;
		}
		else if(SLVDEngine.keyDown[40] == 1 || SLVDEngine.keyDown[83] == 1) //South
		{
			dy = 32;
			SLVDEngine.player[SLVDEngine.currentPlayer].dir = 3;
		}
		////If not traveling too far and not traveling out of bounds.
		//If target square is one of predetermined squares
//		if(/*Math.abs(SLVDEngine.player[SLVDEngine.currentPlayer].ix - (SLVDEngine.player[SLVDEngine.currentPlayer].x + dx)) + Math.abs(SLVDEngine.player[SLVDEngine.currentPlayer].iy - (SLVDEngine.player[SLVDEngine.currentPlayer].y + dy)) <= 32*SLVDEngine.player[SLVDEngine.currentPlayer].spd && SLVDEngine.player[SLVDEngine.currentPlayer].x + dx >= 0 && SLVDEngine.player[SLVDEngine.currentPlayer].y + dy >= 0 && SLVDEngine.player[SLVDEngine.currentPlayer].x + dx < SLVDEngine.currentLevel.layerImg[SLVDEngine.player[SLVDEngine.currentPlayer].layer].width && SLVDEngine.player[SLVDEngine.currentPlayer].y + dy < SLVDEngine.currentLevel.layerImg[SLVDEngine.player[SLVDEngine.currentPlayer].layer].height*/)
		if(SLVDEngine.PF.isSquare(SLVDEngine.player[SLVDEngine.currentPlayer].x + dx, SLVDEngine.player[SLVDEngine.currentPlayer].y + dy, SLVDEngine.player[SLVDEngine.currentPlayer]))
		{
			//alert("ds done");
			if(dx != 0 || dy != 0)
			{
				var toIndex = SLVDEngine.pixCoordToIndex(SLVDEngine.xPixToTile(SLVDEngine.player[SLVDEngine.currentPlayer].x + dx), SLVDEngine.yPixToTile(SLVDEngine.player[SLVDEngine.currentPlayer].y + dy), SLVDEngine.currentLevel.layerFuncData[SLVDEngine.player[SLVDEngine.currentPlayer].layer]);
				var squareType = SLVDEngine.currentLevel.layerFuncData[SLVDEngine.player[SLVDEngine.currentPlayer].layer].data[toIndex];
//				var blocked = 0;
				if(squareType != 255)
				{
/*					for(var second = 0; second < boardNPC.length; second++)
					{
						if(boardNPC[second].x == SLVDEngine.player[SLVDEngine.currentPlayer].x + dx && boardNPC[second].y == SLVDEngine.player[SLVDEngine.currentPlayer].y + dy)
						{
							blocked = 1;
						}
					}
					if(blocked != 1)
					{*/
						if(SLVDEngine.player[SLVDEngine.currentPlayer].frame == 0) { SLVDEngine.player[SLVDEngine.currentPlayer].frame = 1; }
						SLVDEngine.player[SLVDEngine.currentPlayer].path.x[0] = SLVDEngine.player[SLVDEngine.currentPlayer].x + dx;
						SLVDEngine.player[SLVDEngine.currentPlayer].path.y[0] = SLVDEngine.player[SLVDEngine.currentPlayer].y + dy;
						if(squareType == 100)
						{
							resumeFunc = SLVDEngine.currentLevel.boardProgram[SLVDEngine.currentLevel.layerFuncData[SLVDEngine.player[SLVDEngine.currentPlayer].layer].data[toIndex + 2]];
							resumeCue = 1;
						}
//					}
				}
			}
			else { SLVDEngine.player[SLVDEngine.currentPlayer].frame = 0; }
		}
		//else alert("out of range");
		//Projectile motion
		if(SLVDEngine.player[SLVDEngine.currentPlayer].dart.img != null && SLVDEngine.player[SLVDEngine.currentPlayer].dart.layer != null)
		{
			//Move projectile
			var moved = zeldaStep(SLVDEngine.player[SLVDEngine.currentPlayer].dart, SLVDEngine.player[SLVDEngine.currentPlayer].dart.spd);
			for(var index = 0; index < boardNPC.length; index++)
			{
				if((Math.abs(SLVDEngine.player[SLVDEngine.currentPlayer].dart.y - (boardNPC[index].y - 24)) < 32) && (Math.abs(SLVDEngine.player[SLVDEngine.currentPlayer].dart.x - boardNPC[index].x) < 16))
				{
					SLVDEngine.damage(SLVDEngine.player[SLVDEngine.currentPlayer].dart, boardNPC[index]); //damage hit opponent
					SLVDEngine.player[SLVDEngine.currentPlayer].dart.layer = null; //remove SLVDEngine.image
					SLVDEngine.player[SLVDEngine.currentPlayer].dart.frame = 0; //reset frame
					boardNPC[index].status = "hurt"; //"hurt" opponent
					boardNPC[index].SLVDEngine.countdown = 4; //"hurt" blinks
					index = boardNPC.length; //break out of loop
					SLVDEngine.TRPGNextTurn();
				}
			}
			//If hit terrain
			if(SLVDEngine.player[SLVDEngine.currentPlayer].dart.layer != null && moved == -1)
			{
				SLVDEngine.player[SLVDEngine.currentPlayer].dart.layer = null;
				SLVDEngine.player[SLVDEngine.currentPlayer].dart.frame = 0;
				SLVDEngine.TRPGNextTurn();

			}
			//Update frame
			if(SLVDEngine.frameClock == 1)
			{
				SLVDEngine.player[SLVDEngine.currentPlayer].dart.frame = (SLVDEngine.player[SLVDEngine.currentPlayer].dart.frame + 1)%4;
			}
		}
	}
};