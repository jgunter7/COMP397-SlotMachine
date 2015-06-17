/// <reference path="typings/stats/stats.d.ts" />
/// <reference path="typings/tweenjs/tweenjs.d.ts" />
/// <reference path="typings/soundjs/soundjs.d.ts" />
/// <reference path="typings/preloadjs/preloadjs.d.ts" />
/// <reference path="typings/createjs-lib/createjs-lib.d.ts" />
/// <reference path="typings/easeljs/easeljs.d.ts" />

// Framework variables
var stat: Stats;
var canvas = document.getElementById("mc");
var stage: createjs.Stage;
var assets: createjs.LoadQueue;
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
    { id: "slotwav", src: "sound/slots.wav" }
];
var imgs = [ "7s", "bar", "bell", "cherry", "lemon", "orange", "plum" ];

// Global Game Variables
var lblCash: createjs.Text;
var lblBet: createjs.Text;
var lblPayout: createjs.Text;
var imgSlotMachine: createjs.Bitmap;
var btnSpin: createjs.Bitmap;
var slot1: createjs.Bitmap;
var slot2: createjs.Bitmap;
var slot3: createjs.Bitmap;
var spinAnim = 0;
var spinAnimm = false;
var cash = 500;
var bet = 5;
var payout = 0;

function init() {
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.on("tick", gameloop);
    setupStats();
    main();
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

function main() { 
    stage.removeAllChildren(); 
    // Draw slot machine first
    imgSlotMachine = new createjs.Bitmap(assets.getResult("slots"));
    stage.addChild(imgSlotMachine);
    // Draw text items
    addTextitems();
    // Draw Slot Spin button
    if (!spinAnimm) {
        addBtnSpin();
    }
    //
    spinAnim++;
    // Draw Slot P1
    slot1 = new createjs.Bitmap(assets.getResult(imgs[Math.floor(Math.random() * 7) + 1]));
    slot1.x = 37;
    slot1.y = 85;
    slot1.scaleX = slot1.scaleY = Math.min(125 / slot1.image.width, 125 / slot1.image.height);
    stage.addChild(slot1);
    // Draw Slot P2
    slot2 = new createjs.Bitmap(assets.getResult(imgs[Math.floor(Math.random() * 7) + 1]));
    slot2.x = 190;
    slot2.y = 85;
    slot2.scaleX = slot2.scaleY = Math.min(125 / slot2.image.width, 125 / slot2.image.height);
    stage.addChild(slot2);
    // Draw Slot P3
    slot3 = new createjs.Bitmap(assets.getResult(imgs[Math.floor(Math.random() * 7) + 1]));
    slot3.x = 340;
    slot3.y = 85;
    slot3.scaleX = slot3.scaleY = Math.min(125 / slot3.image.width, 125 / slot3.image.height);
    stage.addChild(slot3);
    if (spinAnim > 120) {
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
    addBtnSpin();
    payout = 500;
    bet = 5;
    cash = (cash - bet) + payout;
    addTextitems();
}

function btnSpin_Click() {
    createjs.Sound.play("slotwav");
    stage.removeChild(btnSpin);
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
