function zeldaNPCMotion() //Function for all board NPC's movement in Zelda mode.
{
	if(process != "zelda")
	{
		return -1;
	}
	for(var index = 0; index < boardNPC.length; index++)
	{
		//Facilitate death
		while(index < boardNPC.length && boardNPC[index].hp <= 0)
		{
			boardNPC[index].lvl = null;//"dead";
			deleteBoardC(boardNPC[index]);
			boardNPC.splice(index, 1);
//			console.log("boardNPC " + index + " removed. Array now " + boardNPC);
		}
				
		//If at invalid index (bc death ran to end of boardNPC array), don't continue
		if(index >= boardNPC.length) return;
/*		else if(boardNPC[index].status == "stunned")
		{
			boardNPC[index].statusCountdown--;
			if(boardNPC[index].statusCountdown <= 0)
			{
				delete boardNPC[index].status;
			}
		}*/
		else
		{
			var cNPC = boardNPC[index];
			/*if(cNPC.statusCountdown > 0)
			{
				cNPC.statusCountdown--;
				if(cNPC.statusCountdown <= 0)
				{
					delete cNPC.status;
				}
			}*/
		
			var dist = Math.sqrt(Math.pow(boardNPC[index].x - player[currentPlayer].x, 2) + Math.pow(boardNPC[index].y - player[currentPlayer].y, 2));
			if(dist > 800) { } //If totally beyond screen, don't handle
			else if(boardNPC[index].path.x[0] != null) //Handle path motion
			{
				boardNPC[index].updateFrame();
				pathMotion(boardNPC[index], boardNPC[index].spd);
			}
			else
			{
				Status.handle(cNPC); //in status.js
				Action.handle(cNPC); //in action.js
				Motion.handle(cNPC); //in motion.js
				
/*				if(boardNPC[index].rcvr > 0) //Recovering
				{
					boardNPC[index].rcvr--;
				}
				else if(boardNPC[index].act == null) //Ready for new action
				{
					Action.use(boardNPC[index]); //in action.js
				}
				else //Continue action
				{
					Action.update(boardNPC[index]); //in action.js
				}
				
				//Facillitate motion
				Motion.use(boardNPC[index]); //in motion.js*/
			}
			
/*			else if(boardNPC[index].mvmt != 0 && boardNPC[index].path.x[0] == null) //If mover and no path
			{
				if(dist < 256 && boardNPC[index].dmnr == 2 && boardNPC[index].layer == player[currentPlayer].layer)
				{
					var tDirection = boardNPC[index].dir;
					zeldaLockOnPlayer(boardNPC[index]);
					if(Math.abs(tDirection - boardNPC[index].dir) < 1 || Math.abs(tDirection - boardNPC[index].dir) > 3)
					{
						updateFrame(boardNPC[index]);
						if(boardNPC[index].act != "slash") zeldaStep(boardNPC[index], boardNPC[index].spd);
						boardNPC[index].steps = 0;
						if(boardNPC[index].dart.img != null && boardNPC[index].rcvr == 0)
						{
							if(boardNPC[index].dart.layer == null)
							{
								boardNPC[index].dart.x = boardNPC[index].x;
								boardNPC[index].dart.y = boardNPC[index].y - 24;
								boardNPC[index].dart.layer = boardNPC[index].layer;
								boardNPC[index].dart.dir = Math.round(boardNPC[index].dir);
							}
						}	
						else if(dist < 20 && boardNPC[index].rcvr == 0 && boardNPC[index].act != "slash")
						{
							Action.act.slash(boardNPC[index]);
						}
						else if(boardNPC[index].rcvr != 0)
						{
							boardNPC[index].rcvr--;
							if(boardNPC[index].rcvr < 0)
							{
								boardNPC[index].rcvr = 0;
							}
						}
						var skip = 1;
					}
					else
					{
						boardNPC[index].dir = tDirection;
						var skip = null;
					}
				}
				else var skip = null;
				if(skip != 1)
				{
					if(boardNPC[index].steps != 0)
					{
						updateFrame(boardNPC[index]);
						zeldaStep(boardNPC[index], boardNPC[index].spd);
						boardNPC[index].steps--;
						if(boardNPC[index].steps == 0)
						{
							boardNPC[index].wait = randomInt(4) + 28;
						}
					}
					else if(boardNPC[index].wait != 0 && boardNPC[index].wait != null)
					{
						boardNPC[index].wait--;
						boardNPC[index].frame = 0;
					}
					else if(boardNPC[index].steps == 0)
					{
						if(boardNPC[index].mvmt == 1) //Random
						{
							boardNPC[index].dir = randomInt(4) - 1;
							boardNPC[index].steps = randomInt(16) + 16;
						}
						else if(boardNPC[index].mvmt == 2) //Back and forth
						{
							boardNPC[index].dir = Math.round((boardNPC[index].dir + 2)%4);
							boardNPC[index].steps = 64;
						}
						else if(boardNPC[index].mvmt == 4) //Square
						{
							boardNPC[index].dir = Math.round((boardNPC[index].dir + 1)%4);
							boardNPC[index].steps = 64;
						}
					}
				}
			}
			else if(boardNPC[index].path.x[0] != null) //If path
			{
				if(frameClock == 1)
				{
					boardNPC[index].frame = (boardNPC[index].frame + 1)%4;
				}
				pathMotion(boardNPC[index], boardNPC[index].spd);
			}
			else if(boardNPC[index].mvmt == 0) //If stationary
			{
				zeldaLockOnPlayer(boardNPC[index]);
				if(boardNPC[index].dmnr == 2)
				{
					if(boardNPC[index].dart.img != null && dist < 256 && boardNPC[index].rcvr == 0)
					{
						if((boardNPC[index].dart.layer == null || Math.abs(boardNPC[index].dart.x - boardNPC[index].x) > 700 || Math.abs(boardNPC[index].dart.y - boardNPC[index].y) > 500) && boardNPC[index].rcvr == 0)
						{
							boardNPC[index].dart.x = boardNPC[index].x;
							boardNPC[index].dart.y = boardNPC[index].y - 24;
							boardNPC[index].dart.layer = boardNPC[index].layer;
							boardNPC[index].dart.dir = Math.round(boardNPC[index].dir);
							boardNPC[index].rcvr = 16 - boardNPC[index].spd;
							
							insertBoardC(boardNPC[index].dart);
						}
					}
					if(dist < 20 && boardNPC[index].rcvr == 0 && boardNPC[index].act != "slash")
					{
						Action.act.slash(boardNPC[index]);
					}
					else if(boardNPC[index].rcvr != 0)
					{
						boardNPC[index].rcvr--;
						if(boardNPC[index].rcvr < 0)
						{
							boardNPC[index].rcvr = 0;
						}
					}
				}
			}*/
		}
		//Move projectile
		if(index < boardNPC.length && boardNPC[index].dart.img != null && boardNPC[index].dart.layer != null)
		{
			var moved = zeldaStep(boardNPC[index].dart, boardNPC[index].dart.spd);
			for(var second = 0; second < player.length; second++)
			{
				if((Math.abs(boardNPC[index].dart.y - (player[second].y - 24)) < 32) && (Math.abs(boardNPC[index].dart.x - player[second].x) < 16))
				{
					damage(boardNPC[index].dart, player[second]); //damage hit opponent
					boardNPC[index].dart.layer = null; //remove image
					boardNPC[index].dart.frame = 0; //reset frame
					deleteBoardC(boardNPC[index].dart);
					player[second].status = "hurt"; //"hurt" opponent
					player[second].statusCountdown = 4; //"hurt" blinks
					second = player.length; //break out of loop
				}
			}
			//If hit terrain
			if(moved == -1)
			{
				boardNPC[index].dart.layer = null;
				boardNPC[index].dart.frame = 0;
				deleteBoardC(boardNPC[index].dart);
			}
		}
	}
}

function zeldaPlayerMotion() //Function for current player's motion and other key handlings in Zelda mode.
{
	if(keyFirstDown[13] == 1 || keyFirstDown[32] == 1) //ENTER and SPACE
	{
		for(var index = 0; index < boardC.length; index++) //Future: change these boardNPCs to boardCs
		{
			if(Math.abs(player[currentPlayer].x - boardC[index].x) < 20 && Math.abs(player[currentPlayer].y - boardC[index].y) < 12 && boardC[index].program != null)
			{
				resumeFunc = boardC[index].program;
				resumeCue = boardC[index].program(0);
			}
		}
	}
	if(keyFirstDown[75] == 1 && player[currentPlayer].act == null && player[currentPlayer].inAir == null) //K
	{ 
		delete player[currentPlayer].pet;
		var prevPlayer = currentPlayer;
		currentPlayer = (currentPlayer + 1)%player.length;
		//Only switch between players on this map
		while(player[currentPlayer].lvl != player[prevPlayer].lvl)
		{
			currentPlayer = (currentPlayer + 1)%player.length;
		}
		player[currentPlayer].x = player[prevPlayer].x;
		player[currentPlayer].y = player[prevPlayer].y;
		player[currentPlayer].layer = player[prevPlayer].layer;
		player[currentPlayer].dir = player[prevPlayer].dir;
		deleteBoardC(player[prevPlayer]);
		insertBoardC(player[currentPlayer]);
		keyFirstDown[75] = null;
	}
	if(player[currentPlayer].rcvr == 0)
	{
		if(keyFirstDown[73] == 1) //I
		{
			Action.use(player[currentPlayer], player[currentPlayer].iFunc);
//			player[currentPlayer].iFunction();
			keyFirstDown[73] = null;
		}
		if(keyFirstDown[74] == 1) //J
		{
			Action.use(player[currentPlayer], player[currentPlayer].jFunc);
//			Action.act.slash(player[currentPlayer]);
			/*player[currentPlayer].act = "slash";
			player[currentPlayer].actCountdown = 4;*/
			keyFirstDown[74] = null;
		}
		if(keyFirstDown[76] == 1) //L
		{
			Action.use(player[currentPlayer], player[currentPlayer].lFunc);
//			player[currentPlayer].lFunction();
			keyFirstDown[76] = null;
		}
	}
	else
	{
		Action.update(player[currentPlayer]);
//		player[currentPlayer].rcvr--;
	}

	if(player[currentPlayer].hp <= 0)
	{
		resumeFunc = die;
		resumeCue = die(1);
		return;
	}
//alert("something");
	//These are the aspects of Sasha and Somahl's specials each loop
/*	if(player[currentPlayer].inAir == 1)
	{*/
		if(player[currentPlayer].act == "jumping")
		{
			//actionCountdown goes from 32 to -32 before this is not needed 
			//First (>0), move north using upper layer collisions to emulate jumping graphic
			//Second (==0), check if able to land on upper level, if so land; otherwise if not able to land on lower level, path back to jumping start place and end jump
			//Third (<0), move south using lower layer 
			//Finally, end at ==-32
			if(player[currentPlayer].actCountdown > 0)
			{
				//Move north
				zeldaBump(player[currentPlayer], 8, 1);
				//player[currentPlayer].y--;
			}
			else if(player[currentPlayer].actCountdown == 0)
			{
				if(player[currentPlayer].canBeHere(0))
				{
					delete player[currentPlayer].inAir;
				}
				else
				{
					player[currentPlayer].layer--;
					player[currentPlayer].y += 64;
		//??????????????Compliments of department of redundancy department?
					if(player[currentPlayer].canBeHere(0)) { }
					else
					{
						delete player[currentPlayer].act;
						delete player[currentPlayer].inAir;
						player[currentPlayer].path.x[0] = player[currentPlayer].ix;
						player[currentPlayer].path.y[0] = player[currentPlayer].iy;
					}
					player[currentPlayer].y -= 64;
				}
			}
			else if(player[currentPlayer].actCountdown >= -32)
			{
				player[currentPlayer].y += 2*(player[currentPlayer].actCountdown + 32);
				zeldaBump(player[currentPlayer], 8, 3);
				player[currentPlayer].y -= 2*(player[currentPlayer].actCountdown + 32);
				//player[currentPlayer].y++;
			}
			else
			{
				delete player[currentPlayer].act;
				delete player[currentPlayer].inAir;
			}
			player[currentPlayer].actCountdown -= 4;

//Soon to be obsolete			
/*			if(player[currentPlayer].actCountdown <= 0 || Math.abs(player[currentPlayer].ix - player[currentPlayer].x) > 40 || Math.abs(player[currentPlayer].iy - (player[currentPlayer].y + 64)) > 40)
			{
				var noLand = null;
				var rev = null;
				for(var ind = 0; ind < 8; ind++)
				{
					for(var sec = 0; sec < 16; sec++)
					{
						var i = pixCoordToIndex(player[currentPlayer].x + sec, player[currentPlayer].y + ind, currentLevel.layerFuncData[player[currentPlayer].layer]);
						if(currentLevel.layerFuncData[player[currentPlayer].layer].data[i] == 255)
						{
							var noLand = 1;
						}
					}
				}
				if(noLand == 1)
				{
					for(var ind = 0; ind < 8; ind++)
					{
						for(var sec = 0; sec < 16; sec++)
						{
							var i = pixCoordToIndex(player[currentPlayer].x + sec, player[currentPlayer].y + 64 + ind, currentLevel.layerFuncData[player[currentPlayer].layer - 1]);
							if(currentLevel.layerFuncData[player[currentPlayer].layer - 1].data[i] == 255)
							{
								var rev = 1;
							}
						}
					}
				}
				if(rev == 1)
				{
					player[currentPlayer].path.x[0] = player[currentPlayer].ix;
					player[currentPlayer].path.y[0] = player[currentPlayer].iy;
				}
				else if(noLand == 1)
				{
					player[currentPlayer].path.x[0] = player[currentPlayer].x;
					player[currentPlayer].path.y[0] = player[currentPlayer].y + 64;
				}
				if(noLand == 1)
				{
					player[currentPlayer].layer--;
				}
				player[currentPlayer].inAir = null;
			}
			else
			{
				player[currentPlayer].actCountdown--;
			}*/
		}
		else if(player[currentPlayer].act == "homing")
		{
			var done = 0;
			zeldaLockOnPoint(player[currentPlayer], player[currentPlayer].target.x, player[currentPlayer].target.y); //Lock direction on target
			var dist = Math.sqrt(Math.pow(player[currentPlayer].target.x - player[currentPlayer].x, 2) + Math.pow(player[currentPlayer].target.y - player[currentPlayer].y, 2))
			if(dist <= 32) //If closing in, knock back target
			{
				var tDir = player[currentPlayer].target.dir;
				player[currentPlayer].target.dir = player[currentPlayer].dir;
				zeldaStep(player[currentPlayer].target, 32);
				player[currentPlayer].target.dir = tDir;
				player[currentPlayer].target.status = "stunned"; //stun
				delete player[currentPlayer].target.act; //stop action (e.g. slashing)
				player[currentPlayer].target.statusCountdown = 100;
				done = 1;
			}
			if(zeldaStep(player[currentPlayer], 32) == -1 || done == 1)
			{
				delete player[currentPlayer].target;
				delete player[currentPlayer].inAir;
				delete player[currentPlayer].status;
				delete player[currentPlayer].act;
			}
//			pathMotion(player[currentPlayer], 32);
		}
//	}
	if(player[currentPlayer].path.x[0] == null)
	{
		figurePlayerDirection();
		if (player[currentPlayer].dir >= 4)
		{
			player[currentPlayer].dir -= 4;
		}
		if (dKeys == 0)
		{
			player[currentPlayer].frame = 0;
		}
		else if (frameClock == 1)
		{
			player[currentPlayer].frame++;
			if (player[currentPlayer].frame >= 4)
			{
				player[currentPlayer].frame = 0;
			}
		}
		if(dKeys != 0 && player[currentPlayer].act != "slash") //If pressing direction(s), step
		{
			if(player[currentPlayer].act == "jumping" && player[currentPlayer].inAir == 1 && player[currentPlayer].actCountdown < 0) player[currentPlayer].y += 2*(player[currentPlayer].actCountdown + 32);
			zeldaStep(player[currentPlayer], player[currentPlayer].spd);
			if(player[currentPlayer].act == "jumping" && player[currentPlayer].inAir == 1 && player[currentPlayer].actCountdown < 0) player[currentPlayer].y -= 2*(player[currentPlayer].actCountdown + 32);
		}
		for(var ind = 0; ind < 8; ind++)
		{
			for(var sec = 0; sec < 16; sec++)
			{
				var i = pixCoordToIndex(player[currentPlayer].x + sec, player[currentPlayer].y + ind, currentLevel.layerFuncData[player[currentPlayer].layer]);
				if(currentLevel.layerFuncData[player[currentPlayer].layer].data[i] == 100)
				{
					player[currentPlayer].onPrg = currentLevel.layerFuncData[player[currentPlayer].layer].data[i + 2];
					resumeFunc = currentLevel.boardProgram[player[currentPlayer].onPrg];
					if(currentLevel.layerFuncData[player[currentPlayer].layer].data[i + 1] == 1)
					{
						if(player[currentPlayer].wasOnPrg != player[currentPlayer].onPrg) //ensure program is not run twice
						{
							resumeCue = currentLevel.boardProgram[player[currentPlayer].onPrg](0);
						}
						//alert("program");
					}
					else if(currentLevel.layerFuncData[player[currentPlayer].layer].data[i + 1] == 2)
					{
						if(keyFirstDown[13] || keyFirstDown[32]) //require ENTER or SPACE to run program
						{
							keyFirstDown[13] = null;
							keyFirstDown[32] = null;
							resumeCue = currentLevel.boardProgram[player[currentPlayer].onPrg](0);
						}	
					}
/*					else //Just run program if on
					{
						resumeCue = currentLevel.boardProgram[player[currentPlayer].onPrg](0);
					}*/
					ind = 9;
					sec = 17;
				}
			}
		}
		player[currentPlayer].wasOnPrg = player[currentPlayer].onPrg;
		player[currentPlayer].onPrg = -1;
	}
	else
	{
		if(frameClock == 1)
		{
			player[currentPlayer].frame = (player[currentPlayer].frame + 1)%4;
		}
		pathMotion(player[currentPlayer], player[currentPlayer].spd);
	}

	//Pet motion
	if(player[currentPlayer].pet != null) //If pet is in use
	{
		if(player[currentPlayer].pet.status == "active") //If pet is in active state
		{
			delete player[currentPlayer].pet.target; //reset target
			var tDist = 97; //initialize currently closest distance
			for(var index = 0; index < boardNPC.length; index++) //Cycle through boardNPC to determine closest one to player within 64 pixels
			{
				var dist = Math.sqrt(Math.pow(boardNPC[index].x - player[currentPlayer].x, 2) + Math.pow(boardNPC[index].y - player[currentPlayer].y, 2));
				if(dist <= 96 && player[currentPlayer].layer == boardNPC[index].layer)
				{
					if(player[currentPlayer].pet.target == null || dist < tDist)
					{
						player[currentPlayer].pet.target = boardNPC[index];
						tDist = dist;
					}
				}
			}
			if(player[currentPlayer].pet.target != null) //If target was found
			{
				zeldaLockOnPoint(player[currentPlayer].pet, player[currentPlayer].pet.target.x, player[currentPlayer].pet.target.y); //Orient pet toward target
				zeldaStep(player[currentPlayer].pet, player[currentPlayer].spd + 2); //Step toward target
				//Start slashing as fast as possible
				if(player[currentPlayer].pet.rcvr == 0 && player[currentPlayer].pet.act != "slash") 
				{
					player[currentPlayer].pet.act = "slash";
					player[currentPlayer].pet.actCountdown = 4;
				}
				else if(player[currentPlayer].pet.rcvr != 0)
				{
					player[currentPlayer].pet.rcvr--;
					if(player[currentPlayer].pet.rcvr < 0)
					{
						player[currentPlayer].pet.rcvr = 0;
					}
				}
			}
			else if(keyDown[73]) //Move toward player if not attacking and I is pressed
			{
				zeldaLockOnPoint(player[currentPlayer].pet, player[currentPlayer].x, player[currentPlayer].y);
				zeldaStep(player[currentPlayer].pet, player[currentPlayer].spd - 2);
			}
			else
			{
				if(randomInt(50) == 1)
				{
					player[currentPlayer].pet.dir = randomInt(4) - 1;
					zeldaStep(player[currentPlayer].pet, 1);
				}
			}
			//Update frame
			if(frameClock == 1) player[currentPlayer].pet.frame = (player[currentPlayer].pet.frame + 1)%4;
			//Trend toward inactivity
			player[currentPlayer].pet.statusCountdown--;
			if(player[currentPlayer].pet.statusCountdown <= 0)
			{
				player[currentPlayer].pet.status = "inactive";
				player[currentPlayer].pet.statusCountdown = 50;
			}
		}
		else
		{
			player[currentPlayer].pet.statusCountdown--;
			if(player[currentPlayer].pet.statusCountdown <= 0)
			{
				deleteBoardC(player[currentPlayer].pet);
				delete player[currentPlayer].pet;
			}
		}
	}
	
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
				deleteBoardC(player[currentPlayer].dart);
				boardNPC[index].status = "hurt"; //"hurt" opponent
				boardNPC[index].statusCountdown = 4; //"hurt" blinks
				index = boardNPC.length; //break out of loop
			}
		}
		//If hit terrain
		if(moved == -1)
		{
			player[currentPlayer].dart.layer = null;
			player[currentPlayer].dart.frame = 0;
			deleteBoardC(player[currentPlayer].dart);
		}
		//Update frame
		if(frameClock == 1)
		{
			player[currentPlayer].dart.frame = (player[currentPlayer].dart.frame + 1)%4;
		}
	}
}
