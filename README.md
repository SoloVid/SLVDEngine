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

Grunt watch is an ongoing command which "compiles" your updated code into the dist directory as it is updated.
Open the distMain.htm file to run the engine.

## Positioning
Sprites in Maven are positioned relative to several different properties in the Sprite object.

### x, y
These are the base coordinates (always in pixels from top left of screen) 