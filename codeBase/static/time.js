/*The time system is based on an event queue and a clock.
Primarily, events will be queued in sprite template files using registerWalkEvent() (in sprite.js).
*/

SLVDEngine.Time = {};
SLVDEngine.Time.daily = [];
SLVDEngine.Time.once = [];

SLVDEngine.Time.componentToAbsolute = function(day, hour, minute, second) {
	return day*60*60*24 + hour*60*60 + minute*60 + second;
}

SLVDEngine.Time.registerEvent = function(event, isDaily, time) {
	var eventQueue = (isDaily ? SLVDEngine.Time.daily : SLVDEngine.Time.once);
	
	if(eventQueue[time] == null)
	{
		eventQueue[time] = [];
	}
	
	eventQueue[time].push(event);
}

SLVDEngine.Time.advance = function(seconds) {
	for(var index = 0; index < seconds; index++)
	{
		SLVDEngine.SAVE.timeSeconds = (SLVDEngine.SAVE.timeSeconds + 1)%60;
		if(SLVDEngine.SAVE.timeSeconds == 0)
		{
			SLVDEngine.SAVE.timeMinutes = (SLVDEngine.SAVE.timeMinutes + 1)%60;
			if(SLVDEngine.SAVE.timeMinutes == 0)
			{
				SLVDEngine.SAVE.timeHours = (SLVDEngine.SAVE.timeHours + 1)%24;
				if(SLVDEngine.SAVE.timeHours == 0) SLVDEngine.SAVE.timeDays++;
			}
			
			//One-time events
			var cTime = SLVDEngine.SAVE.timeDays*60*60*24 + SLVDEngine.SAVE.timeHours*60*60 + SLVDEngine.SAVE.timeMinutes*60 + SLVDEngine.SAVE.timeSeconds;
			if(cTime in SLVDEngine.Time.once)
			{
				for(var i = 0; i < SLVDEngine.Time.once[cTime].length; i++)
				{
					SLVDEngine.Time.once[cTime][i]();
				}
			}
			
			//Daily events
			var cTime = SLVDEngine.SAVE.timeHours*60*60 + SLVDEngine.SAVE.timeMinutes*60 + SLVDEngine.SAVE.timeSeconds;	
			if(cTime in SLVDEngine.Time.daily)
			{
				for(var i = 0; i < SLVDEngine.Time.daily[cTime].length; i++)
				{
					SLVDEngine.Time.daily[cTime][i]();
				}
			}
		}
	}
}

SLVDEngine.Time.renderClock = function(context) {
	context.drawImage(SLVDEngine.image["clock.png"], SLVDEngine.SCREENX - 140, 0);
	context.lineWidth = 1;
	context.strokeStyle="#DDDDDD";
	var hand = Math.PI/2 - (2*(SLVDEngine.SAVE.timeSeconds/60)*Math.PI);
	context.beginPath();
	context.moveTo(SLVDEngine.SCREENX - 70, 70);
	context.lineTo(SLVDEngine.SCREENX - 70 + 50*Math.cos(hand), 70 - 50*Math.sin(hand));
	context.stroke();
	context.lineWidth = 2
	context.strokeStyle="#000000";
	hand = Math.PI/2 - (2*(SLVDEngine.SAVE.timeMinutes/60)*Math.PI);
	context.beginPath();
	context.moveTo(SLVDEngine.SCREENX - 70, 70);
	context.lineTo(SLVDEngine.SCREENX - 70 + 50*Math.cos(hand), 70 - 50*Math.sin(hand));
	context.stroke();
	context.strokeStyle="#EE0000";
	context.lineWidth = 3;
	hand = Math.PI/2 - (2*(SLVDEngine.SAVE.timeHours/12)*Math.PI);
	context.beginPath();
	context.moveTo(SLVDEngine.SCREENX - 70, 70);
	context.lineTo(SLVDEngine.SCREENX - 70 + 50*Math.cos(hand), 70 - 50*Math.sin(hand));
	context.stroke();
}
