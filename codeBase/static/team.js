//SLVDEngine.Team is a class that will be used to separate out different Sprites in the game

SLVDEngine.Team = function(name) {
	this.name = name;
	this.alliances = [];
};

SLVDEngine.Team.prototype.isAllied = function(otherTeam) {
	//Self is ally
	if(otherTeam == this) 
	{
		return true;
	}
	else 
	{
		for(var i = 0; i < this.alliances.length; i++) 
		{
			if(this.alliances[i] == otherTeam)
			{
				return true;
			}
		}
		return false;
	}
};

SLVDEngine.Team.prototype.removeAlly = function(otherTeam) {
	for(var i = 0; i < this.alliances.length; i++)
	{
		if(this.alliances[i] == otherTeam) {
			this.alliances.splice(i, 1);
			i--;
		}
	}
};

SLVDEngine.allyTeams = function(team1, team2) {
	team1.alliances.push(team2);
	team2.alliances.push(team1);
};

SLVDEngine.unallyTeams = function(team1, team2) {
	team1.removeAlly(team2);
	team2.removeAlly(team1);
};

SLVDEngine.Teams["neutral"] = new SLVDEngine.Team("neutral");
SLVDEngine.Teams["heroParty"] = new SLVDEngine.Team("heroParty");
SLVDEngine.Teams["empire"] = new SLVDEngine.Team("empire");