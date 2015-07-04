function TRPGNextTurn() //Function run at the end of a character's turn in TRPG mode. Most notably sets cTeam and currentPlayer.
{
	if(currentPlayer >= 0) 
	{
		cTeam[currentPlayer].dir = 3;
		PF.reformUnitsOnSquareWithout(xPixToTile(cTeam[currentPlayer].x), yPixToTile(cTeam[currentPlayer].y), cTeam, 0);
	}
	if(cTeam[currentPlayer] != null)
	{
		delete cTeam[currentPlayer].squares;
		delete cTeam[currentPlayer].target;
	}
	if(currentPlayer < cTeam.length - 1)
	{
		currentPlayer++;
	}
	else if(cTeam[currentPlayer].oppTeam.length != 0)
	{
		cTeam = cTeam[currentPlayer].oppTeam;
		currentPlayer = 0;
		
		if(cTeam == player)
		{
			Time.advance(12*60*60); //in time.js
		}
	}
	else
	{
		resumeFunc = die;
		resumeCue = resumeFunc(2);
		currentPlayer = 0;
	}
	//alert(cTeam[currentPlayer].name + currentPlayer);
	cTeam[currentPlayer].ix = cTeam[currentPlayer].x;
	cTeam[currentPlayer].iy = cTeam[currentPlayer].y;
	
	PF.reformUnitsOnSquareWithout(xPixToTile(cTeam[currentPlayer].x), yPixToTile(cTeam[currentPlayer].y), cTeam, cTeam[currentPlayer]);
	cTeam[currentPlayer].x = xTileToPix(xPixToTile(cTeam[currentPlayer].x));
	cTeam[currentPlayer].y = yTileToPix(yPixToTile(cTeam[currentPlayer].y));
/*	SLVDEngine.process = "wait";
	SLVDEngine.countdown = 8;*/
}

function TRPGNPCMotion() //Function for a single NPC whose turn it is in TRPG mode.
{
	if(boardNPC[currentPlayer].dmnr != 2) //If NPC is non-aggressive (such as one for talking to), just move on to next NPC without moving.
	{
		TRPGNextTurn();
	}
	else
	{
		if(boardNPC[currentPlayer].target == -1) //If no path could be found to a target, end turn.
		{
			TRPGNextTurn();
		}
		else if(boardNPC[currentPlayer].path.x[0] != null) //If path is set up, follow path.
		{
			if(SLVDEngine.counter%4 == 0) { boardNPC[currentPlayer].frame = (boardNPC[currentPlayer].frame + 1)%4; }
			pathMotion(boardNPC[currentPlayer], 8);
		}
		else if(boardNPC[currentPlayer].target == null) //If no target (or -1 as "target"), pathfind (the pathfind function returns a target).
		{
			boardNPC[currentPlayer].target = pathToTeam(boardNPC[currentPlayer], boardNPC[currentPlayer].oppTeam);
		}
		else
		{
			//Turn NPC based on simple relativity. Since N and S are more picturesque for TRPG, those are preferred directions.
			if(boardNPC[currentPlayer].target.y > boardNPC[currentPlayer].y)
			{
				boardNPC[currentPlayer].dir = 3;
			}
			else if(boardNPC[currentPlayer].target.y < boardNPC[currentPlayer].y)
			{
				boardNPC[currentPlayer].dir = 1;
			}
			else if(boardNPC[currentPlayer].target.x > boardNPC[currentPlayer].x)
			{
				boardNPC[currentPlayer].dir = 0;
			}
			else if(boardNPC[currentPlayer].target.x < boardNPC[currentPlayer].x)
			{
				boardNPC[currentPlayer].dir = 2;
			}
			//If in range, attack
			if(Math.sqrt(Math.pow(boardNPC[currentPlayer].target.x - boardNPC[currentPlayer].x, 2) + Math.pow(boardNPC[currentPlayer].target.y - boardNPC[currentPlayer].y, 2)) <= 36 && boardNPC[currentPlayer].act != "slash")
			{
				Action.act.slash(boardNPC[currentPlayer]);
/*				boardNPC[currentPlayer].act = "slash";
				boardNPC[currentPlayer].countdown = 16;*/
			}
			else if(boardNPC[currentPlayer].act != "slash") //If not worth slashing or already slashing (end turn gets handled after slash), end turn
			{
				TRPGNextTurn();
			}
		}
	}
}

function TRPGPlayerMotion() //Function for current player's motion and other key handlings in TRPG mode.
{
	if(player[currentPlayer].squares == null)
	{
		player[currentPlayer].squares = [];
		PF.getSquares(player[currentPlayer]);
		PF.reformUnitsOnSquareWithout(xPixToTile(player[currentPlayer].x), yPixToTile(player[currentPlayer].y), player, player[currentPlayer]);
	}
	if(player[currentPlayer].path.x[0] != null)
	{
		if(SLVDEngine.counter%4 == 0) { player[currentPlayer].frame = (player[currentPlayer].frame + 1)%4; }
		pathMotion(player[currentPlayer], 8);
	}
	else
	{
		if(PF.onSquare(player[currentPlayer]))
		{
		//alert("on square");
			if(SLVDEngine.keyFirstDown == "enter" || SLVDEngine.keyFirstDown == "space") //ENTER and SPACE
			{
/*				alert(NPC[30].x)
				alert(boardNPC[30].x);*/
				for(var index = 0; index < boardNPC.length; index++)
				{
					if(Math.abs(player[currentPlayer].x - boardNPC[index].x) < 20 && Math.abs(player[currentPlayer].y - boardNPC[index].y) < 12 && boardNPC[index].program != null)
					{
						resumeFunc = boardNPC[index].program;
						resumeCue = boardNPC[index].program(0);
					}
				}
			}
			if(SLVDEngine.keyFirstDown == "k" && player[currentPlayer].act == null && player[currentPlayer].inAir == null) //K
			{ 
				//alert("prepare for next turn");
				TRPGNextTurn();
				delete SLVDEngine.keyFirstDown;
				return;
			}
			if(SLVDEngine.keyFirstDown == "i") //I
			{
//				player[currentPlayer].iFunction();
				delete SLVDEngine.keyFirstDown;
			}
			if(SLVDEngine.keyFirstDown == "j") //J
			{
				Action.act.slash(player[currentPlayer]);
/*				player[currentPlayer].act = "slash";
				player[currentPlayer].countdown = 16;*/
				delete SLVDEngine.keyFirstDown;
//				TRPGNextTurn();
			}
			if(SLVDEngine.keyFirstDown == "l") //L
			{
				player[currentPlayer].lFunction();
				delete SLVDEngine.keyFirstDown;
			}
		}
		var dx = 0;
		var dy = 0;
/*		alert(player[currentPlayer].ix);
		alert(player[currentPlayer].x);
		alert(player[currentPlayer].ix - player[currentPlayer].x);
		alert(player[currentPlayer].iy - player[currentPlayer].y);
		alert(Math.abs(player[currentPlayer].ix - player[currentPlayer].x) + Math.abs(player[currentPlayer].iy - player[currentPlayer].y));*/

		//alert("still in range");
		if(SLVDEngine.keyDown[37] == 1 || SLVDEngine.keyDown[65] == 1) //West
		{
			dx = -32;
			player[currentPlayer].dir = 2;
		}
		else if(SLVDEngine.keyDown[38] == 1 || SLVDEngine.keyDown[87] == 1) //North
		{
			dy = -32;
			player[currentPlayer].dir = 1;
		}
		else if(SLVDEngine.keyDown[39] == 1 || SLVDEngine.keyDown[68] == 1) //East
		{
			dx = 32;
			player[currentPlayer].dir = 0;
		}
		else if(SLVDEngine.keyDown[40] == 1 || SLVDEngine.keyDown[83] == 1) //South
		{
			dy = 32;
			player[currentPlayer].dir = 3;
		}
		////If not traveling too far and not traveling out of bounds.
		//If target square is one of predetermined squares
//		if(/*Math.abs(player[currentPlayer].ix - (player[currentPlayer].x + dx)) + Math.abs(player[currentPlayer].iy - (player[currentPlayer].y + dy)) <= 32*player[currentPlayer].spd && player[currentPlayer].x + dx >= 0 && player[currentPlayer].y + dy >= 0 && player[currentPlayer].x + dx < currentLevel.layerImg[player[currentPlayer].layer].width && player[currentPlayer].y + dy < currentLevel.layerImg[player[currentPlayer].layer].height*/)
		if(PF.isSquare(player[currentPlayer].x + dx, player[currentPlayer].y + dy, player[currentPlayer]))
		{
			//alert("ds done");
			if(dx != 0 || dy != 0)
			{
				var toIndex = pixCoordToIndex(xPixToTile(player[currentPlayer].x + dx), yPixToTile(player[currentPlayer].y + dy), currentLevel.layerFuncData[player[currentPlayer].layer]);
				var squareType = currentLevel.layerFuncData[player[currentPlayer].layer].data[toIndex];
//				var blocked = 0;
				if(squareType != 255)
				{
/*					for(var second = 0; second < boardNPC.length; second++)
					{
						if(boardNPC[second].x == player[currentPlayer].x + dx && boardNPC[second].y == player[currentPlayer].y + dy)
						{
							blocked = 1;
						}
					}
					if(blocked != 1)
					{*/
						if(player[currentPlayer].frame == 0) { player[currentPlayer].frame = 1; }
						player[currentPlayer].path.x[0] = player[currentPlayer].x + dx;
						player[currentPlayer].path.y[0] = player[currentPlayer].y + dy;
						if(squareType == 100)
						{
							resumeFunc = currentLevel.boardProgram[currentLevel.layerFuncData[player[currentPlayer].layer].data[toIndex + 2]];
							resumeCue = 1;
						}
//					}
				}
			}
			else { player[currentPlayer].frame = 0; }
		}
		//else alert("out of range");
		//Projectile motion
		if(player[currentPlayer].dart.img != null && player[currentPlayer].dart.layer != null)
		{
			//Move projectile
			var moved = zeldaStep(player[currentPlayer].dart, player[currentPlayer].dart.spd);
			for(var index = 0; index < boardNPC.length; index++)
			{
				if((Math.abs(player[currentPlayer].dart.y - (boardNPC[index].y - 24)) < 32) && (Math.abs(player[currentPlayer].dart.x - boardNPC[index].x) < 16))
				{
					damage(player[currentPlayer].dart, boardNPC[index]); //damage hit opponent
					player[currentPlayer].dart.layer = null; //remove image
					player[currentPlayer].dart.frame = 0; //reset frame
					boardNPC[index].status = "hurt"; //"hurt" opponent
					boardNPC[index].countdown = 4; //"hurt" blinks
					index = boardNPC.length; //break out of loop
					TRPGNextTurn();
				}
			}
			//If hit terrain
			if(player[currentPlayer].dart.layer != null && moved == -1)
			{
				player[currentPlayer].dart.layer = null;
				player[currentPlayer].dart.frame = 0;
				TRPGNextTurn();

			}
			//Update frame
			if(frameClock == 1)
			{
				player[currentPlayer].dart.frame = (player[currentPlayer].dart.frame + 1)%4;
			}
		}
	}
}