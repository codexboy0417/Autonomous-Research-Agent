const PORTRAIT_W = 18;
const PORTRAIT_H = 28;
const SCENE_W = 18;
const SCENE_H = 32;
const OUTLINE = [38, 34, 46];
const HX0 = 4, HX1 = 13;
let CUR_W = PORTRAIT_W, CUR_H = PORTRAIT_H;
const clamp$1 = (v2) => v2 < 0 ? 0 : v2 > 255 ? 255 : Math.round(v2);
function shades(rgb, dl2 = 1.22, dd2 = 0.68) {
  return [
    [clamp$1(rgb[0] * dl2), clamp$1(rgb[1] * dl2), clamp$1(rgb[2] * dl2)],
    [rgb[0], rgb[1], rgb[2]],
    [clamp$1(rgb[0] * dd2), clamp$1(rgb[1] * dd2), clamp$1(rgb[2] * dd2)]
  ];
}
function set(buf, x2, y2, c2, a2 = 255) {
  if (x2 < 0 || x2 >= CUR_W || y2 < 0 || y2 >= CUR_H) return;
  const i8 = (y2 * CUR_W + x2) * 4;
  buf[i8] = c2[0];
  buf[i8 + 1] = c2[1];
  buf[i8 + 2] = c2[2];
  buf[i8 + 3] = a2;
}
function alphaAt(buf, x2, y2) {
  if (x2 < 0 || x2 >= CUR_W || y2 < 0 || y2 >= CUR_H) return 0;
  return buf[(y2 * CUR_W + x2) * 4 + 3];
}
function rgbAt(buf, x2, y2) {
  const i8 = (y2 * CUR_W + x2) * 4;
  return [buf[i8], buf[i8 + 1], buf[i8 + 2]];
}
function eq(a2, b2) {
  return a2[0] === b2[0] && a2[1] === b2[1] && a2[2] === b2[2];
}
function rect(buf, x0, y0, x1, y1, c2) {
  for (let y2 = y0; y2 <= y1; y2++) for (let x2 = x0; x2 <= x1; x2++) set(buf, x2, y2, c2);
}
const SKIN = {
  light: { hi: [255, 221, 189], base: [247, 201, 170], sh: [212, 158, 126], line: [168, 112, 82] },
  tan: { hi: [232, 182, 136], base: [214, 162, 116], sh: [176, 126, 86], line: [138, 92, 60] },
  brown: { hi: [180, 130, 94], base: [158, 112, 78], sh: [124, 86, 58], line: [90, 60, 40] },
  dark: { hi: [142, 98, 70], base: [120, 80, 56], sh: [94, 62, 42], line: [64, 42, 28] }
};
function drawHead(buf, skin) {
  const s2 = SKIN[skin];
  for (let y2 = 4; y2 <= 16; y2++) {
    for (let x2 = HX0; x2 <= HX1; x2++) {
      if ((x2 === HX0 || x2 === HX1) && (y2 === 4 || y2 === 5 || y2 === 16) || (x2 === 5 || x2 === 12) && y2 === 4) continue;
      set(buf, x2, y2, s2.base);
    }
  }
  for (let y2 = 6; y2 < 12; y2++) set(buf, 5, y2, s2.hi);
  set(buf, 6, 5, s2.hi);
  set(buf, 7, 5, s2.hi);
  for (let y2 = 6; y2 < 15; y2++) set(buf, 12, y2, s2.sh);
  for (const x2 of [7, 8, 9, 10, 11]) set(buf, x2, 16, s2.sh);
  for (const ex of [HX0 - 1, HX1 + 1]) {
    set(buf, ex, 9, s2.base);
    set(buf, ex, 10, s2.base);
    set(buf, ex, 11, s2.sh);
  }
  rect(buf, 7, 17, 10, 18, s2.sh);
  rect(buf, 7, 17, 9, 17, s2.base);
}
function drawFace(buf, skin, brow, mouth, blush, lashes = false) {
  const s2 = SKIN[skin];
  const white = [250, 248, 244], pup = [46, 38, 42];
  for (const [a2, b2, p2] of [[5, 6, 6], [10, 11, 10]]) {
    set(buf, a2, 9, white);
    set(buf, b2, 9, white);
    set(buf, p2, 9, pup);
  }
  if (lashes) {
    const lash = [54, 40, 48], glint = [252, 250, 248];
    for (const x2 of [5, 6, 10, 11]) set(buf, x2, 8, lash);
    set(buf, 4, 8, lash);
    set(buf, 12, 8, lash);
    set(buf, 5, 9, glint);
    set(buf, 10, 9, glint);
  }
  if (brow === "flat") for (const x2 of [5, 6, 10, 11]) set(buf, x2, 7, s2.line);
  else if (brow === "angry") {
    set(buf, 5, 8, s2.line);
    set(buf, 6, 7, s2.line);
    set(buf, 10, 7, s2.line);
    set(buf, 11, 8, s2.line);
  } else if (brow === "raised") for (const x2 of [5, 6, 10, 11]) set(buf, x2, 6, s2.line);
  else if (brow === "soft") {
    for (const x2 of [5, 11]) set(buf, x2, 7, s2.line);
    for (const x2 of [6, 10]) set(buf, x2, 7, s2.sh);
  }
  set(buf, 8, 11, s2.sh);
  set(buf, 8, 12, s2.sh);
  set(buf, 7, 12, s2.sh);
  const mc2 = [158, 86, 80];
  const mouths = {
    neutral: [[7, 14], [8, 14], [9, 14], [10, 14]],
    smile: [[7, 14], [8, 14], [9, 14], [10, 14], [6, 13], [11, 13]],
    frown: [[7, 15], [8, 15], [9, 15], [10, 15], [6, 14], [11, 14]],
    grin: [[7, 14], [8, 14], [9, 14], [10, 14], [7, 13], [8, 13], [9, 13], [10, 13], [6, 13], [11, 13]]
  };
  for (const [x2, y2] of mouths[mouth]) set(buf, x2, y2, mc2);
  if (blush) for (const x2 of [5, 12]) set(buf, x2, 12, [235, 150, 140], 140);
}
const styleShort = (buf, color2, skinBase, a2) => {
  const [hi2, base2, sh2] = shades(color2);
  const part = a2.part ?? "L", recede = a2.recede ?? 0;
  rect(buf, HX0, 2, HX1, 4, base2);
  for (let x2 = HX0 - 1; x2 <= HX1 + 1; x2++) set(buf, x2, 3, base2);
  rect(buf, HX0 - 1, 4, HX1 + 1, 5, base2);
  for (let y2 = 6; y2 < 9; y2++) {
    set(buf, HX0 - 1, y2, base2);
    set(buf, HX0, y2, base2);
    set(buf, HX1, y2, base2);
    set(buf, HX1 + 1, y2, base2);
  }
  for (let x2 = HX0; x2 <= HX1; x2++) set(buf, x2, 5, base2);
  if (recede) {
    for (let y2 = 3; y2 < 6; y2++) for (let x2 = 6; x2 < 12; x2++) if (eq(rgbAt(buf, x2, y2), base2)) set(buf, x2, y2, skinBase);
    set(buf, 8, 5, base2);
  }
  const hx = part === "L" ? 6 : 11;
  for (let y2 = 2; y2 < 6; y2++) set(buf, hx, y2, sh2);
  for (let x2 = HX0; x2 < hx; x2++) if (alphaAt(buf, x2, 3)) set(buf, x2, 3, hi2);
  for (let x2 = HX0; x2 <= HX1; x2++) if (alphaAt(buf, x2, 2)) set(buf, x2, 2, hi2);
};
const styleFloppy = (buf, color2) => {
  const [hi2, base2] = shades(color2);
  rect(buf, HX0, 2, HX1, 4, base2);
  for (let x2 = HX0 - 1; x2 <= HX1 + 1; x2++) set(buf, x2, 3, base2);
  rect(buf, HX0 - 1, 4, HX1 + 1, 5, base2);
  for (let x2 = HX0; x2 <= HX1; x2++) set(buf, x2, 5, base2);
  for (let x2 = 6; x2 <= 12; x2++) set(buf, x2, 6, base2);
  set(buf, 9, 7, base2);
  set(buf, 10, 7, base2);
  set(buf, 11, 7, base2);
  for (let y2 = 6; y2 < 9; y2++) {
    set(buf, HX0 - 1, y2, base2);
    set(buf, HX0, y2, base2);
    set(buf, HX1, y2, base2);
    set(buf, HX1 + 1, y2, base2);
  }
  for (let x2 = HX0; x2 <= HX1; x2++) if (alphaAt(buf, x2, 2)) set(buf, x2, 2, hi2);
  for (const x2 of [7, 8, 9]) set(buf, x2, 6, hi2);
};
const styleFrame = (buf, color2, skinBase, a2) => {
  const [hi2, base2, sh2] = shades(color2);
  const length2 = a2.length ?? 17, vol = a2.vol ?? 1;
  rect(buf, HX0 - 1, 2, HX1 + 1, 5, base2);
  for (let x2 = HX0 - 1; x2 <= HX1 + 1; x2++) set(buf, x2, 3, base2);
  for (let x2 = HX0; x2 <= HX1; x2++) set(buf, x2, 5, base2);
  for (let x2 = 6; x2 < 12; x2++) set(buf, x2, 6, base2);
  set(buf, 8, 6, skinBase);
  set(buf, 9, 6, skinBase);
  for (let y2 = 6; y2 <= length2; y2++) {
    for (let dx = 0; dx < vol; dx++) {
      set(buf, HX0 - 1 - dx, y2, base2);
      set(buf, HX1 + 1 + dx, y2, base2);
    }
    set(buf, HX0, y2, base2);
    set(buf, HX1, y2, base2);
  }
  for (let x2 = HX0 - 1; x2 < HX0 + 1; x2++) set(buf, x2, length2 + 1, base2);
  for (let x2 = HX1; x2 < HX1 + 2; x2++) set(buf, x2, length2 + 1, base2);
  for (let y2 = 2; y2 < 6; y2++) if (alphaAt(buf, HX1, y2)) set(buf, HX1, y2, sh2);
  for (let x2 = HX0; x2 < 9; x2++) if (alphaAt(buf, x2, 2)) set(buf, x2, 2, hi2);
};
const styleBun = (buf, color2, skinBase) => {
  const [hi2, base2] = shades(color2);
  rect(buf, HX0, 3, HX1, 5, base2);
  for (let x2 = HX0 - 1; x2 <= HX1 + 1; x2++) set(buf, x2, 4, base2);
  for (let x2 = HX0; x2 <= HX1; x2++) set(buf, x2, 5, base2);
  for (let x2 = 6; x2 < 12; x2++) set(buf, x2, 6, base2);
  set(buf, 8, 6, skinBase);
  set(buf, 9, 6, skinBase);
  for (let y2 = 6; y2 < 9; y2++) {
    set(buf, HX0, y2, base2);
    set(buf, HX1, y2, base2);
  }
  rect(buf, 7, 1, 10, 2, base2);
  for (let x2 = HX0; x2 <= HX1; x2++) if (alphaAt(buf, x2, 3)) set(buf, x2, 3, hi2);
};
const styleCurly = (buf, color2, skinBase) => {
  const [hi2, base2] = shades(color2);
  const pts = [
    [4, 3],
    [5, 2],
    [6, 3],
    [7, 2],
    [8, 3],
    [9, 2],
    [10, 3],
    [11, 2],
    [12, 3],
    [13, 3],
    [3, 4],
    [4, 4],
    [13, 4],
    [14, 4],
    [3, 5],
    [4, 5],
    [13, 5],
    [14, 5],
    [3, 6],
    [13, 6],
    [4, 6],
    [12, 6],
    [3, 7],
    [13, 7],
    [4, 7]
  ];
  rect(buf, HX0, 3, HX1, 5, base2);
  for (let x2 = HX0 - 1; x2 <= HX1 + 1; x2++) set(buf, x2, 4, base2);
  for (const [x2, y2] of pts) set(buf, x2, y2, base2);
  for (let x2 = 6; x2 < 12; x2++) set(buf, x2, 6, base2);
  set(buf, 8, 6, skinBase);
  set(buf, 9, 6, skinBase);
  for (const [x2, y2] of [[5, 2], [7, 2], [9, 2], [11, 2]]) set(buf, x2, y2, hi2);
};
const styleMessy = (buf, color2, skinBase, a2) => {
  const [hi2, base2] = shades(color2);
  const length2 = a2.length ?? 8;
  rect(buf, HX0 - 1, 2, HX1 + 1, 5, base2);
  const spikes = [[3, 2], [5, 1], [7, 2], [9, 1], [11, 2], [13, 1], [14, 2], [4, 2], [12, 2]];
  for (const [x2, y2] of spikes) set(buf, x2, y2, base2);
  for (let x2 = HX0; x2 <= HX1; x2++) set(buf, x2, 5, base2);
  for (let x2 = 6; x2 < 12; x2++) set(buf, x2, 6, base2);
  set(buf, 8, 6, skinBase);
  set(buf, 9, 6, skinBase);
  for (let y2 = 6; y2 <= length2; y2++) {
    set(buf, HX0 - 1, y2, base2);
    set(buf, HX0, y2, base2);
    set(buf, HX1, y2, base2);
    set(buf, HX1 + 1, y2, base2);
  }
  for (const [x2, y2] of spikes) set(buf, x2, y2, hi2);
};
const styleRecede = (buf, color2, skinBase) => {
  const [, base2, sh2] = shades(color2);
  for (let y2 = 4; y2 < 10; y2++) {
    set(buf, HX0 - 1, y2, base2);
    set(buf, HX0, y2, base2);
    set(buf, HX1, y2, base2);
    set(buf, HX1 + 1, y2, base2);
  }
  for (let x2 = HX0; x2 <= HX1; x2++) set(buf, x2, 4, base2);
  for (let x2 = HX0 + 1; x2 < HX1; x2++) set(buf, x2, 5, base2);
  for (let y2 = 5; y2 < 9; y2++) for (let x2 = 6; x2 < 12; x2++) if (eq(rgbAt(buf, x2, y2), base2)) set(buf, x2, y2, skinBase);
  for (let x2 = HX0; x2 <= HX1; x2++) if (alphaAt(buf, x2, 4)) set(buf, x2, 4, sh2);
};
const styleSpiky = (buf, color2, skinBase) => {
  const [hi2, base2] = shades(color2);
  rect(buf, HX0, 3, HX1, 5, base2);
  for (let x2 = HX0 - 1; x2 <= HX1 + 1; x2++) set(buf, x2, 4, base2);
  for (let x2 = HX0; x2 <= HX1; x2++) set(buf, x2, 5, base2);
  const spikes = [[5, 2], [7, 1], [9, 2], [11, 1], [6, 2], [8, 2], [10, 2], [12, 2]];
  for (const [x2, y2] of spikes) set(buf, x2, y2, base2);
  for (let x2 = 6; x2 < 12; x2++) set(buf, x2, 6, base2);
  set(buf, 8, 6, skinBase);
  set(buf, 9, 6, skinBase);
  for (let y2 = 6; y2 < 8; y2++) {
    set(buf, HX0, y2, base2);
    set(buf, HX1, y2, base2);
  }
  for (const [x2, y2] of spikes) set(buf, x2, y2, hi2);
};
const styleBald = (buf, color2, skinBase, a2) => {
  const [shi, sbase, ssh] = shades(skinBase, 1.1, 0.82);
  for (let x2 = 6; x2 <= 11; x2++) set(buf, x2, 2, sbase);
  for (let x2 = 5; x2 <= 12; x2++) set(buf, x2, 3, sbase);
  for (let x2 = HX0; x2 <= HX1; x2++) set(buf, x2, 4, sbase);
  for (const x2 of [7, 8, 9]) set(buf, x2, 2, shi);
  set(buf, 6, 3, shi);
  set(buf, 7, 3, shi);
  set(buf, 5, 3, ssh);
  set(buf, 12, 3, ssh);
  set(buf, HX1, 4, ssh);
  const [, base2, sh2] = shades(color2);
  const top2 = a2.recede ? 8 : 6;
  for (let y2 = top2; y2 <= 10; y2++) {
    set(buf, HX0 - 1, y2, base2);
    set(buf, HX0, y2, base2);
    set(buf, HX1, y2, base2);
    set(buf, HX1 + 1, y2, base2);
  }
  for (let y2 = top2; y2 <= 10; y2++) {
    set(buf, HX0 - 1, y2, sh2);
    set(buf, HX1 + 1, y2, sh2);
  }
};
const HAIR_FNS = { styleShort, styleFloppy, styleFrame, styleBun, styleCurly, styleMessy, styleRecede, styleSpiky, styleBald };
function drawFacial(buf, kind, color2) {
  const [, base2, sh2] = shades(color2);
  if (kind === "mustache") {
    for (const x2 of [6, 7, 8, 9, 10]) set(buf, x2, 13, base2);
    set(buf, 6, 12, base2);
    set(buf, 10, 12, base2);
  } else if (kind === "mustacheSm") {
    for (const x2 of [7, 8, 9]) set(buf, x2, 13, base2);
  } else if (kind === "stubble") {
    for (const [x2, y2] of [[5, 14], [6, 15], [7, 15], [8, 15], [9, 15], [10, 15], [11, 14], [12, 13], [4, 13], [5, 15], [10, 15]])
      set(buf, x2, y2, sh2, 150);
  } else if (kind === "goatee") {
    for (const x2 of [8, 9]) set(buf, x2, 15, base2);
    set(buf, 8, 14, base2);
    set(buf, 9, 14, base2);
    for (const x2 of [7, 8, 9, 10]) set(buf, x2, 13, base2);
  }
}
function drawGlasses(buf) {
  const frame = [60, 54, 62];
  const glint = [236, 240, 246];
  for (const x2 of [5, 6]) {
    set(buf, x2, 8, frame);
    set(buf, x2, 10, frame);
  }
  set(buf, 4, 9, frame);
  set(buf, 7, 9, frame);
  set(buf, 4, 8, frame);
  set(buf, 7, 8, frame);
  for (const x2 of [10, 11]) {
    set(buf, x2, 8, frame);
    set(buf, x2, 10, frame);
  }
  set(buf, 9, 9, frame);
  set(buf, 12, 9, frame);
  set(buf, 9, 8, frame);
  set(buf, 12, 8, frame);
  set(buf, 8, 8, frame);
  set(buf, 3, 9, frame);
  set(buf, 13, 9, frame);
  set(buf, 4, 8, glint);
  set(buf, 9, 8, glint);
}
function bodyShape(buf, col, heavy = false) {
  const [, base2, sh2] = shades(col);
  const rows = heavy ? [[19, 5, 12], [20, 3, 14], [21, 2, 15], [22, 1, 16], [23, 1, 16], [24, 0, 17], [25, 0, 17], [26, 0, 17], [27, 0, 17]] : [[19, 6, 11], [20, 4, 13], [21, 3, 14], [22, 2, 15], [23, 2, 15], [24, 1, 16], [25, 1, 16], [26, 1, 16], [27, 1, 16]];
  for (const [y2, a2, b2] of rows) rect(buf, a2, y2, b2, y2, base2);
  const [lo, hi2] = heavy ? [1, 16] : [2, 15];
  for (let y2 = 22; y2 < 28; y2++) {
    set(buf, lo, y2, sh2);
    set(buf, hi2, y2, sh2);
  }
}
function drawClothing(buf, kind, c1, c2, tie, skin, heavy = false) {
  const [hi2, base2, sh2] = shades(c1);
  bodyShape(buf, c1, heavy);
  if (kind === "suit") {
    const white = [238, 238, 236];
    for (const [x2, y2] of [[8, 19], [9, 19], [7, 20], [8, 20], [9, 20], [10, 20], [8, 21], [9, 21]]) set(buf, x2, y2, white);
    for (const [x2, y2] of [[6, 20], [7, 21], [11, 20], [10, 21], [6, 21], [11, 21]]) set(buf, x2, y2, sh2);
    if (tie) {
      for (let y2 = 20; y2 < 26; y2++) {
        set(buf, 8, y2, tie);
        set(buf, 9, y2, tie);
      }
      set(buf, 8, 20, shades(tie)[0]);
    } else for (let y2 = 22; y2 < 26; y2++) {
      set(buf, 8, y2, white);
      set(buf, 9, y2, white);
    }
  } else if (kind === "dressshirt") {
    for (const [x2, y2] of [[6, 19], [7, 19], [10, 19], [11, 19], [7, 20], [10, 20]]) set(buf, x2, y2, sh2);
    for (let y2 = 20; y2 < 27; y2 += 2) set(buf, 8, y2, sh2);
    if (tie) for (let y2 = 19; y2 < 26; y2++) {
      set(buf, 8, y2, tie);
      set(buf, 9, y2, tie);
    }
  } else if (kind === "polo") {
    for (const [x2, y2] of [[6, 19], [7, 19], [10, 19], [11, 19]]) set(buf, x2, y2, hi2);
    set(buf, 8, 20, sh2);
    set(buf, 8, 22, sh2);
    const accent = c2 ? shades(c2)[1] : hi2;
    for (const [x2, y2] of [[7, 20], [9, 20]]) set(buf, x2, y2, accent);
  } else if (kind === "blouse") {
    const s2 = SKIN[skin];
    for (const [x2, y2] of [[7, 19], [8, 19], [9, 19], [10, 19], [8, 20], [9, 20]]) set(buf, x2, y2, s2.sh);
    for (let x2 = 5; x2 < 13; x2++) if (eq(rgbAt(buf, x2, 20), base2)) set(buf, x2, 20, hi2);
  } else if (kind === "cardigan") {
    const inner = c2 ? shades(c2)[1] : [235, 233, 226];
    for (let y2 = 19; y2 < 27; y2++) {
      set(buf, 8, y2, inner);
      set(buf, 9, y2, inner);
    }
    for (const [x2, y2] of [[6, 19], [7, 19], [10, 19], [11, 19]]) set(buf, x2, y2, sh2);
  } else if (kind === "sweater") {
    for (const [x2, y2] of [[6, 19], [7, 19], [8, 19], [9, 19], [10, 19], [11, 19]]) set(buf, x2, y2, sh2);
  }
}
function collarNeck(buf, skin) {
  rect(buf, 7, 18, 10, 19, SKIN[skin].sh);
}
const SHOE = [44, 40, 48];
function drawSceneLegs(buf, pants, phase) {
  const [, base2, sh2] = shades(pants);
  for (const [lx0, lx1] of [[5, 7], [10, 12]]) {
    rect(buf, lx0, 25, lx1, 30, base2);
    for (let y2 = 25; y2 <= 30; y2++) set(buf, lx1, y2, sh2);
  }
  const leftLow = phase !== 1, rightLow = phase !== 2;
  rect(buf, 5, leftLow ? 31 : 30, 7, leftLow ? 31 : 30, SHOE);
  rect(buf, 10, rightLow ? 31 : 30, 12, rightLow ? 31 : 30, SHOE);
}
function drawSceneTorso(buf, r6, back) {
  const [hi2, base2, sh2] = shades(r6.c1);
  if (r6.heavy) {
    rect(buf, 3, 18, 14, 18, base2);
    rect(buf, 2, 19, 15, 19, base2);
    rect(buf, 2, 20, 15, 24, base2);
    for (let y2 = 20; y2 <= 24; y2++) {
      set(buf, 2, y2, sh2);
      set(buf, 15, y2, sh2);
      set(buf, 14, y2, sh2);
    }
  } else {
    rect(buf, 4, 18, 13, 18, base2);
    rect(buf, 3, 19, 14, 19, base2);
    rect(buf, 4, 20, 13, 24, base2);
    for (let y2 = 20; y2 <= 24; y2++) {
      set(buf, 3, y2, sh2);
      set(buf, 14, y2, sh2);
      set(buf, 13, y2, sh2);
    }
  }
  if (back) {
    rect(buf, 6, 18, 11, 18, sh2);
    for (let y2 = 19; y2 <= 24; y2++) set(buf, 8, y2, sh2);
    return;
  }
  const skin = SKIN[r6.skin];
  if (r6.cloth === "suit") {
    const white = [238, 238, 236];
    for (const [x2, y2] of [[8, 18], [9, 18], [7, 19], [8, 19], [9, 19], [10, 19], [8, 20], [9, 20]]) set(buf, x2, y2, white);
    for (const [x2, y2] of [[6, 19], [7, 20], [11, 19], [10, 20]]) set(buf, x2, y2, sh2);
    if (r6.tie) {
      for (let y2 = 19; y2 <= 24; y2++) {
        set(buf, 8, y2, r6.tie);
        set(buf, 9, y2, r6.tie);
      }
      set(buf, 8, 19, shades(r6.tie)[0]);
    }
  } else if (r6.cloth === "dressshirt") {
    for (const [x2, y2] of [[6, 18], [7, 18], [10, 18], [11, 18], [7, 19], [10, 19]]) set(buf, x2, y2, sh2);
    if (r6.tie) for (let y2 = 18; y2 <= 24; y2++) {
      set(buf, 8, y2, r6.tie);
      set(buf, 9, y2, r6.tie);
    }
    else for (let y2 = 20; y2 <= 24; y2 += 2) set(buf, 8, y2, sh2);
  } else if (r6.cloth === "polo") {
    for (const [x2, y2] of [[6, 18], [7, 18], [10, 18], [11, 18]]) set(buf, x2, y2, hi2);
    set(buf, 8, 19, sh2);
    set(buf, 8, 21, sh2);
  } else if (r6.cloth === "blouse") {
    for (const [x2, y2] of [[7, 18], [8, 18], [9, 18], [10, 18], [8, 19], [9, 19]]) set(buf, x2, y2, skin.sh);
    for (let x2 = 5; x2 < 13; x2++) if (eq(rgbAt(buf, x2, 19), base2)) set(buf, x2, 19, hi2);
  } else if (r6.cloth === "cardigan") {
    const inner = r6.c2 ? shades(r6.c2)[1] : [235, 233, 226];
    for (let y2 = 18; y2 <= 24; y2++) {
      set(buf, 8, y2, inner);
      set(buf, 9, y2, inner);
    }
    for (const [x2, y2] of [[6, 18], [7, 18], [10, 18], [11, 18]]) set(buf, x2, y2, sh2);
  } else if (r6.cloth === "sweater") {
    for (const [x2, y2] of [[6, 18], [7, 18], [8, 18], [9, 18], [10, 18], [11, 18]]) set(buf, x2, y2, sh2);
  }
}
function drawHeadBack(buf, r6) {
  const s2 = SKIN[r6.skin];
  if (r6.hair === "styleBald") {
    drawHeadBackBald(buf, r6);
    return;
  }
  const [hi2, base2, sh2] = shades(r6.hairc);
  const rows = [
    [2, 6, 11],
    [3, 5, 12],
    [4, 4, 13],
    [5, 4, 13],
    [6, 4, 13],
    [7, 4, 13],
    [8, 4, 13],
    [9, 4, 13],
    [10, 4, 13],
    [11, 4, 13],
    [12, 4, 13],
    [13, 5, 12],
    [14, 6, 11]
  ];
  for (const [y2, a2, b2] of rows) rect(buf, a2, y2, b2, y2, base2);
  const len = r6.hair === "styleFrame" ? r6.hairargs?.length ?? 17 : r6.hair === "styleMessy" ? r6.hairargs?.length ?? 9 : 0;
  for (let y2 = 11; y2 <= len; y2++) {
    set(buf, HX0 - 1, y2, base2);
    set(buf, HX0, y2, base2);
    set(buf, HX1, y2, base2);
    set(buf, HX1 + 1, y2, base2);
  }
  for (let y2 = 4; y2 <= 12; y2++) {
    set(buf, 4, y2, sh2);
    set(buf, 13, y2, sh2);
  }
  for (const [x2, y2] of [[5, 3], [12, 3], [5, 13], [12, 13], [6, 14], [11, 14]]) set(buf, x2, y2, sh2);
  for (const [x2, y2] of [[7, 2], [8, 2], [9, 2], [10, 2], [7, 3], [8, 3], [9, 3]]) set(buf, x2, y2, hi2);
  for (let y2 = 4; y2 <= 11; y2++) set(buf, 9, y2, hi2);
  for (let y2 = 4; y2 <= 12; y2++) set(buf, 8, y2, sh2);
  rect(buf, 7, 14, 10, 14, sh2);
  rect(buf, 7, 15, 10, 17, s2.sh);
  rect(buf, 7, 15, 9, 15, s2.base);
}
function drawHeadBackBald(buf, r6) {
  const s2 = SKIN[r6.skin];
  const [shi, sbase, ssh] = shades(s2.base, 1.1, 0.82);
  const rows = [
    [2, 6, 11],
    [3, 5, 12],
    [4, 4, 13],
    [5, 4, 13],
    [6, 4, 13],
    [7, 4, 13],
    [8, 4, 13],
    [9, 4, 13],
    [10, 4, 13],
    [11, 4, 13],
    [12, 4, 13],
    [13, 5, 12],
    [14, 6, 11]
  ];
  for (const [y2, a2, b2] of rows) rect(buf, a2, y2, b2, y2, sbase);
  for (let y2 = 4; y2 <= 12; y2++) {
    set(buf, 4, y2, ssh);
    set(buf, 13, y2, ssh);
  }
  for (const [x2, y2] of [[7, 2], [8, 2], [9, 2], [8, 3], [9, 4], [9, 5]]) set(buf, x2, y2, shi);
  const [, base2, sh2] = shades(r6.hairc);
  for (let x2 = 4; x2 <= 13; x2++) {
    set(buf, x2, 11, base2);
    set(buf, x2, 12, base2);
  }
  for (const x2 of [4, 13]) {
    set(buf, x2, 11, sh2);
    set(buf, x2, 12, sh2);
  }
  rect(buf, 7, 14, 10, 14, s2.sh);
  rect(buf, 7, 15, 10, 17, s2.sh);
  rect(buf, 7, 15, 9, 15, s2.base);
}
function drawSceneBody(buf, r6, phase, back) {
  drawSceneTorso(buf, r6, back);
  drawSceneLegs(buf, defaultPants(r6), phase);
}
function outlinePass(buf) {
  const pts = [];
  for (let y2 = 0; y2 < CUR_H; y2++) {
    for (let x2 = 0; x2 < CUR_W; x2++) {
      if (alphaAt(buf, x2, y2) !== 0) continue;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        if (alphaAt(buf, x2 + dx, y2 + dy) === 255) {
          pts.push([x2, y2]);
          break;
        }
      }
    }
  }
  for (const [x2, y2] of pts) set(buf, x2, y2, OUTLINE);
}
function drawHeavyFace(buf, skin) {
  const s2 = SKIN[skin];
  for (let y2 = 11; y2 <= 15; y2++) {
    set(buf, HX0 - 1, y2, s2.base);
    set(buf, HX1 + 1, y2, s2.base);
  }
  set(buf, HX0 - 1, 15, s2.sh);
  set(buf, HX1 + 1, 15, s2.sh);
  for (const x2 of [5, 6, 11, 12]) set(buf, x2, 16, s2.base);
  rect(buf, 6, 17, 11, 18, s2.base);
  for (const x2 of [6, 7, 8, 9, 10, 11]) set(buf, x2, 18, s2.sh);
  set(buf, 7, 17, s2.sh);
  set(buf, 10, 17, s2.sh);
}
const RECIPES = {
  michael: { skin: "light", hairc: [58, 42, 28], hair: "styleShort", hairargs: { part: "L" }, cloth: "suit", c1: [58, 63, 74], tie: [170, 58, 58], brow: "flat", mouth: "smile" },
  jim: { skin: "light", hairc: [92, 60, 34], hair: "styleFloppy", cloth: "dressshirt", c1: [172, 196, 224], tie: [120, 130, 150], brow: "flat", mouth: "smile" },
  pam: { skin: "light", hairc: [120, 76, 42], hair: "styleFrame", hairargs: { length: 18, vol: 2 }, cloth: "cardigan", c1: [236, 174, 192], c2: [244, 242, 238], brow: "soft", mouth: "smile", blush: true, lashes: true },
  dwight: { skin: "light", hairc: [64, 48, 28], hair: "styleShort", hairargs: { part: "L", recede: 1 }, cloth: "dressshirt", c1: [184, 155, 62], tie: [120, 82, 46], glasses: true, brow: "angry", mouth: "neutral" },
  kevin: { skin: "light", hairc: [58, 44, 30], hair: "styleBald", cloth: "polo", c1: [110, 140, 180], c2: [90, 120, 160], brow: "flat", mouth: "neutral", heavy: true },
  angela: { skin: "light", hairc: [186, 154, 90], hair: "styleBun", cloth: "cardigan", c1: [150, 146, 170], c2: [235, 233, 226], brow: "angry", mouth: "frown", lashes: true },
  oscar: { skin: "tan", hairc: [28, 22, 18], hair: "styleShort", hairargs: { part: "L" }, cloth: "sweater", c1: [122, 60, 74], brow: "flat", mouth: "smile" },
  stanley: { skin: "dark", hairc: [60, 54, 48], hair: "styleRecede", cloth: "dressshirt", c1: [150, 120, 86], tie: [120, 78, 52], glasses: true, facial: "mustache", brow: "flat", mouth: "neutral", heavy: true },
  phyllis: { skin: "light", hairc: [196, 162, 110], hair: "styleCurly", cloth: "blouse", c1: [202, 160, 192], glasses: true, brow: "soft", mouth: "smile", lashes: true, heavy: true },
  andy: { skin: "light", hairc: [74, 51, 32], hair: "styleShort", hairargs: { part: "R" }, cloth: "polo", c1: [176, 65, 58], c2: [150, 50, 46], brow: "raised", mouth: "smile" },
  kelly: { skin: "tan", hairc: [24, 18, 22], hair: "styleFrame", hairargs: { length: 20, vol: 1 }, cloth: "blouse", c1: [212, 90, 158], brow: "soft", mouth: "smile", blush: true, lashes: true },
  ryan: { skin: "light", hairc: [42, 32, 24], hair: "styleSpiky", cloth: "suit", c1: [58, 58, 68], tie: [40, 40, 50], brow: "flat", mouth: "neutral" },
  toby: { skin: "light", hairc: [106, 90, 66], hair: "styleShort", hairargs: { part: "L", recede: 1 }, cloth: "dressshirt", c1: [150, 150, 120], facial: "mustacheSm", brow: "soft", mouth: "frown" },
  creed: { skin: "light", hairc: [170, 166, 156], hair: "styleBald", cloth: "dressshirt", c1: [126, 130, 96], facial: "stubble", brow: "flat", mouth: "neutral" },
  meredith: { skin: "light", hairc: [154, 82, 46], hair: "styleMessy", hairargs: { length: 15 }, cloth: "blouse", c1: [176, 86, 74], brow: "raised", mouth: "smile", lashes: true }
};
function drawHeadGroup(buf, r6) {
  const skinBase = SKIN[r6.skin].base;
  drawHead(buf, r6.skin);
  if (r6.heavy) drawHeavyFace(buf, r6.skin);
  drawFace(buf, r6.skin, r6.brow ?? "flat", r6.mouth ?? "neutral", r6.blush ?? false, r6.lashes ?? false);
  if (r6.facial) drawFacial(buf, r6.facial, r6.hairc);
  HAIR_FNS[r6.hair](buf, r6.hairc, skinBase, r6.hairargs ?? {});
  if (r6.glasses) drawGlasses(buf);
}
function defaultPants(r6) {
  if (r6.pants) return r6.pants;
  return r6.cloth === "suit" ? shades(r6.c1)[2] : [54, 56, 70];
}
function compose$2(r6) {
  CUR_W = PORTRAIT_W;
  CUR_H = PORTRAIT_H;
  const buf = new Uint8ClampedArray(PORTRAIT_W * PORTRAIT_H * 4);
  drawClothing(buf, r6.cloth, r6.c1, r6.c2, r6.tie, r6.skin, r6.heavy ?? false);
  collarNeck(buf, r6.skin);
  drawHeadGroup(buf, r6);
  outlinePass(buf);
  return buf;
}
function composeScene(r6, phase, back) {
  CUR_W = SCENE_W;
  CUR_H = SCENE_H;
  const buf = new Uint8ClampedArray(SCENE_W * SCENE_H * 4);
  drawSceneBody(buf, r6, phase, back);
  if (back) drawHeadBack(buf, r6);
  else drawHeadGroup(buf, r6);
  outlinePass(buf);
  return buf;
}
const bufCache = /* @__PURE__ */ new Map();
const sceneCache = /* @__PURE__ */ new Map();
function getBuf(name2) {
  let buf = bufCache.get(name2);
  if (!buf) {
    buf = compose$2(RECIPES[name2] ?? RECIPES.jim);
    bufCache.set(name2, buf);
  }
  return buf;
}
function sceneFrameBufs(name2) {
  let frames = sceneCache.get(name2);
  if (!frames) {
    const r6 = RECIPES[name2] ?? RECIPES.jim;
    frames = {
      front: [composeScene(r6, 0, false), composeScene(r6, 1, false), composeScene(r6, 2, false)],
      back: [composeScene(r6, 0, true), composeScene(r6, 1, true), composeScene(r6, 2, true)]
    };
    sceneCache.set(name2, frames);
  }
  return frames;
}
function paintPortrait(ctx, name2, scale = 2) {
  const buf = getBuf(name2);
  const stage = document.createElement("canvas");
  stage.width = PORTRAIT_W;
  stage.height = PORTRAIT_H;
  const sctx = stage.getContext("2d");
  const img = sctx.createImageData(PORTRAIT_W, PORTRAIT_H);
  img.data.set(buf);
  sctx.putImageData(img, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, PORTRAIT_W * scale, PORTRAIT_H * scale);
}

if (typeof window !== 'undefined') {
  window.AvatarGenerator = {
    RECIPES,
    getBuf,
    sceneFrameBufs,
    paintPortrait,
    PORTRAIT_W,
    PORTRAIT_H,
    SCENE_W,
    SCENE_H
  };
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    RECIPES,
    getBuf,
    sceneFrameBufs,
    paintPortrait,
    PORTRAIT_W,
    PORTRAIT_H,
    SCENE_W,
    SCENE_H
  };
}
