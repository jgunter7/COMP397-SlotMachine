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
function init() {
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.on("tick", gameloop);
    setupStats();
    menu();
}
function setupStats() {
    stat = new Stats();
    stat.setMode(0);
    stat.domElement.style.position = 'absolute';
    stat.domElement.style.left = '600px';
    stat.domElement.style.top = '70px';
    document.body.appendChild(stat.domElement);
}
function preload() {
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    assets.on("complete", init, this);
    assets.loadManifest(manifest);
}
function gameloop() {
    stat.begin();
    if (spinAnimm)
        main();
    stage.update();
    stat.end();
}
function menu() {
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
    main();
}
function btnStart_Mout() {
    btnStart.alpha = 1.0;
}
function btnStart_Mover() {
    btnStart.alpha = 0.7;
}
function main() {
    stage.removeAllChildren();
    // Draw slot machine first
    imgSlotMachine = new createjs.Bitmap(assets.getResult("slots"));
    stage.addChild(imgSlotMachine);
    // Draw text items
    addTextitems();
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
    slotsVal[0] = imgs[Math.floor(Math.random() * 7) + 1];
    slot1 = new createjs.Bitmap(assets.getResult(slotsVal[0]));
    slot1.x = 37;
    slot1.y = 85;
    slot1.scaleX = slot1.scaleY = Math.min(125 / slot1.image.width, 125 / slot1.image.height);
    stage.addChild(slot1);
    // Draw Slot P2
    slotsVal[1] = imgs[Math.floor(Math.random() * 7) + 1];
    slot2 = new createjs.Bitmap(assets.getResult(slotsVal[1]));
    slot2.x = 190;
    slot2.y = 85;
    slot2.scaleX = slot2.scaleY = Math.min(125 / slot2.image.width, 125 / slot2.image.height);
    stage.addChild(slot2);
    // Draw Slot P3
    slotsVal[2] = imgs[Math.floor(Math.random() * 7)];
    slot3 = new createjs.Bitmap(assets.getResult(slotsVal[2]));
    slot3.x = 340;
    slot3.y = 85;
    slot3.scaleX = slot3.scaleY = Math.min(125 / slot3.image.width, 125 / slot3.image.height);
    stage.addChild(slot3);
    // ANimation check
    if (spinAnim > 45) {
        spinAnim = 0;
        spinAnimm = false;
        CheckWin();
    }
}
function addBtnSpin() {
    btnSpin = new createjs.Bitmap(assets.getResult("spin"));
    btnSpin.x = canvas.clientWidth / 2 - 50;
    btnSpin.y = imgSlotMachine.getBounds().height + 10;
    btnSpin.on("click", btnSpin_Click);
    btnSpin.on("mouseover", btnSpin_Mover);
    btnSpin.on("mouseout", btnSpin_Mout);
    stage.addChild(btnSpin);
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
        window.alert("WINNER!!");
        // JACKPOT is three 7's
        if (slotsVal[0] == "7s") {
            cash = cash + payout;
            payout = 0;
        }
        else {
            cash = cash + Math.floor(payout * 0.25);
            payout = payout - Math.floor(payout * 0.25);
        }
    }
    addTextitems();
}
function btnSpin_Click() {
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
    // Do all calcs call main to rest the view
    spinAnimm = true;
    main();
}
function btnSpin_Mover() {
    btnSpin.alpha = 0.8;
}
function btnSpin_Mout() {
    btnSpin.alpha = 1.0;
}
function btnMinus_Click() {
    if (bet > 5)
        bet -= 5;
    addTextitems();
    stage.removeChild(btnSpin);
    if (cash >= bet)
        addBtnSpin();
}
function btnPlus_Click() {
    if (bet < 25)
        bet += 5;
    addTextitems();
    stage.removeChild(btnSpin);
    if (cash >= bet)
        addBtnSpin();
}
function btnReset_Click() {
    cash = 500;
    bet = 5;
    payout = 0;
    main();
}
function btnReset_Mover() {
    btnReset.alpha = 0.7;
}
function btnReset_Mout() {
    btnReset.alpha = 1.0;
}
function btnQuit_Click() {
    cash = 500;
    bet = 5;
    payout = 0;
    menu();
}
function btnQuit_Mover() {
    btnQuit.alpha = 0.7;
}
function btnQuit_Mout() {
    btnQuit.alpha = 1.0;
}
//# sourceMappingURL=game.js.map