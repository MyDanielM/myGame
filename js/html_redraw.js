function HTMLredraw() {
  this.bodyWrap = document.querySelector('body');
  this.gameWrap = document.querySelector('#game-wrap');
  this.scoreWrap = document.querySelector('#score');
  this.messageWrap = document.querySelector('#message');
  this.scoreNums = 4;
}

let place = getCookie("place");
let apiLogin = "733cd7cc-516a-4215-b4ca-2cec37bbded1";
let orgID = "a1daa1d8-3bf9-474a-b42e-19479580baa3";

let token;
initializeToken();

let embankmentTexts = ['Пиво Ч.П.Х', 'Мороженое', 'Кондитерская колбаска', 'Свеча с ароматом свежей корюшки', 'Френч дог', 'Хот дог с корюшкой'];
let embankmentSeries = ['ПВ','МР','КК','СК','ФД','ХДК'];
let trainstationTexts = ['','','','','',''];
let trainstationSeries = ['','','','','',''];

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
    this.messageWrap.show();
  }
  else {
    setCookie("isWin", "true", 1);
    this.messageWrap.classList.add("win");
    let type = fish[0].childNodes[0].classList[0].split('_');
    let serieses;
    let texts;
    if (place === 'embankment'){
      serieses = embankmentSeries;
      texts = embankmentTexts;
    }
    else {
      serieses = trainstationSeries;
      texts = trainstationSeries;
    }
    switch (type[0]){
      case "sailor":{
        //Указываю, какая серия будет запрошена по api
        series = serieses[0];
        text = texts[0];
        break;
      }
      case "girl":{
        series = serieses[1];
        text = texts[1];
        break;
      }
      case "woman":{
        series = serieses[2];
        text = texts[2];
        break;
      }
      case "zenit":{
        series = serieses[3];
        text = texts[3];
        break;
      }
      case "oldman":{
        series = serieses[4];
        text = texts[4];
        break;
      }
      case "granny":{
        series = serieses[5];
        text = texts[5];
        break;
      }
    }
    getCoupons(series,text,fish,this.messageWrap);
  }
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

async function initializeToken() {
    token = await getToken();
}

async function getToken() {
    const apiUrl = '../pages/index.php?action=getToken'; 

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Ошибка при получении токена');
        }

        const data = await response.json();
        console.log(data.token);
        return data.token; 
    } catch (error) {
        console.error('Произошла ошибка:', error);
        return null;
    }
}

async function getCoupons(series, text, fish, messageWrap) {
    const apiUrl = '../pages/index.php?action=getCoupons'; 
    
    console.log('Authorization:', `Bearer ${token}`);  // Вывод заголовка в консоль

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                'series': series,
                'pageSize': 0,
                'page': 0,
                'organizationId': orgID,
            }),
            cache: 'no-cache',
        });

        if (!response.ok) {
            throw new Error('Ошибка при получении списка купонов');
        }

        const coupons = await response.json();

        let nums = coupons.notActivatedCoupon.map(coupon => coupon.number);
        let num = nums[Math.floor(Math.random() * nums.length)];

        messageWrap.innerHTML += `<div class="text">Поздравляем! Твой приз: ${text}!</div>`;
        messageWrap.innerHTML += `<div class="nums">${num}</div>`;

        fish[0].classList += " win";

        setCookie('coupon',num,1);
        messageWrap.show();
    } catch (error) {
        console.error('Произошла ошибка:', error);
        return null;
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