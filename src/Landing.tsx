import { useState } from 'react';
import styles from './Landing.module.css';
import ConstellationSphere from './components/ConstellationSphere';
import ConstellaLogo from './components/ConstellaLogo';
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
      {/* <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
        <ConstellationSphere theme={theme} />
      </div> */}

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

        <ConstellaLogo size={72} className={styles.logo} />
        <h1 className={styles.brand}>ConstellaCare</h1>
        <p className={styles.tagline}>A gentle space for every health journey</p>
        
        <p className={styles.description}>
          ConstellaCare is an emotionally intelligent health companion designed for patients, caregivers, and families. 
          Track your wellbeing, prepare for appointments, reflect through guided journaling, access supportive resources, 
          and stay connected with the people who matter most — all through a shared constellation journey that grows with your progress.
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPatient}`}
            onClick={() => navigate('/patient')}
          >
            Patient Portal
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnCaregiver}`}
            onClick={() => navigate('/caregiver')}
          >
            Caregiver Portal
          </button>
        </div>

        <p className={styles.sub}>Turning health journeys into constellations of support.</p>
      </div>

      {/* ── About Modal ── */}
      {activeModal === 'about' && (
        <div className={styles.overlay} onClick={closeModal} role="dialog" aria-modal="true" aria-label="About ConstellaCare">
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeModal} aria-label="Close">✕</button>
            <h2 className={styles.modalTitle}>About ConstellaCare</h2>
            <p className={styles.modalText}>
              ConstellaCare was born from a simple belief: no one should have to navigate health journeys alone — not patients, not the people who love them.
            </p>
            <p className={styles.modalText}>
              Whether you're managing a chronic condition, recovering from surgery, supporting a loved one, navigating a diagnosis, preparing questions for your next medical appointment, or simply needing a calm corner of the internet at 3am, you don't have to carry the emotional weight of healthcare alone. Through diagnosis, treatment, recovery, and everything in between, ConstellaCare is here.
            </p>
            <p className={styles.modalText}>
              Through mood check-ins, guided reflections, appointment preparation tools, caregiver support features, and shared constellation journeys, we help people feel more prepared, connected, and understood throughout their healthcare experience.
            </p>
            <p className={styles.modalText}>
              ConstellaCare complements — but never replaces — professional medical advice. Our goal is to strengthen communication, encourage self-reflection, and help users become more confident participants in their own care.
            </p>
            <div className={styles.modalPill}>🌸 Built with compassion for every health journey</div>
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
              <h3 className={styles.resourceHeading}>🏥 Healthcare Resources</h3>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>HealthHub Singapore</span>
                <a href="https://www.healthhub.sg/" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>healthhub.sg →</a>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Ministry of Health Singapore</span>
                <a href="https://www.moh.gov.sg/" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>moh.gov.sg →</a>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Health Promotion Board</span>
                <a href="https://www.hpb.gov.sg/" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>hpb.gov.sg →</a>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Agency for Integrated Care (AIC)</span>
                <a href="https://www.aic.sg/" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>aic.sg →</a>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Singapore Cancer Society</span>
                <a href="https://www.singaporecancersociety.org.sg/" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>singaporecancersociety.org.sg →</a>
              </div>
            </div>

            <div className={styles.resourceSection}>
              <h3 className={styles.resourceHeading}>🧠 Mental Health Support</h3>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Samaritans of Singapore (SOS) — 1767</span>
                <a href="https://www.sos.org.sg/" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>sos.org.sg →</a>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>IMH Mental Health Helpline — 6389 2222</span>
                <a href="https://www.imh.com.sg/" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>imh.com.sg →</a>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Singapore Association for Mental Health Helpline — 1800 283 7019</span>
                <a href="https://www.samhealth.org.sg/" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>samhealth.org.sg →</a>
              </div>
            </div>

            <div className={styles.resourceSection}>
              <h3 className={styles.resourceHeading}>👨‍👩‍👧 Caregiver Support</h3>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Caring SG</span>
                <a href="https://caring.sg/" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>caring.sg →</a>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>AIC Caregiver Resources</span>
                <a href="https://www.aic.sg/Caregiving-Support/General-Caregiving-Resources" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>aic.sg →</a>
              </div>
            </div>

            <div className={styles.resourceSection}>
              <h3 className={styles.resourceHeading}>🌸 Women's Health Resources</h3>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Breast Cancer Foundation</span>
                <a href="https://www.bcf.org.sg/" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>bcf.org.sg →</a>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>AWARE Helpline — 1800 777 5555</span>
                <a href="https://www.aware.org.sg/" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>aware.org.sg →</a>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>BABES (Babes Pregnancy Crisis Support Ltd) — 8111 3535</span>
                <a href="https://www.babes.org.sg/" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>babes.org.sg →</a>
              </div>
            </div>

            <div className={styles.resourceSection}>
              <h3 className={styles.resourceHeading}>🚨 Emergency Services</h3>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Singapore Police Force — 999</span>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Emergency Ambulance — 995</span>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Non-Emergency Ambulance — 1777</span>
              </div>
            </div>
            
            <div className={styles.modalPill}>💜 Support, guidance, and care — whenever you need it.</div>
          </div>
        </div>
      )}
    </div>
  );
}
// 💜 You are not alone — help is always within reach