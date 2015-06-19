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

Motion.handle = function(person) {
	Motion.use(person);
}

//Deploy movement of person based on motion list, earlier movement types are preferred
Motion.use = function(person) {
	if(person.canMove)//person.act == null || Action[person.act].allowMove(person))
	{
		for(var i = 0; i < person.moveSet.length; i++)
		{
			if(Motion[person.moveSet[i]].canUse(person))
			{
				Motion[person.moveSet[i]].use(person);
				return;
			}
		}
	}
}

function baseMotion() { }
baseMotion.prototype.canUse = function() { return true; }
baseMotion.prototype.use = function() { }
baseMotion.prototype.see = function(person) { renderSpriteStd(person); }

function regularMotion(person, newSteps, newDir) {
	if(person.steps > 0)
	{
		person.updateFrame();
		person.zeldaStep(person.spd);
		person.steps--;
		if(person.steps <= 0)
		{
			person.wait = randomInt(4) + 28;
		}
	}
	else if(person.wait > 0)
	{
		person.wait--;
		person.frame = 0;
	}
	else if(person.steps <= 0)
	{
		person.dir = newDir;
		person.steps = newSteps;
	}
}

Motion["random"] = new baseMotion();
Motion["random"].use = function(person) {
	regularMotion(person, randomInt(16) + 16, randomInt(4) - 1);
}

Motion["line"] = new baseMotion();
Motion["line"].use = function(person) {
	regularMotion(person, 64, Math.round((boardNPC[index].dir + 2)%4));
}

Motion["square"] = new baseMotion();
Motion["square"].use = function(person) {
	regularMotion(person, 64, Math.round((boardNPC[index].dir + 1)%4));
}

Motion["chase"] = new baseMotion();
Motion["chase"].canUse = function(person) {
	var dist = Math.sqrt(Math.pow(person.x - player[currentPlayer].x, 2) + Math.pow(person.y - player[currentPlayer].y, 2));
	return (dist < 256 && person.layer == player[currentPlayer].layer && person.canSeePlayer())
}
Motion["chase"].use = function(person) {
	person.zeldaLockOnPlayer();
	person.updateFrame();
	person.zeldaStep(person.spd);
}

function pathMotion(person, spd) //Move a person along their set path at given speed.
{
	//document.getElementById("info").innerHTML = "path to " + person.path.x[0] + ", " + person.path.y[0];
	var dist = Math.sqrt(Math.pow(person.x - person.path[0].x, 2) + Math.pow(person.y - person.path[0].y, 2))
	if(dist == 0)
	{
		person.path.shift();

		if(person == cTeam[currentPlayer] && person.path.length == 0)
		{
			if(!resumeCue)	{ }
			else { resumeCue = resumeFunc(resumeCue); }
		}
	}
	else
	{
		person.zeldaLockOnPoint(person.path[0].x, person.path[0].y);
		var jump;
//		if(Math.round(dist) < spd) { jump = Math.round(dist); }
		if(dist < spd) { jump = dist; }
		else { jump = spd; }
		person.y -= Math.round(jump*Math.sin((person.dir)*(Math.PI/2)));
		person.x += Math.round(jump*Math.cos((person.dir)*(Math.PI/2)));	
	}
}
