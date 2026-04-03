import React, {useState, useRef} from 'react'
import "../styles/home.scss"
import { useInterview } from '../hooks/useInterview'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'

const home = () => {
    const navigate = useNavigate();
    const { loading, generateReport } = useInterview();
    const { user, loading: authLoading } = useAuth();
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [resume, setResume] = useState(null);
    const resumeRef = useRef(null);

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!jobDescription.trim() || !selfDescription.trim() || !resume) {
        return;
      }

      if (!user) {
        navigate('/login');
        return;
      }

      const report = await generateReport({
        jobDescription,
        selfDescription,
        resume,
      });

      if (report) {
        navigate(`/app/interview/${report._id || report.id}`);
      }
    };

    const handleResumeChange = (e) => {
      const file = e.target.files?.[0] ?? null;
      setResume(file);
    };

  return (
    <main className='home'>
      <div className='hero-glow'></div>
      <div className='orbit orbit-one'></div>
      <div className='orbit orbit-two'></div>

      <header className='topbar'>
        <Link className='brand' to='/'>Gen AI Resume Builder</Link>
        <div className='topbar-actions'>
          {user ? (
            <>
              <span className='status-pill'>Logged in</span>
              <Link className='primary-link' to='/app/interview'>Go to Dashboard</Link>
            </>
          ) : (
            <>
              <Link className='ghost-link' to='/login'>Login</Link>
              <Link className='primary-link' to='/register'>Create Account</Link>
            </>
          )}
        </div>
      </header>

      <section className='hero'>
        <div className='hero-copy'>
          <span className='eyebrow'>AI interview copilot</span>
          <h1>Create a laser‑focused interview strategy from your resume in minutes.</h1>
          <p>
            Turn your resume, job description, and quick self‑profile into a tailored interview roadmap:
            match score, smart questions, skill gaps, and a prep plan you can act on today.
          </p>
          <div className='hero-cta'>
            <button className='cta-btn' type='button' onClick={() => {
              document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })
            }}>
              Build My Strategy
            </button>
            <div className='hero-meta'>
              <span>Trusted by early users</span>
              <div className='sparkline'></div>
            </div>
          </div>
          {!user && (
            <div className='auth-hint'>
              Please login or register to unlock the generator.
            </div>
          )}
        </div>
        <div className='hero-card'>
          <div className='hero-card-header'>
            <span>Preview</span>
            <strong>Interview Readiness</strong>
          </div>
          <div className='hero-score'>
            <div className='score-ring'>
              <span>86%</span>
              <small>Match</small>
            </div>
            <div className='score-details'>
              <p>Strong fit for MERN roles</p>
              <ul>
                <li>10 tailored technical questions</li>
                <li>Behavioral prompts aligned to JD</li>
                <li>3‑day prep plan</li>
              </ul>
            </div>
          </div>
          <div className='hero-tags'>
            <span>Node.js</span>
            <span>System Design</span>
            <span>React</span>
          </div>
        </div>
      </section>

      <section className='value-grid'>
        <article>
          <h3>Precise match score</h3>
          <p>See exactly where you align and what to tighten before the interview.</p>
        </article>
        <article>
          <h3>Ready‑to‑use questions</h3>
          <p>Practice with customized technical and behavioral prompts, not generic lists.</p>
        </article>
        <article>
          <h3>Actionable prep plan</h3>
          <p>Follow a day‑by‑day roadmap built around your gap areas.</p>
        </article>
      </section>

      <form className='page-wrapper generator' id='generator' onSubmit={handleSubmit}>
        <div className='section-title'>
          <h2>Generate your strategy</h2>
          <p>Upload your resume, add the target role, and let the AI craft your plan.</p>
        </div>

        <div className='interview-input-group'>
          <section className='panel target-job'>
            <div className='panel-header'>
              <h2>Target Job Description</h2>
              <span className='panel-chip'>Paste full JD</span>
            </div>
            <textarea
              name='jobDescription'
              id='jobDescription'
              placeholder='Paste the full job description here...'
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </section>

          <section className='panel your-profile'>
            <div className='panel-header'>
              <h2>Your Profile</h2>
              <span className='panel-chip'>Resume + Summary</span>
            </div>

            <label className='file-label' htmlFor='resume'>
              <span>Upload Resume</span>
              <small>PDF or DOCX (max 5 MB)</small>
              <input
                hidden
                ref={resumeRef}
                type='file'
                id='resume'
                name='resume'
                accept='.pdf,.doc,.docx'
                onChange={handleResumeChange}
              />
            </label>

            <div className='self-description'>
              <label htmlFor='selfDescription'>Quick Self‑Description</label>
              <textarea
                name='selfDescription'
                id='selfDescription'
                placeholder='Briefly describe your experience, skills, and career goals.'
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
              />
            </div>

            <button className='generate-btn' type='submit' disabled={loading || authLoading || !user}>
              {loading
                ? 'Generating...'
                : authLoading
                  ? 'Checking Session...'
                  : user
                    ? 'Generate My Interview Strategy'
                    : 'Login to Continue'}
            </button>
            {!user && (
              <div className='inline-auth'>
                <Link to='/login'>Login</Link>
                <span>or</span>
                <Link to='/register'>Create free account</Link>
              </div>
            )}
          </section>
        </div>
      </form>
    </main>
  )
}

export default home
