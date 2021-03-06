/// <reference path="typings/stats/stats.d.ts" />
/// <reference path="typings/easeljs/easeljs.d.ts" />
/// <reference path="typings/tweenjs/tweenjs.d.ts" />
/// <reference path="typings/soundjs/soundjs.d.ts" />
/// <reference path="typings/preloadjs/preloadjs.d.ts" />
/// <reference path="../config/constants.ts" />
/// <reference path="../objects/Label.ts" />
/// <reference path="../objects/button.ts" />
/// <reference path="../objects/reel.ts" />
// Game Framework Variables
var canvas = document.getElementById("canvas");
var stage;
var stats;
var assets;
//image locations
var manifest = [
    //background locations
    { id: "background", src: "assets/images/slotMachine.jpg" },
    //button locations
    { id: "buttonPower", src: "assets/images/buttonPower.gif" },
    { id: "buttonBetMax", src: "assets/images/buttonBetMax.gif" },
    { id: "buttonBetOne", src: "assets/images/buttonBetOne.gif" },
    { id: "buttonReset", src: "assets/images/buttonReset.gif" },
    { id: "buttonSpin", src: "assets/images/buttonSpin.gif" },
    { id: "buttonQuit", src: "assets/images/buttonQuit.gif" },
    //Symbols locations
    { id: "arcticTrooper", src: "assets/images/ArcticTrooper.png" },
    { id: "cactusGarden", src: "assets/images/CactusGarden.png" },
    { id: "coconut", src: "assets/images/coconut.gif" },
    { id: "crazyHotPaper", src: "assets/images/crazyHotPaper.png" },
    { id: "fatZombie", src: "assets/images/fatZombie.gif" },
    { id: "potatoMine", src: "assets/images/potatoMine.png" },
    { id: "twinCherry", src: "assets/images/twinCherry.png" },
    { id: "twinSunflower", src: "assets/images/twinSunflower.png" },
    //audio location
    { id: "clicked", src: "assets/audio/clicked.wav" },
    { id: "bet", src: "assets/audio/bet.wav" },
    { id: "potatoMineSound", src: "assets/audio/potatoMine.wav" },
    { id: "powerOn", src: "assets/audio/powerOn.wav" },
    { id: "spin", src: "assets/audio/spin.wav" }
];
// Game Variables
var background;
//buttons
var buttonPower;
var buttonSpin;
var buttonBetMax;
var buttonBetOne;
var buttonReset;
var buttonQuit;
//labels
var lblCredit;
var lblBet;
var lblStatus;
var lblJackPot;
//random symbol generators variable
var randImgOne;
var randImgTwo;
var randImgThree;
//power variable
var isPowerOn = false;
// Score variable
var credit = 1000;
var bet = 0;
var jackpot = 5000;
// Symbol varibales
var potatoMine = 0;
var arcticTrooper = 0;
var cactusGarden = 0;
var coconut = 0;
var crazyHotPaper = 0;
var fatZombie = 0;
var twinCherry = 0;
var twinSunflower = 0;
//more variables
var spinResult;
var symbols = "";
// Preloader Function
function preload() {
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    // event listener triggers when assets are completely loaded
    assets.on("complete", init, this);
    assets.loadManifest(manifest);
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
    stats.domElement.style.left = '438px';
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
function isEnoughCredit(betAmount) {
    if (credit >= betAmount) {
        return true;
    }
    return false;
}
// Callback function that allows me to respond to button click events
function buttonSpinClicked(event) {
    //play a sound when the button is clicked
    createjs.Sound.play("spin");
    // excecute code if power is on
    if (isPowerOn) {
        //check if the user entered a bet 
        if (bet <= 0) {
            lblStatus.text = "Set amount";
            lblStatus.center();
        }
        else {
            //remove previous spin Result
            stage.removeChild(randImgOne, randImgTwo, randImgThree);
            // display spinResult
            spinResult = Reels();
            console.log(spinResult[0] + " " + spinResult[1] + " " + spinResult[2]);
            randImgOne = new objects.Reel(assets.getResult(spinResult[0]), 136, 140);
            randImgTwo = new objects.Reel(assets.getResult(spinResult[1]), 208, 140);
            randImgThree = new objects.Reel(assets.getResult(spinResult[2]), 287, 140);
            ;
            stage.addChild(randImgOne, randImgTwo, randImgThree);
            // if spin result spins potato mine then the player looses
            if (spinResult[0] == "potatoMine" || spinResult[1] == "potatoMine" || spinResult[2] == "potatoMine") {
                createjs.Sound.play("potatoMineSound");
                credit = credit - bet;
                bet = 0;
                updateScores();
                lblStatus.text = "You loose";
                lblStatus.center();
            }
            else {
                //wins jackpot if images on all three reels are equal
                if (spinResult[0] == spinResult[1] && spinResult[0] == spinResult[2]) {
                    credit += jackpot;
                    jackpot = 1000;
                    lblJackPot.text = "" + jackpot;
                    lblJackPot.center();
                    bet = 0;
                    updateScores();
                    lblStatus.text = "***Jackpot***";
                    lblStatus.center();
                }
                else {
                    //otherwise handle simple win
                    credit += bet;
                    bet = 0;
                    updateScores();
                    lblStatus.text = "You win+++";
                    lblStatus.center();
                }
            }
        }
    }
}
function btnBetTen_Click(event) {
    //play a sound when the button is clicked
    createjs.Sound.play("bet");
    if (isPowerOn) {
        if (isEnoughCredit(10)) {
            bet = 10;
            lblCredit.text = (credit - bet).toString();
            lblBet.text = bet.toString();
        }
        else {
            // if credit is not enough show message
            lblStatus.text = "Unsufficient Credit";
            lblStatus.center();
        }
    }
}
function btnBetMax_Click(event) {
    //play a sound when the button is clicked
    createjs.Sound.play("bet");
    if (isPowerOn) {
        bet = credit;
        lblCredit.text = (credit - bet).toString();
        lblBet.text = bet.toString();
    }
}
function reset_Click(event) {
    //play a sound when the button is clicked
    createjs.Sound.play("clicked");
    if (isPowerOn) {
        if (confirm("Reset Game ?")) {
            credit = 1000;
            bet = 0;
            updateScores();
            lblStatus.text = "Ready";
            lblStatus.center();
        }
    }
}
function btnPower_Click(event) {
    //play a sound when the button is clicked
    createjs.Sound.play("powerOn");
    if (isPowerOn) {
        // if power on then 
        if (confirm("Turn off the game ?")) {
            buttonPower.image = assets.getResult("buttonPower");
            lblStatus.text = "Power on to play";
            lblStatus.center();
            //removing information label
            stage.removeChild(lblCredit, lblBet);
            isPowerOn = false;
        }
    }
    else {
        //if power off
        buttonPower.image = assets.getResult("buttonPower");
        lblStatus.text = "Ready";
        lblStatus.center();
        //adding information label
        lblCredit = new objects.Label(credit.toString(), 535, 138, false);
        lblBet = new objects.Label(bet.toString(), 535, 200, false);
        stage.addChild(lblCredit, lblBet);
        isPowerOn = true;
    }
}
function btnQuit_Click() {
    //play a sound when the button is clicked
    createjs.Sound.play("clicked");
    if (confirm("Quit the game ?")) {
        window.top.close();
    }
}
// Main Game Function
function main() {
    background = new createjs.Bitmap(assets.getResult("background"));
    //creating a link to the buttons and setting their positions
    buttonPower = new createjs.Bitmap(assets.getResult("buttonPower"));
    buttonPower.regX = buttonPower.getBounds().width * 0.5;
    buttonPower.regY = buttonPower.getBounds().height * 0.5;
    buttonPower.x = 377;
    buttonPower.y = 112;
    buttonPower.on("click", btnPower_Click, this);
    buttonSpin = new createjs.Bitmap(assets.getResult("buttonSpin"));
    buttonSpin.regX = buttonSpin.getBounds().width * 0.5;
    buttonSpin.regY = buttonSpin.getBounds().height * 0.5;
    buttonSpin.x = 227;
    buttonSpin.y = 260;
    buttonSpin.on("click", buttonSpinClicked, this);
    buttonBetMax = new createjs.Bitmap(assets.getResult("buttonBetMax"));
    buttonBetMax.regX = buttonBetMax.getBounds().width * 0.5;
    buttonBetMax.regY = buttonBetMax.getBounds().height * 0.5;
    buttonBetMax.x = 377;
    buttonBetMax.y = 260;
    buttonBetMax.on("click", btnBetMax_Click, this);
    buttonBetOne = new createjs.Bitmap(assets.getResult("buttonBetOne"));
    buttonBetOne.regX = buttonBetOne.getBounds().width * 0.5;
    buttonBetOne.regY = buttonBetOne.getBounds().height * 0.5;
    buttonBetOne.x = 327;
    buttonBetOne.y = 260;
    buttonBetOne.on("click", btnBetTen_Click, this);
    buttonReset = new createjs.Bitmap(assets.getResult("buttonReset"));
    buttonReset.regX = buttonReset.getBounds().width * 0.5;
    buttonReset.regY = buttonReset.getBounds().height * 0.5;
    buttonReset.x = 277;
    buttonReset.y = 260;
    buttonReset.on("click", reset_Click, this);
    buttonQuit = new createjs.Bitmap(assets.getResult("buttonQuit"));
    buttonQuit.regX = buttonQuit.getBounds().width * 0.5;
    buttonQuit.regY = buttonQuit.getBounds().height * 0.5;
    buttonQuit.x = 50;
    buttonQuit.y = 50;
    buttonQuit.on("click", btnQuit_Click, this);
    //adding buttons and background to the screen
    stage.addChild(background, buttonReset, buttonBetMax, buttonBetOne, buttonPower, buttonSpin, buttonQuit);
    // adding jackpot label
    lblJackPot = new objects.Label(jackpot.toString(), 550, 290, true);
    stage.addChild(lblJackPot);
    //adding status label
    lblStatus = new objects.Label("Turn on to play", 600, 50, true);
    stage.addChild(lblStatus);
    //adding different symbols to the screen
    var randomImages = Reels();
    randImgOne = new objects.Reel(assets.getResult(randomImages[0]), 136, 140);
    randImgTwo = new objects.Reel(assets.getResult(randomImages[1]), 208, 140);
    randImgThree = new objects.Reel(assets.getResult(randomImages[2]), 287, 140);
    stage.addChild(randImgOne, randImgTwo, randImgThree);
}
//# sourceMappingURL=game.js.map