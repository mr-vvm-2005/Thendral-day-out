import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { readDb, writeDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  const db = readDb();
  return NextResponse.json({ success: true, settings: db.settings });
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const newSettings = await req.json();
    const db = readDb();

    db.settings = {
      ...db.settings,
      ...newSettings,
      // Enforce strict unchangeable values unless explicitly valid
      business_name: 'THENDRAL DAY OUT',
      parent_brand: 'by THENDRAL GROUPS',
      price: 3000, // strictly fixed as requested
    };

    writeDb(db);

    return NextResponse.json({
      success: true,
      settings: db.settings,
      message: 'Settings updated successfully.',
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings.' }, { status: 500 });
  }
}
