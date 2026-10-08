/**
 * Munder Difflin Office Simulation & Choreography Engine
 * 100% Faithful to Munder Difflin:
 * - Living Idle Office Life: coffee, pantry, dustbin trash, plant watering, casual strolls & chats
 * - Multi-Agent Task Choreography:
 *    1. Manager (Michael) receives directive & analyzes in CEO cabin
 *    2. All employees (Jim, Kelly, Dwight) walk into Manager's cabin for task briefing
 *    3. Employees walk to individual workstations (PC-1, PC-2, PC-3) and perform deep RAG work
 *    4. All 4 agents gather in the Red Chair Room (Boardroom) for final verification & synthesis
 *    5. Output renders in Dossier tab, confetti cheer, then return to office life
 * - Zero Chopped Heads: all tile layers drawn before characters; desk chairs properly anchored
 * - Anti-Collision Speech Bubbles: stack vertically when characters are near each other
 * - High-DPI physical backing store with integer 2x retro pixel scaling
 */

class OfficeCanvas {
  constructor(canvasEl) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.container = canvasEl.parentElement;
    this.map = null;
    this.tilesets = {};
    this.walkGrid = [];
    this.spawnPoints = {};
    this.spriteSheets = {};

    this.lastTime = performance.now();
    this.scale = 2;
    this.offsetX = 0;
    this.offsetY = 0;
    this.viewW = 800;
    this.viewH = 600;

    // Choreography & Mission state
    this.isMissionActive = false;
    this.missionPhase = 'idle'; // 'idle', 'manager_thinking', 'cabin_briefing', 'desk_work', 'boardroom_meeting'
    this.missionTimer = 0;
    this.currentQuery = '';

    // 6 Agents matching the 6 Python decorators:
    this.agents = [
      {
        id: 'The_Boss',
        recipeKey: 'michael',
        name: 'Michael',
        role: 'BOSS',
        seatTile: { x: 3, y: 4 },    // CEO desk
        seatDirection: 'down',
        px: 16 * 16 + 8,             // Starts at front door
        py: 20 * 16 + 16,
        path: [],
        direction: 'up',
        phase: 0,
        walkDist: 0,
        isSitting: false,
        working: false,
        thought: 'entering office...',
        thoughtTimer: 4.0,
        extraLift: 0,
        speed: 48,
        idleCooldown: 6.0
      },
      {
        id: 'Dr_Arxiv',
        recipeKey: 'jim',
        name: 'Jim',
        role: 'DISCOVERY',
        seatTile: { x: 2, y: 13 },   // PC-1
        seatDirection: 'up',
        px: 2 * 16 + 8,
        py: 13 * 16 + 16,
        path: [],
        direction: 'up',
        phase: 0,
        walkDist: 0,
        isSitting: true,
        working: false,
        thought: 'reading arxiv papers...',
        thoughtTimer: 5.0,
        extraLift: 0,
        speed: 48,
        idleCooldown: 12.0
      },
      {
        id: 'Vera_Audit',
        recipeKey: 'dwight',
        name: 'Dwight',
        role: 'INTEGRITY',
        seatTile: { x: 6, y: 13 },   // PC-2
        seatDirection: 'up',
        px: 6 * 16 + 8,
        py: 13 * 16 + 16,
        path: [],
        direction: 'up',
        phase: 0,
        walkDist: 0,
        isSitting: true,
        working: false,
        thought: 'fact checking...',
        thoughtTimer: 5.0,
        extraLift: 0,
        speed: 48,
        idleCooldown: 14.0
      },
      {
        id: 'Data_Dex',
        recipeKey: 'kelly',
        name: 'Kelly',
        role: 'GAP RADAR',
        seatTile: { x: 10, y: 13 },  // PC-3
        seatDirection: 'up',
        px: 26 * 16 + 8,             // Starts at pantry coffee counter
        py: 20 * 16 + 16,
        path: [],
        direction: 'up',
        phase: 0,
        walkDist: 0,
        isSitting: false,
        working: false,
        thought: 'just five more minutes',
        thoughtTimer: 6.0,
        extraLift: 0,
        speed: 48,
        idleCooldown: 10.0
      },
      {
        id: 'Pam_Reproduce',
        recipeKey: 'pam',
        name: 'Pam',
        role: 'REPRO RUBRIC',
        seatTile: { x: 14, y: 13 },  // PC-4
        seatDirection: 'up',
        px: 14 * 16 + 8,
        py: 13 * 16 + 16,
        path: [],
        direction: 'up',
        phase: 0,
        walkDist: 0,
        isSitting: true,
        working: false,
        thought: 'checking reproducibility rubrics...',
        thoughtTimer: 5.0,
        extraLift: 0,
        speed: 48,
        idleCooldown: 11.0
      },
      {
        id: 'Ryan_Consensus',
        recipeKey: 'ryan',
        name: 'Ryan',
        role: 'CONSENSUS',
        seatTile: { x: 18, y: 13 },  // PC-5
        seatDirection: 'up',
        px: 18 * 16 + 8,
        py: 13 * 16 + 16,
        path: [],
        direction: 'up',
        phase: 0,
        walkDist: 0,
        isSitting: true,
        working: false,
        thought: 'cross-referencing empirical consensus...',
        thoughtTimer: 5.0,
        extraLift: 0,
        speed: 48,
        idleCooldown: 13.0
      }
    ];

    window.addEventListener('resize', () => this.resizeCanvas());
  }

  async init() {
    // 1. Load map data
    const mapRes = await fetch('/static/assets/office-map.json');
    this.map = await mapRes.json();

    // 2. Parse collision and spawn points
    this.parseCollisionAndSpawns();

    // 3. Load tilesets
    const loadImg = (src) => new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });

    const [officeTileset, a5Floors, interiors] = await Promise.all([
      loadImg('/static/assets/office-tileset-CHQT-uYL.png'),
      loadImg('/static/assets/a5-floors-walls.png'),
      loadImg('/static/assets/interiors-CQGBjffT.png')
    ]);

    this.tilesets = {
      office: officeTileset,
      a5: a5Floors,
      interiors: interiors
    };

    // 4. Pre-render sprite frames
    this.prerenderSprites();

    // 5. Initial resize
    this.resizeCanvas();

    // 6. Michael's opening entrance walk
    const boss = this.agents[0];
    this.walkAgentTo(boss, boss.seatTile, () => {
      boss.isSitting = true;
      boss.direction = 'down';
      boss.thought = 'running the floor';
      boss.thoughtTimer = 6.0;
    });

    // 7. Start render loop
    requestAnimationFrame((t) => this.renderLoop(t));
  }

  parseCollisionAndSpawns() {
    const w = this.map.width;
    const h = this.map.height;
    const collisionLayer = this.map.layers.find(l => l.name === 'collision');
    this.walkGrid = Array.from({ length: h }, () => Array(w).fill(true));

    if (collisionLayer && collisionLayer.data) {
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const rawId = collisionLayer.data[y * w + x];
          if ((rawId & 0x1FFFFFFF) !== 0) {
            this.walkGrid[y][x] = false;
          }
        }
      }
    }

    // Force key spawn and workstation points walkable
    const spawnLayer = this.map.layers.find(l => l.name === 'spawn-points');
    if (spawnLayer && spawnLayer.objects) {
      for (const obj of spawnLayer.objects) {
        const tx = Math.floor(obj.x / 16);
        const ty = Math.floor(obj.y / 16);
        this.spawnPoints[obj.name] = { x: tx, y: ty };
        if (this.walkGrid[ty]) this.walkGrid[ty][tx] = true;
      }
    }

    // Ensure CEO cabin visitor spots are walkable
    this.walkGrid[5][5] = true;
    this.walkGrid[6][5] = true;
    this.walkGrid[5][6] = true;

    // Ensure Boardroom conference meeting spots around red chairs are walkable
    this.walkGrid[7][13] = true; // Boardroom head
    this.walkGrid[7][11] = true; // Boardroom west
    this.walkGrid[7][15] = true; // Boardroom east
    this.walkGrid[6][10] = true; // Boardroom side
  }

  prerenderSprites() {
    if (!window.AvatarGenerator) return;

    for (const ag of this.agents) {
      const bufs = window.AvatarGenerator.sceneFrameBufs(ag.recipeKey);
      this.spriteSheets[ag.recipeKey] = {
        front: bufs.front.map(b => this.bufToCanvas(b, 18, 32)),
        back:  bufs.back.map(b => this.bufToCanvas(b, 18, 32))
      };
    }
  }

  bufToCanvas(buf, w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    const imgData = ctx.createImageData(w, h);
    imgData.data.set(buf);
    ctx.putImageData(imgData, 0, 0);
    return c;
  }

  resizeCanvas() {
    if (!this.container) return;
    const rect = this.container.getBoundingClientRect();
    const dpr = Math.max(window.devicePixelRatio || 1, 2);

    this.viewW = rect.width;
    this.viewH = rect.height;

    this.canvas.width = Math.round(rect.width * dpr);
    this.canvas.height = Math.round(rect.height * dpr);
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

    const mapW = 544;
    const mapH = 352;
    const scaleX = this.viewW / mapW;
    const scaleY = this.viewH / mapH;
    const fitScale = Math.min(scaleX, scaleY);

    this.scale = fitScale >= 2.0 ? 2 : Math.max(1, Math.floor(fitScale));
    if (this.scale < 1.5 && fitScale >= 1.2) this.scale = fitScale;

    this.offsetX = Math.round((this.viewW - mapW * this.scale) / 2);
    this.offsetY = Math.round((this.viewH - mapH * this.scale) / 2);
  }

  findPath(start, goal) {
    if (start.x === goal.x && start.y === goal.y) return [];
    const w = this.map.width;
    const h = this.map.height;
    const key = (p) => `${p.x},${p.y}`;
    const visited = new Set([key(start)]);
    const parent = new Map();
    const queue = [start];
    const DIRS = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 }
    ];

    while (queue.length > 0) {
      const cur = queue.shift();
      for (const d of DIRS) {
        const next = { x: cur.x + d.x, y: cur.y + d.y };
        const nk = key(next);
        if (next.x < 0 || next.y < 0 || next.x >= w || next.y >= h) continue;
        if (visited.has(nk) || !this.walkGrid[next.y][next.x]) continue;

        visited.add(nk);
        parent.set(nk, cur);

        if (next.x === goal.x && next.y === goal.y) {
          const path = [];
          let curr = goal;
          while (!(curr.x === start.x && curr.y === start.y)) {
            path.unshift(curr);
            curr = parent.get(key(curr));
          }
          return path;
        }
        queue.push(next);
      }
    }
    return null;
  }

  walkAgentTo(ag, targetTile, onArrival) {
    const curTile = {
      x: Math.floor(ag.px / 16),
      y: Math.floor((ag.py - 1) / 16)
    };
    const path = this.findPath(curTile, targetTile);
    if (path && path.length > 0) {
      ag.isSitting = false;
      ag.path = path;
      ag.onArrival = onArrival;
    } else if (onArrival) {
      onArrival();
    }
  }

  // ── Random Office Life (Errands, Coffee, Water, Dustbin, Chat) ───────────────
  updateOfficeLife(dt) {
    if (this.isMissionActive) return; // Mission takes total precedence

    for (const ag of this.agents) {
      ag.idleCooldown -= dt;
      if (ag.idleCooldown > 0 || (ag.path && ag.path.length > 0)) continue;

      // Pick a realistic office errand
      ag.idleCooldown = 15.0 + Math.random() * 15.0; // Next errand in 15-30s

      const r = Math.random();
      if (ag.id === 'The_Boss') {
        if (r < 0.35) {
          // Walk to window
          ag.thought = 'checking the parking lot...';
          ag.thoughtTimer = 5.0;
          this.walkAgentTo(ag, { x: 10, y: 3 }, () => {
            ag.direction = 'up';
            ag.thought = "that's what she said";
            ag.thoughtTimer = 5.0;
            setTimeout(() => this.walkAgentTo(ag, ag.seatTile, () => {
              ag.isSitting = true;
              ag.direction = 'down';
            }), 4000);
          });
        } else if (r < 0.70) {
          // Water CEO plant
          ag.thought = 'watering the CEO ficus...';
          ag.thoughtTimer = 4.0;
          this.walkAgentTo(ag, { x: 6, y: 4 }, () => {
            ag.direction = 'up';
            setTimeout(() => this.walkAgentTo(ag, ag.seatTile, () => {
              ag.isSitting = true;
              ag.direction = 'down';
              ag.thought = "World's Best Boss mug";
              ag.thoughtTimer = 4.0;
            }), 4000);
          });
        }
      } else if (ag.id === 'Data_Dex') { // Kelly
        if (r < 0.45) {
          // Go to pantry for hot coffee
          ag.thought = 'making fresh hot coffee...';
          ag.thoughtTimer = 5.0;
          this.walkAgentTo(ag, { x: 26, y: 20 }, () => {
            ag.direction = 'up';
            ag.thought = 'the coffee here is a hug';
            ag.thoughtTimer = 5.0;
            setTimeout(() => this.walkAgentTo(ag, ag.seatTile, () => {
              ag.isSitting = true;
              ag.direction = 'up';
              ag.thought = 'reviewing market trends';
              ag.thoughtTimer = 4.0;
            }), 4000);
          });
        } else if (r < 0.75) {
          // Vending machine snack
          ag.thought = 'vending machine run!';
          ag.thoughtTimer = 4.0;
          this.walkAgentTo(ag, { x: 29, y: 13 }, () => {
            ag.direction = 'right';
            ag.thought = 'B4... please be pretzels';
            ag.thoughtTimer = 5.0;
            setTimeout(() => this.walkAgentTo(ag, ag.seatTile, () => {
              ag.isSitting = true;
              ag.direction = 'up';
            }), 4000);
          });
        }
      } else if (ag.id === 'Dr_Arxiv') { // Jim
        if (r < 0.45) {
          // Toss trash into dustbin
          ag.thought = 'throwing crumpled paper in dustbin...';
          ag.thoughtTimer = 4.0;
          this.walkAgentTo(ag, { x: 16, y: 18 }, () => {
            ag.direction = 'down';
            ag.thought = 'three-pointer! yes!';
            ag.thoughtTimer = 4.0;
            setTimeout(() => this.walkAgentTo(ag, ag.seatTile, () => {
              ag.isSitting = true;
              ag.direction = 'up';
            }), 3500);
          });
        } else if (r < 0.75) {
          // Water corridor plant
          ag.thought = 'watering the hallway plant';
          ag.thoughtTimer = 4.0;
          this.walkAgentTo(ag, { x: 2, y: 20 }, () => {
            ag.direction = 'left';
            setTimeout(() => this.walkAgentTo(ag, ag.seatTile, () => {
              ag.isSitting = true;
              ag.direction = 'up';
              ag.thought = 'bears. beets. Battlestar Galactica.';
              ag.thoughtTimer = 4.0;
            }), 3500);
          });
        }
      } else if (ag.id === 'Vera_Audit') { // Dwight
        if (r < 0.45) {
          // Security patrol
          ag.thought = 'inspecting perimeter...';
          ag.thoughtTimer = 4.0;
          this.walkAgentTo(ag, { x: 16, y: 14 }, () => {
            ag.direction = 'down';
            ag.thought = 'FALSE. Security is tight.';
            ag.thoughtTimer = 4.0;
            setTimeout(() => this.walkAgentTo(ag, ag.seatTile, () => {
              ag.isSitting = true;
              ag.direction = 'up';
            }), 3500);
          });
        } else if (r < 0.75) {
          // Pantry inspection
          ag.thought = 'checking pantry fridge...';
          ag.thoughtTimer = 4.0;
          this.walkAgentTo(ag, { x: 28, y: 20 }, () => {
            ag.direction = 'up';
            ag.thought = 'this fridge needs a beet drawer';
            ag.thoughtTimer = 4.0;
            setTimeout(() => this.walkAgentTo(ag, ag.seatTile, () => {
              ag.isSitting = true;
              ag.direction = 'up';
            }), 3500);
          });
        }
      }
    }
  }

  // ── Multi-Agent 5-Phase Research Orchestration ──────────────────────────────
  startResearchMission(query) {
    this.isMissionActive = true;
    this.currentQuery = query;
    this.missionTimer = 0;

    const boss = this.agents[0];

    // Cancel all random wandering
    for (const ag of this.agents) {
      ag.path = [];
      ag.working = false;
    }

    // ── PHASE 1: Manager Thinking in Cabin ───────────────────────────────────
    this.missionPhase = 'manager_thinking';
    boss.working = true;
    boss.isSitting = true;
    boss.direction = 'down';
    boss.thought = 'Task received! Deconstructing directives across 5 desks...';
    boss.thoughtTimer = 4.0;

    // After 1.8 seconds: Phase 2 begins (cabin briefing)
    setTimeout(() => {
      this.triggerCabinBriefing();
    }, 1800);
  }

  // ── PHASE 2: All 5 Employees Gather in Manager's Cabin for Briefing ────────
  triggerCabinBriefing() {
    this.missionPhase = 'cabin_briefing';
    const boss = this.agents[0];
    const employees = this.agents.slice(1); // Jim, Dwight, Kelly, Pam, Ryan

    boss.thought = 'Team meeting in my cabin! Come get your tasks.';
    boss.thoughtTimer = 5.0;

    const targetCabinTiles = [
      { x: 5, y: 5 }, // Jim
      { x: 5, y: 6 }, // Dwight
      { x: 6, y: 5 }, // Kelly
      { x: 6, y: 6 }, // Pam
      { x: 7, y: 5 }  // Ryan
    ];

    let arrivedCount = 0;
    const onEmployeeArrived = () => {
      arrivedCount++;
      if (arrivedCount === employees.length) {
        // All 5 employees have arrived in Michael's CEO Cabin!
        for (const emp of employees) {
          emp.direction = 'up';
        }

        boss.thought = 'Arxiv: RAG | Dwight: Integrity | Kelly: Gaps | Pam: Repro | Ryan: Consensus!';
        boss.thoughtTimer = 5.0;

        employees[0].thought = 'Got it! Heading to PC-1.';
        employees[1].thought = 'Integrity audit at PC-2.';
        employees[2].thought = 'Scanning market gaps at PC-3.';
        employees[3].thought = 'Evaluating rubric at PC-4.';
        employees[4].thought = 'Contradiction matrix at PC-5.';
        for (const emp of employees) emp.thoughtTimer = 4.0;

        // Disperse to individual PC desks for parallel work
        setTimeout(() => {
          this.triggerDeskWork();
        }, 2200);
      }
    };

    employees.forEach((emp, i) => {
      this.walkAgentTo(emp, targetCabinTiles[i], onEmployeeArrived);
    });
  }

  // ── PHASE 3: Deep Parallel Work at 5 Workstations ───────────────────────────
  triggerDeskWork() {
    this.missionPhase = 'desk_work';
    const employees = this.agents.slice(1);

    const workThoughts = [
      'Dense FAISS & BM25Okapi RRF ranking...',
      'Screening DOIs on Retraction Watch...',
      'Synthesizing Research Gap Radar...',
      '5-Factor reproducibility scoring /100...',
      'Mapping consensus vs divergence matrix...'
    ];

    employees.forEach((emp, i) => {
      this.walkAgentTo(emp, emp.seatTile, () => {
        emp.isSitting = true;
        emp.direction = 'up';
        emp.working = true;
        emp.thought = workThoughts[i];
        emp.thoughtTimer = 8.0;
      });
    });
  }

  // ── PHASE 4: Final Synthesis Meeting in the Red Chair Room (Boardroom) ──────
  triggerBoardroomMeeting(finalData) {
    this.missionPhase = 'boardroom_meeting';

    // 1. CRITICAL: Render data to UI immediately without waiting for walks!
    if (window.renderResearchIntelligence && finalData) {
      window.renderResearchIntelligence(finalData);
    } else if (window.renderDossier && finalData) {
      window.renderDossier(finalData);
    }

    // Stop working typing animations
    for (const ag of this.agents) {
      ag.working = false;
    }

    const boss = this.agents[0];
    boss.thought = 'All tasks complete! Final assembly in Red Chair Room!';
    boss.thoughtTimer = 6.0;

    const boardroomTiles = [
      { x: 13, y: 7 }, // Boss
      { x: 11, y: 7 }, // Jim
      { x: 10, y: 6 }, // Dwight
      { x: 15, y: 7 }, // Kelly
      { x: 12, y: 6 }, // Pam
      { x: 14, y: 6 }  // Ryan
    ];

    let arrivedCount = 0;
    const onBoardroomArrived = () => {
      arrivedCount++;
      if (arrivedCount === this.agents.length) {
        // All 6 agents assembled around the conference table!
        this.agents[0].direction = 'up';
        this.agents[1].direction = 'up';
        this.agents[2].direction = 'right';
        this.agents[3].direction = 'up';
        this.agents[4].direction = 'down';
        this.agents[5].direction = 'down';

        this.agents[0].thought = 'Dossier synthesized! World’s Best Boss.';
        this.agents[1].thought = 'Citations verified & published.';
        this.agents[2].thought = 'Audit signed off. Zero hallucinations.';
        this.agents[3].thought = 'Market gaps documented.';
        this.agents[4].thought = 'Reproducibility scores finalized.';
        this.agents[5].thought = 'Consensus consensus consensus!';
        for (const ag of this.agents) ag.thoughtTimer = 6.0;

        setTimeout(() => {
          this.endResearchMission();
        }, 7000);
      }
    };

    this.agents.forEach((ag, i) => {
      this.walkAgentTo(ag, boardroomTiles[i], onBoardroomArrived);
    });
  }

  endResearchMission() {
    this.isMissionActive = false;
    this.missionPhase = 'idle';

    // Return agents to workstations
    this.agents.forEach((ag) => {
      this.walkAgentTo(ag, ag.seatTile, () => {
        ag.isSitting = true;
        ag.direction = ag.seatDirection || 'up';
      });
    });
  }

  endResearchMission() {
    this.isMissionActive = false;
    this.missionPhase = 'idle';

    const boss = this.agents[0];
    const jim = this.agents[1];
    const kelly = this.agents[2];
    const dwight = this.agents[3];

    // Return to desks or pantry
    this.walkAgentTo(boss, boss.seatTile, () => {
      boss.isSitting = true;
      boss.direction = 'down';
      boss.thought = 'running the floor';
      boss.thoughtTimer = 5.0;
    });

    this.walkAgentTo(jim, jim.seatTile, () => {
      jim.isSitting = true;
      jim.direction = 'up';
    });

    this.walkAgentTo(dwight, dwight.seatTile, () => {
      dwight.isSitting = true;
      dwight.direction = 'up';
    });

    this.walkAgentTo(kelly, { x: 26, y: 20 }, () => {
      kelly.direction = 'up';
      kelly.thought = 'just five more minutes';
      kelly.thoughtTimer = 5.0;
    });
  }

  setAgentState(agentId, state, actionLog) {
    const ag = this.agents.find(a =>
      a.id.toLowerCase() === agentId.toLowerCase() ||
      a.name.toLowerCase() === agentId.toLowerCase()
    );
    if (!ag) return;

    if (actionLog) {
      ag.thought = actionLog.length > 38 ? actionLog.slice(0, 36) + '…' : actionLog;
      ag.thoughtTimer = 5.0;
    }
  }

  update(dt) {
    // 1. Move walking agents
    for (const ag of this.agents) {
      if (ag.path && ag.path.length > 0) {
        const next = ag.path[0];
        const targetPx = next.x * 16 + 8;
        const targetPy = next.y * 16 + 16;
        const dx = targetPx - ag.px;
        const dy = targetPy - ag.py;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 1.0) {
          ag.px = targetPx;
          ag.py = targetPy;
          ag.path.shift();

          if (ag.path.length === 0 && ag.onArrival) {
            const cb = ag.onArrival;
            ag.onArrival = null;
            cb();
          }
        } else {
          const step = Math.min(ag.speed * dt, dist);
          ag.px += (dx / dist) * step;
          ag.py += (dy / dist) * step;
          ag.walkDist += step;

          if (Math.abs(dx) > Math.abs(dy)) {
            ag.direction = dx > 0 ? 'right' : 'left';
          } else {
            ag.direction = dy > 0 ? 'down' : 'up';
          }

          const cycle = Math.floor(ag.walkDist / 6) % 4;
          ag.phase = cycle === 1 ? 1 : cycle === 3 ? 2 : 0;
        }
      } else {
        ag.phase = 0;
      }

      // Decrement thought timer
      if (ag.thought && ag.thoughtTimer > 0) {
        ag.thoughtTimer -= dt;
      }
    }

    // 2. Drive random office life
    this.updateOfficeLife(dt);
  }

  renderLoop(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    if (window.isVisualVisible !== false) {
      this.update(dt);
      this.render();
    }

    requestAnimationFrame((t) => this.renderLoop(t));
  }

  render() {
    const ctx = this.ctx;
    const dpr = Math.max(window.devicePixelRatio || 1, 2);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    // Viewport background: Authentic cream tone (#FFF8E7)
    ctx.fillStyle = '#FFF8E7';
    ctx.fillRect(0, 0, this.viewW, this.viewH);

    if (!this.map || !this.tilesets.office) return;

    const mapScreenW = 544 * this.scale;
    const mapScreenH = 352 * this.scale;

    // Outer retro border
    ctx.save();
    ctx.strokeStyle = '#1A1320';
    ctx.lineWidth = 3;
    ctx.strokeRect(this.offsetX - 3, this.offsetY - 3, mapScreenW + 6, mapScreenH + 6);
    ctx.restore();

    ctx.save();
    ctx.translate(this.offsetX, this.offsetY);
    ctx.scale(this.scale, this.scale);

    // 1. Draw ALL tile layers FIRST (including furniture-above) so characters are NEVER covered by keyboards!
    const allLayers = ['floor', 'walls', 'furniture-below', 'furniture-above'];
    for (const lName of allLayers) {
      const layer = this.map.layers.find(l => l.name === lName);
      if (layer && layer.visible) this.drawTileLayer(layer);
    }

    // 2. Draw Living Characters ON TOP of all tile layers (zero chopped heads!)
    this.drawAgents();

    ctx.restore();

    // 3. Draw Thought Bubbles with Anti-Collision Overlap Resolution
    this.drawThoughtBubbles();
  }

  drawTileLayer(layer) {
    const ctx = this.ctx;
    const w = layer.width;
    const h = layer.height;
    const tw = this.map.tilewidth;
    const th = this.map.tileheight;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const rawGid = layer.data[y * w + x];
        if (!rawGid || rawGid === 0) continue;
        const gid = rawGid & 0x1FFFFFFF;

        let img = null;
        let localId = 0;
        let cols = 16;

        if (gid >= 1025) {
          img = this.tilesets.interiors;
          localId = gid - 1025;
        } else if (gid >= 513) {
          img = this.tilesets.a5;
          localId = gid - 513;
        } else if (gid >= 1) {
          img = this.tilesets.office;
          localId = gid - 1;
        }

        if (img) {
          const sx = (localId % cols) * tw;
          const sy = Math.floor(localId / cols) * th;
          ctx.drawImage(img, sx, sy, tw, th, x * tw, y * th, tw, th);
        }
      }
    }
  }

  drawAgents() {
    const ctx = this.ctx;

    // Depth sort by Y coordinate
    const sorted = [...this.agents].sort((a, b) => a.py - b.py);

    for (const ag of sorted) {
      const sheet = this.spriteSheets[ag.recipeKey];
      if (!sheet) continue;

      let frame = null;
      const isFacingBack = ag.direction === 'up';
      const isFacingLeft = ag.direction === 'left';
      const frames = isFacingBack ? sheet.back : sheet.front;

      frame = frames[ag.phase] || frames[0];

      const drawX = Math.round(ag.px);
      const drawY = Math.round(ag.py);

      // Cast shadow
      ctx.fillStyle = 'rgba(26, 19, 32, 0.28)';
      ctx.beginPath();
      ctx.ellipse(drawX, drawY, 7, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Working Focus Aura
      if (ag.working) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(drawX, drawY - 12, 14, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(220, 171, 60, 0.25)';
        ctx.fill();
        ctx.strokeStyle = '#DCAB3C';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      // Draw Sprite
      ctx.save();
      ctx.translate(drawX, drawY);

      if (isFacingLeft) {
        ctx.scale(-1, 1);
      }

      if (ag.isSitting) {
        if (ag.direction === 'down') {
          // Michael at CEO desk: sits behind desk looking forward; legs cropped 8px
          const crop = 8;
          ctx.drawImage(
            frame,
            0, 0, 18, 32 - crop,
            -9, -32 + crop, 18, 32 - crop
          );
        } else {
          // Employees at PC desks facing UP towards monitors
          // Tucked into chair facing screen; legs cropped 4px
          const crop = 4;
          ctx.drawImage(
            frame,
            0, 0, 18, 32 - crop,
            -9, -30, 18, 32 - crop
          );
        }
      } else {
        // Normal standing/walking pose (anchor at feet: x - 9, y - 32)
        ctx.drawImage(frame, -9, -32);
      }

      ctx.restore();
    }
  }

  // ── Speech Bubbles with Anti-Collision Vertical Stacking ─────────────────────
  drawThoughtBubbles() {
    const ctx = this.ctx;

    // 1. Collect all active thought bubbles
    const bubbleItems = [];
    for (const ag of this.agents) {
      if (!ag.thought || ag.thoughtTimer <= 0) continue;

      ctx.font = 'bold 11px "JetBrains Mono", Consolas, monospace';
      const textMetrics = ctx.measureText(ag.thought);
      const bubbleW = Math.ceil(textMetrics.width) + 16;
      const bubbleH = 22;

      const screenX = this.offsetX + Math.round(ag.px * this.scale);
      const screenY = this.offsetY + Math.round((ag.py - 34) * this.scale);

      let bx = Math.round(screenX - bubbleW / 2);
      let by = Math.round(screenY - bubbleH - 6);

      // Clamp inside canvas bounds
      bx = Math.max(10, Math.min(this.viewW - bubbleW - 10, bx));
      by = Math.max(10, Math.min(this.viewH - bubbleH - 10, by));

      bubbleItems.push({
        ag,
        text: ag.thought,
        bx,
        by,
        w: bubbleW,
        h: bubbleH,
        screenX,
        screenY
      });
    }

    if (bubbleItems.length === 0) return;

    // 2. Anti-Collision Pass: stack overlapping bubbles vertically
    bubbleItems.sort((a, b) => (b.by + b.h) - (a.by + a.h) || a.bx - b.bx);

    const placed = [];
    const pad = 4;
    for (const item of bubbleItems) {
      let moved = true;
      let guard = 0;
      while (moved && guard++ < 12) {
        moved = false;
        for (const p of placed) {
          const overlapX = item.bx < p.bx + p.w && item.bx + item.w > p.bx;
          const overlapY = item.by < p.by + p.h && item.by + item.h > p.by;
          if (overlapX && overlapY) {
            // Stack this bubble above the overlapping one
            item.by = p.by - item.h - pad;
            moved = true;
          }
        }
      }
      placed.push(item);
    }

    // 3. Render resolved bubbles
    for (const item of placed) {
      ctx.save();

      // Drop shadow
      ctx.fillStyle = 'rgba(26, 19, 32, 0.2)';
      this.drawRoundRect(ctx, item.bx + 2, item.by + 2, item.w, item.h, 5);
      ctx.fill();

      // Bubble Body
      ctx.fillStyle = '#FFFDF5';
      ctx.strokeStyle = '#1A1320';
      ctx.lineWidth = 1.5;
      this.drawRoundRect(ctx, item.bx, item.by, item.w, item.h, 5);
      ctx.fill();
      ctx.stroke();

      // Cloud tail puffs pointing to head
      const puffBaseX = item.bx + Math.round(item.w * 0.35);
      ctx.beginPath();
      ctx.arc(puffBaseX, item.by + item.h + 3, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(puffBaseX - 3, item.by + item.h + 7, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Sharp text
      ctx.fillStyle = '#3D2E4A';
      ctx.font = 'bold 11px "JetBrains Mono", Consolas, monospace';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.text, item.bx + 8, item.by + item.h / 2);

      ctx.restore();
    }
  }

  drawRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

window.OfficeCanvas = OfficeCanvas;
