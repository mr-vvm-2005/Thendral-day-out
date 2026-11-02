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
 * Generate a high-resolution e-ticket PNG image using HTML5 Canvas
 */
export async function generateTicketImage(params: TicketImageParams): Promise<string> {
  const width = 960;
  const height = 1380;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  // Background gradient for whole ticket canvas
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#f0f9ff');
  bgGrad.addColorStop(0.5, '#ffffff');
  bgGrad.addColorStop(1, '#f8fafc');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Outer border & frame
  ctx.strokeStyle = '#bae6fd';
  ctx.lineWidth = 4;
  roundRect(ctx, 20, 20, width - 40, height - 40, 28);
  ctx.stroke();

  // Header background (Navy gradient)
  const headerHeight = 220;
  const headerGrad = ctx.createLinearGradient(0, 20, width, headerHeight);
  headerGrad.addColorStop(0, '#072b4a');
  headerGrad.addColorStop(0.6, '#0c4a6e');
  headerGrad.addColorStop(1, '#059669');

  ctx.save();
  roundRect(ctx, 20, 20, width - 40, headerHeight, { tl: 28, tr: 28, br: 0, bl: 0 });
  ctx.fillStyle = headerGrad;
  ctx.fill();
  ctx.restore();

  // Draw Logo in header
  const logoImg = await loadImage('/images/logo.png');
  const logoSize = 120;
  const logoX = 54;
  const logoY = 68;

  // White rounded box behind logo
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;
  roundRect(ctx, logoX, logoY, logoSize, logoSize, 20);
  ctx.fill();
  ctx.restore();

  if (logoImg) {
    ctx.drawImage(logoImg, logoX + 8, logoY + 8, logoSize - 16, logoSize - 16);
  }

  // Header Texts
  const textX = logoX + logoSize + 28;

  // Parent brand
  ctx.fillStyle = '#86efac';
  ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('by THENDRAL GROUPS', textX, 96);

  // Brand Name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px "Outfit", "Fredoka", sans-serif';
  ctx.fillText('THENDRAL DAY OUT', textX, 142);

  // Tagline
  ctx.fillStyle = '#fef08a';
  ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Swim • Play • Celebrate • Make Memories', textX, 174);

  // Top Ticket Badge (Category pill)
  const badgeText = 'PRIVATE FULL-DAY VENUE E-TICKET';
  ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
  const badgeWidth = ctx.measureText(badgeText).width + 28;
  const badgeX = width - 60 - badgeWidth;
  const badgeY = 56;

  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  roundRect(ctx, badgeX, badgeY, badgeWidth, 34, 17);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.fillText(badgeText, badgeX + 14, badgeY + 22);
  ctx.restore();

  // Booking Reference & Status Banner
  const bannerY = 265;
  const bannerHeight = 84;
  ctx.save();
  ctx.fillStyle = '#ecfdf5';
  roundRect(ctx, 48, bannerY, width - 96, bannerHeight, 16);
  ctx.fill();
  ctx.strokeStyle = '#a7f3d0';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Reference label & ID
  ctx.fillStyle = '#065f46';
  ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('OFFICIAL BOOKING REFERENCE ID', 72, bannerY + 32);

  ctx.fillStyle = '#0c4a6e';
  ctx.font = 'bold 32px "Outfit", monospace';
  ctx.fillText(params.bookingId, 72, bannerY + 68);

  // Status badges on banner right
  const statusX = width - 72;
  drawStatusPill(ctx, statusX, bannerY + 42, `BOOKING: ${params.bookingStatus.toUpperCase()}`, '#059669', '#dcfce7');

  // Customer & Reservation Details Card
  const detailsY = 380;

  // Left Column: Customer details
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('RESERVED GUEST NAME', 60, detailsY);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 34px "Outfit", sans-serif';
  ctx.fillText(params.customerName, 60, detailsY + 40);

  if (params.customerPhone) {
    ctx.fillStyle = '#475569';
    ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Mobile Contact: ${params.customerPhone}`, 60, detailsY + 74);
  }

  // Reservation Data Box (Date, Timing, Access)
  const infoBoxY = detailsY + 104;
  const infoBoxWidth = 500;
  const infoBoxHeight = 220;

  ctx.save();
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, 60, infoBoxY, infoBoxWidth, infoBoxHeight, 18);
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // Lines inside info box
  drawInfoRow(ctx, 84, infoBoxY + 40, 'Date of Visit:', formatDate(params.bookingDate), '#0284c7');
  drawInfoRow(ctx, 84, infoBoxY + 84, 'Reservation Type:', 'Private Exclusive Venue (Full Day)', '#0f172a');
  drawInfoRow(ctx, 84, infoBoxY + 128, 'Venue Timings:', '09:00 AM – 06:00 PM', '#059669');
  drawInfoRow(ctx, 84, infoBoxY + 172, 'Amount Paid:', `₹${params.amount.toLocaleString()} (${params.paymentMethod || 'UPI'} - ${params.paymentStatus})`, '#0284c7');

  // Right Column: QR Code Box
  const qrBoxX = 590;
  const qrBoxY = detailsY;
  const qrBoxWidth = 310;
  const qrBoxHeight = 324;

  ctx.save();
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, qrBoxX, qrBoxY, qrBoxWidth, qrBoxHeight, 20);
  ctx.fill();
  ctx.strokeStyle = '#bae6fd';
  ctx.lineWidth = 2;
  ctx.shadowColor = 'rgba(2, 132, 199, 0.08)';
  ctx.shadowBlur = 14;
  ctx.stroke();
  ctx.restore();

  // Load or generate QR Code
  let qrImg: HTMLImageElement | null = null;
  if (params.qrCodeUrl) {
    qrImg = await loadImage(params.qrCodeUrl);
  } else {
    // Generate QR code data url on the fly
    const verifyUrl = params.verifyUrl || `https://thendraldayout.com/verify/${params.bookingId}`;
    try {
      const generated = await QRCode.toDataURL(verifyUrl, { width: 220, margin: 1 });
      qrImg = await loadImage(generated);
    } catch (e) {
      console.error('Failed to generate QR for image:', e);
    }
  }

  if (qrImg) {
    ctx.drawImage(qrImg, qrBoxX + 45, qrBoxY + 30, 220, 220);
  }

  ctx.fillStyle = '#0c4a6e';
  ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Scan to Verify at Gate', qrBoxX + (qrBoxWidth / 2), qrBoxY + 280);
  ctx.fillStyle = '#64748b';
  ctx.font = '13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Official QR Digital Security Token', qrBoxX + (qrBoxWidth / 2), qrBoxY + 302);
  ctx.textAlign = 'left';

  // Facilities Included Banner
  const facY = 740;
  ctx.save();
  ctx.fillStyle = '#f0f9ff';
  roundRect(ctx, 60, facY, width - 120, 190, 18);
  ctx.fill();
  ctx.strokeStyle = '#bae6fd';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#0369a1';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('INCLUDED VENUE AMENITIES (EXCLUSIVE ACCESS):', 84, facY + 36);

  const amenities = [
    '🏊 Swimming Pools (Separate Adult & Safe Kids Areas)',
    '🌊 Refreshing Artificial Waterfall Feature in Pool',
    '🎪 Shaded Outdoor Kids Playground with Slide & Swings',
    '🎉 Covered Birthday Celebration & Party Hall',
    '🌴 Lush Tropical Garden & Countryside Breeze',
    '🍱 Outdoor Dining Tables (Bring Your Own Prepared Food)',
    '🚿 Private Dressing Rooms & Clean Restroom Facilities',
  ];

  ctx.fillStyle = '#334155';
  ctx.font = '15px "Plus Jakarta Sans", sans-serif';
  amenities.forEach((amenity, idx) => {
    const col = idx < 4 ? 0 : 1;
    const row = idx < 4 ? idx : idx - 4;
    const ax = 84 + (col * 400);
    const ay = facY + 70 + (row * 28);
    ctx.fillText(amenity, ax, ay);
  });

  // Food Notice Banner
  const noticeY = 960;
  ctx.save();
  ctx.fillStyle = '#fffbeb';
  roundRect(ctx, 60, noticeY, width - 120, 68, 14);
  ctx.fill();
  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#92400e';
  ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('🍱 Food Policy: Bring Your Own Prepared Food', 84, noticeY + 30);
  ctx.fillStyle = '#78350f';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Guests are welcome to use our dry dining tables. No restaurant, cooking, or catering is provided.', 84, noticeY + 52);

  // Venue Address & Contact Block
  const addressY = 1060;
  ctx.save();
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, 60, addressY, width - 120, 130, 16);
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('📍 VENUE ADDRESS & LOCATION', 84, addressY + 34);

  ctx.fillStyle = '#475569';
  ctx.font = '16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(params.location || 'Near Panpoli Thaika Bus Stop, Panpoli, Tenkasi, Tamil Nadu', 84, addressY + 62);

  ctx.fillStyle = '#059669';
  ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Helpdesk / Gate Phone: ${params.phone || '8778038383'}`, 84, addressY + 98);

  ctx.fillStyle = '#0284c7';
  ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Maps: https://maps.app.goo.gl/Ka1aie81ZXqbWSN89', 510, addressY + 98);

  // Bottom Security Footer
  const footerY = 1220;
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Official Digital E-Ticket issued by Thendral Groups • Valid exclusively for the booked date and group', width / 2, footerY);
  ctx.fillText('Please present this image or digital reference code at the venue gate for priority entry.', width / 2, footerY + 22);

  // Ticket Cut Line / Dashed Border at bottom
  ctx.save();
  ctx.strokeStyle = '#cbd5e1';
  ctx.setLineDash([8, 8]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50, 1275);
  ctx.lineTo(width - 50, 1275);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 13px monospace';
  ctx.fillText(`SECURITY CHECKSUM: TDO-${params.bookingId}-${Date.now().toString().slice(-6)}`, width / 2, 1315);
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png', 1.0);
}

/**
 * Trigger immediate client-side download of a dataURL image
 */
export function downloadTicketDataUrl(dataUrl: string, bookingId: string, customerName?: string) {
  const safeName = customerName ? customerName.replace(/[^a-zA-Z0-9]/g, '_') : 'Customer';
  const filename = `ThendralDayOut_Ticket_${safeName}_${bookingId}.png`;
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
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
 * Draw a status badge on canvas
 */
function drawStatusPill(
  ctx: CanvasRenderingContext2D,
  rightX: number,
  centerY: number,
  text: string,
  color: string,
  bg: string
) {
  ctx.save();
  ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
  const textWidth = ctx.measureText(text).width;
  const pillW = textWidth + 28;
  const pillH = 36;
  const pillX = rightX - pillW;
  const pillY = centerY - (pillH / 2);

  ctx.fillStyle = bg;
  roundRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
  ctx.fill();

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.fillText(text, pillX + 14, pillY + 23);
  ctx.restore();
}

/**
 * Draw key/value row
 */
function drawInfoRow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
  value: string,
  valColor: string = '#0f172a'
) {
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(label, x, y);

  ctx.fillStyle = valColor;
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(value, x + 150, y);
}

/**
 * Date formatter
 */
function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

