let atomicInput, addButton, removeButton, resetButton, guideButton, toggleOrbitButton, toggleOuterShellButton, symbolSpan;
let controlPanel, inputRow, toggleRow, addRow, removeRow, resetRow, guideRow, toggleOuterShellRow, infoPanel;
let guidePopup, overlay;
let topLabel, bottomLabel;
let atomicNumber = 0;
let electronCount = 0;
let shells = [];
let myFont;
let isOrbiting = true;
let rotateElectrons = true;
let showOuterShell = false;
let showFixedLight = true;
let rotationOffset = 0;
let systemOffset;
let cam;
let rotationAngle = 0;
let cnv; // canvas reference
let elementLabel;

// Lights: independent angles and speeds
let lightAngle1 = 0;
let lightAngle2 = 0;
let lightSpeed1 = 0.012;
let lightSpeed2 = 0.018;

// Choose plane: 'YZ' (original), 'XZ' (default here), or 'XY'
const LIGHT_ROTATION_PLANE = 'XZ';
const LIGHT_PLANE_TILT = Math.PI / 6; // 30 degrees tilt

const nobleGasZs = [2, 10, 18, 36, 54, 86, 118];

// ------------------ color generator (non-adjacent-like) ------------------
function lcg(seed) {
  const a = 1664525;
  const c = 1013904223;
  const m = 4294967296;
  seed = (a * seed + c) % m;
  return { value: seed / m, nextSeed: seed };
}

function getElementRGB(z) {
  if (!z || z <= 0) return { r: 200, g: 200, b: 200 };
  let seed = (z * 9301 + 49297) >>> 0;
  let s = lcg(seed); seed = s.nextSeed; let r1 = s.value;
  s = lcg(seed); seed = s.nextSeed; let r2 = s.value;
  s = lcg(seed); seed = s.nextSeed; let r3 = s.value;
  const hue = Math.floor(r1 * 360);
  const sat = 55 + Math.floor(r2 * 40);
  const bri = 65 + Math.floor(r3 * 30);
  colorMode(HSB, 360, 100, 100);
  let c = color(hue, sat, bri);
  colorMode(RGB, 255);
  return { r: Math.round(red(c)), g: Math.round(green(c)), b: Math.round(blue(c)) };
}

// ------------------ periodic & element data ------------------
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

const elementNames = {
  1: "Hydrogen", 2: "Helium", 3: "Lithium", 4: "Beryllium", 5: "Boron", 6: "Carbon",
  7: "Nitrogen", 8: "Oxygen", 9: "Fluorine", 10: "Neon", 11: "Sodium", 12: "Magnesium",
  13: "Aluminium", 14: "Silicon", 15: "Phosphorus", 16: "Sulfur", 17: "Chlorine", 18: "Argon",
  19: "Potassium", 20: "Calcium", 21: "Scandium", 22: "Titanium", 23: "Vanadium", 24: "Chromium",
  25: "Manganese", 26: "Iron", 27: "Cobalt", 28: "Nickel", 29: "Copper", 30: "Zinc",
  31: "Gallium", 32: "Germanium", 33: "Arsenic", 34: "Selenium", 35: "Bromine", 36: "Krypton",
  37: "Rubidium", 38: "Strontium", 39: "Yttrium", 40: "Zirconium", 41: "Niobium", 42: "Molybdenum",
  43: "Technetium", 44: "Ruthenium", 45: "Rhodium", 46: "Palladium", 47: "Silver", 48: "Cadmium",
  49: "Indium", 50: "Tin", 51: "Antimony", 52: "Tellurium", 53: "Iodine", 54: "Xenon",
  55: "Cesium", 56: "Barium", 57: "Lanthanum", 58: "Cerium", 59: "Praseodymium", 60: "Neodymium",
  61: "Promethium", 62: "Samarium", 63: "Europium", 64: "Gadolinium", 65: "Terbium", 66: "Dysprosium",
  67: "Holmium", 68: "Erbium", 69: "Thulium", 70: "Ytterbium", 71: "Lutetium", 72: "Hafnium",
  73: "Tantalum", 74: "Tungsten", 75: "Rhenium", 76: "Osmium", 77: "Iridium", 78: "Platinum",
  79: "Gold", 80: "Mercury", 81: "Thallium", 82: "Lead", 83: "Bismuth", 84: "Polonium",
  85: "Astatine", 86: "Radon", 87: "Francium", 88: "Radium", 89: "Actinium", 90: "Thorium",
  91: "Protactinium", 92: "Uranium", 93: "Neptunium", 94: "Plutonium", 95: "Americium", 96: "Curium",
  97: "Berkelium", 98: "Californium", 99: "Einsteinium", 100: "Fermium", 101: "Mendelevium", 102: "Nobelium",
  103: "Lawrencium", 104: "Rutherfordium", 105: "Dubnium", 106: "Seaborgium", 107: "Bohrium", 108: "Hassium",
  109: "Meitnerium", 110: "Darmstadtium", 111: "Roentgenium", 112: "Copernicium", 113: "Nihonium", 114: "Flerovium",
  115: "Moscovium", 116: "Livermorium", 117: "Tennessine", 118: "Oganesson"
};

const elementTypes = {
  1: 2, 2: 3, 3: 1, 4: 1, 5: 4, 6: 2, 7: 2, 8: 2, 9: 2, 10: 3,
  11: 1, 12: 1, 13: 1, 14: 4, 15: 2, 16: 2, 17: 2, 18: 3,
  19: 1, 20: 1, 21: 1, 22: 1, 23: 1, 24: 1, 25: 1, 26: 1, 27: 1, 28: 1, 29: 1, 30: 1,
  31: 1, 32: 4, 33: 4, 34: 2, 35: 2, 36: 3,
  37: 1, 38: 1, 39: 1, 40: 1, 41: 1, 42: 1, 43: 1, 44: 1, 45: 1, 46: 1, 47: 1, 48: 1,
  49: 1, 50: 1, 51: 4, 52: 4, 53: 2, 54: 3,
  55: 1, 56: 1, 57: 1, 58: 1, 59: 1, 60: 1, 61: 1, 62: 1, 63: 1, 64: 1, 65: 1, 66: 1, 67: 1, 68: 1, 69: 1, 70: 1, 71: 1,
  72: 1, 73: 1, 74: 1, 75: 1, 76: 1, 77: 1, 78: 1, 79: 1, 80: 1,
  81: 1, 82: 1, 83: 1, 84: 4, 85: 2, 86: 3,
  87: 1, 88: 1, 89: 1, 90: 1, 91: 1, 92: 1, 93: 1, 94: 1, 95: 1, 96: 1, 97: 1, 98: 1, 99: 1, 100: 1, 101: 1, 102: 1, 103: 1,
  104: 1, 105: 1, 106: 1, 107: 1, 108: 1, 109: 1, 110: 1, 111: 1, 112: 1, 113: 1, 114: 1, 115: 1, 116: 1, 117: 2, 118: 3
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
  79: [2, 8, 18, 32, 18, 1]
};

// ------------------ full electronConfigurations 1..118 ------------------
// Using common spectroscopic notation with unicode superscripts.
// For some superheavy elements entries are representative rather than definitive.
const electronConfigurations = {
  1: "1s¹",
  2: "1s²",
  3: "1s² 2s¹",
  4: "1s² 2s²",
  5: "1s² 2s² 2p¹",
  6: "1s² 2s² 2p²",
  7: "1s² 2s² 2p³",
  8: "1s² 2s² 2p⁴",
  9: "1s² 2s² 2p⁵",
  10: "1s² 2s² 2p⁶",
  11: "1s² 2s² 2p⁶ 3s¹",
  12: "1s² 2s² 2p⁶ 3s²",
  13: "1s² 2s² 2p⁶ 3s² 3p¹",
  14: "1s² 2s² 2p⁶ 3s² 3p²",
  15: "1s² 2s² 2p⁶ 3s² 3p³",
  16: "1s² 2s² 2p⁶ 3s² 3p⁴",
  17: "1s² 2s² 2p⁶ 3s² 3p⁵",
  18: "1s² 2s² 2p⁶ 3s² 3p⁶",
  19: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹",
  20: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s²",
  21: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹ 4s²",
  22: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d² 4s²",
  23: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d³ 4s²",
  24: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s¹",
  25: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s²",
  26: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²",
  27: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁷ 4s²",
  28: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁸ 4s²",
  29: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s¹",
  30: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s²",
  31: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p¹",
  32: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p²",
  33: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p³",
  34: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁴",
  35: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁵",
  36: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶",
  37: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 5s¹",
  38: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 5s²",
  39: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹ 5s²",
  40: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d² 5s²",
  41: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d⁴ 5s¹",
  42: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d⁵ 5s¹",
  43: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d⁵ 5s²",
  44: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d⁷ 5s¹",
  45: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s¹",
  46: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s²",
  47: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s¹",
  48: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s²",
  49: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s² 5p¹",
  50: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s² 5p²",
  51: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s² 5p³",
  52: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s² 5p⁴",
  53: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s² 5p⁵",
  54: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s² 5p⁶",
  55: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s² 5p⁶ 6s¹",
  56: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s² 5p⁶ 6s²",
  57: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s² 5p⁶ 5d¹ 6s²",
  58: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹ 5s² 5p⁶ 6s²",
  59: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f³ 5s² 5p⁶ 6s²",
  60: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f⁴ 5s² 5p⁶ 6s²",
  61: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f⁵ 5s² 5p⁶ 6s²",
  62: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f⁶ 5s² 5p⁶ 6s²",
  63: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f⁷ 5s² 5p⁶ 6s²",
  64: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f⁷ 5s² 5p⁶ 5d¹ 6s²",
  65: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f⁹ 5s² 5p⁶ 6s²",
  66: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁰ 5s² 5p⁶ 6s²",
  67: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹¹ 5s² 5p⁶ 6s²",
  68: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹² 5s² 5p⁶ 6s²",
  69: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹³ 5s² 5p⁶ 6s²",
  70: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 6s²",
  71: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹ 6s²",
  72: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d² 6s²",
  73: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d³ 6s²",
  74: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d⁴ 6s²",
  75: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d⁵ 6s²",
  76: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d⁶ 6s²",
  77: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s²",
  78: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d⁹ 6s¹",
  79: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s¹",
  80: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s²",
  81: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s² 6p¹",
  82: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s² 6p²",
  83: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s² 6p³",
  84: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s² 6p⁴",
  85: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s² 6p⁵",
  86: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s² 6p⁶",
  87: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s² 6p⁶ 7s¹",
  88: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s² 6p⁶ 7s²",
  89: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s² 6p⁶ 6d¹ 7s²",
  90: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s² 6p⁶ 6d² 7s²",
  91: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f² 6s² 7s²",
  92: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f³ 6s² 7s²",
  93: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f⁴ 6s² 7s²",
  94: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f⁶ 6s² 7s²",
  95: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f⁷ 6s² 7s²",
  96: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f⁷ 6d¹ 7s²",
  97: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f⁹ 6d¹ 7s²",
  98: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f¹⁰ 6d¹ 7s²",
  99: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f¹¹ 6d¹ 7s²",
 100: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f¹² 6d¹ 7s²",
 101: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f¹³ 6d¹ 7s²",
 102: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f¹⁴ 6d¹ 7s²",
 103: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f¹⁴ 6d¹ 7s² 7p¹",
 104: "6d² 7s² 7p¹ ...",
 105: "6d³ 7s² ...",
 106: "6d⁴ 7s² ...",
 107: "6d⁵ 7s² ...",
 108: "6d⁶ 7s² ...",
 109: "6d⁷ 7s² ...",
 110: "6d⁸ 7s² ...",
 111: "6d⁹ 7s² ...",
 112: "6d¹⁰ 7s² ...",
 113: "7s² 7p¹ ...",
 114: "7s² 7p² ...",
 115: "7s² 7p³ ...",
 116: "7s² 7p⁴ ...",
 117: "7s² 7p⁵ ...",
 118: "7s² 7p⁶ ..."
};

// --- Ion / UI helpers ---
const superscriptDigits = { '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹' };
const superscriptPlus = '⁺';
const superscriptMinus = '⁻';
function chargeToSuperscript(charge) {
  if (!charge) return '';
  let absc = Math.abs(charge);
  let sign = charge > 0 ? superscriptPlus : superscriptMinus;
  if (absc === 1) return sign;
  return String(absc).split('').map(d => superscriptDigits[d] || '').join('') + sign;
}
function getIonSymbol(sym, netCharge) { if (!sym) return ''; return sym + chargeToSuperscript(netCharge); }

// NEW: Produce HTML string using <sup> for ion charge (clearer than unicode-only)
function getIonSymbolHTML(sym, netCharge) {
  if (!sym) return '';
  if (!netCharge || netCharge === 0) return sym;
  const absc = Math.abs(netCharge);
  const sign = netCharge > 0 ? '+' : '-';
  const supInner = (absc === 1) ? sign : (absc + sign);
  return `${sym}<sup>${supInner}</sup>`;
}

const romanNumbers = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
function toRoman(n) { if (n > 0 && n < romanNumbers.length) return romanNumbers[n]; return n.toString(); }
function isTransitionLike(z) { return (z >= 21 && z <= 30) || (z >= 39 && z <= 48) || (z >= 57 && z <= 80); }

const anionNameMapByZ = {
  1: 'hydride', 5: 'boride', 6: 'carbide', 7: 'nitride', 8: 'oxide', 9: 'fluoride',
  14: 'silicide', 15: 'phosphide', 16: 'sulfide', 17: 'chloride', 34: 'selenide', 35: 'bromide', 52: 'telluride', 53: 'iodide'
};
const anionValidChargesByZ = {
  1: [-1], 5: [-3], 6: [-4, -2], 7: [-3], 8: [-2], 9: [-1],
  14: [-4], 15: [-3], 16: [-2], 17: [-1], 34: [-2], 35: [-1], 52: [-2], 53: [-1]
};
const cationValidChargesByZ = {
  1: [1], 3: [1], 11: [1], 19: [1], 37: [1], 55: [1],
  2: [2], 12: [2], 20: [2], 38: [2], 56: [2],
  13: [1,3], 31: [1,3], 50: [2],
  21: [3], 22: [2,3,4], 23: [2,3,4,5], 24: [2,3,6], 25: [2,3,4,7],
  26: [2,3], 27: [2,3], 28: [2,3], 29: [1,2], 30: [2],
  39: [3], 40: [2,3,4], 41: [3,5], 42: [2,3,4,6],
  47: [1], 79: [1,3]
};

function getIonName(z, netCharge) {
  if (!z) return "";
  if (netCharge === 0) return elementNames[z] || "";
  if (netCharge > 0) {
    const valid = cationValidChargesByZ[z];
    if (!valid || !valid.includes(netCharge)) return "";
    if (isTransitionLike(z)) return `${elementNames[z]}(${toRoman(netCharge)}) ion`;
    return `${elementNames[z]} ion`;
  } else {
    const anion = anionNameMapByZ[z];
    if (!anion) return "";
    const valid = anionValidChargesByZ[z] || [];
    if (!valid.includes(netCharge)) return "";
    return `${anion} ion`;
  }
}

// ------------------ p5 lifecycle & UI ------------------
function preload() {
  try { myFont = loadFont('Arial.ttf'); } catch (e) { myFont = null; }
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight, WEBGL);
  if (myFont) textFont(myFont);
  smooth();

  systemOffset = createVector(0, 0);
  cam = createCamera();
  cam.setPosition(0, 0, 800);

  topLabel = createDiv("MÔ PHỎNG HÌNH THÀNH ION");
  topLabel.style("position", "fixed"); topLabel.style("top", "0"); topLabel.style("width", "100%");
  topLabel.style("text-align", "center"); topLabel.style("color", "#fff"); topLabel.style("font-size", "24px");
  topLabel.style("padding", "10px 0");

  bottomLabel = createDiv("© HÓA HỌC ABC");
  bottomLabel.style("position", "fixed"); bottomLabel.style("bottom", "0"); bottomLabel.style("width", "100%");
  bottomLabel.style("text-align", "center"); bottomLabel.style("color", "#fff"); bottomLabel.style("font-size", "18px");
  bottomLabel.style("padding", "10px 0");

  controlPanel = createDiv();
  controlPanel.style("position", "absolute"); controlPanel.style("top", "20px"); controlPanel.style("left", "20px");
  controlPanel.style("background", "rgba(30, 30, 30, 0.9)"); controlPanel.style("padding", "8px");
  controlPanel.style("border-radius", "4px"); controlPanel.style("color", "#fff");
  controlPanel.style("font-family", "Arial, sans-serif"); controlPanel.style("font-size", "14px");
  controlPanel.style("display", "flex"); controlPanel.style("flex-direction", "column"); controlPanel.style("gap", "6px");

  inputRow = createDiv(); inputRow.parent(controlPanel);
  inputRow.style("display", "flex"); inputRow.style("align-items", "center"); inputRow.style("gap", "6px");

  atomicInput = createInput(''); atomicInput.parent(inputRow);
  atomicInput.attribute('placeholder', 'Số hiệu Z'); atomicInput.style("font-size", "14px");
  atomicInput.style("padding", "4px"); atomicInput.style("width", "80px"); atomicInput.style("text-align", "center");
  atomicInput.input(setAtomicNumber);

  symbolSpan = createSpan(""); symbolSpan.parent(inputRow);
  symbolSpan.style("font-size", "16px"); symbolSpan.style("color", "#FFD700"); symbolSpan.style("font-weight", "bold");

  toggleRow = createDiv(); toggleRow.parent(controlPanel); toggleRow.style("display","flex");

  toggleOrbitButton = createButton(''); toggleOrbitButton.parent(toggleRow);
  styleButton(toggleOrbitButton);
  toggleOrbitButton.html(rotateElectrons ? "Tắt quay electron" : "Bật quay electron");
  toggleOrbitButton.mousePressed(() => {
    rotateElectrons = !rotateElectrons;
    toggleOrbitButton.html(rotateElectrons ? "Tắt quay electron" : "Bật quay electron");
  });

  addRow = createDiv(); addRow.parent(controlPanel);
  addButton = createButton('Thêm electron'); addButton.parent(addRow); styleButton(addButton); addButton.mousePressed(addElectron);

  removeRow = createDiv(); removeRow.parent(controlPanel);
  removeButton = createButton('Bớt electron'); removeButton.parent(removeRow); styleButton(removeButton); removeButton.mousePressed(removeElectron);

  toggleOuterShellRow = createDiv(); toggleOuterShellRow.parent(controlPanel);
  toggleOuterShellButton = createButton('Bật lớp cầu'); toggleOuterShellButton.parent(toggleOuterShellRow);
  styleButton(toggleOuterShellButton); toggleOuterShellButton.mousePressed(toggleOuterShell);

  resetRow = createDiv(); resetRow.parent(controlPanel);
  resetButton = createButton('Reset'); resetButton.parent(resetRow); styleButton(resetButton); resetButton.mousePressed(resetSystem);

  guideRow = createDiv(); guideRow.parent(controlPanel);
  guideButton = createButton('Hướng dẫn'); guideButton.parent(guideRow);
  styleButton(guideButton); guideButton.style("background", "none"); guideButton.style("border", "1px solid white");
  guideButton.style("color", "#2196F3"); guideButton.mousePressed(openGuide);

  guideButton.mouseOver(() => {
    guideButton.style("background", "none");
    guideButton.style("color", "#2196F3");
    guideButton.style("border", "1px solid white");
  });
  guideButton.mouseOut(() => {
    guideButton.style("background", "none");
    guideButton.style("color", "#2196F3");
    guideButton.style("border", "1px solid white");
  });

  infoPanel = createDiv(); infoPanel.parent(document.body);
  infoPanel.style("position","absolute"); infoPanel.style("bottom","20px"); infoPanel.style("left","20px");
  infoPanel.style("background","none"); infoPanel.style("padding","8px"); infoPanel.style("border-radius","4px");
  infoPanel.style("color","#fff"); infoPanel.style("font-family","Arial, sans-serif"); infoPanel.style("font-size","16px");
  infoPanel.style("line-height","1.7");

  elementLabel = createDiv(''); // label to the right
  elementLabel.style('position','absolute'); elementLabel.style('background','rgba(0,0,0,0.0)');
  elementLabel.style('color','#fff'); elementLabel.style('font-family','Arial, sans-serif'); elementLabel.style('font-size','18px');
  elementLabel.style('font-weight','600'); elementLabel.style('pointer-events','none'); elementLabel.style('display','none');
  elementLabel.style('white-space','nowrap'); elementLabel.style('z-index','1001'); elementLabel.style('text-shadow','0 2px 6px rgba(0,0,0,0.6)');
  elementLabel.style('min-width','110px'); elementLabel.style('text-align','left'); elementLabel.style('padding','2px 6px');
  elementLabel.style('box-sizing','border-box');

  overlay = createDiv(''); overlay.style('position','fixed'); overlay.style('top','0'); overlay.style('left','0');
  overlay.style('width','100%'); overlay.style('height','100%'); overlay.style('background','rgba(0,0,0,0.7)');
  overlay.style('display','none'); overlay.style('z-index','999');

  guidePopup = createDiv(''); guidePopup.style('position','fixed'); guidePopup.style('top','50%'); guidePopup.style('left','50%');
  guidePopup.style('transform','translate(-50%,-50%)'); guidePopup.style('background','#2c2c2c'); guidePopup.style('color','#fff');
  guidePopup.style('padding','12px'); guidePopup.style('border-radius','4px'); guidePopup.style('box-shadow','0 5px 15px rgba(0,0,0,0.5)');
  guidePopup.style('width','clamp(300px, 80vw, 450px)'); guidePopup.style('font-family','Arial, sans-serif'); guidePopup.style('line-height','1.6');
  guidePopup.style('display','none'); guidePopup.style('z-index','1000'); guidePopup.style('flex-direction','column');

  let popupTitle = createElement('h2','Hướng dẫn sử dụng'); popupTitle.parent(guidePopup);
  popupTitle.style('margin-top','0'); popupTitle.style('color','#2196F3'); popupTitle.style('text-align','center');

  let guideContent = `
    <ul>
      <li><b>Số hiệu Z:</b> Nhập số hiệu nguyên tử (1..118) để hiển thị mô hình.</li>
      <li><b>Thêm/Bớt electron:</b> Điều chỉnh số electron để tạo ion.</li>
      <li><b>Tương tác:</b> Dùng chuột trái để xoay và con lăn để thu phóng.</li>
      <li><b>Ghi chú:</b> Nhãn bên phải: trung hòa -> "Ký hiệu (Tên)"; ion -> chỉ hiển thị ký hiệu ion (ví dụ Na<sup>+</sup>).</li>
    </ul>
  `;
  let guideText = createDiv(guideContent); guideText.parent(guidePopup); guideText.style('font-size','14px');

  let closeButton = createButton('Đã hiểu'); closeButton.parent(guidePopup); styleButton(closeButton);
  closeButton.style('margin-top','12px'); closeButton.style('align-self','center'); closeButton.mousePressed(closeGuide);

  overlay.mousePressed(closeGuide);

  resetStateAndBuildModel(0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function isMouseOverUI() {
  if (guidePopup.style('display') !== 'none') return true;
  let rectControl = controlPanel.elt.getBoundingClientRect();
  let rectInfo = infoPanel.elt.getBoundingClientRect();
  let overControl = (mouseX >= rectControl.left && mouseX <= rectControl.right && mouseY >= rectControl.top && mouseY <= rectControl.bottom);
  let overInfo = (mouseX >= rectInfo.left && mouseX <= rectInfo.right && mouseY >= rectInfo.top && mouseY <= rectInfo.bottom);
  return overControl || overInfo;
}

function mouseDragged() {}

// ------------------ Parsing helpers ------------------
function parseConfig(configStr) {
  const shellsArray = [];
  if (!configStr) return shellsArray;
  const orbitals = configStr.match(/(\d+)([spdf])(¹|²|³|⁴|⁵|⁶|⁷|⁸|⁹|¹⁰|¹¹|¹²|¹³|¹⁴|¹⁵|¹⁶|¹⁷|¹⁸|¹⁹|²⁰)?/g);
  if (!orbitals) return shellsArray;
  const superscriptMap = { '¹':1,'²':2,'³':3,'⁴':4,'⁵':5,'⁶':6,'⁷':7,'⁸':8,'⁹':9,'¹⁰':10,'¹¹':11,'¹²':12,'¹³':13,'¹⁴':14,'¹⁵':15,'¹⁶':16,'¹⁷':17,'¹⁸':18,'¹⁹':19,'²⁰':20 };
  for (let orbital of orbitals) {
    const n = parseInt(orbital.charAt(0));
    const superscript = orbital.substring(orbital.search(/[¹²³⁴⁵⁶⁷⁸⁹⁰]+/) || orbital.length);
    const electrons = superscriptMap[superscript] || parseInt(superscript) || 1;
    if (!shellsArray[n - 1]) shellsArray[n - 1] = 0;
    shellsArray[n - 1] += electrons;
  }
  while (shellsArray.length > 0 && (shellsArray[shellsArray.length - 1] === 0 || shellsArray[shellsArray.length - 1] === undefined)) shellsArray.pop();
  return shellsArray;
}

function parseOrbitalString(configStr) {
  const config = {};
  if (!configStr) return config;
  const orbitals = configStr.match(/(\d+)([spdf])(¹|²|³|⁴|⁵|⁶|⁷|⁸|⁹|¹⁰|¹¹|¹²|¹³|¹⁴|¹⁵|¹⁶|¹⁷|¹⁸|¹⁹|²⁰)?/g);
  if (!orbitals) return config;
  const superscriptMap = { '¹':1,'²':2,'³':3,'⁴':4,'⁵':5,'⁶':6,'⁷':7,'⁸':8,'⁹':9,'¹⁰':10,'¹¹':11,'¹²':12,'¹³':13,'¹⁴':14,'¹⁵':15,'¹⁶':16,'¹⁷':17,'¹⁸':18,'¹⁹':19,'²⁰':20 };
  for (let orbital of orbitals) {
    const n = parseInt(orbital.charAt(0));
    const subshell = orbital.charAt(1);
    const superscript = orbital.substring(orbital.search(/[¹²³⁴⁵⁶⁷⁸⁹⁰]+/) || orbital.length);
    const electrons = superscriptMap[superscript] || parseInt(superscript) || 1;
    if (!config[n]) config[n] = {};
    config[n][subshell] = electrons;
  }
  return config;
}

// ------------------ Shell calculation ------------------
function calculateShells(n) {
  if (n <= 0) return [];
  if (specialConfigurations[n]) return specialConfigurations[n];
  const shellsArray = [];
  const configStr = electronConfigurations[n];
  if (!configStr) return [];
  const parsed = parseOrbitalString(configStr);
  const levels = Object.keys(parsed).map(Number).sort((a,b) => a - b);
  for (let nLevel of levels) {
    let total = 0;
    for (let subshell in parsed[nLevel]) total += parsed[nLevel][subshell];
    shellsArray.push(total);
  }
  return shellsArray;
}

// ------------------ rebuildConfig (for changing electronCount) ------------------
function rebuildConfig(newElectronCount) {
  if (newElectronCount <= 0 || !electronConfigurations[atomicNumber]) return "";
  const superscriptMap = { '¹':1,'²':2,'³':3,'⁴':4,'⁵':5,'⁶':6,'⁷':7,'⁸':8,'⁹':9,'¹⁰':10,'¹¹':11,'¹²':12,'¹³':13,'¹⁴':14,'¹⁵':15,'¹⁶':16,'¹⁷':17,'¹⁸':18,'¹⁹':19,'²⁰':20 };
  const reversedSuperscriptMap = Object.fromEntries(Object.entries(superscriptMap).map(([k,v]) => [v,k]));
  let tempElectronCount = newElectronCount;
  let finalConfig = {};
  const aufbauOrder = ['1s','2s','2p','3s','3p','4s','3d','4p','5s','4d','5p','6s','4f','5d','6p','7s','5f','6d','7p'];
  const maxElectrons = { 's':2, 'p':6, 'd':10, 'f':14 };

  if (newElectronCount < atomicNumber) {
    const originalConfig = parseOrbitalString(electronConfigurations[atomicNumber]);
    let currentElectrons = atomicNumber;
    const newConfig = JSON.parse(JSON.stringify(originalConfig));
    const nOrder = Object.keys(newConfig).map(Number).sort((a,b)=>b-a);
    for (let n of nOrder) {
      const subshellOrder = ['f','d','p','s'];
      for (let subshell of subshellOrder) {
        if (newConfig[n] && newConfig[n][subshell]) {
          let count = newConfig[n][subshell];
          while (currentElectrons > newElectronCount && count > 0) { count--; currentElectrons--; }
          if (count > 0) newConfig[n][subshell] = count; else delete newConfig[n][subshell];
        }
      }
    }
    return formatConfigString(newConfig);
  }

  for (let orbital of aufbauOrder) {
    if (tempElectronCount <= 0) break;
    const n = parseInt(orbital.charAt(0));
    const subshell = orbital.charAt(1);
    const maxCapacity = maxElectrons[subshell];
    let electronsToFill = min(tempElectronCount, maxCapacity);

    if (atomicNumber === 24 && newElectronCount >= 24) {
      if (orbital === '4s' && tempElectronCount >= 1) { electronsToFill = 1; tempElectronCount -= 1; }
      if (orbital === '3d' && tempElectronCount >= 5) { electronsToFill = 5; tempElectronCount -= 5; }
    } else if (atomicNumber === 29 && newElectronCount >= 29) {
      if (orbital === '4s' && tempElectronCount >= 1) { electronsToFill = 1; tempElectronCount -= 1; }
      if (orbital === '3d' && tempElectronCount >= 10) { electronsToFill = 10; tempElectronCount -= 10; }
    } else {
      tempElectronCount -= electronsToFill;
    }

    if (!finalConfig[n]) finalConfig[n] = {};
    finalConfig[n][subshell] = electronsToFill;
  }

  return formatConfigString(finalConfig);
}

function formatConfigString(config) {
  const reversedSuperscriptMap = {1:'¹',2:'²',3:'³',4:'⁴',5:'⁵',6:'⁶',7:'⁷',8:'⁸',9:'⁹',10:'¹⁰',11:'¹¹',12:'¹²',13:'¹³',14:'¹⁴',15:'¹⁵',16:'¹⁶',17:'¹⁷',18:'¹⁸',19:'¹⁹',20:'²⁰'};
  const nOrder = Object.keys(config).map(Number).sort((a,b)=>a-b);
  const subshellOrder = ['s','p','d','f'];
  let result = [];
  for (let n of nOrder) {
    for (let subshell of subshellOrder) {
      if (config[n][subshell]) result.push(`${n}${subshell}${reversedSuperscriptMap[config[n][subshell]]}`);
    }
  }
  return result.join(' ');
}

// ------------------ helpers for rendering electron config with <sup> ------------------
function renderElectronConfigHTML(configStr) {
  if (!configStr) return "";
  const supMap = { '⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9' };
  let out = "";
  let pendingSup = "";
  for (let i = 0; i < configStr.length; i++) {
    const ch = configStr[i];
    if (supMap[ch] !== undefined) {
      pendingSup += supMap[ch];
    } else {
      if (pendingSup.length > 0) { out += `<sup>${pendingSup}</sup>`; pendingSup = ""; }
      if (ch === '&') out += '&amp;';
      else if (ch === '<') out += '&lt;';
      else if (ch === '>') out += '&gt;';
      else out += ch;
    }
  }
  if (pendingSup.length > 0) out += `<sup>${pendingSup}</sup>`;
  return out;
}

// ------------------ drawing / UI ------------------
function draw() {
  background(0);
  rotationAngle += 0.01;

  // advance light angles
  lightAngle1 += lightSpeed1;
  lightAngle2 += lightSpeed2;

  let radiusLight = 300;
  let baseX1 = 0, baseY1 = 0, baseZ1 = 0;
  let baseX2 = 0, baseY2 = 0, baseZ2 = 0;

  if (LIGHT_ROTATION_PLANE === 'YZ') {
    baseY1 = cos(lightAngle1) * radiusLight; baseZ1 = sin(lightAngle1) * radiusLight;
    baseY2 = cos(lightAngle2 + Math.PI) * radiusLight; baseZ2 = sin(lightAngle2 + Math.PI) * radiusLight;
    let cosT = cos(LIGHT_PLANE_TILT), sinT = sin(LIGHT_PLANE_TILT);
    let ly1 = baseY1 * cosT - baseZ1 * sinT, lz1 = baseY1 * sinT + baseZ1 * cosT;
    let ly2 = baseY2 * cosT - baseZ2 * sinT, lz2 = baseY2 * sinT + baseZ2 * cosT;
    baseY1 = ly1; baseZ1 = lz1; baseY2 = ly2; baseZ2 = lz2;
  } else if (LIGHT_ROTATION_PLANE === 'XZ') {
    baseX1 = cos(lightAngle1) * radiusLight; baseZ1 = sin(lightAngle1) * radiusLight;
    baseX2 = cos(lightAngle2 + Math.PI) * radiusLight; baseZ2 = sin(lightAngle2 + Math.PI) * radiusLight;
    let cosT = cos(LIGHT_PLANE_TILT), sinT = sin(LIGHT_PLANE_TILT);
    let lx1 = baseX1 * cosT + baseZ1 * sinT, lz1 = -baseX1 * sinT + baseZ1 * cosT;
    let lx2 = baseX2 * cosT + baseZ2 * sinT, lz2 = -baseX2 * sinT + baseZ2 * cosT;
    baseX1 = lx1; baseZ1 = lz1; baseX2 = lx2; baseZ2 = lz2;
  } else { // 'XY'
    baseX1 = cos(lightAngle1) * radiusLight; baseY1 = sin(lightAngle1) * radiusLight;
    baseX2 = cos(lightAngle2 + Math.PI) * radiusLight; baseY2 = sin(lightAngle2 + Math.PI) * radiusLight;
    let cosT = cos(LIGHT_PLANE_TILT), sinT = sin(LIGHT_PLANE_TILT);
    let lx1 = baseX1 * cosT - baseY1 * sinT, ly1 = baseX1 * sinT + baseY1 * cosT;
    let lx2 = baseX2 * cosT - baseY2 * sinT, ly2 = baseX2 * sinT + baseY2 * cosT;
    baseX1 = lx1; baseY1 = ly1; baseX2 = lx2; baseY2 = ly2;
  }

  ambientLight(80);
  directionalLight(255, 240, 230, baseX1, baseY1, baseZ1);
  directionalLight(160, 180, 255, baseX2, baseY2, baseZ2);
  if (showFixedLight) directionalLight(150, 150, 150, 0, -1, 0);

  let uiWidth = controlPanel.elt.offsetWidth + 20;
  let nucleusX = - (width / 2) + (width - uiWidth) / 2 + uiWidth;

  if (!isMouseOverUI() && isOrbiting) orbitControl(2, 2, 0.5);
  cam.lookAt(nucleusX + systemOffset.x, systemOffset.y, 0);

  // Draw system
  push();
  translate(nucleusX + systemOffset.x, systemOffset.y, 0);

  // nucleus
  push();
  rotateX(rotationAngle * 0.3);
  rotateY(rotationAngle * 0.5);
  rotateZ(rotationAngle * 0.7);
  fill(255, 100, 100);
  noStroke();
  sphere(20);
  pop();

  // outer shell overlay
  if (showOuterShell && shells.length > 0) {
    let outerRadius = 40 + (shells.length - 1) * 30;
    const col = getElementRGB(atomicNumber);
    push();
    noStroke();
    shininess(60);
    ambientMaterial(col.r, col.g, col.b);
    specularMaterial(min(255, col.r + 30), min(255, col.g + 30), min(255, col.b + 30));
    sphere(outerRadius + 7, 64, 64);
    pop();
  }

  if (rotateElectrons) rotationOffset += 0.02;

  // orbits and electrons
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
      pop();
    }
  }

  // nucleus small label
  if (atomicNumber > 0) {
    push();
    translate(0, 0, 21);
    fill(255);
    textSize(16);
    textAlign(CENTER, CENTER);
    text("+" + atomicNumber, 0, 0);
    pop();
  }

  // electron "-" labels
  push();
  noLights();
  for (let i = 0; i < shells.length; i++) {
    let radius = 40 + i * 30;
    let electronsInThisShell = shells[i];
    for (let j = 0; j < electronsInThisShell; j++) {
      let baseAngle = j * TWO_PI / electronsInThisShell;
      let angle = baseAngle + rotationOffset;
      let x = radius * cos(angle);
      let y = radius * sin(angle);
      push();
      translate(x, y, 0);
      translate(0, -2, 8);
      fill(255);
      textSize(18);
      textAlign(CENTER, CENTER);
      text("-", 0, 0);
      pop();
    }
  }
  ambientLight(60);
  pop();

  pop(); // end system translate

  updateElementLabel(nucleusX);
  updateInfoPanel();
}

function worldToScreen(x, y, z) {
  try {
    if (typeof screenX === 'function' && typeof screenY === 'function') {
      let sx = screenX(x, y, z);
      let sy = screenY(x, y, z);
      if (!isNaN(sx) && !isNaN(sy)) return { sx, sy };
    }
  } catch (e) {}
  try {
    if (cnv && cnv._renderer && typeof cnv._renderer.screenX === 'function' && typeof cnv._renderer.screenY === 'function') {
      let sx = cnv._renderer.screenX(x, y, z);
      let sy = cnv._renderer.screenY(x, y, z);
      if (!isNaN(sx) && !isNaN(sy)) return { sx, sy };
    }
  } catch (e) {}
  let sx = width / 2 + x;
  let sy = height / 2 - y;
  return { sx, sy };
}

// UPDATED: element label shows Symbol (Name) when neutral; when ionized shows only ion symbol using <sup>
function updateElementLabel(nucleusX) {
  if (atomicNumber <= 0) {
    elementLabel.style('display', 'none');
    return;
  }

  let outerRadius = shells.length > 0 ? (40 + (shells.length - 1) * 30) : 40;
  let worldX = nucleusX + systemOffset.x + outerRadius;
  let worldY = systemOffset.y;
  let worldZ = 0;

  let pos = worldToScreen(worldX, worldY, worldZ);
  let sx = pos.sx, sy = pos.sy;
  let rect = cnv.elt.getBoundingClientRect();
  let pageX = rect.left + sx;
  let pageY = rect.top + sy;

  const gapPx = 40;
  let sym = periodicTable[atomicNumber] ? periodicTable[atomicNumber] : "";
  let name = elementNames[atomicNumber] ? elementNames[atomicNumber] : "";

  let netCharge = atomicNumber - electronCount;
  let labelHTML;
  if (netCharge === 0) {
    labelHTML = `${sym} (${name})`;
  } else {
    labelHTML = getIonSymbolHTML(sym, netCharge);
  }

  elementLabel.html(labelHTML);
  elementLabel.style('left', `${pageX + gapPx}px`);
  elementLabel.style('top', `${pageY}px`);
  elementLabel.style('display', 'block');
  elementLabel.style('transform', 'translate(0, -50%)');
  elementLabel.style('text-align', 'left');
}

function drawOrbitCircle(radius) {
  beginShape();
  const segments = 180;
  for (let i = 0; i < segments; i++) {
    let theta = map(i, 0, segments, 0, TWO_PI);
    let cx = radius * cos(theta);
    let cy = radius * sin(theta);
    vertex(cx, cy);
  }
  endShape(CLOSE);
}

function resetStateAndBuildModel(z) {
  atomicNumber = z;
  electronCount = z;
  shells = [];
  showOuterShell = false;
  showFixedLight = true;
  rotateElectrons = true;
  if (toggleOrbitButton) toggleOrbitButton.html(rotateElectrons ? "Tắt quay electron" : "Bật quay electron");
  if (toggleOuterShellButton) toggleOuterShellButton.html(showOuterShell ? 'Tắt lớp cầu' : 'Bật lớp cầu');

  if (atomicNumber > 0) {
    shells = calculateShells(electronCount);
    symbolSpan.html(periodicTable[atomicNumber] ? periodicTable[atomicNumber] : "");
  } else {
    symbolSpan.html("");
  }
  cam.setPosition(0, 0, 800);
  elementLabel.style('display', atomicNumber > 0 ? 'block' : 'none');
}

function addElectron() {
  if (atomicNumber === 0) return;
  const atomicType = getAtomicType(atomicNumber);
  if (electronCount < atomicNumber) {
    electronCount++;
    updateModelFromElectronCount();
    return;
  }
  if (atomicType === 'nonmetal') {
    const targetZ = findNextNobleGasZ(atomicNumber);
    if (electronCount < targetZ) {
      electronCount++;
      updateModelFromElectronCount();
    }
  }
}

function removeElectron() {
  if (atomicNumber === 0 || electronCount <= 0) return;
  const atomicType = getAtomicType(atomicNumber);

  if (electronCount > atomicNumber) {
    electronCount--;
    updateModelFromElectronCount();
    return;
  }

  if (atomicType === 'metal' || atomicType === 'metalloid') {
    const targetZ = findPreviousNobleGasZ(atomicNumber) ?? 0;
    if (electronCount > targetZ) {
      electronCount--;
      updateModelFromElectronCount();
    }
    return;
  }

  const valid = cationValidChargesByZ[atomicNumber];
  if (valid && valid.length > 0) {
    const currentCharge = atomicNumber - electronCount;
    const nextCharge = currentCharge + 1;
    if (valid.includes(nextCharge)) {
      electronCount--;
      updateModelFromElectronCount();
    }
  }
}

function getAtomicType(z) {
  const type = elementTypes[z];
  switch (type) {
    case 1: return 'metal';
    case 2: return 'nonmetal';
    case 3: return 'nobleGas';
    case 4: return 'metalloid';
    default: return 'unknown';
  }
}

function findNextNobleGasZ(z) { return nobleGasZs.find(nobleZ => nobleZ >= z); }
function findPreviousNobleGasZ(z) { return [...nobleGasZs].reverse().find(nobleZ => nobleZ < z); }

function updateModelFromElectronCount() {
  if (atomicNumber > 0) {
    if (electronCount === atomicNumber) {
      shells = calculateShells(atomicNumber);
    } else {
      const currentConfigStr = rebuildConfig(electronCount);
      shells = parseConfig(currentConfigStr);
    }
  }
}

function resetSystem() {
  resetStateAndBuildModel(0);
  atomicInput.value('');
}

// ------------------ Info panel with <sup> for clarity ------------------
function updateInfoPanel() {
  let html = "";
  let nucleusCharge = atomicNumber > 0 ? ("+" + atomicNumber) : "N/A";
  html += `<div>Điện tích hạt nhân: ${nucleusCharge}</div>`;
  html += `<div>Số electron: ${electronCount}</div>`;
  html += `<div>Phân bố electron: ${shells.length > 0 ? shells.join("/") : "N/A"}</div>`;

  let currentConfig = "";
  if (atomicNumber > 0) {
    if (electronCount === atomicNumber) currentConfig = electronConfigurations[atomicNumber];
    else currentConfig = rebuildConfig(electronCount);
  }

  let displayConfig = currentConfig ? renderElectronConfigHTML(currentConfig) : "N/A";
  html += `<div>Cấu hình electron: ${displayConfig || "N/A"}</div>`;

  infoPanel.html(html);
}

function openGuide() {
  isOrbiting = false;
  overlay.style('display','block');
  guidePopup.style('display','flex');
}

function closeGuide() {
  overlay.style('display','none');
  guidePopup.style('display','none');
  isOrbiting = true;
}

function styleButton(btn) {
  btn.style("font-size","13px");
  btn.style("padding","4px 8px");
  btn.style("width","140px");
  btn.style("background-color","#2196F3");
  btn.style("color","#fff");
  btn.style("border","none");
  btn.style("border-radius","4px");
  btn.mouseOver(() => btn.style("background-color","#1976D2"));
  btn.mouseOut(() => btn.style("background-color","#2196F3"));
}

function toggleOuterShell() {
  showOuterShell = !showOuterShell;
  toggleOuterShellButton.html(showOuterShell ? 'Tắt lớp cầu' : 'Bật lớp cầu');
  showFixedLight = !showOuterShell;
}

function setAtomicNumber() {
  let val = parseInt(atomicInput.value());
  if (!isNaN(val) && val > 0 && val <= 118) {
    resetStateAndBuildModel(val);
  } else {
    resetStateAndBuildModel(0);
    atomicInput.value('');
  }
}