//Motions are actions with 0 priority: they only happen when nothing else does.

SLVDEngine.Motion = {};

SLVDEngine.baseMotion = function() { };
SLVDEngine.baseMotion.prototype = new baseAction();
SLVDEngine.baseMotion.prototype.constructor = SLVDEngine.baseMotion;
SLVDEngine.baseMotion.prototype.canUse = function() {
	if(this.wait > 0)
	{
		this.wait--;
		return false;
	}
	return true
};
SLVDEngine.baseMotion.prototype.type = "motion";
SLVDEngine.baseMotion.prototype.prob = 0;
SLVDEngine.baseMotion.prototype.steps = 0;
SLVDEngine.baseMotion.prototype.wait = 0;

SLVDEngine.baseMotion.prototype.regularMotion = function(person, newSteps, newDir) {
	if(this.steps > 0)
	{
		person.updateFrame();
		person.zeldaStep(person.spd);
		this.steps--;
		if(this.steps <= 0)
		{
			this.wait = SLVD.randomInt(4) + 28;
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

SLVDEngine.Motion["random"] = function() {};
SLVDEngine.Motion["random"].prototype = new SLVDEngine.baseMotion();
SLVDEngine.Motion["random"].prototype.constructor = SLVDEngine.Motion["random"];
SLVDEngine.Motion["random"].prototype.use = function(person) {
	this.regularMotion(person, SLVD.randomInt(16) + 16, SLVD.randomInt(4) - 1);
}
SLVDEngine.Motion["line"] = function() {};
SLVDEngine.Motion["line"].prototype = new SLVDEngine.baseMotion();
SLVDEngine.Motion["line"].prototype.constructor = SLVDEngine.Motion["line"];
SLVDEngine.Motion["line"].prototype.use = function(person) {
	this.regularMotion(person, 64, Math.round((boardNPC[index].dir + 2)%4));
}

SLVDEngine.Motion["square"] = function() {};
SLVDEngine.Motion["square"].prototype = new SLVDEngine.baseMotion();
SLVDEngine.Motion["square"].prototype.constructor = SLVDEngine.Motion["square"];
SLVDEngine.Motion["square"].prototype.use = function(person) {
	this.regularMotion(person, 64, Math.round((boardNPC[index].dir + 1)%4));
}

SLVDEngine.Motion["chase"] = function() {};
SLVDEngine.Motion["chase"].prototype = new SLVDEngine.baseMotion();
SLVDEngine.Motion["chase"].prototype.constructor = SLVDEngine.Motion["chase"];
SLVDEngine.Motion["chase"].prototype.canUse = function(person) {
	var dist = Math.sqrt(Math.pow(person.x - SLVDEngine.player[currentPlayer].x, 2) + Math.pow(person.y - SLVDEngine.player[currentPlayer].y, 2));
	return (dist < 256 && person.layer == SLVDEngine.player[currentPlayer].layer && person.canSeePlayer())
}
SLVDEngine.Motion["chase"].prototype.use = function(person) {
	person.zeldaLockOnPlayer();
	person.updateFrame();
	person.zeldaStep(person.spd);
}