function Sprite(name, spriteSheet)
{
	this.name = name;
	this.img = spriteSheet;
	
//	this.dart = {};
//	this.dart.prototype = this;
}
Sprite.prototype.xres = 32;
Sprite.prototype.yres = 64;
Sprite.prototype.lvl;
Sprite.prototype.team;
Sprite.prototype.x = 100;
Sprite.prototype.y = 100;
Sprite.prototype.layer = 0;
//	Sprite.prototype.inAir = null;
Sprite.prototype.mvmt = 1; //0 - still; 1 - random moving; 2 - back and forth; 4 - square
//	Sprite.prototype.speech; //0/"" or message
Sprite.prototype.dmnr = 1; //0 - peaceful; 1 - excitable; 2 - aggressive
Sprite.prototype.dir = 3;
Sprite.prototype.steps = 0;// = 5;
Sprite.prototype.wait;// = 0;
//	Sprite.prototype.act;
Sprite.prototype.actSet = [];
Sprite.prototype.rcvr = 0;
Sprite.prototype.moveSet = [];
Sprite.prototype.status = [];
Sprite.prototype.pushy = 1;
Sprite.prototype.frame = 0;
Sprite.prototype.hp = 100;
Sprite.prototype.strg = 5;
Sprite.prototype.spd = 2;

Sprite.prototype.path = {};
Sprite.prototype.path.x = [];
Sprite.prototype.path.y = [];

Sprite.prototype.canAct = true;
Sprite.prototype.canMove = true;
Sprite.prototype.canSeeAct = true;
Sprite.prototype.canSeeMove = true;

Sprite.prototype.preventAction = function() { this.canAct = false; }
Sprite.prototype.preventMotion = function() { this.canMove = false; }
Sprite.prototype.preventActionSee = function() { this.canSeeAct = false; }
Sprite.prototype.preventMotionSee = function() { this.canSeeMove = false; }
Sprite.prototype.resetCans = function() { delete this.canAct; delete this.canMove; delete this.canSeeAct; delete this.canSeeMove; }

//Sprite.prototype.dart = {};

//**********?
Sprite.prototype.oppTeam = player;

//Checks if the a Sprite's location is valid (based on current location and layer func data)
Sprite.prototype.canBeHere = function(allowInAir) {
	for(var ind = 0; ind < 8; ind++)
	{
		for(var sec = 0; sec < 16; sec++)
		{
			var i = pixCoordToIndex(person.x + sec, person.y + ind, currentLevel.layerFuncData[person.layer]);
			if(currentLevel.layerFuncData[person.layer].data[i] == 255)
			{
				if(allowInAir == 1 && currentLevel.layerFuncData[person.layer].data[i + 1] == 255) { }
				else return 0;
			}
		}
	}
	return 1;
}

Sprite.prototype.canSeePlayer = function() {
	var tDir = dirFromTo(this.x, this.y, player[currentPlayer].x, player[currentPlayer].y);
	return (Math.abs(tDir - this.dir) < 1 || Math.abs(tDir - this.dir) > 3)
}

Sprite.prototype.giveAction = function(action) {
	if(this.actSet.length == 0)
	{
		this.actSet = [];
	}
	
	this.actSet.push(action);
}

Sprite.prototype.giveMotion = function(motion) {
	if(this.moveSet.length == 0)
	{
		this.moveSet = [];
	}
	
	this.moveSet.push(motion);
}

Sprite.prototype.giveStatus = function(status) {
	//intensity = intensity || 0;
	
	if(this.status.length == 0)
	{
		this.status = [];
	}
	
	/*var status = {
		name: name;
		time: time;
		amp: intensity;
	};*/
	
	this.status.push(status); 
}

Sprite.prototype.hasStatus(name) {
	for(var i = 0; i < this.status.length; i++)
	{
		if(this.status[i] instanceof Status[name])
		{
			return true;
		}
	}
	return false;
}

//Based in time.js, this function provides simple interface for setting a timed sequence of movement events for Sprites 
Sprite.prototype.registerWalkEvent = function(eventA, isDaily, day, hour, minute, second) {
	/*eventA should be an array with specific sequences of "arguments". Acceptable forms:
		coordinates: x, y
		abrupt relocation: "put", x, y, z
		move to new board: "send", [board name], x, y, z
		call function: "function", [function object] (this is intended for simple things like sound effects)
	*/
	if(isDaily)
	{
		day = 0;
	}
	var cTime = Time.componentToAbsolute(day, hour, minute, second);
	var nTime = cTime;
	
	var i = 0;
	var ptA = [];
	
	var cx, cy;
	var nx = this.x;
	var ny = this.y;
	
	while(i < eventA.length)
	{
		if(typeof eventA[i] == "number")
		{
			cx = nx;
			cy = ny;
			nx = eventA[i];
			ny = eventA[i + 1];
			ptA.push(nx);
			ptA.push(ny);
			i += 2;
			var tDir = dirFromTo(cx, cy, nx, ny); //in functions.js
			
			//Single step component distances
			var dy = Math.round(this.spd*Math.sin((tDir)*(Math.PI/2)));
			var dx = Math.round(this.spd*Math.cos((tDir)*(Math.PI/2)));
			
			//Frames used to travel between points
			var f = Math.ceil(Math.abs(nx - cx)/dx) || Math.ceil(Math.abs(ny - cy)/dy);
			
			//Expect next event's time to be f frames farther
			nTime += f; 
			if(isDaily)
			{
				nTime = nTime%(60*60*24);
			}
		}
		else
		{
			if(ptA.length > 0)
			{
				var event = new Function("var tNPC = getNPCByName(\"" + this.name + "\"); tNPC.walkPath(" + ptA.toString() + ");");
				Time.registerEvent(event, isDaily, cTime);
				ptA.length = 0;
				cTime = nTime + 8; //tack on a few extra frames to be safe
			}
			
			if(eventA[i] == "put")
			{
				var event = new Function("var tNPC = getNPCByName(\"" + this.name + "\"); tNPC.x = " + eventA[i + 1] + "; tNPC.y = " + eventA[i + 2] + "; tNPC.layer = " + eventA[i + 3] + ";");
				Time.registerEvent(event, isDaily, cTime);
				i += 4;
				
				nx = eventA[i + 1];
				ny = eventA[i + 2];
			}
			else if(eventA[i] == "send")
			{
				var event = new Function("var tNPC = getNPCByName(\"" + this.name + "\"); tNPC.lvl = " + eventA[i + 1] + "; tNPC.x = " + eventA[i + 2] + "; tNPC.y = " + eventA[i + 3] + "; tNPC.layer = " + eventA[i + 4] + ";");
				Time.registerEvent(event, isDaily, cTime);
				i += 5;
				
				nx = eventA[i + 2];
				ny = eventA[i + 3];
			}
			else if(eventA[i] == "function")
			{
				Time.registerEvent(eventA[i + 1], isDaily, cTime);
			}
		}
	}
}

Sprite.prototype.updateFrame = function() {
	//Only update on frame tick
	if(frameClock == 1)
	{
		this.frame++;
		if(this.img.height <= this.frame*yres)
		{
			this.frame = 0;
		}
		/*if (this.frame >= 4)
		{
			this.frame = 0;
		}*/
	}
}

//(x1, y1, x2, y2, ...)
Sprite.prototype.walkPath = function() {
	if(currentLevel == this.level)
	{
		var spd = this.spd;
		for(var i = 0; i < arguments.length; i += 2)
		{
			this.path.x.push(arguments[i]);
			this.path.y.push(arguments[i + 1]);
		}
	}
	else
	{
		
	}
}

//zeldaStep but with input direction
Sprite.prototype.zeldaBump = function(distance, direction) {
	//Save direction
	var tDir = this.dir;
	//Set direction
	this.dir = direction;
	//Bump
	this.zeldaStep(distance);
	//Revert direction;
	this.dir = tDir;
}

Sprite.prototype.zeldaLockOnPlayer = function() {
	this.zeldaLockOnPoint(player[currentPlayer].x, player[currentPlayer].y);
}
	
Sprite.prototype.zeldaLockOnPoint = function(qx, qy) {
	this.dir = dirFromTo(this.x, this.y, qx, qy);
/*	this.dir = Math.atan(-(this.y - qy)/(this.x - qx))/(Math.PI/2);
	if(this.x > qx)
	{	
		this.dir += 2;
	}
	if(this.x == qx)
	{
		this.dir -= 2;
	}
	if(this.dir < 0)
	{
		this.dir += 4;
	}*/
}

//*********Advances Sprite person up to distance distance as far as is legal. Includes pushing other Sprites out of the way? Returns -1 if stopped before distance?
Sprite.prototype.zeldaStep = function(distance) {
	var ret = 1; //value to return at end
	var dy = -(Math.round(distance*Math.sin((this.dir)*(Math.PI/2)))); //Total y distance to travel
	var dx = Math.round(distance*Math.cos((this.dir)*(Math.PI/2))); //Total x distance to travel
//***************y and x are nearly identical. They should be consolidated.
	//Handle y movement
	for(var ind = 0; ind < Math.abs(dy); ind++)
	{
		this.y += (dy/Math.abs(dy));
		//Check if out of bounds
		if(this.y >= currentLevel.layerImg[0].height || this.y < 0)
		{
			var out = 1;
			this.y -= (dy/Math.abs(dy));
		}
		else
		{
			//Loop through 16 pixel wide base
			for(var sec = 0; sec < 16; sec++)
			{
				if(dy > 0) //If moving down
				{
					//Get index of pixel at bottom of base
					var i = pixCoordToIndex(this.x + sec, this.y + 7, currentLevel.layerFuncData[this.layer]);		
				}
				else if(dy < 0) //If moving up
				{
					//Get index of pixel at top of base
					var i = pixCoordToIndex(this.x + sec, this.y, currentLevel.layerFuncData[this.layer]);
				}
				if(currentLevel.layerFuncData[this.layer].data[i] == 255) //If pixel on func map has R=255
				{
					//Don't worry if Y=255 (open air) and person is inAir
					if(this.inAir == 1 && currentLevel.layerFuncData[this.layer].data[i + 1] == 255) { }
					else //Otherwise, stop person
					{
						var stopped = 1;
						this.y -= (dy/Math.abs(dy));
						sec = 17;
						ind = Math.abs(dy) + 1;
					}
				}
				else if(currentLevel.layerFuncData[this.layer].data[i] == 100 && currentLevel.layerFuncData[this.layer].data[i + 1] == 0) //If R=255
				{
					//Prepare function
					resumeFunc = currentLevel.boardProgram[currentLevel.layerFuncData[this.layer].data[i + 2]];
					resumeCue = resumeFunc(0);
				}
			}
			if(stopped != 1 && this.oppTeam != null)
			{
				//Check for collision with people
				for(var sec = 0; sec < this.oppTeam.length; sec++)
				{
					if(Math.abs(this.y - this.oppTeam[sec].y) < 8)
					{
						if(Math.abs(this.x - this.oppTeam[sec].x) < 16)
						{
							if(this.pushy == 1 && this.oppTeam[sec].pushy == 1 && this.oppTeam[sec].pushed != 1)
							{
	//??????????????What's up with this .pushed?
								this.oppTeam[sec].pushed = 1;
								this.oppTeam[sec].zeldaBump(this.spd/2, this.dir);
								delete this.oppTeam[sec].pushed;
							}
							var stopped = 1;
							this.y -= (dy/Math.abs(dy));
							sec = 17;
							ind = Math.abs(dy) + 1;
						}
					}
				}
			}
		}
	}
/*	???????????????????Why is this here twice?
	var dir = this.dir;
	if(stopped == 1 && out != 1)
	{
		if(dir < 1 || dir > 3) //case 0:
		{
			var j = pixCoordToIndex(this.x + 16, this.y - 1, currentLevel.layerFuncData[this.layer]);
			var k = pixCoordToIndex(this.x + 16, this.y + 8, currentLevel.layerFuncData[this.layer]);
			if(currentLevel.layerFuncData[this.layer].data[j] != 255) { this.y -= 1; }
			if(currentLevel.layerFuncData[this.layer].data[k] != 255) { this.y += 1; }
		}
		if(dir > 0 && dir < 2) //case 1:
		{
			var j = pixCoordToIndex(this.x - 1, this.y - 1, currentLevel.layerFuncData[this.layer]);
			var k = pixCoordToIndex(this.x + 16, this.y - 1, currentLevel.layerFuncData[this.layer]);
			if(currentLevel.layerFuncData[this.layer].data[j] != 255) { this.x -= 1; }
			if(currentLevel.layerFuncData[this.layer].data[k] != 255) { this.x += 1; }
		}
		if(dir > 1 && dir < 3) //case 2:
		{
			var j = pixCoordToIndex(this.x - 1, this.y - 1, currentLevel.layerFuncData[this.layer]);
			var k = pixCoordToIndex(this.x - 1, this.y + 8, currentLevel.layerFuncData[this.layer]);
			if(currentLevel.layerFuncData[this.layer].data[j] != 255) { this.y -= 1; }
			if(currentLevel.layerFuncData[this.layer].data[k] != 255) { this.y += 1; }
		}
		if(dir > 2 && dir < 4) //case 3:
		{
			var j = pixCoordToIndex(this.x - 1, this.y + 8, currentLevel.layerFuncData[this.layer]);
			var k = pixCoordToIndex(this.x + 16, this.y + 8, currentLevel.layerFuncData[this.layer]);
			if(currentLevel.layerFuncData[this.layer].data[j] != 255) { this.x -= 1; }
			if(currentLevel.layerFuncData[this.layer].data[k] != 255) { this.x += 1; }
		}
	}*/
	//Handle x movement;
	for(var ind = 0; ind < Math.abs(dx); ind++)
	{
		this.x += (dx/Math.abs(dx));
		if(this.x >= currentLevel.layerImg[0].width || this.x < 0)
		{
			var out = 1;
			this.x -= (dx/Math.abs(dx));
		}
		else
		{
			//Check collision with map
			for(var sec = 0; sec < 8; sec++)
			{
				if(dx > 0)
				{
					var i = pixCoordToIndex(this.x + 15, this.y + sec, currentLevel.layerFuncData[this.layer]);		
				}
				else if(dx < 0)
				{
					var i = pixCoordToIndex(this.x, this.y + sec, currentLevel.layerFuncData[this.layer]);
				}
				if(currentLevel.layerFuncData[this.layer].data[i] == 255)
				{
					if(this.inAir == 1 && currentLevel.layerFuncData[this.layer].data[i + 1] == 255) { }
					else
					{
						var stopped = 1;
						this.x -= (dx/Math.abs(dx));
						sec = 17;
						ind = Math.abs(dx) + 1;
					}
				}
				else if(currentLevel.layerFuncData[this.layer].data[i] == 100 && currentLevel.layerFuncData[this.layer].data[i + 1] == 0)
				{
					resumeFunc = currentLevel.boardProgram[currentLevel.layerFuncData[this.layer].data[i + 2]];
					resumeCue = resumeFunc(0);
				}
			}
			if(stopped != 1 && this.oppTeam != null)
			{
				//Check for collision with people
				for(var sec = 0; sec < this.oppTeam.length; sec++)
				{
					if(Math.abs(this.x - this.oppTeam[sec].x) < 16)
					{
						if(Math.abs(this.y - this.oppTeam[sec].y) < 8)
						{
							if(this.pushy == 1 && this.oppTeam[sec].pushy == 1 && this.oppTeam[sec].pushed != 1)
							{
	//??????????????What's up with this .pushed?
								this.oppTeam[sec].pushed = 1;
								this.oppTeam[sec].zeldaBump(this.spd/2, this.dir);
								delete this.oppTeam[sec].pushed;
							}
							var stopped = 1;
							this.x -= (dx/Math.abs(dx));
							sec = 17;
							ind = Math.abs(dx) + 1;
						}
					}
				}
			}
		}
	}
	var dir = this.dir;
	//If stopped, help person out by sliding around corner
	if(stopped == 1 && out != 1)
	{
		ret = -1;
		if(dir < 1 || dir > 3) //case 0:
		{
			var j = pixCoordToIndex(this.x + 16, this.y - 1, currentLevel.layerFuncData[this.layer]);
			var k = pixCoordToIndex(this.x + 16, this.y + 8, currentLevel.layerFuncData[this.layer]);
			if(currentLevel.layerFuncData[this.layer].data[j] != 255) { this.y -= 1; }
			if(currentLevel.layerFuncData[this.layer].data[k] != 255) { this.y += 1; }
		}
		if(dir > 0 && dir < 2) //case 1:
		{
			var j = pixCoordToIndex(this.x - 1, this.y - 1, currentLevel.layerFuncData[this.layer]);
			var k = pixCoordToIndex(this.x + 16, this.y - 1, currentLevel.layerFuncData[this.layer]);
			if(currentLevel.layerFuncData[this.layer].data[j] != 255) { this.x -= 1; }
			if(currentLevel.layerFuncData[this.layer].data[k] != 255) { this.x += 1; }
		}
		if(dir > 1 && dir < 3) //case 2:
		{
			var j = pixCoordToIndex(this.x - 1, this.y - 1, currentLevel.layerFuncData[this.layer]);
			var k = pixCoordToIndex(this.x - 1, this.y + 8, currentLevel.layerFuncData[this.layer]);
			if(currentLevel.layerFuncData[this.layer].data[j] != 255) { this.y -= 1; }
			if(currentLevel.layerFuncData[this.layer].data[k] != 255) { this.y += 1; }
		}
		if(dir > 2 && dir < 4) //case 3:
		{
			var j = pixCoordToIndex(this.x - 1, this.y + 8, currentLevel.layerFuncData[this.layer]);
			var k = pixCoordToIndex(this.x + 16, this.y + 8, currentLevel.layerFuncData[this.layer]);
			if(currentLevel.layerFuncData[this.layer].data[j] != 255) { this.x -= 1; }
			if(currentLevel.layerFuncData[this.layer].data[k] != 255) { this.x += 1; }
		}
	}
	else if(out == 1)
	{
		ret = -1;
	}
	var stopped = 0;
	var out = 0;
	return ret;
}