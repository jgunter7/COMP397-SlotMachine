/// <reference path="typings/stats/stats.d.ts" />
/// <reference path="typings/tweenjs/tweenjs.d.ts" />
/// <reference path="typings/soundjs/soundjs.d.ts" />
/// <reference path="typings/preloadjs/preloadjs.d.ts" />
/// <reference path="typings/createjs-lib/createjs-lib.d.ts" />
/// <reference path="typings/easeljs/easeljs.d.ts" />
// Framework variables
var stat;
var canvas = document.getElementById("mc");
var stage;
var assets;
var manifest = [
    { id: "7s", src: "img/7s.png" },
    { id: "bar", src: "img/bar.png" },
    { id: "bell", src: "img/bell.png" },
    { id: "cherry", src: "img/cherrys.png" },
    { id: "lemon", src: "img/lemon.png" },
    { id: "orange", src: "img/orange.png" },
    { id: "plum", src: "img/plum.png" },
    { id: "slots", src: "img/slots.png" },
    { id: "spin", src: "img/spin.png" },
    { id: "plus", src: "img/plus.png" },
    { id: "minus", src: "img/minus.png" },
    { id: "start", src: "img/start.png" },
    { id: "reset", src: "img/reset.png" },
    { id: "quit", src: "img/quit.png" },
    { id: "betline", src: "img/betline.png" },
    { id: "slotwav", src: "sound/slots.wav" }
];
var imgs = ["7s", "bar", "bell", "cherry", "lemon", "orange", "plum"];
// Global Game Variables
var lblCash;
var lblBet;
var lblPayout;
var imgSlotMachine;
var btnSpin;
var slot1;
var slot2;
var slot3;
var spinAnim = 0;
var spinAnimm = false;
var cash = 500;
var bet = 5;
var payout = 0;
var slotsVal = ["7s", "7s", "7s"];
var btnPlus;
var btnMinus;
var btnStart;
var btnReset;
var btnQuit;
var betLine;
function init() {
    //Initialize stage and FPS and game loop and Stats monitor
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.on("tick", gameloop);
    setupStats();
    // Show main menu
    menu();
}
function setupStats() {
    // Display stats monitor
    stat = new Stats();
    stat.setMode(0);
    stat.domElement.style.position = 'absolute';
    stat.domElement.style.left = '600px';
    stat.domElement.style.top = '70px';
    document.body.appendChild(stat.domElement);
}
function preload() {
    // Preload images and sound clips
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    assets.on("complete", init, this);
    assets.loadManifest(manifest);
}
function gameloop() {
    // Update stage / Do animations
    stat.begin();
    // Animate slot machine if 'spin' button is clicked
    if (spinAnimm)
        main();
    stage.update();
    stat.end();
}
function menu() {
    // This function displays the main menu
    stage.removeAllChildren(); // Clear the screen for the menu
    //Menu Text
    var menuText;
    menuText = new createjs.Text("Welcome To Super7Slots", "38px Consolas", "#000000");
    menuText.x = 5;
    menuText.y = 100;
    stage.addChild(menuText);
    // Menu 'Start' button
    btnStart = new createjs.Bitmap(assets.getResult("start"));
    btnStart.x = canvas.clientWidth / 2 - btnStart.getBounds().width / 2;
    btnStart.y = 250;
    btnStart.on("click", btnStart_Click);
    btnStart.on("mouseover", btnStart_Mover);
    btnStart.on("mouseout", btnStart_Mout);
    stage.addChild(btnStart);
}
function btnStart_Click() {
    // Show slot machine screen
    main();
}
function btnStart_Mout() {
    // change alpha of btnStart
    btnStart.alpha = 1.0;
}
function btnStart_Mover() {
    // change alpha of btnStart
    btnStart.alpha = 0.7;
}
function main() {
    // Display main slot machine game
    stage.removeAllChildren();
    // Draw slot machine first
    imgSlotMachine = new createjs.Bitmap(assets.getResult("slots"));
    stage.addChild(imgSlotMachine);
    // Draw text items
    addTextitems();
    // Draw Quit & Reset button
    addNavButtons();
    // Draw Bet changing buttons
    btnPlus = new createjs.Bitmap(assets.getResult("plus"));
    btnPlus.x = 250;
    btnPlus.y = imgSlotMachine.getBounds().height - 135;
    btnPlus.scaleX = btnPlus.scaleY = Math.min(25 / btnPlus.image.width, 25 / btnPlus.image.height);
    btnPlus.on("click", btnPlus_Click);
    stage.addChild(btnPlus);
    btnMinus = new createjs.Bitmap(assets.getResult("minus"));
    btnMinus.x = 220;
    btnMinus.y = imgSlotMachine.getBounds().height - 135;
    btnMinus.scaleX = btnMinus.scaleY = Math.min(25 / btnMinus.image.width, 25 / btnMinus.image.height);
    btnMinus.on("click", btnMinus_Click);
    stage.addChild(btnMinus);
    // Draw Slot Spin button
    if (!spinAnimm && cash >= bet) {
        addBtnSpin();
    }
    //
    spinAnim++;
    // Draw Slot P1
    if (spinAnim < 10) {
        slotsVal[0] = imgs[Math.floor(Math.random() * 6)];
    }
    slot1 = new createjs.Bitmap(assets.getResult(slotsVal[0]));
    slot1.x = 37;
    slot1.y = 85;
    slot1.scaleX = slot1.scaleY = Math.min(125 / 150, 125 / 115);
    stage.addChild(slot1);
    // Draw Slot P2
    if (spinAnim < 25) {
        slotsVal[1] = imgs[Math.floor(Math.random() * 6)];
    }
    slot2 = new createjs.Bitmap(assets.getResult(slotsVal[1]));
    slot2.x = 190;
    slot2.y = 85;
    slot2.scaleX = slot2.scaleY = Math.min(125 / 150, 125 / 115);
    stage.addChild(slot2);
    // Draw Slot P3
    slotsVal[2] = imgs[Math.floor(Math.random() * 6)];
    slot3 = new createjs.Bitmap(assets.getResult(slotsVal[2]));
    slot3.x = 340;
    slot3.y = 85;
    slot3.scaleX = slot3.scaleY = Math.min(125 / 150, 125 / 115);
    stage.addChild(slot3);
    // Draw Betline over the images
    betLine = new createjs.Bitmap(assets.getResult("betline"));
    betLine.x = canvas.clientWidth / 2 - betLine.getBounds().width / 2;
    betLine.y = 140;
    betLine.scaleY = Math.min(3 / 25);
    stage.addChild(betLine);
    // Animation check
    if (spinAnim > 45) {
        // Animation is complete - reset counters and check for a win
        spinAnim = 0;
        spinAnimm = false;
        CheckWin();
    }
}
function addBtnSpin() {
    // Draw spin button
    btnSpin = new createjs.Bitmap(assets.getResult("spin"));
    btnSpin.x = canvas.clientWidth / 2 - 50;
    btnSpin.y = imgSlotMachine.getBounds().height + 10;
    btnSpin.on("click", btnSpin_Click);
    btnSpin.on("mouseover", btnSpin_Mover);
    btnSpin.on("mouseout", btnSpin_Mout);
    stage.addChild(btnSpin);
}
function addNavButtons() {
    // Add Reset && Quit button
    btnReset = new createjs.Bitmap(assets.getResult("reset"));
    btnReset.x = 100;
    btnReset.y = imgSlotMachine.getBounds().height + 10;
    btnReset.on("click", btnReset_Click);
    btnReset.on("mouseover", btnReset_Mover);
    btnReset.on("mouseout", btnReset_Mout);
    stage.addChild(btnReset);
    btnQuit = new createjs.Bitmap(assets.getResult("quit"));
    btnQuit.x = 0;
    btnQuit.y = imgSlotMachine.getBounds().height + 10;
    btnQuit.on("click", btnQuit_Click);
    btnQuit.on("mouseover", btnQuit_Mover);
    btnQuit.on("mouseout", btnQuit_Mout);
    stage.addChild(btnQuit);
}
function addTextitems() {
    stage.removeChild(lblCash);
    stage.removeChild(lblBet);
    stage.removeChild(lblPayout);
    // Draw Cash label
    lblCash = new createjs.Text("$" + cash.toString(), "30px Consolas", "#00FF00");
    lblCash.x = 40;
    lblCash.y = imgSlotMachine.getBounds().height - 88;
    stage.addChild(lblCash);
    // Draw Bet Label
    lblBet = new createjs.Text("$" + bet.toString(), "30px Consolas", "#FF0000");
    lblBet.x = 220;
    lblBet.y = imgSlotMachine.getBounds().height - 88;
    stage.addChild(lblBet);
    // Draw Payout Label
    lblPayout = new createjs.Text("$" + payout.toString(), "30px Consolas", "#00FF00");
    lblPayout.x = 315;
    lblPayout.y = imgSlotMachine.getBounds().height - 88;
    stage.addChild(lblPayout);
}
function CheckWin() {
    // Check if anything needs to be payed out
    if (cash >= bet)
        addBtnSpin();
    if (slotsVal[0] == slotsVal[1] && slotsVal[0] == slotsVal[2]) {
        // JACKPOT is three 7's
        var winnings = 0;
        if (slotsVal[0] == "7s") {
            winnings = payout;
            cash = cash + payout;
            payout = 0;
        }
        else {
            winnings = Math.floor(payout * 0.25);
            cash = cash + Math.floor(payout * 0.25);
            payout = payout - Math.floor(payout * 0.25);
        }
        window.alert("WINNER!! Your payout is: $" + winnings.toString());
    }
    // Refresh text labels (cash, bet, payout)
    addTextitems();
}
function btnSpin_Click() {
    // Do animation
    spinAnim = 0;
    createjs.Sound.play("slotwav");
    stage.removeChild(btnSpin);
    cash = cash - bet;
    switch (bet) {
        case 5:
            payout += 150;
            break;
        case 10:
            payout += 200;
            break;
        case 15:
            payout += 250;
            break;
        case 20:
            payout += 300;
            break;
        case 25:
            payout += 350;
            break;
    }
    if (payout > 10000)
        payout = 10000; // Max Jackpot size - all extra funds go to the house ;)
    addTextitems();
    //  Enable animation timer and begin animation
    spinAnimm = true;
    main();
}
function btnSpin_Mover() {
    // Change Alpha for button
    btnSpin.alpha = 0.8;
}
function btnSpin_Mout() {
    // Change Alpha for button
    btnSpin.alpha = 1.0;
}
function btnMinus_Click() {
    // Lower the bet for the next spin
    if (bet > 5)
        bet -= 5;
    addTextitems();
    stage.removeChild(btnSpin);
    if (cash >= bet)
        addBtnSpin();
}
function btnPlus_Click() {
    // Increase the bet for the next spin
    if (bet < 25)
        bet += 5;
    addTextitems();
    stage.removeChild(btnSpin);
    if (cash >= bet)
        addBtnSpin();
}
function btnReset_Click() {
    // Reset the game variables and re-draw the slot machine screen
    cash = 500;
    bet = 5;
    payout = 0;
    main();
}
function btnReset_Mover() {
    // Change Alpha for button
    btnReset.alpha = 0.7;
}
function btnReset_Mout() {
    // Change Alpha for button
    btnReset.alpha = 1.0;
}
function btnQuit_Click() {
    // Reset game variables and draw the Main menu
    cash = 500;
    bet = 5;
    payout = 0;
    menu();
}
function btnQuit_Mover() {
    // Change Alpha for button
    btnQuit.alpha = 0.7;
}
function btnQuit_Mout() {
    // Change Alpha for button
    btnQuit.alpha = 1.0;
}
//# sourceMappingURL=game.js.map