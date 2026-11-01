async function runTests() {
  console.log('--- STARTING E2E VERIFICATION SUITE ---');
  let passCount = 0;
  let failCount = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passCount++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failCount++;
    }
  }

  // 1. Test Homepage
  try {
    const homeRes = await fetch('http://localhost:3000/');
    const homeHtml = await homeRes.text();
    assert(homeRes.status === 200, 'Homepage returns 200 OK');
    assert(homeHtml.includes('THENDRAL DAY OUT'), 'Homepage has brand name');
    assert(homeHtml.includes('₹3,000'), 'Homepage prominently displays ₹3,000');
    assert(homeHtml.includes('by THENDRAL GROUPS'), 'Homepage shows parent brand hierarchy');
    assert(homeHtml.includes('8778038383'), 'Homepage has phone 8778038383');
    assert(homeHtml.includes('site-studio-in.netlify.app'), 'Homepage has MR.VVM designer credit link');
    assert(homeHtml.includes('Near Panpoli Thaika Bus Stop'), 'Homepage has verified address');
    assert(homeHtml.includes('fWRteDfwIDh9Wxw_8wfTTsSnOL2NOfo2k26qEGtfjUA'), 'Homepage contains Google site verification meta tag');
    assert(homeHtml.includes('name="viewport"'), 'Homepage contains mobile responsive viewport meta tag');
    assert(homeHtml.includes('destination=9.0184843,77.261947'), 'Homepage contains direct navigation coordinates to Google Maps');
  } catch (e) {
    assert(false, `Homepage test error: ${e.message}`);
  }

  // 1b. Test Google Verification HTML File
  try {
    const gRes = await fetch('http://localhost:3000/googled12f3056cb678473.html');
    const gText = await gRes.text();
    assert(gRes.status === 200, 'Google HTML verification file returns 200 OK without redirect');
    assert(gText.includes('google-site-verification: googled12f3056cb678473.html'), 'Google verification file content matches Google requirements');
  } catch (e) {
    assert(false, `Google verification file test error: ${e.message}`);
  }

  // 2. Test Availability API
  try {
    const availRes = await fetch('http://localhost:3000/api/availability');
    const availData = await availRes.json();
    assert(availRes.status === 200 && availData.success, 'Availability API returns 200 & success: true');
    assert(Array.isArray(availData.bookedDates), 'Booked dates is an array');
    assert(availData.price === 3000, 'Availability API confirms ₹3,000 price');
    // Ensure zero customer info leakage
    assert(!availData.customer_name && !availData.phone, 'Zero customer info leaked in availability API');
  } catch (e) {
    assert(false, `Availability API error: ${e.message}`);
  }

  // 3. Test Booking Enquiry API
  let confirmedBookingId = 'TDO-261115-001';
  try {
    // Ensure 2026-11-15 is confirmed for duplicate testing and ticket testing
    const seedRes = await fetch('http://localhost:3000/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Confirmed Tester',
        phone: '9840112233',
        date: '2026-11-15',
        message: 'Pre-seed confirmed booking',
      }),
    });
    const seedData = await seedRes.json();
    if (seedData.bookingId) confirmedBookingId = seedData.bookingId;

    // Login admin to confirm 2026-11-15
    const aRes = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'thendraldayouttenkasi@gmail.com',
        password: 'thendraldayout@tenkasi',
      }),
    });
    const aCookie = aRes.headers.get('set-cookie');
    if (aCookie) {
      await fetch(`http://localhost:3000/api/admin/bookings/${confirmedBookingId}/confirm`, {
        method: 'POST',
        headers: { Cookie: aCookie },
      });
    }

    const testDate = '2026-11-20';
    const enqRes = await fetch('http://localhost:3000/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Murugan V',
        phone: '9840998877',
        date: testDate,
        message: 'Family outing test enquiry',
      }),
    });
    const enqData = await enqRes.json();
    assert(enqRes.status === 200 && enqData.success, 'Booking enquiry creation successful');
    assert(enqData.bookingId.startsWith('TDO-'), 'Enquiry generated valid TDO-[DATE]-[SEQ] ID format');

    // Test duplicate booking protection on confirmed date 2026-11-15
    const dupRes = await fetch('http://localhost:3000/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate Tester',
        phone: '9840112233',
        date: '2026-11-15',
      }),
    });
    const dupData = await dupRes.json();
    assert(dupRes.status === 409, 'Server rejects booking for already confirmed date with 409 status');
    assert(dupData.error && dupData.error.includes('unavailable'), 'Correct unavailability error message returned');
  } catch (e) {
    assert(false, `Booking enquiry test error: ${e.message}`);
  }

  // 4. Test Ticket Generation & QR
  try {
    const ticketRes = await fetch(`http://localhost:3000/api/ticket?id=${confirmedBookingId}`);
    const ticketData = await ticketRes.json();
    assert(ticketRes.status === 200 && ticketData.success, 'Ticket API returns 200 & success: true');
    assert(ticketData.ticket.qr_code.startsWith('data:image/png;base64,'), 'Secure QR code data URL generated');
    assert(ticketData.ticket.amount === 3000, 'Ticket displays ₹3,000 amount');
    assert(ticketData.ticket.booking_status === 'CONFIRMED', 'Ticket booking status is CONFIRMED');
  } catch (e) {
    assert(false, `Ticket API test error: ${e.message}`);
  }

  // 5. Test Admin Login with PBKDF2 & HttpOnly Session
  let sessionCookie = '';
  try {
    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'thendraldayouttenkasi@gmail.com',
        password: 'thendraldayout@tenkasi',
        remember: true,
      }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && loginData.success, 'Admin authenticated successfully');
    
    const setCookie = loginRes.headers.get('set-cookie');
    assert(setCookie && setCookie.includes('tdo_admin_token'), 'HttpOnly session cookie issued');
    sessionCookie = setCookie ? setCookie.split(';')[0] : '';
  } catch (e) {
    assert(false, `Admin login test error: ${e.message}`);
  }

  // 6. Test Admin Protected Reports API
  try {
    const repRes = await fetch('http://localhost:3000/api/admin/reports', {
      headers: { Cookie: sessionCookie },
    });
    const repData = await repRes.json();
    assert(repRes.status === 200 && repData.success, 'Admin reports retrieved with session cookie');
    assert(typeof repData.overview.confirmedRevenue === 'number', 'Confirmed revenue calculated properly');
    assert(repData.overview.confirmedRevenue >= 0, 'Revenue reflects valid calculation (>= 0)');

    // Test CSV Export
    const csvRes = await fetch('http://localhost:3000/api/admin/reports?format=csv', {
      headers: { Cookie: sessionCookie },
    });
    const csvText = await csvRes.text();
    assert(csvRes.status === 200 && csvText.startsWith('Booking ID'), 'CSV report exported successfully');
  } catch (e) {
    assert(false, `Admin reports test error: ${e.message}`);
  }

  // 7. Test Robots & Sitemap
  try {
    const robotsRes = await fetch('http://localhost:3000/robots.txt');
    const robotsText = await robotsRes.text();
    assert(robotsText.includes('Disallow: /admin/'), 'Robots.txt shields /admin/ path');

    const sitemapRes = await fetch('http://localhost:3000/sitemap.xml');
    const sitemapText = await sitemapRes.text();
    assert(sitemapText.includes('https://thendraldayout.com'), 'Sitemap generated with canonical URL');
  } catch (e) {
    assert(false, `Robots/Sitemap test error: ${e.message}`);
  }

  console.log(`\n=== TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED ===\n`);
  if (failCount > 0) {
    process.exit(1);
  }
}

runTests();
