'use client';

import { useState } from 'react';
import HaitianFlag from './components/HaitianFlag';
import styles from './page.module.css';

type Lang = 'fr' | 'ht' | 'en';

const CONTENT: Record<Lang, {
    badge: string;
    title: string;
    subtitle: string;
    q1: string;
    q2: string;
    q3: string;
    paysLabel: string;
    paysPlaceholder: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
    footer: string;
}> = {
    fr: {
        badge: '🇭🇹 Sondage citoyen',
        title: 'Ta voix compte',
        subtitle: "Que tu sois en Haïti ou dans la diaspora, partage ton avis sur l'avenir du pays. Trois questions, quelques minutes.",
        q1: "Quels sont, selon vous, les principaux obstacles à l'accès à une éducation de qualité en Haïti, et quels outils ou ressources pourraient améliorer la situation ?",
        q2: "Comment la technologie (Internet, smartphones, intelligence artificielle...) pourrait-elle améliorer la vie quotidienne ou la société haïtienne ?",
        q3: "Si vous pouviez changer une seule chose pour améliorer l'avenir d'Haïti, quelle serait-elle et pourquoi ?",
        paysLabel: 'Où vis-tu actuellement ? (optionnel)',
        paysPlaceholder: 'Ex : Port-au-Prince, Miami, Paris...',
        submit: 'Envoyer mes réponses',
        submitting: 'Envoi en cours...',
        success: 'Mèsi ! Merci ! Ta voix a bien été enregistrée.',
        error: "Une erreur s'est produite. Réessaie.",
        footer: "Réponses anonymes, utilisées uniquement à des fins d'analyse d'opinion publique.",
    },
    ht: {
        badge: '🇭🇹 Sondaj sitwayen',
        title: 'Vwa ou konte',
        subtitle: 'Kit ou nan Ayiti kit ou nan dyaspora a, pataje opinyon ou sou avni peyi a. Twa kesyon, kèk minit.',
        q1: 'Dapre ou, ki pi gwo obstak ki anpeche moun jwenn yon bon jan edikasyon an Ayiti, e ki zouti oswa resous ki ta ka amelyore sitiyasyon an?',
        q2: 'Kijan teknoloji (Entènèt, smartphone, entèlijans atifisyèl...) ta ka amelyore lavi chak jou oswa sosyete ayisyen an?',
        q3: 'Si ou te ka chanje yon sèl bagay pou amelyore avni Ayiti, ki sa li ta ye e poukisa?',
        paysLabel: 'Ki kote w ap viv kounye a? (opsyonèl)',
        paysPlaceholder: 'Pa egzanp : Pòtoprens, Miami, Paris...',
        submit: 'Voye repons mwen yo',
        submitting: "N ap voye...",
        success: 'Mèsi ! Vwa ou anrejistre.',
        error: 'Gen yon pwoblèm. Eseye ankò.',
        footer: 'Repons anonim, itilize sèlman pou analiz opinyon piblik.',
    },
    en: {
        badge: '🇭🇹 Citizen survey',
        title: 'Your voice matters',
        subtitle: "Whether you're in Haiti or in the diaspora, share your opinion on the future of the country. Three questions, a few minutes.",
        q1: 'In your opinion, what are the main obstacles to accessing quality education in Haiti, and what tools or resources could improve the situation?',
        q2: 'How could technology (Internet, smartphones, artificial intelligence...) improve daily life or Haitian society?',
        q3: 'If you could change one single thing to improve the future of Haiti, what would it be and why?',
        paysLabel: 'Where do you currently live? (optional)',
        paysPlaceholder: 'E.g.: Port-au-Prince, Miami, Paris...',
        submit: 'Send my answers',
        submitting: 'Sending...',
        success: 'Mèsi ! Thank you! Your voice has been recorded.',
        error: 'Something went wrong. Please try again.',
        footer: 'Anonymous answers, used only for public opinion analysis.',
    },
};

export default function Home() {
    const [lang, setLang] = useState<Lang>('fr');
    const [r1, setR1] = useState('');
    const [r2, setR2] = useState('');
    const [r3, setR3] = useState('');
    const [pays, setPays] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

    const t = CONTENT[lang];

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!r1.trim() || !r2.trim() || !r3.trim()) return;
        setStatus('submitting');
        try {
            const res = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reponse_1: r1, reponse_2: r2, reponse_3: r3, pays, langue: lang }),
            });
            if (!res.ok) throw new Error('failed');
            setStatus('done');
        } catch {
            setStatus('error');
        }
    }

    return (
        <main className={styles.main}>
            <div className={styles.langToggle}>
                <button
                    className={lang === 'fr' ? styles.langActive : styles.langBtn}
                    onClick={() => setLang('fr')}
                    type="button"
                >
                    Français
                </button>
                <button
                    className={lang === 'ht' ? styles.langActive : styles.langBtn}
                    onClick={() => setLang('ht')}
                    type="button"
                >
                    Kreyòl
                </button>
                <button
                    className={lang === 'en' ? styles.langActive : styles.langBtn}
                    onClick={() => setLang('en')}
                    type="button"
                >
                    English
                </button>
            </div>

            <section className={styles.hero}>
                <HaitianFlag className={styles.flag} />
                <div className={styles.badge}>{t.badge}</div>
                <h1 className={styles.title}>{t.title}</h1>
                <p className={styles.subtitle}>{t.subtitle}</p>
            </section>

            {status === 'done' ? (
                <div className={styles.successCard}>
                    <div className={styles.successIcon}>✓</div>
                    <p>{t.success}</p>
                </div>
            ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="q1">1. {t.q1}</label>
                        <textarea
                            id="q1"
                            className={styles.textarea}
                            value={r1}
                            onChange={(e) => setR1(e.target.value)}
                            maxLength={3000}
                            required
                            rows={4}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="q2">2. {t.q2}</label>
                        <textarea
                            id="q2"
                            className={styles.textarea}
                            value={r2}
                            onChange={(e) => setR2(e.target.value)}
                            maxLength={3000}
                            required
                            rows={4}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="q3">3. {t.q3}</label>
                        <textarea
                            id="q3"
                            className={styles.textarea}
                            value={r3}
                            onChange={(e) => setR3(e.target.value)}
                            maxLength={3000}
                            required
                            rows={4}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="pays">{t.paysLabel}</label>
                        <input
                            id="pays"
                            className={styles.input}
                            value={pays}
                            onChange={(e) => setPays(e.target.value)}
                            maxLength={100}
                            placeholder={t.paysPlaceholder}
                        />
                    </div>

                    {status === 'error' && <p className={styles.errorMsg}>{t.error}</p>}

                    <button className={styles.submitBtn} type="submit" disabled={status === 'submitting'}>
                        {status === 'submitting' ? t.submitting : t.submit}
                    </button>
                </form>
            )}

            <footer className={styles.footer}>{t.footer}</footer>
        </main>
    );
}
