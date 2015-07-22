/*The status system is built off of the action system. It is intended to handle prolonged inflictions of statuses.
See the "hurt" status below for an example.
It is important to note that Statuses are somewhat different from both Actions and Motions by definition.
	Statuses are often dependent on the attacker instead of the person who "has" the SLVDEngine.Status.
	For this reason, we utilize JS prototypal inheritance in Statuses 
	in order to hold more information in the SLVDEngine.Status than just the SLVDEngine.Sprite.*/

SLVDEngine.Status = {};

SLVDEngine.baseStatus = function() { };

SLVDEngine.baseStatus.prototype.time = 0;
SLVDEngine.baseStatus.prototype.apply = function(person) { this.time--; };
SLVDEngine.baseStatus.prototype.see = function(person) { };

SLVDEngine.Status["hurt"] = function(sec) { 
	if(sec !== undefined)
	{
		this.time = sec*SLVDEngine.FPS;
	}
};
SLVDEngine.Status["hurt"].prototype = new SLVDEngine.baseStatus();
SLVDEngine.Status["hurt"].prototype.constructor = SLVDEngine.Status["hurt"];
SLVDEngine.Status["hurt"].prototype.apply = function(person) {
	if(SLVDEngine.frameClock == 1)
	{
		person.preventRender();
	}
};