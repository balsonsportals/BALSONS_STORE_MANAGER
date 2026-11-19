/**
 * BALSONS STORE MANAGER - QR TAG GENERATOR & A4 PRINTABLE SHEET STUDIO
 * Standard: SAM-2026 & BEDS V1.0
 */

const BalsonsQrGenerator = {
  renderTagCard: function(tool) {
    const qrData = encodeURIComponent(`https://balsonsportals.github.io/BALSONS_STORE_MANAGER/?toolId=${tool.id}`);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${qrData}`;

    const isLifting = tool.isLifting;
    const certField = isLifting 
      ? `<div><strong>Form 11:</strong> ${tool.form11Cert || 'Pending'}</div><div><strong>Due:</strong> ${tool.nextInspection || 'N/A'}</div>`
      : `<div><strong>Calib Due:</strong> ${tool.nextInspection || 'N/A'}</div>`;

    return `
      <div class="tool-tag-card" style="border: 2px solid #102D35; border-radius: 6px; padding: 10px; background: #FFFFFF; color: #102D35; width: 280px; box-sizing: border-box; page-break-inside: avoid; display: flex; flex-direction: column; justify-content: space-between; font-family: Inter, sans-serif;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0097B2; padding-bottom: 6px; margin-bottom: 8px;">
          <div>
            <div style="font-size: 11px; font-weight: 800; color: #0097B2; letter-spacing: 0.5px;">BALSONS HEAVY LIFT</div>
            <div style="font-size: 8px; font-weight: 700; color: #52636B;">RIGGING ASSET TAG</div>
          </div>
          <span style="font-size: 8px; font-weight: 800; background: #102D35; color: #FFFFFF; padding: 2px 6px; border-radius: 3px;">
            ${tool.section}
          </span>
        </div>

        <div style="display: flex; gap: 10px; align-items: center;">
          <img src="${qrUrl}" alt="QR" style="width: 72px; height: 72px; border: 1px solid #E2E8F0; padding: 2px; border-radius: 4px;" onerror="this.src='https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=BALSONS'">
          <div style="flex: 1; font-size: 9px; line-height: 1.35;">
            <div style="font-size: 11.5px; font-weight: 900; font-family: monospace; color: #0097B2;">${tool.id}</div>
            <div style="font-weight: 700; margin-top: 2px; color: #102D35;">${tool.desc}</div>
            <div style="color: #52636B;"><strong>Cap/Spec:</strong> ${tool.capacity || tool.spec}</div>
            <div style="color: #52636B;"><strong>Make/Mod:</strong> ${tool.make} ${tool.model}</div>
          </div>
        </div>

        <div style="margin-top: 8px; pt-6px; border-top: 1px dashed #CBD5E1; display: flex; justify-content: space-between; align-items: center; font-size: 8.5px; color: #102D35; padding-top: 4px;">
          ${certField}
          <div style="text-align: right;">
            <span style="font-weight: 800; color: ${tool.status === 'AVAILABLE' ? '#059669' : (tool.status === 'ISSUED' ? '#0284C7' : '#DC2626')};">
              ● ${tool.status}
            </span>
          </div>
        </div>
      </div>
    `;
  },

  renderA4Sheet: function(toolList) {
    const cards = toolList.map(t => this.renderTagCard(t)).join('');
    return `
      <div class="a4-tag-sheet" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 16px; background: #FFFFFF; border-radius: 8px;">
        ${cards}
      </div>
    `;
  }
};

window.BalsonsQrGenerator = BalsonsQrGenerator;
