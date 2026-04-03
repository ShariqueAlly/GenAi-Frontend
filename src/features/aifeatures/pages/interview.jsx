import React, { useMemo, useState, useEffect } from 'react'
import '../styles/interview.scss'
import { useInterview } from '../hooks/useInterview'
import { useParams } from 'react-router'

const interview = ({ data: propData, reportId }) => {
  const { interviewId: routeInterviewId } = useParams()
  const { report: contextReport, downloadReportPdf } = useInterview()
  const [section, setSection] = useState('technical')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [expandedQs, setExpandedQs] = useState({})
  const [selectedRoadmapIndex, setSelectedRoadmapIndex] = useState(0)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [data, setData] = useState(propData || contextReport || null)
  const [loading, setLoading] = useState(!propData && !contextReport && !!reportId)
  const activeReportId = routeInterviewId || reportId
  const reportIdentifier = activeReportId || data?._id || contextReport?._id

  // Load from API if reportId provided
  useEffect(() => {
    if ((activeReportId || reportId) && !propData && !contextReport) {
      const interviewIdToFetch = activeReportId || reportId
      const cached = localStorage.getItem(`interview_${interviewIdToFetch}`)
      if (cached) {
        try {
          setData(JSON.parse(cached))
        } catch (e) {
          console.error('Failed to parse cached interview:', e)
        }
      }

      const fetchInterview = async () => {
        try {
          setLoading(true)
          const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
          const apiBaseUrl = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`
          const token = localStorage.getItem('auth_token')
          const response = await fetch(`${apiBaseUrl}/interview/report/${interviewIdToFetch}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          })
          if (response.ok) {
            const result = await response.json()
            setData(result.data || null)
            localStorage.setItem(`interview_${interviewIdToFetch}`, JSON.stringify(result.data || null))
          }
        } catch (err) {
          console.error('Failed to fetch interview:', err)
        } finally {
          setLoading(false)
        }
      }
      fetchInterview()
    }
  }, [activeReportId, reportId, propData, contextReport])

  useEffect(() => {
    if (contextReport && !propData) {
      setData(contextReport)
    }
  }, [contextReport, propData])

  // Save progress to localStorage
  useEffect(() => {
    if (reportIdentifier) {
      localStorage.setItem(
        `interview_progress_${reportIdentifier}`,
        JSON.stringify({ section, selectedIndex, expandedQs, selectedRoadmapIndex })
      )
    }
  }, [section, selectedIndex, expandedQs, selectedRoadmapIndex, reportIdentifier])

  // Restore progress from localStorage
  useEffect(() => {
    if (reportIdentifier) {
      const saved = localStorage.getItem(`interview_progress_${reportIdentifier}`)
      if (saved) {
        try {
          const {
            section: savedSection,
            selectedIndex: savedIdx,
            expandedQs: savedExpanded,
            selectedRoadmapIndex: savedRoadmapIdx,
          } = JSON.parse(saved)
          setSection(savedSection)
          setSelectedIndex(savedIdx)
          setExpandedQs(savedExpanded)
          setSelectedRoadmapIndex(savedRoadmapIdx || 0)
        } catch (e) {
          console.error('Failed to restore progress:', e)
        }
      }
    }
  }, [reportIdentifier])

  const isRoadmap = section === 'roadmap'
  const questions = section === 'technical' ? data?.technicalQuestions || [] : data?.behavirolQuestions || []
  const selectedQuestion = questions[selectedIndex] || {}
  const roadmapItems = data?.preprationPlan || []
  const selectedRoadmap = roadmapItems[selectedRoadmapIndex] || {}

  const sectionTitle = useMemo(() => {
    if (section === 'technical') return 'Technical Questions'
    if (section === 'behavioral') return 'Behavioral Questions'
    return 'Road Map'
  }, [section])

  const readiness = data?.matchScore || 0

  const handleDownloadPdf = async () => {
    if (!reportIdentifier) {
      return
    }

    try {
      setDownloadingPdf(true)
      await downloadReportPdf(reportIdentifier)
    } catch (error) {
      console.error('PDF download failed:', error)
    } finally {
      setDownloadingPdf(false)
    }
  }

  const toggleExpand = (idx) => {
    setExpandedQs((prev) => {
      const updated = { ...prev }
      updated[idx] = !updated[idx]
      return updated
    })
  }

  if (loading) {
    return (
      <main className='interview'>
        <div className='interview-grid'>
          <div
            style={{
              gridColumn: '1 / -1',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '500px',
            }}
          >
            <div className='loader'>
              <div className='spinner'></div>
              <p>Loading interview report...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!data) {
    return (
      <main className='interview'>
        <div className='interview-grid'>
          <div
            style={{
              gridColumn: '1 / -1',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '500px',
              gap: '12px',
            }}
          >
            <h2 style={{ margin: 0 }}>No interview report yet</h2>
            <p style={{ margin: 0, color: '#b8caf1' }}>
              Generate your first report from the Home page to see results here.
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className='interview'>
      <div className='interview-grid'>
        <aside className='left-panel'>
          <h3>Sections</h3>
          <button className={section === 'technical' ? 'active' : ''} onClick={() => { setSection('technical'); setSelectedIndex(0) }}>Technical questions</button>
          <button className={section === 'behavioral' ? 'active' : ''} onClick={() => { setSection('behavioral'); setSelectedIndex(0) }}>Behavioral questions</button>
          <button className={section === 'roadmap' ? 'active' : ''} onClick={() => { setSection('roadmap'); setSelectedRoadmapIndex(0) }}>Road Map</button>

          <div className='score-card'>
            <p>Match Score</p>
            <strong>{readiness}%</strong>
            <span className='score-label'>
              {readiness >= 80 ? 'Strong match' : readiness >= 60 ? 'Good fit' : 'Needs work'}
            </span>
          </div>

          <div className='download-card'>
            <div className='download-copy'>
              <span className='download-kicker'>Export</span>
              <h4>Download Resume</h4>
              <p>Generate a polished PDF copy of the report for sharing or printing.</p>
            </div>
            <button
              type='button'
              className='download-btn'
              onClick={handleDownloadPdf}
              disabled={downloadingPdf || !reportIdentifier}
            >
              {downloadingPdf ? 'Preparing...' : 'Download Resume'}
            </button>
          </div>
        </aside>

        <section className='main-panel'>
          <div className='mobile-sections'>
            <button
              className={section === 'technical' ? 'active' : ''}
              onClick={() => { setSection('technical'); setSelectedIndex(0) }}
            >
              Technical
            </button>
            <button
              className={section === 'behavioral' ? 'active' : ''}
              onClick={() => { setSection('behavioral'); setSelectedIndex(0) }}
            >
              Behavioral
            </button>
            <button
              className={section === 'roadmap' ? 'active' : ''}
              onClick={() => { setSection('roadmap'); setSelectedRoadmapIndex(0) }}
            >
              Roadmap
            </button>
          </div>
          <div className='panel-heading'>
            <h2>{sectionTitle}</h2>
            {!isRoadmap && (
              <span className='question-count'>{selectedIndex + 1} / {questions.length}</span>
            )}
            {isRoadmap && (
              <span className='question-count'>{selectedRoadmapIndex + 1} / {roadmapItems.length}</span>
            )}
          </div>

          <div className={`question-body ${isRoadmap ? 'roadmap-mode' : ''}`}>
            {!isRoadmap && (
              <div className='question-list'>
                {questions.map((q, idx) => (
                  <div key={idx} className={`question-item ${selectedIndex === idx ? 'active' : ''}`}>
                    <button onClick={() => setSelectedIndex(idx)}>
                      <span className='q-number'>Q{idx + 1}</span>
                      <span className='q-text'>{(q.question || 'Question').substring(0, 45)}...</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className='question-content'>
              {isRoadmap ? (
                <>
                  <div className='roadmap-accordion'>
                    {roadmapItems.map((item, idx) => {
                      const isOpen = !!expandedQs[`roadmap-${idx}`]
                      return (
                        <div key={item.day || idx} className={`roadmap-item ${isOpen ? 'open' : ''}`}>
                          <button
                            className='roadmap-toggle'
                            onClick={() => { setSelectedRoadmapIndex(idx); toggleExpand(`roadmap-${idx}`) }}
                            aria-label={isOpen ? 'Collapse roadmap tasks' : 'Expand roadmap tasks'}
                          >
                            <div className='roadmap-title'>
                              <span className='badge'>Day {item.day || idx + 1}</span>
                              <span className='roadmap-focus'>{item.focusArea || 'Focus area'}</span>
                            </div>
                            <span className='roadmap-icon'>{isOpen ? '-' : '+'}</span>
                          </button>
                          {isOpen && (
                            <div className='roadmap-details'>
                              <label>Tasks</label>
                              <ul>
                                {(item.tasks || []).map((task, taskIdx) => (
                                  <li key={taskIdx}>{task}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                <>
                  <div className='content-header'>
                    <span className='badge'>Q{selectedIndex + 1}</span>
                    <button
                      className='expand-btn'
                      onClick={() => toggleExpand(selectedIndex)}
                      aria-label={expandedQs[selectedIndex] ? 'Collapse details' : 'Expand details'}
                    >
                      {expandedQs[selectedIndex] ? '-' : '+'}
                    </button>
                  </div>
                  <h3>{selectedQuestion.question || 'Question'}</h3>
                  {expandedQs[selectedIndex] ? (
                    <div className='answer-section expanded'>
                      <div className='section-block'>
                        <label>Intention</label>
                        <p>{selectedQuestion.intention || 'No intention provided.'}</p>
                      </div>
                      <div className='section-block'>
                        <label>Answer</label>
                        <p>{selectedQuestion.answer || 'No answer provided.'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className='answer-section'>
                      <p>Tap + to reveal intention and answer.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        <aside className='right-panel'>
          <h3>Skill Gaps</h3>
          <div className='skill-list'>
            {data.skillGaps?.map((item, index) => (
              <span key={index} className={`chip ${item.severity}`}>{item.skill}</span>
            ))}
          </div>

          <div className='help-card'>
            <h4>Suggested next steps</h4>
            <ul>
              <li>Focus on backend system design.</li>
              <li>Implement role-based auth in a Node app.</li>
              <li>Practice behavioral answers with STAR.</li>
            </ul>
          </div>

          <div className='progress-card'>
            <h4>Your Progress</h4>
            <div className='progress-bar'>
              <div className='progress-fill' style={{ width: `${(selectedIndex + 1) / questions.length * 100}%` }}></div>
            </div>
            <p>{selectedIndex + 1} of {questions.length} reviewed</p>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default interview
