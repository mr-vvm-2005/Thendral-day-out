import QRCode from 'qrcode';

export interface TicketImageParams {
  bookingId: string;
  customerName: string;
  customerPhone?: string;
  bookingDate: string;
  amount: number;
  bookingStatus: string;
  paymentStatus: string;
  paymentMethod?: string;
  paymentReference?: string;
  qrCodeUrl?: string;
  verifyUrl?: string;
  location?: string;
  phone?: string;
}

/**
 * Helper to load an image safely into HTMLImageElement
 */
function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * Draw realistic barcode lines
 */
function drawBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  ctx.save();
  ctx.fillStyle = '#072b4a';
  const pattern = [2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1];
  const totalUnits = pattern.reduce((acc, v) => acc + v, 0);
  const unitW = width / totalUnits;
  let curX = x;
  for (let i = 0; i < pattern.length; i++) {
    const barW = pattern[i] * unitW;
    if (i % 2 === 0) {
      ctx.fillRect(curX, y, barW, height);
    }
    curX += barW;
  }
  ctx.restore();
}

/**
 * Helper to draw rounded rectangle
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number | { tl: number; tr: number; br: number; bl: number }
) {
  let tl = 0;
  let tr = 0;
  let br = 0;
  let bl = 0;
  if (typeof r === 'number') {
    tl = tr = br = bl = r;
  } else {
    tl = r.tl;
    tr = r.tr;
    br = r.br;
    bl = r.bl;
  }

  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
  ctx.lineTo(x + w, y + h - br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
  ctx.lineTo(x + bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - bl);
  ctx.lineTo(x, y + tl);
  ctx.quadraticCurveTo(x, y, x + tl, y);
  ctx.closePath();
}

/**
 * Date formatter
 */
function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Generate a compact, neat horizontal event pass PNG (Refined Azure & Emerald Theme)
 */
export async function generateTicketImage(params: TicketImageParams): Promise<string> {
  const width = 1100;
  const height = 480;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  const canvasBg = '#f8fafc';
  ctx.fillStyle = canvasBg;
  ctx.fillRect(0, 0, width, height);

  // Outer Ticket Card Dimensions
  const cardX = 24;
  const cardY = 20;
  const cardW = width - 48; // 1052
  const cardH = height - 40; // 440
  const cardRadius = 24;

  // Outer Frame (Deep Navy #072b4a)
  ctx.save();
  ctx.fillStyle = '#072b4a';
  roundRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.fill();

  // Inner ticket body (Pure White #ffffff, inset 8px)
  const innerX = cardX + 8;
  const innerY = cardY + 8;
  const innerW = cardW - 16;
  const innerH = cardH - 16;
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, innerX, innerY, innerW, innerH, cardRadius - 6);
  ctx.fill();
  ctx.restore();

  // LEFT COLUMN: Waterfall Cascade Photo (Width ~265px)
  const photoW = 265;
  const photoH = innerH;
  const photoImg = await loadImage('/images/falls-feature.jpg');

  ctx.save();
  roundRect(ctx, innerX, innerY, photoW, photoH, { tl: cardRadius - 6, tr: 0, br: 0, bl: cardRadius - 6 });
  ctx.clip();
  if (photoImg) {
    ctx.drawImage(photoImg, innerX, innerY, photoW, photoH);
  } else {
    const pGrad = ctx.createLinearGradient(innerX, innerY, innerX + photoW, innerY + photoH);
    pGrad.addColorStop(0, '#072b4a');
    pGrad.addColorStop(1, '#0284c7');
    ctx.fillStyle = pGrad;
    ctx.fillRect(innerX, innerY, photoW, photoH);
  }

  // Dark gradient overlay at photo bottom
  const photoOverlay = ctx.createLinearGradient(innerX, innerY + photoH - 100, innerX, innerY + photoH);
  photoOverlay.addColorStop(0, 'rgba(0,0,0,0)');
  photoOverlay.addColorStop(1, 'rgba(0,0,0,0.7)');
  ctx.fillStyle = photoOverlay;
  ctx.fillRect(innerX, innerY, photoW, photoH);

  // Photo bottom tag
  ctx.fillStyle = '#86efac';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('WATERFALL & POOL VENUE', innerX + 16, innerY + photoH - 18);
  ctx.restore();

  // PERFORATION & NOTCH CUTOUTS (Separating Center and Right Stub)
  const stubW = 270;
  const stubX = innerX + innerW - stubW; // ~782
  const notchRadius = 18;

  // Draw semi-circle notch cutouts at top and bottom of perforation line
  ctx.save();
  ctx.fillStyle = canvasBg;

  // Top notch
  ctx.beginPath();
  ctx.arc(stubX, cardY, notchRadius, 0, Math.PI);
  ctx.fill();

  // Bottom notch
  ctx.beginPath();
  ctx.arc(stubX, cardY + cardH, notchRadius, Math.PI, 0);
  ctx.fill();

  // Vertical dashed perforation line
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(stubX, innerY + notchRadius + 4);
  ctx.lineTo(stubX, innerY + innerH - notchRadius - 4);
  ctx.stroke();
  ctx.restore();

  // CENTER SECTION: Ticket Content
  const centerX = innerX + photoW + 28;

  // Brand Row: Logo (44x44) + THENDRAL DAY OUT
  const logoImg = await loadImage('/images/logo.png');
  const logoY = innerY + 22;
  if (logoImg) {
    ctx.drawImage(logoImg, centerX, logoY, 42, 42);
  }

  const brandTextX = centerX + 54;
  ctx.fillStyle = '#072b4a';
  ctx.font = 'bold 21px "Plus Jakarta Sans", "Outfit", sans-serif';
  ctx.fillText('THENDRAL DAY OUT', brandTextX, logoY + 22);

  ctx.fillStyle = '#059669';
  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('BY THENDRAL GROUPS • PANPOLI', brandTextX, logoY + 37);

  // Kicker
  const kickerY = logoY + 68;
  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('EXCLUSIVE FULL-DAY PRIVATE PASS', centerX, kickerY);

  // Refined Headline with Reduced Font Size (21px - clean and balanced)
  const headlineY = kickerY + 30;
  ctx.fillStyle = '#072b4a';
  ctx.font = '800 22px "Plus Jakarta Sans", "Outfit", sans-serif';
  ctx.fillText('Swim, Splash & Celebrate.', centerX, headlineY);
  ctx.fillText('Your entire private place.', centerX, headlineY + 26);

  // Booking Details Meta Row
  const detailsY = headlineY + 54;
  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';

  // Guest Name
  ctx.fillStyle = '#64748b';
  ctx.fillText('GUEST: ', centerX, detailsY);
  const guestLabelW = ctx.measureText('GUEST: ').width;
  ctx.fillStyle = '#072b4a';
  ctx.fillText(params.customerName, centerX + guestLabelW, detailsY);

  // Date
  const dateX = centerX + 230;
  ctx.fillStyle = '#64748b';
  ctx.fillText('DATE: ', dateX, detailsY);
  const dateLabelW = ctx.measureText('DATE: ').width;
  ctx.fillStyle = '#072b4a';
  ctx.fillText(formatDate(params.bookingDate), dateX + dateLabelW, detailsY);

  // Timing & Pass Status
  const line2Y = detailsY + 24;
  ctx.fillStyle = '#64748b';
  ctx.fillText('TIME: ', centerX, line2Y);
  const timeLabelW = ctx.measureText('TIME: ').width;
  ctx.fillStyle = '#072b4a';
  ctx.fillText('09:00 AM – 06:00 PM', centerX + timeLabelW, line2Y);

  ctx.fillStyle = '#64748b';
  ctx.fillText('PASS: ', dateX, line2Y);
  const passLabelW = ctx.measureText('PASS: ').width;
  ctx.fillStyle = '#059669';
  ctx.fillText(`₹${params.amount.toLocaleString()} Confirmed`, dateX + passLabelW, line2Y);

  // Feature Pills
  const pillsY = line2Y + 34;
  const pills = ['Adult Pool', 'Waterfalls', 'Kids Pool', 'Party Hall', 'Garden'];
  let curPillX = centerX;
  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';

  pills.forEach((p) => {
    const textW = ctx.measureText(p).width;
    const pillW = textW + 18;
    const pillH = 24;

    ctx.save();
    ctx.fillStyle = '#f0f9ff';
    roundRect(ctx, curPillX, pillsY, pillW, pillH, 12);
    ctx.fill();
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#0369a1';
    ctx.fillText(p, curPillX + 9, pillsY + 16);
    ctx.restore();

    curPillX += pillW + 8;
  });

  // Emerald Action Pill with Phone Number
  const actionPillY = pillsY + 40;
  const phoneVal = params.phone || '8778038383';
  const actionText = `thendraldayout.com • 📞 ${phoneVal}`;
  ctx.font = 'bold 13.5px "Plus Jakarta Sans", sans-serif';
  const actionW = ctx.measureText(actionText).width + 36;
  const actionH = 38;

  ctx.save();
  ctx.fillStyle = '#059669';
  roundRect(ctx, centerX, actionPillY, actionW, actionH, 19);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillText(actionText, centerX + 18, actionPillY + 24);
  ctx.restore();

  // RIGHT STUB: Ticket Pass Tear-Off
  const stubCenterX = stubX + (stubW / 2);

  // Stub Header: ENTRY PASS / No. ID
  ctx.textAlign = 'center';
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('ENTRY PASS', stubCenterX, innerY + 34);

  ctx.fillStyle = '#072b4a';
  ctx.font = '800 17px monospace';
  ctx.fillText(`No. ${params.bookingId}`, stubCenterX, innerY + 56);

  // Generate QR Code data URL if not provided
  let qrDataUrl = params.qrCodeUrl;
  if (!qrDataUrl) {
    try {
      const verifyTarget = params.verifyUrl || `https://thendraldayout.com/verify/${params.bookingId}`;
      qrDataUrl = await QRCode.toDataURL(verifyTarget, {
        margin: 1,
        width: 150,
        color: { dark: '#072b4a', light: '#ffffff' },
      });
    } catch {
      // ignore
    }
  }

  // Draw QR code
  const qrSize = 140;
  const qrX = stubCenterX - (qrSize / 2);
  const qrY = innerY + 74;

  if (qrDataUrl) {
    const qrImg = await loadImage(qrDataUrl);
    if (qrImg) {
      ctx.save();
      ctx.fillStyle = '#ffffff';
      roundRect(ctx, qrX - 6, qrY - 6, qrSize + 12, qrSize + 12, 12);
      ctx.fill();
      ctx.strokeStyle = '#bae6fd';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      ctx.restore();
    }
  }

  // "SCAN AT THE GATE"
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('SCAN AT THE GATE', stubCenterX, qrY + qrSize + 22);

  // Barcode Graphic & Booking ID underneath
  const barcodeY = qrY + qrSize + 36;
  const barcodeW = 160;
  const barcodeH = 28;
  const barcodeX = stubCenterX - (barcodeW / 2);

  drawBarcode(ctx, barcodeX, barcodeY, barcodeW, barcodeH);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px monospace';
  ctx.fillText(`* ${params.bookingId} *`, stubCenterX, barcodeY + barcodeH + 13);

  // Helpline at bottom of stub
  ctx.fillStyle = '#059669';
  ctx.font = 'bold 9.5px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`HELPDESK: ${phoneVal}`, stubCenterX, barcodeY + barcodeH + 28);

  return canvas.toDataURL('image/png');
}

/**
 * Trigger file download in browser
 */
export function downloadTicketDataUrl(dataUrl: string, bookingId: string, customerName: string) {
  const cleanName = customerName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const filename = `ThendralDayOut_Ticket_${bookingId}_${cleanName}.png`;

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
