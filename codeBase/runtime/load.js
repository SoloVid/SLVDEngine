//<canvas class="center" id="seenCanvas" width="640" height="480" style="border:1px solid #d3d3d3;">
SLVDEngine.seeB = document.createElement("canvas");//document.getElementById("seenCanvas");
SLVDEngine.seeB.setAttribute("class", "center");
SLVDEngine.seeB.setAttribute("width", SLVDEngine.SCREENX);
SLVDEngine.seeB.setAttribute("height", SLVDEngine.SCREENY);
SLVDEngine.seeB.setAttribute("style", "border:1px solid #d3d3d3;");
document.getElementById("bod").appendChild(SLVDEngine.seeB);
SLVDEngine.see = SLVDEngine.seeB.getContext("2d");

SLVDEngine.buffer = document.getElementById("buffer");
SLVDEngine.buffer.setAttribute("width", SLVDEngine.SCREENX);
SLVDEngine.buffer.setAttribute("height", SLVDEngine.SCREENY);
SLVDEngine.bufferCtx = SLVDEngine.buffer.getContext("2d");

SLVDEngine.snapShot = document.getElementById("snapShot");
SLVDEngine.snapShot.setAttribute("width", SLVDEngine.SCREENX);
SLVDEngine.snapShot.setAttribute("height", SLVDEngine.SCREENY);
SLVDEngine.snapShotCtx = SLVDEngine.snapShot.getContext("2d");

//Initialize
SLVD.getXML("files/main/master.xml").then(function(master) {
	for(var index = 0; index < master.getElementsByTagName("image").length; index++) //Load all images referenced in master.xml outside of levels
	{
		SLVDEngine.image[index] = new Image();
		SLVDEngine.image[index].src = "files/images/preloaded/" + master.getElementsByTagName("image")[index].childNodes[0].nodeValue;
		SLVDEngine.image[master.getElementsByTagName("image")[index].childNodes[0].nodeValue] = SLVDEngine.image[index];
	}
	
	for(var index = 0; index < master.getElementsByTagName("music").length; index++) //Load all SLVDEngine.audio
	{
		SLVDEngine.audio[index] = SLVDEngine.audioCreate("files/audio/music/" + master.getElementsByTagName("music")[index].childNodes[0].nodeValue, index);
		SLVDEngine.audio[index].loop = true
		SLVDEngine.audio[master.getElementsByTagName("music")[index].childNodes[0].nodeValue] = SLVDEngine.audio[index];
	}
	for(var second = index; second < master.getElementsByTagName("soundeffect") + index; second++)
	{
		SLVDEngine.audio[second] = SLVDEngine.audioCreate("files/audio/soundeffects/" + master.getElementsByTagName("soundeffect")[second].childNodes[0].nodeValue, second);
		SLVDEngine.audio[second].loop = false;
		SLVDEngine.audio[master.getElementsByTagName("soundeffect")[second].childNodes[0].nodeValue] = SLVDEngine.audio[second];
	}
		
	function loadOneLevel(index) {
		if(index >= master.getElementsByTagName("level").length) {
			return SLVD.promise.as();
		}
	
		//Create SLVDEngine.level holder
		SLVDEngine.level[index] = {};
		//Get file name
		SLVDEngine.level[index].file = master.getElementsByTagName("level")[index].childNodes[0].nodeValue;
		//Save accessible xml
		return SLVD.getXML("files/levels/" + SLVDEngine.level[index].file).then(function(data) {
			SLVDEngine.level[index].filedata = data;
			//Get the name of SLVDEngine.level
			SLVDEngine.level[index].name = data.getElementsByTagName("name")[0].childNodes[0].nodeValue;
			//Get the images for SLVDEngine.level
			SLVDEngine.level[index].layerImg = [];
			SLVDEngine.level[index].layerFuncData = [];
			SLVDEngine.level[index].type = data.getElementsByTagName("type")[0].textContent; //SLVDEngine.level type
			SLVDEngine.level[index].width = 0;
			SLVDEngine.level[index].height = 0;
			for(var second = 0; second < data.getElementsByTagName("background").length; second++)
			{
				SLVDEngine.level[index].layerImg[second] = data.getElementsByTagName("background")[second].textContent;
			}
			//Initialize board programs. These programs are stored in <boardProgram> nodes which are placed into a generated script to declare functions for the SLVDEngine.level objects.
			SLVDEngine.level[index].boardProgram = [];
			for(var second = 0; second < data.getElementsByTagName("boardProgram").length; second++)
			{
				var content = data.getElementsByTagName("boardProgram")[second].textContent;
				SLVDEngine.level[index].boardProgram[second] = new Function(content);
			}
			for(var second = 0; second < data.getElementsByTagName("NPC").length; second++)
			{
				var current = SLVDEngine.NPC.length;

				var template = data.getElementsByTagName("NPC")[second].getAttribute("template")
				var NPCCode = data.getElementsByTagName("NPC")[second].textContent;
				
				SLVDEngine.NPC[current] = SLVDEngine.evalObj(template, NPCCode);
				SLVDEngine.NPC[current].lvl = SLVDEngine.level[index].name;
			}	
			
			return loadOneLevel(index + 1);
		});
	}
	
	//Begin recursion
	loadOneLevel(0).then(function(data) {
		//Generate lookup for SLVDEngine.NPC
		for(var i = 0; i < SLVDEngine.NPC.length; i++)
		{
			SLVDEngine.NPC[SLVDEngine.NPC[i].name] = SLVDEngine.NPC[i];
		}
		
		//Begin main loop
		setInterval(SLVDEngine.main, 1000/SLVDEngine.FPS);
	});
});

SLVDEngine.loadUpdate = function() { //Used in main interval of engine
	var holder = document.getElementById("holderCanvas");

	//var SLVDEngine.loading is the index of both SLVDEngine.image and SLVDEngine.level being checked
	if(SLVDEngine.loading >= SLVDEngine.image.length && SLVDEngine.loading >= SLVDEngine.level.length)
	{
		//If done SLVDEngine.loading, startup (in the initialize.js file)
		startUp();
		return;
	}
	if((SLVDEngine.loading < SLVDEngine.image.length && SLVDEngine.image[SLVDEngine.loading].complete == true) || SLVDEngine.loading >= SLVDEngine.image.length) { SLVDEngine.loadCheck[0] = 1; } //SLVDEngine.image[SLVDEngine.loading] corresponds fo SLVDEngine.loadCheck[0]
	if(SLVDEngine.loading < SLVDEngine.level.length)
	{
		for(var index = 0; index < SLVDEngine.level[SLVDEngine.loading].layerImg.length; index++)
		{
			var layerImg = SLVDEngine.getImage(SLVDEngine.level[SLVDEngine.loading].layerImg[index]);
			//If SLVDEngine.level's layer's images have loaded, get the functional layer SLVDEngine.image data and mark load check as done
			if(layerImg.complete == true /*&& SLVDEngine.level[SLVDEngine.loading].layerFunc[index].complete == true*/ && SLVDEngine.loadCheck[index + 1] == null)
			{
				if(layerImg.height > SLVDEngine.level[SLVDEngine.loading].height)
				{
					SLVDEngine.level[SLVDEngine.loading].height = layerImg.height;
				}
				if(layerImg.width > SLVDEngine.level[SLVDEngine.loading].width)
				{
					SLVDEngine.level[SLVDEngine.loading].width = layerImg.width;
				}
				
				SLVDEngine.loadCheck[index + 1] = 1;
			}
		}
	}
	//Display load "percentage"
	SLVDEngine.see.fillStyle = "#000000";
	SLVDEngine.see.fillRect(0, 0, SLVDEngine.SCREENX, SLVDEngine.SCREENY);
	SLVDEngine.see.fillStyle = "#FFFFFF";
	SLVDEngine.see.fillText("Loading: " + Math.round(((SLVDEngine.loading + 0)/SLVDEngine.image.length)*100) + "%", 250, 230);

	if(SLVDEngine.level[SLVDEngine.loading] != null)
	{
		for(var index = 0; index <= SLVDEngine.level[SLVDEngine.loading].layerImg.length; index++)
		{
			if(SLVDEngine.loadCheck[index] != 1) { index = SLVDEngine.level[SLVDEngine.loading].layerImg.length + 2; };
		}	
		if(index == SLVDEngine.level[SLVDEngine.loading].layerImg.length + 1)
		{	
			SLVDEngine.loading++;
			SLVDEngine.loadCheck.length = 0;
		}
	}
	else if(SLVDEngine.loadCheck[0] == 1)
	{
		SLVDEngine.loading++;
		SLVDEngine.loadCheck.length = 0;
	}
};