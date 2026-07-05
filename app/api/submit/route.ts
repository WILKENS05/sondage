import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

interface SubmitBody {
    reponse_1?: string;
    reponse_2?: string;
    reponse_3?: string;
    pays?: string;
    langue?: string;
}

export async function POST(req: NextRequest) {
    let body: SubmitBody;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'JSON invalide.' }, { status: 400 });
    }

    const reponse_1 = (body.reponse_1 ?? '').trim();
    const reponse_2 = (body.reponse_2 ?? '').trim();
    const reponse_3 = (body.reponse_3 ?? '').trim();
    const pays = (body.pays ?? '').trim().slice(0, 100) || null;
    const langue = body.langue === 'ht' ? 'ht' : 'fr';

    if (!reponse_1 || !reponse_2 || !reponse_3) {
        return NextResponse.json({ error: 'Les 3 réponses sont requises.' }, { status: 400 });
    }
    if (reponse_1.length > 3000 || reponse_2.length > 3000 || reponse_3.length > 3000) {
        return NextResponse.json({ error: 'Réponse trop longue (max 3000 caractères).' }, { status: 400 });
    }

    try {
        const sql = getSql();
        await sql.query(
            'INSERT INTO responses (reponse_1, reponse_2, reponse_3, pays, langue) VALUES ($1, $2, $3, $4, $5)',
            [reponse_1, reponse_2, reponse_3, pays, langue]
        );
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('Submit error:', err);
        return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
    }
}
