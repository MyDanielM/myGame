function HTMLredraw() {
  this.bodyWrap = document.querySelector('body');
  this.gameWrap = document.querySelector('#game-wrap');
  this.scoreWrap = document.querySelector('#score');
  this.messageWrap = document.querySelector('#message');
  this.scoreNums = 4;
}

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
  this.messageWrap.classList.add("win");
  fish = document.getElementsByClassName("fish-score");
  fish[0].classList+= " win"
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
