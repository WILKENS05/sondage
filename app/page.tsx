'use client';

import { useEffect, useState } from 'react';
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
    paysStepTitle: string;
    question: string;
    next: string;
    previous: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
    footer: string;
    counterZero: string;
    counterSome: (n: number) => string;
}> = {
    fr: {
        badge: '🇭🇹 Sondage citoyen',
        title: 'Ta voix compte',
        subtitle: "Que tu sois en Haïti ou dans la diaspora, partage ton avis sur l'avenir du pays.",
        q1: "Quels sont, selon vous, les principaux obstacles à l'accès à une éducation de qualité en Haïti, et quels outils ou ressources pourraient améliorer la situation ?",
        q2: "Comment la technologie (Internet, smartphones, intelligence artificielle...) pourrait-elle améliorer la vie quotidienne ou la société haïtienne ?",
        q3: "Si vous pouviez changer une seule chose pour améliorer l'avenir d'Haïti, quelle serait-elle et pourquoi ?",
        paysLabel: 'Où vis-tu actuellement ? (optionnel)',
        paysPlaceholder: 'Ex : Port-au-Prince, Miami, Paris...',
        paysStepTitle: 'Presque fini !',
        question: 'Question',
        next: 'Suivant →',
        previous: '← Précédent',
        submit: 'Envoyer mes réponses',
        submitting: 'Envoi en cours...',
        success: 'Mèsi ! Merci ! Ta voix a bien été enregistrée.',
        error: "Une erreur s'est produite. Réessaie.",
        footer: "Réponses anonymes, utilisées uniquement à des fins d'analyse d'opinion publique.",
        counterZero: 'Sois parmi les premiers à partager ton avis !',
        counterSome: (n) => `🎉 ${n} personne${n > 1 ? 's' : ''} ${n > 1 ? 'ont' : 'a'} déjà partagé son avis`,
    },
    ht: {
        badge: '🇭🇹 Sondaj sitwayen',
        title: 'Vwa ou konte',
        subtitle: 'Kit ou nan Ayiti kit ou nan dyaspora a, pataje opinyon ou sou avni peyi a.',
        q1: 'Dapre ou, ki pi gwo obstak ki anpeche moun jwenn yon bon jan edikasyon an Ayiti, e ki zouti oswa resous ki ta ka amelyore sitiyasyon an?',
        q2: 'Kijan teknoloji (Entènèt, smartphone, entèlijans atifisyèl...) ta ka amelyore lavi chak jou oswa sosyete ayisyen an?',
        q3: 'Si ou te ka chanje yon sèl bagay pou amelyore avni Ayiti, ki sa li ta ye e poukisa?',
        paysLabel: 'Ki kote w ap viv kounye a? (opsyonèl)',
        paysPlaceholder: 'Pa egzanp : Pòtoprens, Miami, Paris...',
        paysStepTitle: 'Prèske fini !',
        question: 'Kesyon',
        next: 'Apre →',
        previous: '← Anvan',
        submit: 'Voye repons mwen yo',
        submitting: 'N ap voye...',
        success: 'Mèsi ! Vwa ou anrejistre.',
        error: 'Gen yon pwoblèm. Eseye ankò.',
        footer: 'Repons anonim, itilize sèlman pou analiz opinyon piblik.',
        counterZero: 'Se ou k ap premye moun ki pataje opinyon ou !',
        counterSome: (n) => `🎉 ${n} moun deja pataje opinyon yo`,
    },
    en: {
        badge: '🇭🇹 Citizen survey',
        title: 'Your voice matters',
        subtitle: "Whether you're in Haiti or in the diaspora, share your opinion on the future of the country.",
        q1: 'In your opinion, what are the main obstacles to accessing quality education in Haiti, and what tools or resources could improve the situation?',
        q2: 'How could technology (Internet, smartphones, artificial intelligence...) improve daily life or Haitian society?',
        q3: 'If you could change one single thing to improve the future of Haiti, what would it be and why?',
        paysLabel: 'Where do you currently live? (optional)',
        paysPlaceholder: 'E.g.: Port-au-Prince, Miami, Paris...',
        paysStepTitle: 'Almost done!',
        question: 'Question',
        next: 'Next →',
        previous: '← Previous',
        submit: 'Send my answers',
        submitting: 'Sending...',
        success: 'Mèsi ! Thank you! Your voice has been recorded.',
        error: 'Something went wrong. Please try again.',
        footer: 'Anonymous answers, used only for public opinion analysis.',
        counterZero: 'Be among the first to share your opinion!',
        counterSome: (n) => `🎉 ${n} ${n > 1 ? 'people have' : 'person has'} already shared their opinion`,
    },
};

const TOTAL_STEPS = 4; // q1, q2, q3, pays+submit

export default function Home() {
    const [lang, setLang] = useState<Lang>('fr');
    const [step, setStep] = useState(0);
    const [r1, setR1] = useState('');
    const [r2, setR2] = useState('');
    const [r3, setR3] = useState('');
    const [pays, setPays] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
    const [count, setCount] = useState<number | null>(null);

    const t = CONTENT[lang];

    useEffect(() => {
        fetch('/api/count')
            .then((r) => r.json())
            .then((d) => setCount(typeof d.count === 'number' ? d.count : 0))
            .catch(() => setCount(0));
    }, []);

    const answers = [r1, r2, r3];
    const setAnswers = [setR1, setR2, setR3];
    const questions = [t.q1, t.q2, t.q3];

    function goNext() {
        if (step < 3 && !answers[step].trim()) return;
        setStep((s) => Math.min(s + 1, 3));
    }

    function goPrevious() {
        setStep((s) => Math.max(s - 1, 0));
    }

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
            setCount((c) => (c === null ? null : c + 1));
        } catch {
            setStatus('error');
        }
    }

    return (
        <main className={styles.main}>
            <div className={styles.bgBlob} aria-hidden="true" />

            <div className={styles.langToggle}>
                <button className={lang === 'fr' ? styles.langActive : styles.langBtn} onClick={() => setLang('fr')} type="button">
                    Français
                </button>
                <button className={lang === 'ht' ? styles.langActive : styles.langBtn} onClick={() => setLang('ht')} type="button">
                    Kreyòl
                </button>
                <button className={lang === 'en' ? styles.langActive : styles.langBtn} onClick={() => setLang('en')} type="button">
                    English
                </button>
            </div>

            <section className={styles.hero}>
                <HaitianFlag className={styles.flag} />
                <div className={styles.badge}>{t.badge}</div>
                <h1 className={styles.title}>{t.title}</h1>
                <p className={styles.subtitle}>{t.subtitle}</p>
                {count !== null && (
                    <p className={styles.counter}>{count > 0 ? t.counterSome(count) : t.counterZero}</p>
                )}
            </section>

            {status === 'done' ? (
                <div className={styles.successCard}>
                    <div className={styles.successIcon}>✓</div>
                    <p>{t.success}</p>
                </div>
            ) : (
                <div className={styles.wizard}>
                    <div className={styles.progressTrack}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
                        />
                    </div>
                    <p className={styles.stepLabel}>
                        {step < 3 ? `${t.question} ${step + 1} / 3` : t.paysStepTitle}
                    </p>

                    <form className={styles.form} onSubmit={handleSubmit} key={step}>
                        {step < 3 ? (
                            <div className={`${styles.field} ${styles.stepIn}`}>
                                <label className={styles.label} htmlFor={`q${step + 1}`}>
                                    {questions[step]}
                                </label>
                                <textarea
                                    id={`q${step + 1}`}
                                    className={styles.textarea}
                                    value={answers[step]}
                                    onChange={(e) => setAnswers[step](e.target.value)}
                                    maxLength={3000}
                                    rows={6}
                                    autoFocus
                                />
                            </div>
                        ) : (
                            <div className={`${styles.field} ${styles.stepIn}`}>
                                <label className={styles.label} htmlFor="pays">{t.paysLabel}</label>
                                <input
                                    id="pays"
                                    className={styles.input}
                                    value={pays}
                                    onChange={(e) => setPays(e.target.value)}
                                    maxLength={100}
                                    placeholder={t.paysPlaceholder}
                                    autoFocus
                                />
                            </div>
                        )}

                        {status === 'error' && <p className={styles.errorMsg}>{t.error}</p>}

                        <div className={styles.navRow}>
                            {step > 0 && (
                                <button className={styles.btnGhost} type="button" onClick={goPrevious}>
                                    {t.previous}
                                </button>
                            )}
                            {step < 3 ? (
                                <button
                                    className={styles.submitBtn}
                                    type="button"
                                    onClick={goNext}
                                    disabled={!answers[step].trim()}
                                >
                                    {t.next}
                                </button>
                            ) : (
                                <button className={styles.submitBtn} type="submit" disabled={status === 'submitting'}>
                                    {status === 'submitting' ? t.submitting : t.submit}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            <footer className={styles.footer}>{t.footer}</footer>
        </main>
    );
}
