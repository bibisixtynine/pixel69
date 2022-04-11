export {showUI, hideUI, Text, Button, toggleUI,NewLine}


/////////////////////////////////////////////////////////////////
//                                                            //
// UI
//

document.getElementById("ui").addEventListener('click', function() {
  hideUI()
});

function toggleUI() {
  let ui = document.getElementById("ui");
  if (ui.style.display === "table-cell") {
    ui.style.display = "none";
  } else {
    ui.style.display = "table-cell";
  }
}

function hideUI() {
  let ui = document.getElementById("ui");
  ui.style.display = "none";
}

function showUI() {
  let ui = document.getElementById("ui");
  ui.style.display = "table-cell";
}

function NewLine() {
  let element = document.createElement("br");
  let ui = document.getElementById("ui")
  ui.appendChild(element);
  return element
}

function Button(
  html,
  fct = function () {
    console.log("button clicked");
  }
) {
  let element = document.createElement("div");

  element.classList = "font box";
  element.innerHTML = html;
  element.addEventListener("mousedown", function () {
    console.log("clicked");
    this.backgroundColor("white");
    this.color("black");
    let self = this;
    setTimeout(function () {
      self.backgroundColor("black");
      self.color("white");
    }, 200);
  });

  
  element.style.backgroundColor = "black";
  element.style.border = "solid";
  element.style.borderWidth = "1px";
  element.style.borderRadius = "8px";
  element.style.borderColor = "white";
  element.style.color = "white";
  element.style.padding = "5px";
  element.style.fontSize = "42px";
  let ui = document.getElementById("ui")
  ui.appendChild(element);

  addStyleToElement(element);

  return element;
}

function Text(html) {
  let element = document.createElement("div");

  element.classList = "font box";
  element.innerHTML = html;
  element.style.backgroundColor = "black";
  element.style.border = "solid";
  element.style.borderWidth = "1px";
  element.style.borderRadius = "8px";
  element.style.borderColor = "white";
  element.style.color = "white";
  element.style.padding = "5px";
  element.style.fontSize = "42px";
  let ui = document.getElementById("ui")
  ui.appendChild(element);

  addStyleToElement(element);

  return element;
}

function addStyleToElement(element) {
  
  element.color = function (color = "white") {
    this.style.color = color;
    return this;
  };
  
  element.borderWidth = function (width = 2) {
    if (width > 0) {
      this.style.borderStyle = "solid";
      this.style.borderWidth = width + "px";
    } else {
      this.style.borderStyle = "none";
    }
    return this;
  };

  element.borderColor = function (color = "white") {
    this.style.borderStyle = "solid";
    this.style.borderColor = color;
    return this;
  };

  element.position = function (x, y) {
    this.style.position = 'absolute'

    this.style.top = y + "px";
    this.style.left = x + "px";
    return this;
  };

  element.padding = function (
    left = 5,
    top = left,
    right = left,
    bottom = top
  ) {
    this.style.paddingLeft = left + "px";
    this.style.paddingTop = top + "px";
    this.style.paddingRight = right + "px";
    this.style.paddingBottom = bottom + "px";
    return this;
  };

  element.backgroundColor = function (color = "blue") {
    this.style.backgroundColor = color;
    return this;
  };

  element.cornerRadius = function (radius = 8) {
    this.style.borderRadius = radius + "px";
    return this;
  };

  element.onClick = function (fct) {
    this.addEventListener("click", fct);
    return this;
  };

  element.onHover = function (fct) {
    this.addEventListener("mouseover", fct);
    return this;
  };

  element.fontFamily = function (font) {
    this.style.fontFamily = font;
    return this;
  };

  element.fontSize = function (size) {
    this.style.fontSize = size + "px";
    return this;
  };

  element.fontWeight = function (weight) {
    this.style.fontWeight = weight;
    return this;
  };
  
  element.isHidden = function (hidden) {
    if (hidden)
      this.style.display = 'none'
    else
      this.style.display = 'inline-block'
    return this;
  };
}


