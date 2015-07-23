SLVDEngine.showImage = function(file, duration, waitForEnterSpace) {
	//SLVDEngine.process = "wait";
	SLVDEngine.see.drawImage(file, 0, 0, SLVDEngine.SCREENX, SLVDEngine.SCREENY);
	return SLVDEngine.delay(duration).then(function() {
		if(waitForEnterSpace)
		{
			return SLVDEngine.waitForEnterOrSpace();
		}
		else
		{
			//var oneTimePromise = new SLVD.promise();
			//oneTimePromise.resolve();
			//return oneTimePromise;
			return SLVD.promise.as();
		}
	});
}

SLVDEngine.menu = function() {
	this.point = [];
};

SLVDEngine.menu.prototype.cursor;
SLVDEngine.menu.prototype.point = [];

SLVDEngine.menu.prototype.addPoint = function(x, y) {
	var index = this.point.length;
	this.point[index] = { x: x, y: y };
};

SLVDEngine.menu.prototype.runMenu = function() {
	this.currentPoint = 0;
	delete this.chosenPoint;
	SLVDEngine.process = "menu";
	SLVDEngine.currentMenu = this;
	return SLVDEngine.setupMainPromise();
};

SLVDEngine.menu.prototype.killPoints = function() {
	this.point.length = 0;
	this.update = null;
};

SLVDEngine.menu.prototype.update = function() {}; //Customizable function; run every frame

SLVDEngine.menu.prototype.handleMenu = function() {
	/*This menu system navigates on a grid even though points are listed linearly.
	/*Basically, the code finds the closest point (in the direction of the key press 
	to the current point that is within a 90 degree viewing angle from the point in that direction.*/
	//Draw menu background
//	SLVDEngine.see.drawImage(this.background, 0, 0);
	//Draw cursor
//	SLVDEngine.see.drawImage(this.cursor, this.point[this.currentPoint].x, this.point[this.currentPoint].y);
	var prevPoint = this.currentPoint;
	var iPoint = prevPoint;
	var bestPoint = iPoint;
	var bestdx = 1000; //Distance from prevPoint to bestPoint
	var bestdy = 1000;
	if(SLVDEngine.keyFirstDown == "a" || SLVDEngine.keyFirstDown == "left") //Left
	{
		do //While index point does not equal original point
		{
			var isLeft = this.point[iPoint].x < this.point[prevPoint].x;
			if(isLeft)
			{
				var isUnderUpperBound = this.point[iPoint].y <= -this.point[iPoint].x + this.point[prevPoint].x + this.point[prevPoint].y;
				var isAboveLowerBound = this.point[iPoint].y >= this.point[iPoint].x - this.point[prevPoint].x + this.point[prevPoint].y;
			}
			else
			{
				var isUnderUpperBound = this.point[iPoint].y <= -this.point[iPoint].x + (this.point[prevPoint].x + SLVDEngine.SCREENX) + this.point[prevPoint].y;
				var isAboveLowerBound = this.point[iPoint].y >= this.point[iPoint].x - (this.point[prevPoint].x + SLVDEngine.SCREENX) + this.point[prevPoint].y;
			}
			if(isUnderUpperBound && isAboveLowerBound) //Point within 90 degree viewing window
			{
				var testdx = this.point[prevPoint].x - this.point[iPoint].x;
				if(!isLeft) testdx += SLVDEngine.SCREENX;
				var testdy = Math.abs(this.point[prevPoint].y - this.point[iPoint].y);
				if(testdx <= bestdx)
				{
					var setNewBest = true;
					if(testdx == bestdx && testdy > bestdy) setNewBest = false;
					if(setNewBest)
					{
						bestdx = testdx;
						bestdy = testdy;
						bestPoint = iPoint;
					}	
				}
			}
			iPoint = (this.point.length + iPoint - 1)%this.point.length;
		} while(iPoint != prevPoint);
		this.currentPoint = bestPoint;
	}
	else if(SLVDEngine.keyFirstDown == "w" || SLVDEngine.keyFirstDown == "up") //Up
	{
		do //While index point does not equal original point
		{
			var isUp = this.point[iPoint].y < this.point[prevPoint].y;
			if(isUp)
			{
				var isAboveLowerBound = this.point[iPoint].x <= -this.point[iPoint].y + this.point[prevPoint].y + this.point[prevPoint].x;
				var isUnderUpperBound = this.point[iPoint].x >= this.point[iPoint].y - this.point[prevPoint].y + this.point[prevPoint].x;
			}
			else
			{
				var isAboveLowerBound = this.point[iPoint].x <= -this.point[iPoint].y + (this.point[prevPoint].y + SLVDEngine.SCREENY) + this.point[prevPoint].x;
				var isUnderUpperBound = this.point[iPoint].x >= this.point[iPoint].y - (this.point[prevPoint].y + SLVDEngine.SCREENY) + this.point[prevPoint].x;
			}
			if(isUnderUpperBound && isAboveLowerBound) //Point within 90 degree viewing window
			{
				var testdy = this.point[prevPoint].y - this.point[iPoint].y;
				if(!isUp) testdy += SLVDEngine.SCREENY;
				var testdx = Math.abs(this.point[prevPoint].x - this.point[iPoint].x);
				if(testdy <= bestdy)
				{
					var setNewBest = true;
					if(testdy == bestdy && testdx > bestdx) setNewBest = false;
					if(setNewBest)
					{
						bestdx = testdx;
						bestdy = testdy;
						bestPoint = iPoint;
					}	
				}
			}
			iPoint = (this.point.length + iPoint - 1)%this.point.length;
		} while(iPoint != prevPoint);
		this.currentPoint = bestPoint;
		//		this.currentPoint = (this.point.length + this.currentPoint - 1)%this.point.length;
	}
	else if(SLVDEngine.keyFirstDown == "d" || SLVDEngine.keyFirstDown == "right") //Right
	{
		do //While index point does not equal original point
		{
			var isRight = this.point[iPoint].x > this.point[prevPoint].x;
			if(isRight)
			{
				var isUnderUpperBound = this.point[iPoint].y >= -this.point[iPoint].x + this.point[prevPoint].x + this.point[prevPoint].y;
				var isAboveLowerBound = this.point[iPoint].y <= this.point[iPoint].x - this.point[prevPoint].x + this.point[prevPoint].y;
			}
			else
			{
				var isUnderUpperBound = this.point[iPoint].y >= -this.point[iPoint].x + (this.point[prevPoint].x - SLVDEngine.SCREENX) + this.point[prevPoint].y;
				var isAboveLowerBound = this.point[iPoint].y <= this.point[iPoint].x - (this.point[prevPoint].x - SLVDEngine.SCREENX) + this.point[prevPoint].y;
			}
			if(isUnderUpperBound && isAboveLowerBound) //Point within 90 degree viewing window
			{
				var testdx =  this.point[iPoint].x - this.point[prevPoint].x;
				if(!isRight) testdx += SLVDEngine.SCREENX;
				var testdy = Math.abs(this.point[prevPoint].y - this.point[iPoint].y);
				if(testdx <= bestdx)
				{
					var setNewBest = true;
					if(testdx == bestdx && testdy > bestdy) setNewBest = false;
					if(setNewBest)
					{
						bestdx = testdx;
						bestdy = testdy;
						bestPoint = iPoint;
					}	
				}
			}
			iPoint = (iPoint + 1)%this.point.length;
		} while(iPoint != prevPoint);
		this.currentPoint = bestPoint;
		//this.currentPoint = (this.currentPoint + 1)%this.point.length;
	}
	else if(SLVDEngine.keyFirstDown == "s" || SLVDEngine.keyFirstDown == "down") //Down
	{
		do //While index point does not equal original point
		{
			var isUp = this.point[iPoint].y > this.point[prevPoint].y;
			if(isUp)
			{
				var isUnderUpperBound = this.point[iPoint].x >= -this.point[iPoint].y + this.point[prevPoint].y + this.point[prevPoint].x;
				var isAboveLowerBound = this.point[iPoint].x <= this.point[iPoint].y - this.point[prevPoint].y + this.point[prevPoint].x;
			}
			else
			{
				var isUnderUpperBound = this.point[iPoint].x >= -this.point[iPoint].y + (this.point[prevPoint].y - SLVDEngine.SCREENY) + this.point[prevPoint].x;
				var isAboveLowerBound = this.point[iPoint].x <= this.point[iPoint].y - (this.point[prevPoint].y - SLVDEngine.SCREENY) + this.point[prevPoint].x;
			}
			if(isUnderUpperBound && isAboveLowerBound) //Point within 90 degree viewing window
			{
				var testdy = this.point[iPoint].y - this.point[prevPoint].y;
				if(!isUp) testdy += SLVDEngine.SCREENY;
				var testdx = Math.abs(this.point[prevPoint].x - this.point[iPoint].x);
				if(testdy <= bestdy)
				{
					var setNewBest = true;
					if(testdy == bestdy && testdx > bestdx) setNewBest = false;
					if(setNewBest)
					{
						bestdx = testdx;
						bestdy = testdy;
						bestPoint = iPoint;
					}	
				}
			}
			iPoint = (iPoint + 1)%this.point.length;
		} while(iPoint != prevPoint);
		this.currentPoint = bestPoint;
//		this.currentPoint = (this.currentPoint + 1)%this.point.length;
	}
}

//File selection SLVDEngine.menu
SLVDEngine.setupFileSelect = function() {
	opMenu.killPoints();
	opMenu.cursor = SLVDEngine.image["torchCursor.png"];
	opMenu.background = SLVDEngine.buffer;

	SLVDEngine.canvasBlackout(SLVDEngine.bufferCtx);
	SLVDEngine.bufferCtx.fillStyle = "#FFFFFF";
	SLVDEngine.bufferCtx.font = "20px Arial";
	SLVDEngine.bufferCtx.fillText("Select a file.", 10, 30);
	for(var col = 0; col < 3; col++)
	{
		for(var index = 1; index <= 7; index++)
		{
			var fileName = (index + col*7);
			SLVDEngine.bufferCtx.fillText(fileName, 40 + 200*col, 10 + 60*index);
			opMenu.addPoint(10 + 200*col, 60*index);
			try
			{
				var item = localStorage.getItem(GAMEID + "_" + fileName + "_SAVE");
				var tSAVE = JSON.parse(item);
				SLVDEngine.bufferCtx.fillText(tSAVE.timeDays + "." + tSAVE.timeHours + "." + tSAVE.timeMinutes + "." + tSAVE.timeSeconds, 40 + 200*col, 35 + 60*index);
			}
			catch(e)
			{
				SLVDEngine.bufferCtx.fillText("No Save Data", 40 + 200*col, 35 + 60*index);
			}
		}
	}
};

SLVDEngine.setupActionMenu = function() {
	opMenu.killPoints();
	opMenu.cursor = SLVDEngine.image["blueSquare.png"];
	opMenu.background = SLVDEngine.buffer;

	SLVDEngine.canvasBlackout(SLVDEngine.bufferCtx);
	SLVDEngine.bufferCtx.fillStyle = "#FFFFFF";
	SLVDEngine.bufferCtx.font = "20px Arial";
	SLVDEngine.bufferCtx.fillText("Select a file.", 10, 30);
	for(var col = 0; col < 3; col++)
	{
		for(var index = 1; index <= 7; index++)
		{
			var fileName = "File " + (index + col*7);
			SLVDEngine.bufferCtx.fillText(fileName, 40 + 200*col, 10 + 60*index);
			opMenu.addPoint(10 + 200*col, 60*index);
			try
			{
				var item = localStorage.getItem("FULLMAVEN_" + fileName + "_SAVE");
				var tSAVE = JSON.parse(item);
				SLVDEngine.bufferCtx.fillText(tSAVE.timeDays + "." + tSAVE.timeHours + "." + tSAVE.timeMinutes + "." + tSAVE.timeSeconds, 40 + 200*col, 35 + 60*index);
			}
			catch(e)
			{
				SLVDEngine.bufferCtx.fillText("No Save Data", 40 + 200*col, 35 + 60*index);
			}
		}
	}
};

SLVDEngine.drawAwesomeRect = function(sx, sy, ex, ey, context, px, py, down) {
	context.beginPath();
	context.moveTo(sx + 10, sy);
	if(px && py && down)
	{
		context.lineTo((sx + ex)/2 - 10, sy);
		context.lineTo(px, py);
		context.lineTo((sx + ex)/2 + 10, sy);
	}	
	context.lineTo(ex - 10, sy);
	context.arc(ex - 10, sy + 10, 10, 1.5*Math.PI, 0*Math.PI, false);
	context.lineTo(ex, ey - 10);
	context.arc(ex - 10, ey - 10, 10, 0, .5*Math.PI, false);
	if(px && py && !down)
	{
		context.lineTo((sx + ex)/2 + 10, ey);
		context.lineTo(px, py);
		context.lineTo((sx + ex)/2 - 10, ey);
	}
	context.lineTo(sx + 10, ey);
	context.arc(sx + 10, ey - 10, 10, .5*Math.PI, 1*Math.PI, false);
	context.lineTo(sx, sy + 10);
	context.arc(sx + 10, sy + 10, 10, 1*Math.PI, 1.5*Math.PI, false);
	context.closePath();
	
	context.strokeStyle = "rgba(255, 255, 255, .8)";
	context.lineWidth = 3;
	context.stroke();

	var grd = context.createLinearGradient(0, sy, 0, ey);
	grd.addColorStop(0, "rgba(50, 100, 200, .4)");
	grd.addColorStop("0.5", "rgba(50, 100, 220, .9)");
	grd.addColorStop(1, "rgba(50, 100, 200, .4)");
	context.fillStyle = grd;
	context.fill();
};

SLVDEngine.personSays = function(persOb, message, overrideName) {
	SLVDEngine.renderBoardState(); //in SLVDEngine.main.js

	var tSpkr = overrideName || persOb.name;
	
	var py = persOb.y - SLVDEngine.wY - persOb.yres + 5;
	//if(persOb.y - SLVDEngine.wY < 220) py = persOb.y - SLVDEngine.wY - persOb.yres + 40;
	
	SLVDEngine.speechBubble(message, tSpkr, persOb.x - SLVDEngine.wX + 8, py); 
};

SLVDEngine.say = function(message) {
	SLVDEngine.renderBoardState();
	SLVDEngine.speechBubble(message);
};

SLVDEngine.speechBubble = function(msg, spkr, px, py) {
	var line = [];
	if(msg.length > 0)
	{			
		var linNum = 0;
		
		do
		{
			line[linNum] = getLine(msg, 560);
			//alert("'" + line[linNum] + "'");
			msg = msg.substr(line[linNum].length, msg.length - line[linNum].length);
			linNum++;
		} while(line[linNum - 1] != -1);

	}
	else
	{
		line.length = 0;
	}

	var yShift = py - ((linNum - 1)*20 + 70);
	if((linNum - 1)*20 + 50 > py)
	{
		yShift = py + 40;
		py += 35;
	}
	if(!py) yShift = 0;
	
	//Text box
	SLVDEngine.drawAwesomeRect(SLVDEngine.SCREENX/2 - 300, yShift + 30, SLVDEngine.SCREENX/2 + 300, yShift + (linNum - 1)*20 + 40, SLVDEngine.see, px, py, (linNum - 1)*20 + 50 > py);

	SLVDEngine.see.fillStyle="#FFFFFF";
	SLVDEngine.see.font="18px Verdana";
	if(line[0] != null)
	{
		//Lines
		for(var index = 0; index < linNum - 1; index++) SLVDEngine.see.fillText(line[index], SLVDEngine.SCREENX/2 - 290, yShift + 20*index + 50);
	}
	
	if(spkr)
	{
		//Name box
		SLVDEngine.drawAwesomeRect(SLVDEngine.SCREENX/2 - 300, yShift, SLVDEngine.see.measureText(spkr).width + SLVDEngine.SCREENX/2 - 260, yShift + 30, SLVDEngine.see);

		SLVDEngine.see.fillStyle="#FFFFFF";
		SLVDEngine.see.font="18px Verdana";
		
		//Name
		SLVDEngine.see.fillText(spkr, SLVDEngine.SCREENX/2 - 280, yShift + 20);
	}
};