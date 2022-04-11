import interact from "https://cdn.interactjs.io/v1.10.11/interactjs/index.js";

import { log, iOS, isInstalledAsPWA, beep } from "./zutils.js";

import { Button, hideUI, showUI, toggleUI, Text, NewLine } from "./jsui.js";

log("main.js started");

/////////////////////////////////////////////////////////////////
//                                                            //
// WEBSOCKET CLIENT
//

let nbDiodeStateReceived = 0;
let nbClientConnected = 0;
let softwareVersion = "0.2b+";

setInterval(function () {
  if (nbDiodeStateReceived < 2) {
    // red pixel
    let msg = {
      px: 20,
      py: 20,
      dx: 1,
      dy: 1,
      fillStyle: "red",
    };
    setPixel(msg);
  }
  nbDiodeStateReceived = 0;
}, 3000);

let ws = undefined;

function connect() {
  // INIT
  ws = new WebSocket("wss://eko-server69-dev.glitch.me");

  // OPEN
  ws.onopen = function () {
    console.log("connection established");
    let msg = {
      px: 0,
      py: 0,
    };
    ws.send(JSON.stringify(msg));
  };

  // MESSAGE
  ws.onmessage = function (e) {
    let msg = JSON.parse(event.data);
    if (msg.clear == "1") {
      console.log("clearing");
      clearCanvas();
      return;
    }
    if (!msg.diodeState) {
      pixelBuffer.push({
        x: msg.px,
        y: msg.py,
        w: pixelSize,
        h: pixelSize,
        fillStyle: msg.fillStyle,
      });
    } else {
      nbDiodeStateReceived += 1;
      //beep()
    }
    setPixel(msg);
    //beep()
  };

  // CLOSE
  ws.onclose = function (e) {
    console.log("connection closed");
    // red pixel
    let msg = {
      px: 20,
      py: 20,
      dx: 1,
      dy: 1,
      fillStyle: "red",
    };
    setPixel(msg);
    setTimeout(function () {
      connect();
    }, 1000);
  };

  // ERROR
  ws.onerror = function (err) {
    // red pixel
    console.log("connection error");
    let msg = {
      px: 20,
      py: 20,
      dx: 1,
      dy: 1,
      fillStyle: "orange",
    };
    setPixel(msg);

    console.error("Socket encountered error: ", err.message, "Closing socket");
    ws.close();
  };
}

connect();
//
// WEBSOCKET CLIENT
//                                                            \\
///////////////////////////////////////////////////////////////\\

/////////////////////////////////////////////////////////////////
//                                                            //
// PIXEL DRAW
//
let pixelSize = 8;

let canvasHeight = undefined;
let canvasWidth = undefined;

// to store the pixel art
let pixelBuffer = [];

interact(".rainbow-pixel-canvas")
  //
  .draggable({
    max: Infinity,
    maxPerElement: Infinity,
    inertia: false,
    origin: "self",
    modifiers: [
      interact.modifiers.snap({
        // snap to the corners of a grid
        targets: [interact.snappers.grid({ x: pixelSize, y: pixelSize })],
      }),
    ],
    listeners: {
      ////////////////////////////////////////////
      // 'move' : draw colored squares on move
      move: function (event) {
        hideUI();
        var context = event.target.getContext("2d");
        // calculate the angle of the drag direction
        var dragAngle = (180 * Math.atan2(event.dx, event.dy)) / Math.PI;

        // set pixel color based on drag angle and speed
        let fillStyle =
          "hsl(" +
          dragAngle +
          ", 86%, " +
          (30 + Math.min(event.speed / 1000, 1) * 50) +
          "%)";
        let x = event.pageX;
        let y = event.pageY;
        let dx = event.dx;
        let dy = event.dy;
        let r = pixelSize / 2;

        // draw pixel
        drawPixel(context, x, y, dx, dy, r, fillStyle);

        // send msg
        if (isLandscapeOrientation()) {
          let msg = {
            px: x,
            py: y,
            dx: dx,
            dy: dy,
            fillStyle: fillStyle,
          };
          ws.send(JSON.stringify(msg));
        } else {
          let msg = {
            px: canvasHeight - y,
            py: x,
            dx: dx,
            dy: dy,
            fillStyle: fillStyle,
          };
          ws.send(JSON.stringify(msg));
        }
      }, // 'move'
    }, // 'listeners'
  }) // '.draggable'
  //
  // 'doubletap' : clear the canvas on doubletap
  .on("doubletap", function (event) {
    showUI();
  });

function isLandscapeOrientation() {
  if (window.matchMedia("(orientation: landscape)").matches) return true;
  else return false;
}

function resizeCanvases() {
  [].forEach.call(
    document.querySelectorAll(".rainbow-pixel-canvas"),
    function (canvas) {
      delete canvas.width;
      delete canvas.height;

      var rect = canvas.getBoundingClientRect();

      canvas.width = rect.width;
      canvas.height = rect.height;

      canvasWidth = canvas.width;
      canvasHeight = canvas.height;

      // redraw the pixel art
      let ctx = canvas.getContext("2d");
      let portrait = true;
      let orientation = "portrait";

      if (isLandscapeOrientation()) {
        portrait = false;
        orientation = "landscape";
      } else {
        portrait = true;
        orientation = "portrait";
      }

      pixelBuffer.forEach((item) => {
        if (portrait) {
          let x = item.x;
          let y = item.y;
          let cx = canvas.width / 2;
          let cy = canvas.height / 2;
          let xR = y;
          let yR = canvas.height - x;

          drawPixel(ctx, xR, yR, 1, 1, pixelSize / 2, item.fillStyle);
        } else {
          // ipad normal
          drawPixel(ctx, item.x, item.y, 1, 1, pixelSize / 2, item.fillStyle);
        }
      });
    }
  );
}


resizeCanvases();

function setPixel(msg) {
  let canvas = document.querySelectorAll(".rainbow-pixel-canvas")[0];
  //console.log("canvas = " + canvas[0])
  let context = canvas.getContext("2d");
  let fillStyle = msg.fillStyle;
  
  if (msg.diodeState) {
    drawPixel(
      context,
      22,
      10,
      msg.dx,
      msg.dy,
      pixelSize / 2,
      fillStyle
    );
    
    
    if (msg.fillStyle == 'green' )
      fillStyle = 'blue'
    
    for (let i=1;i<10;i++) {
      drawPixel(
        context,
        22 + 10*i,
        10,
        msg.dx,
        msg.dy,
        pixelSize / 2,
        'black'
      );
    }
    
    for (let i=1;i<msg.nbClientConnected;i++) {
      drawPixel(
        context,
        22 + 10*i,
        10,
        msg.dx,
        msg.dy,
        pixelSize / 2,
        fillStyle
      );
    }
    return
  } 
  
  
  if ( isLandscapeOrientation() ) 
    drawPixel(
      context,
      msg.px,
      msg.py,
      msg.dx,
      msg.dy,
      pixelSize / 2,
      fillStyle
    );
  else {
    drawPixel(
      context,
      msg.py,
      canvasHeight - msg.px,
      msg.dx,
      msg.dy,
      pixelSize / 2,
      fillStyle
    );
  }
}

function clearCanvas() {
  let canvas = document.querySelectorAll(".rainbow-pixel-canvas")[0];
  //console.log("canvas = " + canvas[0])
  let context = canvas.getContext("2d");
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  pixelBuffer = [];
}

function sayHello(msg) {
  console.log("hello from :" + msg);
}

function drawPixel(
  context,
  x,
  y,
  dx = 1,
  dy = 1,
  r = pixelSize,
  fillStyle = "red"
) {
  if (x == 0 && y == 0) return;

  context.fillStyle = fillStyle;
  let speed = Math.sqrt(dx * dx + dy * dy);
  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI, false);
  context.fill();
}

// interact.js can also add DOM event listeners
/*interact(document).on('DOMContentLoaded', resizeCanvases);*/
interact(window).on("resize", resizeCanvases);
//
// PIXEL DRAW
//                                                            \\
///////////////////////////////////////////////////////////////\\

/////////////////////////////////////////////////////////////////
//                                                            //
// UI
//
window.onload = function () {
  NewLine();

  Text("pixel69 " + softwareVersion)
    .fontSize(20)
    .padding(0)
    .borderWidth(0)
    .padding(0)
    .fontWeight(600);

  Text("👆double-tap pour ré-afficher ce menu")
    .fontSize(16)
    .padding(0)
    .borderWidth(0)
    .padding(0)
    .fontWeight(300);

  if (iOS() && !isInstalledAsPWA())
    Text(
      "🚹installez pixel69 sur l'écran d'accueil via le bouton de partage [^] puis 'Sur l'écran d'accueil [+]'"
    )
      .fontSize(16)
      .padding(0)
      .borderWidth(0)
      .padding(0)
      .fontWeight(300);

  if (iOS() && !isInstalledAsPWA())
    Text(
      "❎ fermer tous les onglets puis tourner le téléphone en mode paysage pour passer en plein écran"
    )
      .fontSize(16)
      .padding(0)
      .borderWidth(0)
      .padding(0)
      .fontWeight(300);

  NewLine();

  Button("effacer le dessin<br>❌")
    .isHidden(false)
    .fontSize(16)
    .padding(20, 10)
    .fontWeight(300)
    .onClick((event) => {
      clearCanvas();
      //beep()
      let msg = {
        clear: 1,
      };
      ws.send(JSON.stringify(msg));
      hideUI();
    });

  Button("continuer le dessin<br>👉")
    .isHidden(false)
    .fontSize(16)
    .padding(20, 10)
    .fontWeight(300)
    .onClick((event) => {
      hideUI();
    });

  if (!iOS())
    Button("utiliser tout l'écran<br>📺")
      .fontSize(14)
      .padding(20, 10)
      .fontWeight(300)
      .isHidden(false)
      .onClick(function () {
        document.documentElement.webkitRequestFullScreen();
        hideUI();
      });
};

//
// UI
//                                                            \\
///////////////////////////////////////////////////////////////\\
