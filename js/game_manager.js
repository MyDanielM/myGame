
var GameManager = function() {
    checkCookie();
    this.init();
    this.setup();
    this.start(); 

}


// Initial game settings
GameManager.prototype.init = function () {


  let elem = document.getElementsByClassName("orientation-vert");
  if (window.orientation === 90 || window.orientation === -90){
    elem[0].style.display='none';
  }
  window.onload = function() {
    var gameWrap = document.getElementById('game-wrap');
    var initialWidth = 1250; // Ширина блока в исходных пикселях
    var initialHeight = 765; // Высота блока в исходных пикселях
    var scaleWidth = window.innerWidth / initialWidth;
    var scaleHeight = window.innerHeight / initialHeight;
    var scale = Math.min(scaleWidth, scaleHeight);
    
    // Проверяем, чтобы высота блока не превышала высоту экрана пользователя
    if (scaleHeight < scaleWidth) {
      scale = scaleHeight;
    }
      
    // Устанавливаем масштаб и перемещаем в центр
    gameWrap.style.transform = 'scale(' + scale + ') translate(-50%, -50%)';
  };
  
  this.score = 0;
  this.loss = 0;
  this.over = false;
  this.won = false;

  this.count = 4;
  this.level = 1;
  this.speed = 800;
  // this.maxSpeed = 200;
  this.interval = this.speed*2.5;
  this.point = 2;

  this.chickens = {};
  this.eggs = {};

  this.gameTimer;

  this.basketStartPosition = { x: 0, y: 1 };
/*
  this.cloth = [
    ["cap","felt-boots","felt-boots-2","vest","whisker"],
    ["boot-1","boot-2","tors-1","tors-2","tors-3"],
    ["hat","hat-2","moustache","scarf","scarf-text"],
    ["dress","head","lips","pot","raincoat"],
    ["glass-1","glass-2","hair","moustache","stick"],
    ["glass","hair","scarf","spokes","tangle"]
  ];
  */
  this.cloth = [
    ["whisker 3", "cap 3","vest 4","felt-boots 5","felt-boots-2 5"],
    ["tors-1 4","tors-2 4","tors-3 4","boot-1 5","boot-2 5"],
    ["moustache 3", "hat 3","hat-2 3","scarf 4","scarf-text 4"],
    ["lips 3", "head 3", "pot 4","raincoat 4","dress 4"],
    ["glass-1 3","glass-2 3","hair 3","moustache 3","stick 4"],
    ["glass 3","hair 3","scarf 4","spokes 4","tangle 4"]
  ];  

  this.fishScore = []
};

// Set up the game
GameManager.prototype.setup = function () {
  this.keyboard = new KeyboardInputManager();
  this.keyboard.on("move", this.move.bind(this));

  this.grid = new Grid(this.count);
  this.basket = new Basket(this.basketStartPosition);

  for (var i = 0; i < this.count; i++) {
    this.chickens[i] = new Chicken(i, this.grid.list[i], this.point);
  }

  this.HTMLredraw = new HTMLredraw();

  if (this.isMobile()) {
    this.touchscreenModification();
  }
};

GameManager.prototype.isMobile = function() {
  try {
    document.createEvent("TouchEvent");
    return true;
  }
  catch(e) {
    return false;
  }
};

GameManager.prototype.move = function (data) {
  var position = { x: this.basket.x, y: this.basket.y };

  switch (data.type) {
    case 'arrow':
      // 0: up, 1: right, 2: down, 3: left, 4: R - restart
      if(data.key%2 == 0) {
        position.y = (data.key > 0) ? 0 : 1;
      } else {
        position.x = (data.key > 2) ? 0 : 1;
      }
      break;
    case 'button':
      position.x = data.x;
      position.y = data.y;
      break;
    case 'common':
      if (data.key == 'restart') {
        this.reStart();
        return false;
      }
      break;
  }

  this.basket.updatePosition(position, this.api.bind(this));
}

GameManager.prototype.start = function () {
  this.runGear();
};

GameManager.prototype.reStart = function () {
  window.location.reload();
};

GameManager.prototype.runGear = function () {
  var self = this;
  this.gameTimer = setInterval(function() {
    var chicken = self.findAvailableChicken();
    if (chicken >= 0 && !this.over) {
      self.runEgg(chicken);
    }
  }, this.interval);
};

GameManager.prototype.suspendGear = function () {
  clearInterval(this.gameTimer);
  this.runGear();
};

GameManager.prototype.haltGear = function () {
  clearInterval(this.gameTimer);
  this.over = true;
};

GameManager.prototype.upLevel = function () {
  this.level++;

  switch (true) {
    case (this.level < 8):
      this.speed += -50;
      break;
    case (this.level > 19):
      this.speed += 0;
      break;
    default:
      this.speed += -25;
      break;
  }
  this.interval = this.speed*2.5;

  this.suspendGear();
};

GameManager.prototype.updateScore = function (data) {
  var currentClass = "egg e-"+data.egg;
  var egg = document.getElementsByClassName(currentClass);
  if (egg[0].classList.contains("cloth") && !(this.grid.list[data.egg].x == this.basket.x && this.grid.list[data.egg].y == this.basket.y)){
    var baseClass = "egg e-"+data.egg;
    egg[0].className = baseClass;
    return;
  }
  if (egg[0].classList.contains("cloth") && this.grid.list[data.egg].x == this.basket.x && this.grid.list[data.egg].y == this.basket.y){
    var type = egg[0].classList[3].split('_');
    var num;
    switch (type[0]){
      case "sailor":{
        num = 0;
        for (let i = 0; i<this.cloth[num].length;i++){
          if (this.cloth[num][i].includes(type[1])){
            this.cloth[num].splice(i,1); 
          }
        }
        break;
      }
      case "girl":{
        num =  1;
        for (let i = 0; i<this.cloth[num].length;i++){
          if (this.cloth[num][i].includes(type[1])){
            this.cloth[num].splice(i,1); 
          }
        }
        break;
      }
      case "zenit":{
        num =  2;
        for (let i = 0; i<this.cloth[num].length;i++){
          if (this.cloth[num][i].includes(type[1])){
            this.cloth[num].splice(i,1); 
          }
        }
        break;
      }
      case "woman":{
        num =  3;
        for (let i = 0; i<this.cloth[num].length;i++){
          if (this.cloth[num][i].includes(type[1])){
            this.cloth[num].splice(i,1); 
          }
        }
        break;
      }
      case "oldman":{
        num =  4;
        for (let i = 0; i<this.cloth[num].length;i++){
          if (this.cloth[num][i].includes(type[1])){
            this.cloth[num].splice(i,1); 
          }
        }
        break;
      }
      case "granny":{
        num =  5;
        for (let i = 0; i<this.cloth[num].length;i++){
          if (this.cloth[num][i].includes(type[1])){
            this.cloth[num].splice(i,1); 
          }
        }
        break;
      }
    }
    
    var new_cloth = [];
    for (let i = 0;i<this.cloth.length;i++){
      new_cloth.push([]);
    }
    for (let i = 0;i<this.cloth.length;i++){
      
      for (let j = 0;j<this.cloth[i].length;j++)
        {
          if (i==num) {
            new_cloth[i].push(this.cloth[i][j]); 
            continue;
          }
          if (!this.cloth[i][j].includes(egg[0].classList[4])){
            new_cloth[i].push(this.cloth[i][j]);
          }
        }
    }
    this.cloth = new_cloth;
    this.fishScore.push(egg[0].classList[3]);
    this.HTMLredraw.updateFishScore({value:egg[0].classList[3]});
    // Если собрали пять одежд — победа
    if (this.fishScore.length==5){
      this.gameWin();
      return false;
    }
    var baseClass = "egg e-"+data.egg;
    egg[0].className = baseClass;
    return;
  }
  if (this.grid.list[data.egg].x == this.basket.x && this.grid.list[data.egg].y == this.basket.y) {
    this.score += this.point;
    this.HTMLredraw.updateScore({ value: this.score });
    /* ! Условие победы по очкам

    if (this.score >= 1000) {
      this.gameWin();
      return false;
    }
    */
    if (!(this.score % 50)) {
      this.upLevel();
    }
  } else {
    this.loss++;
    this.HTMLredraw.updateLossCount({ loss: this.loss });
    if (this.loss > 2 && !this.over) {
      this.gameOver();
    }
  }  
};

GameManager.prototype.findAvailableChicken = function() {
  var avail = this.grid.avail.diff(this.grid.hold);

  if (!avail) {
    return null;
  }

  var chicken = avail.randomElement();
  this.api('onHoldChicken', { egg: chicken });

  return chicken;
};

GameManager.prototype.runEgg = function(chicken) {
  this.chickens[chicken].egg.run(this.speed, this.api.bind(this));
  let eggs = document.getElementsByClassName("egg");
  let check=true;
  for (let i = 0;i<eggs.length;i++){
    if (eggs[i].classList.contains("cloth")) check = false;
  }
  //let possible = Math.random()*10
  let possible = 10;
  if (check && (possible>8)) {
    var currentClass = "egg e-"+chicken;
    var egg = document.getElementsByClassName(currentClass);
    egg[0].className += ' cloth';
    var arr = getRandomInt(this.cloth.length);
    //let arr = 2;
    while (this.cloth[arr].length==0){
      arr = getRandomInt(this.cloth.length);
    }
    var index = getRandomInt(this.cloth[arr].length);
    var type;
    switch (arr){
      case 0:{
        type = "sailor";
        break;
      }
      case 1:{
        type = "girl";
        break;
      }
      case 2:{
        type = "zenit";
        break;
      }
      case 3:{
        type = "woman";
        break;
      }
      case 4:{
        type = "oldman";
        break;
      }
      case 5:{
        type = "granny";
        break;
      }
    }
    egg[0].className += ' '+ type+'_'+this.cloth[arr][index];
    if (this.cloth[arr].length>0) {
      //this.cloth[arr].splice(index,1); 
    }
    else this.cloth.splice(arr,1);
  }
};


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

GameManager.prototype.gameOver = function() {
  this.haltGear();
  this.HTMLredraw.gameOver();
};

GameManager.prototype.gameWin = function() {
  this.haltGear();
  this.HTMLredraw.gameWin();
};

GameManager.prototype.api = function(method, data) {
  switch (method) {
    case 'updateScore':
      this.updateScore(data);
      break;
    case 'onHoldChicken':
      this.grid.onHold(data.egg);
      break;
    case 'unHoldChicken':
      this.grid.unHold(data.egg);
      break;
    case 'updateEggPosition':
      this.HTMLredraw.updateEggPosition(data);
      break;
    case 'updateBasketPosition':
      this.HTMLredraw.updateBasketPosition(data);
      break;
    case 'updateFishScore':
      this.updateFishScore(data);
      break;
  }
};

GameManager.prototype.touchscreenModification = function() {
  var buttons = document.querySelector('#controls').getElementsByTagName('a');

  var self = this;
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function() {
      var data = { x: this.getAttribute('data-x'), y: this.getAttribute('data-y'), type: 'button' };
      self.move(data);
      return false;
    };
  }

  this.HTMLredraw.mobileVersion();
};


function checkCookie() {
  var isWin = getCookie("isWin");
  if (isWin == "true") {
      let messageWrap = document.querySelector('#message');
      messageWrap.classList.add("try_tommorow");
      messageWrap.show();
  }
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
}