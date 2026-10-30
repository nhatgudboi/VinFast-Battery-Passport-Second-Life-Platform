/**
 * VinFast Battery Passport & Second-Life Platform (VSF) — App Logic & Interactive Mock Engine
 */

// 1. COMPREHENSIVE MOCK DATA
const MOCK_DATA = {
  kpis: {
    totalPacks: 12450,
    activeVehicle: 9820,
    recallPending: 48,
    secondLife: 2150,
    avgSoh: 88.6
  },
  batteries: [
    {
      serial: "VF-BAT-VF8-2023-00912",
      model: "VinFast VF 8 Plus",
      batteryType: "NMC 87.7 kWh",
      nominalAh: 240.0,
      measuredAh: 162.0,
      soh: 67.5,
      deltaV: 0.024,
      hasCellFault: false,
      status: "RECALL_PENDING",
      statusText: "Chờ đổi bảo hành",
      vin: "VNF8A21P5PA004312",
      plate: "29E-882.14",
      fleet: "GSM Xanh SM",
      workshop: "Ocean Park",
      carbon: 54.2,
      recycledPct: 18.5,
      odometer: "124,500 km",
      cycles: 620,
      lastInspection: "28/10/2026",
      warrantyEligible: true
    },
    {
      serial: "VF-BAT-VF5-2024-03120",
      model: "VinFast VF 5 Plus",
      batteryType: "LFP 37.23 kWh",
      nominalAh: 105.0,
      measuredAh: 98.2,
      soh: 93.5,
      deltaV: 0.015,
      hasCellFault: false,
      status: "ON_VEHICLE",
      statusText: "Đang lăn bánh",
      vin: "VNF5B10L1RA018992",
      plate: "30K-451.29",
      fleet: "Xe cá nhân",
      workshop: "Phạm Hùng",
      carbon: 48.0,
      recycledPct: 22.0,
      odometer: "28,200 km",
      cycles: 140,
      lastInspection: "29/10/2026",
      warrantyEligible: false
    },
    {
      serial: "VF-BAT-VF9-2023-00108",
      model: "VinFast VF 9 Plus",
      batteryType: "NMC 123.0 kWh",
      nominalAh: 330.0,
      measuredAh: 293.7,
      soh: 89.0,
      deltaV: 0.072,
      hasCellFault: true,
      status: "RECALL_PENDING",
      statusText: "Lỗi cell nguy cấp",
      vin: "VNF9C32A9PA001102",
      plate: "51K-991.02",
      fleet: "Xe cá nhân",
      workshop: "Thảo Điền",
      carbon: 58.5,
      recycledPct: 16.0,
      odometer: "45,000 km",
      cycles: 210,
      lastInspection: "30/10/2026",
      warrantyEligible: true
    },
    {
      serial: "VF-BAT-VF8-2022-00411",
      model: "VinFast VF 8 Plus",
      batteryType: "NMC 87.7 kWh",
      nominalAh: 240.0,
      measuredAh: 151.2,
      soh: 63.0,
      deltaV: 0.031,
      hasCellFault: false,
      status: "SECOND_LIFE_BESS",
      statusText: "Tái sinh Trạm BESS",
      vin: "Tủ BESS Rack #B04",
      plate: "Trạm Pháp Vân",
      fleet: "V-Green BESS",
      workshop: "BESS",
      carbon: 55.0,
      recycledPct: 18.0,
      odometer: "185,000 km (Xe cũ)",
      cycles: 940,
      lastInspection: "12/09/2026",
      warrantyEligible: false
    },
    {
      serial: "VF-BAT-VF3-2024-00055",
      model: "VinFast VF 3",
      batteryType: "LFP 18.64 kWh",
      nominalAh: 52.0,
      measuredAh: 24.5,
      soh: 47.1,
      deltaV: 0.085,
      hasCellFault: true,
      status: "RECYCLED",
      statusText: "Tái chế phế liệu",
      vin: "Lô #RC-2026-88",
      plate: "NM Hải Phòng",
      fleet: "VinES Thủy Luyện",
      workshop: "Hải Phòng",
      carbon: 46.5,
      recycledPct: 25.0,
      odometer: "Hỏng vỏ do tai nạn",
      cycles: 110,
      lastInspection: "15/10/2026",
      warrantyEligible: false
    }
  ],
  earlyWarnings: [
    {
      level: "CRITICAL",
      serial: "VF-BAT-VF9-2023-00108",
      vin: "VNF9C32A9PA001102 (51K-991.02)",
      model: "VF 9 Plus",
      soh: 89.0,
      deltaV: 0.072,
      reason: "Lệch áp cell 72mV > 50mV • Nguy cơ thoát nhiệt",
      actionText: "TẠO LỆNH ĐỔI GẤP"
    },
    {
      level: "HIGH",
      serial: "VF-BAT-VF8-2023-00912",
      vin: "VNF8A21P5PA004312 (29E-882.14)",
      model: "VF 8 Plus",
      soh: 67.5,
      deltaV: 0.024,
      reason: "SoH = 67.5% < 70% • Đạt cam kết đổi miễn phí",
      actionText: "DUYỆT ĐỔI BẢO HÀNH"
    }
  ]
};

// CURRENT ACTIVE BATTERY FOR DIAGNOSTIC MODAL
let currentActiveBattery = MOCK_DATA.batteries[0];

// 2. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  setupNavigationTabs();
  renderEarlyWarningsTable();
  renderBatteryRegistryTable();
  setupFilters();
  setupDiagnosticModal();
  setupMobilePassportView();
  startClock();
});

// 3. TAB NAVIGATION
function setupNavigationTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  const panels = document.querySelectorAll('.vf-tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(`tab-${tab.dataset.tab}`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

// 4. RENDER EARLY WARNINGS TABLE
function renderEarlyWarningsTable() {
  const tbody = document.getElementById('earlyWarningsTableBody');
  if (!tbody) return;

  tbody.innerHTML = MOCK_DATA.earlyWarnings.map(w => {
    const isCritical = w.level === 'CRITICAL';
    const badgeClass = isCritical ? 'badge-red' : 'badge-yellow';
    return `
      <tr>
        <td><span class="kpi-badge ${badgeClass}">${w.level}</span></td>
        <td><strong>${w.serial}</strong></td>
        <td>${w.vin}</td>
        <td><span class="badge-tag-model">${w.model}</span></td>
        <td><strong class="${w.soh < 70 ? 'text-danger' : 'text-success'}">${w.soh.toFixed(1)}%</strong></td>
        <td><strong class="${w.deltaV > 0.05 ? 'text-danger' : ''}">${(w.deltaV * 1000).toFixed(0)} mV</strong></td>
        <td class="text-danger">${w.reason}</td>
        <td>
          <button class="vf-btn vf-btn-sm ${isCritical ? 'vf-btn-danger' : 'vf-btn-primary'}" onclick="openDiagnosticModalFor('${w.serial}')">
            ${w.actionText}
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// 5. RENDER BATTERY REGISTRY TABLE
function renderBatteryRegistryTable() {
  const tbody = document.getElementById('batteryRegistryTableBody');
  if (!tbody) return;

  const searchTerm = (document.getElementById('registrySearch')?.value || '').toLowerCase();
  const modelFilter = document.getElementById('filterModelSelect')?.value || 'ALL';
  const statusFilter = document.getElementById('filterStatusSelect')?.value || 'ALL';
  const workshopFilter = document.getElementById('filterWorkshopSelect')?.value || 'ALL';

  const filtered = MOCK_DATA.batteries.filter(b => {
    const matchesSearch = !searchTerm || 
      b.serial.toLowerCase().includes(searchTerm) || 
      b.vin.toLowerCase().includes(searchTerm) || 
      b.plate.toLowerCase().includes(searchTerm);

    const matchesModel = modelFilter === 'ALL' || b.model.includes(modelFilter);
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesWorkshop = workshopFilter === 'ALL' || b.workshop.includes(workshopFilter);

    return matchesSearch && matchesModel && matchesStatus && matchesWorkshop;
  });

  document.getElementById('tableResultCount').innerHTML = 
    `Hiển thị <strong>${filtered.length} pack pin</strong> (Tổng 12,450 pack toàn quốc)`;

  tbody.innerHTML = filtered.map(b => {
    // SoH styling
    let sohClass = 'text-success';
    let dotClass = 'dot-green';
    if (b.soh < 70) { sohClass = 'text-danger'; dotClass = 'dot-red'; }
    else if (b.soh < 85) { sohClass = 'text-warning'; dotClass = 'dot-yellow'; }

    // Delta V styling
    const deltaVmV = (b.deltaV * 1000).toFixed(0);
    const deltaVClass = b.deltaV > 0.05 ? 'text-danger font-bold' : 'text-success';
    const deltaVBadge = b.deltaV > 0.05 ? '⚠️ LỆCH CELL' : 'AN TOÀN';

    // Status pill
    let pillClass = 'pill-on-vehicle';
    if (b.status === 'RECALL_PENDING') pillClass = 'pill-recall';
    else if (b.status === 'SECOND_LIFE_BESS') pillClass = 'pill-bess';
    else if (b.status === 'RECYCLED') pillClass = 'pill-recycled';

    return `
      <tr>
        <td>
          <div style="font-weight: 700; color: #0F172A;">${b.serial}</div>
          <small style="color: #64748B;">Lần đo: ${b.lastInspection}</small>
        </td>
        <td>
          <div style="font-weight: 600;">${b.model}</div>
          <span class="badge-tag-model">${b.batteryType}</span>
        </td>
        <td>
          <span class="${sohClass}" style="font-size: 15px; font-weight: 800;">
            <span class="status-dot ${dotClass}"></span> ${b.soh.toFixed(1)}%
          </span>
        </td>
        <td>
          <span class="${deltaVClass}">${deltaVmV} mV</span>
          <small style="display:block; font-size:10px; color:#64748B;">${deltaVBadge}</small>
        </td>
        <td>
          <span class="pill-status ${pillClass}">${b.statusText}</span>
        </td>
        <td>
          <div style="font-weight: 600;">${b.vin}</div>
          <small style="color: #2563EB;">${b.plate} • ${b.fleet}</small>
        </td>
        <td>
          <div class="table-actions">
            <button class="vf-btn vf-btn-sm vf-btn-primary" onclick="openDiagnosticModalFor('${b.serial}')" title="Đo kiểm chẩn đoán">
              ⚡ Đo kiểm
            </button>
            <button class="vf-btn vf-btn-sm vf-btn-outline" onclick="viewMobilePassportFor('${b.serial}')" title="Xem Hộ Chiếu QR">
              📱 QR
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 6. SETUP FILTERS EVENT LISTENERS
function setupFilters() {
  ['registrySearch', 'filterModelSelect', 'filterStatusSelect', 'filterWorkshopSelect'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', renderBatteryRegistryTable);
  });

  // Global search shortcut
  const globalSearch = document.getElementById('globalSearchInput');
  if (globalSearch) {
    globalSearch.addEventListener('input', (e) => {
      const regSearch = document.getElementById('registrySearch');
      if (regSearch) {
        regSearch.value = e.target.value;
        // switch tab to registry
        document.querySelector('[data-tab="registry"]')?.click();
        renderBatteryRegistryTable();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('globalSearchInput')?.focus();
    }
  });

  document.getElementById('btnRefreshTable')?.addEventListener('click', () => {
    showToast("Đã làm mới dữ liệu từ CSDL PostgreSQL!", "success");
    renderBatteryRegistryTable();
  });
}

// 7. DIAGNOSTIC MODAL & REALTIME CALCULATION ENGINE
function setupDiagnosticModal() {
  const modal = document.getElementById('diagnosticModal');
  const btnClose = document.getElementById('btnCloseModal');
  const btnCancel = document.getElementById('btnCancelModal');
  const btnSave = document.getElementById('btnSaveInspection');
  const btnSwap = document.getElementById('btnExecuteSwap');

  const close = () => modal.classList.remove('active');
  if (btnClose) btnClose.addEventListener('click', close);
  if (btnCancel) btnCancel.addEventListener('click', close);

  // Reactive inputs
  const inputMeasured = document.getElementById('diagMeasuredCapacity');
  const inputVMax = document.getElementById('diagCellVMax');
  const inputVMin = document.getElementById('diagCellVMin');

  [inputMeasured, inputVMax, inputVMin].forEach(el => {
    if (el) el.addEventListener('input', recalculateDiagnostics);
  });

  if (btnSave) {
    btnSave.addEventListener('click', () => {
      showToast(`Đã lưu biên bản kiểm định cho pack ${currentActiveBattery.serial}!`, "success");
      close();
    });
  }

  if (btnSwap) {
    btnSwap.addEventListener('click', () => {
      showToast(`⚡ KÍCH HOẠT ĐỔI PIN NGUYÊN TỬ CHO XE ${currentActiveBattery.vin}! Gỡ pin cũ ${currentActiveBattery.serial} chuyển sang BESS.`, "success");
      currentActiveBattery.status = "RECALL_PENDING";
      currentActiveBattery.statusText = "Chờ đổi bảo hành";
      renderBatteryRegistryTable();
      close();
    });
  }
}

// OPEN MODAL FOR GIVEN BATTERY
window.openDiagnosticModalFor = function(serial) {
  const battery = MOCK_DATA.batteries.find(b => b.serial === serial) || MOCK_DATA.batteries[0];
  currentActiveBattery = battery;

  document.getElementById('modalBatteryTitle').textContent = 
    `Mã Serial: ${battery.serial} | Model: ${battery.model} | Gắn: ${battery.vin} (${battery.plate})`;

  document.getElementById('diagNominalCapacity').value = battery.nominalAh.toFixed(1);
  document.getElementById('diagMeasuredCapacity').value = battery.measuredAh.toFixed(1);
  document.getElementById('diagCellVMax').value = (3.650 + (battery.deltaV / 2)).toFixed(3);
  document.getElementById('diagCellVMin').value = (3.650 - (battery.deltaV / 2)).toFixed(3);

  recalculateDiagnostics();
  document.getElementById('diagnosticModal').classList.add('active');
};

// REALTIME SOH & CELL VOLTAGE RECALCULATION
function recalculateDiagnostics() {
  const nominal = parseFloat(document.getElementById('diagNominalCapacity').value) || 240.0;
  const measured = parseFloat(document.getElementById('diagMeasuredCapacity').value) || 0;
  const vMax = parseFloat(document.getElementById('diagCellVMax').value) || 0;
  const vMin = parseFloat(document.getElementById('diagCellVMin').value) || 0;

  // Formula 1: SoH = (C_measured / C_nominal) * 100%
  const soh = Math.max(0, Math.min(100, (measured / nominal) * 100));

  // Formula 2: Delta V = V_max - V_min
  const deltaV = Math.max(0, vMax - vMin);
  const deltaVmV = (deltaV * 1000).toFixed(0);

  // Update UI Elements
  const sohValEl = document.getElementById('calcSohValue');
  const deltaVTextEl = document.getElementById('calcDeltaVText');
  const cellBadgeEl = document.getElementById('calcCellStatusBadge');
  const progressCircle = document.getElementById('gaugeProgressCircle');
  const decisionCard = document.getElementById('calcDecisionCard');
  const decisionTitle = document.getElementById('calcDecisionTitle');
  const decisionDesc = document.getElementById('calcDecisionDesc');
  const decisionIcon = document.getElementById('calcDecisionIcon');
  const btnSwap = document.getElementById('btnExecuteSwap');

  sohValEl.textContent = `${soh.toFixed(1)}%`;
  deltaVTextEl.textContent = `${deltaV.toFixed(3)} Volt (${deltaVmV} mV)`;

  // Circular gauge stroke animation (dasharray = 440)
  const offset = 440 - (440 * (soh / 100));
  progressCircle.style.strokeDashoffset = offset;

  // Gauge color based on SoH
  if (soh >= 85) progressCircle.style.stroke = "var(--color-green)";
  else if (soh >= 70) progressCircle.style.stroke = "var(--color-yellow)";
  else progressCircle.style.stroke = "var(--color-red)";

  // Delta V Status check (Safety threshold: 50mV)
  const isCellFault = deltaV > 0.050;
  if (isCellFault) {
    cellBadgeEl.innerHTML = '<span class="badge-dot"></span> 🚨 LỆCH ÁP CELL NGUY HIỂM (> 50mV)';
    cellBadgeEl.style.color = "var(--color-red-dark)";
  } else {
    cellBadgeEl.innerHTML = '<span class="badge-dot"></span> ✓ Cell Cân Bằng Tốt (≤ 50mV)';
    cellBadgeEl.style.color = "var(--color-green)";
  }

  // Decision Rule
  if (isCellFault) {
    decisionCard.style.backgroundColor = "#FEF2F2";
    decisionCard.style.borderColor = "var(--color-red)";
    decisionIcon.textContent = "🚨";
    decisionTitle.textContent = "LỖI LỆCH CELL NGUY CẤP — YÊU CẦU THÁO DỠ GẤP";
    decisionTitle.style.color = "var(--color-red-dark)";
    decisionDesc.textContent = `Phát hiện độ lệch cell ${deltaVmV}mV vượt ngưỡng an toàn 50mV. Nguy cơ thoát nhiệt (Thermal Runaway) cao. Dừng vận hành xe ngay!`;
    btnSwap.style.display = "inline-flex";
    btnSwap.className = "vf-btn vf-btn-danger";
    btnSwap.innerHTML = "<span>🚨</span> THAY THẾ PIN KHẨN CẤP";
  } else if (soh < 70.0) {
    decisionCard.style.backgroundColor = "#FEF2F2";
    decisionCard.style.borderColor = "#FCA5A5";
    decisionIcon.textContent = "⚠️";
    decisionTitle.textContent = "ĐỦ ĐIỀU KIỆN ĐỔI PIN BẢO HÀNH MIỄN PHÍ";
    decisionTitle.style.color = "var(--color-red)";
    decisionDesc.textContent = `Dung lượng pin giảm xuống ${soh.toFixed(1)}% (< 70%). VinFast chịu toàn bộ chi phí thay pack pin mới cho khách hàng.`;
    btnSwap.style.display = "inline-flex";
    btnSwap.className = "vf-btn vf-btn-primary";
    btnSwap.innerHTML = "<span>⚡</span> TẠO LỆNH ĐỔI PIN BẢO HÀNH NGAY";
  } else {
    decisionCard.style.backgroundColor = "#ECFDF5";
    decisionCard.style.borderColor = "#A7F3D0";
    decisionIcon.textContent = "✅";
    decisionTitle.textContent = "PACK PIN ĐẠT CHUẨN TIẾP TỤC LĂN BÁNH";
    decisionTitle.style.color = "var(--color-green)";
    decisionDesc.textContent = `Điểm sức khỏe SoH = ${soh.toFixed(1)}% và các cell cân bằng an toàn. Chưa chạm ngưỡng bảo hành của hãng.`;
    btnSwap.style.display = "none";
  }
}

// 8. MOBILE QR PASSPORT PORTAL (EU 2023/1542 COMPLIANT)
function setupMobilePassportView() {
  const selector = document.getElementById('mobileBatterySelector');
  if (!selector) return;

  selector.innerHTML = MOCK_DATA.batteries.map(b => 
    `<option value="${b.serial}">${b.serial} — ${b.model} (SoH: ${b.soh}%)</option>`
  ).join('');

  selector.addEventListener('change', (e) => {
    renderMobilePassport(e.target.value);
  });

  renderMobilePassport(MOCK_DATA.batteries[0].serial);
}

window.viewMobilePassportFor = function(serial) {
  // switch to mobile portal tab
  document.querySelector('[data-tab="mobile-portal"]')?.click();
  const selector = document.getElementById('mobileBatterySelector');
  if (selector) selector.value = serial;
  renderMobilePassport(serial);
};

function renderMobilePassport(serial) {
  const container = document.getElementById('mobilePassportBody');
  if (!container) return;

  const b = MOCK_DATA.batteries.find(x => x.serial === serial) || MOCK_DATA.batteries[0];
  
  // SoH gauge calculation
  const offset = 440 - (440 * (b.soh / 100));
  let strokeColor = "#10B981";
  if (b.soh < 70) strokeColor = "#EF4444";
  else if (b.soh < 85) strokeColor = "#F59E0B";

  container.innerHTML = `
    <!-- HERO CARD -->
    <div class="passport-hero-card">
      <div class="passport-serial-title">MÃ HỘ CHIẾU PIN SỐ</div>
      <div class="passport-serial-val">${b.serial}</div>
      <div class="passport-model-sub">${b.model} • ${b.batteryType}</div>

      <!-- SOH CIRCULAR GAUGE -->
      <div class="mobile-gauge-wrap">
        <svg class="mobile-gauge-svg" viewBox="0 0 160 160">
          <circle class="mobile-gauge-bg" cx="80" cy="80" r="70" />
          <circle class="mobile-gauge-fill" cx="80" cy="80" r="70" 
            style="stroke: ${strokeColor}; stroke-dasharray: 440; stroke-dashoffset: ${offset};" />
        </svg>
        <div class="mobile-gauge-inner">
          <span class="mobile-soh-num" style="color: ${strokeColor};">${b.soh.toFixed(1)}%</span>
          <span class="mobile-soh-txt">SỨC KHỎE (SoH)</span>
        </div>
      </div>

      ${b.soh < 70 ? `
        <div class="mobile-badge-warranty">
          ⚠️ ĐÃ ĐỦ ĐIỀU KIỆN ĐỔI PIN MIỄN PHÍ<br>
          <small>Chính sách cam kết VinFast: SoH &lt; 70%</small>
        </div>
      ` : `
        <div style="color: var(--color-green); font-size: 11px; font-weight: 700; margin-top: 6px;">
          ✓ Pack pin hoạt động tối ưu, an toàn tuyệt đối
        </div>
      `}
    </div>

    <!-- CARBON & ESG CARD -->
    <div class="passport-info-card">
      <div class="info-card-header">
        <span>🌿</span> DẤU CHÂN CARBON & BẢO VỆ MÔI TRƯỜNG
      </div>
      <div class="passport-meta-list">
        <div class="meta-item">
          <span class="meta-k">Dấu chân Carbon:</span>
          <span class="meta-v text-success">${b.carbon} kgCO2eq / kWh</span>
        </div>
        <div class="meta-item">
          <span class="meta-k">Tỷ lệ vật liệu tái chế:</span>
          <span class="meta-v">${b.recycledPct}% (Co/Ni/Li)</span>
        </div>
        <div class="meta-item">
          <span class="meta-k">Nhà máy sản xuất:</span>
          <span class="meta-v">VinES Đình Vũ, Hải Phòng</span>
        </div>
        <div class="meta-item">
          <span class="meta-k">Chứng nhận EU:</span>
          <span class="meta-v" style="color: #2563EB;">EU 2023/1542 Ver 1.4</span>
        </div>
      </div>
    </div>

    <!-- OPERATIONAL DATA -->
    <div class="passport-info-card">
      <div class="info-card-header">
        <span>🚗</span> THÔNG SỐ VẬN HÀNH & KIỂM ĐỊNH
      </div>
      <div class="passport-meta-list">
        <div class="meta-item">
          <span class="meta-k">Quãng đường đã chạy:</span>
          <span class="meta-v">${b.odometer}</span>
        </div>
        <div class="meta-item">
          <span class="meta-k">Số chu kỳ sạc/xả:</span>
          <span class="meta-v">${b.cycles} chu kỳ</span>
        </div>
        <div class="meta-item">
          <span class="meta-k">Lần kiểm định gần nhất:</span>
          <span class="meta-v">${b.lastInspection}</span>
        </div>
        <div class="meta-item">
          <span class="meta-k">Cân bằng cell (&Delta;V):</span>
          <span class="meta-v ${b.deltaV > 0.05 ? 'text-danger' : 'text-success'}">
            ${(b.deltaV * 1000).toFixed(0)} mV (${b.deltaV > 0.05 ? 'Lệch áp' : 'Cân bằng'})
          </span>
        </div>
      </div>
    </div>

    <!-- PRIVACY & REDACTED PII -->
    <div class="passport-info-card">
      <div class="info-card-header">
        <span>🔒</span> BẢO MẬT THEO NGHỊ ĐỊNH 13/2023/NĐ-CP
      </div>
      <p style="font-size: 11px; color: #64748B; line-height: 1.4;">
        Thông tin cá nhân chủ xe đã được tự động mã hóa bảo mật. Quả pin gắn trên xe: <strong>${b.vin.substring(0, 7)}****</strong> (${b.fleet}).
      </p>
    </div>

    <!-- DOWNLOAD CERTIFICATE BUTTON -->
    <button class="btn-mobile-download" onclick="downloadEuPdfCertificate('${b.serial}')">
      <span>📥</span> TẢI CHỨNG NHẬN HỘ CHIẾU PIN PDF
    </button>
  `;
}

// SIMULATE EU CERTIFICATE DOWNLOAD
window.downloadEuPdfCertificate = function(serial) {
  showToast(`Đang tạo và tải file PDF Hộ chiếu pin chuẩn EU cho pack ${serial}...`, "success");
};

// 9. TOAST NOTIFICATION UTILITY
function showToast(message, type = "info") {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `vf-toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : 'ℹ️'}</span>
    <div>${message}</div>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// 10. REALTIME MOBILE CLOCK
function startClock() {
  const clock = document.getElementById('mobileClock');
  if (!clock) return;

  function update() {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  update();
  setInterval(update, 60000);
}
