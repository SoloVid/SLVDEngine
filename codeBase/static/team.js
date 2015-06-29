//Team is a class that will be used to separate out different Sprites in the game

function Team(name) {
	this.name = name;
	this.alliances = [];
}

Team.prototype.isAllied = function(otherTeam) {
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

Team.prototype.removeAlly = function(otherTeam) {
	for(var i = 0; i < this.alliances.length; i++)
	{
		if(this.alliances[i] == otherTeam) {
			this.alliances.splice(i, 1);
			i--;
		}
	}
};

function allyTeams(team1, team2) {
	team1.alliances.push(team2);
	team2.alliances.push(team1);
}

function unallyTeams(team1, team2) {
	team1.removeAlly(team2);
	team2.removeAlly(team1);
}

Teams["neutral"] = new Team("neutral");