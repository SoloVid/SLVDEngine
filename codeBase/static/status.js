/*The status system is built off of the action system. It is intended to handle prolonged inflictions of statuses.
See the "hurt" status below for an example.
It is important to note that Statuses are somewhat different from both Actions and Motions by definition.
	Statuses are often dependent on the attacker instead of the person who "has" the Status.
	For this reason, we utilize JS prototypal inheritance in Statuses 
	in order to hold more information in the Status than just the Sprite.*/

var Status = {};

function baseStatus() { }

baseStatus.prototype.time = 0;
baseStatus.prototype.apply = function(person) { this.time--; }
baseStatus.prototype.see = function(person) { }

Status["hurt"] = function(sec) { 
	if(sec !== undefined)
	{
		this.time = sec*FPS;
	}
}
Status["hurt"].prototype = new baseStatus();
Status["hurt"].prototype.constructor = Status["hurt"];
Status["hurt"].prototype.apply = function(person) {
	if(frameClock == 1)
	{
		SpriteF.preventRender.call(person);
	}
}