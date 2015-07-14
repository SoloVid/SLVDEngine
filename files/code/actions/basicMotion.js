/*The motion system is modeled after the action system (action.js).
A Motion is intended to be a simple walking pattern (i.e. no special graphics, can happen simultaneously with other action).
If a "motion" is something complicated (e.g. the way a boss moves), it is generally recommended to make this "motion" an Action.
Some "motions" will need to have actions directly associated with them (e.g. projectiles); these should be all encompassed in an Action.
Each movement is associated with three different functions:
	canUse: returns true/false depending on circumstances, indicates if movement is currently usable by calling player/NPC, default is true
	use: no significant return value, carries out the step
Use person.steps to keep track of distance traveled and person.wait to determine idle time
*/

var Motion = {};

function baseMotion() { }
baseMotion.prototype = new baseAction();
baseMotion.prototype.constructor = baseMotion;
baseMotion.prototype.canUse = function() {
	if(this.wait > 0)
	{
		this.wait--;
		return false;
	}
	return true
};
baseMotion.prototype.type = "motion";
baseMotion.prototype.prob = 0;
baseMotion.prototype.steps = 0;
baseMotion.prototype.wait = 0;

baseMotion.prototype.regularMotion = function(person, newSteps, newDir) {
	if(this.steps > 0)
	{
		person.updateFrame();
		person.zeldaStep(person.spd);
		this.steps--;
		if(this.steps <= 0)
		{
			this.wait = randomInt(4) + 28;
		}
	}
	else if(this.wait > 0)
	{
		this.wait--;
		person.frame = 0;
	}
	else if(this.steps <= 0)
	{
		person.dir = newDir;
		this.steps = newSteps;
	}
};

Motion["random"] = function() {};
Motion["random"].prototype = new baseMotion();
Motion["random"].prototype.constructor = Motion["random"];
Motion["random"].prototype.use = function(person) {
	this.regularMotion(person, randomInt(16) + 16, randomInt(4) - 1);
}
Motion["line"] = function() {};
Motion["line"].prototype = new baseMotion();
Motion["line"].prototype.constructor = Motion["line"];
Motion["line"].prototype.use = function(person) {
	this.regularMotion(person, 64, Math.round((boardNPC[index].dir + 2)%4));
}

Motion["square"] = function() {};
Motion["square"].prototype = new baseMotion();
Motion["square"].prototype.constructor = Motion["square"];
Motion["square"].prototype.use = function(person) {
	this.regularMotion(person, 64, Math.round((boardNPC[index].dir + 1)%4));
}

Motion["chase"] = function() {};
Motion["chase"].prototype = new baseMotion();
Motion["chase"].prototype.constructor = Motion["chase"];
Motion["chase"].prototype.canUse = function(person) {
	var dist = Math.sqrt(Math.pow(person.x - player[currentPlayer].x, 2) + Math.pow(person.y - player[currentPlayer].y, 2));
	return (dist < 256 && person.layer == player[currentPlayer].layer && person.canSeePlayer())
}
Motion["chase"].prototype.use = function(person) {
	person.zeldaLockOnPlayer();
	person.updateFrame();
	person.zeldaStep(person.spd);
}