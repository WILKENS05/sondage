import { NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

export async function GET() {
    try {
        const sql = getSql();
        const rows = await sql.query('SELECT COUNT(*) AS count FROM responses');
        const count = Number((rows as { count: string }[])[0].count);
        return NextResponse.json({ count });
    } catch (err) {
        console.error('Count error:', err);
        return NextResponse.json({ count: 0 });
    }
}
