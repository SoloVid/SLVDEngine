function toPolygon() { console.log("polygon mode"); mode = "polygon"; }
function toNPC() { mode = "NPC"; }
function toBoardObj() { mode = "boardObj"; }

function drawVectors(highlightIndex)
{
	var XMLLayers = levelXML.getElementsByTagName("layer");
	
	var cnvLayers = document.getElementsByClassName("whiteboard");
	
	var absoluteVectorIndex = 0;
	
	for(var i = 0; i < XMLLayers.length; i++)
	{
		var layerVectors = XMLLayers[i].getElementsByTagName("vector");
		
		var ctx = cnvLayers[i].getContext("2d");
		
		ctx.clearRect(0, 0, cnvLayers[i].width, cnvLayers[i].height);
		
		ctx.translate(.5, .5);
		
		for(var j = 0; j < layerVectors.length; j++)
		{
			if(highlightIndex !== undefined && highlightIndex == absoluteVectorIndex)
			{
				ctx.strokeStyle = "#0000FF";
			}
			else
			{
				ctx.strokeStyle = layerVectors[j].getAttribute("template");//.getElementsByTagName("color")[0].textContent;
			}
			ctx.fillStyle = ctx.strokeStyle;
			
			var regex = /\([^\)]+\)/g;
			var xRegex = /\(([\d]*),/;
			var yRegex = /,[\s]*([\d]*)\)/;
			var newX, newY;
			
			var pointStr = layerVectors[j].textContent;//.getElementsByTagName("path")[0].textContent;
			var points = pointStr.match(regex);
			console.log(points.length + "|" + points + "|");
			
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

function loadFile()
{
	var filename = prompt("Level filename:", "");
	
	try
	{
		var xhr;
		if (window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}

		xhr.onreadystatechange = function(){ (function() { if(xhr.readyState == 4) loadFile2(xhr.responseText); }());};
		xhr.open("GET", "files/levels/" + filename);
		xhr.send();
	}
	catch(e)
	{
		alert("This browser does not support local file access. Either try using a different browser or live with only creating new levels.");
	}
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
		createObject("NPC", true, i);
		openXMLEditor(NPC[i]);
		$("#saveChanges").click();
	}
	var BO = levelXML.getElementsByTagName("boardObj");
	for(var i = 0; i < BO.length; i++)
	{
		createObject("boardObj", true, i);
		openXMLEditor(BO[i]);
		$("#saveChanges").click();
	}
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
	var c = $(".whiteboard").get();
	
	c.forEach(function(canv)
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
/*		var node = document.createElement("div");
		node.setAttribute("class", "boardObj");
		node.innerHTML = "\tObject " + i;
		
		var layerLineRegex = /\slayer[\s]*=[\s]*[\d]+;/;
		var objLayer = boardObj[i].textContent.match(layerLineRegex);
		
		var layerValueRegex = /[\d]+/;
		objLayer = objLayer[0].match(layerValueRegex);
		
		objLayer = Number(objLayer[0]);
		
		var menuLayer = layerMenu.getElementsByTagName("menuLayer")[objLayer];
		menuLayer.appendChild(node);*/
	}
	
	var NPC = levelXML.getElementsByTagName("NPC");
	
	for(var i = 0; i < NPC.length; i++)
	{
		var node = implantMenuItem(NPC[i]);
		node.setAttribute("class", "NPC");
		node.innerHTML = "NPC " + i;
	}
	
	var boardProgram = levelXML.getElementsByTagName("boardPrg");
	
	for(var i = 0; i < boardProgram.length; i++)
	{
		var node = document.createElement("div");
		node.setAttribute("class", "boardPrg");
		node.innerHTML = "Board Program " + i;
		node.style.paddingLeft = "0px";
		menuLayer.appendChild(node);		
	}
}

//Used solely in above function
function implantMenuItem(XMLNode)
{
	var layerMenu = document.getElementById("layerMenu");
	var node = document.createElement("div");
	node.style.paddingLeft = "10px";
	
	var layerLineRegex = /\slayer[\s]*=[\s]*[\d]+;/;
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

function updateObject(templateData, type, index)
{
	if(type === undefined) type = typeSelected;
	if(index === undefined) index = indexSelected;

	XMLNode = levelXML.getElementsByTagName(type)[index];
	HTMLNode = document.getElementById(type + index);
	HTMLImg = HTMLNode.getElementsByTagName("img")[0];
	
	var code = "";
	
	if(templateData != null)
	{
		code += templateData;
	}
	code += " " + XMLNode.textContent;
	
	console.log(code);
	
	var dRegex = /[\d]+/;
	
	try {
		var img = code.match(/img[\s]*=[\s]*"[^"]+";/)[0];
		img = "files/images/" + img.match(/"(.*?)"/)[1];
	}
	catch(e) { var img = subImg; }
	
	try {
		var x = code.match(/x[\s]*=[\s]*[\d]+;/)[0];
		x = Number(x.match(dRegex)[0]);
		
		var y = code.match(/y[\s]*=[\s]*[\d]+;/)[0];
		y = Number(y.match(dRegex)[0]);
		
		var layer = code.match(/layer[\s]*=[\s]*[\d]+;/)[0];
		layer = Number(layer.match(dRegex)[0]);
	}
	catch(e) { alert("You need to have x, y, and layer assigned!"); return; }

	try {
		var xres = code.match(/xres[\s]*=[\s]*[\d]+;/)[0];
		xres = Number(xres.match(dRegex)[0]);

		var yres = code.match(/yres[\s]*=[\s]*[\d]+;/)[0];
		yres = Number(yres.match(dRegex)[0]);
	}
	catch(e) { var xres = 32; var yres = 32; }

	try {
		var dir = code.match(/dir[\s]*=[\s]*[\d]+;/)[0];
		dir = Number(dir.match(dRegex)[0]);	
	}
	catch(e) { var dir = 3; }
	
	document.getElementById("layers").getElementsByClassName("layerDisplay")[layer].appendChild(HTMLNode);		
	
	HTMLImg.src = img;
	
	//(boardC[second].x - (((boardC[second].xres)/2) - 8)) - wX, (boardC[second].y - (boardC[second].yres - 8)) - wY + tSqueeze
	
	HTMLNode.style.left = (x - ((xres/2) - 8)) + "px";
	HTMLNode.style.top = (y - (yres - 8)) + "px";
	
	HTMLNode.style.width = xres + "px";
	HTMLNode.style.height = yres + "px";
	
	HTMLImg.style.left = (-(xres*determineColumn(dir))) + "px";
	
	generateLayerMenu();
	drawVectors();
}

function updateObjectNew(template, type, index)
{
	var t = new SpriteTemplate[template]() || new Sprite();

	if(type === undefined) type = typeSelected;
	if(index === undefined) index = indexSelected;

	XMLNode = levelXML.getElementsByTagName(type)[index];
	HTMLNode = document.getElementById(type + index);
	HTMLImg = HTMLNode.getElementsByTagName("img")[0];

	var code = XMLNode.textContent;
	
	console.log(code);
	
	var dRegex = /[\d]+/;
	
	var img, x, y, layer, xres, yres, dir;
	
	try {
		if(t.img) {
			img = "files/images/" + t.img;
		}
		else {
			img = code.match(/img[\s]*=[\s]*"[^"]+";/)[0];
			img = "files/images/" + img.match(/"(.*?)"/)[1];
		}
	}
	catch(e) { img = subImg; }
	
	try {
		x = code.match(/x[\s]*=[\s]*[\d]+;/)[0];
		x = Number(x.match(dRegex)[0]);
		
		y = code.match(/y[\s]*=[\s]*[\d]+;/)[0];
		y = Number(y.match(dRegex)[0]);
		
		layer = code.match(/layer[\s]*=[\s]*[\d]+;/)[0];
		layer = Number(layer.match(dRegex)[0]);
	}
	catch(e) { alert("You need to have x, y, and layer assigned!"); return; }

	try {
		if(t.xres) {
			xres = t.xres;
		}
		else {
			xres = code.match(/xres[\s]*=[\s]*[\d]+;/)[0];
			xres = Number(xres.match(dRegex)[0]);
		}

		if(t.yres) {
			yres = t.yres;
		}
		else {
			yres = code.match(/yres[\s]*=[\s]*[\d]+;/)[0];
			yres = Number(yres.match(dRegex)[0]);
		}
	}
	catch(e) { var xres = 32; var yres = 32; }

	try {
		if(t.dir) {
			dir = t.dir;
		}
		else {
			dir = code.match(/dir[\s]*=[\s]*[\d]+;/)[0];
			dir = Number(dir.match(dRegex)[0]);	
		}
	}
	catch(e) { var dir = 3; }
	
	document.getElementById("layers").getElementsByClassName("layerDisplay")[layer].appendChild(HTMLNode);		
	
	HTMLImg.src = img;
	
	//(boardC[second].x - (((boardC[second].xres)/2) - 8)) - wX, (boardC[second].y - (boardC[second].yres - 8)) - wY + tSqueeze
	
	var x = x - xres/2 - t.baseOffX - t.offX;
	var y = y - yres + t.baseLength/2 - t.baseOffY - t.offY;
	
	HTMLNode.style.left = x + "px";
	HTMLNode.style.top = y + "px";
	
	HTMLNode.style.width = xres + "px";
	HTMLNode.style.height = yres + "px";
	
	HTMLImg.style.left = (-(xres*determineColumn(t.dir))) + "px";
	
	generateLayerMenu();
	drawVectors();
}

function updateObjectRequest(fil, type, index)
{
	var xhr;
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xhr.onreadystatechange = (function() { var t = type; var i = index; return function(){ if(xhr.readyState == 4) updateObject(xhr.responseText, type, index);} })();
	xhr.open("GET","files/templates/" + $("#template").val());
	xhr.send();
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
	
	XML.documentElement.appendChild(XML.createElement("layers"));
	XML.documentElement.appendChild(XML.createElement("NPCs"));
	XML.documentElement.appendChild(XML.createElement("boardObjs"));
	XML.documentElement.appendChild(XML.createElement("boardPrgs"));
	
	return XML;
}

function createLayer(back, skipXML)
{
	if(back == null || back == "") back = subImg2;

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
	layerDisplay.innerHTML = '<div class="layerDisplay" style="position: absolute; overflow: hidden; width: ' + BOARDX + 'px; height: ' + BOARDY + 'px; border: 1px solid black;"><img class="background" src="' + back + '"></img><canvas class="whiteboard" onContextMenu="return false;" width="' + BOARDX/getPixelsPerPixel() + '" height="' + BOARDY/getPixelsPerPixel() + '" style="width:' + BOARDX + 'px; height:' + BOARDY + 'px"></canvas></div>';
	
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
		
		XMLNPC.textContent = "x = " + x + "; y = " + y + "; layer = " + layer + "; dir = 3;";
		
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

function determineColumn(direction) {
	var dir = Math.round(direction);//%4;
	if(dir == 0) { return 2; }
	else if(dir == 1) { return 1; } 
	else if(dir == 2) { return 3; }
	else if(dir == 3) { return 0; }
	else { return dir; }
}

function exportLevel(XML)
{
	var prettyXML = vkbeautify.xml(/*'<?xml version="1.0" encoding="UTF-8"?>' + */(new XMLSerializer()).serializeToString(XML), "\t");
	console.log(prettyXML);
	return prettyXML;
}
