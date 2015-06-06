/*The action system is designed to abstract actions into their components apart from the engine.
Each action is associated with five different functions:
	canUse: returns true/false depending on circumstances, indicates if action is currently usable by calling player/NPC
	use: no significant return value, carries out the initial action
	update: no significant return value, carries out the ongoing code each frame action is used
	see: no significant return value, renders graphics each frame onto the screen just after calling player/NPC is drawn
	allowMove: returns true/false indicating whether movement is allowable with action or not, default is true, 
		most cases will use simple return statement, more complex actions may require conditions
See "slash" action below for usage sampling
One of the most important usage guidelines is the use of the actCountdown. 
	The engine will continue to call the action's update function for a particular person until person.actCountdown hits 0.
	Keep in mind that person.actCountdown will likely be 0 at the call of use(); 
	so person.actCountdown should generally be initialized in use() and decremented in update().
Similarly, person.rcvr should be set if there is to be a delay before the person may use another action.
*/

var Action = {};

console.log("loaded Action");

Action.handle = function(person) {
	if(person.canAct)
	{
		if(person.act == null)
		{
			Action.use(person);
		}
		else
		{
			Action.update(person);
		}
	}
}

//Randomly deploy person's action based on person's action set and associated probabilities
Action.use = function(person, act) {
	if(act == null)
	{
		var actSet = [];
		var rand;
		var totProb = 0;
		//Create a list of useable actions
		for(var i = 0; i < person.actSet.length; i++)
		{
			if(Action[person.actSet[i][0]].canUse(person))
			{
				actSet.push(person.actSet[i]);
				totProb += person.actSet[i][1];
			}
		}
		//Pick random action based on probabilities
		var rand = randomInt(totProb);
		var partProb = 0;
		for(var i = 0; i < actSet.length; i++)
		{
			partProb += actSet[i][1];
			if(rand <= partProb)
			{
				person.act = actSet[i][0];
				Action[actSet[i][0]].use(person);
				return;// actSet[i][0];
			}
		}
		if(actSet.length > 0) console.log("failed to select action");
	}
	else
	{
		person.act = act;
		Action[act].use(person);
	}
}

Action.update = function(person) {
	Action[person.act].update(person);
	if(person.actCountdown <= 0)
	{
		delete person.act;
		if(process == "TRPG")
		{
			TRPGNextTurn(); //in TRPG.js
		}
	}
}

Action.see = function(person) {
	if(person.act != null)
	{
		Action[person.act].see(person);
		if(process == "TRPG" && person.actCountdown <= 0)
		{
			TRPGNextTurn(); //in main.js
		}
		return true;
	}
	return false;
}

function baseAction() { }

baseAction.prototype.canUse = function() { return false; }
baseAction.prototype.use = function() { }
baseAction.prototype.update = function(person) { person.actCountdown--; }
baseAction.prototype.see = function(person) { /*renderBoardCStd(person);*/ }
baseAction.prototype.allowMove = function() { return true; }

Action["slash"] = new baseAction();
Action["slash"].constructor = function() { };
Action["slash"].canUse = function(person) {
	return Math.sqrt(Math.pow(player[currentPlayer].x - person.x, 2) + Math.pow(player[currentPlayer].y - person.y, 2)) < 40 && person.canSeePlayer();
}
Action["slash"].use = function(person) {
//	person.act = "slash";
	person.actCountdown = 4;
	
	for(var third = 0; third < person.oppTeam.length; third++)
	{
		//One tile away
		var caseTRPG = Math.pow(xPixToTile(person.oppTeam[third].x) - xPixToTile(person.x), 2) + Math.pow(yPixToTile(person.oppTeam[third].y) - yPixToTile(person.y), 2) == 1;
		//Distance < 40
		var caseZelda = Math.sqrt(Math.pow(person.oppTeam[third].x - person.x, 2) + Math.pow(person.oppTeam[third].y - person.y, 2)) < 40;
	
		if((process == "TRPG" && caseTRPG) || (process == "zelda" && caseZelda))
		{
			//Determine angle between slasher and opponent (in terms of PI/2)
			var angle = dirFromTo(person.x, person.y, person.oppTeam[third].x, person.oppTeam[third].y);
			
			//Compare angle to direction of slasher. If in range of PI... and if not already hurt and not invincible
			if((Math.abs(angle - person.dir) < 1 || Math.abs(angle - person.dir) > 3) && person.oppTeam[third].status != "hurt" && person.oppTeam[third].status != "invincible")
			{
				var tDir = person.oppTeam[third].dir;
				person.oppTeam[third].dir = angle;
				zeldaStep(person.oppTeam[third], 16);
				person.oppTeam[third].dir = tDir;
				damage(person, person.oppTeam[third]);
				person.oppTeam[third].status = "hurt";
				person.oppTeam[third].statusCountdown = 4;
			}
		}
	}
}
Action["slash"].update = function(person) {
	if(person.actCountdown <= 0)
	{
//		delete person.act;
		person.rcvr = 16 - person.spd;
	}
	person.actCountdown--;
}
Action["slash"].see = function(person) {
	//Standard rendering first
	renderSpriteStd(person);

	//Blur player
	see.globalAlpha = .10
	var tSqueeze = 4;
	for(var third = -12; third < 12; third++)
	{
		see.drawImage(person.img, person.xres*col, person.yres*person.frame, person.xres, person.yres, (person.x - (((person.xres)/2) - 8)) - wX + third*Math.cos(Math.PI/2*(4 - Math.round(person.dir))), (person.y - (person.yres - 8)) - wY + tSqueeze + third*Math.sin(Math.PI/2*(4 - Math.round(person.dir))), person.xres, person.yres - tSqueeze);	
	}
	see.globalAlpha = 1;
	
	//Draw arc
	see.lineWidth = 8;
	see.beginPath();
	see.arc((person.x - ((person.xres)/2)) - wX + 24, (person.y - (person.yres)) - wY + 56,32, .5*((3 - person.dir) - .5 + (person.actCountdown/2))*Math.PI, .5*((3 - person.dir) + .5 + (person.actCountdown/2))*Math.PI);
	see.strokeStyle = "white";
	see.stroke();
}