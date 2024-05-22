function HTMLredraw() {
  this.bodyWrap = document.querySelector('body');
  this.gameWrap = document.querySelector('#game-wrap');
  this.scoreWrap = document.querySelector('#score');
  this.messageWrap = document.querySelector('#message');
  this.scoreNums = 4;
}

let codes = ['111111', '222222', '333333','444444','555555','666666'];
let texts = ['Пиво Ч.П.Х', 'Мороженое', 'Кондитерская колбаска', 'Свеча с ароматом свежей корюшки', 'Френч дог', 'Хот дог с корюшкой'];

HTMLredraw.prototype.updateEggPosition = function(data) {
  this.changeAttributesValue(['data-egg-' + data.egg], [data.position]);
  /*if (data.position == 6){
    var currentClass = "egg e-"+data.egg;
    var egg = document.getElementsByClassName(currentClass);
    egg[0].className = currentClass;
  }
  */
};

HTMLredraw.prototype.updateBasketPosition = function(data) {
  this.changeAttributesValue(['data-bx', 'data-by'], [data.x, data.y]);
};

HTMLredraw.prototype.changeAttributesValue = function(attributes, values) {
  if (attributes instanceof Array && values instanceof Array && attributes.length == values.length) {
    for (var i = 0; i < attributes.length; i++) {
      this.gameWrap.setAttribute(attributes[i], values[i]);
    }
  }
};

HTMLredraw.prototype.updateFishScore = function(data) {
  var element = document.getElementsByClassName('fish-score');
  var cloth = data.value.toString();
  //element[0].className += " " +cloth;
  element[0].innerHTML += `<div class = \"${cloth}\"></div>`
};

HTMLredraw.prototype.updateScore = function(data) {
  var elements = this.scoreWrap.getElementsByTagName('li');
  var score = data.value.toString();
  var empty = (this.scoreNums - score.length);

  for (var i = 0; i < elements.length; i++) {
    var num = (i < empty) ? 0 : parseInt(score.charAt(i - empty));
    elements[i].className = 'n-' + num;
  }
};

HTMLredraw.prototype.updateLossCount = function(data) {
  this.changeAttributesValue(['data-loss'], [data.loss]);
};

HTMLredraw.prototype.gameOver = function() {
  this.messageWrap.classList.add("lose");
  this.messageWrap.innerHTML += '<a href="../pages/game.html">'
  this.messageWrap.show();
};

HTMLredraw.prototype.gameWin = function() {
  fish = document.getElementsByClassName("fish-score");
  let almost = true;
  for (let i =0; i<4;i++){
    let splite1 = fish[0].childNodes[i].classList[0].split('_');
    let splite2 = fish[0].childNodes[i+1].classList[0].split('_');
    if (splite1[0]==splite2[0]){
      continue;
    }
    else almost = false;
    break;
  }
  if (!almost){
    this.messageWrap.classList.add("almost_win");
    fish[0].classList+= " almost_win"
    this.messageWrap.innerHTML += '<a href="../pages/game.html">'
  }
  else {
    this.messageWrap.classList.add("win");
    fish[0].classList+= " win";
    let type = fish[0].childNodes[0].classList[0].split('_');
    let num;
    let text;
    switch (type[0]){
      case "sailor":{
        num = codes[0];
        text = texts[0];
        break;
      }
      case "girl":{
        num =  codes[1];
        text = texts[1];
        break;
      }
      case "zenit":{
        num =  codes[2];
        text = texts[2];
        break;
      }
      case "woman":{
        num = codes[3];
        text = texts[3];
        break;
      }
      case "oldman":{
        num =  codes[4];
        text = texts[4];
        break;
      }
      case "granny":{
        num =  codes[5];
        text = texts[5];
        break;
      }
    }
    this.messageWrap.innerHTML += `<div class="text">Поздравляем! Твой приз: `+ text+`!</div>`
    this.messageWrap.innerHTML += `<div class="nums">`+num+`</div>`
    //this.messageWrap.innerHTML += '<div class="barcode_base">'
  }
  this.messageWrap.show();
};

HTMLredraw.prototype.getMessage = function(message) {
  var data = { h3: message, p: 'Press <b>R</b> to restart' };

  var wrap = document.createElement('div');
  for (var tag in data) {
    var elem = document.createElement(tag);
    elem.innerHTML = data[tag];
    wrap.appendChild(elem);
  }

  return wrap;
};

HTMLredraw.prototype.mobileVersion = function() {
  this.bodyWrap.className = 'is-mobile';
};
