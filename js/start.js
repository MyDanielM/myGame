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