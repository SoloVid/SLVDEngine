SLVDEngine.zeldaNPCMotion = function() //Function for all non-SLVDEngine.player SLVDEngine.boardSprite's movement in Zelda mode.
{
	if(SLVDEngine.process != "zelda")
	{
		return -1;
	}
	for(var index = 0; index < SLVDEngine.boardSprite.length; index++)
	{
		//Facilitate death
		while(index < SLVDEngine.boardSprite.length && SLVDEngine.boardSprite[index].hp <= 0)
		{
			SLVDEngine.boardSprite[index].lvl = null;
			//deleteBoardC(SLVDEngine.boardSprite[index]);
			SLVDEngine.boardSprite.splice(index, 1);
		}
		//If at invalid index (bc death ran to end of SLVDEngine.boardSprite array), don't continue
		if(index >= SLVDEngine.boardSprite.length) return;
		if(SLVDEngine.boardSprite[index] != SLVDEngine.player[SLVDEngine.currentPlayer])
		{					
			var cNPC = SLVDEngine.boardSprite[index];
		
			if(cNPC.path.length > 0) //Handle path motion
			{
				cNPC.updateFrame();
				cNPC.pathMotion(cNPC.spd);
			}
			else
			{
				//Set stance to default based on direction
				cNPC.defaultStance();
				
				cNPC.handleStatus();
				cNPC.handleAction();
			}
		}
	}
};

SLVDEngine.zeldaPlayerMotion = function() //Function for current SLVDEngine.player's motion and other key handlings in Zelda mode.
{
	var person = SLVDEngine.player[SLVDEngine.currentPlayer];

	if(SLVDEngine.keyFirstDown == "enter" || SLVDEngine.keyFirstDown == "space")
	{
		for(var index = 0; index < SLVDEngine.boardAgent.length; index++)
		{
			if(Math.abs(person.x - SLVDEngine.boardAgent[index].x) < 20 && Math.abs(person.y - SLVDEngine.boardAgent[index].y) < 12 && SLVDEngine.boardAgent[index].program != null)
			{
				resumeFunc = SLVDEngine.boardAgent[index].program;
				resumeCue = SLVDEngine.boardAgent[index].program(0);
			}
		}
		delete SLVDEngine.keyFirstDown;
	}
	if(SLVDEngine.keyFirstDown == "k" && person.act.length === 0 && !person.inAir)
	{ 
		var prevPlayer = SLVDEngine.currentPlayer;
		SLVDEngine.currentPlayer = (SLVDEngine.currentPlayer + 1)%SLVDEngine.player.length;
		//Only switch between players on this map
		while(SLVDEngine.player[SLVDEngine.currentPlayer].lvl != SLVDEngine.player[prevPlayer].lvl)
		{
			SLVDEngine.currentPlayer = (SLVDEngine.currentPlayer + 1)%SLVDEngine.player.length;
		}
		person = SLVDEngine.player[SLVDEngine.currentPlayer];
		person.x = SLVDEngine.player[prevPlayer].x;
		person.y = SLVDEngine.player[prevPlayer].y;
		person.layer = SLVDEngine.player[prevPlayer].layer;
		person.dir = SLVDEngine.player[prevPlayer].dir;
		deleteBoardC(SLVDEngine.player[prevPlayer]);
		insertBoardC(person);
		delete SLVDEngine.keyFirstDown;
	}
	
	person.defaultStance();
	person.handleStatus();
	
	if(SLVDEngine.keyFirstDown && person.keyFunc[SLVDEngine.keyFirstDown])
	{
		SLVDEngine.mainPromise = person.keyFunc[SLVDEngine.keyFirstDown]();
		
		delete SLVDEngine.keyFirstDown;
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
/*		if(SLVDEngine.player[SLVDEngine.currentPlayer].act == "jumping")
		{
			//actionCountdown goes from 32 to -32 before this is not needed 
			//First (>0), move north using upper layer collisions to emulate jumping graphic
			//Second (==0), check if able to land on upper SLVDEngine.level, if so land; otherwise if not able to land on lower SLVDEngine.level, path back to jumping start place and end jump
			//Third (<0), move south using lower layer 
			//Finally, end at ==-32
			if(SLVDEngine.player[SLVDEngine.currentPlayer].actCountdown > 0)
			{
				//Move north
				zeldaBump(SLVDEngine.player[SLVDEngine.currentPlayer], 8, 1);
				//SLVDEngine.player[SLVDEngine.currentPlayer].y--;
			}
			else if(SLVDEngine.player[SLVDEngine.currentPlayer].actCountdown == 0)
			{
				if(SLVDEngine.player[SLVDEngine.currentPlayer].canBeHere(0))
				{
					delete SLVDEngine.player[SLVDEngine.currentPlayer].inAir;
				}
				else
				{
					SLVDEngine.player[SLVDEngine.currentPlayer].layer--;
					SLVDEngine.player[SLVDEngine.currentPlayer].y += 64;
		//??????????????Compliments of department of redundancy department?
					if(SLVDEngine.player[SLVDEngine.currentPlayer].canBeHere(0)) { }
					else
					{
						delete SLVDEngine.player[SLVDEngine.currentPlayer].act;
						delete SLVDEngine.player[SLVDEngine.currentPlayer].inAir;
						SLVDEngine.player[SLVDEngine.currentPlayer].path.x[0] = SLVDEngine.player[SLVDEngine.currentPlayer].ix;
						SLVDEngine.player[SLVDEngine.currentPlayer].path.y[0] = SLVDEngine.player[SLVDEngine.currentPlayer].iy;
					}
					SLVDEngine.player[SLVDEngine.currentPlayer].y -= 64;
				}
			}
			else if(SLVDEngine.player[SLVDEngine.currentPlayer].actCountdown >= -32)
			{
				SLVDEngine.player[SLVDEngine.currentPlayer].y += 2*(SLVDEngine.player[SLVDEngine.currentPlayer].actCountdown + 32);
				zeldaBump(SLVDEngine.player[SLVDEngine.currentPlayer], 8, 3);
				SLVDEngine.player[SLVDEngine.currentPlayer].y -= 2*(SLVDEngine.player[SLVDEngine.currentPlayer].actCountdown + 32);
				//SLVDEngine.player[SLVDEngine.currentPlayer].y++;
			}
			else
			{
				delete SLVDEngine.player[SLVDEngine.currentPlayer].act;
				delete SLVDEngine.player[SLVDEngine.currentPlayer].inAir;
			}
			SLVDEngine.player[SLVDEngine.currentPlayer].actCountdown -= 4;
		}
		else if(SLVDEngine.player[SLVDEngine.currentPlayer].act == "homing")
		{
			var done = 0;
			zeldaLockOnPoint(SLVDEngine.player[SLVDEngine.currentPlayer], SLVDEngine.player[SLVDEngine.currentPlayer].target.x, SLVDEngine.player[SLVDEngine.currentPlayer].target.y); //Lock direction on target
			var dist = Math.sqrt(Math.pow(SLVDEngine.player[SLVDEngine.currentPlayer].target.x - SLVDEngine.player[SLVDEngine.currentPlayer].x, 2) + Math.pow(SLVDEngine.player[SLVDEngine.currentPlayer].target.y - SLVDEngine.player[SLVDEngine.currentPlayer].y, 2))
			if(dist <= 32) //If closing in, knock back target
			{
				var tDir = SLVDEngine.player[SLVDEngine.currentPlayer].target.dir;
				SLVDEngine.player[SLVDEngine.currentPlayer].target.dir = SLVDEngine.player[SLVDEngine.currentPlayer].dir;
				zeldaStep(SLVDEngine.player[SLVDEngine.currentPlayer].target, 32);
				SLVDEngine.player[SLVDEngine.currentPlayer].target.dir = tDir;
				SLVDEngine.player[SLVDEngine.currentPlayer].target.status = "stunned"; //stun
				delete SLVDEngine.player[SLVDEngine.currentPlayer].target.act; //stop action (e.g. slashing)
				SLVDEngine.player[SLVDEngine.currentPlayer].target.statusCountdown = 100;
				done = 1;
			}
			if(zeldaStep(SLVDEngine.player[SLVDEngine.currentPlayer], 32) == -1 || done == 1)
			{
				delete SLVDEngine.player[SLVDEngine.currentPlayer].target;
				delete SLVDEngine.player[SLVDEngine.currentPlayer].inAir;
				delete SLVDEngine.player[SLVDEngine.currentPlayer].status;
				delete SLVDEngine.player[SLVDEngine.currentPlayer].act;
			}
//			pathMotion(SLVDEngine.player[SLVDEngine.currentPlayer], 32);
		}*/
//	}
	if(person.path.length === 0)
	{
		if(figurePlayerDirection()) //If pressing direction(s), step
		{
			person.updateFrame();
//			if(SLVDEngine.player[SLVDEngine.currentPlayer].act == "jumping" && SLVDEngine.player[SLVDEngine.currentPlayer].inAir == 1 && SLVDEngine.player[SLVDEngine.currentPlayer].actCountdown < 0) SLVDEngine.player[SLVDEngine.currentPlayer].y += 2*(SLVDEngine.player[SLVDEngine.currentPlayer].actCountdown + 32);
			if(person.zeldaStep(person.spd) < 0) {}//console.log("stopped");
//			if(SLVDEngine.player[SLVDEngine.currentPlayer].act == "jumping" && SLVDEngine.player[SLVDEngine.currentPlayer].inAir == 1 && SLVDEngine.player[SLVDEngine.currentPlayer].actCountdown < 0) SLVDEngine.player[SLVDEngine.currentPlayer].y -= 2*(SLVDEngine.player[SLVDEngine.currentPlayer].actCountdown + 32);
		}
		else
		{
			person.frame = 0;
		}
		var limit = person.baseLength/2;
		for(var ind = -limit; ind < limit; ind++)
		{
			for(var sec = -limit; sec < limit; sec++)
			{
				var i = pixCoordToIndex(SLVDEngine.player[SLVDEngine.currentPlayer].x + sec, SLVDEngine.player[SLVDEngine.currentPlayer].y + ind, SLVDEngine.currentLevel.layerFuncData[SLVDEngine.player[SLVDEngine.currentPlayer].layer]);
				if(SLVDEngine.currentLevel.layerFuncData[SLVDEngine.player[SLVDEngine.currentPlayer].layer].data[i] == 100)
				{
					SLVDEngine.player[SLVDEngine.currentPlayer].onPrg = SLVDEngine.currentLevel.layerFuncData[SLVDEngine.player[SLVDEngine.currentPlayer].layer].data[i + 2];
					resumeFunc = SLVDEngine.currentLevel.boardProgram[SLVDEngine.player[SLVDEngine.currentPlayer].onPrg];
					if(SLVDEngine.currentLevel.layerFuncData[SLVDEngine.player[SLVDEngine.currentPlayer].layer].data[i + 1] == 1)
					{
						if(SLVDEngine.player[SLVDEngine.currentPlayer].wasOnPrg != SLVDEngine.player[SLVDEngine.currentPlayer].onPrg) //ensure program is not run twice
						{
							resumeCue = SLVDEngine.currentLevel.boardProgram[SLVDEngine.player[SLVDEngine.currentPlayer].onPrg](0);
						}
						//alert("program");
					}
					else if(SLVDEngine.currentLevel.layerFuncData[SLVDEngine.player[SLVDEngine.currentPlayer].layer].data[i + 1] == 2)
					{
						if(SLVDEngine.keyFirstDown == "enter" || SLVDEngine.keyFirstDown == "space") //require ENTER or SPACE to run program
						{
							delete SLVDEngine.keyFirstDown;
							resumeCue = SLVDEngine.currentLevel.boardProgram[SLVDEngine.player[SLVDEngine.currentPlayer].onPrg](0);
						}	
					}
					else //Just run program if on
					{
						resumeCue = SLVDEngine.currentLevel.boardProgram[SLVDEngine.player[SLVDEngine.currentPlayer].onPrg](0);
					}
					ind = 9;
					sec = 17;
				}
			}
		}
		SLVDEngine.player[SLVDEngine.currentPlayer].wasOnPrg = SLVDEngine.player[SLVDEngine.currentPlayer].onPrg;
		SLVDEngine.player[SLVDEngine.currentPlayer].onPrg = -1;
	}
	else
	{
		person.updateFrame();
		person.pathMotion(person.spd);
	}

	//Pet motion
/*	if(SLVDEngine.player[SLVDEngine.currentPlayer].pet != null) //If pet is in use
	{
		if(SLVDEngine.player[SLVDEngine.currentPlayer].pet.status == "active") //If pet is in active state
		{
			delete SLVDEngine.player[SLVDEngine.currentPlayer].pet.target; //reset target
			var tDist = 97; //initialize currently closest distance
			for(var index = 0; index < boardNPC.length; index++) //Cycle through boardNPC to determine closest one to SLVDEngine.player within 64 pixels
			{
				var dist = Math.sqrt(Math.pow(boardNPC[index].x - SLVDEngine.player[SLVDEngine.currentPlayer].x, 2) + Math.pow(boardNPC[index].y - SLVDEngine.player[SLVDEngine.currentPlayer].y, 2));
				if(dist <= 96 && SLVDEngine.player[SLVDEngine.currentPlayer].layer == boardNPC[index].layer)
				{
					if(SLVDEngine.player[SLVDEngine.currentPlayer].pet.target == null || dist < tDist)
					{
						SLVDEngine.player[SLVDEngine.currentPlayer].pet.target = boardNPC[index];
						tDist = dist;
					}
				}
			}
			if(SLVDEngine.player[SLVDEngine.currentPlayer].pet.target != null) //If target was found
			{
				zeldaLockOnPoint(SLVDEngine.player[SLVDEngine.currentPlayer].pet, SLVDEngine.player[SLVDEngine.currentPlayer].pet.target.x, SLVDEngine.player[SLVDEngine.currentPlayer].pet.target.y); //Orient pet toward target
				zeldaStep(SLVDEngine.player[SLVDEngine.currentPlayer].pet, SLVDEngine.player[SLVDEngine.currentPlayer].spd + 2); //Step toward target
				//Start slashing as fast as possible
				if(SLVDEngine.player[SLVDEngine.currentPlayer].pet.rcvr == 0 && SLVDEngine.player[SLVDEngine.currentPlayer].pet.act != "slash") 
				{
					SLVDEngine.player[SLVDEngine.currentPlayer].pet.act = "slash";
					SLVDEngine.player[SLVDEngine.currentPlayer].pet.actCountdown = 4;
				}
				else if(SLVDEngine.player[SLVDEngine.currentPlayer].pet.rcvr != 0)
				{
					SLVDEngine.player[SLVDEngine.currentPlayer].pet.rcvr--;
					if(SLVDEngine.player[SLVDEngine.currentPlayer].pet.rcvr < 0)
					{
						SLVDEngine.player[SLVDEngine.currentPlayer].pet.rcvr = 0;
					}
				}
			}
			else if(SLVDEngine.keyDown[73]) //Move toward SLVDEngine.player if not attacking and I is pressed
			{
				zeldaLockOnPoint(SLVDEngine.player[SLVDEngine.currentPlayer].pet, SLVDEngine.player[SLVDEngine.currentPlayer].x, SLVDEngine.player[SLVDEngine.currentPlayer].y);
				zeldaStep(SLVDEngine.player[SLVDEngine.currentPlayer].pet, SLVDEngine.player[SLVDEngine.currentPlayer].spd - 2);
			}
			else
			{
				if(SLVD.randomInt(50) == 1)
				{
					SLVDEngine.player[SLVDEngine.currentPlayer].pet.dir = SLVD.randomInt(4) - 1;
					zeldaStep(SLVDEngine.player[SLVDEngine.currentPlayer].pet, 1);
				}
			}
			//Update frame
			if(SLVDEngine.frameClock == 1) SLVDEngine.player[SLVDEngine.currentPlayer].pet.frame = (SLVDEngine.player[SLVDEngine.currentPlayer].pet.frame + 1)%4;
			//Trend toward inactivity
			SLVDEngine.player[SLVDEngine.currentPlayer].pet.statusCountdown--;
			if(SLVDEngine.player[SLVDEngine.currentPlayer].pet.statusCountdown <= 0)
			{
				SLVDEngine.player[SLVDEngine.currentPlayer].pet.status = "inactive";
				SLVDEngine.player[SLVDEngine.currentPlayer].pet.statusCountdown = 50;
			}
		}
		else
		{
			SLVDEngine.player[SLVDEngine.currentPlayer].pet.statusCountdown--;
			if(SLVDEngine.player[SLVDEngine.currentPlayer].pet.statusCountdown <= 0)
			{
				deleteBoardC(SLVDEngine.player[SLVDEngine.currentPlayer].pet);
				delete SLVDEngine.player[SLVDEngine.currentPlayer].pet;
			}
		}
	}*/
	
	//Projectile motion
/*	if(SLVDEngine.player[SLVDEngine.currentPlayer].dart.img != null && SLVDEngine.player[SLVDEngine.currentPlayer].dart.layer != null)
	{
		//Move projectile
		var moved = zeldaStep(SLVDEngine.player[SLVDEngine.currentPlayer].dart, SLVDEngine.player[SLVDEngine.currentPlayer].dart.spd);
		for(var index = 0; index < boardNPC.length; index++)
		{
			if((Math.abs(SLVDEngine.player[SLVDEngine.currentPlayer].dart.y - (boardNPC[index].y - 24)) < 32) && (Math.abs(SLVDEngine.player[SLVDEngine.currentPlayer].dart.x - boardNPC[index].x) < 16))
			{
				damage(SLVDEngine.player[SLVDEngine.currentPlayer].dart, boardNPC[index]); //damage hit opponent
				SLVDEngine.player[SLVDEngine.currentPlayer].dart.layer = null; //remove SLVDEngine.image
				SLVDEngine.player[SLVDEngine.currentPlayer].dart.frame = 0; //reset frame
				deleteBoardC(SLVDEngine.player[SLVDEngine.currentPlayer].dart);
				boardNPC[index].status = "hurt"; //"hurt" opponent
				boardNPC[index].statusCountdown = 4; //"hurt" blinks
				index = boardNPC.length; //break out of loop
			}
		}
		//If hit terrain
		if(moved == -1)
		{
			SLVDEngine.player[SLVDEngine.currentPlayer].dart.layer = null;
			SLVDEngine.player[SLVDEngine.currentPlayer].dart.frame = 0;
			deleteBoardC(SLVDEngine.player[SLVDEngine.currentPlayer].dart);
		}
		//Update frame
		if(SLVDEngine.frameClock == 1)
		{
			SLVDEngine.player[SLVDEngine.currentPlayer].dart.frame = (SLVDEngine.player[SLVDEngine.currentPlayer].dart.frame + 1)%4;
		}
	}*/
};
