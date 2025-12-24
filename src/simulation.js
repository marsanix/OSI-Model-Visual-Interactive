import gsap from "gsap";
import { TRANSLATIONS } from "./translations.js";
import { OSI_LAYERS } from "./osi_data.js";

let currentLang = 'id';
let animationTimeline = null;
let speedMultiplier = 1;
let isPaused = false;
let currentSimType = 'ping'; // 'ping' or 'http'

const LAYER_COLORS = {
    7: "#FF6B6B",
    6: "#4ECDC4",
    5: "#45B7D1",
    4: "#96CEB4",
    3: "#FFEEAD",
    2: "#D4A5A5",
    1: "#E0E0E0"
};

export function initSimulation(lang) {
    currentLang = lang;
    setupOverlay();
}

export function updateSimulationLang(lang) {
    currentLang = lang;
    const title = document.getElementById('sim-title-text');
    if (title) title.innerText = getSimTitle();

    updateUILabels();
}

function getText(key) {
    return TRANSLATIONS[currentLang][key] || key;
}

function getSimTitle() {
    return currentSimType === 'ping' ? getText('sim_title_ping') : getText('sim_title_http');
}

function updateUILabels() {
    const senderLabel = document.getElementById('sim-sender-label');
    if (senderLabel) senderLabel.innerText = currentSimType === 'http' ? getText('sim_client') : getText('sim_sender');

    const receiverLabel = document.getElementById('sim-receiver-label');
    if (receiverLabel) receiverLabel.innerText = currentSimType === 'http' ? getText('sim_server') : getText('sim_receiver');

    const startBtn = document.getElementById('sim-start-btn');
    if (startBtn) startBtn.innerHTML = '▶ ' + getText('sim_start');

    const pauseBtn = document.getElementById('sim-pause-btn');
    if (pauseBtn) {
        // preserve pause functionality label which changes dynamically
        if (isPaused) pauseBtn.innerHTML = '▶ ' + getText('sim_resume');
        else pauseBtn.innerHTML = '⏸ ' + getText('sim_pause');
    }

    const resetBtn = document.getElementById('sim-reset-btn');
    if (resetBtn) resetBtn.title = getText('sim_reset'); // Tooltip only

    const closeBtn = document.getElementById('sim-close-btn');
    if (closeBtn) closeBtn.title = getText('sim_close'); // Tooltip only

    // Speed label removed, emoji used

    // Update selector buttons
    document.querySelectorAll('.sim-type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === currentSimType);
    });

    // Update description
    const desc = document.getElementById('sim-log-text');
    if (desc) desc.innerText = currentSimType === 'ping' ? getText('sim_desc_ping') : getText('sim_desc_http');
}

function setupOverlay() {
    if (document.getElementById('simulation-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'simulation-overlay';
    overlay.innerHTML = `
      <div class="sim-container">
        <button id="sim-close-btn" class="sim-icon-btn close-absolute" title="${getText('sim_close')}">✕</button>
        <div class="sim-header">
             <div class="sim-header-top">
                 <h2 id="sim-title-text">${getSimTitle()}</h2>
             </div>
             
             <div class="sim-toolbar">
                 <div class="sim-type-selector">
                    <button class="sim-type-btn active" data-type="ping">🔁 Ping</button>
                    <button class="sim-type-btn" data-type="http">🌐 HTTP</button>
                 </div>
                 
                 <div class="sim-playback-group">
                    <div class="speed-control">
                       <span style="font-size:1.2rem">🚀</span>
                       <input type="range" id="sim-speed-slider" min="0.25" max="3" step="0.25" value="1">
                       <span id="sim-speed-value">1x</span>
                    </div>
                    
                    <div class="action-buttons">
                        <button id="sim-start-btn" class="sim-btn primary">▶ ${getText('sim_start')}</button>
                        <button id="sim-pause-btn" class="sim-btn secondary">⏸ ${getText('sim_pause')}</button>
                        <button id="sim-reset-btn" class="sim-btn secondary" title="${getText('sim_reset')}">↺</button>
                    </div>
                 </div>
             </div>
        </div>
        
        <div class="sim-stage">
             <!-- Packet moved to stage level for correct absolute positioning -->
             <div id="sim-packet" class="sim-packet">DATA</div>

             <div class="sim-stack" id="sim-sender">
                <div class="pc-icon">🖥️</div>
                <div class="stack-label" id="sim-sender-label">${getText('sim_sender')}</div>
                ${renderStack('sender')}
             </div>
             
             <!-- Cable moved to stage level for JS positioning -->
             <div class="cable-graphic">
                <div class="cable-connector left"></div>
                <div class="cable-connector right"></div>
             </div>

             <div class="sim-stack" id="sim-receiver">
                <div class="pc-icon">🖥️</div>
                <div class="stack-label" id="sim-receiver-label">${getText('sim_receiver')}</div>
                ${renderStack('receiver')}
             </div>
        </div>
        
        <div class="sim-log-panel">
            <div id="sim-log-text">${getText('sim_desc_ping')}</div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Event Listeners
    document.getElementById('sim-close-btn').addEventListener('click', closeSimulation);
    document.getElementById('sim-start-btn').addEventListener('click', startAnimation);
    document.getElementById('sim-reset-btn').addEventListener('click', resetAnimation);
    document.getElementById('sim-pause-btn').addEventListener('click', togglePause);

    document.body.appendChild(overlay);

    // Speed Slider
    const speedSlider = document.getElementById('sim-speed-slider');
    const speedValue = document.getElementById('sim-speed-value');
    speedSlider.addEventListener('input', (e) => {
        speedMultiplier = parseFloat(e.target.value);
        speedValue.textContent = speedMultiplier + 'x';
    });

    // Simulation Type Selector
    document.querySelectorAll('.sim-type-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentSimType = e.target.dataset.type;
            document.getElementById('sim-title-text').innerText = getSimTitle();
            updateUILabels();
            resetAnimation();
        });
    });

    // Initial Cable Layout
    window.addEventListener('resize', updateCableLayout);
    // Call after a short delay to ensure rendering
    setTimeout(updateCableLayout, 100);
}

// Function to dynamically position visual cable
function updateCableLayout() {
    const stage = document.querySelector('.sim-stage');
    const cable = document.querySelector('.cable-graphic');

    // Find L1 elements (Physical)
    const senderL1 = document.querySelector('.sim-layer[data-side="sender"][data-layer="1"]');
    const receiverL1 = document.querySelector('.sim-layer[data-side="receiver"][data-layer="1"]');

    if (!stage || !cable || !senderL1 || !receiverL1) return;


    // Force layout update if needed
    // Calculate centers of L1 relative to stage
    const stageRect = stage.getBoundingClientRect();
    const sRect = senderL1.getBoundingClientRect();
    const rRect = receiverL1.getBoundingClientRect();

    const startX = sRect.left - stageRect.left + (sRect.width / 2);
    const endX = rRect.left - stageRect.left + (rRect.width / 2);

    // Calculate width and left position
    const width = Math.abs(endX - startX);
    const left = Math.min(startX, endX);

    // Adjust for Border Thickness (4px)
    // We want the CENTER of the 4px border to be at `left` and `left + width`.
    // The element starts at `left`. Its border starts at `left` (0-4px). Center at 2px.
    // To align border center (2px) with target (startX), move element left by 2px.
    // New Left: left - 2
    // New Width: width + 4 (to compensate for -2 shift on left and ensure right border center lands on endX)

    cable.style.left = `${left - 2}px`;
    cable.style.width = `${width + 4}px`;
    cable.style.transform = 'none'; // distinct from CSS centering

    // Force Connector Styles (bypass CSS caching/specificity)
    const connL = cable.querySelector('.cable-connector.left');
    const connR = cable.querySelector('.cable-connector.right');
    if (connL) {
        connL.style.width = '10px';
        connL.style.height = '10px';
        connL.style.left = '-6px';
        connL.style.top = '-5px';
        connL.style.zIndex = '10';
    }
    if (connR) {
        connR.style.width = '10px';
        connR.style.height = '10px';
        connR.style.right = '-6px';
        connR.style.top = '-5px';
        connR.style.zIndex = '10';
    }

    // Align Top of U-shape to Bottom of L1
    // The visual cable is a U-shape border. Ideally the "connectors" touch L1.
    // L1 bottom is at sRect.bottom.
    // Relative to stage: sRect.bottom - stageRect.top.
    const l1BottomRel = sRect.bottom - stageRect.top;

    cable.style.top = `${l1BottomRel}px`;
    cable.style.bottom = 'auto';
}

function togglePause() {
    const pauseBtn = document.getElementById('sim-pause-btn');
    if (!animationTimeline) return;

    if (isPaused) {
        animationTimeline.resume();
        isPaused = false;
        pauseBtn.innerHTML = '⏸ ' + getText('sim_pause');
    } else {
        animationTimeline.pause();
        isPaused = true;
        pauseBtn.innerHTML = '▶ ' + getText('sim_resume');
    }
}

function renderStack(side) {
    return OSI_LAYERS.map(layer => `
      <div class="sim-layer" data-layer="${layer.id}" data-side="${side}" style="border-left: 4px solid ${layer.color}">
        <span class="sim-layer-id">${layer.id}</span>
        <span class="sim-layer-name">${layer.name}</span>
      </div>
    `).join('');
}

function closeSimulation() {
    const overlay = document.getElementById('simulation-overlay');
    gsap.to(overlay, {
        opacity: 0, duration: 0.5, onComplete: () => {
            overlay.style.display = 'none';
            resetAnimation();
        }
    });
}

export function openSimulation(lang) {
    currentLang = lang;
    let overlay = document.getElementById('simulation-overlay');
    if (!overlay) {
        setupOverlay();
        overlay = document.getElementById('simulation-overlay');
    }
    updateSimulationLang(lang);

    overlay.style.display = 'flex';
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.5 });

    // Ensure cable layout is calculated after overlay is visible
    setTimeout(updateCableLayout, 50);
}

function resetAnimation() {
    if (animationTimeline) animationTimeline.kill();
    isPaused = false;

    const pauseBtn = document.getElementById('sim-pause-btn');
    if (pauseBtn) pauseBtn.innerHTML = '⏸ ' + getText('sim_pause');

    gsap.set('#sim-packet', { clearProps: "all" });
    document.querySelectorAll('.sim-layer').forEach(el => el.classList.remove('active', 'highlight'));
    document.querySelectorAll('.sim-layer').forEach(el => el.style.backgroundColor = '');

    const desc = currentSimType === 'ping' ? getText('sim_desc_ping') : getText('sim_desc_http');
    document.getElementById('sim-log-text').innerText = desc;

    const packet = document.getElementById('sim-packet');
    packet.style.opacity = 0;
    packet.innerText = currentSimType === 'ping' ? 'ICMP' : 'HTTP';
    packet.style.backgroundColor = LAYER_COLORS[7];
}

function startAnimation() {
    resetAnimation();

    if (currentSimType === 'ping') {
        runPingSimulation();
    } else {
        runHttpSimulation();
    }
}

// ============ PING SIMULATION (ICMP Echo Request + Reply) ============
function runPingSimulation() {
    const packet = document.getElementById('sim-packet');
    const logVal = document.getElementById('sim-log-text');

    const baseDur = 0.5 / speedMultiplier;
    const wireDur = 1.2 / speedMultiplier;
    const highlightDur = 0.15 / speedMultiplier;

    animationTimeline = gsap.timeline();

    // Initial State
    animationTimeline.set(packet, { opacity: 1, scale: 1, backgroundColor: LAYER_COLORS[7], top: '50px', left: '16%' });
    packet.innerText = 'ICMP';

    // --- PHASE 1: ECHO REQUEST (Sender -> Receiver) ---
    animationTimeline.call(() => { logVal.innerText = "📤 " + getText('sim_ping_request'); });

    // Sender: Encapsulation (L7 -> L1)
    [7, 6, 5, 4, 3, 2, 1].forEach((layerId, index) => {
        const layerEl = document.querySelector(`.sim-layer[data-side="sender"][data-layer="${layerId}"]`);

        animationTimeline
            .to(layerEl, { backgroundColor: "rgba(255,255,255,0.15)", duration: highlightDur }, `req_s${layerId}`)
            .to(packet, {
                top: layerEl.offsetTop + 10,
                backgroundColor: LAYER_COLORS[layerId],
                scale: 1 + (index * 0.04),
                duration: baseDur,
                ease: "power1.inOut",
                onStart: () => {
                    // Show layer + detailed protocol info
                    logVal.innerHTML = `<strong>📤 L${layerId}:</strong> ${getText('sim_ping_l' + layerId)}`;
                    if (layerId === 3) packet.innerText = 'PKT';
                    if (layerId === 2) packet.innerText = 'FRM';
                    if (layerId === 1) packet.innerText = 'BIT';
                }
            }, `req_s${layerId}`);
    });

    // Helper to check mobile state (Forced true for universal U-shape animation)
    const isMobile = () => true;

    // Helper for Wire Animation Path
    const animateWire = (direction) => { // direction: 'tx' (sender->receiver) or 'rx' (receiver->sender)
        const isMob = isMobile();
        const startSide = direction === 'tx' ? 'sender' : 'receiver';
        const endSide = direction === 'tx' ? 'receiver' : 'sender';

        const startL1 = document.querySelector(`.sim-layer[data-side="${startSide}"][data-layer="1"]`);
        const endL1 = document.querySelector(`.sim-layer[data-side="${endSide}"][data-layer="1"]`);

        if (!startL1 || !endL1) return gsap.timeline(); // fallback

        const tl = gsap.timeline({
            onStart: () => {
                logVal.innerText = "📡 " + getText('sim_wire_tx');
                if (currentSimType === 'http') packet.innerText = '📶';
            }
        });

        if (isMob) {
            // Mobile U-Shape Animation (Simulating cable below Layer 1)
            const stage = document.querySelector('.sim-stage');
            const cable = document.querySelector('.cable-graphic');

            const startRect = startL1.getBoundingClientRect();
            const endRect = endL1.getBoundingClientRect();
            const stageRect = stage.getBoundingClientRect();
            // Fallback if cable not found or not visible: target near bottom of stage
            const cableBottomY = cable ? cable.getBoundingClientRect().bottom : (stageRect.bottom - 5);

            // Calculate positions relative to stage
            const startX = startRect.left - stageRect.left + (startRect.width / 2) - 15; // Centered
            const startY = startRect.top - stageRect.top + 10; // Center of L1

            const endX = endRect.left - stageRect.left + (endRect.width / 2) - 15;
            const endY = endRect.top - stageRect.top + 10;

            // Wire Y position: Align center of packet with bottom of cable graphic
            // cableBottomY is absolute viewport Y. stageRect.top is absolute viewport Y of stage.
            // Rel Y = cableBottomY - stageRect.top.
            // Packet Top = Rel Y - (PacketHeight/2). Packet Height is 30px.
            // Adjustment: -20px seems visually correct to center on a bottom border.
            const wireY = (cableBottomY - stageRect.top) - 20;

            // 1. Move down from Start L1 to Wire Level
            tl.to(packet, {
                top: wireY,
                left: startX,
                duration: wireDur * 0.3,
                ease: "power1.in",
                backgroundColor: direction === 'tx' ? "#fff" : "#90EE90"
            });
            // 2. Move Horizontal along wire
            tl.to(packet, {
                top: wireY,
                left: endX,
                duration: wireDur * 0.4,
                ease: "none"
            });
            // 3. Move Up to End L1
            tl.to(packet, {
                top: endY,
                left: endX,
                duration: wireDur * 0.3,
                ease: "power1.out"
            });
        } else {
            // Desktop Linear Animation
            // Recalculate end target relative to stage
            const stage = document.querySelector('.sim-stage');
            const endRect = endL1.getBoundingClientRect();
            const stageRect = stage.getBoundingClientRect();
            const endL1Y = endRect.top - stageRect.top + 10;

            tl.to(packet, {
                left: direction === 'tx' ? '84%' : '16%',
                top: endL1Y,
                duration: wireDur,
                ease: "none",
                backgroundColor: direction === 'tx' ? "#fff" : "#90EE90",
                scale: 0.6
            });
        }
        return tl;
    };

    // Wire Transmission (Request)
    animationTimeline.add(animateWire('tx'));

    // Receiver: Decapsulation (L1 -> L7)
    [1, 2, 3, 4, 5, 6, 7].forEach((layerId, index) => {
        const layerEl = document.querySelector(`.sim-layer[data-side="receiver"][data-layer="${layerId}"]`);

        animationTimeline
            .to(layerEl, { backgroundColor: "rgba(255,255,255,0.15)", duration: highlightDur }, `req_r${layerId}`)
            .to(packet, {
                top: layerEl.offsetTop + 10,
                backgroundColor: LAYER_COLORS[layerId],
                scale: 1.3 - (index * 0.04),
                duration: baseDur,
                ease: "power1.inOut",
                onStart: () => {
                    logVal.innerHTML = `<strong>📥 L${layerId} [Receiver]:</strong> ${getText('sim_ping_l' + layerId)}`;
                    if (layerId === 2) packet.innerText = 'FRM';
                    if (layerId === 3) packet.innerText = 'PKT';
                    if (layerId >= 4) packet.innerText = 'ICMP';
                }
            }, `req_r${layerId}`);
    });

    // --- PHASE 2: ECHO REPLY (Receiver -> Sender) ---
    animationTimeline.call(() => {
        logVal.innerText = "📤 " + getText('sim_ping_reply');
        packet.innerText = 'REPLY';
    });

    // Receiver: Encapsulation (L7 -> L1)
    [7, 6, 5, 4, 3, 2, 1].forEach((layerId, index) => {
        const layerEl = document.querySelector(`.sim-layer[data-side="receiver"][data-layer="${layerId}"]`);

        animationTimeline
            .to(layerEl, { backgroundColor: "rgba(100,255,100,0.15)", duration: highlightDur }, `rep_r${layerId}`)
            .to(packet, {
                top: layerEl.offsetTop + 10,
                backgroundColor: LAYER_COLORS[layerId],
                scale: 1 + (index * 0.04),
                duration: baseDur,
                ease: "power1.inOut",
                onStart: () => {
                    logVal.innerHTML = `<strong>📤 L${layerId} [Reply]:</strong> ${getText('sim_ping_l' + layerId)}`;
                    if (layerId === 3) packet.innerText = 'PKT';
                    if (layerId === 2) packet.innerText = 'FRM';
                    if (layerId === 1) packet.innerText = 'BIT';
                }
            }, `rep_r${layerId}`);
    });

    // Wire Transmission (Reply - reverse direction)
    animationTimeline.add(animateWire('rx'));

    // Sender: Decapsulation (L1 -> L7) - Receive Reply
    [1, 2, 3, 4, 5, 6, 7].forEach((layerId, index) => {
        const layerEl = document.querySelector(`.sim-layer[data-side="sender"][data-layer="${layerId}"]`);

        animationTimeline
            .to(layerEl, { backgroundColor: "rgba(100,255,100,0.15)", duration: highlightDur }, `rep_s${layerId}`)
            .to(packet, {
                top: layerEl.offsetTop + 10,
                backgroundColor: LAYER_COLORS[layerId],
                scale: 1.3 - (index * 0.04),
                duration: baseDur,
                ease: "power1.inOut",
                onStart: () => {
                    logVal.innerHTML = `<strong>📥 L${layerId} [Reply Received]:</strong> ${getText('sim_ping_l' + layerId)}`;
                    if (layerId === 2) packet.innerText = 'FRM';
                    if (layerId === 3) packet.innerText = 'PKT';
                    if (layerId >= 4) packet.innerText = 'REPLY';
                }
            }, `rep_s${layerId}`);
    });

    // Complete
    animationTimeline.to(packet, {
        scale: 1.5, opacity: 0, duration: 0.5, onComplete: () => {
            logVal.innerText = "✅ " + getText('sim_ping_complete');
        }
    });
}

// ============ HTTP REQUEST SIMULATION ============
function runHttpSimulation() {
    const packet = document.getElementById('sim-packet');
    const logVal = document.getElementById('sim-log-text');

    const baseDur = 0.5 / speedMultiplier;
    const wireDur = 1.2 / speedMultiplier;
    const highlightDur = 0.15 / speedMultiplier;

    animationTimeline = gsap.timeline();

    // Initial State
    animationTimeline.set(packet, { opacity: 1, scale: 1, backgroundColor: LAYER_COLORS[7], top: '50px', left: '16%' });
    packet.innerText = 'HTTP';

    // Helper to check mobile state (Forced true for universal U-shape animation)
    const isMobile = () => true;

    // Helper for Wire Animation Path (Repeated for local scope or move to outer scope, but keeping local for now)
    // Helper for Wire Animation Path (Corrected to use getBoundingClientRect handles nesting)
    const animateWire = (direction) => {
        const isMob = isMobile();
        const startSide = direction === 'tx' ? 'sender' : 'receiver';
        const endSide = direction === 'tx' ? 'receiver' : 'sender';

        const startL1 = document.querySelector(`.sim-layer[data-side="${startSide}"][data-layer="1"]`);
        const endL1 = document.querySelector(`.sim-layer[data-side="${endSide}"][data-layer="1"]`);

        if (!startL1 || !endL1) return gsap.timeline();

        const tl = gsap.timeline({
            onStart: () => {
                logVal.innerText = "📡 " + getText('sim_wire_tx');
                packet.innerText = '📶';
            }
        });

        const color = direction === 'tx' ? "#38bdf8" : "#22c55e"; // Blue for req, Green for resp

        // Calculate positions relative to stage (Robust method)
        const stage = document.querySelector('.sim-stage');
        const startRect = startL1.getBoundingClientRect();
        const endRect = endL1.getBoundingClientRect();
        const stageRect = stage.getBoundingClientRect();
        const cable = document.querySelector('.cable-graphic');

        // Fallback if cable not found
        const cableBottomY = cable ? cable.getBoundingClientRect().bottom : (stageRect.bottom - 5);
        // Wire Y position: Align center of packet with bottom of cable graphic
        const wireY = (cableBottomY - stageRect.top) - 20;

        // Start/End Connectors
        const startX = startRect.left - stageRect.left + (startRect.width / 2) - 15;
        const endX = endRect.left - stageRect.left + (endRect.width / 2) - 15;
        const endY = endRect.top - stageRect.top + 10;

        if (isMob) {
            // 1. Move down from Start L1 to Wire Level
            tl.to(packet, {
                top: wireY,
                left: startX,
                duration: wireDur * 0.3,
                ease: "power1.in",
                backgroundColor: color
            });
            // 2. Move Horizontal along wire
            tl.to(packet, {
                top: wireY,
                left: endX,
                duration: wireDur * 0.4,
                ease: "none"
            });
            // 3. Move Up to End L1
            tl.to(packet, {
                top: endY,
                left: endX,
                duration: wireDur * 0.3,
                ease: "power1.out"
            });
        } else {
            // Desktop Linear (if isMobile becomes false)
            tl.to(packet, {
                left: direction === 'tx' ? '84%' : '16%',
                top: endY,
                duration: wireDur,
                ease: "none",
                backgroundColor: color,
                scale: 0.6
            });
        }
        return tl;
    };

    // --- HTTP GET Request (Client -> Server) ---
    animationTimeline.call(() => { logVal.innerText = "🌐 " + getText('sim_http_request'); });

    // Client: Encapsulation (L7 -> L1)
    const httpLabels = {
        7: 'GET /',
        6: 'DATA',
        5: 'SESS',
        4: 'TCP',
        3: 'IP',
        2: 'FRM',
        1: 'BIT'
    };

    [7, 6, 5, 4, 3, 2, 1].forEach((layerId, index) => {
        const layerEl = document.querySelector(`.sim-layer[data-side="sender"][data-layer="${layerId}"]`);

        animationTimeline
            .to(layerEl, { backgroundColor: "rgba(56,189,248,0.2)", duration: highlightDur }, `http_s${layerId}`)
            .to(packet, {
                top: layerEl.offsetTop + 10,
                backgroundColor: LAYER_COLORS[layerId],
                scale: 1 + (index * 0.04),
                duration: baseDur,
                ease: "power1.inOut",
                onStart: () => {
                    logVal.innerHTML = `<strong>🌐 L${layerId}:</strong> ${getText('sim_http_l' + layerId)}`;
                    packet.innerText = httpLabels[layerId];
                }
            }, `http_s${layerId}`);
    });

    // Wire Transmission
    animationTimeline.add(animateWire('tx'));

    // Server: Decapsulation (L1 -> L7)
    [1, 2, 3, 4, 5, 6, 7].forEach((layerId, index) => {
        const layerEl = document.querySelector(`.sim-layer[data-side="receiver"][data-layer="${layerId}"]`);

        animationTimeline
            .to(layerEl, { backgroundColor: "rgba(56,189,248,0.2)", duration: highlightDur }, `http_r${layerId}`)
            .to(packet, {
                top: layerEl.offsetTop + 10,
                backgroundColor: LAYER_COLORS[layerId],
                scale: 1.3 - (index * 0.04),
                duration: baseDur,
                ease: "power1.inOut",
                onStart: () => {
                    logVal.innerHTML = `<strong>📥 Server L${layerId}:</strong> ${getText('sim_http_l' + layerId)}`;
                    packet.innerText = httpLabels[layerId];
                }
            }, `http_r${layerId}`);
    });

    // Server Processing
    animationTimeline.call(() => {
        logVal.innerText = "⚙️ " + getText('sim_http_processing');
        packet.innerText = '⚙️';
    }).to({}, { duration: 0.5 / speedMultiplier });

    // --- HTTP Response (Server -> Client) ---
    animationTimeline.call(() => {
        logVal.innerText = "📤 " + getText('sim_http_response');
        packet.innerText = '200';
        packet.style.backgroundColor = '#22c55e'; // Green for success
    });

    // Server: Encapsulation (L7 -> L1) for Response
    [7, 6, 5, 4, 3, 2, 1].forEach((layerId, index) => {
        const layerEl = document.querySelector(`.sim-layer[data-side="receiver"][data-layer="${layerId}"]`);

        animationTimeline
            .to(layerEl, { backgroundColor: "rgba(34,197,94,0.2)", duration: highlightDur }, `resp_r${layerId}`)
            .to(packet, {
                top: layerEl.offsetTop + 10,
                backgroundColor: layerId === 7 ? '#22c55e' : LAYER_COLORS[layerId],
                scale: 1 + (index * 0.04),
                duration: baseDur,
                ease: "power1.inOut",
                onStart: () => {
                    logVal.innerHTML = `<strong>📤 Response L${layerId}:</strong> ${getText('sim_http_l' + layerId)}`;
                    if (layerId === 7) packet.innerText = 'HTML';
                    else if (layerId <= 2) packet.innerText = httpLabels[layerId];
                    else packet.innerText = httpLabels[layerId];
                }
            }, `resp_r${layerId}`);
    });

    // Wire Transmission (Response)
    animationTimeline.add(animateWire('rx'));

    // Client: Decapsulation (L1 -> L7) - Receive Response
    [1, 2, 3, 4, 5, 6, 7].forEach((layerId, index) => {
        const layerEl = document.querySelector(`.sim-layer[data-side="sender"][data-layer="${layerId}"]`);

        animationTimeline
            .to(layerEl, { backgroundColor: "rgba(34,197,94,0.2)", duration: highlightDur }, `resp_s${layerId}`)
            .to(packet, {
                top: layerEl.offsetTop + 10,
                backgroundColor: layerId === 7 ? '#22c55e' : LAYER_COLORS[layerId],
                scale: 1.3 - (index * 0.04),
                duration: baseDur,
                ease: "power1.inOut",
                onStart: () => {
                    logVal.innerHTML = `<strong>📥 Client L${layerId}:</strong> ${getText('sim_http_l' + layerId)}`;
                    if (layerId === 7) packet.innerText = 'HTML';
                    else packet.innerText = httpLabels[layerId];
                }
            }, `resp_s${layerId}`);
    });

    // Complete
    animationTimeline.to(packet, {
        scale: 1.5, opacity: 0, duration: 0.5, onComplete: () => {
            logVal.innerText = "✅ " + getText('sim_http_complete');
        }
    });
}
