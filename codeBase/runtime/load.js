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
		SLVDEngine.audio[index] = SLVDEngine.audioCreate("files/SLVDEngine.audio/music/" + master.getElementsByTagName("music")[index].childNodes[0].nodeValue, index);
		SLVDEngine.audio[index].loop = true
		SLVDEngine.audio[master.getElementsByTagName("music")[index].childNodes[0].nodeValue] = SLVDEngine.audio[index];
	}
	for(var second = index; second < master.getElementsByTagName("soundeffect") + index; second++)
	{
		SLVDEngine.audio[second] = SLVDEngine.audioCreate("files/SLVDEngine.audio/soundeffects/" + master.getElementsByTagName("soundeffect")[second].childNodes[0].nodeValue, second);
		SLVDEngine.audio[second].loop = false;
		SLVDEngine.audio[master.getElementsByTagName("soundeffect")[second].childNodes[0].nodeValue] = SLVDEngine.audio[second];
	}
		
	SLVDEngine.loadOneLevel = function(index) {
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
			SLVDEngine.level[index].type = data.getElementsByTagName("type")[0].childNodes[0].nodeValue; //SLVDEngine.level type
			for(var second = 0; second < data.getElementsByTagName("background").length; second++)
			{
				if(data.getElementsByTagName("background")[second].childNodes[0].nodeValue == "level_General_Blank.png")
				{
					SLVDEngine.level[index].layerImg[second] = SLVDEngine.image["level_General_Blank.png"];
				}
				else
				{
					SLVDEngine.level[index].layerImg[second] = new Image();
					SLVDEngine.level[index].layerImg[second].src = "files/images/" + data.getElementsByTagName("background")[second].childNodes[0].nodeValue;
				}
			}
			//Initialize board programs. These programs are stored in <boardProgram> nodes which are placed into a generated script to declare functions for the SLVDEngine.level objects.
			SLVDEngine.level[index].boardProgram = [];
			for(var second = 0; second < data.getElementsByTagName("boardProgram").length; second++)
			{
				var content = data.getElementsByTagName("boardProgram")[second].childNodes[0].nodeValue;
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
	var holder = document.getElementById("holderCanvas")

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
			//If SLVDEngine.level's layer's images have loaded, get the functional layer SLVDEngine.image data and mark load check as done
			if(SLVDEngine.level[SLVDEngine.loading].layerImg[index].complete == true /*&& SLVDEngine.level[SLVDEngine.loading].layerFunc[index].complete == true*/ && SLVDEngine.loadCheck[index + 1] == null)
			{
				holder.width = SLVDEngine.level[SLVDEngine.loading].layerImg[index].width/(SLVDEngine.level[SLVDEngine.loading].type == "TRPG" ? 32 : 1);
				holder.height = SLVDEngine.level[SLVDEngine.loading].layerImg[index].height/(SLVDEngine.level[SLVDEngine.loading].type == "TRPG" ? 32 : 1);
				var holderCtx = holder.getContext("2d");
				holderCtx.clearRect(0, 0, holder.width, holder.height);
				
				//Draw vectors
				var layerVectors = SLVDEngine.level[SLVDEngine.loading].filedata.getElementsByTagName("layer")[index].getElementsByTagName("vector");
				
				holderCtx.translate(.5, .5);
				
				for(var j = 0; j < layerVectors.length; j++)
				{
					holderCtx.strokeStyle = layerVectors[j].getAttribute("template");//.getElementsByTagName("color")[0].textContent;
					holderCtx.fillStyle = holderCtx.strokeStyle;
					
					var regex = /\([^\)]+\)/g;
					var xRegex = /\(([\d]*),/;
					var yRegex = /,[\s]*([\d]*)\)/;
					var newX, newY;
					
					var pointStr = layerVectors[j].textContent;//.getElementsByTagName("path")[0].textContent;
					var points = pointStr.match(regex);
					console.log(points.length + "|" + points + "|");
					
					holderCtx.beginPath();

					newX = points[0].match(xRegex)[1];
					newY = points[0].match(yRegex)[1];
					
					holderCtx.moveTo(newX, newY);
					
					holderCtx.fillRect(newX - .5, newY - .5, 1, 1);
					
					for(var k = 1; k < points.length; k++)
					{
						if(points[k] == "(close)")
						{
							holderCtx.closePath();
							holderCtx.stroke();
							holderCtx.fill();
						}
						else
						{			
							newX = points[k].match(xRegex)[1];
							newY = points[k].match(yRegex)[1];
					
							holderCtx.lineTo(newX, newY);
							holderCtx.stroke();
							holderCtx.fillRect(newX - .5, newY - .5, 1, 1);
						}
					}
				}
				holderCtx.translate(-.5, -.5);
		
				//holderCtx.drawImage(SLVDEngine.level[SLVDEngine.loading].layerFunc[index], 0, 0);
				SLVDEngine.level[SLVDEngine.loading].layerFuncData[index] = holderCtx.getImageData(0, 0, SLVDEngine.level[SLVDEngine.loading].layerImg[index].width, SLVDEngine.level[SLVDEngine.loading].layerImg[index].height);
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