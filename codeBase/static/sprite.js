SLVDEngine.Sprite = function(name, spriteSheet, team)
{
	this.name = name;
	this.img = spriteSheet;
	
//	this.dart = {};
//	this.dart.prototype = this;
};
SLVDEngine.SpriteTemplate = {};

SLVDEngine.Sprite.prototype.xres = 32;
SLVDEngine.Sprite.prototype.yres = 64;

//The SLVDEngine.Sprite's base is the collision area of the SLVDEngine.Sprite
SLVDEngine.Sprite.prototype.baseLength = 16;
SLVDEngine.Sprite.prototype.baseX = 16;
SLVDEngine.Sprite.prototype.baseY = 8;
//Standard offset of the base is 0--that is, x=0 is centered and y=0 is at bottom
SLVDEngine.Sprite.prototype.baseOffX = 0;
SLVDEngine.Sprite.prototype.baseOffY = 0;

SLVDEngine.Sprite.prototype.omniDir = false;
SLVDEngine.Sprite.prototype.rotate = 0;

SLVDEngine.Sprite.prototype.lvl;
SLVDEngine.Sprite.prototype.team = "neutral";
SLVDEngine.Sprite.prototype.x = 100;
SLVDEngine.Sprite.prototype.y = 100;
SLVDEngine.Sprite.prototype.offX = 0;
SLVDEngine.Sprite.prototype.offY = 0;
SLVDEngine.Sprite.prototype.layer = 0;
//SLVDEngine.Sprite.prototype.inAir = null;
//SLVDEngine.Sprite.prototype.mvmt = 1; //0 - still; 1 - random moving; 2 - back and forth; 4 - square
//SLVDEngine.Sprite.prototype.speech; //0/"" or message
SLVDEngine.Sprite.prototype.dmnr = 1; //0 - peaceful; 1 - excitable; 2 - aggressive
SLVDEngine.Sprite.prototype.dir = 3;
SLVDEngine.Sprite.prototype.steps = 0;// = 5;
SLVDEngine.Sprite.prototype.wait;// = 0;

SLVDEngine.Sprite.prototype.act = [];
SLVDEngine.Sprite.prototype.pushAct = function(item) {
	if(this.act.length == 0) {
		this.act = [];
	}
	this.act.push(item);
};
SLVDEngine.Sprite.prototype.spliceAct = function(index, length) {
	this.act.splice(index, length);
	if(this.act.length <= 0)
	{
		delete this.act;
	}
};
SLVDEngine.Sprite.prototype.actSet = [];
SLVDEngine.Sprite.prototype.rcvr = 0;
SLVDEngine.Sprite.prototype.getAct = function(index) {
	return this.act[index];
};
SLVDEngine.Sprite.prototype.getActTime = function(index) {
	return this.act[index][1];
}
SLVDEngine.Sprite.prototype.getActOpt = function(index) {
	return this.actSet[index];
};
SLVDEngine.Sprite.prototype.getActOptProb = function(index) {
	return this.actSet[index].prob;
};
SLVDEngine.Sprite.prototype.handleAction = function() {
	if(this.canAct)
	{
		//Start new action
		var newAct = this.pickAction();
		if(newAct !== null)
		{
			this.pushAct(newAct);
			newAct.use(this);
		}
		
		//Handle persistent actions
		for(var i = 0; i < this.act.length; i++)
		{
			var currentAct = this.getAct(i);
			currentAct.update(this);
			if(currentAct.time <= 0)
			{
				this.spliceAct(i, 1);
				if(SLVDEngine.process == "TRPG")
				{
					SLVDEngine.TRPGNextTurn(); //in TRPG.js
				}
			}
		}
	}
};
SLVDEngine.Sprite.prototype.pickAction = function() {
	var actSet = [];
	var rand;
	var totProb = 0;
	//Create a list of useable actions
	for(var i = 0; i < this.actSet.length; i++)
	{
		var actOpt = this.getActOpt(i);
		if(actOpt.canUse(this))
		{
			var typeTaken = false;
			for(var j = 0; j < this.act.length; j++)
			{
				if(actOpt.type == this.getAct(j).type)
				{
					typeTaken = true;
					j = this.act.length;
				}
			}
			if(!typeTaken)
			{
				actSet.push(actOpt);
				totProb += actOpt.getProbability();
			}
		}
	}

	//In case of one (will normally work unless "zero probability" of default actions)
	if(actSet.length > 0 && totProb <= 0)
	{
		return actSet[0];
	}
	
	//Pick random action based on probabilities
	var rand = SLVD.randomInt(totProb);
	var partProb = 0;
	for(var i = 0; i < actSet.length; i++)
	{
		partProb += actSet[i].getProbability();
		if(rand <= partProb)
		{
			return actSet[i];
		}
	}
	return null;
};
SLVDEngine.Sprite.prototype.requestAction = function(action) {
	if(this.canAct)
	{
		var typeTaken = false;
		for(var j = 0; j < this.act.length; j++)
		{
			if(action.type == this.getAct(j).type)
			{
				typeTaken = true;
				j = this.act.length;
			}
		}
		if(!typeTaken)
		{
			this.pushAct(action);
			action.use(this);
		}
	}
};
SLVDEngine.Sprite.prototype.seeAction = function() {
	for(var i = 0; i < this.act.length; i++)
	{
		this.act[i].see(this);
	}	
};

SLVDEngine.Sprite.prototype.status = [];
SLVDEngine.Sprite.prototype.handleStatus = function() {
	if(this.status.length > 0)
	{
		for(var i = 0; i < this.status.length; i++)
		{
			var currentStatus = this.status[i];
			currentStatus.apply(this);
			currentStatus.time--;
			if(currentStatus.time <= 0)
			{
				this.status.splice(i, 1);
			}
		}
	}
};
SLVDEngine.Sprite.prototype.seeStatus = function() {
	for(var i = 0; i < this.status.length; i++)
	{
		this.status[i].see(this);
	}
};

//SLVDEngine.Sprite.prototype.moveSet = [];

SLVDEngine.Sprite.prototype.keyFunc = {};

SLVDEngine.Sprite.prototype.pushy = true;

SLVDEngine.Sprite.prototype.frame = 0;

SLVDEngine.Sprite.prototype.stance = 0;
SLVDEngine.Sprite.prototype.defaultStance = function() {
	if(!this.omniDir)
	{
		this.stance = SLVDEngine.determineColumn(this.dir);
	}
	else
	{
		this.stance = 0;
	}
};
SLVDEngine.Sprite.prototype.getStance = function() {
	return this.stance;
};
SLVDEngine.Sprite.prototype.requestStance = function(col) {
	this.stance = col;
};
SLVDEngine.Sprite.prototype.resetStance = function() {
	delete this.stance;
};

SLVDEngine.Sprite.prototype.hp = 100;
SLVDEngine.Sprite.prototype.strg = 5;
SLVDEngine.Sprite.prototype.spd = 2;

SLVDEngine.Sprite.prototype.path = [];
SLVDEngine.Sprite.prototype.addPointToPath = function(x, y) {
	if(this.path.x.length === 0)
	{
		this.path = [];
	}
	this.path.unshift({x: x, y: y});
};

SLVDEngine.Sprite.prototype.canAct = true;
//SLVDEngine.Sprite.prototype.canMove = true;
SLVDEngine.Sprite.prototype.canSeeAct = true;
//SLVDEngine.Sprite.prototype.canSeeMove = true;
SLVDEngine.Sprite.prototype.canSeeStatus = true;
SLVDEngine.Sprite.prototype.canSee = true;

SLVDEngine.Sprite.prototype.getHp = function() {
	return this.hp;
};
SLVDEngine.Sprite.prototype.getImage = function() {
	if(this.img)
	{
		if(!(this.img in SLVDEngine.image))
		{
			SLVDEngine.image[this.img] = new Image();
			SLVDEngine.image[this.img].src = "files/images/" + this.img.replace(/\"/g, "");
		}
		//this.img = SLVDEngine.image[this.img];
	}
	return SLVDEngine.image[this.img];
}
SLVDEngine.Sprite.prototype.getMaxHp = function() {
	return 100;
};
SLVDEngine.Sprite.prototype.getPosition = function() {
	var pos = {};
	pos.x = this.x;
	pos.y = this.y;
	pos.layer = this.layer;
	return pos;
};	
SLVDEngine.Sprite.prototype.getShownPosition = function() {
	var pos = {};
	pos.x = this.x;
	pos.y = this.y;
	pos.layer = this.layer;
	return pos;
};
SLVDEngine.Sprite.prototype.getShownX = function() {
	return this.x;
};
SLVDEngine.Sprite.prototype.getShownY = function() {
	return this.y;
};
SLVDEngine.Sprite.prototype.getSpeed = function() {
	return this.spd;
};
SLVDEngine.Sprite.prototype.getStrength = function() {
	return this.strg;
};
SLVDEngine.Sprite.prototype.getTeam = function() {
	return SLVDEngine.Teams[this.team];
}

SLVDEngine.Sprite.prototype.preventAction = function() { this.canAct = false; };
SLVDEngine.Sprite.prototype.preventActionSee = function() { this.canSeeAct = false; };
SLVDEngine.Sprite.prototype.preventStatusSee = function() { this.canSeeStatus = false; };
SLVDEngine.Sprite.prototype.preventRender = function() { this.canSee = false; };
SLVDEngine.Sprite.prototype.resetCans = function() { delete this.canSee; delete this.canAct; delete this.canSeeAct; delete this.canSeeStatus; };

SLVDEngine.Sprite.prototype.dart = {};

//Checks if the a SLVDEngine.Sprite's location is valid (based on current location and layer func data)
SLVDEngine.Sprite.prototype.canBeHere = function(allowInAir) {
	for(var ind = 0; ind < 8; ind++)
	{
		for(var sec = 0; sec < 16; sec++)
		{
			var i = SLVDEngine.pixCoordToIndex(person.x + sec, person.y + ind, SLVDEngine.currentLevel.layerFuncData[person.layer]);
			if(SLVDEngine.currentLevel.layerFuncData[person.layer].data[i] == 255)
			{
				if(allowInAir == 1 && SLVDEngine.currentLevel.layerFuncData[person.layer].data[i + 1] == 255) { }
				else return 0;
			}
		}
	}
	return 1;
};

SLVDEngine.Sprite.prototype.canSeePlayer = function() {
	var tDir = SLVDEngine.dirFromTo(this.x, this.y, SLVDEngine.player[SLVDEngine.currentPlayer].x, SLVDEngine.player[SLVDEngine.currentPlayer].y);
	return (Math.abs(tDir - this.dir) < 1 || Math.abs(tDir - this.dir) > 3)
};

SLVDEngine.Sprite.prototype.damage = function(amount) {
	this.hp -= amount;
};

//All of the "give" functions are intended to be passed a "new" object
SLVDEngine.Sprite.prototype.giveAction = function(action, keyFuncHandle) {
	if(this.actSet.length == 0)
	{
		this.actSet = [];
	}
	
	if((typeof action) == "string")
	{
		action = new SLVDEngine.Action[action];
	}
	
	this.actSet.push(action);
	
	if(keyFuncHandle !== undefined)
	{
		var tempKeyFunc = {};
		
		for(var i in this.keyFunc)
		{
			tempKeyFunc[i] = this.keyFunc[i];
		}
		
		tempKeyFunc[keyFuncHandle] = (function(person, act) {
			console.log("assigned " + person + " with " + act + " on " + keyFuncHandle);
			return function() {
				console.log("using action");
				person.pushAct(act);
				act.use(person);
			}
		} (this, action));
		
		this.keyFunc = tempKeyFunc;
	}
};
SLVDEngine.Sprite.prototype.giveStatus = function(status) {
	if(this.status.length == 0)
	{
		this.status = [];
	}
	
	if((typeof status) == "string")
	{
		status = new SLVDEngine.Status[status];
	}
	
	this.status.push(status); 
};

SLVDEngine.Sprite.prototype.hasStatus = function(status) {
	if((typeof status) == "string")
	{
		status = SLVDEngine.Status[status];
	}

	for(var i = 0; i < this.status.length; i++)
	{
		if(this.status[i] instanceof status)
		{
			return true;
		}
	}
	return false;
};

//Move a person along their set path at given speed.
SLVDEngine.Sprite.prototype.pathMotion = function(spd) {
	var dist = Math.sqrt(Math.pow(this.x - this.path[0].x, 2) + Math.pow(this.y - this.path[0].y, 2))
	if(dist == 0)
	{
		this.path.shift();

		if(this == SLVDEngine.cTeam[SLVDEngine.currentPlayer] && this.path.length == 0)
		{
			if(!resumeCue)	{ }
			else { resumeCue = resumeFunc(resumeCue); }
		}
	}
	else
	{
		this.zeldaLockOnPoint(this.path[0].x, this.path[0].y);
		var jump;
//		if(Math.round(dist) < spd) { jump = Math.round(dist); }
		if(dist < spd) { jump = dist; }
		else { jump = spd; }
		this.y -= Math.round(jump*Math.sin((this.dir)*(Math.PI/2)));
		this.x += Math.round(jump*Math.cos((this.dir)*(Math.PI/2)));	
	}
};

//Based in time.js, this SLVDEngine.provides = function simple interface for setting a timed sequence of movement events for Sprites 
SLVDEngine.Sprite.prototype.registerWalkEvent = function(eventA, isDaily, day, hour, minute, second) {
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
	var cTime = SLVDEngine.Time.componentToAbsolute(day, hour, minute, second);
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
			var tDir = SLVDEngine.dirFromTo(cx, cy, nx, ny); //in functions.js
			
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
				var event = new Function("var tNPC = SLVDEngine.getNPCByName(\"" + this.name + "\"); tNPC.walkPath(" + ptA.toString() + ");");
				SLVDEngine.Time.registerEvent(event, isDaily, cTime);
				ptA.length = 0;
				cTime = nTime + 8; //tack on a few extra frames to be safe
			}
			
			if(eventA[i] == "put")
			{
				var event = new Function("var tNPC = SLVDEngine.getNPCByName(\"" + this.name + "\"); tNPC.x = " + eventA[i + 1] + "; tNPC.y = " + eventA[i + 2] + "; tNPC.layer = " + eventA[i + 3] + ";");
				SLVDEngine.Time.registerEvent(event, isDaily, cTime);
				i += 4;
				
				nx = eventA[i + 1];
				ny = eventA[i + 2];
			}
			else if(eventA[i] == "send")
			{
				var event = new Function("var tNPC = SLVDEngine.getNPCByName(\"" + this.name + "\"); tNPC.lvl = " + eventA[i + 1] + "; tNPC.x = " + eventA[i + 2] + "; tNPC.y = " + eventA[i + 3] + "; tNPC.layer = " + eventA[i + 4] + ";");
				SLVDEngine.Time.registerEvent(event, isDaily, cTime);
				i += 5;
				
				nx = eventA[i + 2];
				ny = eventA[i + 3];
			}
			else if(eventA[i] == "function")
			{
				SLVDEngine.Time.registerEvent(eventA[i + 1], isDaily, cTime);
			}
		}
	}
};;

SLVDEngine.Sprite.prototype.see = function(ctx) {
	if(!ctx)
	{
		ctx = SLVDEngine.see;
	}
	
	if(!this.canSee) return;
	
	var canvSeeX = this.x - SLVDEngine.wX - SLVDEngine.SCREENX/2 + this.offX - SLVDEngine.player[SLVDEngine.currentPlayer].offX;
	var canvSeeY = this.y - SLVDEngine.wY - SLVDEngine.SCREENY/2 + this.offY - SLVDEngine.player[SLVDEngine.currentPlayer].offY;
	
	if(canvSeeX < -SLVDEngine.SCREENX || canvSeeY < -SLVDEngine.SCREENY || canvSeeX > SLVDEngine.SCREENX || canvSeeY > SLVDEngine.SCREENY)
	{
		return;
	}
	
//	ctx.setTransform(1, 0, 0, 1, 0, 0);
	
	ctx.translate(this.x - SLVDEngine.wX + this.offX - SLVDEngine.player[SLVDEngine.currentPlayer].offX, this.y - SLVDEngine.wY + this.offY - SLVDEngine.player[SLVDEngine.currentPlayer].offY);
	
	ctx.rotate(this.rotate);
	
	//SLVDEngine.boardSprite is displayed partially transparent depending on health (<= 50% transparent)
	//ctx.globalAlpha = (this.hp + this.strg)/(2*this.strg);
		
	var col = this.getStance(); //in functions.js
	var tImg = this.getImage();
	var sx = this.xres*col;
	var sy = this.yres*this.frame;
	var pos = this.getShownPosition();
	var x = -this.xres/2 - this.baseOffX;
	var y = -this.yres + this.baseLength/2 - this.baseOffY;
	ctx.drawImage(tImg, sx, sy, this.xres, this.yres, x, y, this.xres, this.yres);
	
	//ctx.globalAlpha = 1;	
	
	this.seeAction();
	this.seeStatus();
	
	//ctx.rotate(-this.rotate);
	
	ctx.setTransform(1, 0, 0, 1, 0, 0);

	delete this.rotate;
};

SLVDEngine.Sprite.prototype.updateFrame = function() {
	//Only update on frame tick
	if(SLVDEngine.frameClock == 1)
	{
		this.frame++;
		if(this.getImage().height <= this.frame*this.yres)
		{
			this.frame = 0;
		}
	}
};

//(x1, y1, x2, y2, ...)
SLVDEngine.Sprite.prototype.walkPath = function() {
	if(SLVDEngine.currentLevel == this.level)
	{
		var spd = this.spd;
		for(var i = 0; i < arguments.length; i += 2)
		{
			this.addPointToPath(arguments[i], arguments[i + 1]);
		}
	}
	else
	{
		this.x = arguments[arguments.length - 2];
		this.y = arguments[arguments.length - 1];
	}
};

//zeldaStep but with input direction
SLVDEngine.Sprite.prototype.zeldaBump = function(distance, direction) {
	//Save direction
	var tDir = this.dir;
	//Set direction
	this.dir = direction;
	//Bump
	this.zeldaStep(distance);
	//Revert direction;
	this.dir = tDir;
};

SLVDEngine.Sprite.prototype.zeldaCheckStep = function(axis, altAxis, isPositive) {
	var pixel;
	var coords = {};	

	coords[axis] = isPositive ? this[axis] + Math.round(this.baseLength/2) - 1 : this[axis] - Math.round(this.baseLength/2);
	
	//Loop through width of base
	for(var i = -this.baseLength/2; i < this.baseLength/2; i++)
	{
		coords[altAxis] = this[altAxis] + i;
		pixel = SLVDEngine.getPixel(coords.x, coords.y, SLVDEngine.currentLevel.layerFuncData[this.layer]);
		if(pixel[0] == 255) //If pixel on func map has R=255
		{
			//Don't worry if Y=255 (open air) and person is inAir
			if(this.inAir == 1 && pixel[1] == 255) { }
			else //Otherwise, stop person
			{
				return true;
			}
		}
		else if(pixel[0] == 100 && pixel[1] == 0) //If R=255 & G=0
		{
			//Prepare function
			resumeFunc = SLVDEngine.currentLevel.boardProgram[pixel[2]];
			resumeCue = resumeFunc(0);
		}		
	}
	
	//Check for collision with people
	for(var i = 0; i < SLVDEngine.boardAgent.length; i++)
	{
		var currentAgent = SLVDEngine.boardAgent[i];
		if(this.team != currentAgent.team && currentAgent.baseLength > 0)
		{
			var collisionDist = this.baseLength + currentAgent.baseLength;
//			if(Math.abs(this.y - currentAgent.y) < collisionDist)
			if(SLVDEngine.distanceTrue(this.x, this.y, currentAgent.x, currentAgent.y) < collisionDist)
			{
//				if(Math.abs(this.x - currentAgent.x) < collisionDist)
//				{
					//The .pushing here ensures that there is no infinite loop of pushing back and forth
					if(this.pushy && currentAgent.pushy && currentAgent.pushing != this)
					{
						this.pushing = currentAgent;
						currentAgent.zeldaBump(this.spd/2, this.dir);
						delete this.pushing;
					}
					return true;
//				}
			}
		}
	}
	
	return false;
}

SLVDEngine.Sprite.prototype.zeldaLockOnPlayer = function() {
	this.zeldaLockOnPoint(SLVDEngine.player[SLVDEngine.currentPlayer].x, SLVDEngine.player[SLVDEngine.currentPlayer].y);
};
	
SLVDEngine.Sprite.prototype.zeldaLockOnPoint = function(qx, qy) {
	this.dir = SLVDEngine.dirFromTo(this.x, this.y, qx, qy);
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
};

//*********Advances SLVDEngine.Sprite person up to distance distance as far as is legal. Includes pushing other Sprites out of the way? Returns -1 if stopped before distance?
SLVDEngine.Sprite.prototype.zeldaStep = function(distance) {
	var stopped = false;
	var stoppedTemp = false;
	var out = false;
	var ret = 1; //value to return at end
	var dy = -(Math.round(distance*Math.sin((this.dir)*(Math.PI/2)))); //Total y distance to travel
	var dx = Math.round(distance*Math.cos((this.dir)*(Math.PI/2))); //Total x distance to travel
	//Handle y movement
	for(var i = 0; i < Math.abs(dy); i++)
	{
		this.y += (dy/Math.abs(dy));
		//Check if out of bounds
		if(this.y >= SLVDEngine.currentLevel.layerImg[0].height || this.y < 0)
		{
			out = true;
		}
		else
		{
			stoppedTemp = this.zeldaCheckStep("y", "x", dy > 0);
		}
		
		if(stoppedTemp || out)
		{
			this.y -= (dy/Math.abs(dy));
			i = Math.abs(dy);
		}
	}
	stopped = stoppedTemp;
	//Handle x movement;
	for(var i = 0; i < Math.abs(dx); i++)
	{
		this.x += (dx/Math.abs(dx));
		if(this.x >= SLVDEngine.currentLevel.layerImg[0].width || this.x < 0)
		{
			out = true;
		}
		else
		{
			stoppedTemp = this.zeldaCheckStep("x", "y", dx > 0);
		}
		
		if(stoppedTemp || out)
		{
			this.x -= (dx/Math.abs(dx));
			i = Math.abs(dx);
		}
	}
	stopped = stoppedTemp || stopped;
	var dir = this.dir;
	//If stopped, help person out by sliding around corner
	if(stopped && !out )
	{
		ret = -1;
		for(var i = 0; i < 1; i++)
		{
		
		if(dir < 1 || dir > 3) //case 0:
		{
			var j = SLVDEngine.pixCoordToIndex(this.x + 16, this.y - 1, SLVDEngine.currentLevel.layerFuncData[this.layer]);
			var k = SLVDEngine.pixCoordToIndex(this.x + 16, this.y + 8, SLVDEngine.currentLevel.layerFuncData[this.layer]);
			if(SLVDEngine.currentLevel.layerFuncData[this.layer].data[j] != 255) { this.y -= 1; }
			if(SLVDEngine.currentLevel.layerFuncData[this.layer].data[k] != 255) { this.y += 1; }
		}
		if(dir > 0 && dir < 2) //case 1:
		{
			var j = SLVDEngine.pixCoordToIndex(this.x - 1, this.y - 1, SLVDEngine.currentLevel.layerFuncData[this.layer]);
			var k = SLVDEngine.pixCoordToIndex(this.x + 16, this.y - 1, SLVDEngine.currentLevel.layerFuncData[this.layer]);
			if(SLVDEngine.currentLevel.layerFuncData[this.layer].data[j] != 255) { this.x -= 1; }
			if(SLVDEngine.currentLevel.layerFuncData[this.layer].data[k] != 255) { this.x += 1; }
		}
		if(dir > 1 && dir < 3) //case 2:
		{
			var j = SLVDEngine.pixCoordToIndex(this.x - 1, this.y - 1, SLVDEngine.currentLevel.layerFuncData[this.layer]);
			var k = SLVDEngine.pixCoordToIndex(this.x - 1, this.y + 8, SLVDEngine.currentLevel.layerFuncData[this.layer]);
			if(SLVDEngine.currentLevel.layerFuncData[this.layer].data[j] != 255) { this.y -= 1; }
			if(SLVDEngine.currentLevel.layerFuncData[this.layer].data[k] != 255) { this.y += 1; }
		}
		if(dir > 2 && dir < 4) //case 3:
		{
			var j = SLVDEngine.pixCoordToIndex(this.x - 1, this.y + 8, SLVDEngine.currentLevel.layerFuncData[this.layer]);
			var k = SLVDEngine.pixCoordToIndex(this.x + 16, this.y + 8, SLVDEngine.currentLevel.layerFuncData[this.layer]);
			if(SLVDEngine.currentLevel.layerFuncData[this.layer].data[j] != 255) { this.x -= 1; }
			if(SLVDEngine.currentLevel.layerFuncData[this.layer].data[k] != 255) { this.x += 1; }
		}
		}
	}
	else if(out == 1)
	{
		ret = -1;
	}
	stopped = false;
	out = false;
	return ret;
};