/*The status system is built off of the action and motion systems. It is intended to handle prolonged inflictions of statuses.
See the "hurt" status below for an example.
It is important to note that Statuses are somewhat different from both Actions and Motions by definition.
	Statuses are often dependent on the attacker instead of the person who "has" the Status.
	For this reason, we utilize JS prototypal inheritance in Statuses 
	in order to hold more information in the Status than just the Sprite.*/

var Status = {};

Status.handle = function(person) {
	if(person.status.length > 0)
	{
		for(var i = 0; i < person.status.length; i++)
		{
			Status.apply(person, i);
		}
	}
}

Status.apply = function(person, i) {
	var status = person.status[i];
	status.apply(person);
	status.time--;
	if(status.time <= 0)
	{
		person.status.splice(i, 1);
	}
}

function baseStatus() { }

baseStatus.prototype.time = 0;
baseStatus.prototype.apply = function(person) { this.time--; }
baseStatus.prototype.see = function(person) { /*renderBoardCStd(person);*/ }

Status["hurt"] = function(time) { 
	if(time != null)
	{
		this.time = time;
	}
}
Status["hurt"].prototype = new baseStatus();
Status["hurt"].prototype.constructor = Status["hurt"];
Status["hurt"].prototype.apply = function(person) {
	//person.statusCountdown--;
	if(frameClock == 1)
	{
		person.preventMotionSee();
		person.preventActionSee();
	}
}