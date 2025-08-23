let atomicInput, addButton, removeButton, resetButton, guideButton, toggleOrbitButton, symbolSpan;
let controlPanel, inputRow, toggleRow, addRow, removeRow, resetRow, guideRow, infoPanel;
let guidePopup, overlay;
let topLabel, bottomLabel;

let atomicNumber = 0;
let electronCount = 0;
let shells = [];
let myFont;
let isOrbiting = true;
let rotateElectrons = true; // electron rotation flag
let rotationOffset = 0;     // cumulative rotation update for electrons
let systemOffset;           // vector offset (không được cập nhật nữa)
let cam;

const periodicTable = {
  1: "H", 2: "He", 3: "Li", 4: "Be", 5: "B", 6: "C", 7: "N", 8: "O", 9: "F", 10: "Ne",
  11: "Na", 12: "Mg", 13: "Al", 14: "Si", 15: "P", 16: "S", 17: "Cl", 18: "Ar",
  19: "K", 20: "Ca", 21: "Sc", 22: "Ti", 23: "V", 24: "Cr", 25: "Mn", 26: "Fe", 27: "Co", 28: "Ni", 29: "Cu", 30: "Zn",
  31: "Ga", 32: "Ge", 33: "As", 34: "Se", 35: "Br", 36: "Kr",
  37: "Rb", 38: "Sr", 39: "Y", 40: "Zr", 41: "Nb", 42: "Mo", 43: "Tc", 44: "Ru", 45: "Rh", 46: "Pd", 47: "Ag", 48: "Cd",
  49: "In", 50: "Sn", 51: "Sb", 52: "Te", 53: "I", 54: "Xe",
  55: "Cs", 56: "Ba", 57: "La", 58: "Ce", 59: "Pr", 60: "Nd", 61: "Pm", 62: "Sm", 63: "Eu", 64: "Gd", 65: "Tb", 66: "Dy", 67: "Ho", 68: "Er", 69: "Tm", 70: "Yb", 71: "Lu",
  72: "Hf", 73: "Ta", 74: "W", 75: "Re", 76: "Os", 77: "Ir", 78: "Pt", 79: "Au", 80: "Hg",
  81: "Tl", 82: "Pb", 83: "Bi", 84: "Po", 85: "At", 86: "Rn",
  87: "Fr", 88: "Ra", 89: "Ac", 90: "Th", 91: "Pa", 92: "U", 93: "Np", 94: "Pu", 95: "Am", 96: "Cm", 97: "Bk", 98: "Cf", 99: "Es", 100: "Fm", 101: "Md", 102: "No", 103: "Lr",
  104: "Rf", 105: "Db", 106: "Sg", 107: "Bh", 108: "Hs", 109: "Mt", 110: "Ds", 111: "Rg", 112: "Cn", 113: "Nh", 114: "Fl", 115: "Mc", 116: "Lv", 117: "Ts", 118: "Og"
};

const specialConfigurations = {
  24: [2, 8, 13, 1],
  29: [2, 8, 18, 1],
  41: [2, 8, 18, 12, 1],
  42: [2, 8, 18, 13, 1],
  44: [2, 8, 18, 15, 1],
  45: [2, 8, 18, 16, 1],
  46: [2, 8, 18, 18],
  47: [2, 8, 18, 18, 1],
  78: [2, 8, 18, 32, 17, 1],
  79: [2, 8, 18, 32, 18, 1],
};

function preload() {
  myFont = loadFont('Arial.ttf'); // change to your font if needed
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(myFont);
  smooth();
  
  systemOffset = createVector(0, 0);
  cam = createCamera();
  cam.setPosition(0, 0, 800);
  
  // Create top label (centered horizontally)
  topLabel = createDiv("MÔ PHỎNG HÌNH THÀNH ION");
  topLabel.style("position", "fixed");
  topLabel.style("top", "0");
  topLabel.style("width", "100%");
  topLabel.style("text-align", "center");
  topLabel.style("color", "#fff");
  topLabel.style("font-size", "24px");
  topLabel.style("padding", "10px 0");
  
  // Create bottom label (centered horizontally)
  bottomLabel = createDiv("© HÓA HỌC ABC");
  bottomLabel.style("position", "fixed");
  bottomLabel.style("bottom", "0");
  bottomLabel.style("width", "100%");
  bottomLabel.style("text-align", "center");
  bottomLabel.style("color", "#fff");
  bottomLabel.style("font-size", "18px");
  bottomLabel.style("padding", "10px 0");
  
  // Create control panel container.
  controlPanel = createDiv();
  controlPanel.style("position", "absolute");
  controlPanel.style("top", "20px");
  controlPanel.style("left", "20px");
  controlPanel.style("background", "rgba(30, 30, 30, 0.8)");
  controlPanel.style("padding", "8px");
  controlPanel.style("border-radius", "4px");
  controlPanel.style("color", "#fff");
  controlPanel.style("font-family", "Arial, sans-serif");
  controlPanel.style("font-size", "14px");
  controlPanel.style("display", "flex");
  controlPanel.style("flex-direction", "column");
  controlPanel.style("gap", "6px");
  
  // Row 1: Atomic number input and element symbol.
  inputRow = createDiv();
  inputRow.parent(controlPanel);
  inputRow.style("display", "flex");
  inputRow.style("align-items", "center");
  inputRow.style("gap", "6px");
  
  atomicInput = createInput('');
  atomicInput.parent(inputRow);
  atomicInput.attribute('placeholder', 'Số hiệu Z');
  atomicInput.style("font-size", "14px");
  atomicInput.style("padding", "4px");
  atomicInput.style("width", "80px");
  atomicInput.style("text-align", "center");
  atomicInput.input(setAtomicNumber);
  
  symbolSpan = createSpan("");
  symbolSpan.parent(inputRow);
  symbolSpan.style("font-size", "16px");
  symbolSpan.style("color", "#FFD700");
  symbolSpan.style("font-weight", "bold");
  
  // Row 2: Toggle button for electron rotation.
  toggleRow = createDiv();
  toggleRow.parent(controlPanel);
  toggleRow.style("display", "flex");
  toggleRow.style("align-items", "center");
  
  toggleOrbitButton = createButton('');
  toggleOrbitButton.parent(toggleRow);
  toggleOrbitButton.style("font-size", "14px");
  toggleOrbitButton.style("padding", "4px 8px");
  toggleOrbitButton.style("width", "140px");
  toggleOrbitButton.style("white-space", "nowrap");
  toggleOrbitButton.style("background-color", "#2196F3");
  toggleOrbitButton.style("color", "#fff");
  toggleOrbitButton.style("border", "none");
  toggleOrbitButton.style("border-radius", "4px");
  // Add hover effects for the toggle button
  toggleOrbitButton.mouseOver(() => toggleOrbitButton.style("background-color", "#1976D2"));
  toggleOrbitButton.mouseOut(() => toggleOrbitButton.style("background-color", "#2196F3"));
  toggleOrbitButton.mousePressed(() => {
    rotateElectrons = !rotateElectrons;
    toggleOrbitButton.html(rotateElectrons ? "Tắt quay electron" : "Bật quay electron");
  });
  toggleOrbitButton.html("Tắt quay electron");
  
  // Row 3: Add electron button.
  addRow = createDiv();
  addRow.parent(controlPanel);
  addRow.style("display", "flex");
  addRow.style("align-items", "center");
  
  addButton = createButton('Thêm electron');
  addButton.parent(addRow);
  styleButton(addButton);
  addButton.mousePressed(addElectron);
  
  // Row 4: Remove electron button.
  removeRow = createDiv();
  removeRow.parent(controlPanel);
  removeRow.style("display", "flex");
  removeRow.style("align-items", "center");
  
  removeButton = createButton('Bớt electron');
  removeButton.parent(removeRow);
  styleButton(removeButton);
  removeButton.mousePressed(removeElectron);
  
  // Row 5: Reset button.
  resetRow = createDiv();
  resetRow.parent(controlPanel);
  resetRow.style("display", "flex");
  resetRow.style("align-items", "center");
  
  resetButton = createButton('Reset');
  resetButton.parent(resetRow);
  styleButton(resetButton);
  resetButton.mousePressed(resetSystem);
  
  // Row 6: Guide button.
  guideRow = createDiv();
  guideRow.parent(controlPanel);
  guideRow.style("display", "flex");
  guideRow.style("align-items", "center");
  
  guideButton = createButton('Hướng dẫn');
  guideButton.parent(guideRow);
  guideButton.style("font-size", "14px");
  guideButton.style("padding", "4px 8px");
  guideButton.style("width", "140px");
  guideButton.style("white-space", "nowrap");
  guideButton.style("background", "none");
  guideButton.style("border", "1px solid white");
  guideButton.style("color", "#2196F3");
  guideButton.mouseOver(() => guideButton.style("color", "#1976D2"));
  guideButton.mouseOut(() => guideButton.style("color", "#2196F3"));
  guideButton.mousePressed(openGuide);
  
  // Info panel at bottom-left.
  infoPanel = createDiv();
  infoPanel.parent(document.body);
  infoPanel.style("position", "absolute");
  infoPanel.style("bottom", "20px");
  infoPanel.style("left", "20px");
  infoPanel.style("background", "none");
  infoPanel.style("padding", "8px");
  infoPanel.style("border-radius", "4px");
  infoPanel.style("color", "#fff");
  infoPanel.style("font-family", "Arial, sans-serif");
  infoPanel.style("font-size", "14px");
  infoPanel.style("line-height", "1.5");
  
  // Overlay for the guide popup.
  overlay = createDiv('');
  overlay.style('position', 'fixed');
  overlay.style('top', '0');
  overlay.style('left', '0');
  overlay.style('width', '100%');
  overlay.style('height', '100%');
  overlay.style('background', 'rgba(0, 0, 0, 0.7)');
  overlay.style('display', 'none');
  overlay.style('z-index', '999');
  
  // Guide popup.
  guidePopup = createDiv('');
  guidePopup.style('position', 'fixed');
  guidePopup.style('top', '50%');
  guidePopup.style('left', '50%');
  guidePopup.style('transform', 'translate(-50%, -50%)');
  guidePopup.style('background', '#2c2c2c');
  guidePopup.style('color', '#fff');
  guidePopup.style('padding', '12px');
  guidePopup.style('border-radius', '4px');
  guidePopup.style('box-shadow', '0 5px 15px rgba(0,0,0,0.5)');
  guidePopup.style('width', 'clamp(300px, 80vw, 450px)');
  guidePopup.style('font-family', 'Arial, sans-serif');
  guidePopup.style('line-height', '1.6');
  guidePopup.style('display', 'none');
  guidePopup.style('z-index', '1000');
  guidePopup.style('flex-direction', 'column');
  
  let popupTitle = createElement('h2', 'Hướng dẫn sử dụng');
  popupTitle.parent(guidePopup);
  popupTitle.style('margin-top', '0');
  popupTitle.style('color', '#2196F3');
  
  let guideContent = `
      <ul>
          <li><b>Số hiệu Z:</b> Nhập số hiệu nguyên tử để hiển thị mô hình.</li>
          <li><b>Thêm/Bớt electron:</b> Điều chỉnh số electron để tạo ion. Khi bớt electron, sẽ bớt từ lớp ngoài cùng.</li>
          <li><b>Tương tác:</b> Dùng chuột trái để xoay và con lăn để thu phóng.</li>
          <li><b>Bật/Tắt quay electron:</b> Khi chuyển trạng thái, góc quay không thay đổi đột ngột, giúp tránh cảm giác giật.</li>
      </ul>
  `;
  let guideText = createDiv(guideContent);
  guideText.parent(guidePopup);
  guideText.style('font-size', '14px');
  
  let closeButton = createButton('Đã hiểu');
  closeButton.parent(guidePopup);
  styleButton(closeButton);
  closeButton.style('margin-top', '12px');
  closeButton.style('align-self', 'center');
  closeButton.mousePressed(closeGuide);
  
  overlay.mousePressed(closeGuide);
}

function isMouseOverUI() {
  if (guidePopup.style('display') !== 'none') return true;
  let rectControl = controlPanel.elt.getBoundingClientRect();
  let rectInfo = infoPanel.elt.getBoundingClientRect();
  let overControl = (
    mouseX >= rectControl.left &&
    mouseX <= rectControl.right &&
    mouseY >= rectControl.top &&
    mouseY <= rectControl.bottom
  );
  let overInfo = (
    mouseX >= rectInfo.left &&
    mouseX <= rectInfo.right &&
    mouseY >= rectInfo.top &&
    mouseY <= rectInfo.bottom
  );
  return overControl || overInfo;
}

// Disable system movement via Ctrl+left mouse by removing update.
// function mouseDragged() {} – No need to update systemOffset.
function mouseDragged() {
  // System movement disabled.
}

function draw() {
  background(0);
  
  // Set up lights.
  ambientLight(60);
  directionalLight(230, 230, 230, 0, 0, -1);
  directionalLight(80, 80, 80, 1, 0, 0);
  directionalLight(120, 120, 120, 0, -1, 0);
  
  let uiWidth = controlPanel.elt.offsetWidth + 20;
  let nucleusX = - (width / 2) + (width - uiWidth) / 2 + uiWidth;
  
  // Use orbitControl if not over UI.
  if (!isMouseOverUI() && isOrbiting) {
    orbitControl(2, 2, 0.5);
  }
  
  // Move the camera target based on systemOffset (which is always 0 now)
  cam.lookAt(nucleusX + systemOffset.x, systemOffset.y, 0);
  
  push();
  // Translate entire system using systemOffset.
  translate(nucleusX + systemOffset.x, systemOffset.y, 0);
  
  // Draw the nucleus.
  push();
  fill(255, 100, 100);
  noStroke();
  sphere(20);
  push();
  translate(0, 0, 21);
  fill(255);
  textSize(12);
  textAlign(CENTER, CENTER);
  text("+" + atomicNumber, 0, 0);
  pop();
  pop();
  
  // Draw electron information (if available).
  if (shells.length > 0) {
    let outerRadius = 40 + (shells.length - 1) * 30;
    let netCharge = atomicNumber - electronCount;
    let chargeStr = formatCharge(netCharge);
    let angle = -PI / 4;
    let labelX = (outerRadius + 20) * cos(angle);
    let labelY = (outerRadius + 20) * sin(angle) - 20;
    
    push();
    noLights();
    drawingContext.disable(drawingContext.DEPTH_TEST);
    translate(labelX, labelY, 0);
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(chargeStr, 0, 0);
    drawingContext.enable(drawingContext.DEPTH_TEST);
    pop();
  }
  
  if (rotateElectrons) {
    rotationOffset += 0.02;
  }
  
  // Draw electron orbits and electrons.
  for (let i = 0; i < shells.length; i++) {
    let radius = 40 + i * 30;
    push();
    noFill();
    stroke(255);
    strokeWeight(1.0);
    drawOrbitCircle(radius);
    pop();
    
    let electronsInThisShell = shells[i];
    for (let j = 0; j < electronsInThisShell; j++) {
      let baseAngle = j * TWO_PI / electronsInThisShell;
      let angle = baseAngle + rotationOffset;
      let x = radius * cos(angle);
      let y = radius * sin(angle);
      
      push();
      translate(x, y, 0);
      fill(0, 180, 255);
      noStroke();
      sphere(6);
      push();
      translate(0, -2, 7);
      fill(255);
      textSize(18);
      textAlign(CENTER, CENTER);
      text("-", 0, 0);
      pop();
      pop();
    }
  }
  pop();
  
  updateInfoPanel();
}

function drawOrbitCircle(radius) {
  beginShape();
  const segments = 360;
  for (let i = 0; i < segments; i++) {
    let theta = map(i, 0, segments, 0, TWO_PI);
    let cx = radius * cos(theta);
    let cy = radius * sin(theta);
    vertex(cx, cy);
  }
  endShape(CLOSE);
}

function setAtomicNumber() {
  let val = parseInt(atomicInput.value());
  if (!isNaN(val) && val > 0 && val <= 118) {
    atomicNumber = val;
    electronCount = val;
    shells = calculateShells(electronCount);
    symbolSpan.html(periodicTable[val] ? periodicTable[val] : "");
    cam.setPosition(0, 0, 800);
  } else {
    atomicNumber = 0;
    electronCount = 0;
    shells = [];
    atomicInput.value('');
    symbolSpan.html("");
    cam.setPosition(0, 0, 800);
  }
}

function calculateShells(n) {
  if (n === atomicNumber && specialConfigurations[n]) {
    return specialConfigurations[n];
  }
  let remaining = n;
  let shellsArray = [];
  const aufbauOrder = [
    { capacity: 2, shell: 1 },
    { capacity: 2, shell: 2 },
    { capacity: 6, shell: 2 },
    { capacity: 2, shell: 3 },
    { capacity: 6, shell: 3 },
    { capacity: 2, shell: 4 },
    { capacity: 10, shell: 3 },
    { capacity: 6, shell: 4 },
    { capacity: 2, shell: 5 },
    { capacity: 10, shell: 4 },
    { capacity: 6, shell: 5 },
    { capacity: 2, shell: 6 },
    { capacity: 14, shell: 4 },
    { capacity: 10, shell: 5 },
    { capacity: 6, shell: 6 },
    { capacity: 2, shell: 7 },
    { capacity: 14, shell: 5 },
    { capacity: 10, shell: 6 },
    { capacity: 6, shell: 7 },
  ];
  for (let orbital of aufbauOrder) {
    if (remaining === 0) break;
    let toFill = min(remaining, orbital.capacity);
    let shellIndex = orbital.shell - 1;
    if (!shellsArray[shellIndex]) {
      shellsArray[shellIndex] = 0;
    }
    shellsArray[shellIndex] += toFill;
    remaining -= toFill;
  }
  while (shellsArray.length > 0 && shellsArray[shellsArray.length - 1] === 0) {
    shellsArray.pop();
  }
  return shellsArray;
}

function addElectron() {
  electronCount++;
  shells = calculateShells(electronCount);
}

function removeElectron() {
  if (electronCount > 0) {
    electronCount--;
    if (shells.length > 0) {
      shells[shells.length - 1]--;
      if (shells[shells.length - 1] === 0) {
        shells.pop();
      }
    }
  }
}

function resetSystem() {
  atomicNumber = 0;
  electronCount = 0;
  shells = [];
  atomicInput.value('');
  symbolSpan.html("");
  cam.setPosition(0, 0, 800);
}

function formatCharge(charge) {
  if (charge === 1) return "+";
  if (charge > 1) return charge + "+";
  if (charge === -1) return "-";
  if (charge < -1) return (-charge) + "-";
  return "0";
}

function updateInfoPanel() {
  let html = "";
  let nucleusCharge = atomicNumber > 0 ? ("+" + atomicNumber) : atomicNumber.toString();
  html += `<div><strong>Điện tích hạt nhân:</strong> ${nucleusCharge}</div>`;
  html += `<div><strong>Số electron:</strong> ${electronCount}</div>`;
  if (shells.length > 0) {
    html += `<div><strong>Phân bố electron:</strong> ${shells.join("/")}</div>`;
  }
  let netCharge = atomicNumber - electronCount;
  let chargeStr = formatCharge(netCharge);
  html += `<div><strong>Tổng điện tích:</strong> ${chargeStr}</div>`;
  infoPanel.html(html);
}

function openGuide() {
  isOrbiting = false;
  overlay.style('display', 'block');
  guidePopup.style('display', 'flex');
}

function closeGuide() {
  overlay.style('display', 'none');
  guidePopup.style('display', 'none');
  isOrbiting = true;
}

function styleButton(btn) {
  btn.style("font-size", "14px");
  btn.style("padding", "4px 8px");
  btn.style("width", "140px");
  btn.style("background-color", "#2196F3");
  btn.style("color", "#fff");
  btn.style("border", "none");
  btn.style("border-radius", "4px");
  btn.mouseOver(() => btn.style("background-color", "#1976D2"));
  btn.mouseOut(() => btn.style("background-color", "#2196F3"));
  btn.mousePressed(() => btn.style("background-color", "#1565C0"));
  btn.mouseReleased(() => btn.style("background-color", "#2196F3"));
}