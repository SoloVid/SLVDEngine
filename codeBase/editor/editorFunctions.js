function toPolygon() { console.log("polygon mode"); mode = "polygon"; }
function toNPC() { mode = "NPC"; }
function toBoardObj() { mode = "boardObj"; }

function setMode(name) { mode = name; }

function drawVectors(highlightIndex, drawTo)
{
	var ignoreHighlighted = false;
	if(!drawTo)
	{
		drawTo = "whiteboard";
	}
	else
	{
		ignoreHighlighted = true;
	}

	var XMLLayers = levelXML.getElementsByTagName("layer");
	
	var cnvLayers = document.getElementsByClassName(drawTo);
	
	var absoluteVectorIndex = 0;
	
	for(var i = 0; i < XMLLayers.length; i++)
	{
		var layerVectors = XMLLayers[i].getElementsByTagName("vector");
		
		var ctx = cnvLayers[i].getContext("2d");
		
		ctx.clearRect(window.pageXOffset - 120, window.pageYOffset - 10, window.innerWidth + 20, window.innerHeight + 20);
		//ctx.clearRect(0, 0, cnvLayers[i].width, cnvLayers[i].height);
		
		ctx.translate(.5, .5);
		
		for(var j = 0; j < layerVectors.length; j++)
		{
			if(highlightIndex !== undefined && highlightIndex == absoluteVectorIndex)
			{
				if(ignoreHighlighted)
				{
					absoluteVectorIndex++;
					continue;
				}
				ctx.strokeStyle = "#0000FF";
			}
			else
			{
				ctx.strokeStyle = layerVectors[j].getAttribute("template");//.getElementsByTagName("color")[0].textContent;
			}
			ctx.fillStyle = ctx.strokeStyle;
			
			var regex = /\([^\)]+\)/g;
			var xRegex = /\((-?[\d]*),/;
			var yRegex = /,[\s]*(-?[\d]*)\)/;
			var newX, newY;
			
			var pointStr = layerVectors[j].textContent;//.getElementsByTagName("path")[0].textContent;
			var points = pointStr.match(regex);
			//console.log(points.length + "|" + points + "|");
			
			ctx.beginPath();

			newX = points[0].match(xRegex)[1];
			newY = points[0].match(yRegex)[1];
			
			ctx.moveTo(newX, newY);
			
			ctx.fillRect(newX - .5, newY - .5, 1, 1);
			
			for(var k = 1; k < points.length; k++)
			{
				if(points[k] == "(close)")
				{
					ctx.closePath();
					ctx.stroke();
					ctx.fill();
				}
				else
				{			
					newX = points[k].match(xRegex)[1];
					newY = points[k].match(yRegex)[1];
			
					ctx.lineTo(newX, newY);
					ctx.stroke();
					ctx.fillRect(newX - .5, newY - .5, 1, 1);
				}
			}
			
			absoluteVectorIndex++;
		}
		ctx.translate(-.5, -.5);
	}
}

function drawVectorsFromBackup(highlightIndex) {
	var XMLLayers = levelXML.getElementsByTagName("layer");
	
	var cnvLayers = document.getElementsByClassName("whiteboard");
	var backupLayers = document.getElementsByClassName("backupCanv");
	
	var i;
	
	for(i = 0; i < XMLLayers.length; i++)
	{		
		var ctx = cnvLayers[i].getContext("2d");
		
		ctx.clearRect(window.pageXOffset - 120, window.pageYOffset - 10, window.innerWidth + 20, window.innerHeight + 20);
		
		ctx.drawImage(backupLayers[i], window.pageXOffset - 120, window.pageYOffset - 10, window.innerWidth + 20, window.innerHeight + 20, window.pageXOffset - 120, window.pageYOffset - 10, window.innerWidth + 20, window.innerHeight + 20);		
	}
	
	i--;
	
	var highlightVector = levelXML.getElementsByTagName("vector")[highlightIndex];
	
	var ctx = cnvLayers[i].getContext("2d");
	
	ctx.translate(.5, .5);
	
	ctx.strokeStyle = "#0000FF";

	ctx.fillStyle = ctx.strokeStyle;
	
	var regex = /\([^\)]+\)/g;
	var xRegex = /\((-?[\d]*),/;
	var yRegex = /,[\s]*(-?[\d]*)\)/;
	var newX, newY;
	
	var pointStr = highlightVector.textContent;//.getElementsByTagName("path")[0].textContent;
	var points = pointStr.match(regex);
	//console.log(points.length + "|" + points + "|");
	
	ctx.beginPath();

	newX = points[0].match(xRegex)[1];
	newY = points[0].match(yRegex)[1];
	
	ctx.moveTo(newX, newY);
	
	ctx.fillRect(newX - .5, newY - .5, 1, 1);
	
	for(var k = 1; k < points.length; k++)
	{
		if(points[k] == "(close)")
		{
			ctx.closePath();
			ctx.stroke();
			ctx.fill();
		}
		else
		{			
			newX = points[k].match(xRegex)[1];
			newY = points[k].match(yRegex)[1];
	
			ctx.lineTo(newX, newY);
			ctx.stroke();
			ctx.fillRect(newX - .5, newY - .5, 1, 1);
		}
	}
	ctx.translate(-.5, -.5);
}

function findVector(x, y) {
	var XMLLayers = levelXML.getElementsByTagName("layer");
	
	var cnvLayers = document.getElementsByClassName("whiteboard");
	
	var absoluteVectorIndex = 0;
	
	for(var i = 0; i < XMLLayers.length; i++)
	{
		var layerVectors = XMLLayers[i].getElementsByTagName("vector");
		
		var ctx = cnvLayers[i].getContext("2d");
		
		ctx.clearRect(window.pageXOffset - 120, window.pageYOffset - 10, window.innerWidth + 20, window.innerHeight + 20);
		//ctx.clearRect(0, 0, cnvLayers[i].width, cnvLayers[i].height);
		
		ctx.translate(.5, .5);
		
		for(var j = 0; j < layerVectors.length; j++)
		{
			ctx.strokeStyle = layerVectors[j].getAttribute("template");//.getElementsByTagName("color")[0].textContent;
			ctx.fillStyle = ctx.strokeStyle;
			
			var regex = /\([^\)]+\)/g;
			var xRegex = /\((-?[\d]*),/;
			var yRegex = /,[\s]*(-?[\d]*)\)/;
			var newX, newY;
			
			var pointStr = layerVectors[j].textContent;//.getElementsByTagName("path")[0].textContent;
			var points = pointStr.match(regex);
			//console.log(points.length + "|" + points + "|");
			
			ctx.beginPath();

			newX = points[0].match(xRegex)[1];
			newY = points[0].match(yRegex)[1];
			
			ctx.moveTo(newX, newY);
			
			ctx.fillRect(newX - .5, newY - .5, 1, 1);
			
			for(var k = 1; k < points.length; k++)
			{
				if(points[k] == "(close)")
				{
					ctx.closePath();
					ctx.stroke();
					ctx.fill();
				}
				else
				{			
					newX = points[k].match(xRegex)[1];
					newY = points[k].match(yRegex)[1];
			
					ctx.lineTo(newX, newY);
					ctx.stroke();
					ctx.fillRect(newX - .5, newY - .5, 1, 1);
				}
			}
			
			var imgData = ctx.getImageData(x, y, 1, 1);
			
			if(imgData.data[3] != 0)
			{
				ctx.translate(-.5, -.5);
				return absoluteVectorIndex;
			}
			
			absoluteVectorIndex++;
		}
		ctx.translate(-.5, -.5);
	}
	
	return -1;
}

function clickFileChooser() {
	$("#fileChooser").click();
}

function loadFile2(data)
{
	console.log(data);
	levelXML = (new DOMParser()).parseFromString(data, "text/xml");
	
	$("#layers").empty();
	
	var layers = levelXML.getElementsByTagName("background");
	
	for(var i = 0; i < layers.length; i++)
	{
		createLayer("files/images/" + layers[i].textContent, true);
	}

/*	console.log(levelXML);
	return;*/
	
	var NPC = levelXML.getElementsByTagName("NPC");
	for(var i = 0; i < NPC.length; i++)
	{
//var a = new Date();
		createObject("NPC", true, i);
//var b = new Date();
		updateObject("NPC", i);
//var c = new Date();
//console.log("a to b: " + (b.getTime() - a.getTime()));
//console.log("b to c: " + (c.getTime() - b.getTime()));
	}
	var BO = levelXML.getElementsByTagName("boardObj");
	for(var i = 0; i < BO.length; i++)
	{
		createObject("boardObj", true, i);
		updateObject("boardObj", i);
	}
	
	generateLayerMenu();
	drawVectors();
}

function downloadFile()
{
	var xmltext = exportLevel(levelXML);
	
	var filename = "level_" + levelXML.getElementsByTagName("name")[0].textContent + ".xml";

/*	var bb = new Blob([xmltext], {type: 'text/plain'});

	var pom = document.createElement('a');
	
	pom.setAttribute('href', window.URL.createObjectURL(bb));
	pom.setAttribute('download', filename);*/

var pom = document.createElement('a');
  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(xmltext));
  pom.setAttribute('download', filename);

  pom.style.display = 'none';
  document.body.appendChild(pom);

  pom.click();

  document.body.removeChild(pom);
	
/*	pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
	pom.draggable = true; 
	pom.classList.add('dragout');*/
	
//	pom.click();
}

function resizeBoard(x, y)
{
	if(x == null || y == null)
	{
		BOARDX = Number(prompt("Width: ", BOARDX));
		BOARDY = Number(prompt("Width: ", BOARDY));
	}
	else
	{
		BOARDX = Number(x);
		BOARDY = Number(y);
	}

	$("#layers").css("width", (BOARDX + 220) + "px");
	$("#layers").css("height", (BOARDY) + "px");

	var c = $(".whiteboard").get();
	
	c.forEach(function(canv)
	{
		ctx = canv.getContext("2d");
		ctx.canvas.width = BOARDX/getPixelsPerPixel();
		ctx.canvas.height = BOARDY/getPixelsPerPixel();
		canv.style.width = BOARDX + "px";
		canv.style.height = BOARDY + "px";
	});
	
	var c2 = $(".backupCanv").get();
	
	c2.forEach(function(canv)
	{
		ctx = canv.getContext("2d");
		ctx.canvas.width = BOARDX/getPixelsPerPixel();
		ctx.canvas.height = BOARDY/getPixelsPerPixel();
		canv.style.width = BOARDX + "px";
		canv.style.height = BOARDY + "px";
	});
	
	var b = $(".layerDisplay").get();
	
	b.forEach(function (back)
	{
		back.style.width = BOARDX + "px";
		back.style.height = BOARDY + "px";
	});
	
	drawVectors();
}

function resizeBoardCheck(imgEl)
{
	var layerWidth = imgEl.width;
	var layerHeight = imgEl.height;
	
	if(layerWidth > BOARDX || layerHeight > BOARDY)
	{
		resizeBoard(layerWidth, layerHeight);
	}
}

function generateLayerMenu()
{
	var XMLLayers = levelXML.getElementsByTagName("layer");
	
	var layerMenu = document.getElementById("layerMenu");
	
	while(layerMenu.getElementsByTagName("br")[0] != layerMenu.firstChild)
	{
		layerMenu.removeChild(layerMenu.firstChild);
	}
		
	for(var i = 0; i < XMLLayers.length; i++)
	{
		var menuLayer = document.createElement("div");
		menuLayer.setAttribute("class", "menuLayer");
		layerMenu.insertBefore(menuLayer, layerMenu.getElementsByTagName("br")[0]);
		
		var layerLabel = document.createElement("div");
		layerLabel.setAttribute("class", "layerLabel");
		layerLabel.textContent = "Layer " + i;
		layerLabel.style.display = "inline";
		menuLayer.appendChild(layerLabel);
		
		var checkBox = document.createElement("input");
		checkBox.type = "checkbox";
		if($(document.getElementsByClassName("layerDisplay")[i]).is(":visible"))
		{
			checkBox.checked = "checked";
		}
		checkBox.style.display = "inline";
		menuLayer.appendChild(checkBox);
	
		var layerVectors = XMLLayers[i].getElementsByTagName("vector");
		
		for(var j = 0; j < layerVectors.length; j++)
		{
			var node = document.createElement("div");
			node.setAttribute("class", "vector");
			node.innerHTML = "Vector " + j;
			node.style.paddingLeft = "10px";
			menuLayer.appendChild(node);
		}
	}	
	
	var boardObj = levelXML.getElementsByTagName("boardObj");
	
	for(var i = 0; i < boardObj.length; i++)
	{
		var node = implantMenuItem(boardObj[i]);
		node.setAttribute("class", "boardObj");
		node.innerHTML = "Object " + i;
		node.id = "boardObj" + i + "Handle";
	}
	
	var NPC = levelXML.getElementsByTagName("NPC");
	
	for(var i = 0; i < NPC.length; i++)
	{
		var node = implantMenuItem(NPC[i]);
		node.setAttribute("class", "NPC");
		node.innerHTML = "NPC " + i;
		node.id = "NPC" + i + "Handle";
	}
	
	var boardProgram = levelXML.getElementsByTagName("boardPrg");
	
	for(var i = 0; i < boardProgram.length; i++)
	{
		var node = document.createElement("div");
		node.setAttribute("class", "boardPrg");
		node.innerHTML = "Board Program " + i;
		node.style.paddingLeft = "0px";
		layerMenu.insertBefore(node, layerMenu.getElementsByTagName("br")[0]);
	}
}

//Used solely in above function
function implantMenuItem(XMLNode)
{
	var layerMenu = document.getElementById("layerMenu");
	var node = document.createElement("div");
	node.style.paddingLeft = "10px";
	
	var layerLineRegex = /\sobj\.layer[\s]*=[\s]*[\d]+;/;
	var objLayer = XMLNode.textContent.match(layerLineRegex);
	
	var layerValueRegex = /[\d]+/;
	objLayer = objLayer[0].match(layerValueRegex);
	
	objLayer = Number(objLayer[0]);
	
	var menuLayer = layerMenu.getElementsByClassName("menuLayer")[objLayer];
	menuLayer.appendChild(node);
	
	return node;
}

function getPixelsPerPixel()
{
	var lType = levelXML.getElementsByTagName("type")[0].textContent;
	
	if(lType == "TRPG") return 32;
	else return 1;
}

function helpXML()
{
	var msg = "";
	msg += "In this part of the editor, you can hard code aspects of the item in question.\n";
	msg += "Important variables to assign are x, y, and layer.\n";
	msg += "Second to these, you should have dir, img, xres, and yres assigned. However, you may choose to use a template for these.\n";
	msg += "In the template box, you may put a filename for a .txt file which assigns these variables. This file must be in the same folder as this application.\n\n";
	msg += "Vectors are probably one of the more confusing things. When you edit the specifics of a vector, it is probably best to only touch the 'template.' ";
	msg += "The template of a vector is the color of the vector. This color tells the engine how the player should interact with the vector. ";
	msg += "Basically, rgb(255, 0, 0) is solid (like a wall), rgb(255, 255, 0) is open air (i.e. player cannot walk here, but projectiles can traverse it), ";
	msg += "and rgb(100, __, __) triggers a board program. The second blank is just the number of the board program to be run. The first blank is the condition upon which the program is run.\n";
	msg += "- 0 means that any character triggers the program every pixel they travel. This should only really be used for vectors that are 1 pixel (e.g. in TRPG) or small graphic adjustments or sound effects.\n";
	msg += "- 1 means that a player character may trigger the program the first time they step on it. After the player steps off of the vector, it may be triggered again.\n";
	msg += "- 2 means that a player character may trigger the program if ENTER or SPACE is pressed while on the vector.\n";
	
	alert(msg);
}

function openXMLEditor(node, disableTemplate)
{
	typeSelected = node.tagName;
	
	var i = 0;
	while(levelXML.getElementsByTagName(typeSelected)[i] != node)
	{
		i++;
	}
	
	indexSelected = i;
	
	$("#XMLEditor").show();
	if(disableTemplate)
	{
		$("#template").prop('disabled', true);
		$("#template").val("Board Program #" + i);		
	}
	else
	{
		$("#template").prop('disabled', false);
		$("#template").val(node.getAttribute("template"));
	}
	$("#hardCode").val(node.textContent);
}

function updateObject(type, index)
{
	if(type === undefined) type = typeSelected;
	if(index === undefined) index = indexSelected;

	XMLNode = levelXML.getElementsByTagName(type)[index];
	HTMLNode = document.getElementById(type + index);
	HTMLImg = HTMLNode.getElementsByTagName("img")[0];

	var template = XMLNode.getAttribute("template");
	var t = loadSpriteFromTemplate(template);//new SpriteTemplate[template]() || new Sprite();
	
	var code = XMLNode.textContent;
	
//	console.log(code);
	
	var dRegex = /[\d]+/;
	
	var img, x, y, layer, xres, yres, dir;
	
	try {
		if(t.img) {
			img = "files/images/" + t.img;
		}
		else {
			img = code.match(/obj\.img[\s]*=[\s]*"[^"]+";/)[0];
			img = "files/images/" + img.match(/"(.*?)"/)[1];
		}
	}
	catch(e) { img = subImg; }
	
	try {
		x = code.match(/obj\.x[\s]*=[\s]*[\d]+;/)[0];
		x = Number(x.match(dRegex)[0]);
		
		y = code.match(/obj\.y[\s]*=[\s]*[\d]+;/)[0];
		y = Number(y.match(dRegex)[0]);
		
		layer = code.match(/obj\.layer[\s]*=[\s]*[\d]+;/)[0];
		layer = Number(layer.match(dRegex)[0]);
	}
	catch(e) { alert("You need to have x, y, and layer assigned!"); return; }

	try {
		xres = code.match(/obj\.xres[\s]*=[\s]*[\d]+;/)[0];
		xres = Number(xres.match(dRegex)[0]);

		yres = code.match(/obj\.yres[\s]*=[\s]*[\d]+;/)[0];
		yres = Number(yres.match(dRegex)[0]);
	}
	catch(e) { var xres = t.xres; var yres = t.yres; }

	try {
		dir = code.match(/obj\.dir[\s]*=[\s]*[\d]+;/)[0];
		dir = Number(dir.match(dRegex)[0]);	
	}
	catch(e) { dir = t.dir; }
	
	document.getElementById("layers").getElementsByClassName("layerDisplay")[layer].appendChild(HTMLNode);		
	
	HTMLImg.src = img;
	
	//(boardC[second].x - (((boardC[second].xres)/2) - 8)) - SLVDEngine.wX, (boardC[second].y - (boardC[second].yres - 8)) - SLVDEngine.wY + tSqueeze
	
	var x = x - xres/2 - t.baseOffX - t.offX;
	var y = y - yres + t.baseLength/2 - t.baseOffY - t.offY;
	
	HTMLNode.style.left = x + "px";
	HTMLNode.style.top = y + "px";
	
	HTMLNode.style.width = xres + "px";
	HTMLNode.style.height = yres + "px";
	
	HTMLImg.style.left = (-(xres*SLVDEngine.determineColumn(dir))) + "px";
	
	//generateLayerMenu();
	//drawVectors();
}

function createLevel(name, type)
{
	if(name == null)
	{
		name = prompt("Level name:");
	}
	if(type == null)
	{
		type = prompt("Type: (zelda or TRPG)");
	}
	
	var XML = (new DOMParser()).parseFromString("<?xml version=\"1.0\" encoding=\"UTF-8\"?><level></level>", "text/xml");
	
	var nameNode = XML.createElement("name");
	nameNode.textContent = name;
	XML.documentElement.appendChild(nameNode);
	
	var typeNode = XML.createElement("type");
	typeNode.textContent = type;
	XML.documentElement.appendChild(typeNode);

	var typeNode = XML.createElement("entrancePrg");
	typeNode.textContent = type;
	XML.documentElement.appendChild(typeNode);
	
	var typeNode = XML.createElement("exitPrg");
	typeNode.textContent = type;
	XML.documentElement.appendChild(typeNode);
	
	XML.documentElement.appendChild(XML.createElement("layers"));
	XML.documentElement.appendChild(XML.createElement("NPCs"));
	XML.documentElement.appendChild(XML.createElement("boardObjs"));
	XML.documentElement.appendChild(XML.createElement("boardPrgs"));
	
	return XML;
}

function createLayer(back, skipXML)
{
	if(back === null || back == "" || back == "files/images/") back = subImg2;

	if(!skipXML)
	{
	var layerNode = levelXML.createElement("layer");
	
	var background = levelXML.createElement("background");
	layerNode.appendChild(background);
	
	var vectors = levelXML.createElement("vectors");
	
	layerNode.appendChild(vectors);
	
	levelXML.getElementsByTagName("layers")[0].appendChild(layerNode);
	}
	
/*	var layerMenu = document.getElementById("layerMenu");
	
	var layerInfo = document.createElement("div");
	layerInfo.innerHTML = '<div class="menuLayer" style="background-color:#AACCFF;">Layer 1 <input type="checkbox" checked></input><br>Background: <input type="checkbox" checked></input><br>Functionality: <input type="checkbox"></input></div>';

	layerMenu.insertBefore(layerInfo, layerMenu.getElementsByTagName("br")[0]);*/
	
	var layerDisplay = document.createElement("div");
	layerDisplay.className = "layerDisplay";
	layerDisplay.style.height = BOARDY + "px";
	layerDisplay.style.width = BOARDX + "px";
	layerDisplay.innerHTML = '<img class="background" src="' + back + '"></img><canvas class="whiteboard" onContextMenu="return false;" width="' + BOARDX/getPixelsPerPixel() + '" height="' + BOARDY/getPixelsPerPixel() + '" style="width:' + BOARDX + 'px; height:' + BOARDY + 'px"></canvas>';
	
	var backupCanv = document.createElement("canvas");
	backupCanv.width = BOARDX/getPixelsPerPixel();
	backupCanv.height = BOARDY/getPixelsPerPixel();
	backupCanv.className = "backupCanv";
	
	layerDisplay.appendChild(backupCanv);
	
	document.getElementById("layers").appendChild(layerDisplay);
	
	var layerNum = document.getElementsByClassName("layerDisplay").length - 1;
	
	var layerOption = document.createElement("option");
	layerOption.innerHTML = layerNum;
	layerOption.setAttribute("value", layerNum);
	
	document.getElementById("activeLayer").appendChild(layerOption);
	
	generateLayerMenu();
	
/*	resizeBoardCheck(layerDisplay.getElementsByTagName("img")[0]);
	
	var layerWidth = layerDisplay.getElementsByTagName("img")[0].width;
	var layerHeight = layerDisplay.getElementsByTagName("img")[0].height;
	
	if(layerWidth > BOARDX || layerHeight > BOARDY)
	{
		resizeBoard(layerWidth, layerHeight);
	}*/
}

function createObject(type, skipXML, index)
{
	if(!index)
	{
		index = 0;
		while(document.getElementById(type + index)) { index++; }
	}
	
	var NPCContainer = document.createElement("div");
	NPCContainer.id = type + index;
	$(NPCContainer).addClass("draggable");
	$(NPCContainer).addClass(type);	
	NPCContainer.style.position = "absolute";
	NPCContainer.style.overflow = "hidden";

	var defImg = "";
	
	var displayNPC = document.createElement("img");
	displayNPC.style.position = "absolute";
	displayNPC.src = defImg;
	NPCContainer.appendChild(displayNPC);
	
	var pos = $("#layers").position();	
	var x = mouseX - pos.left;
	var y = mouseY - pos.top;
	var layer = document.getElementById("activeLayer").value;
	var xres = 32;
	var yres = 64
	
	document.getElementById("layers").getElementsByClassName("layerDisplay")[layer].appendChild(NPCContainer);	
	
	NPCContainer.style.left = x + "px";
	NPCContainer.style.top = y + "px";
	NPCContainer.style.width = xres + "px";
	NPCContainer.style.height = yres + "px";
		
		
	if(!skipXML)
	{
		var XMLNPC = levelXML.createElement(type);
		
		XMLNPC.textContent = "obj.x = " + x + "; obj.y = " + y + "; obj.layer = " + layer + "; obj.dir = 3;";
		
		levelXML.getElementsByTagName(type + "s")[0].appendChild(XMLNPC);
	
		openXMLEditor(XMLNPC);
	}
	
/*	typeSelected = "NPC";
	indexSelected = levelXML.getElementsByTagName("NPC").length - 1;
	
	$("#XMLEditor").show();
	$("#hardCode").val(levelXML.getElementsByTagName(typeSelected)[indexSelected].textContent);*/
}

function createProgram()
{
	var prg = levelXML.createElement("boardPrg");
	levelXML.getElementsByTagName("boardPrgs")[0].appendChild(prg);
	
	openXMLEditor(prg, true);
}

function exportLevel(XML)
{
	var prettyXML = vkbeautify.xml(/*'<?xml version="1.0" encoding="UTF-8"?>' + */(new XMLSerializer()).serializeToString(XML), "\t");
	console.log(prettyXML);
	return prettyXML;
}

function loadSpriteFromTemplate(templateName) {
	if(!templateName) {
		return new SLVDEngine.Sprite();
	}
	else if(!(templateName in SLVDEngine.SpriteTemplate)) {
		alert("Invalid sprite template!");
		return new SLVDEngine.Sprite();
	}
	else {
		return new SLVDEngine.SpriteTemplate[templateName]();
	}
}