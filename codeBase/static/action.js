/*The action system is designed to abstract actions into their components apart from the engine.
Each action is associated with five different functions:
	canUse: returns true/false depending on circumstances, indicates if action should be used by NPC like an AI
	use: no significant return value, carries out the initial action; should include a form of "canUse" to prevent illegal player action
	update: no significant return value, carries out the ongoing code each frame action is used
	see: no significant return value, renders graphics each frame onto the screen just after calling player/NPC is drawn
See "slash" action below for usage sampling
One of the most important usage guidelines is the use of time. 
	The engine will continue to call the action's update function for a particular person until this.time hits 0.
	Keep in mind that this.time will likely be 0 at the call of use(); 
	so this.time should generally be initialized in use() and decremented in update().
If there is to be a delay before the person may use another Action of the same class, don't let this.time reach zero
	and let the last bit of the count do nothing in this.update()
If there is to be a delay before the person may use this same Action, set some property of the Action
	(e.g. this.rcvr) to a significant number which canUse may reference
*/

var Action = {};

console.log("loaded Action");

function baseAction() { }
baseAction.prototype.time = 0;
baseAction.prototype.prob = 1;
baseAction.prototype.type = "attack";
baseAction.prototype.getProbability = function() { return this.prob; };
baseAction.prototype.canUse = function(person) { return true; };
baseAction.prototype.use = function(person) { };
baseAction.prototype.update = function(person) { this.time--; };
baseAction.prototype.see = function(person) { };

Action["slash"] = function(prob) {
	if(prob !== undefined)
	{
		this.prob = prob;
	}
};
Action["slash"].prototype = new baseAction();
Action["slash"].prototype.constructor = Action["slash"];
Action["slash"].prototype.time = 4;
Action["slash"].prototype.canUse = function(person) {
	return Math.sqrt(Math.pow(player[currentPlayer].x - person.x, 2) + Math.pow(player[currentPlayer].y - person.y, 2)) < 40 && person.canSeePlayer();
};
Action["slash"].prototype.use = function(person) {
	this.time = 4;
	for(var third = 0; third < boardC.length; third++)
	{
		if(boardC[third].team != person.team)
		{
			//One tile away
			var caseTRPG = Math.pow(xPixToTile(boardC[third].x) - xPixToTile(person.x), 2) + Math.pow(yPixToTile(boardC[third].y) - yPixToTile(person.y), 2) == 1;
			//Distance < 40
			var caseZelda = Math.sqrt(Math.pow(boardC[third].x - person.x, 2) + Math.pow(boardC[third].y - person.y, 2)) < 40;
		
			if((process == "TRPG" && caseTRPG) || (process == "zelda" && caseZelda))
			{
				//Determine angle between slasher and opponent (in terms of PI/2)
				var angle = dirFromTo(person.x, person.y, boardC[third].x, boardC[third].y);
				
				//Compare angle to direction of slasher. If in range of PI... and if not already hurt and not invincible
				if((Math.abs(angle - person.dir) < 1 || Math.abs(angle - person.dir) > 3) && boardC[third].status != "hurt" && boardC[third].status != "invincible")
				{
					boardC[third].zeldaBump(16, angle);
					boardC[third].damage(5);
					boardC[third].giveStatus(new Status["hurt"](8));
				}
			}
		}
	}
};
Action["slash"].prototype.update = function(person) {
	if(this.time <= 0)
	{
		//person.rcvr = 16 - person.spd;
	}
	this.time--;
};
Action["slash"].prototype.see = function(person) {
	//Blur player
	bufferCtx.globalAlpha = .10
	var tSqueeze = 4;
	for(var third = -12; third < 12; third++)
	{
		bufferCtx.drawImage(person.img, person.xres*col, person.yres*person.frame, person.xres, person.yres, third*Math.cos(Math.PI/2*(4 - Math.round(person.dir))) - person.baseLength/2 - person.baseOffX, tSqueeze + third*Math.sin(Math.PI/2*(4 - Math.round(person.dir))) - person.yres + person.baseLength/2 - person.baseOffY, person.xres, person.yres - tSqueeze);	
	}
	bufferCtx.globalAlpha = 1;
	
	//Draw arc
	bufferCtx.lineWidth = 8;
	bufferCtx.beginPath();
	bufferCtx.arc(0, 0, 32, .5*((3 - person.dir) - .5 + (this.time/2))*Math.PI, .5*((3 - person.dir) + .5 + (this.time/2))*Math.PI);
	bufferCtx.strokeStyle = "white";
	bufferCtx.stroke();
};