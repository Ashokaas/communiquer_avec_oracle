import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Howl } from 'howler';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { tsParticles } from '@tsparticles/engine';
import type { ISourceOptions } from '@tsparticles/engine';

// Charger les sons (si les fichiers manquent, ça ne plantera pas)
const sfx = {
  music: new Howl({ src: ['/music.mp3'], loop: true, volume: 0.1 }),
  drone: new Howl({ src: ['/drone.mp3'], loop: true, volume: 0.4 }),
  click: new Howl({ src: ['/click.mp3'], volume: 0.2 }),
  reveal: new Howl({ src: ['/reveal.mp3'], volume: 0.5 }),
  endSound: new Howl({ src: ['/end_sound.mp3'], volume: 0.6 }),
  errorEmail: new Howl({ src: ['/error_email.mp3'], volume: 0.5 }),
  nextInput: new Howl({ src: ['/next_input.mp3'], volume: 0.03 }),
};

// Initialiser les particules une seule fois au chargement du module
let particlesInitialized = false;
const initPromise = initParticlesEngine(async engine => {
  await loadSlim(engine);
}).then(() => {
  particlesInitialized = true;
});

export default function Ritual() {
  const [step, setStep] = useState(0); // 0=Intro, 1=Nom, 2=Email, 3=Sujet, 4=Message
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', msg: '' });
  const [particlesReady, setParticlesReady] = useState(particlesInitialized);
  const [emailError, setEmailError] = useState(false);

  // Démarrer l'ambiance au premier clic
  const start = () => {
    if (!sfx.music.playing()) sfx.music.play();
    if (!sfx.drone.playing()) sfx.drone.play();
    sfx.nextInput.play();
    sfx.reveal.play();
    setStep(1);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const next = () => {
    sfx.nextInput.play();
    sfx.reveal.play();
    setStep(prev => prev + 1);
  };

  const nextWithEmailValidation = () => {
    if (validateEmail(formData.email)) {
      setEmailError(false);
      sfx.nextInput.play();
      sfx.reveal.play();
      setStep(prev => prev + 1);
    } else {
      sfx.errorEmail.play();
      setEmailError(true);
      setTimeout(() => setEmailError(false), 600);
    }
  };

  const sendToDiscord = async () => {
    try {
      await fetch('https://discord.com/api/webhooks/1446347832184541194/mB-re_fxB-m1Yci55TLYXzJvzBFMOPspJ0ULmcKtRJyS7jRBTah6rxqawEhR6ebUy68E', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '🔮 L\'ORACLE A REÇU UN MESSAGE',
            color: 0x8B5CF6,
            fields: [
              { name: '👤 Nom', value: formData.name || 'Non renseigné', inline: true },
              { name: '📧 Email', value: formData.email || 'Non renseigné', inline: true },
              { name: '📝 Sujet', value: formData.subject || 'Non renseigné', inline: false },
              { name: '💬 Message', value: formData.msg || 'Non renseigné', inline: false }
            ],
            timestamp: new Date().toISOString(),
            footer: { text: 'Oracle Contact Form' }
          }]
        })
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi au webhook:', error);
    }
  };

  // Gérer la touche Entrée
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && step === 2) {
      nextWithEmailValidation();
    } else if (e.key === 'Enter' && step > 0 && step < 4 && step !== 2) {
      next();
    }
    // Son de frappe
    if (e.key.length === 1) sfx.click.play();
  };

  useEffect(() => {
    if (!particlesInitialized) {
      initPromise.then(() => setParticlesReady(true));
    }
    // Démarrer la musique dès le chargement du composant
    if (!sfx.music.playing()) {
      sfx.music.play();
    }
  }, []);

  const ambientOptions = useMemo<ISourceOptions>(() => ({
    fullScreen: { enable: true, zIndex: 2 },
    background: { color: 'transparent' },
    particles: {
      number: { value: 90, density: { enable: true, area: 900 } },
      color: { value: ['#ffffff', '#d1d5db', '#9ca3af'] },
      opacity: { value: { min: 0.08, max: 0.25 } },
      size: { value: { min: 1, max: 3 } },
      move: { enable: true, speed: 0.35, direction: 'none', outModes: { default: 'out' }, drift: 0.05 },
      wobble: { enable: true, distance: 4, speed: 0.5 },
      links: { enable: false },
      rotate: { value: { min: 0, max: 360 }, direction: 'random', animation: { enable: true, speed: 5 } },
      shadow: { enable: true, blur: 6, color: '#111827' }
    },
    interactivity: {
      events: { onHover: { enable: false }, onClick: { enable: false }, resize: { enable: true } }
    },
    detectRetina: true
  }), []);

  const burstOptions = useMemo<ISourceOptions>(() => ({
    fullScreen: { enable: true, zIndex: 25 },
    background: { color: 'transparent' },
    particles: {
      number: { value: 0 },
      color: { value: ['#ffffff', '#e5e7eb', '#d1d5db', '#9ca3af'] },
      opacity: { value: { min: 0.6, max: 1 } },
      size: { value: { min: 2, max: 6 } },
      move: {
        enable: true,
        gravity: { enable: true, acceleration: 15 },
        speed: { min: 15, max: 35 },
        decay: 0.08,
        direction: 'none',
        outModes: { default: 'destroy', bottom: 'destroy' }
      },
      rotate: { value: { min: 0, max: 360 }, direction: 'random', animation: { enable: true, speed: 30 } },
      tilt: { value: { min: 0, max: 360 }, animation: { enable: true, speed: 30 } },
      life: { count: 1, duration: { value: { min: 1.2, max: 1.8 }, sync: false } },
      shadow: { enable: true, blur: 8, color: '#7c2d12' }
    },
    emitters: {
      life: { count: 1, duration: 0.2 },
      rate: { delay: 0.01, quantity: 120 },
      size: { width: 0, height: 0 },
      position: { x: 50, y: 50 }
    },
    detectRetina: true
  }), []);

  const finaleOptions = useMemo<ISourceOptions>(() => ({
    fullScreen: { enable: true, zIndex: 9999 },
    background: { color: 'transparent' },
    particles: {
      number: { value: 220, density: { enable: true, area: 700 } },
      color: { value: ['#ffffff', '#e5e7eb', '#d1d5db'] },
      opacity: { value: { min: 0.25, max: 0.8 } },
      size: { value: { min: 1, max: 4 } },
      move: {
        enable: true,
        speed: { min: 0.8, max: 2.2 },
        direction: 'none',
        outModes: { default: 'out' },
        drift: 0.1,
        angle: { value: 45, offset: 45 }
      },
      wobble: { enable: true, distance: 12, speed: 2 },
      rotate: { value: { min: 0, max: 360 }, direction: 'random', animation: { enable: true, speed: 12 } },
      tilt: { value: { min: 0, max: 360 }, animation: { enable: true, speed: 18 } },
      shadow: { enable: true, blur: 10, color: '#111827' }
    },
    interactivity: {
      events: { onHover: { enable: false }, onClick: { enable: false }, resize: { enable: true } }
    },
    detectRetina: true
  }), []);

  const triggerBurst = useCallback(() => {
    tsParticles.load({ id: 'oracle-burst', options: burstOptions }).then(container => {
      if (!container) return;
      setTimeout(() => container.destroy(), 2200);
    });
  }, [burstOptions]);

  const styles = `
    .ritual-wrapper {
      width: 100%;
      max-width: 800px;
      padding: 32px;
      text-align: center;
      min-height: 400px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .ritual-cursor-pointer {
      cursor: pointer;
    }

    .oracle-title {
      font-size: clamp(48px, 12vw, 96px);
      font-weight: bold;
      background: linear-gradient(to bottom, #fef3c7, #b45309);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
      margin-bottom: 32px;
      font-family: 'Uncial Antiqua', serif;
    }

    .pulse-text {
      color: #fcd34d;
      opacity: 0.6;
      letter-spacing: 0.5em;
      font-size: 20px;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      font-family: 'Cinzel Decorative', serif;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
      20%, 40%, 60%, 80% { transform: translateX(8px); }
    }

    .label {
      display: block;
      color: #f59e0b;
      letter-spacing: 0.08em;
      margin-bottom: 48px;
      text-transform: uppercase;
      font-size: 30px;
      font-family: 'Cinzel Decorative', serif;
    }

    .input-field {
      background: transparent;
      border: none;
      border-bottom: 2px solid rgba(217, 119, 6, 0.5);
      color: #fef08a;
      text-align: center;
      font-size: 48px;
      width: 100%;
      padding: 16px 0;
      font-family: 'Cormorant Garamond', serif;
      outline: none;
      transition: border-color 0.2s, color 0.2s, text-shadow 0.2s;
    }

    .input-field.error {
      border-bottom-color: #ef4444;
      color: #fca5a5;
      text-shadow: 0 0 12px rgba(239, 68, 68, 0.5);
      animation: shake 0.5s ease-in-out;
    }

    .input-field::placeholder {
      color: rgba(120, 53, 15, 0.5);
    }

    .input-field:focus {
      border-bottom-color: #fcd34d;
    }

    .textarea-field {
      background: transparent;
      border: none;
      border-bottom: 2px solid rgba(217, 119, 6, 0.5);
      color: #fef08a;
      text-align: left;
      font-size: 24px;
      width: 100%;
      padding: 12px 0;
      font-family: 'Cormorant Garamond', serif;
      outline: none;
      resize: none;
      transition: border-color 0.2s;
      line-height: 1.6;
      overflow-y: auto;
    }

    .textarea-field::-webkit-scrollbar {
      width: 8px;
      cursor: default;
    }

    .textarea-field::-webkit-scrollbar-track {
      background: rgba(217, 119, 6, 0.1);
      border-radius: 4px;
      cursor: default;
    }

    .textarea-field::-webkit-scrollbar-thumb {
      background: rgba(217, 119, 6, 0.5);
      border-radius: 4px;
      cursor: default;
    }

    .textarea-field::-webkit-scrollbar-thumb:hover {
      background: rgba(217, 119, 6, 0.7);
      cursor: default;
    }

    .textarea-field::placeholder {
      color: rgba(120, 53, 15, 0.5);
    }

    .textarea-field:focus {
      border-bottom-color: #fcd34d;
    }

    .button {
      position: relative;
      margin-top: 48px;
      padding: 20px 50px;
      border: 3px solid #dc2626;
      color: #fbbf24;
      background: linear-gradient(135deg, rgba(120, 53, 15, 0.3), rgba(185, 28, 28, 0.2));
      transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      text-transform: uppercase;
      letter-spacing: 0.15em;
      font-size: 20px;
      font-weight: bold;
      font-family: 'Cinzel Decorative', serif;
      cursor: pointer;
      box-shadow: 0 0 20px rgba(220, 38, 38, 0.3), inset 0 0 20px rgba(251, 191, 36, 0.1);
      overflow: hidden;
      transform: perspective(500px) rotateX(0deg);
    }

    .button::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(251, 191, 36, 0.4), transparent);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .button:hover::before {
      width: 300px;
      height: 300px;
    }

    .button:hover {
      background: linear-gradient(135deg, rgba(185, 28, 28, 0.5), rgba(120, 53, 15, 0.5));
      border-color: #fbbf24;
      color: #fff;
      box-shadow: 0 0 40px rgba(251, 191, 36, 0.6), 
                  0 0 80px rgba(220, 38, 38, 0.4),
                  inset 0 0 30px rgba(251, 191, 36, 0.2);
      transform: perspective(500px) rotateX(5deg) scale(1.05);
    }

    .button:active {
      transform: perspective(500px) rotateX(2deg) scale(0.98);
      box-shadow: 0 0 60px rgba(251, 191, 36, 0.8), 
                  0 0 100px rgba(220, 38, 38, 0.6),
                  inset 0 0 40px rgba(251, 191, 36, 0.3);
    }

    .final-message {
      font-size: 56px;
      color: #fef3c7;
      font-family: serif;
    }

    .final-overlay {
      position: fixed;
      inset: 0;
      background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.82) 55%, rgba(0,0,0,0.95) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 80;
      backdrop-filter: blur(6px);
    }

    .final-card {
      position: relative;
      padding: 48px 56px;
      border: 2px solid rgba(255,255,255,0.25);
      border-radius: 16px;
      background: linear-gradient(145deg, rgba(31,41,55,0.75), rgba(17,24,39,0.9));
      box-shadow: 0 20px 60px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,255,255,0.06);
      max-width: 720px;
      width: min(90vw, 760px);
      text-align: center;
      z-index: 90;
    }

    .final-card::after {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 18px;
      border: 1px solid rgba(255,255,255,0.08);
      pointer-events: none;
    }

    .final-title {
      font-family: 'Uncial Antiqua', serif;
      font-size: clamp(40px, 7vw, 82px);
      letter-spacing: 0.08em;
      background: linear-gradient(120deg, #ffffff, #d1d5db, #9ca3af);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 18px;
      text-shadow: 0 0 22px rgba(255,255,255,0.35);
    }

    .final-sub {
      color: #e5e7eb;
      font-size: 18px;
      letter-spacing: 0.06em;
      opacity: 0.75;
      margin-top: 6px;
      font-family: 'Cinzel Decorative', serif;
    }

    .final-ack-btn {
      margin-top: 28px;
      padding: 14px 28px;
      border: 1px solid rgba(255,255,255,0.4);
      background: linear-gradient(120deg, rgba(255,255,255,0.08), rgba(229,231,235,0.12));
      color: #f9fafb;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-size: 16px;
      font-family: 'Cinzel Decorative', serif;
      cursor: pointer;
      transition: all 0.25s ease;
      box-shadow: 0 0 18px rgba(255,255,255,0.15), inset 0 0 12px rgba(255,255,255,0.08);
      border-radius: 8px;
    }

    .final-ack-btn:hover {
      background: linear-gradient(120deg, rgba(255,255,255,0.16), rgba(229,231,235,0.22));
      border-color: rgba(255,255,255,0.6);
      box-shadow: 0 0 26px rgba(255,255,255,0.25), inset 0 0 16px rgba(255,255,255,0.12);
      transform: translateY(-1px);
    }

    .final-ack-btn:active {
      transform: translateY(1px) scale(0.99);
      box-shadow: 0 0 18px rgba(255,255,255,0.2), inset 0 0 18px rgba(255,255,255,0.16);
    }

    .back-btn {
      position: fixed;
      top: 30px;
      left: 30px;
      z-index: 100;
      padding: 10px 20px;
      border: 1px solid rgba(255,255,255,0.2);
      background: rgba(0,0,0,0.3);
      color: rgba(255,255,255,0.6);
      letter-spacing: 0.05em;
      font-size: 13px;
      font-family: 'Cinzel Decorative', serif;
      cursor: pointer;
      transition: all 0.25s ease;
      border-radius: 6px;
      backdrop-filter: blur(4px);
    }

    .back-btn:hover {
      background: rgba(0,0,0,0.5);
      border-color: rgba(255,255,255,0.35);
      color: rgba(255,255,255,0.85);
      transform: translateY(-1px);
    }

    .back-btn:active {
      transform: translateY(0);
    }

    .particles-layer,
    .particles-layer-top {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9999 !important;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      {step > 0 && step < 5 && (
        <button className="back-btn" onClick={() => setStep(step - 1)}>
          {step === 1 && "Refermer le voile..."}
          {step === 2 && "Rebrousser chemin..."}
          {step === 3 && "Renoncer à la vision..."}
          {step === 4 && "Effacer les murmures..."}
        </button>
      )}
      <div className="ritual-wrapper">
        <AnimatePresence mode="wait">
          
          {/* ÉTAPE 0 : INTRO */}
          {step === 0 && (
            <motion.div 
              key="step0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              onClick={start}
              className="ritual-cursor-pointer"
            >
              <h1 className="oracle-title">S'ADRESSER A L'ORACLE</h1>
              <p className="pulse-text">CLIQUER POUR ENTRER</p>
            </motion.div>
          )}

          {/* ÉTAPE 1 : NOM */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              style={{ width: '100%' }}
            >
              <label className="label">Qui ose déranger l'Oracle pendant son repos éternel ?</label>
              <input 
                autoFocus
                className="input-field"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                onKeyDown={handleKey}
                spellCheck={false}
                autoComplete="off"
              />
            </motion.div>
          )}

          {/* ÉTAPE 2 : EMAIL */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              style={{ width: '100%' }}
            >
              <label className="label">Où l'Oracle peut-il vous adresser sa vision ?</label>
              <input 
                autoFocus
                type="email"
                className={`input-field${emailError ? ' error' : ''}`}
                value={formData.email}
                onChange={e => {
                  setFormData({...formData, email: e.target.value});
                  if (emailError) setEmailError(false);
                }}
                onKeyDown={handleKey}
                spellCheck={false}
                autoComplete="off"
              />
            </motion.div>
          )}

          {/* ÉTAPE 3 : SUJET */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              style={{ width: '100%' }}
            >
              <label className="label">Quel est l'objet de ta quête ?</label>
              <input 
                autoFocus
                className="input-field"
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                onKeyDown={handleKey}
                spellCheck={false}
                autoComplete="off"
              />
            </motion.div>
          )}

          {/* ÉTAPE 4 : MESSAGE */}
          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              style={{ width: '100%' }}
            >
              <label className="label">Ta Révélation :</label>
              <textarea 
                autoFocus
                rows={6}
                className="textarea-field"
                value={formData.msg}
                onChange={e => setFormData({...formData, msg: e.target.value})}
                spellCheck={false}
                autoComplete="off"
              />
              <button 
                onClick={() => { 
                  sfx.music.stop();
                  sfx.drone.stop();
                  sfx.endSound.play();
                  triggerBurst(); 
                  sendToDiscord();
                  setStep(5); 
                }}
                className="button"
              >
                Sceller le destin
              </button>
            </motion.div>
          )}

          {/* ÉTAPE 5 : FIN */}
          {step === 5 && (
            <motion.div 
              key="step5"
              className="final-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="final-card"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 12 }}
              >
                <div className="final-title">L'ORACLE A ENTENDU</div>
                <div className="final-sub">Tes mots sont scellés dans le voile des ombres.</div>
                <button className="final-ack-btn" onClick={() => {
                  setStep(0);
                  setFormData({ name: '', email: '', subject: '', msg: '' });
                }}>Je vous ai compris</button>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      {particlesReady && step === 5 && (
        <Particles
          id="oracle-finale"
          options={finaleOptions}
          className="particles-layer-top"
        />
      )}
    </>
  );
}
