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
					SLVDEngine.damage(SLVDEngine.player[SLVDEngine.currentPlayer].dart, boardNPC[index]); //SLVDEngine.damage hit opponent
					SLVDEngine.player[SLVDEngine.currentPlayer].dart.layer = null; //remove SLVDEngine.image
					SLVDEngine.player[SLVDEngine.currentPlayer].dart.frame = 0; //reset frame
					boardNPC[index].status = "hurt"; //"hurt" opponent
					boardNPC[index].countdown = 4; //"hurt" blinks
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