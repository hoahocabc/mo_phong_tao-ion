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
let rotationOffset = 0;
let systemOffset;
let cam;
let rotationAngle = 0;

// Mảng để lưu lịch sử các trạng thái đã bớt electron
let removedElectronHistory = [];

// Danh sách số hiệu nguyên tử của các khí hiếm
const nobleGasZs = [2, 10, 18, 36, 54, 86, 118];

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

// Phân loại nguyên tố: Kim loại (1), Phi kim (2), Khí hiếm (3), Bán kim loại (4), Chưa xác định (0)
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
  24: [2, 8, 13, 1], // Chromium (Cr)
  29: [2, 8, 18, 1], // Copper (Cu)
  41: [2, 8, 18, 12, 1], // Niobium (Nb)
  42: [2, 8, 18, 13, 1], // Molybdenum (Mo)
  44: [2, 8, 18, 15, 1], // Ruthenium (Ru)
  45: [2, 8, 18, 16, 1], // Rhodium (Rh)
  46: [2, 8, 18, 18], // Palladium (Pd)
  47: [2, 8, 18, 18, 1], // Silver (Ag)
  78: [2, 8, 18, 32, 17, 1], // Platinum (Pt)
  79: [2, 8, 18, 32, 18, 1], // Gold (Au)
};

const electronConfigurations = {
  1: "1s¹", 2: "1s²", 3: "1s² 2s¹", 4: "1s² 2s²", 5: "1s² 2s² 2p¹", 6: "1s² 2s² 2p²", 7: "1s² 2s² 2p³", 8: "1s² 2s² 2p⁴", 9: "1s² 2s² 2p⁵", 10: "1s² 2s² 2p⁶", 11: "1s² 2s² 2p⁶ 3s¹", 12: "1s² 2s² 2p⁶ 3s²", 13: "1s² 2s² 2p⁶ 3s² 3p¹", 14: "1s² 2s² 2p⁶ 3s² 3p²", 15: "1s² 2s² 2p⁶ 3s² 3p³", 16: "1s² 2s² 2p⁶ 3s² 3p⁴", 17: "1s² 2s² 2p⁶ 3s² 3p⁵", 18: "1s² 2s² 2p⁶ 3s² 3p⁶", 19: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹", 20: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s²", 21: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹ 4s²", 22: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d² 4s²", 23: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d³ 4s²", 24: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s¹", 25: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s²", 26: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²", 27: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁷ 4s²", 28: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁸ 4s²", 29: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s¹", 30: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s²", 31: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p¹", 32: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p²", 33: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p³", 34: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁴", 35: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁵", 36: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶", 37: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 5s¹", 38: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 5s²", 39: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹ 5s²", 40: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d² 5s²", 41: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d⁴ 5s¹", 42: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d⁵ 5s¹", 43: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d⁵ 5s²", 44: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d⁷ 5s¹", 45: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d⁸ 5s¹", 46: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰", 47: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s¹", 48: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s²", 49: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s² 5p¹", 50: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s² 5p²", 51: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s² 5p³", 52: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s² 5p⁴", 53: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s² 5p⁵", 54: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s² 5p⁶", 55: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s² 5p⁶ 6s¹", 56: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s² 5p⁶ 6s²", 57: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s² 5p⁶ 5d¹ 6s²", 58: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹ 5s² 5p⁶ 5d¹ 6s²", 59: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f³ 5s² 5p⁶ 6s²", 60: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f⁴ 5s² 5p⁶ 6s²", 61: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f⁵ 5s² 5p⁶ 6s²", 62: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f⁶ 5s² 5p⁶ 6s²", 63: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f⁷ 5s² 5p⁶ 6s²", 64: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f⁷ 5s² 5p⁶ 5d¹ 6s²", 65: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f⁹ 5s² 5p⁶ 6s²", 66: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁰ 5s² 5p⁶ 6s²", 67: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹¹ 5s² 5p⁶ 6s²", 68: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹² 5s² 5p⁶ 6s²", 69: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹³ 5s² 5p⁶ 6s²", 70: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 6s²", 71: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹ 6s²", 72: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d² 6s²", 73: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d³ 6s²", 74: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d⁴ 6s²", 75: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d⁵ 6s²", 76: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d⁶ 6s²", 77: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d⁷ 6s²", 78: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d⁹ 6s¹", 79: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s¹", 80: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s²", 81: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s² 6p¹", 82: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s² 6p²", 83: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s² 6p³", 84: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s² 6p⁴", 85: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s² 6p⁵", 86: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s² 6p⁶", 87: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s² 6p⁶ 7s¹", 88: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s² 6p⁶ 7s²", 89: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s² 6p⁶ 6d¹ 7s²", 90: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s² 6p⁶ 6d² 7s²", 91: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f² 6s² 6p⁶ 6d¹ 7s²", 92: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f³ 6s² 6p⁶ 6d¹ 7s²", 93: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f⁴ 6s² 6p⁶ 6d¹ 7s²", 94: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f⁶ 6s² 6p⁶ 7s²", 95: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f⁷ 6s² 6p⁶ 7s²", 96: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f⁷ 6s² 6p⁶ 6d¹ 7s²", 97: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f⁹ 6s² 6p⁶ 7s²", 98: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f¹⁰ 6s² 6p⁶ 7s²", 99: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f¹¹ 6s² 6p⁶ 7s²", 100: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f¹² 6s² 6p⁶ 7s²", 101: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f¹³ 6s² 6p⁶ 7s²", 102: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f¹⁴ 6s² 6p⁶ 7s²", 103: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 4f¹⁴ 6s² 6p⁶ 7s² 7p¹", 104: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 4f¹⁴ 6s² 6p⁶ 6d² 7s²", 105: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 4f¹⁴ 6s² 6p⁶ 6d³ 7s²", 106: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 4f¹⁴ 6s² 6p⁶ 6d⁴ 7s²", 107: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 4f¹⁴ 6s² 6p⁶ 6d⁵ 7s²", 108: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 4f¹⁴ 6s² 6p⁶ 6d⁶ 7s²", 109: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 4f¹⁴ 6s² 6p⁶ 6d⁷ 7s²", 110: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 4f¹⁴ 6s² 6p⁶ 6d⁸ 7s²", 111: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 4f¹⁴ 6s² 6p⁶ 6d⁹ 7s²", 112: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 4f¹⁴ 6s² 6p⁶ 6d¹⁰ 7s²", 113: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 4f¹⁴ 6s² 6p⁶ 6d¹⁰ 7s² 7p¹", 114: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 4f¹⁴ 6s² 6p⁶ 6d¹⁰ 7s² 7p²", 115: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 4f¹⁴ 6s² 6p⁶ 6d¹⁰ 7s² 7p³", 116: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 4f¹⁴ 6s² 6p⁶ 6d¹⁰ 7s² 7p⁴", 117: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 4f¹⁴ 6s² 6p⁶ 6d¹⁰ 7s² 7p⁵", 118: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 4f¹⁴ 6s² 6p⁶ 6d¹⁰ 7s² 7p⁶"
};

function preload() {
  myFont = loadFont('Arial.ttf');
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

  // Row 5: Toggle Outer Shell button
  toggleOuterShellRow = createDiv();
  toggleOuterShellRow.parent(controlPanel);
  toggleOuterShellRow.style("display", "flex");
  toggleOuterShellRow.style("align-items", "center");

  toggleOuterShellButton = createButton('Bật lớp cầu');
  toggleOuterShellButton.parent(toggleOuterShellRow);
  styleButton(toggleOuterShellButton);
  toggleOuterShellButton.mousePressed(toggleOuterShell);

  // Row 6: Reset button.
  resetRow = createDiv();
  resetRow.parent(controlPanel);
  resetRow.style("display", "flex");
  resetRow.style("align-items", "center");

  resetButton = createButton('Reset');
  resetButton.parent(resetRow);
  styleButton(resetButton);
  resetButton.mousePressed(resetSystem);

  // Row 7: Guide button.
  guideRow = createDiv();
  guideRow.parent(controlPanel);
  guideRow.style("display", "flex");
  guideRow.style("align-items", "center");

  guideButton = createButton('Hướng dẫn');
  guideButton.parent(guideRow);
  guideButton.style("font-size", "14px");
  guideButton.style("padding", "4px 8px");
  guideButton.style("width", "140px");
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
  infoPanel.style("font-size", "20px"); // TĂNG CỠ CHỮ
  infoPanel.style("line-height", "1.7"); // GIÃN DÒNG

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
  popupTitle.style('text-align', 'center');

  let guideContent = `
      <ul>
        <li><b>Số hiệu Z:</b> Nhập số hiệu nguyên tử để hiển thị mô hình.</li>
        <li><b>Thêm/Bớt electron:</b> Điều chỉnh số electron để tạo ion. Khi bớt electron, sẽ bớt từ lớp ngoài cùng.</li>
        <li><b>Tương tác:</b> Dùng chuột trái để xoay và con lăn để thu phóng.</li>
        <li><b>Bật/Tắt quay electron:</b> Khi chuyển trạng thái, góc quay không thay đổi đột ngột, giúp tránh cảm giác giật.</li>
        <li><b>Bật/Tắt lớp cầu:</b> Hiển thị lớp cầu bao quanh electron ngoài cùng.</li>
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

function mouseDragged() {
  // System movement disabled.
}

function draw() {
  background(0);
  
  // Tăng góc quay liên tục cho ánh sáng và mặt cầu
  rotationAngle += 0.01;

  // Tính toán vị trí của nguồn sáng
  let lightX = cos(rotationAngle) * 300;
  let lightY = sin(rotationAngle) * 300;

  // Set up lights.
  ambientLight(60);
  directionalLight(230, 230, 230, lightX, lightY, 0); // Thay đổi vị trí nguồn sáng
  directionalLight(80, 80, 80, -lightX, -lightY, 0);
  directionalLight(120, 120, 120, 0, -1, 0);

  let uiWidth = controlPanel.elt.offsetWidth + 20;
  let nucleusX = - (width / 2) + (width - uiWidth) / 2 + uiWidth;

  // Use orbitControl if not over UI.
  if (!isMouseOverUI() && isOrbiting) {
    orbitControl(2, 2, 0.5);
  }

  cam.lookAt(nucleusX + systemOffset.x, systemOffset.y, 0);
  
  // Vị trí của toàn bộ hệ thống
  push();
  translate(nucleusX + systemOffset.x, systemOffset.y, 0);

  // Vẽ mặt cầu ở trung tâm và chỉ xoay nó
  push();
  rotateX(rotationAngle * 0.3);
  rotateY(rotationAngle * 0.5);
  rotateZ(rotationAngle * 0.7);
  fill(255, 100, 100);
  noStroke();
  sphere(20);
  pop();

  // Vẽ lớp vỏ ngoài cùng nếu được bật và có electron
  if (showOuterShell && shells.length > 0) {
    let outerRadius = 40 + (shells.length - 1) * 30;
    
    push();
    noStroke();
    shininess(255);
    specularMaterial(0, 180, 255);
    sphere(outerRadius + 7, 64, 64);
    pop();
  }

  if (rotateElectrons) {
    rotationOffset += 0.02;
  }

  // Vẽ quỹ đạo electron và các electron
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

  // Vẽ nhãn điện tích hạt nhân
  push();
  translate(0, 0, 21);
  fill(255);
  textSize(12);
  textAlign(CENTER, CENTER);
  text("+" + atomicNumber, 0, 0);
  pop();

  // Vẽ nhãn điện tích tổng
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

  // Vẽ nhãn electron
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
      translate(0, -2, 7);
      fill(255);
      textSize(18);
      textAlign(CENTER, CENTER);
      text("-", 0, 0);
      pop();
    }
  }

  pop(); // Kết thúc phép tịnh tiến cho toàn bộ hệ thống

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

/**
 * Resets all core state variables and builds the model for a new atomic number.
 * @param {number} z - The new atomic number.
 */
function resetStateAndBuildModel(z) {
  atomicNumber = z;
  electronCount = z;
  shells = [];
  removedElectronHistory = [];
  showOuterShell = false;
  toggleOuterShellButton.html('Bật lớp cầu');

  if (atomicNumber > 0) {
    shells = calculateShells(electronCount);
    symbolSpan.html(periodicTable[atomicNumber] ? periodicTable[atomicNumber] : "");
  } else {
    symbolSpan.html("");
  }

  cam.setPosition(0, 0, 800);
}

/**
 * Hàm phân tích chuỗi cấu hình electron và chuyển thành mảng số electron trên từng lớp.
 * Ví dụ: "1s² 2s² 2p⁶ 3s²" -> [2, 8, 2]
 * @param {string} configStr - Chuỗi cấu hình electron.
 * @returns {Array<number>} - Mảng số electron trên mỗi lớp.
 */
function parseConfig(configStr) {
  const shellsArray = [];
  if (!configStr) return shellsArray;

  // Regex để tìm các orbital và số electron của nó (ví dụ: 1s2, 2p6)
  const orbitals = configStr.match(/(\d+)([spdf])(¹|²|³|⁴|⁵|⁶|⁷|⁸|⁹|¹⁰|¹¹|¹²|¹³|¹⁴|¹⁵|¹⁶|¹⁷|¹⁸|¹⁹|²⁰)?/g);

  if (!orbitals) return shellsArray;

  // Chuyển đổi số mũ unicode sang số
  const superscriptMap = {
    '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9, '¹⁰': 10,
    '¹¹': 11, '¹²': 12, '¹³': 13, '¹⁴': 14, '¹⁵': 15, '¹⁶': 16, '¹⁷': 17, '¹⁸': 18, '¹⁹': 19, '²⁰': 20,
  };

  for (let orbital of orbitals) {
    const n = parseInt(orbital.charAt(0));
    const superscript = orbital.substring(orbital.search(/[¹²³⁴⁵⁶⁷⁸⁹⁰]+/) || orbital.length);
    const electrons = superscriptMap[superscript] || parseInt(superscript) || 1;

    if (!shellsArray[n - 1]) {
      shellsArray[n - 1] = 0;
    }
    shellsArray[n - 1] += electrons;
  }

  // Loại bỏ các giá trị undefined và 0 ở cuối mảng
  while (shellsArray.length > 0 && (shellsArray[shellsArray.length - 1] === 0 || shellsArray[shellsArray.length - 1] === undefined)) {
    shellsArray.pop();
  }

  return shellsArray;
}

/**
 * Xây dựng lại chuỗi cấu hình electron từ số electron đã thay đổi.
 * @param {number} newElectronCount - Số electron mới.
 * @returns {string} - Chuỗi cấu hình electron mới.
 */
function rebuildConfig(newElectronCount) {
  if (newElectronCount <= 0 || !electronConfigurations[atomicNumber]) {
    return "";
  }

  const superscriptMap = {
    '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9, '¹⁰': 10,
    '¹¹': 11, '¹²': 12, '¹³': 13, '¹⁴': 14, '¹⁵': 15, '¹⁶': 16, '¹⁷': 17, '¹⁸': 18, '¹⁹': 19, '²⁰': 20,
  };
  const reversedSuperscriptMap = Object.fromEntries(Object.entries(superscriptMap).map(([k, v]) => [v, k]));

  // Sử dụng quy tắc Aufbau để xây dựng cấu hình từ đầu
  let tempElectronCount = newElectronCount;
  let finalConfig = {};
  const aufbauOrder = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p'];
  const maxElectrons = { 's': 2, 'p': 6, 'd': 10, 'f': 14 };

  // Logic đặc biệt để bớt electron từ lớp vỏ ngoài cùng
  if (newElectronCount < atomicNumber) {
    const originalConfig = parseOrbitalString(electronConfigurations[atomicNumber]);
    let currentElectrons = atomicNumber;
    const newConfig = JSON.parse(JSON.stringify(originalConfig)); // Tạo bản sao

    // Duyệt từ n cao nhất để bớt
    const nOrder = Object.keys(newConfig).map(Number).sort((a, b) => b - a);
    for (let n of nOrder) {
      const subshellOrder = ['f', 'd', 'p', 's'];
      for (let subshell of subshellOrder) {
        if (newConfig[n] && newConfig[n][subshell]) {
          let count = newConfig[n][subshell];
          while (currentElectrons > newElectronCount && count > 0) {
            count--;
            currentElectrons--;
          }
          if (count > 0) {
            newConfig[n][subshell] = count;
          } else {
            delete newConfig[n][subshell];
          }
        }
      }
    }
    return formatConfigString(newConfig);
  }

  // Logic bình thường cho nguyên tử trung hòa và ion âm (thêm e)
  for (let orbital of aufbauOrder) {
    const n = parseInt(orbital.charAt(0));
    const subshell = orbital.charAt(1);
    const maxCapacity = maxElectrons[subshell];

    if (tempElectronCount <= 0) break;

    let electronsToFill = min(tempElectronCount, maxCapacity);

    // Quy tắc đặc biệt cho Cr và Cu nếu số e lớn hơn Z của chúng
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

// Hàm phụ trợ để phân tích chuỗi cấu hình electron thành đối tượng
function parseOrbitalString(configStr) {
  const config = {};
  if (!configStr) return config;
  const orbitals = configStr.match(/(\d+)([spdf])(¹|²|³|⁴|⁵|⁶|⁷|⁸|⁹|¹⁰|¹¹|¹²|¹³|¹⁴|¹⁵|¹⁶|¹⁷|¹⁸|¹⁹|²⁰)?/g);
  if (!orbitals) return config;

  const superscriptMap = {
    '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9, '¹⁰': 10,
    '¹¹': 11, '¹²': 12, '¹³': 13, '¹⁴': 14, '¹⁵': 15, '¹⁶': 16, '¹⁷': 17, '¹⁸': 18, '¹⁹': 19, '²⁰': 20,
  };

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

// Hàm phụ trợ để định dạng đối tượng cấu hình thành chuỗi
function formatConfigString(config) {
  const reversedSuperscriptMap = {
    1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', 10: '¹⁰',
    11: '¹¹', 12: '¹²', 13: '¹³', 14: '¹⁴', 15: '¹⁵', 16: '¹⁶', 17: '¹⁷', 18: '¹⁸', 19: '¹⁹', 20: '²⁰'
  };
  const nOrder = Object.keys(config).map(Number).sort((a, b) => a - b);
  const subshellOrder = ['s', 'p', 'd', 'f'];
  let result = [];
  for (let n of nOrder) {
    for (let subshell of subshellOrder) {
      if (config[n][subshell]) {
        result.push(`${n}${subshell}${reversedSuperscriptMap[config[n][subshell]]}`);
      }
    }
  }
  return result.join(' ');
}

function calculateShells(n) {
  if (n <= 0) return [];

  // Sử dụng mảng đặc biệt cho các nguyên tố có ngoại lệ
  if (specialConfigurations[n]) {
    return specialConfigurations[n];
  }

  const shellsArray = [];
  const configStr = electronConfigurations[n];
  if (!configStr) return [];

  const parsed = parseOrbitalString(configStr);
  for (let nLevel in parsed) {
    let total = 0;
    for (let subshell in parsed[nLevel]) {
      total += parsed[nLevel][subshell];
    }
    shellsArray.push(total);
  }

  return shellsArray;
}


/**
 * Thêm một electron, tuân thủ quy tắc bão hòa của phi kim.
 */
function addElectron() {
  if (atomicNumber === 0) return;
  const atomicType = getAtomicType(atomicNumber);
  
  // Cho phép thêm electron trở lại nếu nó là ion dương
  if (electronCount < atomicNumber) {
    electronCount++;
    updateModelFromElectronCount();
    return;
  }
  
  // Chỉ phi kim mới có thể nhận thêm electron từ trạng thái trung hòa
  if (atomicType === 'nonmetal') {
    const targetZ = findNextNobleGasZ(atomicNumber);
    // Chỉ thêm e nếu chưa đạt cấu hình khí hiếm
    if (electronCount < targetZ) {
      electronCount++;
      updateModelFromElectronCount();
    }
  }
}

/**
 * Bớt một electron, tuân thủ quy tắc bão hòa của kim loại.
 */
function removeElectron() {
  if (atomicNumber === 0 || electronCount <= 0) return;
  const atomicType = getAtomicType(atomicNumber);
  
  // Cho phép bớt electron nếu nó là ion âm
  if (electronCount > atomicNumber) {
    electronCount--;
    updateModelFromElectronCount();
    return;
  }
  
  // Chỉ kim loại mới có thể nhường electron từ trạng thái trung hòa
  if (atomicType === 'metal') {
    // Nếu không tìm thấy khí hiếm trước nó (vd: H, He), giới hạn là 0
    const targetZ = findPreviousNobleGasZ(atomicNumber) ?? 0;
    // Chỉ bớt e nếu chưa đạt cấu hình khí hiếm
    if (electronCount > targetZ) {
      electronCount--;
      updateModelFromElectronCount();
    }
  }
}

/**
 * Phân loại nguyên tố dựa trên số hiệu Z.
 * @param {number} z - Số hiệu nguyên tử.
 * @returns {string} - 'metal', 'nonmetal', 'nobleGas' or 'unknown'.
 */
function getAtomicType(z) {
  const type = elementTypes[z];
  switch (type) {
    case 1:
      return 'metal';
    case 2:
      return 'nonmetal';
    case 3:
      return 'nobleGas';
    case 4:
      return 'metalloid';
    default:
      return 'unknown';
  }
}

// Tìm số hiệu Z của khí hiếm đứng liền sau
function findNextNobleGasZ(z) {
    return nobleGasZs.find(nobleZ => nobleZ >= z);
}

// Tìm số hiệu Z của khí hiếm đứng liền trước
function findPreviousNobleGasZ(z) {
    return [...nobleGasZs].reverse().find(nobleZ => nobleZ < z);
}

function updateModelFromElectronCount() {
  if (atomicNumber > 0) {
    let currentConfigStr;
    if (electronCount === atomicNumber) {
      currentConfigStr = electronConfigurations[atomicNumber];
      shells = calculateShells(atomicNumber);
    } else {
      currentConfigStr = rebuildConfig(electronCount);
      shells = parseConfig(currentConfigStr);
    }
  }
}

function resetSystem() {
  resetStateAndBuildModel(0);
  atomicInput.value('');
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
  let nucleusCharge = atomicNumber > 0 ? ("+" + atomicNumber) : "N/A";
  html += `<div>Điện tích hạt nhân: ${nucleusCharge}</div>`;
  html += `<div>Số electron: ${electronCount}</div>`;
  html += `<div>Phân bố electron: ${shells.length > 0 ? shells.join("/") : "N/A"}</div>`;

  // Cập nhật cấu hình electron dựa trên số electron hiện tại
  let currentConfig = "";
  if (atomicNumber > 0) {
    if (electronCount === atomicNumber) {
      currentConfig = electronConfigurations[atomicNumber];
    } else {
      currentConfig = rebuildConfig(electronCount);
    }
  }

  html += `<div>Cấu hình electron: ${currentConfig || "N/A"}</div>`;

  let netCharge = atomicNumber - electronCount;
  let chargeStr = formatCharge(netCharge);
  html += `<div>Tổng điện tích: ${chargeStr}</div>`;
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
}

function toggleOuterShell() {
  showOuterShell = !showOuterShell;
  toggleOuterShellButton.html(showOuterShell ? 'Tắt lớp cầu' : 'Bật lớp cầu');
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