//Load from localStorage save "file" of fileName, returns SLVDEngine.level name to be passed to enterLevelByName()
SLVDEngine.fileLoad = function(fileName) {
	var keyList = { level: "", x: "", y: "", layer: "", mvmt: "", speech: "", dmnr: "", dir: "", steps: "", pushy: "", hp: "", maxHp: "", strg: "", spd: "" }; 

	for(var index = 0; index < SLVDEngine.NPC.length; index++)
	{
		for(var key in keyList)
		{
			var item = localStorage.getItem(GAMEID + "_" + fileName + "_NPC" + index + "_" + key);
			if(item != null) 
			{ 
				if(key != "SLVDEngine.level" && key != "speech") SLVDEngine.NPC[index][key] = Number(item); 
				else SLVDEngine.NPC[index][key] = item;
			}
			else { console.log(item + "=null"); }
		}
	}
	for(var index = 0; index < SLVDEngine.player.length; index++)
	{
		for(var key in keyList)
		{
			var item = localStorage.getItem(GAMEID + "_" + fileName + "_player" + index + "_" + key);
			if(item != null) 
			{ 
				if(key != "SLVDEngine.level" && key != "speech") SLVDEngine.player[index][key] = Number(item); 
				else SLVDEngine.player[index][key] = item;
			}
			else { console.log(index + key + "=null"); }
		}
	}
	
	//localStorage.getItem(GAMEID + "_" + fileName + "_SLVDEngine.currentLevelName");
	SLVDEngine.currentPlayer = eval(localStorage.getItem(GAMEID + "_" + fileName + "_currentPlayer"));	
	var item = localStorage.getItem(GAMEID + "_" + fileName + "_SAVE");
	SLVDEngine.SAVE = JSON.parse(item);

	//Return SLVDEngine.level name
	return localStorage.getItem(GAMEID + "_" + fileName + "_SLVDEngine.currentLevelName");
};

//Save current game to localStorage "file" of fileName
SLVDEngine.fileSave = function(fileName) {
	console.log("starting save...");
	var keyList = { level: "", x: "", y: "", layer: "", mvmt: "", speech: "", dmnr: "", dir: "", steps: "", pushy: "", hp: "", maxHp: "", strg: "", spd: "" }; 
	console.log("listed keys");
	for(var index in SLVDEngine.NPC)
	{
		//console.log("saving SLVDEngine.NPC" + index);
		for(var key in keyList)
		{
			//console.log("saving" + key);
			try {
			localStorage.setItem(GAMEID + "_" + fileName + "_NPC" + index + "_" + key, SLVDEngine.NPC[index][key]); }
			catch(e) { console.log("failed on SLVDEngine.NPC " + index + " " + key); }
		}
	}
	console.log("between loops");
	for(var index in SLVDEngine.player)
	{
		for(var key in keyList)
		{
			try {
			localStorage.setItem(GAMEID + "_" + fileName + "_player" + index + "_" + key, SLVDEngine.player[index][key]); }
			catch(e) { console.log("failed on SLVDEngine.player " + index + " " + key); }
		}
	}
	console.log("through loops");

	localStorage.setItem(GAMEID + "_" + fileName + "_SLVDEngine.currentLevelName", SLVDEngine.currentLevel.name);
	console.log("saved SLVDEngine.level name as " + SLVDEngine.currentLevel.name);
	localStorage.setItem(GAMEID + "_" + fileName + "_currentPlayer", SLVDEngine.currentPlayer);
	localStorage.setItem(GAMEID + "_" + fileName + "_SAVE", JSON.stringify(SLVDEngine.SAVE));
	console.log("done");
};