function showImage(file, duration) {
	process = "wait";
	see.drawImage(file, 0, 0, SCREENX, SCREENY);
	countdown = 50*duration;
}

function menu() {
	this.cursor;
	this.point = new Array();
	
	this.addPoint = addPoint;
	function addPoint(x, y)
	{
		var index = this.point.length;
		this.point[index] = new Object();
		this.point[index].x = x;
		this.point[index].y = y;
	}
	
	this.runMenu = runMenu;
	function runMenu()
	{
		this.currentPoint = 0;
		delete this.chosenPoint;
		process = "menu";
	}
	
	this.killPoints = killPoints;
	function killPoints()
	{
		this.point.length = 0;
		this.update = null;
	}
	
	this.update = null; //Customizable function; run every frame
}

//Primarily handles arrow key presses
function handleMenu() {
	/*This menu system navigates on a grid even though points are listed linearly.
	/*Basically, the code finds the closest point (in the direction of the key press 
	to the current point that is within a 90 degree viewing angle from the point in that direction.*/
	//Draw menu background
//	see.drawImage(opMenu.background, 0, 0);
	//Draw cursor
//	see.drawImage(opMenu.cursor, opMenu.point[opMenu.currentPoint].x, opMenu.point[opMenu.currentPoint].y);
	var prevPoint = opMenu.currentPoint;
	var iPoint = prevPoint;
	var bestPoint = iPoint;
	var bestdx = 1000; //Distance from prevPoint to bestPoint
	var bestdy = 1000;
	if(keyFirstDown['a'] || keyFirstDown['left']) //Left
	{
		do //While index point does not equal original point
		{
			var isLeft = opMenu.point[iPoint].x < opMenu.point[prevPoint].x;
			if(isLeft)
			{
				var isUnderUpperBound = opMenu.point[iPoint].y <= -opMenu.point[iPoint].x + opMenu.point[prevPoint].x + opMenu.point[prevPoint].y;
				var isAboveLowerBound = opMenu.point[iPoint].y >= opMenu.point[iPoint].x - opMenu.point[prevPoint].x + opMenu.point[prevPoint].y;
			}
			else
			{
				var isUnderUpperBound = opMenu.point[iPoint].y <= -opMenu.point[iPoint].x + (opMenu.point[prevPoint].x + SCREENX) + opMenu.point[prevPoint].y;
				var isAboveLowerBound = opMenu.point[iPoint].y >= opMenu.point[iPoint].x - (opMenu.point[prevPoint].x + SCREENX) + opMenu.point[prevPoint].y;
			}
			if(isUnderUpperBound && isAboveLowerBound) //Point within 90 degree viewing window
			{
				var testdx = opMenu.point[prevPoint].x - opMenu.point[iPoint].x;
				if(!isLeft) testdx += SCREENX;
				var testdy = Math.abs(opMenu.point[prevPoint].y - opMenu.point[iPoint].y);
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
			iPoint = (opMenu.point.length + iPoint - 1)%opMenu.point.length;
		} while(iPoint != prevPoint);
		opMenu.currentPoint = bestPoint;
	}
	else if(keyFirstDown['w'] || keyFirstDown['up']) //Up
	{
		do //While index point does not equal original point
		{
			var isUp = opMenu.point[iPoint].y < opMenu.point[prevPoint].y;
			if(isUp)
			{
				var isAboveLowerBound = opMenu.point[iPoint].x <= -opMenu.point[iPoint].y + opMenu.point[prevPoint].y + opMenu.point[prevPoint].x;
				var isUnderUpperBound = opMenu.point[iPoint].x >= opMenu.point[iPoint].y - opMenu.point[prevPoint].y + opMenu.point[prevPoint].x;
			}
			else
			{
				var isAboveLowerBound = opMenu.point[iPoint].x <= -opMenu.point[iPoint].y + (opMenu.point[prevPoint].y + SCREENY) + opMenu.point[prevPoint].x;
				var isUnderUpperBound = opMenu.point[iPoint].x >= opMenu.point[iPoint].y - (opMenu.point[prevPoint].y + SCREENY) + opMenu.point[prevPoint].x;
			}
			if(isUnderUpperBound && isAboveLowerBound) //Point within 90 degree viewing window
			{
				var testdy = opMenu.point[prevPoint].y - opMenu.point[iPoint].y;
				if(!isUp) testdy += SCREENY;
				var testdx = Math.abs(opMenu.point[prevPoint].x - opMenu.point[iPoint].x);
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
			iPoint = (opMenu.point.length + iPoint - 1)%opMenu.point.length;
		} while(iPoint != prevPoint);
		opMenu.currentPoint = bestPoint;
		//		opMenu.currentPoint = (opMenu.point.length + opMenu.currentPoint - 1)%opMenu.point.length;
	}
	else if(keyFirstDown['d'] || keyFirstDown['right']) //Right
	{
		do //While index point does not equal original point
		{
			var isRight = opMenu.point[iPoint].x > opMenu.point[prevPoint].x;
			if(isRight)
			{
				var isUnderUpperBound = opMenu.point[iPoint].y >= -opMenu.point[iPoint].x + opMenu.point[prevPoint].x + opMenu.point[prevPoint].y;
				var isAboveLowerBound = opMenu.point[iPoint].y <= opMenu.point[iPoint].x - opMenu.point[prevPoint].x + opMenu.point[prevPoint].y;
			}
			else
			{
				var isUnderUpperBound = opMenu.point[iPoint].y >= -opMenu.point[iPoint].x + (opMenu.point[prevPoint].x - SCREENX) + opMenu.point[prevPoint].y;
				var isAboveLowerBound = opMenu.point[iPoint].y <= opMenu.point[iPoint].x - (opMenu.point[prevPoint].x - SCREENX) + opMenu.point[prevPoint].y;
			}
			if(isUnderUpperBound && isAboveLowerBound) //Point within 90 degree viewing window
			{
				var testdx =  opMenu.point[iPoint].x - opMenu.point[prevPoint].x;
				if(!isRight) testdx += SCREENX;
				var testdy = Math.abs(opMenu.point[prevPoint].y - opMenu.point[iPoint].y);
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
			iPoint = (iPoint + 1)%opMenu.point.length;
		} while(iPoint != prevPoint);
		opMenu.currentPoint = bestPoint;
		//opMenu.currentPoint = (opMenu.currentPoint + 1)%opMenu.point.length;
	}
	else if(keyFirstDown['s'] || keyFirstDown['down']) //Down
	{
		do //While index point does not equal original point
		{
			var isUp = opMenu.point[iPoint].y > opMenu.point[prevPoint].y;
			if(isUp)
			{
				var isUnderUpperBound = opMenu.point[iPoint].x >= -opMenu.point[iPoint].y + opMenu.point[prevPoint].y + opMenu.point[prevPoint].x;
				var isAboveLowerBound = opMenu.point[iPoint].x <= opMenu.point[iPoint].y - opMenu.point[prevPoint].y + opMenu.point[prevPoint].x;
			}
			else
			{
				var isUnderUpperBound = opMenu.point[iPoint].x >= -opMenu.point[iPoint].y + (opMenu.point[prevPoint].y - SCREENY) + opMenu.point[prevPoint].x;
				var isAboveLowerBound = opMenu.point[iPoint].x <= opMenu.point[iPoint].y - (opMenu.point[prevPoint].y - SCREENY) + opMenu.point[prevPoint].x;
			}
			if(isUnderUpperBound && isAboveLowerBound) //Point within 90 degree viewing window
			{
				var testdy = opMenu.point[iPoint].y - opMenu.point[prevPoint].y;
				if(!isUp) testdy += SCREENY;
				var testdx = Math.abs(opMenu.point[prevPoint].x - opMenu.point[iPoint].x);
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
			iPoint = (iPoint + 1)%opMenu.point.length;
		} while(iPoint != prevPoint);
		opMenu.currentPoint = bestPoint;
//		opMenu.currentPoint = (opMenu.currentPoint + 1)%opMenu.point.length;
	}
}

//File selection menu
function setupFileSelect() {
	opMenu.killPoints();
	opMenu.cursor = image["torchCursor.png"];
	opMenu.background = buffer;

	canvasBlackout(bufferCtx);
	bufferCtx.fillStyle = "#FFFFFF";
	bufferCtx.font = "20px Arial";
	bufferCtx.fillText("Select a file.", 10, 30);
	for(var col = 0; col < 3; col++)
	{
		for(var index = 1; index <= 7; index++)
		{
			var fileName = (index + col*7);
			bufferCtx.fillText(fileName, 40 + 200*col, 10 + 60*index);
			opMenu.addPoint(10 + 200*col, 60*index);
			try
			{
				var item = localStorage.getItem(GAMEID + "_" + fileName + "_SAVE");
				var tSAVE = JSON.parse(item);
				bufferCtx.fillText(tSAVE.timeDays + "." + tSAVE.timeHours + "." + tSAVE.timeMinutes + "." + tSAVE.timeSeconds, 40 + 200*col, 35 + 60*index);
			}
			catch(e)
			{
				bufferCtx.fillText("No Save Data", 40 + 200*col, 35 + 60*index);
			}
		}
	}
}

function setupActionMenu() {
	opMenu.killPoints();
	opMenu.cursor = image["blueSquare.png"];
	opMenu.background = buffer;

	canvasBlackout(bufferCtx);
	bufferCtx.fillStyle = "#FFFFFF";
	bufferCtx.font = "20px Arial";
	bufferCtx.fillText("Select a file.", 10, 30);
	for(var col = 0; col < 3; col++)
	{
		for(var index = 1; index <= 7; index++)
		{
			var fileName = "File " + (index + col*7);
			bufferCtx.fillText(fileName, 40 + 200*col, 10 + 60*index);
			opMenu.addPoint(10 + 200*col, 60*index);
			try
			{
				var item = localStorage.getItem("FULLMAVEN_" + fileName + "_SAVE");
				var tSAVE = JSON.parse(item);
				bufferCtx.fillText(tSAVE.timeDays + "." + tSAVE.timeHours + "." + tSAVE.timeMinutes + "." + tSAVE.timeSeconds, 40 + 200*col, 35 + 60*index);
			}
			catch(e)
			{
				bufferCtx.fillText("No Save Data", 40 + 200*col, 35 + 60*index);
			}
		}
	}
}

function drawAwesomeRect(sx, sy, ex, ey, context, px, py, down) {
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
}

function personSays(persOb, message, overrideName) {
	renderBoardState(); //in main.js

	var tSpkr = overrideName || persOb.name;
	
	var py = persOb.y - wY - persOb.yres + 5;
	//if(persOb.y - wY < 220) py = persOb.y - wY - persOb.yres + 40;
	
	speechBubble(message, tSpkr, persOb.x - wX + 8, py); 
}

function say(message) {
	renderBoardState();
	speechBubble(message);
}

function speechBubble(msg, spkr, px, py) {
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
	drawAwesomeRect(SCREENX/2 - 300, yShift + 30, SCREENX/2 + 300, yShift + (linNum - 1)*20 + 40, see, px, py, (linNum - 1)*20 + 50 > py);

	see.fillStyle="#FFFFFF";
	see.font="18px Verdana";
	if(line[0] != null)
	{
		//Lines
		for(var index = 0; index < linNum - 1; index++) see.fillText(line[index], SCREENX/2 - 290, yShift + 20*index + 50);
	}
	
	if(spkr)
	{
		//Name box
		drawAwesomeRect(SCREENX/2 - 300, yShift, see.measureText(spkr).width + SCREENX/2 - 260, yShift + 30, see);

		see.fillStyle="#FFFFFF";
		see.font="18px Verdana";
		
		//Name
		see.fillText(spkr, SCREENX/2 - 280, yShift + 20);
	}
}