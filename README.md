# SLVDEngine
JavaScript Engine for SoloVid's Maven

## Quick Start
To get a project running, download the project files. Make sure you have [Nodejs](http://nodejs.org/download/).

From the command line in the directory of the engine, run the following commands:
```sh
npm -g install grunt-cli
//or on Mac/Linux: sudo npm -g install grunt-cli
npm install
//or on Mac/Linux: sudo npm install
grunt
```

Grunt watch is an ongoing command which "compiles" your updated code and levels into the dist directory as it is updated. Be sure to run grunt before editing levels or running the engine.
Open the distMain.htm file to run the engine.

All of the files specific to your game are to be located in the files folder. 
In that folder, there is a very important file found at files/main/initialize.js. This file has a function called startUp which is the entry point of the game.
Also in the main folder is an XML file called master.xml which tells the engine what levels, music, sound effects (not looping), and system images to grab. The levels should be managed by grunt, but the others need to be manually populated.
Levels may be produced in the level editor and must be moved to files/levels to be incorporated into the game.
Any code you write for the game (events, sprites, etc.) should be put in their respective folders within files/code.
All images used should be housed withing files/images, and they should be referenced relative to that folder (e.g. an image at "files/images/people/me.jpg" should be referenced by "people/me.jpg").