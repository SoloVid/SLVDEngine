gen = document.getElementById("bod");

//<canvas class="center" id="seenCanvas" width="640" height="480" style="border:1px solid #d3d3d3;">
seeB = document.createElement("canvas");//document.getElementById("seenCanvas");
seeB.setAttribute("class", "center");
seeB.setAttribute("width", SCREENX);
seeB.setAttribute("height", SCREENY);
seeB.setAttribute("style", "border:1px solid #d3d3d3;");
gen.appendChild(seeB);
see = seeB.getContext("2d");

buffer = document.getElementById("buffer");
buffer.setAttribute("width", SCREENX);
buffer.setAttribute("height", SCREENY);
bufferCtx = buffer.getContext("2d");

snapShot = document.getElementById("snapShot");
snapShot.setAttribute("width", SCREENX);
snapShot.setAttribute("height", SCREENY);
snapShotCtx = snapShot.getContext("2d");

var holder = document.getElementById("holderCanvas")

//Initialize
SLVD.getXML("files/main/master.xml").then(function(master) {
	for(var index = 0; index < master.getElementsByTagName("image").length; index++) //Load all images referenced in master.xml outside of levels
	{
		image[index] = new Image();
		image[index].src = "files/images/" + master.getElementsByTagName("image")[index].childNodes[0].nodeValue;
		image[master.getElementsByTagName("image")[index].childNodes[0].nodeValue] = image[index];
	}
	
	for(var index = 0; index < master.getElementsByTagName("music").length; index++) //Load all audio
	{
		audio[index] = audioCreate("files/audio/" + master.getElementsByTagName("music")[index].childNodes[0].nodeValue, index);
		audio[index].loop = true
		audio[master.getElementsByTagName("music")[index].childNodes[0].nodeValue] = audio[index];
	}
	for(var second = index; second < master.getElementsByTagName("soundeffect") + index; second++)
	{
		audio[second] = audioCreate("files/audio/" + master.getElementsByTagName("soundeffect")[second].childNodes[0].nodeValue, second);
		audio[second].loop = false;
		audio[master.getElementsByTagName("soundeffect")[second].childNodes[0].nodeValue] = audio[second];
	}
	
	function loadOneLevel(index) {
		if(index >= master.getElementsByTagName("level").length) {
			return SLVD.promise.as();
		}
	
		//Create level holder
		level[index] = {};
		//Get file name
		level[index].file = master.getElementsByTagName("level")[index].childNodes[0].nodeValue;
		//Save accessible xml
		return SLVD.getXML("files/levels/" + level[index].file).then(function(data) {
			level[index].filedata = data;
			//Get the name of level
			level[index].name = data.getElementsByTagName("name")[0].childNodes[0].nodeValue;
			//Get the images for level
			level[index].layerImg = [];
			level[index].layerFuncData = [];
			level[index].type = data.getElementsByTagName("type")[0].childNodes[0].nodeValue; //level type
			for(var second = 0; second < data.getElementsByTagName("background").length; second++)
			{
				if(data.getElementsByTagName("background")[second].childNodes[0].nodeValue == "level_General_Blank.png")
				{
					level[index].layerImg[second] = image["level_General_Blank.png"];
				}
				else
				{
					level[index].layerImg[second] = new Image();
					level[index].layerImg[second].src = "files/images/" + data.getElementsByTagName("background")[second].childNodes[0].nodeValue;
				}
			}
			//Initialize board programs. These programs are stored in <boardProgram> nodes which are placed into a generated script to declare functions for the level objects.
			level[index].boardProgram = [];
			for(var second = 0; second < data.getElementsByTagName("boardProgram").length; second++)
			{
				var content = data.getElementsByTagName("boardProgram")[second].childNodes[0].nodeValue;
				var inline = "level[" + index + "].boardProgram[" + second + "] = function(cue) {" + evalFunc(content) + " };";
				eval(inline);
			}
			for(var second = 0; second < data.getElementsByTagName("NPC").length; second++)
			{
				var current = NPC.length;

				var template = data.getElementsByTagName("NPC")[second].getAttribute("template")
				var NPCCode = data.getElementsByTagName("NPC")[second].textContent;
				
				NPC[current] = SLVDEngine.evalObj(template, NPCCode);
				NPC[current].lvl = level[index].name;
			}	
			
			return loadOneLevel(index + 1);
		});
	}
	
	//Begin recursion
	loadOneLevel(0).then(function(data) {
		//Generate lookup for NPC
		for(var i = 0; i < NPC.length; i++)
		{
			NPC[NPC[i].name] = NPC[i];
		}
		
		//Begin main loop
		setInterval(SLVDEngine.main, 1000/FPS);
	});
});

function loadUpdate() { //Used in main interval of engine
	//var loading is the index of both image and level being checked
	if(loading >= image.length && loading >= level.length)
	{
		//If done loading, startup (in the initialize.js file)
		startUp();
		return;
	}
	if((loading < image.length && image[loading].complete == true) || loading >= image.length) { loadCheck[0] = 1; } //image[loading] corresponds fo loadCheck[0]
	if(loading < level.length)
	{
		for(var index = 0; index < level[loading].layerImg.length; index++)
		{
			//If level's layer's images have loaded, get the functional layer image data and mark load check as done
			if(level[loading].layerImg[index].complete == true /*&& level[loading].layerFunc[index].complete == true*/ && loadCheck[index + 1] == null)
			{
				holder.width = level[loading].layerImg[index].width/(level[loading].type == "TRPG" ? 32 : 1);
				holder.height = level[loading].layerImg[index].height/(level[loading].type == "TRPG" ? 32 : 1);
				var holderCtx = holder.getContext("2d");
				holderCtx.clearRect(0, 0, holder.width, holder.height);
				
				//Draw vectors
				var layerVectors = level[loading].filedata.getElementsByTagName("layer")[index].getElementsByTagName("vector");
				
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
		
				//holderCtx.drawImage(level[loading].layerFunc[index], 0, 0);
				level[loading].layerFuncData[index] = holderCtx.getImageData(0, 0, level[loading].layerImg[index].width, level[loading].layerImg[index].height);
				loadCheck[index + 1] = 1;
			}
		}
	}
	//Display load "percentage"
	see.fillStyle = "#000000";
	see.fillRect(0, 0, SCREENX, SCREENY);
	see.fillStyle = "#FFFFFF";
	see.fillText("Loading: " + Math.round(((loading + 0)/image.length)*100) + "%", 250, 230);

	if(level[loading] != null)
	{
		for(var index = 0; index <= level[loading].layerImg.length; index++)
		{
			if(loadCheck[index] != 1) { index = level[loading].layerImg.length + 2; };
		}	
		if(index == level[loading].layerImg.length + 1)
		{	
			loading++;
			loadCheck.length = 0;
		}
	}
	else if(loadCheck[0] == 1)
	{
		loading++;
		loadCheck.length = 0;
	}
}