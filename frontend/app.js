/**
 * Munder Difflin Frontend Application Controller
 * Connects OfficeCanvas, AvatarGenerator, SSE real-time stream, and multi-agent RAG coordination.
 */

let officeCanvas = null;
let currentAgent = 'Data_Dex'; // Kelly by default
let eventSource = null;

const AGENT_PROFILES = {
  The_Boss: {
    recipeKey: 'michael',
    name: 'MICHAEL',
    role: 'BOSS',
    decorator: '@boss',
    specialty: 'Executive Director & Synthesizer',
    path: 'C:\\Users\\Codex_boy\\Desktop\\WAR\\AI Agent\\Research Agent',
    pty: 'pty-michael-boss'
  },
  Dr_Arxiv: {
    recipeKey: 'jim',
    name: 'JIM',
    role: 'DISCOVERY',
    decorator: '@discovery_agent',
    specialty: 'Scientific Literature (FAISS + BM25Okapi RRF)',
    path: 'C:\\Users\\Codex_boy\\Desktop\\WAR\\AI Agent\\Research Agent',
    pty: 'pty-jim-academic'
  },
  Vera_Audit: {
    recipeKey: 'dwight',
    name: 'DWIGHT',
    role: 'INTEGRITY',
    decorator: '@integrity_guardian',
    specialty: 'Retraction Watch & Safe-to-Cite Provenance Audit',
    path: 'C:\\Users\\Codex_boy\\Desktop\\WAR\\AI Agent\\Research Agent',
    pty: 'pty-dwight-auditor'
  },
  Data_Dex: {
    recipeKey: 'kelly',
    name: 'KELLY',
    role: 'GAP RADAR',
    decorator: '@gap_analyst',
    specialty: 'Market Intelligence & Research Gap Radar',
    path: 'C:\\Users\\Codex_boy\\Desktop\\WAR\\AI Agent\\Research Agent',
    pty: 'pty-kelly-market'
  },
  Pam_Reproduce: {
    recipeKey: 'pam',
    name: 'PAM',
    role: 'REPRO RUBRIC',
    decorator: '@reproducibility_inspector',
    specialty: '5-Factor Reproducibility Rubric & Benchmark Inspection',
    path: 'C:\\Users\\Codex_boy\\Desktop\\WAR\\AI Agent\\Research Agent',
    pty: 'pty-pam-repro'
  },
  Ryan_Consensus: {
    recipeKey: 'ryan',
    name: 'RYAN',
    role: 'CONSENSUS',
    decorator: '@contradiction_engine',
    specialty: 'Empirical Contradictions, Divergence & Claim Matrix',
    path: 'C:\\Users\\Codex_boy\\Desktop\\WAR\\AI Agent\\Research Agent',
    pty: 'pty-ryan-consensus'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Setup Visual Toggle immediately
  initVisualToggle();

  // 2. Initialize Office Canvas non-blocking
  const canvasEl = document.getElementById('office-canvas');
  if (canvasEl) {
    try {
      officeCanvas = new OfficeCanvas(canvasEl);
      officeCanvas.init().catch(err => console.warn('OfficeCanvas init:', err));
    } catch (e) {
      console.warn('OfficeCanvas init error:', e);
    }
  }

  // 3. Render Authentic 2x Portraits on Dock Cards
  renderDockPortraits();

  // 4. Setup Tabs
  initTabs();

  // 5. Setup Terminal Font Zoom
  initTerminalZoom();

  // 6. Setup Dock Selection
  initDock();

  // 7. Setup Research Queue
  initQueue();

  // 8. Connect Real-time SSE Stream
  connectEventStream();

  // Select Kelly by default matching Munder Difflin screenshot
  selectAgent('Data_Dex');
});

function initVisualToggle() {
  window.isVisualVisible = true;

  window.setVisualState = function(visible) {
    window.isVisualVisible = visible;
    const splitEl = document.getElementById('workspace-split');
    const topBtn = document.getElementById('btn-toggle-visual-top');
    const paneBtn = document.getElementById('btn-toggle-visual-pane');

    if (splitEl) {
      if (visible) {
        splitEl.classList.remove('visual-hidden');
      } else {
        splitEl.classList.add('visual-hidden');
      }
    }

    if (topBtn) {
      if (visible) {
        topBtn.classList.add('active');
        topBtn.innerHTML = `<span class="vt-icon">🏢</span> <span class="vt-text">Visual: ON</span>`;
        topBtn.title = "Hide 2D Office Visual (Fullscreen Intelligence View)";
      } else {
        topBtn.classList.remove('active');
        topBtn.innerHTML = `<span class="vt-icon">🏢</span> <span class="vt-text">Visual: OFF</span>`;
        topBtn.title = "Show 2D Office Visual";
      }
    }

    if (paneBtn) {
      if (visible) {
        paneBtn.classList.add('active');
        paneBtn.innerHTML = `<span class="pane-vt-icon">👁️</span> visual`;
      } else {
        paneBtn.classList.remove('active');
        paneBtn.innerHTML = `<span class="pane-vt-icon">👁️</span> visual off`;
      }
    }

    if (officeCanvas && visible) {
      setTimeout(() => {
        try { officeCanvas.resizeCanvas(); } catch (_) {}
      }, 50);
    }
  };

  window.toggleVisualMode = function() {
    window.setVisualState(!window.isVisualVisible);
  };

  const topBtn = document.getElementById('btn-toggle-visual-top');
  const paneBtn = document.getElementById('btn-toggle-visual-pane');
  const winModeBtn = document.getElementById('btn-window-mode');
  const closePaneBtn = document.getElementById('btn-close-pane');

  if (topBtn) topBtn.onclick = window.toggleVisualMode;
  if (paneBtn) paneBtn.onclick = window.toggleVisualMode;
  if (winModeBtn) winModeBtn.onclick = window.toggleVisualMode;
  if (closePaneBtn) closePaneBtn.onclick = () => window.setVisualState(false);
}

function initTerminalZoom() {
  let fontSize = 12;
  const dec = document.getElementById('btn-font-dec');
  const inc = document.getElementById('btn-font-inc');
  const label = document.querySelector('.font-size-text');
  const screen = document.getElementById('terminal-screen');

  if (dec && inc && label && screen) {
    dec.addEventListener('click', () => {
      fontSize = Math.max(9, fontSize - 1);
      label.textContent = `${fontSize}px`;
      screen.style.fontSize = `${fontSize}px`;
    });
    inc.addEventListener('click', () => {
      fontSize = Math.min(20, fontSize + 1);
      label.textContent = `${fontSize}px`;
      screen.style.fontSize = `${fontSize}px`;
    });
  }
}

// Render Authentic 2x Portraits on Dock Cards
function renderDockPortraits() {
  if (!window.AvatarGenerator) return;

  const map = {
    'portrait-michael': 'michael',
    'portrait-jim': 'jim',
    'portrait-dwight': 'dwight',
    'portrait-kelly': 'kelly',
    'portrait-pam': 'pam',
    'portrait-ryan': 'ryan'
  };

  for (const [id, recipeKey] of Object.entries(map)) {
    const cvs = document.getElementById(id);
    if (cvs) {
      const ctx = cvs.getContext('2d');
      window.AvatarGenerator.paintPortrait(ctx, recipeKey, 2);
    }
  }
}

// Navigation Tabs
function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = `tab-${tab.getAttribute('data-tab')}`;
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });
}

// Dock Selection
function initDock() {
  const cards = document.querySelectorAll('.dock-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const agentKey = card.getAttribute('data-agent');
      selectAgent(agentKey);
    });
  });
}

function selectAgent(key) {
  currentAgent = key;
  const p = AGENT_PROFILES[key] || AGENT_PROFILES['Data_Dex'];

  const nameEl = document.getElementById('inspector-name');
  if (nameEl) nameEl.textContent = p.name;

  const pathEl = document.getElementById('inspector-path');
  if (pathEl) pathEl.textContent = p.path;

  const inputEl = document.getElementById('queue-input');
  if (inputEl) inputEl.placeholder = `Message ${p.name}`;

  // Update top inspector portrait
  const avatarCanvas = document.getElementById('inspector-avatar-canvas');
  if (avatarCanvas && window.AvatarGenerator) {
    const ctx = avatarCanvas.getContext('2d');
    window.AvatarGenerator.paintPortrait(ctx, p.recipeKey, 2);
  }

  // Update terminal pty header
  const ptyStatusEl = document.querySelector('.pty-status');
  if (ptyStatusEl) {
    ptyStatusEl.innerHTML = `<span class="pty-live-dot">■</span> live - pty ${p.pty}`;
  }
}

// Research Queue & Input
function initQueue() {
  const btnSend = document.getElementById('btn-send');
  const input = document.getElementById('queue-input');

  const submit = () => {
    const val = input.value.trim();
    if (val) {
      dispatchResearch(val);
      input.value = '';
    }
  };

  btnSend.addEventListener('click', submit);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  });

  // Preset Buttons in Dossier
  document.querySelectorAll('.preset-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const q = tag.getAttribute('data-q');
      dispatchResearch(q);
    });
  });
}

async function dispatchResearch(query) {
  appendTerminalLog(`> [USER DIRECTIVE] ${query}`);
  appendTerminalLog(`[HIVE] Directive sent to Michael (@boss). Deconstructing tasks across 5 specialized employee desks...`);

  // Reset progress bars
  updateMasterProgress(5, 'Task Deconstructing in CEO Cabin...');
  ['The_Boss', 'Dr_Arxiv', 'Vera_Audit', 'Data_Dex', 'Pam_Reproduce', 'Ryan_Consensus'].forEach(id => {
    updateAgentProgress(id, 0);
  });

  if (officeCanvas) {
    officeCanvas.startResearchMission(query);
  }

  updateBadge('The_Boss', 'thinking');
  updateBadge('Dr_Arxiv', 'briefing');
  updateBadge('Vera_Audit', 'briefing');
  updateBadge('Data_Dex', 'briefing');
  updateBadge('Pam_Reproduce', 'briefing');
  updateBadge('Ryan_Consensus', 'briefing');

  try {
    const res = await fetch('/api/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    await res.json();

    // Safety fallback: fetch /api/research/latest if UI didn't render within 7s
    setTimeout(async () => {
      const dossierContainer = document.getElementById('dossier-output');
      if (dossierContainer && dossierContainer.querySelector('.dossier-empty')) {
        try {
          const checkRes = await fetch('/api/research/latest');
          const latestData = await checkRes.json();
          if (latestData && latestData.dossier) {
            console.log('[FALLBACK] Rendered latest payload from endpoint:', latestData);
            renderResearchIntelligence(latestData);
            updateMasterProgress(100, 'Complete • All Evidence Synthesized & Audited');
          }
        } catch (_) {}
      }
    }, 7000);
  } catch (err) {
    appendTerminalLog(`[ERROR] Failed to dispatch research: ${err.message}`);
  }
}

// Real-Time SSE Stream
function connectEventStream() {
  if (eventSource) eventSource.close();

  eventSource = new EventSource('/api/office/events');

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      handleAgentEvent(data);
    } catch (e) {
      // Heartbeat ping
    }
  };

  eventSource.onerror = () => {
    setTimeout(connectEventStream, 3000);
  };
}

function handleAgentEvent(evt) {
  // Update Master Hive Progress
  if (evt.overall_progress !== undefined && evt.overall_progress !== null) {
    updateMasterProgress(evt.overall_progress, evt.action_log);
  }

  // Update Individual Agent Progress Bar
  if (evt.agent_id && evt.progress !== undefined && evt.progress !== null) {
    updateAgentProgress(evt.agent_id, evt.progress);
  }

  // Update Dock Badges
  if (evt.agent_id) updateBadge(evt.agent_id, evt.status);

  // Terminal Output
  const agentTag = (evt.agent_id || 'SYSTEM').toUpperCase();
  appendTerminalLog(`[${agentTag}] ${evt.action_log || ''}`);

  // CRITICAL FIX: Render research intelligence IMMEDIATELY when done!
  if (evt.agent_id === 'The_Boss' && evt.status === 'done' && evt.data && evt.data.dossier) {
    console.log('[RESEARCH COMPLETE] Rendering intelligence payload immediately:', evt.data);
    renderResearchIntelligence(evt.data);
    updateMasterProgress(100, 'Complete • Research Findings Synthesized');

    // Print clear structured report directly into the Terminal Screen
    const queryUpper = ((evt.data && evt.data.query) || 'RESEARCH DIRECTIVE').toUpperCase();
    appendTerminalLog(`=======================================================`);
    appendTerminalLog(`📑 RESEARCH REPORT FOR: ${queryUpper}`);
    appendTerminalLog(`=======================================================`);
    if (evt.data.citations && evt.data.citations.length > 0) {
      evt.data.citations.forEach((c, idx) => {
        appendTerminalLog(`[${idx + 1}] 📌 ${c.title || 'Untitled Source'}`);
        appendTerminalLog(`👤 Researched By: ${c.authors || 'Lead Research Authors'}`);
        appendTerminalLog(`📝 Details: ${c.text || ''}`);
        const sourceUrl = c.url || (c.doi ? `https://doi.org/${c.doi}` : '');
        if (sourceUrl) {
          appendTerminalLog(`🔗 Source Link: ${sourceUrl}`);
        }
        appendTerminalLog(`-------------------------------------------------------`);
      });
    }
    appendTerminalLog(`✨ Research Complete for '${(evt.data && evt.data.query) || ''}'. Click 📑 DOSSIER tab to view formatted document.`);
    appendTerminalLog(`=======================================================`);

    if (officeCanvas) {
      officeCanvas.triggerBoardroomMeeting(evt.data);
    }
  }
}

function updateMasterProgress(overallPct, stageLabel) {
  const roundPct = Math.round(overallPct || 0);
  const fillEl = document.getElementById('master-progress-fill');
  if (fillEl) fillEl.style.width = `${roundPct}%`;

  const pctEl = document.getElementById('master-progress-pct');
  if (pctEl) pctEl.textContent = `${roundPct}%`;

  const labelEl = document.getElementById('master-progress-label');
  if (labelEl && stageLabel) {
    labelEl.textContent = stageLabel;
  }
}

function updateAgentProgress(agentId, pct) {
  const mapFill = {
    The_Boss: 'dock-prog-fill-boss',
    Dr_Arxiv: 'dock-prog-fill-jim',
    Vera_Audit: 'dock-prog-fill-dwight',
    Data_Dex: 'dock-prog-fill-kelly',
    Pam_Reproduce: 'dock-prog-fill-pam',
    Ryan_Consensus: 'dock-prog-fill-ryan'
  };
  const mapPct = {
    The_Boss: 'dock-prog-pct-boss',
    Dr_Arxiv: 'dock-prog-pct-jim',
    Vera_Audit: 'dock-prog-pct-dwight',
    Data_Dex: 'dock-prog-pct-kelly',
    Pam_Reproduce: 'dock-prog-pct-pam',
    Ryan_Consensus: 'dock-prog-pct-ryan'
  };

  const roundPct = Math.min(100, Math.max(0, Math.round(pct || 0)));
  const fillId = mapFill[agentId];
  if (fillId) {
    const fillEl = document.getElementById(fillId);
    if (fillEl) fillEl.style.width = `${roundPct}%`;
  }

  const pctId = mapPct[agentId];
  if (pctId) {
    const pctEl = document.getElementById(pctId);
    if (pctEl) pctEl.textContent = `${roundPct}%`;
  }
}

function updateBadge(agentId, status) {
  const map = {
    The_Boss: 'dock-status-boss',
    Dr_Arxiv: 'dock-status-jim',
    Vera_Audit: 'dock-status-dwight',
    Data_Dex: 'dock-status-kelly',
    Pam_Reproduce: 'dock-status-pam',
    Ryan_Consensus: 'dock-status-ryan'
  };

  const id = map[agentId];
  if (id) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = `<span class="status-dot">■</span> ${status}`;
  }

  if (agentId === currentAgent) {
    const statusTextEl = document.getElementById('inspector-status-text');
    if (statusTextEl) statusTextEl.textContent = status;
  }
}

function appendTerminalLog(text) {
  const screen = document.getElementById('terminal-screen');
  if (!screen) return;

  const div = document.createElement('div');
  div.className = 'term-line';
  if (text.includes('[USER DIRECTIVE]')) div.className += ' prompt';
  else if (text.includes('done') || text.includes('verified') || text.includes('[HIVE]')) div.className += ' green';
  else if (text.includes('retrieving') || text.includes('scanning') || text.includes('Auditing')) div.className += ' highlight';
  div.textContent = text;
  screen.appendChild(div);
  screen.scrollTop = screen.scrollHeight;
}

let currentDossierSections = [];
let currentPartIndex = 0;
let isContinuousDossier = false;

function parseAcademicMarkdown(md) {
  if (!md) return '';

  let lines = md.split('\n');
  let htmlLines = [];
  let inTable = false;
  let inList = false;
  let inOrderedList = false;
  let inCodeBlock = false;
  let codeBlockLines = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Fenced Code Block Handling (``` ... ```)
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        if (inTable) { htmlLines.push('</tbody></table></div>'); inTable = false; }
        if (inList) { htmlLines.push('</ul>'); inList = false; }
        if (inOrderedList) { htmlLines.push('</ol>'); inOrderedList = false; }
        inCodeBlock = true;
        codeBlockLines = [];
        continue;
      } else {
        inCodeBlock = false;
        htmlLines.push('<div class="dossier-code-block-wrap"><pre class="dossier-code-block"><code>' + escapeHtml(codeBlockLines.join('\n')) + '</code></pre></div>');
        codeBlockLines = [];
        continue;
      }
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // Markdown Table Handling
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (inList) { htmlLines.push('</ul>'); inList = false; }
      if (inOrderedList) { htmlLines.push('</ol>'); inOrderedList = false; }
      
      let cells = line.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
      
      // Separator row (e.g. | :--- | :--- |)
      if (line.includes('---')) {
        continue;
      }

      if (!inTable) {
        htmlLines.push('<div class="dossier-table-wrap"><table class="dossier-academic-table">');
        htmlLines.push('<thead><tr>' + cells.map(c => `<th>${formatInlineMarkdown(c)}</th>`).join('') + '</tr></thead><tbody>');
        inTable = true;
        continue;
      } else {
        htmlLines.push('<tr>' + cells.map(c => `<td>${formatInlineMarkdown(c)}</td>`).join('') + '</tr>');
        continue;
      }
    } else if (inTable) {
      htmlLines.push('</tbody></table></div>');
      inTable = false;
    }

    // Unordered List item handling (- or *)
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      if (inOrderedList) { htmlLines.push('</ol>'); inOrderedList = false; }
      let content = line.trim().substring(2);
      if (!inList) {
        htmlLines.push('<ul class="dossier-academic-list">');
        inList = true;
      }
      htmlLines.push(`<li>${formatInlineMarkdown(content)}</li>`);
      continue;
    } else if (inList && !line.trim().startsWith('- ') && !line.trim().startsWith('* ')) {
      htmlLines.push('</ul>');
      inList = false;
    }

    // Ordered List item handling (1. , 2. )
    let orderedMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
    if (orderedMatch) {
      if (inList) { htmlLines.push('</ul>'); inList = false; }
      let content = orderedMatch[2];
      if (!inOrderedList) {
        htmlLines.push('<ol class="dossier-academic-list ordered">');
        inOrderedList = true;
      }
      htmlLines.push(`<li>${formatInlineMarkdown(content)}</li>`);
      continue;
    } else if (inOrderedList && !orderedMatch) {
      htmlLines.push('</ol>');
      inOrderedList = false;
    }

    // Headers
    if (line.startsWith('# ')) {
      htmlLines.push(`<h1 class="dossier-h1">${formatInlineMarkdown(line.substring(2))}</h1>`);
    } else if (line.startsWith('## ')) {
      htmlLines.push(`<h2 class="dossier-h2">${formatInlineMarkdown(line.substring(3))}</h2>`);
    } else if (line.startsWith('### ')) {
      htmlLines.push(`<h3 class="dossier-h3">${formatInlineMarkdown(line.substring(4))}</h3>`);
    } else if (line.startsWith('#### ')) {
      htmlLines.push(`<h4 class="dossier-h4">${formatInlineMarkdown(line.substring(5))}</h4>`);
    } else if (line.trim().startsWith('> ')) {
      htmlLines.push(`<blockquote class="dossier-blockquote">${formatInlineMarkdown(line.trim().substring(2))}</blockquote>`);
    } else if (line.trim() === '---') {
      htmlLines.push('<hr class="dossier-divider" />');
    } else if (line.trim() === '') {
      htmlLines.push('');
    } else {
      htmlLines.push(`<p class="dossier-p">${formatInlineMarkdown(line)}</p>`);
    }
  }

  if (inCodeBlock) {
    htmlLines.push('<div class="dossier-code-block-wrap"><pre class="dossier-code-block"><code>' + escapeHtml(codeBlockLines.join('\n')) + '</code></pre></div>');
  }
  if (inTable) htmlLines.push('</tbody></table></div>');
  if (inList) htmlLines.push('</ul>');
  if (inOrderedList) htmlLines.push('</ol>');

  return htmlLines.join('\n');
}

function formatInlineMarkdown(text) {
  if (!text) return '';
  
  const linkPlaceholders = [];
  
  // 1. Convert Markdown links [Text](URL) first, and store as placeholders to prevent nested parsing
  let formatted = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s\"\']+(?:\([^\s\"\']*\)[^\s\"\']*)*)\)/g, (match, title, url) => {
    const cleanTitle = title.replace(/\s*↗/g, '').trim();
    const htmlLink = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="dossier-link">${cleanTitle} ↗</a>`;
    const placeholder = `%%%LINK_PH_${linkPlaceholders.length}%%%`;
    linkPlaceholders.push(htmlLink);
    return placeholder;
  });

  // 2. Process bold, italics, inline code, math
  formatted = formatted
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\`(.*?)\`/g, '<code class="dossier-code">$1</code>')
    .replace(/\$\$(.*?)\$\$/g, '<div class="dossier-math-block"><code>$$ $1 $$</code></div>');

  // 3. Convert any remaining standalone raw URLs (not inside existing links)
  formatted = formatted.replace(/(^|[\s(])(https?:\/\/[a-zA-Z0-9\-\._~:\/\?#\[\]@!\$&'\(\)\*\+,;=%]+)(?=[\s)]|$)/g, (match, prefix, rawUrl) => {
    return `${prefix}<a href="${rawUrl}" target="_blank" rel="noopener noreferrer" class="dossier-link">${rawUrl} ↗</a>`;
  });

  // 4. Restore the markdown links from placeholders
  linkPlaceholders.forEach((htmlLink, idx) => {
    formatted = formatted.replace(`%%%LINK_PH_${idx}%%%`, htmlLink);
  });

  return formatted;
}

function renderDossier(payload) {
  renderResearchIntelligence(payload);
}

function renderResearchIntelligence(payload) {
  if (!payload) return;

  // Store 17 parts
  currentDossierSections = payload.dossier_sections || [];
  currentPartIndex = 0;

  // If no structured sections received, fallback to split by '---'
  if (currentDossierSections.length === 0 && payload.dossier) {
    const rawParts = payload.dossier.split(/\r?\n\r?\n---\r?\n\r?\n/);
    currentDossierSections = rawParts.map((p, idx) => ({
      part_num: idx + 1,
      id: `part-${idx + 1}`,
      title: `Part ${idx + 1}`,
      markdown: p
    }));
  }

  renderDossierView();

  // Render Gap Radar
  if (payload.gaps) {
    renderGaps(payload.gaps);
  }

  // Render Integrity & Reproducibility
  if (payload.integrity || payload.reproducibility) {
    renderIntegrity(payload.integrity || [], payload.reproducibility || []);
  }

  // Render Contradiction & Consensus
  if (payload.contradictions) {
    renderConflicts(payload.contradictions);
  }

  // Render Claim-to-Evidence Matrix
  if (payload.claims) {
    renderEvidence(payload.claims);
  }

  // Auto-switch to Dossier tab
  const tab = document.querySelector('.tab-btn[data-tab="dossier"]');
  if (tab) tab.click();
}

let isOutlineOpenInSplit = false;

function toggleSplitOutline() {
  isOutlineOpenInSplit = !isOutlineOpenInSplit;
  const sidebar = document.querySelector('.dossier-outline-sidebar');
  if (sidebar) {
    sidebar.classList.toggle('force-visible', isOutlineOpenInSplit);
  }
}

function renderDossierView() {
  const container = document.getElementById('dossier-output');
  if (!container) return;

  if (!currentDossierSections || currentDossierSections.length === 0) {
    container.innerHTML = `
      <div class="dossier-empty">
        <h3>NO ACTIVE RESEARCH DOSSIER</h3>
        <p>Type a research directive into the <strong>QUEUE</strong> below or select a preset and click <strong>send ➔</strong>.</p>
      </div>
    `;
    return;
  }

  const totalParts = currentDossierSections.length;
  const currSection = currentDossierSections[currentPartIndex] || currentDossierSections[0];

  let html = `
    <div class="multipart-dossier-container">
      <!-- Responsive Compact Top Control Bar (Essential for Split Mode & Mobile) -->
      <div class="dossier-compact-bar">
        <div class="dossier-compact-left">
          <button class="btn-compact-outline" onclick="toggleSplitOutline()" title="Toggle Outline">
            ☰ Outline
          </button>
          <select class="dossier-compact-select" onchange="jumpToDossierPart(this.value)">
            ${currentDossierSections.map((sec, idx) => `
              <option value="${idx}" ${idx === currentPartIndex ? 'selected' : ''}>
                ${sec.part_num}. ${escapeHtml(sec.title.replace(/^\d+\.\s*/, ''))}
              </option>
            `).join('')}
          </select>
        </div>

        <div class="dossier-compact-right">
          <button class="btn-compact-nav" onclick="prevDossierPart()" ${currentPartIndex === 0 || isContinuousDossier ? 'disabled' : ''} title="Previous Part">
            ◀
          </button>
          <span class="compact-part-pill">${currentPartIndex + 1}/${totalParts}</span>
          <button class="btn-compact-nav" onclick="nextDossierPart()" ${currentPartIndex === totalParts - 1 || isContinuousDossier ? 'disabled' : ''} title="Next Part">
            ▶
          </button>
          <button class="btn-compact-mode ${isContinuousDossier ? 'active' : ''}" onclick="toggleDossierViewMode()" title="Toggle View Mode">
            ${isContinuousDossier ? '📖 Section' : '📜 Full'}
          </button>
        </div>
      </div>

      <!-- Main Two-Column Layout: Left Outline Rail + Right Content Paper -->
      <div class="dossier-split-layout">
        <aside class="dossier-outline-sidebar ${isOutlineOpenInSplit ? 'force-visible' : ''}">
          <div class="outline-header">
            <span>RESEARCH OUTLINE</span>
            <button class="btn-outline-mode" onclick="toggleDossierViewMode()" title="Toggle View Mode">
              ${isContinuousDossier ? '📖 Section' : '📜 Full'}
            </button>
          </div>
          <nav class="outline-nav">
            ${currentDossierSections.map((sec, idx) => `
              <button class="outline-item ${idx === currentPartIndex && !isContinuousDossier ? 'active' : ''}" onclick="jumpToDossierPart(${idx})">
                <span class="outline-num">${sec.part_num < 10 ? '0' + sec.part_num : sec.part_num}</span>
                <span class="outline-title">${escapeHtml(sec.title.replace(/^\d+\.\s*/, ''))}</span>
              </button>
            `).join('')}
          </nav>
        </aside>

        <main class="dossier-paper-viewport" id="dossier-paper-viewport">
  `;

  if (isContinuousDossier) {
    // Continuous Full Report Mode
    html += `<div class="dossier-paper-sheet continuous">`;
    currentDossierSections.forEach((sec, idx) => {
      html += `
        <section class="dossier-section-block" id="section-part-${idx}">
          <div class="dossier-section-tag">PART ${sec.part_num} OF ${totalParts} • ${escapeHtml(sec.title)}</div>
          <div class="dossier-rendered-content">
            ${parseAcademicMarkdown(sec.markdown)}
          </div>
          ${idx < totalParts - 1 ? '<hr class="dossier-section-break" />' : ''}
        </section>
      `;
    });
    html += `</div>`;
  } else {
    // Step-by-Step Part Reader Mode
    html += `
      <div class="dossier-paper-sheet single-part">
        <div class="dossier-section-tag">PART ${currSection.part_num} OF ${totalParts}</div>
        <div class="dossier-rendered-content">
          ${parseAcademicMarkdown(currSection.markdown)}
        </div>

        <div class="dossier-part-bottom-nav">
          <button class="btn-dossier-bottom" onclick="prevDossierPart()" ${currentPartIndex === 0 ? 'disabled' : ''}>
            ◀ Previous: ${currentPartIndex > 0 ? escapeHtml(currentDossierSections[currentPartIndex - 1].title) : 'Start'}
          </button>
          <button class="btn-dossier-bottom next" onclick="nextDossierPart()" ${currentPartIndex === totalParts - 1 ? 'disabled' : ''}>
            ${currentPartIndex < totalParts - 1 ? `Next: ${escapeHtml(currentDossierSections[currentPartIndex + 1].title)} ▶` : 'End of Dossier ✓'}
          </button>
        </div>
      </div>
    `;
  }

  html += `
        </main>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

window.toggleSplitOutline = toggleSplitOutline;

function jumpToDossierPart(index) {
  currentPartIndex = parseInt(index, 10);
  if (isNaN(currentPartIndex) || currentPartIndex < 0) currentPartIndex = 0;
  if (currentPartIndex >= currentDossierSections.length) currentPartIndex = currentDossierSections.length - 1;
  renderDossierView();

  const viewport = document.getElementById('dossier-paper-viewport');
  if (isContinuousDossier) {
    const targetEl = document.getElementById(`section-part-${currentPartIndex}`);
    if (targetEl && targetEl.scrollIntoView) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
  }
  if (viewport) viewport.scrollTop = 0;
}

function nextDossierPart() {
  if (currentPartIndex < currentDossierSections.length - 1) {
    jumpToDossierPart(currentPartIndex + 1);
  }
}

function prevDossierPart() {
  if (currentPartIndex > 0) {
    jumpToDossierPart(currentPartIndex - 1);
  }
}

function toggleDossierViewMode() {
  isContinuousDossier = !isContinuousDossier;
  renderDossierView();
}

window.jumpToDossierPart = jumpToDossierPart;
window.nextDossierPart = nextDossierPart;
window.prevDossierPart = prevDossierPart;
window.toggleDossierViewMode = toggleDossierViewMode;


function renderGaps(gaps) {
  const container = document.getElementById('gaps-output');
  if (!container) return;

  if (!gaps || gaps.length === 0) {
    container.innerHTML = `<div class="intel-empty"><h3>NO RESEARCH GAPS DETECTED</h3><p>All empirical parameters saturated.</p></div>`;
    return;
  }

  let html = `<div class="intel-section-header">🎯 PRIORITIZED RESEARCH GAPS (${gaps.length} FOUND)</div><div class="intel-cards-grid">`;
  gaps.forEach(g => {
    html += `
      <div class="gap-card">
        <div class="gap-header">
          <span class="gap-category">${escapeHtml(g.category)}</span>
          <span class="gap-score">PRIORITY ${g.priority_score}/100</span>
        </div>
        <div class="gap-title">${escapeHtml(g.title)}</div>
        <div class="gap-desc">${escapeHtml(g.description)}</div>
        <div class="gap-meta-row">
          <span>Scarcity: <strong>${escapeHtml(g.evidence_scarcity)}</strong></span>
          <span>Impact: <strong>${escapeHtml(g.practical_impact)}</strong></span>
        </div>
        <div class="gap-recommendation">
          💡 <strong>Recommended Direction:</strong> ${escapeHtml(g.recommended_direction)}
        </div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

function renderIntegrity(integrityCards, reproCards) {
  const container = document.getElementById('integrity-output');
  if (!container) return;

  let html = `<div class="intel-section-header">🛡️ RETRACTION WATCH &amp; PAPER INTEGRITY CARDS</div><div class="intel-cards-grid">`;

  integrityCards.forEach(c => {
    let flagClass = 'flag-safe';
    let badgeClass = 'badge-safe';
    let label = '✓ SAFE TO CITE';

    if (c.retraction_detected) {
      flagClass = 'flag-retracted';
      badgeClass = 'badge-retracted';
      label = '⚠️ RETRACTED / QUARANTINED';
    } else if (c.correction_detected) {
      flagClass = 'flag-corrected';
      badgeClass = 'badge-corrected';
      label = '⚡ ERRATUM / CORRECTED';
    }

    const sourceUrl = c.url || (c.doi ? `https://doi.org/${c.doi}` : '');
    const platformBadge = c.platform_badge || (c.url && c.url.includes('github') ? '💻 GitHub' : c.url && c.url.includes('wikipedia') ? '🌐 Wikipedia' : c.url && c.url.includes('crossref') ? '📚 Crossref' : '🔬 arXiv');

    html += `
      <div class="integrity-card ${flagClass}">
        <div class="gap-header">
          <span class="integrity-badge ${badgeClass}">${label}</span>
          <span class="claim-platform-badge">${escapeHtml(platformBadge)}</span>
          <span style="font-family:var(--cth-font-mono);font-size:10px;">${escapeHtml(c.doc_id)}</span>
        </div>
        <div style="font-weight:700;font-size:12.5px;">${escapeHtml(c.title || c.doc_id)}</div>
        <div style="font-size:11px;font-family:var(--cth-font-mono);color:var(--cth-ink-800);margin:3px 0;">👤 Researched By: <strong>${escapeHtml(c.authors || 'Lead Research Authors')}</strong></div>
        <div style="font-size:10.5px;font-family:var(--cth-font-mono);color:var(--cth-ink-500);">DOI: ${escapeHtml(c.doi || 'N/A')} • COI: ${escapeHtml(c.coi_status || 'UNKNOWN')}</div>
        <div class="integrity-notes">${escapeHtml(c.notes || '')}</div>
        ${sourceUrl ? `<div style="margin-top:6px;display:flex;justify-content:flex-end;"><a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer" class="source-link-btn">🔗 Open Primary Source ↗</a></div>` : ''}
      </div>
    `;
  });
  html += `</div>`;

  if (reproCards && reproCards.length > 0) {
    html += `<div class="intel-section-header" style="margin-top:16px;">⚖️ REPRODUCIBILITY INSPECTOR (5-FACTOR RUBRIC)</div><div class="intel-cards-grid">`;
    reproCards.forEach(r => {
      html += `
        <div class="repro-card">
          <div class="repro-header">
            <strong>${escapeHtml(r.doc_id)} Rubric</strong>
            <span class="repro-score-pill">${r.total_score}/100 (${escapeHtml(r.rating)})</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:4px;margin-top:4px;">
      `;
      for (const [key, val] of Object.entries(r.breakdown || {})) {
        const title = key.replace(/_/g, ' ').toUpperCase();
        const pct = Math.round((val.score / val.max) * 100);
        html += `
          <div class="rubric-row">
            <span><strong>${title}</strong>: ${escapeHtml(val.note)}</span>
            <span>
              ${val.score}/${val.max}
              <div class="rubric-bar-wrap"><div class="rubric-bar-fill" style="width:${pct}%;"></div></div>
            </span>
          </div>
        `;
      }
      html += `</div></div>`;
    });
    html += `</div>`;
  }

  container.innerHTML = html;
}

function renderConflicts(conflicts) {
  const container = document.getElementById('conflicts-output');
  if (!container) return;

  if (!conflicts || conflicts.length === 0) {
    container.innerHTML = `<div class="intel-empty"><h3>NO ACTIVE CONTRADICTIONS</h3><p>Consensus observed across all cited literature.</p></div>`;
    return;
  }

  let html = `<div class="intel-section-header">⚡ EMPIRICAL CONTRADICTION &amp; CONSENSUS</div><div class="intel-cards-grid">`;
  conflicts.forEach(c => {
    const isMixed = c.consensus_status === 'MIXED_EVIDENCE';
    const badgeClass = isMixed ? 'polarity-mixed' : 'polarity-strong';
    const label = isMixed ? '⚠️ MIXED EVIDENCE' : '✓ STRONG CONSENSUS';

    const supporting = c.supporting_evidence || [];
    const contrasting = c.contrasting_evidence || [];

    html += `
      <div class="conflict-card">
        <div class="conflict-header">
          <strong style="font-size:12.5px;">${escapeHtml(c.topic || 'Consensus Topic')}</strong>
          <span class="polarity-badge ${badgeClass}">${label}</span>
        </div>
        <div class="conflict-split">
          <div class="evidence-side support">
            <div style="font-weight:700;color:var(--cth-green-dark);margin-bottom:4px;">✓ Supporting Evidence:</div>
            ${supporting.length > 0 ? supporting.map(e => `<div><strong>[${escapeHtml(e.doc_id || 'REF')}]</strong> ${escapeHtml(e.claim || '')}</div>`).join('') : '<div style="color:var(--cth-ink-500);font-style:italic;">No direct supporting evidence.</div>'}
          </div>
          <div class="evidence-side contrast">
            <div style="font-weight:700;color:var(--cth-red-dark);margin-bottom:4px;">⚡ Contrasting Evidence:</div>
            ${contrasting.length > 0 ? contrasting.map(e => `<div><strong>[${escapeHtml(e.doc_id || 'REF')}]</strong> ${escapeHtml(e.claim || '')}</div>`).join('') : '<div style="color:var(--cth-ink-500);font-style:italic;">No direct empirical dissent found.</div>'}
          </div>
        </div>
        <div class="divergence-box">
          🔍 <strong>Divergence Root Cause:</strong> ${escapeHtml(c.divergence_reason || 'N/A')}
        </div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

function renderEvidence(claims) {
  const container = document.getElementById('evidence-output');
  if (!container) return;

  if (!claims || claims.length === 0) {
    container.innerHTML = `<div class="intel-empty"><h3>NO CLAIMS EXTRACTED</h3><p>Awaiting research query dispatch.</p></div>`;
    return;
  }

  let html = `<div class="intel-section-header">📊 ARTICLE 13 MULTI-PLATFORM CLAIM-TO-EVIDENCE TRACEABILITY</div><div class="intel-cards-grid">`;
  claims.forEach(c => {
    const ev = c.evidence || {};
    const sourceUrl = ev.url || (ev.doi ? `https://doi.org/${ev.doi}` : '');
    const platformBadge = ev.platform_badge || (sourceUrl.includes('github') ? '💻 GitHub' : sourceUrl.includes('wikipedia') ? '🌐 Wikipedia' : sourceUrl.includes('crossref') ? '📚 Crossref' : '🔬 arXiv');
    const authors = ev.authors || 'Lead Research Authors';

    html += `
      <div class="claim-card">
        <div class="gap-header">
          <span style="font-family:var(--cth-font-mono);font-size:10px;font-weight:700;">${escapeHtml(c.claim_id)}</span>
          <span class="claim-platform-badge">${escapeHtml(platformBadge)}</span>
          <span class="claim-support-badge">${escapeHtml(c.support_state)}</span>
        </div>
        <div style="font-weight:700;font-size:13px;color:var(--cth-ink-900);line-height:1.35;">${escapeHtml(c.statement)}</div>
        <div style="font-size:11px;font-family:var(--cth-font-mono);color:var(--cth-ink-700);margin:2px 0;">👤 Researched By: <strong>${escapeHtml(authors)}</strong></div>
        <div class="claim-quote-box">
          "${escapeHtml(ev.quote || '')}"
        </div>
        <div class="claim-provenance-meta">
          <span>Source: <strong>${escapeHtml(ev.doc_id)}</strong> (${escapeHtml(ev.section)})</span>
          <span>DOI: <strong>${escapeHtml(ev.doi)}</strong></span>
          <span>RRF: <strong>${ev.rrf_score}</strong></span>
        </div>
        ${sourceUrl ? `<div style="margin-top:4px;display:flex;justify-content:flex-end;"><a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer" class="source-link-btn">🔗 View on ${escapeHtml(ev.platform || 'Platform')} ↗</a></div>` : ''}
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

window.escapeHtml = escapeHtml;
window.dispatchResearch = dispatchResearch;
window.selectAgent = selectAgent;
window.renderDossier = renderDossier;
window.renderResearchIntelligence = renderResearchIntelligence;
