/*The action system is designed to abstract actions into their components apart from the engine.
Each action is associated with five different functions:
	canUse: returns true/false depending on circumstances, indicates if action should be used by SLVDEngine.NPC like an AI
	use: no significant return value, carries out the initial action; should include a form of "canUse" to prevent illegal SLVDEngine.player action
	update: no significant return value, carries out the ongoing code each frame action is used
	SLVDEngine.see: no significant return value, renders graphics each frame onto the screen just after calling SLVDEngine.player/SLVDEngine.NPC is drawn
See "slash" action below for usage sampling
One of the most important usage guidelines is the use of time. 
	The engine will continue to call the action's update function for a particular person until this.time hits 0.
	Keep in mind that this.time will likely be 0 at the call of use(); 
	so this.time should generally be initialized in use() and decremented in update().
If there is to be a delay before the person may use another SLVDEngine.Action of the same class, don't let this.time reach zero
	and let the last bit of the count do nothing in this.update()
If there is to be a delay before the person may use this same SLVDEngine.Action, set some property of the SLVDEngine.Action
	(e.g. this.rcvr) to a significant number which canUse may reference
*/

SLVDEngine.Action = {};

console.log("loaded SLVDEngine.Action");

function baseAction() { }
baseAction.prototype.time = 0;
baseAction.prototype.prob = 1;
baseAction.prototype.type = "attack";
baseAction.prototype.getProbability = function() { return this.prob; };
baseAction.prototype.canUse = function(person) { return true; };
baseAction.prototype.use = function(person) { };
baseAction.prototype.update = function(person) { this.time--; };
baseAction.prototype.see = function(person) { };

SLVDEngine.Action["slash"] = function(prob) {
	if(prob !== undefined)
	{
		this.prob = prob;
	}
};;
SLVDEngine.Action["slash"].prototype = new baseAction();
SLVDEngine.Action["slash"].prototype.constructor = SLVDEngine.Action["slash"];
SLVDEngine.Action["slash"].prototype.time = 4;
SLVDEngine.Action["slash"].prototype.canUse = function(person) {
	return SLVDEngine.distanceTrue(person.x, person.y, SLVDEngine.player[SLVDEngine.currentPlayer].x, SLVDEngine.player[SLVDEngine.currentPlayer].y) < 36 && person.canSeePlayer();
};
SLVDEngine.Action["slash"].prototype.use = function(person) {
	this.time = 4;
	for(var third = 0; third < SLVDEngine.boardAgent.length; third++)
	{
		if(SLVDEngine.boardAgent[third].team != person.team)
		{
			//One tile away
			var caseTRPG = Math.pow(SLVDEngine.xPixToTile(SLVDEngine.boardAgent[third].x) - SLVDEngine.xPixToTile(person.x), 2) + Math.pow(SLVDEngine.yPixToTile(SLVDEngine.boardAgent[third].y) - SLVDEngine.yPixToTile(person.y), 2) == 1;
			//Distance < 40
			var caseZelda = Math.sqrt(Math.pow(SLVDEngine.boardAgent[third].x - person.x, 2) + Math.pow(SLVDEngine.boardAgent[third].y - person.y, 2)) < 40;
		
			if((SLVDEngine.process == "TRPG" && caseTRPG) || (SLVDEngine.process == "zelda" && caseZelda))
			{
				//Determine angle between slasher and opponent (in terms of PI/2)
				var angle = SLVDEngine.dirFromTo(person.x, person.y, SLVDEngine.boardAgent[third].x, SLVDEngine.boardAgent[third].y);
				
				//Compare angle to direction of slasher. If in range of PI... and if not already hurt and not invincible
				if((Math.abs(angle - person.dir) < 1 || Math.abs(angle - person.dir) > 3) && SLVDEngine.boardAgent[third].status != "hurt" && SLVDEngine.boardAgent[third].status != "invincible")
				{
					SLVDEngine.boardAgent[third].zeldaBump(16, angle);
					SLVDEngine.boardAgent[third].damage(5);
					SLVDEngine.boardAgent[third].giveStatus(new SLVDEngine.Status["hurt"](1));
				}
			}
		}
	}
};
SLVDEngine.Action["slash"].prototype.update = function(person) {
	if(this.time <= 0)
	{
		//person.rcvr = 16 - person.spd;
	}
	this.time--;
};
SLVDEngine.Action["slash"].prototype.see = function(person) {
	//Blur SLVDEngine.player
	SLVDEngine.snapShotCtx.globalAlpha = .10;
	var tSqueeze = 4;
	var col = person.getStance();
	for(var third = -12; third < 12; third++)
	{
		SLVDEngine.snapShotCtx.drawImage(person.getImage(), person.xres*col, person.yres*person.frame, person.xres, person.yres, third*Math.cos(Math.PI/2*(4 - Math.round(person.dir))) - person.xres/2 - person.baseOffX, tSqueeze + third*Math.sin(Math.PI/2*(4 - Math.round(person.dir))) - person.yres + person.baseLength/2 - person.baseOffY, person.xres, person.yres - tSqueeze);	
	}
	SLVDEngine.snapShotCtx.globalAlpha = 1;
	
	//Draw arc
	SLVDEngine.snapShotCtx.lineWidth = 8;
	SLVDEngine.snapShotCtx.beginPath();
	SLVDEngine.snapShotCtx.arc(0, 0, 32, .5*((3 - person.dir) - .5 + (this.time/2))*Math.PI, .5*((3 - person.dir) + .5 + (this.time/2))*Math.PI);
	SLVDEngine.snapShotCtx.strokeStyle = "white";
	SLVDEngine.snapShotCtx.stroke();
};