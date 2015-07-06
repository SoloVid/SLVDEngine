function zeldaNPCMotion() //Function for all non-player boardC's movement in Zelda mode.
{
	if(SLVDEngine.process != "zelda")
	{
		return -1;
	}
	for(var index = 0; index < boardC.length; index++)
	{
		if(boardC[index] != player[currentPlayer])
		{
			//Facilitate death
			while(index < boardC.length && boardC[index].hp <= 0)
			{
				boardC[index].lvl = null;
				deleteBoardC(boardC[index]);
				boardC.splice(index, 1);
			}
					
			//If at invalid index (bc death ran to end of boardC array), don't continue
			if(index >= boardC.length) return;
			else
			{
				var cNPC = boardC[index];
			
				var dist = Math.sqrt(Math.pow(boardC[index].x - player[currentPlayer].x, 2) + Math.pow(boardC[index].y - player[currentPlayer].y, 2));
				if(boardC[index].path.length > 0) //Handle path motion
				{
					boardC[index].updateFrame();
					boardC[index].pathMotion(boardC[index].spd);
				}
				else if(dist > 800) { } //If totally beyond screen, don't handle
				else
				{
					//Set stance to default based on direction
					cNPC.defaultStance();
					
					cNPC.handleStatus();
					cNPC.handleAction();
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
	/*		if(index < boardNPC.length && boardNPC[index].dart.img != null && boardNPC[index].dart.layer != null)
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
			}*/

		}
	}
}

function zeldaPlayerMotion() //Function for current player's motion and other key handlings in Zelda mode.
{
	var person = player[currentPlayer];

	if(SLVDEngine.keyFirstDown == "enter" || SLVDEngine.keyFirstDown == "space")
	{
		for(var index = 0; index < boardC.length; index++)
		{
			if(Math.abs(person.x - boardC[index].x) < 20 && Math.abs(person.y - boardC[index].y) < 12 && boardC[index].program != null)
			{
				resumeFunc = boardC[index].program;
				resumeCue = boardC[index].program(0);
			}
		}
		delete SLVDEngine.keyFirstDown;
	}
	if(SLVDEngine.keyFirstDown == "k" && person.act.length === 0 && !person.inAir)
	{ 
		var prevPlayer = currentPlayer;
		currentPlayer = (currentPlayer + 1)%player.length;
		//Only switch between players on this map
		while(player[currentPlayer].lvl != player[prevPlayer].lvl)
		{
			currentPlayer = (currentPlayer + 1)%player.length;
		}
		person = player[currentPlayer];
		person.x = player[prevPlayer].x;
		person.y = player[prevPlayer].y;
		person.layer = player[prevPlayer].layer;
		person.dir = player[prevPlayer].dir;
		deleteBoardC(player[prevPlayer]);
		insertBoardC(person);
		delete SLVDEngine.keyFirstDown;
	}
	
	person.defaultStance();
	
	if(SLVDEngine.keyFirstDown && person.keyFunc[SLVDEngine.keyFirstDown])
	{
		console.log("zeldaPlayer... detected keyFirstDown " + SLVDEngine.keyFirstDown);
		SLVDEngine.mainPromise = person.keyFunc[SLVDEngine.keyFirstDown]();
	}
	
	//Handle persistent actions
	for(var i = 0; i < person.act.length; i++)
	{
		var currentAct = person.getAct(i);
		currentAct.update(person);
		if(currentAct.time <= 0)
		{
			person.act.splice(i, 1);
			if(SLVDEngine.process == "TRPG")
			{
				TRPGNextTurn(); //in TRPG.js
			}
		}
	}
	
	if(person.hp <= 0)
	{
		resumeFunc = die;
		resumeCue = die(1);
		return;
	}
/*		if(player[currentPlayer].act == "jumping")
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
		}*/
//	}
	if(person.path.length === 0)
	{
		figurePlayerDirection();
		if (person.dir >= 4)
		{
			person.dir -= 4;
		}
		if (dKeys == 0)
		{
			person.frame = 0;
		}
		else
		{
			person.updateFrame();
		}
		if(dKeys) //If pressing direction(s), step
		{
//			if(player[currentPlayer].act == "jumping" && player[currentPlayer].inAir == 1 && player[currentPlayer].actCountdown < 0) player[currentPlayer].y += 2*(player[currentPlayer].actCountdown + 32);
			if(person.zeldaStep(person.spd) < 0) {}//console.log("stopped");
//			if(player[currentPlayer].act == "jumping" && player[currentPlayer].inAir == 1 && player[currentPlayer].actCountdown < 0) player[currentPlayer].y -= 2*(player[currentPlayer].actCountdown + 32);
		}
		var limit = person.baseLength/2;
		for(var ind = -limit; ind < limit; ind++)
		{
			for(var sec = -limit; sec < limit; sec++)
			{
				var i = pixCoordToIndex(player[currentPlayer].x + sec, player[currentPlayer].y + ind, SLVDEngine.currentLevel.layerFuncData[player[currentPlayer].layer]);
				if(SLVDEngine.currentLevel.layerFuncData[player[currentPlayer].layer].data[i] == 100)
				{
					player[currentPlayer].onPrg = SLVDEngine.currentLevel.layerFuncData[player[currentPlayer].layer].data[i + 2];
					resumeFunc = SLVDEngine.currentLevel.boardProgram[player[currentPlayer].onPrg];
					if(SLVDEngine.currentLevel.layerFuncData[player[currentPlayer].layer].data[i + 1] == 1)
					{
						if(player[currentPlayer].wasOnPrg != player[currentPlayer].onPrg) //ensure program is not run twice
						{
							resumeCue = SLVDEngine.currentLevel.boardProgram[player[currentPlayer].onPrg](0);
						}
						//alert("program");
					}
					else if(SLVDEngine.currentLevel.layerFuncData[player[currentPlayer].layer].data[i + 1] == 2)
					{
						if(SLVDEngine.keyFirstDown == "enter" || SLVDEngine.keyFirstDown == "space") //require ENTER or SPACE to run program
						{
							delete SLVDEngine.keyFirstDown;
							resumeCue = SLVDEngine.currentLevel.boardProgram[player[currentPlayer].onPrg](0);
						}	
					}
					else //Just run program if on
					{
						resumeCue = SLVDEngine.currentLevel.boardProgram[player[currentPlayer].onPrg](0);
					}
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
		person.updateFrame();
		person.pathMotion(person.spd);
	}

	//Pet motion
/*	if(player[currentPlayer].pet != null) //If pet is in use
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
			else if(SLVDEngine.keyDown[73]) //Move toward player if not attacking and I is pressed
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
	}*/
	
	//Projectile motion
/*	if(player[currentPlayer].dart.img != null && player[currentPlayer].dart.layer != null)
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
	}*/
}
