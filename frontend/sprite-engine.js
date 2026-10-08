/**
 * Munder Difflin Authentic Pixel-Art Sprite Engine
 * Generates exact character sprites and walk cycles for Michael, Jim, Kelly, Dwight, etc.
 */

const PORTRAIT_W = 18;
const PORTRAIT_H = 28;
const SCENE_W = 18;
const SCENE_H = 32;
const OUTLINE = [38, 34, 46];
const HX0 = 4, HX1 = 13;
let CUR_W = PORTRAIT_W, CUR_H = PORTRAIT_H;

const clampVal = (v) => v < 0 ? 0 : v > 255 ? 255 : Math.round(v);
function shades(rgb, dl = 1.22, dd = 0.68) {
  return [
    [clampVal(rgb[0] * dl), clampVal(rgb[1] * dl), clampVal(rgb[2] * dl)],
    [rgb[0], rgb[1], rgb[2]],
    [clampVal(rgb[0] * dd), clampVal(rgb[1] * dd), clampVal(rgb[2] * dd)]
  ];
}

function setPixel(buf, x, y, c, a = 255) {
  if (x < 0 || x >= CUR_W || y < 0 || y >= CUR_H) return;
  const idx = (y * CUR_W + x) * 4;
  buf[idx] = c[0];
  buf[idx + 1] = c[1];
  buf[idx + 2] = c[2];
  buf[idx + 3] = a;
}

function alphaAt(buf, x, y) {
  if (x < 0 || x >= CUR_W || y < 0 || y >= CUR_H) return 0;
  return buf[(y * CUR_W + x) * 4 + 3];
}

function rgbAt(buf, x, y) {
  const idx = (y * CUR_W + x) * 4;
  return [buf[idx], buf[idx + 1], buf[idx + 2]];
}

function colorEq(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

function fillBox(buf, x0, y0, x1, y1, c) {
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      setPixel(buf, x, y, c);
    }
  }
}

const SKIN = {
  light: { hi: [255, 221, 189], base: [247, 201, 170], sh: [212, 158, 126], line: [168, 112, 82] },
  tan:   { hi: [232, 182, 136], base: [214, 162, 116], sh: [176, 126, 86], line: [138, 92, 60] },
  brown: { hi: [180, 130, 94],  base: [158, 112, 78],  sh: [124, 86, 58],  line: [90, 60, 40] },
  dark:  { hi: [142, 98, 70],   base: [120, 80, 56],   sh: [94, 62, 42],   line: [64, 42, 28] }
};

function drawHead(buf, skin) {
  const s = SKIN[skin];
  for (let y = 4; y <= 16; y++) {
    for (let x = HX0; x <= HX1; x++) {
      if ((x === HX0 || x === HX1) && (y === 4 || y === 5 || y === 16) || (x === 5 || x === 12) && y === 4) continue;
      setPixel(buf, x, y, s.base);
    }
  }
  for (let y = 6; y < 12; y++) setPixel(buf, 5, y, s.hi);
  setPixel(buf, 6, 5, s.hi);
  setPixel(buf, 7, 5, s.hi);
  for (let y = 6; y < 15; y++) setPixel(buf, 12, y, s.sh);
  for (const x of [7, 8, 9, 10, 11]) setPixel(buf, x, 16, s.sh);
  for (const ex of [HX0 - 1, HX1 + 1]) {
    setPixel(buf, ex, 9, s.base);
    setPixel(buf, ex, 10, s.base);
    setPixel(buf, ex, 11, s.sh);
  }
  fillBox(buf, 7, 17, 10, 18, s.sh);
  fillBox(buf, 7, 17, 9, 17, s.base);
}

function drawFace(buf, skin, brow, mouth, blush, lashes = false) {
  const s = SKIN[skin];
  const white = [250, 248, 244], pup = [46, 38, 42];
  for (const [a, b, p] of [[5, 6, 6], [10, 11, 10]]) {
    setPixel(buf, a, 9, white);
    setPixel(buf, b, 9, white);
    setPixel(buf, p, 9, pup);
  }
  if (lashes) {
    const lash = [54, 40, 48], glint = [252, 250, 248];
    for (const x of [5, 6, 10, 11]) setPixel(buf, x, 8, lash);
    setPixel(buf, 4, 8, lash);
    setPixel(buf, 12, 8, lash);
    setPixel(buf, 5, 9, glint);
    setPixel(buf, 10, 9, glint);
  }
  if (brow === "flat") for (const x of [5, 6, 10, 11]) setPixel(buf, x, 7, s.line);
  else if (brow === "angry") {
    setPixel(buf, 5, 8, s.line);
    setPixel(buf, 6, 7, s.line);
    setPixel(buf, 10, 7, s.line);
    setPixel(buf, 11, 8, s.line);
  } else if (brow === "raised") for (const x of [5, 6, 10, 11]) setPixel(buf, x, 6, s.line);
  else if (brow === "soft") {
    for (const x of [5, 11]) setPixel(buf, x, 7, s.line);
    for (const x of [6, 10]) setPixel(buf, x, 7, s.sh);
  }
  setPixel(buf, 8, 11, s.sh);
  setPixel(buf, 8, 12, s.sh);
  setPixel(buf, 7, 12, s.sh);

  const mc = [158, 86, 80];
  const mouths = {
    neutral: [[7, 14], [8, 14], [9, 14], [10, 14]],
    smile: [[7, 14], [8, 14], [9, 14], [10, 14], [6, 13], [11, 13]],
    frown: [[7, 15], [8, 15], [9, 15], [10, 15], [6, 14], [11, 14]],
    grin: [[7, 14], [8, 14], [9, 14], [10, 14], [7, 13], [8, 13], [9, 13], [10, 13], [6, 13], [11, 13]]
  };
  const mpts = mouths[mouth] || mouths.neutral;
  for (const [x, y] of mpts) setPixel(buf, x, y, mc);
  if (blush) for (const x of [5, 12]) setPixel(buf, x, 12, [235, 150, 140], 140);
}

const styleShort = (buf, color, skinBase, a) => {
  const [hi, base, sh] = shades(color);
  const part = a.part ?? "L", recede = a.recede ?? 0;
  fillBox(buf, HX0, 2, HX1, 4, base);
  for (let x = HX0 - 1; x <= HX1 + 1; x++) setPixel(buf, x, 3, base);
  fillBox(buf, HX0 - 1, 4, HX1 + 1, 5, base);
  for (let y = 6; y < 9; y++) {
    setPixel(buf, HX0 - 1, y, base);
    setPixel(buf, HX0, y, base);
    setPixel(buf, HX1, y, base);
    setPixel(buf, HX1 + 1, y, base);
  }
  for (let x = HX0; x <= HX1; x++) setPixel(buf, x, 5, base);
  if (recede) {
    for (let y = 3; y < 6; y++) for (let x = 6; x < 12; x++) if (colorEq(rgbAt(buf, x, y), base)) setPixel(buf, x, y, skinBase);
    setPixel(buf, 8, 5, base);
  }
  const hx = part === "L" ? 6 : 11;
  for (let y = 2; y < 6; y++) setPixel(buf, hx, y, sh);
  for (let x = HX0; x < hx; x++) if (alphaAt(buf, x, 3)) setPixel(buf, x, 3, hi);
  for (let x = HX0; x <= HX1; x++) if (alphaAt(buf, x, 2)) setPixel(buf, x, 2, hi);
};

const styleFloppy = (buf, color) => {
  const [hi, base] = shades(color);
  fillBox(buf, HX0, 2, HX1, 4, base);
  for (let x = HX0 - 1; x <= HX1 + 1; x++) setPixel(buf, x, 3, base);
  fillBox(buf, HX0 - 1, 4, HX1 + 1, 5, base);
  for (let x = HX0; x <= HX1; x++) setPixel(buf, x, 5, base);
  for (let x = 6; x <= 12; x++) setPixel(buf, x, 6, base);
  setPixel(buf, 9, 7, base);
  setPixel(buf, 10, 7, base);
  setPixel(buf, 11, 7, base);
  for (let y = 6; y < 9; y++) {
    setPixel(buf, HX0 - 1, y, base);
    setPixel(buf, HX0, y, base);
    setPixel(buf, HX1, y, base);
    setPixel(buf, HX1 + 1, y, base);
  }
  for (let x = HX0; x <= HX1; x++) if (alphaAt(buf, x, 2)) setPixel(buf, x, 2, hi);
  for (const x of [7, 8, 9]) setPixel(buf, x, 6, hi);
};

const styleFrame = (buf, color, skinBase, a) => {
  const [hi, base, sh] = shades(color);
  const length = a.length ?? 17, vol = a.vol ?? 1;
  fillBox(buf, HX0 - 1, 2, HX1 + 1, 5, base);
  for (let x = HX0 - 1; x <= HX1 + 1; x++) setPixel(buf, x, 3, base);
  for (let x = HX0; x <= HX1; x++) setPixel(buf, x, 5, base);
  for (let x = 6; x < 12; x++) setPixel(buf, x, 6, base);
  setPixel(buf, 8, 6, skinBase);
  setPixel(buf, 9, 6, skinBase);
  for (let y = 6; y <= length; y++) {
    for (let dx = 0; dx < vol; dx++) {
      setPixel(buf, HX0 - 1 - dx, y, base);
      setPixel(buf, HX1 + 1 + dx, y, base);
    }
    setPixel(buf, HX0, y, base);
    setPixel(buf, HX1, y, base);
  }
  for (let x = HX0 - 1; x < HX0 + 1; x++) setPixel(buf, x, length + 1, base);
  for (let x = HX1; x < HX1 + 2; x++) setPixel(buf, x, length + 1, base);
  for (let y = 2; y < 6; y++) if (alphaAt(buf, HX1, y)) setPixel(buf, HX1, y, sh);
  for (let x = HX0; x < 9; x++) if (alphaAt(buf, x, 2)) setPixel(buf, x, 2, hi);
};

const HAIR_FNS = { styleShort, styleFloppy, styleFrame };

function drawGlasses(buf) {
  const frame = [60, 54, 62], glint = [236, 240, 246];
  for (const x of [5, 6, 10, 11]) {
    setPixel(buf, x, 8, frame);
    setPixel(buf, x, 10, frame);
  }
  setPixel(buf, 4, 9, frame);
  setPixel(buf, 7, 9, frame);
  setPixel(buf, 9, 9, frame);
  setPixel(buf, 12, 9, frame);
  setPixel(buf, 8, 8, frame);
  setPixel(buf, 4, 8, glint);
  setPixel(buf, 9, 8, glint);
}

function drawHeadGroup(buf, r) {
  const skinBase = SKIN[r.skin].base;
  drawHead(buf, r.skin);
  drawFace(buf, r.skin, r.brow ?? "flat", r.mouth ?? "neutral", r.blush ?? false, r.lashes ?? false);
  if (HAIR_FNS[r.hair]) {
    HAIR_FNS[r.hair](buf, r.hairc, skinBase, r.hairargs ?? {});
  } else {
    styleShort(buf, r.hairc, skinBase, r.hairargs ?? {});
  }
  if (r.glasses) drawGlasses(buf);
}

function drawHeadBack(buf, r) {
  const [, base, sh] = shades(r.hairc);
  const rows = [
    [2, 6, 11], [3, 5, 12], [4, 4, 13], [5, 4, 13], [6, 4, 13],
    [7, 4, 13], [8, 4, 13], [9, 4, 13], [10, 4, 13], [11, 4, 13],
    [12, 4, 13], [13, 5, 12], [14, 6, 11]
  ];
  for (const [y, a, b] of rows) fillBox(buf, a, y, b, y, base);
  const len = r.hair === "styleFrame" ? (r.hairargs?.length ?? 17) : 0;
  for (let y = 11; y <= len; y++) {
    setPixel(buf, HX0 - 1, y, base);
    setPixel(buf, HX0, y, base);
    setPixel(buf, HX1, y, base);
    setPixel(buf, HX1 + 1, y, base);
  }
  for (let y = 4; y <= 12; y++) {
    setPixel(buf, 4, y, sh);
    setPixel(buf, 13, y, sh);
  }
}

const SHOE = [44, 40, 48];
function drawSceneLegs(buf, pants, phase) {
  const [, base, sh] = shades(pants);
  for (const [lx0, lx1] of [[5, 7], [10, 12]]) {
    fillBox(buf, lx0, 25, lx1, 30, base);
    for (let y = 25; y <= 30; y++) setPixel(buf, lx1, y, sh);
  }
  const leftLow = phase !== 1, rightLow = phase !== 2;
  fillBox(buf, 5, leftLow ? 31 : 30, 7, leftLow ? 31 : 30, SHOE);
  fillBox(buf, 10, rightLow ? 31 : 30, 12, rightLow ? 31 : 30, SHOE);
}

function drawSceneTorso(buf, r, back) {
  const [, base, sh] = shades(r.c1);
  fillBox(buf, 4, 18, 13, 18, base);
  fillBox(buf, 3, 19, 14, 19, base);
  fillBox(buf, 4, 20, 13, 24, base);
  for (let y = 20; y <= 24; y++) {
    setPixel(buf, 3, y, sh);
    setPixel(buf, 14, y, sh);
    setPixel(buf, 13, y, sh);
  }

  if (back) {
    fillBox(buf, 6, 18, 11, 18, sh);
    return;
  }

  const skin = SKIN[r.skin];
  if (r.cloth === "suit") {
    const white = [238, 238, 236];
    for (const [x, y] of [[8, 18], [9, 18], [7, 19], [8, 19], [9, 19], [10, 19], [8, 20], [9, 20]]) setPixel(buf, x, y, white);
    if (r.tie) {
      for (let y = 19; y <= 24; y++) {
        setPixel(buf, 8, y, r.tie);
        setPixel(buf, 9, y, r.tie);
      }
    }
  } else if (r.cloth === "dressshirt") {
    if (r.tie) {
      for (let y = 18; y <= 24; y++) {
        setPixel(buf, 8, y, r.tie);
        setPixel(buf, 9, y, r.tie);
      }
    }
  } else if (r.cloth === "blouse") {
    for (const [x, y] of [[7, 18], [8, 18], [9, 18], [10, 18], [8, 19], [9, 19]]) setPixel(buf, x, y, skin.sh);
  }
}

function outlinePass(buf) {
  const pts = [];
  for (let y = 0; y < CUR_H; y++) {
    for (let x = 0; x < CUR_W; x++) {
      if (alphaAt(buf, x, y) !== 0) continue;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        if (alphaAt(buf, x + dx, y + dy) === 255) {
          pts.push([x, y]);
          break;
        }
      }
    }
  }
  for (const [x, y] of pts) setPixel(buf, x, y, OUTLINE);
}

function defaultPants(r) {
  if (r.pants) return r.pants;
  return r.cloth === "suit" ? shades(r.c1)[2] : [54, 56, 70];
}

function composeScene(r, phase, back) {
  CUR_W = SCENE_W;
  CUR_H = SCENE_H;
  const buf = new Uint8ClampedArray(SCENE_W * SCENE_H * 4);
  drawSceneTorso(buf, r, back);
  drawSceneLegs(buf, defaultPants(r), phase);
  if (back) drawHeadBack(buf, r);
  else drawHeadGroup(buf, r);
  outlinePass(buf);
  return buf;
}

// ─────────────────────────────────────────────────────────────────────────────
// The Authentic Character Recipes from Munder Difflin
// ─────────────────────────────────────────────────────────────────────────────
const CHARACTER_RECIPES = {
  michael: {
    skin: "light",
    hairc: [58, 42, 28],
    hair: "styleShort",
    hairargs: { part: "L" },
    cloth: "suit",
    c1: [58, 63, 74],
    tie: [170, 58, 58],
    brow: "flat",
    mouth: "smile"
  },
  jim: {
    skin: "light",
    hairc: [92, 60, 34],
    hair: "styleFloppy",
    cloth: "dressshirt",
    c1: [172, 196, 224],
    tie: [120, 130, 150],
    brow: "flat",
    mouth: "smile"
  },
  kelly: {
    skin: "tan",
    hairc: [24, 18, 22],
    hair: "styleFrame",
    hairargs: { length: 20, vol: 1 },
    cloth: "blouse",
    c1: [212, 90, 158],
    brow: "soft",
    mouth: "smile",
    blush: true,
    lashes: true
  },
  dwight: {
    skin: "light",
    hairc: [64, 48, 28],
    hair: "styleShort",
    hairargs: { part: "L", recede: 1 },
    cloth: "dressshirt",
    c1: [184, 155, 62],
    tie: [120, 82, 46],
    glasses: true,
    brow: "angry",
    mouth: "neutral"
  }
};

class SpriteEngine {
  constructor() {
    this.canvasCache = new Map();
  }

  getSpriteCanvas(charKey, phase = 0, back = false, facingLeft = false) {
    const cacheKey = `${charKey}_${phase}_${back}_${facingLeft}`;
    if (this.canvasCache.has(cacheKey)) {
      return this.canvasCache.get(cacheKey);
    }

    const recipe = CHARACTER_RECIPES[charKey.toLowerCase()] || CHARACTER_RECIPES.michael;
    const buf = composeScene(recipe, phase, back);

    const c = document.createElement('canvas');
    c.width = SCENE_W;
    c.height = SCENE_H;
    const ctx = c.getContext('2d');
    const imgData = ctx.createImageData(SCENE_W, SCENE_H);
    imgData.data.set(buf);
    ctx.putImageData(imgData, 0, 0);

    let finalCanvas = c;
    if (facingLeft) {
      const fc = document.createElement('canvas');
      fc.width = SCENE_W;
      fc.height = SCENE_H;
      const fctx = fc.getContext('2d');
      fctx.translate(SCENE_W, 0);
      fctx.scale(-1, 1);
      fctx.drawImage(c, 0, 0);
      finalCanvas = fc;
    }

    this.canvasCache.set(cacheKey, finalCanvas);
    return finalCanvas;
  }
}

window.SpriteEngine = SpriteEngine;
window.CHARACTER_RECIPES = CHARACTER_RECIPES;
