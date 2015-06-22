/// <reference path="typings/stats/stats.d.ts" />
/// <reference path="typings/easeljs/easeljs.d.ts" />
/// <reference path="typings/tweenjs/tweenjs.d.ts" />
/// <reference path="typings/soundjs/soundjs.d.ts" />
/// <reference path="typings/preloadjs/preloadjs.d.ts" />
/// <reference path="../config/constants.ts" />
/// <reference path="../objects/label.ts" />
/// <reference path="../objects/button.ts" />
/// <reference path="../objects/reel.ts" />


// Game Framework Variables
var canvas = document.getElementById("canvas");
var stage: createjs.Stage;
var stats: Stats;

var assets: createjs.LoadQueue;

//background image location
var manifest = [
    { id: "background", src: "assets/images/slotMachine.jpg" },
    { id: "buttonPower", src: "assets/images/buttonPower.gif" },
    { id: "buttonBetMax", src: "assets/images/buttonBetMax.gif" },
    { id: "buttonBetOne", src: "assets/images/buttonBetOne.gif" },
    { id: "buttonReset", src: "assets/images/buttonReset.gif" },
    { id: "buttonSpin", src: "assets/images/buttonSpin.gif" },
    { id: "arcticTrooper", src: "assets/images/ArcticTrooper.png" },
    { id: "cactusGarden", src: "assets/images/CactusGarden.png" },
    { id: "coconut", src: "assets/images/coconut.gif" },
    { id: "crazyHotPaper", src: "assets/images/crazyHotPaper.png" },
    { id: "fatZombie", src: "assets/images/fatZombie.gif" },
    { id: "potatoMine", src: "assets/images/potatoMine.png" },
    { id: "twinCherry", src: "assets/images/twinCherry.png" },
    { id: "twinSunflower", src: "assets/images/twinSunflower.png" },
    { id: "clicked", src: "assets/audio/clicked.wav" }
];




// Game Variables
var background: createjs.Bitmap;
var textureAtlas: createjs.SpriteSheet;

//buttons
var buttonPower: createjs.Bitmap;
var buttonSpin: createjs.Bitmap;
var buttonBetMax: createjs.Bitmap;
var buttonBetOne: createjs.Bitmap;
var buttonReset: createjs.Bitmap;

//labels
var lblCredit: objects.Label;
var lblBet: objects.Label;
var lblWins: objects.Label;
var lblLoose: objects.Label;
var lblStatus: objects.Label;
var lblJackPort: objects.Label;

//reel varibale
var imgReelOne: objects.Reel;
var imgReelTwo: objects.Reel;
var imgReelThree: objects.Reel;

//power variable
var isPowerOn = false;

// Score variable
var credit = 1000;
var bet = 0;
var wins = 0;
var loose = 0;
var turn = 0;
var jackport = 5000;

// Symbol varibales
var potatoMine = 0;
var arcticTrooper = 0;
var cactusGarden = 0;
var coconut = 0
var crazyHotPaper = 0;
var fatZombie = 0;
var twinCherry = 0;
var twinSunflower = 0;

var spinResult;
var symbols = "";


// Preloader Function
function preload() {
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    // event listener triggers when assets are completely loaded
    assets.on("complete", init, this); 
    assets.loadManifest(manifest);

    //Load texture atlas
    //textureAtlas = new createjs.SpriteSheet(atlas);

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


/*function to udpate the scores*/
function updateScores() {
    lblCredit.text = credit.toString();
    lblBet.text = bet.toString();
    lblLoose.text = loose.toString();
    lblWins.text = wins.toString();
}

/* Utility function to check if a value falls within a range of bounds */
function checkRange(value, lowerBounds, upperBounds) {
    if (value >= lowerBounds && value <= upperBounds) {
        return value;
    }
    else {
        return !value;
    }
}

/* When this function is called it determines the betLine results, e.g. potatoMine - arcticTrooper - cactusGarden */
function Reels() {
    var betLine = [" ", " ", " "];
    var outCome = [0, 0, 0];

    for (var spin = 0; spin < 3; spin++) {
        outCome[spin] = Math.floor((Math.random() * 60) + 1);
        switch (outCome[spin]) {
            case checkRange(outCome[spin], 1, 27):
                betLine[spin] = "potatoMine";
                potatoMine++;
                break;
            case checkRange(outCome[spin], 28, 32):
                betLine[spin] = "arcticTrooper";
                arcticTrooper++;
                break;
            case checkRange(outCome[spin], 33, 37):
                betLine[spin] = "cactusGarden";
                cactusGarden++;
                break;
            case checkRange(outCome[spin], 38, 43):
                betLine[spin] = "coconut";
                coconut++;
                break;
            case checkRange(outCome[spin], 44, 50):
                betLine[spin] = "crazyHotPaper";
                crazyHotPaper++;
                break;
            case checkRange(outCome[spin], 51, 54):
                betLine[spin] = "fatZombie";
                fatZombie++;
                break;
            case checkRange(outCome[spin], 55, 60):
                betLine[spin] = "twinCherry";
                twinCherry++;
                break;
        }
    }
    return betLine;
}

/*function retun false if credit is less than bet amount*/
function isEnoughCredit(betAmount: number): boolean {
    if (credit >= betAmount) {
        return true;
    }
    return false;
}

// Callback function that allows me to respond to button click events
function buttonSpinClicked(event: createjs.MouseEvent) {

    //play a sound when the button is clicked
    createjs.Sound.play("clicked");
    // excecute code if power is on
    if (isPowerOn) {
        //check if user did not add a bet 
        if (bet <= 0) {
            lblStatus.text = "Invalid bet amount";
            lblStatus.center();
        } else {
            
            //remove previous spin Result if exists
            stage.removeChild(imgReelOne, imgReelTwo, imgReelThree);

            // display spinResult
            spinResult = Reels();

            console.log(spinResult[0] + " " + spinResult[1] + " " + spinResult[2]);

            imgReelOne = new objects.Reel(assets.getResult(spinResult[0]), 60, 188);
            imgReelTwo = new objects.Reel(assets.getResult(spinResult[1]), 142, 188);
            imgReelThree = new objects.Reel(assets.getResult(spinResult[2]), 224, 188);;

            stage.addChild(imgReelOne, imgReelTwo, imgReelThree);

            // if spin result contain any zombie user loose
            if (spinResult[0] == "potatoMine" || spinResult[1] == "potatoMine" || spinResult[2] == "potatoMine") {
                credit = credit - bet;
                loose++;
                bet = 0;
                updateScores();
                lblStatus.text = "You loose";
                lblStatus.center();

            } else {
                //wins jackport if images on all three reels are equal
                if (spinResult[0] == spinResult[1] && spinResult[0] == spinResult[2]) {
                    credit += jackport;
                    jackport = 1000;
                    lblJackPort.text = "Jackpot: " + jackport;
                    lblJackPort.center();
                    wins++;
                    bet = 0;
                    updateScores();
                    lblStatus.text = "***Jackpot***";
                    lblStatus.center();
                } else {
                    //otherwise handle simple win
                    credit += bet;
                    wins++;
                    bet = 0;
                    updateScores();
                    lblStatus.text = "You wins";
                    lblStatus.center();
                }
            }
        }
    }
}


function btnBetTen_Click(event: createjs.MouseEvent) {
    //play a sound when the button is clicked
    createjs.Sound.play("clicked");
    if (isPowerOn) {
        if (isEnoughCredit(10)) {
            bet = 10;
            lblCredit.text = (credit - bet).toString();
            lblBet.text = bet.toString();
        } else {
            // if credit is not enoug show message
            lblStatus.text = "Not enough credit";
            lblStatus.center();
        }
    }
}

function btnBetMax_Click(event: createjs.MouseEvent) {
    //play a sound when the button is clicked
    createjs.Sound.play("clicked");
    if (isPowerOn) {
        bet = credit;
        lblCredit.text = (credit - bet).toString();
        lblBet.text = bet.toString();
    }
}

function reset_Click(event: createjs.MouseEvent) {
    //play a sound when the button is clicked
    createjs.Sound.play("clicked");
    if (isPowerOn) {
        if (confirm("Reset Game ?")) {
            credit = 1000;
            bet = 0;
            wins = 0;
            loose = 0;
            turn = 0;
            updateScores();
            lblStatus.text = "Ready";
            lblStatus.center();
        }
    }
}

function btnPower_Click(event: createjs.MouseEvent) {
    //play a sound when the button is clicked
    createjs.Sound.play("clicked");
    if (isPowerOn) {
        // if power on then 
        if (confirm("Turn off the game ?")) {
            buttonPower.image = assets.getResult("buttonPower");
            lblStatus.text = "Turn on to play";
            lblStatus.center();

            //removing information label
            stage.removeChild(lblCredit, lblBet, lblLoose, lblWins);

            isPowerOn = false;
        }
    } else {
        //if power off
        buttonPower.image = assets.getResult("buttonPower");
        lblStatus.text = "Ready";
        lblStatus.center();

        //adding information label
        lblCredit = new objects.Label(credit.toString(), 20, 347);
        lblBet = new objects.Label(bet.toString(), 90, 347);
        lblLoose = new objects.Label(loose.toString(), 226, 347);
        lblWins = new objects.Label(wins.toString(), 158, 347);

        stage.addChild(lblCredit, lblBet, lblLoose, lblWins);

        isPowerOn = true;
    }
}


// Our Main Game Function
function main() {
   // add in slot machine graphics
    background = new createjs.Bitmap(assets.getResult("background"));

    //creating a link to the buttons and setting their positions
    buttonPower = new createjs.Bitmap(assets.getResult("buttonPower"));
    buttonPower.regX = buttonPower.getBounds().width * 0.5;
    buttonPower.regY = buttonPower.getBounds().height * 0.5;
    buttonPower.x = 383;
    buttonPower.y = 115;
    buttonPower.on("click", btnPower_Click, this);

    buttonSpin = new createjs.Bitmap(assets.getResult("buttonSpin"));
    buttonSpin.regX = buttonSpin.getBounds().width * 0.5;
    buttonSpin.regY = buttonSpin.getBounds().height * 0.5;
    buttonSpin.x = 233;
    buttonSpin.y = 250;
    buttonSpin.on("click", buttonSpinClicked, this);

    buttonBetMax = new createjs.Bitmap(assets.getResult("buttonBetMax"));
    buttonBetMax.regX = buttonBetMax.getBounds().width * 0.5;
    buttonBetMax.regY = buttonBetMax.getBounds().height * 0.5;
    buttonBetMax.x = 383;
    buttonBetMax.y = 250;
    buttonBetMax.on("click", btnBetMax_Click, this);

    buttonBetOne = new createjs.Bitmap(assets.getResult("buttonBetOne"));
    buttonBetOne.regX = buttonBetOne.getBounds().width * 0.5;
    buttonBetOne.regY = buttonBetOne.getBounds().height * 0.5;
    buttonBetOne.x = 333;
    buttonBetOne.y = 250;
    buttonBetOne.on("click", btnBetTen_Click, this);

    buttonReset = new createjs.Bitmap(assets.getResult("buttonReset"));
    buttonReset.regX = buttonReset.getBounds().width * 0.5;
    buttonReset.regY = buttonReset.getBounds().height * 0.5;
    buttonReset.x = 283;
    buttonReset.y = 250;
    buttonReset.on("click", reset_Click, this);

    //adding buttons and background to the screen
    stage.addChild(background, buttonReset, buttonBetMax, buttonBetOne, buttonPower, buttonSpin);

    // adding jackport label
    lblJackPort = new objects.Label("Jackport: " + jackport.toString(), (stage.getBounds().width / 2), 92, true);
    stage.addChild(lblJackPort);

    //adding status label
    lblStatus = new objects.Label("Turn on to play", (stage.getBounds().width / 2), 115, true);
    stage.addChild(lblStatus);

    //adding different symbols to the screen
    var randomImages = Reels();
    stage.addChild(imgReelOne = new objects.Reel(assets.getResult(randomImages[0]), 60, 188));
    stage.addChild(imgReelTwo = new objects.Reel(assets.getResult(randomImages[1]), 144, 188));
    stage.addChild(imgReelThree = new objects.Reel(assets.getResult(randomImages[2]), 224, 188));
}