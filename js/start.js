    window.addEventListener("orientationchange", function() {
        let elem = this.document.getElementsByClassName("orientation-vert");
        if (window.orientation === 90 || window.orientation === -90) {
          // Устройство находится в альбомной ориентации
          location.reload();
        } else {
          // Устройство находится в портретной ориентации
          location.reload();
        }
      });

let elem = this.document.getElementsByClassName("orientation-vert");

if (window.orientation === 0) {
    elem[0].style.visibility='visible';
}

let where = document.getElementsByClassName("place");
let start = document.getElementsByClassName("start");
function place(){
  const clickedElement = event.target;
  setCookie("place",clickedElement.className,1);
  where[0].style.display = "none";
  start[0].style.display = "block";
}


function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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