/*The time system is based on an event queue and a clock.
Primarily, events will be queued in sprite template files using registerWalkEvent() (in sprite.js).
*/

var Time = {};
Time.daily = [];
Time.once = [];

Time.componentToAbsolute = function(day, hour, minute, second) {
	return day*60*60*24 + hour*60*60 + minute*60 + second;
}

Time.registerEvent = function(event, isDaily, time) {
	var eventQueue = (isDaily ? Time.daily : Time.once);
	
	if(eventQueue[time] == null)
	{
		eventQueue[time] = [];
	}
	
	eventQueue[time].push(event);
}

Time.advance = function(seconds) {
	for(var index = 0; index < seconds; index++)
	{
		SAVE.timeSeconds = (SAVE.timeSeconds + 1)%60;
		if(SAVE.timeSeconds == 0)
		{
			SAVE.timeMinutes = (SAVE.timeMinutes + 1)%60;
			if(SAVE.timeMinutes == 0)
			{
				SAVE.timeHours = (SAVE.timeHours + 1)%24;
				if(SAVE.timeHours == 0) SAVE.timeDays++;
			}
			
			//One-time events
			var cTime = SAVE.timeDays*60*60*24 + SAVE.timeHours*60*60 + SAVE.timeMinutes*60 + SAVE.timeSeconds;
			if(cTime in Time.once)
			{
				for(var i = 0; i < Time.once[cTime].length; i++)
				{
					Time.once[cTime][i]();
				}
			}
			
			//Daily events
			var cTime = SAVE.timeHours*60*60 + SAVE.timeMinutes*60 + SAVE.timeSeconds;	
			if(cTime in Time.daily)
			{
				for(var i = 0; i < Time.daily[cTime].length; i++)
				{
					Time.daily[cTime][i]();
				}
			}
		}
	}
}

Time.renderClock = function(context) {
	context.drawImage(image["clock.png"], SCREENX - 140, 0);
	context.lineWidth = 1;
	context.strokeStyle="#DDDDDD";
	var hand = Math.PI/2 - (2*(SAVE.timeSeconds/60)*Math.PI);
	context.beginPath();
	context.moveTo(SCREENX - 70, 70);
	context.lineTo(SCREENX - 70 + 50*Math.cos(hand), 70 - 50*Math.sin(hand));
	context.stroke();
	context.lineWidth = 2
	context.strokeStyle="#000000";
	hand = Math.PI/2 - (2*(SAVE.timeMinutes/60)*Math.PI);
	context.beginPath();
	context.moveTo(SCREENX - 70, 70);
	context.lineTo(SCREENX - 70 + 50*Math.cos(hand), 70 - 50*Math.sin(hand));
	context.stroke();
	context.strokeStyle="#EE0000";
	context.lineWidth = 3;
	hand = Math.PI/2 - (2*(SAVE.timeHours/12)*Math.PI);
	context.beginPath();
	context.moveTo(SCREENX - 70, 70);
	context.lineTo(SCREENX - 70 + 50*Math.cos(hand), 70 - 50*Math.sin(hand));
	context.stroke();
}
