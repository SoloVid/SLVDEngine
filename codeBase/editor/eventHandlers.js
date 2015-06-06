$(document).on('dragstart', 'img', function(event) { event.preventDefault(); });

setInterval(function(event) { if(document.getElementsByClassName("background").length > 0) resizeBoardCheck(document.getElementsByClassName("background")[0]); }, 100);

document.onContextMenu = function()
{
	console.log("caught context menu");
	return false;
}

$("#layers").contextmenu(function(event) { event.preventDefault(); });
$("#XMLEditor").contextmenu(function(event) { event.preventDefault(); });

$(document).keypress(function(event)
{
	if(event.which == 32)
	{
		console.log("export of level XML:");
		exportLevel(levelXML);
		
		//console.log(JSON.stringify(document.getElementsByClassName("whiteboard")[0].getContext("2d").getImageData(0, 0, BOARDX/getPixelsPerPixel(), BOARDY/getPixelsPerPixel()), null, '\t'));
		
		//console.log(document.getElementById("testTA").value);
	}
});

var BOARDX = 100, BOARDY = 100;
var PPP = 1; //pixels per pixel

var mode = "polygon";

var typeSelected;
var indexSelected;

$("#XMLEditor").hide();

var subImg = document.getElementById("subImg");
var ctx = subImg.getContext("2d");
ctx.fillStyle = "#CD96CD";
ctx.fillRect(0, 0, 256, 256);
subImg = subImg.toDataURL();
var subImg2 = document.getElementById("subImg2");
 ctx = subImg2.getContext("2d");
ctx.fillStyle = "rgba(0, 0, 0, 0)";
ctx.fillRect(0, 0, 320, 320);
subImg2 = subImg2.toDataURL();

var color = "rgb(255, 0, 0)";

var mouseX = 0;
var mouseY = 0;

var mouseDown = false;

var follower = null;

var pathInProgress = false;

$(".option").click(function()
{
	pathInProgress = false;
});

$(".color").click(function()
{
	color = this.style.backgroundColor;
});

$(document).mousemove(function(event)
{
	if(follower != null)
	{
		var pos = $(follower).position();
		var x = pos.left + (event.pageX - mouseX);
		var y = pos.top + (event.pageY - mouseY);
		follower.style.left = x + "px";
		follower.style.top = y + "px";
		
		engineX = x + (($(follower).width()/2) - 8);
		engineY = y + ($(follower).height() - 8);
		
		//Locate index of element
		var thisType = follower.className;
		var regex = /[\s]*draggable[\s]*/;
		thisType = thisType.replace(regex, "");
//	console.log(thisType);
		var elementList = document.getElementById("layers").getElementsByClassName(thisType);
		var i = 0;
		while(elementList[i] != follower)
		{
			i++;
		}	

		//Update XML
		var oldXML = levelXML.getElementsByTagName(thisType)[i].textContent;
		regex = /x[\s]*=[\s]*[\d]+;/;
		var newXML = oldXML.replace(regex, "x = " + engineX + ";");
		regex = /y[\s]*=[\s]*[\d]+;/;
		newXML = newXML.replace(regex, "y = " + engineY + ";");
		levelXML.getElementsByTagName(thisType)[i].textContent = newXML;
	}

	mouseX = event.pageX;
	mouseY = event.pageY;
});

$(document.body).on("mousedown", ".draggable", function(event)
{
	follower = this;
});

$(document.body).on("mouseup", ".draggable", function(event)
{
	follower = null;
});

$(document.body).on("mousedown", "#layers", function(event)
{
	mouseDown = true;
	
	var pos = $(this).position();
	
	if(mode == "polygon")
	{		
		if(event.which == 1)
		{
			if(!pathInProgress)
			{
				var vector = levelXML.createElement("vector");
				
				vector.setAttribute("template", color);
				/*var vColor = levelXML.createElement("color");
				vColor.textContent = color;
				vector.appendChild(vColor);*/
				
				vector.textContent = "(" + Math.floor((mouseX - pos.left)/getPixelsPerPixel()) + ", " + Math.floor((mouseY - pos.top)/getPixelsPerPixel()) + ")";
				pathInProgress = vector;
				/*pathInProgress = levelXML.createElement("path");
				pathInProgress.textContent = "(" + (mouseX - pos.left) + ", " + (mouseY - pos.top) + ")";
				vector.appendChild(pathInProgress);*/
				
				var activeLayer = document.getElementById("activeLayer").value;
				
				levelXML.getElementsByTagName("vectors")[activeLayer].appendChild(vector);
				
				generateLayerMenu();
			}
			else
			{
				pathInProgress.textContent += " (" + Math.floor((mouseX - pos.left)/getPixelsPerPixel()) + ", " + Math.floor((mouseY - pos.top)/getPixelsPerPixel()) + ")";
			}
		}
		else if(pathInProgress && event.which == 3)
		{
			pathInProgress.textContent += " (close)";
			pathInProgress = false;
		}
		
		drawVectors();
	}
	else if(mode == "NPC" || mode == "boardObj")
	{
		if(event.which == 1)
		{
			
		}
		else if(event.which == 3)
		{
			createObject(mode);
		}
	}
});

$("#layerMenu").on("click", ".layerLabel", function(event)
{	
	var layerList = document.getElementById("layerMenu").getElementsByClassName("layerLabel");
	
	var i = 0;
	
	while(layerList[i] != this)
	{
		i++;
	}
	
	levelXML.getElementsByTagName("background")[i].textContent = prompt("Background image:", levelXML.getElementsByTagName("background")[i].textContent);

	document.getElementsByClassName("background")[i].onload = function()
	{
		var img = document.getElementsByClassName("background")[i];
		resizeBoard(img.width, img.height);
	}
	
	document.getElementsByClassName("background")[i].src = "files/images/" + levelXML.getElementsByTagName("background")[i].textContent;
});

$("#layerMenu").on("click", ":checkbox", function(event)
{
	var layerList = document.getElementById("layerMenu").getElementsByTagName("input");
	
	var i = 0;
	
	while(layerList[i] != this)
	{
		i++;
	}
	
	var layerDisplay = document.getElementsByClassName("layerDisplay")[i];
	
	if($(this).is(":checked"))
	{
		$(layerDisplay).show();
	}
	else
	{
		$(layerDisplay).hide();
	}
});

$("#layerMenu").on("click", ".vector", function(event)
{
	typeSelected = "vector";
	
	var vectorList = document.getElementById("layerMenu").getElementsByClassName(typeSelected);
	
	var i = 0;
	
	while(vectorList[i] != this)
	{
		i++;
	}
	
	indexSelected = i;

	$("#XMLEditor").show();
	$("#template").prop('disabled', false);
	$("#template").val(levelXML.getElementsByTagName(typeSelected)[indexSelected].getAttribute("template"));
	$("#hardCode").val(levelXML.getElementsByTagName(typeSelected)[indexSelected].textContent);
});

$("#layerMenu").on("click", ".boardObj", function(event)
{
	typeSelected = "boardObj";
	
	var vectorList = document.getElementById("layerMenu").getElementsByClassName(typeSelected);
	
	var i = 0;
	
	while(vectorList[i] != this)
	{
		i++;
	}
	
	indexSelected = i;

	$("#XMLEditor").show();
	$("#template").prop('disabled', false);
	$("#template").val(levelXML.getElementsByTagName(typeSelected)[indexSelected].getAttribute("template"));
	$("#hardCode").val(levelXML.getElementsByTagName(typeSelected)[indexSelected].textContent);
});

$("#layerMenu").on("click", ".NPC", function(event)
{
	typeSelected = "NPC";
	
	var vectorList = document.getElementById("layerMenu").getElementsByClassName(typeSelected);
	
	var i = 0;
	
	while(vectorList[i] != this)
	{
		i++;
	}
	
	indexSelected = i;
	
//	$(document.getElementById("layers").getElementsByClassName("NPC")[i]).effect( "highlight", {color:"#FFFFAA"}, 3000 );

	$("#XMLEditor").show();
	$("#template").prop('disabled', false);
	$("#template").val(levelXML.getElementsByTagName(typeSelected)[indexSelected].getAttribute("template"));
	$("#hardCode").val(levelXML.getElementsByTagName(typeSelected)[indexSelected].textContent);
});

$("#layerMenu").on("click", ".boardPrg", function(event)
{
	typeSelected = "boardPrg";
	
	var vectorList = document.getElementById("layerMenu").getElementsByClassName(typeSelected);
	
	var i = 0;
	
	while(vectorList[i] != this)
	{
		i++;
	}
	
	indexSelected = i;

	$("#XMLEditor").show();
	$("#template").prop('disabled', true);
	$("#template").val("Board Program #" + i);
	$("#hardCode").val(levelXML.getElementsByTagName(typeSelected)[indexSelected].textContent);
});

$("#saveChanges").click(function(event)
{
	//Save node info
	var node = levelXML.getElementsByTagName(typeSelected)[indexSelected];
	
	node.textContent = $("#hardCode").val();
	node.setAttribute("template", $("#template").val());

	$("#XMLEditor").hide();
	
	//Update graphics
	if(typeSelected == "NPC" || typeSelected == "boardObj")
	{
//		updateObject();

		if($("#template").val())
		{		
			try
			{
	var xhr;
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xhr.onreadystatechange = (function() { var t = typeSelected; var i = indexSelected; var x = xhr; return function(){ if(x.readyState == 4) updateObject(x.responseText, t, i);} })();
	xhr.open("GET","files/templates/" + $("#template").val());
	xhr.send();

//	updateObjectRequest($("#template").val(), typeSelected, indexSelected);
				/*var xhr;
				if (window.XMLHttpRequest) {
					xhr = new XMLHttpRequest();
				} else if (window.ActiveXObject) {
					xhr = new ActiveXObject("Microsoft.XMLHTTP");
				}

				xhr.onreadystatechange = function(){ if(xhr.readyState == 4) updateObject(xhr.responseText);};
				xhr.open("GET","files/templates/" + $("#template").val());
				xhr.send();*/
			}
			catch(e)
			{
				updateObject();
			}
		}
		else
		{
			updateObject();
		}

/*		if($("#template").val() != "")
		{
			$.get("index.html", function(data){ console.log("Data1: " + data); });
			$.get("test.txt", function(data){ console.log("Data2: " + data); });
			console.log("getting file");
		}*/
	}
	else
	{
		generateLayerMenu();
		drawVectors();
	}
	
	//Redraw menu
/*	generateLayerMenu();
	drawVectors();*/
});

$("#deleteThing").click(function(event)
{
	if(!confirm("Are you sure you want to delete this?")) return;

	//Get node info
	var node = levelXML.getElementsByTagName(typeSelected)[indexSelected];
	
	node.parentNode.removeChild(node);

	$("#XMLEditor").hide();
	
	try { var HTMLNode = document.getElementById("layers").getElementsByClassName(typeSelected)[indexSelected];
	HTMLNode.parentNode.removeChild(HTMLNode); } catch(e) { console.log(e); }
	
	//Redraw menu
	generateLayerMenu();
	drawVectors();
});

$("#closeXMLEditor").click(function(event)
{
	$("#XMLEditor").hide();
	
	generateLayerMenu();
});

$(document).mouseup(function() { follower = null; mouseDown = false; });

//$("#whiteboard").mouseleave(function() { mouseDown = false; });

//Resize board as needed
/*setInterval(function()
{
	var maxX = 100;
	var maxY = 100;

	var b = $(".layerDisplay").get();
	
	b.forEach(function (back)
	{
		if($(back).width() > maxX) maxX = $(back).width();
		if($(back).height() > maxY) maxY = $(back).height();
	});
	
	if(maxX != BOARDX || maxY != BOARDY)
	{
		resizeBoard(maxX, maxY);
		console.log("resizing board");
	}
}, 2000);*/