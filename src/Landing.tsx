import { useState } from 'react';
import styles from './Landing.module.css';
import ConstellationSphere from './components/ConstellationSphere';
import { Sun, Moon, Sparkles, Heart } from 'lucide-react';

interface LandingProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onNavigate: (path: string) => void;
}

export default function Landing({ theme, onThemeToggle, onNavigate }: LandingProps) {
  const navigate = onNavigate;
  const [activeModal, setActiveModal] = useState<null | 'about' | 'resources' | 'ai'>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <div className={styles.page}>
      {/* Absolute 3D Interactive Celestial Constellation Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
        <ConstellationSphere theme={theme} />
      </div>

      {/* Subtle backing starry particles spacer */}
      <div className={styles.stars} aria-hidden />

      {/* Top nav links with embedded theme toggler */}
      <nav className={styles.nav}>
        <button type="button" className={styles.navLink} onClick={() => setActiveModal('about')}>
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          About ConstellaCare
        </button>
        <button type="button" className={styles.navLink} onClick={() => setActiveModal('resources')}>
          <Heart className="w-3.5 h-3.5 text-purple-400" />
          Resources &amp; Emergency Support
        </button>

        {/* Cohesive Theme Toggler Button */}
        <button
          type="button"
          onClick={onThemeToggle}
          className={`${styles.navLink} p-2 rounded-full flex items-center justify-center transition-all duration-300`}
          aria-label="Toggle Night Mode"
          title={theme === 'dark' ? 'Switch to Daybreak Mode' : 'Switch to Twilight Mode'}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest font-bold ml-1.5 hidden sm:inline">Daybreak</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-purple-700" />
              <span className="text-[10px] uppercase tracking-widest font-bold ml-1.5 hidden sm:inline">Twilight</span>
            </>
          )}
        </button>
      </nav>

      {/* Primary content card container */}
      <div className={styles.content}>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/15 mb-4 animate-bounce" style={{ animationDuration: '3s' }}>
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#a855f7] dark:text-pink-300">
            Celestial Companion
          </span>
        </div>

        <h1 className={styles.brand}>ConstellaCare</h1>
        <p className={styles.tagline}>A gentle space for Breast Cancer patients and caregivers</p>
        
        <p className={styles.description}>
          ConstellaCare helps you name hard feelings, prepare for appointments &amp; build
          resilience together — through mood check-ins, calm tools and a shared constellation
          journey under the same night sky.
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPatient}`}
            onClick={() => navigate('/patient')}
          >
            I am a patient
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnCaregiver}`}
            onClick={() => navigate('/caregiver')}
          >
            I am a caregiver
          </button>
        </div>

        <p className={styles.sub}>Two stars orbiting the same night sky, closer together.</p>
      </div>

      {/* ── About Modal ── */}
      {activeModal === 'about' && (
        <div className={styles.overlay} onClick={closeModal} role="dialog" aria-modal="true" aria-label="About ConstellaCare">
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeModal} aria-label="Close">✕</button>
            <h2 className={styles.modalTitle}>About ConstellaCare</h2>
            <p className={styles.modalText}>
              ConstellaCare was born from a simple belief: no one should have to navigate breast cancer alone — not patients, not the people who love them.
            </p>
            <p className={styles.modalText}>
              We are a digital companion designed to sit quietly beside you through diagnosis, treatment, and recovery. Whether you're tracking how you feel today, preparing questions for your next oncologist visit, or simply needing a calm corner of the internet at 3 am — ConstellaCare is here.
            </p>
            <p className={styles.modalText}>
              Our tools are grounded in evidence-based emotional wellness practices and shaped by real stories from patients and caregivers. We believe in the power of shared experience — symbolised by the constellation you build together with your caregiver, two stars travelling the same sky.
            </p>
            <p className={styles.modalText}>
              ConstellaCare does not replace medical advice. We complement your care team by helping you arrive at appointments more prepared, more heard, and more whole.
            </p>
            <div className={styles.modalPill}>🌸 Built with compassion, for the breast cancer community</div>
          </div>
        </div>
      )}

      {/* ── Resources & Emergency Support Modal ── */}
      {activeModal === 'resources' && (
        <div className={styles.overlay} onClick={closeModal} role="dialog" aria-modal="true" aria-label="Resources and Emergency Support">
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeModal} aria-label="Close">✕</button>
            <h2 className={styles.modalTitle}>Resources &amp; Emergency Support</h2>

            <div className={styles.resourceSection}>
              <h3 className={styles.resourceHeading}>🎗️ Breast Cancer Foundation (BCF)</h3>
              <p className={styles.resourceDesc}>Singapore's leading charity dedicated to breast cancer awareness, early detection support.</p>
              <a href="https://www.bcf.org.sg" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>bcf.org.sg →</a>
              <a href="tel:+6564767522" className={styles.resourceLink}>📞 +65 6476 7522</a>
            </div>

            <div className={styles.resourceSection}>
              <h3 className={styles.resourceHeading}>🚨 Emergency &amp; Crisis Lines</h3>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Singapore Emergency</span>
                <a href="tel:995" className={styles.resourceLink}>📞 995</a>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Samaritans of Singapore (SOS) — 24 hr</span>
                <a href="tel:1767" className={styles.resourceLink}>📞 1767</a>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>IMH Mental Health Helpline — 24 hr</span>
                <a href="tel:63892222" className={styles.resourceLink}>📞 6389 2222</a>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>AWARE Women's Helpline</span>
                <a href="tel:1800777555" className={styles.resourceLink}>📞 1800 777 5555</a>
              </div>
            </div>

            <div className={styles.resourceSection}>
              <h3 className={styles.resourceHeading}>🌐 Helpful Websites</h3>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Breast Cancer Welfare Association</span>
                <a href="https://www.bcwa.org.sg" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>bcwa.org.sg →</a>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Cancer.org — Breast Cancer Guide</span>
                <a href="https://www.cancer.org/cancer/breast-cancer.html" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>cancer.org →</a>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Breastcancer.org — Community &amp; Info</span>
                <a href="https://www.breastcancer.org" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>breastcancer.org →</a>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Singapore Cancer Society</span>
                <a href="https://www.singaporecancersociety.org.sg" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>singaporecancersociety.org.sg →</a>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Caregiver Alliance — Support &amp; Resources</span>
                <a href="https://www.caregiversalliance.org.sg" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>caregiversalliance.org.sg →</a>
              </div>
            </div>

            <div className={styles.modalPill}>💜 You are not alone — help is always within reach</div>
          </div>
        </div>
      )}
    </div>
  );
}
