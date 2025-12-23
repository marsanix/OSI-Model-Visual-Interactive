import { OSI_LAYERS, TCP_IP_LAYERS } from './osi_data.js';
import { PROTOCOL_DATA } from './protocol_data.js';
import { TRANSLATIONS } from './translations.js';
import { initSimulation, openSimulation, updateSimulationLang } from './simulation.js';
import gsap from 'gsap';

let currentLang = 'id';

// Initialize Simulation Module
initSimulation(currentLang);

// Wire up Simulation Button
const simBtn = document.getElementById('sim-btn');
if (simBtn) {
    simBtn.addEventListener('click', () => openSimulation(currentLang));
}

function t(obj) {
    if (typeof obj === 'object' && obj !== null && obj[currentLang]) {
        return obj[currentLang];
    }
    return obj; // Fallback if string or missing translation
}

function getText(key) {
    return TRANSLATIONS[currentLang][key] || key;
}

const comparisonGrid = document.getElementById('comparison-grid');
const detailContent = document.getElementById('detail-content');
const detailNumber = document.getElementById('detail-number');
const detailPanel = document.getElementById('detail-panel');

// --- Language Toggle Logic ---
const langBtn = document.getElementById('lang-toggle');
const langText = document.getElementById('lang-text');

if (langBtn) {
    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'id' ? 'en' : 'id';
        updateLanguageUI();
    });
}

// Constants for Absolute Position Logic
let CONTAINER_WIDTH = 0;
let CONTAINER_HEIGHT = 0;
const HEADER_HEIGHT = 40;
const PAD_TOP = 16;
const PAD_SIDE = 80; // Increased to 80px to fit flow arrows
const GAP = 8;
const GAP_CENTER = 120;

// Store references
let osiCards = [];
let tcpCards = [];
let svgElement = null;

// --- MODAL LOGIC ---
const modalOverlay = document.getElementById('protocol-modal');
const modalCloseBtn = document.querySelector('.modal-close');

const PDU_DESCRIPTIONS = {
    "Data": { id: "Data mentah dari aplikasi.", en: "Raw data from application." },
    "Segments": { id: "Data dipecah & diberi port.", en: "Data segmented & ported." },
    "Packets": { id: "Ditambah IP Source/Dest.", en: "IP Source/Dest added." },
    "Frames": { id: "Ditambah MAC & Error Check.", en: "MAC & Error Check added." },
    "Bits": { id: "Sinyal fisik (0/1).", en: "Physical signals (0/1)." },
    "Frames & Bits": { id: "Gabungan L1 & L2.", en: "Combined L1 & L2." }
};

function updateLanguageUI() {
    // Update Toggle Text/Icon
    const langText = document.getElementById('lang-text');
    if (langText) {
        langText.textContent = currentLang === 'id' ? 'ID 🇮🇩' : 'EN 🇺🇸';
    }

    if (document.querySelector('h1 span')) document.querySelector('h1 span').textContent = getText('title_interactive');
    if (document.querySelector('header div')) document.querySelector('header div').textContent = getText('subtitle');

    const osiHeader = document.querySelector('.osi-header');
    if (osiHeader) osiHeader.textContent = getText('osi_header');
    const tcpHeader = document.querySelector('.tcp-header');
    if (tcpHeader) tcpHeader.textContent = getText('tcp_header');

    const flowDown = document.querySelector('.flow-down .flow-label');
    if (flowDown) flowDown.textContent = getText('flow_down') + " ▼";

    const flowUp = document.querySelector('.flow-up .flow-label');
    if (flowUp) flowUp.textContent = getText('flow_up') + " ▲";

    // Re-render Detail if active
    const activeCard = document.querySelector('.layer-card.active');
    if (activeCard) {
        const id = parseInt(activeCard.getAttribute('data-id'));
        const type = activeCard.getAttribute('data-type');
        const layers = type === 'osi' ? OSI_LAYERS : TCP_IP_LAYERS;
        const layer = layers.find(l => l.id === id);
        if (layer) updateDetailViewContent(layer);
    } else {
        // Only update welcome msg if detailContent is empty or showing welcome
        if (detailContent.innerHTML.includes('Click a layer') || detailContent.innerHTML.includes('Pilih sebuah layer')) {
            detailContent.innerHTML = `
        <div style="text-align: center; opacity: 0.5;">
          <h2>${getText('welcome_title')}</h2>
          <p>${getText('welcome_desc')}</p>
        </div>
      `;
        }
    }

    // Update Cards Text (Subtitles & Tooltips)
    document.querySelectorAll('.layer-card').forEach(card => {
        const id = parseInt(card.getAttribute('data-id'));
        const type = card.getAttribute('data-type');
        const layers = type === 'osi' ? OSI_LAYERS : TCP_IP_LAYERS;
        const layer = layers.find(l => l.id === id);

        if (layer) {
            const sub = card.querySelector('.layer-subtitle');
            if (sub) sub.textContent = t(layer.subtitle);

            const tooltip = card.querySelector('.pdu-tooltip');
            if (tooltip) {
                tooltip.innerHTML = `<strong>${layer.pdu}</strong><br>${t(PDU_DESCRIPTIONS[layer.pdu]) || 'Unit Data'}`;
            }
        }
    });

    // Update Simulation Button Text and Overlay
    const simBtnEl = document.getElementById('sim-btn');
    if (simBtnEl) simBtnEl.textContent = getText('sim_btn');
    updateSimulationLang(currentLang);
}

function openProtocolModal(protocolName) {
    const data = PROTOCOL_DATA[protocolName];
    if (!data) return;

    const modal = document.getElementById('protocol-modal');
    // Set text content
    document.getElementById('modal-title').textContent = protocolName;
    document.getElementById('modal-subtitle').textContent = data.name || protocolName;
    document.getElementById('modal-desc').textContent = t(data.description);

    // Dynamic Headers
    const riskTitle = document.querySelector('#modal-risks')?.previousElementSibling; // Security Risks usually h4 or similar? No, check HTML structure in future if needed but assuming static for now
    // Actually we should update the static headers in logical function if we can select them
    // For now let's just focus on content data

    const useCaseBox = document.getElementById('modal-usecases');
    if (data.use_cases) {
        useCaseBox.style.display = 'block';
        useCaseBox.innerHTML = `<strong>${getText('use_cases')}</strong> <span>${t(data.use_cases)}</span>`;
    } else {
        useCaseBox.style.display = 'none';
    }

    // Populate Risks
    const riskList = document.getElementById('modal-risks');
    riskList.innerHTML = '';
    if (data.security && data.security.risks && data.security.risks.length > 0) {
        data.security.risks.forEach(risk => {
            riskList.innerHTML += `<li><strong style="color: #fca5a5">${risk.title}</strong>: ${t(risk.desc)}</li>`;
        });
    } else {
        riskList.innerHTML = `<li style="opacity:0.6;">-</li>`;
    }

    // Populate Mitigations
    const mitList = document.getElementById('modal-mitigations');
    mitList.innerHTML = '';
    if (data.security && data.security.mitigation && data.security.mitigation.length > 0) {
        data.security.mitigation.forEach(mit => {
            mitList.innerHTML += `<li><strong style="color: #86efac">${mit.title}</strong>: ${t(mit.desc)}</li>`;
        });
    } else {
        mitList.innerHTML = `<li style="opacity:0.6;">-</li>`;
    }

    // Populate References
    const refContainer = document.getElementById('modal-refs-container');
    if (data.references && data.references.length > 0) {
        refContainer.innerHTML = `
        <div class="modal-section" style="border-top:1px solid rgba(255,255,255,0.1); padding-top:1rem; margin-bottom:0;">
          <h3>${getText('references')}</h3>
          <ul class="ref-list">
             ${data.references.map(ref => `
               <li class="ref-item">
                 <a href="${ref.url}" target="_blank" class="ref-link" style="padding-left:0">${ref.title}</a>
               </li>
             `).join('')}
          </ul>
        </div>
      `;
    } else {
        refContainer.innerHTML = '';
    }

    modal.classList.add('active');
    gsap.from('.modal-content', { scale: 0.9, opacity: 0, duration: 0.3, ease: "back.out(1.2)" });
}

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });
}

function init() {
    // Clear any existing
    if (comparisonGrid) {
        comparisonGrid.querySelectorAll('.layer-card').forEach(e => e.remove());
        const existingSvg = comparisonGrid.querySelector('svg');
        if (existingSvg) existingSvg.remove();
    }

    osiCards = [];
    tcpCards = [];

    // Create SVG Container
    svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.classList.add('connections-svg');

    // Add Bidirectional Small Arrow Markers
    svgElement.innerHTML = `
    <defs>
      <!-- Pointing Left (Start) -->
      <marker id="arrowhead-start" markerWidth="6" markerHeight="4" 
      refX="0" refY="2" orient="auto">
        <polygon points="6 0, 0 2, 6 4" fill="rgba(255, 255, 255, 0.3)" />
      </marker>
      
      <!-- Pointing Right (End) -->
      <marker id="arrowhead-end" markerWidth="6" markerHeight="4" 
      refX="6" refY="2" orient="auto">
        <polygon points="0 0, 6 2, 0 4" fill="rgba(255, 255, 255, 0.3)" />
      </marker>
    </defs>
  `;
    if (comparisonGrid) comparisonGrid.appendChild(svgElement);

    // Render OSI Layers
    OSI_LAYERS.forEach((layer, index) => {
        const card = createCard(layer, 'osi');
        if (comparisonGrid) comparisonGrid.appendChild(card);
        osiCards.push({ element: card, index: index, data: layer });
    });

    // Render TCP Layers
    TCP_IP_LAYERS.forEach((layer) => {
        const card = createCard(layer, 'tcp');

        // Calculate span and visual index
        const maxOsiId = Math.max(...layer.osi_mapping);
        const startIndex = OSI_LAYERS.findIndex(l => l.id === maxOsiId);
        const span = layer.height_factor;

        if (comparisonGrid) comparisonGrid.appendChild(card);
        tcpCards.push({ element: card, startIndex: startIndex, span: span, data: layer });
    });

    // Calculate Initial Layout & Draw Lines
    calculateAbsoluteLayout();

    // Resize Listener
    window.addEventListener('resize', () => {
        calculateAbsoluteLayout();
    });

    gsap.from('.layer-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)"
    });

    setTimeout(() => {
        selectOSILayer(7);
    }, 1000);
}

function calculateAbsoluteLayout() {
    if (!comparisonGrid) return;
    const rect = comparisonGrid.getBoundingClientRect();
    CONTAINER_WIDTH = rect.width;
    CONTAINER_HEIGHT = rect.height;

    const startY = 56; // Header bottom approximated or fixed
    const bottomPad = 16;
    const availableH = CONTAINER_HEIGHT - startY - bottomPad;

    const totalGapSpace = 6 * GAP;
    const singleRowHeight = Math.floor((availableH - totalGapSpace) / 7);

    const availableW = CONTAINER_WIDTH - (PAD_SIDE * 2);
    const cardWidth = Math.floor((availableW - GAP_CENTER) / 2);

    const osiX = PAD_SIDE;
    const tcpX = PAD_SIDE + cardWidth + GAP_CENTER;

    // Apply positions OSI
    osiCards.forEach(item => {
        const top = startY + (item.index * (singleRowHeight + GAP));
        item.element.style.top = `${top}px`;
        item.element.style.left = `${osiX}px`;
        item.element.style.width = `${cardWidth}px`;
        item.element.style.height = `${singleRowHeight}px`;

        item.x = osiX;
        item.y = top;
        item.w = cardWidth;
        item.h = singleRowHeight;
    });

    // Apply positions TCP
    const tcpPositions = {};

    tcpCards.forEach(item => {
        const top = startY + (item.startIndex * (singleRowHeight + GAP));
        const height = (item.span * singleRowHeight) + ((item.span - 1) * GAP);

        item.element.style.top = `${top}px`;
        item.element.style.left = `${tcpX}px`;
        item.element.style.width = `${cardWidth}px`;
        item.element.style.height = `${height}px`;

        item.x = tcpX;
        item.y = top;
        item.h = height;

        tcpPositions[item.data.id] = item;
    });

    // Draw Lines
    const oldLines = svgElement.querySelectorAll('line');
    oldLines.forEach(l => l.remove());

    osiCards.forEach(osiItem => {
        const tcpLayer = TCP_IP_LAYERS.find(t => t.osi_mapping.includes(osiItem.data.id));
        if (!tcpLayer) return;

        const tcpItem = tcpPositions[tcpLayer.id];
        if (!tcpItem) return;

        const x1 = osiItem.x + osiItem.w;
        const y1 = osiItem.y + (osiItem.h / 2);

        const x2 = tcpItem.x;
        const y2 = y1;

        const startX = x1 + 10;
        const endX = x2 - 10;

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", startX);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", endX);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", "rgba(255, 255, 255, 0.2)");
        line.setAttribute("stroke-width", "2");
        line.setAttribute("marker-start", "url(#arrowhead-start)");
        line.setAttribute("marker-end", "url(#arrowhead-end)");

        svgElement.appendChild(line);
    });
}


function createCard(layer, type) {
    const card = document.createElement('div');
    card.className = 'layer-card';
    card.classList.add(type === 'osi' ? 'osi-card' : 'tcp-card');

    card.dataset.id = layer.id;
    card.dataset.type = type;
    card.style.borderLeft = `5px solid ${layer.color}`;

    const pduDesc = PDU_DESCRIPTIONS[layer.pdu] || "Unit data protokol.";

    card.innerHTML = `
    <div class="layer-id" style="color:${layer.color}">${layer.id}</div>
    <div class="layer-icon">${layer.icon || ''}</div>
    <div class="layer-content">
      <div class="layer-title">${layer.name}</div>
      <div class="layer-subtitle">${t(layer.subtitle)}</div>
    </div>
    <div class="pdu-badge">
      ${layer.pdu}
      <div class="tooltip pdu-tooltip">
        <strong>${layer.pdu}</strong><br>
        ${t(PDU_DESCRIPTIONS[layer.pdu]) || 'Unit of data'}
      </div>
    </div>
  `;

    card.addEventListener('click', () => {
        selectLayer(layer, type);
    });

    card.addEventListener('mouseenter', () => {
        highlightMapping(layer, type);
    });
    card.addEventListener('mouseleave', () => {
        clearHighlightMapping();
    });

    return card;
}

function highlightMapping(sourceLayer, sourceType) {
    const allCards = document.querySelectorAll('.layer-card');
    gsap.to(allCards, { opacity: 0.4, duration: 0.2 });

    const selfCard = document.querySelector(`.layer-card[data-type="${sourceType}"][data-id="${sourceLayer.id}"]`);
    if (selfCard) gsap.to(selfCard, { opacity: 1, duration: 0.2 });

    if (sourceType === 'osi') {
        const tcpLayer = TCP_IP_LAYERS.find(t => t.osi_mapping.includes(sourceLayer.id));
        if (tcpLayer) {
            const targetCard = document.querySelector(`.layer-card[data-type="tcp"][data-id="${tcpLayer.id}"]`);
            if (targetCard) gsap.to(targetCard, { opacity: 1, duration: 0.2 });
        }
    } else {
        sourceLayer.osi_mapping.forEach(osiId => {
            const targetCard = document.querySelector(`.layer-card[data-type="osi"][data-id="${osiId}"]`);
            if (targetCard) gsap.to(targetCard, { opacity: 1, duration: 0.2 });
        });
    }
}

function clearHighlightMapping() {
    const allCards = document.querySelectorAll('.layer-card');
    allCards.forEach(card => {
        gsap.to(card, { opacity: 1, duration: 0.2 });
    });

    const activeCards = document.querySelectorAll('.layer-card.active');
    if (activeCards.length > 0) {
        allCards.forEach(c => c.style.opacity = '0.6');
        activeCards.forEach(c => c.style.opacity = '1');
    }
}

function selectLayer(selectedLayer, type) {
    // 1. Reset all active states
    const cards = document.querySelectorAll('.layer-card');
    cards.forEach(card => {
        card.classList.remove('active');
        gsap.to(card, { opacity: 0.6, duration: 0.3 });
    });

    // 2. Highlight SELF
    const activeCard = document.querySelector(`.layer-card[data-type="${type}"][data-id="${selectedLayer.id}"]`);
    if (activeCard) {
        activeCard.classList.add('active');
        gsap.to(activeCard, { opacity: 1, duration: 0.3 });
    }

    // 3. Highlight MAPPED layers
    if (type === 'osi') {
        // If clicking OSI -> Highlight mapped TCP
        const tcpLayer = TCP_IP_LAYERS.find(t => t.osi_mapping.includes(selectedLayer.id));
        if (tcpLayer) {
            const target = document.querySelector(`.layer-card[data-type="tcp"][data-id="${tcpLayer.id}"]`);
            if (target) {
                target.classList.add('active');
                gsap.to(target, { opacity: 1, duration: 0.3 });
            }
        }
    } else {
        // If clicking TCP -> Highlight ALL mapped OSI layers
        selectedLayer.osi_mapping.forEach(osiId => {
            const target = document.querySelector(`.layer-card[data-type="osi"][data-id="${osiId}"]`);
            if (target) {
                target.classList.add('active');
                gsap.to(target, { opacity: 1, duration: 0.3 });
            }
        });
    }

    // 4. Update Detail View (Use the selected layer's data directly)
    animateDetailUpdate(selectedLayer);
}

function animateDetailUpdate(layerData) {
    gsap.to(detailContent, {
        y: -20,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
            updateDetailViewContent(layerData);

            gsap.fromTo(detailContent,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
            );

            // Animate number if exists, but we are flexible now
            if (detailNumber) {
                gsap.fromTo(detailNumber,
                    { scale: 0.5, opacity: 0 },
                    { scale: 1, opacity: 0.1, duration: 0.8, ease: "elastic.out(1, 0.3)" }
                );
            }
        }

    });
}

function updateDetailViewContent(layer) {
    // NO lookup needed, we pass the full object now

    gsap.to(detailPanel, {
        backgroundColor: `rgba(${hexToRgb(layer.color)}, 0.05)`,
        duration: 0.5
    });

    if (detailNumber) {
        detailNumber.textContent = layer.id;
        detailNumber.style.color = layer.color;
    }

    const protocolsHtml = layer.protocols.map(p => `<span class="tag" data-protocol="${p}">${p}</span>`).join('');

    let portsHtml = '';
    if (layer.ports && layer.ports.length > 0) {
        portsHtml = `
      <div class="detail-section-title" style="margin-top: 2rem;">${getText('common_ports')}</div>
      <div class="ports-grid">
        ${layer.ports.map(port => `
          <div class="port-item">
            <span class="port-number">${port.number}</span>
            <span class="port-service">${port.service}</span>
            <div class="tooltip">${port.desc}</div>
          </div>
        `).join('')}
      </div>
    `;
    } else {
        portsHtml = `<div style="margin-top:2rem; opacity:0.5; font-size:0.9rem;">${getText('layer_focus_msg')}</div>`;
    }

    detailContent.innerHTML = `
    <div class="detail-header">
      <div class="layer-icon" style="font-size: 3rem; color: ${layer.color}">${layer.icon}</div>
      <div>
        <h2 class="detail-title" style="color: ${layer.color}">${layer.name}</h2>
        <div style="opacity: 0.7; font-size: 1.2rem;">${t(layer.subtitle)}</div>
      </div>
    </div>

    <div class="detail-desc">
       ${t(layer.description)}
       <br><br>
       ${t(layer.details)}
    </div>

    <div class="detail-section-title">${getText('protocols_title')}</div>
    <div class="protocol-tags">
       ${protocolsHtml}
    </div>

    ${portsHtml}

    ${renderReferences(layer)}
  `;

    // Attach listeners to tags
    setTimeout(() => {
        document.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.stopPropagation();
                openProtocolModal(tag.dataset.protocol);
            });
        });
    }, 100);
}

function renderReferences(layer) {
    if (!layer.references || layer.references.length === 0) return '';

    return `
    <div class="ref-section">
      <details class="ref-details">
        <summary class="ref-summary">
          Referensi & Bacaan Lanjut
        </summary>
        <ul class="ref-list">
          ${layer.references.map(ref => `
            <li class="ref-item">
              <a href="${ref.url}" target="_blank" rel="noopener noreferrer" class="ref-link">
                ${ref.title}
              </a>
            </li>
          `).join('')}
        </ul>
      </details>
    </div>
  `;
}

function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '255, 255, 255';
}

init();
