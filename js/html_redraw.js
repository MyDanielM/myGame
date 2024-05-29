function HTMLredraw() {
  this.bodyWrap = document.querySelector('body');
  this.gameWrap = document.querySelector('#game-wrap');
  this.scoreWrap = document.querySelector('#score');
  this.messageWrap = document.querySelector('#message');
  this.scoreNums = 4;
}

let apiLogin = "733cd7cc-516a-4215-b4ca-2cec37bbded1";
let orgID = "a1daa1d8-3bf9-474a-b42e-19479580baa3";

let token = getToken();

let texts = ['Пиво Ч.П.Х', 'Мороженое', 'Кондитерская колбаска', 'Свеча с ароматом свежей корюшки', 'Френч дог', 'Хот дог с корюшкой'];

HTMLredraw.prototype.updateEggPosition = function(data) {
  this.changeAttributesValue(['data-egg-' + data.egg], [data.position]);
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
  this.messageWrap.innerHTML += '<a href="../pages/game.html">';
  let controls = document.getElementById('controls');
  controls.style.zIndex='-10';
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
    let controls = document.getElementById('controls');
    controls.style.zIndex='-10';
  }
  else {
    setCookie("isWin", "true", 1);
    this.messageWrap.classList.add("win");
    fish[0].classList+= " win";
    let type = fish[0].childNodes[0].classList[0].split('_');
    let series;
    switch (type[0]){
      case "sailor":{
        //Указываю, какая серия будет запрошена по api
        series = "ПВ"
        text = texts[0];
        break;
      }
      case "girl":{
        series = "МР"
        text = texts[1];
        break;
      }
      case "woman":{
        series = "КК"
        text = texts[2];
        break;
      }
      case "zenit":{
        series = "СК"
        text = texts[3];
        break;
      }
      case "oldman":{
        series = "ФД"
        text = texts[4];
        break;
      }
      case "granny":{
        series = "ХДК"
        text = texts[5];
        break;
      }
    }

    //Запрос по api всех купонов серии series
    coupons = getCoupons(series);
    let nums = coupons.notActivatedCoupon.map(coupon => coupon.number);
    //Выбор рандомного купона, запись его в num
    let num = nums[Math.floor(Math.random()*nums.length)]

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


function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


async function getToken() {
  const apiUrl = 'https://api-ru.iiko.services/api/1/access_token'; 
  const requestData = {
      "apiLogin": apiLogin,
  };

  try {
      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
      });

      if (!response.ok) {
          throw new Error('Ошибка при получении токена');
      }

      const data = await response.json();
      const token = data.token; 
      return token;
  } catch (error) {
      console.error('Произошла ошибка:', error);
      return null;
  }
}

async function getCoupons(series) {
  const apiUrl = 'https://api-ru.iiko.services/api/1/loyalty/iiko/coupons/by_series'; 

  try {
      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization' : token,
          },
          body: {
              'series': series,
              'pageSize': 0,
              'page': 0,
              'organizationId': orgID,
          },
      });

      if (!response.ok) {
          throw new Error('Ошибка при получении списка купонов');
      }

      const coupons = await response.json();
      return coupons;
  } catch (error) {
      console.error('Произошла ошибка:', error);
      return null;
  }
}
