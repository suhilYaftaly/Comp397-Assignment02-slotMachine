/// <reference path="typings/stats/stats.d.ts" />
/// <reference path="typings/easeljs/easeljs.d.ts" />
/// <reference path="typings/tweenjs/tweenjs.d.ts" />
/// <reference path="typings/soundjs/soundjs.d.ts" />
/// <reference path="typings/preloadjs/preloadjs.d.ts" />
/// <reference path="../config/constants.ts" />
/// <reference path="../objects/label.ts" />
/// <reference path="../objects/button.ts" />
// Game Framework Variables
var canvas = document.getElementById("canvas");
var stage;
var stats;
var assets;
//background image location
var manifest = [
    { id: "background", src: "assets/images/slotMachine.jpg" },
    { id: "buttonSpin", src: "assets/images/buttonSpin.gif" },
    { id: "clicked", src: "assets/audio/clicked.wav" }
];
// buttons and sumbols image locations
var atlas = [
    { id: "buttonBetMax", src: "assets/images/buttonBetMax.gif" },
    { id: "buttonBetOne", src: "assets/images/buttonBetOne.gif" },
    { id: "buttonReset", src: "assets/images/buttonReset.gif" },
    //{ id: "buttonSpin", src: "assets/images/buttonSpin.gif" },
    { id: "arcticTrooper", src: "assets/images/ArcticTrooper.png" },
    { id: "cactusGarden", src: "assets/images/CactusGarden.png" },
    { id: "coconut", src: "assets/images/coconut.png" },
    { id: "crazyHotPaper", src: "assets/images/crazyHotPaper.png" },
    { id: "fatZombie", src: "assets/images/fatZombie.jpg" },
    { id: "potatoMine", src: "assets/images/potatoMine.png" },
    { id: "twinCherry", src: "assets/images/twinCherry.png" },
    { id: "twinSunflower", src: "assets/images/twinSunflower.png" }
];
// Game Variables
var background;
var textureAtlas;
//buttons
var buttonSpin;
// Preloader Function
function preload() {
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    // event listener triggers when assets are completely loaded
    assets.on("complete", init, this);
    assets.loadManifest(manifest);
    //Load texture atlas
    textureAtlas = new createjs.SpriteSheet(atlas);
    //Setup statistics object
    setupStats();
}
// Callback function that initializes game objects
function init() {
    stage = new createjs.Stage(canvas); // reference to the stage
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60); // framerate 60 fps for the game
    // event listener triggers 60 times every second
    createjs.Ticker.on("tick", gameLoop);
    // calling main game function
    main();
}
// function to setup stat counting
function setupStats() {
    stats = new Stats();
    stats.setMode(0); // set to fps
    // align bottom-right
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '330px';
    stats.domElement.style.top = '10px';
    document.body.appendChild(stats.domElement);
}
// Callback function that creates our Main Game Loop - refreshed 60 fps
function gameLoop() {
    stats.begin(); // Begin measuring
    stage.update();
    stats.end(); // end measuring
}
// Callback function that allows me to respond to button click events
function buttonSpinClicked(event) {
    createjs.Sound.play("clicked");
    //spinResult = Reels();
    //fruits = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];
    //console.log(fruits);
}
// Our Main Game Function
function main() {
    // add in slot machine graphics
    background = new createjs.Bitmap(assets.getResult("background"));
    stage.addChild(background);
    //add buttonSpin sprite
    buttonSpin = new createjs.Bitmap(assets.getResult("buttonSpin"));
    buttonSpin.regX = buttonSpin.getBounds().width * 0.5;
    buttonSpin.regY = buttonSpin.getBounds().height * 0.5;
    buttonSpin.x = 360;
    buttonSpin.y = 90;
    stage.addChild(buttonSpin);
    buttonSpin.on("click", buttonSpinClicked, this);
}
//# sourceMappingURL=game.js.map