import React, { useEffect, useState } from 'react'
import axios from 'axios'

const FALLBACK_NEWS = [
  {
    source: { name: 'TechCrunch' },
    author: 'Sarah Perez',
    title: 'AI Revolution: Next-Generation Foundation Models Transform Enterprise Workflows',
    description: 'Generative AI tools and autonomous multi-agent frameworks are rapidly redefining productivity across technology, healthcare, and finance sectors worldwide.',
    url: 'https://techcrunch.com',
    urlToImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    content: 'Artificial Intelligence continues to accelerate exponentially as enterprise organizations adopt specialized autonomous subagents to streamline coding, research, and data visualization.'
  },
  {
    source: { name: 'Reuters' },
    author: 'Reuters Markets',
    title: 'Global Markets Rally as Tech Innovation & Clean Energy Investments Surge',
    description: 'Stock indices reached record highs today following strong earnings reports from semiconductor leaders and renewable energy infrastructure breakthroughs.',
    url: 'https://reuters.com',
    urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    content: 'Global financial markets experienced robust growth today driven by strong tech Sector investments and clean energy initiatives.'
  },
  {
    source: { name: 'BBC News' },
    author: 'Science Desk',
    title: 'James Webb Space Telescope Discovers Atmospheric Water on Exoplanet',
    description: 'Astronomers using NASA\'s Deep Space observatory have detected vapor and clouds on a planet located 120 light-years from Earth in a habitable zone.',
    url: 'https://bbc.com',
    urlToImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    content: 'Astronomers have confirmed atmospheric signatures including water vapor on remote exoplanets using high-precision spectrometry.'
  },
  {
    source: { name: 'Wired' },
    author: 'Quantum Insights',
    title: 'Quantum Computing Reaches Milestones in Molecular Simulation & Cryptography',
    description: 'Researchers demonstrate room-temperature superconducting qubits capable of breaking complex molecular simulations in seconds.',
    url: 'https://wired.com',
    urlToImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    publishedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    content: 'Quantum processor architectures have scaled beyond 1,000 logical qubits, opening new horizons in drug discovery and cryptographic research.'
  },
  {
    source: { name: 'The Verge' },
    author: 'Dieter Bohn',
    title: 'Next-Gen Mobile Hardware & Spatial Computing Headsets Reshape Consumer Tech',
    description: 'Spatial audio, micro-OLED displays, and ultra-fast custom silicon are transforming how we interact with personal computing devices.',
    url: 'https://theverge.com',
    urlToImage: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80',
    publishedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    content: 'Spatial computing display technology has matured dramatically with lightweight form factors and high refresh rates.'
  },
  {
    source: { name: 'Bloomberg' },
    author: 'Energy Report',
    title: 'Next-Gen Solid State Batteries Promise 1,000km Range for Electric Vehicles',
    description: 'Commercial manufacturing of solid-state lithium cells begins as automakers prepare to roll out ultra-fast charging EV fleets.',
    url: 'https://bloomberg.com',
    urlToImage: 'https://images.unsplash.com/photo-1558441719-443b38605AD4?auto=format&fit=crop&w=800&q=80',
    publishedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    content: 'Battery technology advancements enable 10-minute rapid charging and significantly higher energy density.'
  }
]

const CATEGORIES = [
  { id: 'general', label: '🔥 Top Headlines', icon: 'ti-flame' },
  { id: 'technology', label: '💻 Technology', icon: 'ti-cpu' },
  { id: 'business', label: '💼 Business', icon: 'ti-chart-bar' },
  { id: 'entertainment', label: '🎬 Entertainment', icon: 'ti-movie' },
  { id: 'sports', label: '⚽ Sports', icon: 'ti-ball-football' },
  { id: 'science', label: '🔬 Science', icon: 'ti-atom' },
  { id: 'health', label: '🏥 Health', icon: 'ti-heartbeat' }
]

const Home = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('general')
  const [country, setCountry] = useState('in')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('feed') // 'feed' or 'bookmarks'
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('newshub_bookmarks')
    return saved ? JSON.parse(saved) : []
  })
  const [selectedArticle, setSelectedArticle] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const apiKey = '9b6ac262eea44bcbbf80ae1b064f631d'
      const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`
      const response = await axios.get(url)
      
      if (response.data && response.data.articles && response.data.articles.length > 0) {
        // Filter out removed articles
        const valid = response.data.articles.filter(a => a.title && a.title !== '[Removed]')
        setData(valid.length > 0 ? valid : FALLBACK_NEWS)
      } else {
        setData(FALLBACK_NEWS)
      }
    } catch (error) {
      console.warn('NewsAPI fetch error or rate-limited, loading curated feeds:', error)
      setData(FALLBACK_NEWS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [category, country])

  const toggleBookmark = (article) => {
    const isBookmarked = bookmarks.some(b => b.title === article.title)
    let updated = []
    if (isBookmarked) {
      updated = bookmarks.filter(b => b.title !== article.title)
    } else {
      updated = [...bookmarks, article]
    }
    setBookmarks(updated)
    localStorage.setItem('newshub_bookmarks', JSON.stringify(updated))
  }

  // Filter articles based on search query
  const displayArticles = (activeTab === 'bookmarks' ? bookmarks : data).filter(article => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      (article.title && article.title.toLowerCase().includes(query)) ||
      (article.description && article.description.toLowerCase().includes(query)) ||
      (article.source && article.source.name && article.source.name.toLowerCase().includes(query))
    )
  })

  const heroArticle = displayArticles.length > 0 ? displayArticles[0] : null
  const gridArticles = displayArticles.length > 1 ? displayArticles.slice(1) : displayArticles

  return (
    <div className="newshub-app">
      {/* Breaking Ticker Banner */}
      <div className="ticker-banner">
        <div className="container d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-danger text-uppercase px-2 py-1" style={{ fontSize: '0.7rem' }}>Breaking</span>
            <marquee behavior="scroll" direction="left" scrollamount="4" style={{ color: 'var(--text-secondary)' }}>
              ⚡ Global tech & market news updated live • Next-gen AI foundation models transform enterprise workflows • Quantum computing breakthroughs announced
            </marquee>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg newshub-navbar">
        <div className="container">
          <a className="brand-logo" href="/">
            <i className="ti ti-news text-danger"></i>
            News<span>Hub</span>
          </a>

          <div className="d-flex align-items-center gap-3 ms-auto">
            {/* Search Input */}
            <div className="search-box-wrap d-none d-md-block">
              <i className="ti ti-search search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search headlines, sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Country Selector */}
            <select
              className="form-select form-select-sm"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={{
                background: 'rgba(22, 28, 44, 0.85)',
                color: '#fff',
                borderColor: 'var(--border-glass)',
                borderRadius: '20px',
                width: '100px'
              }}
            >
              <option value="in">🇮🇳 India</option>
              <option value="us">🇺🇸 USA</option>
              <option value="gb">🇬🇧 UK</option>
              <option value="au">🇦🇺 Australia</option>
            </select>

            {/* Bookmarks Toggle Button */}
            <button
              className={`btn btn-sm ${activeTab === 'bookmarks' ? 'btn-danger' : 'btn-outline-light'}`}
              onClick={() => setActiveTab(activeTab === 'feed' ? 'bookmarks' : 'feed')}
              style={{ borderRadius: '20px' }}
            >
              <i className="ti ti-bookmark me-1"></i>
              Saved ({bookmarks.length})
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="container py-4">
        {/* Category Pills */}
        <div className="category-pills-scroll mb-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`category-pill ${category === cat.id && activeTab === 'feed' ? 'active' : ''}`}
              onClick={() => {
                setCategory(cat.id)
                setActiveTab('feed')
              }}
            >
              <i className={`ti ${cat.icon}`}></i> {cat.label}
            </button>
          ))}
        </div>

        {/* Mobile Search Input */}
        <div className="d-block d-md-none mb-4">
          <div className="search-box-wrap w-100">
            <i className="ti ti-search search-icon"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Search headlines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-secondary mt-3">Fetching live top headlines...</p>
          </div>
        ) : (
          <>
            {/* Hero Article Banner (If in feed mode and articles exist) */}
            {heroArticle && activeTab === 'feed' && !searchQuery && (
              <div className="hero-story-card mb-5 p-4" onClick={() => setSelectedArticle(heroArticle)} style={{ cursor: 'pointer' }}>
                <div className="row align-items-center g-4">
                  <div className="col-lg-7">
                    <div className="position-relative overflow-hidden" style={{ borderRadius: '16px' }}>
                      <img
                        src={heroArticle.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80'}
                        alt={heroArticle.title}
                        className="hero-story-img"
                      />
                      <span className="source-badge">{heroArticle.source?.name || 'Top News'}</span>
                    </div>
                  </div>
                  <div className="col-lg-5">
                    <div className="d-flex align-items-center gap-2 mb-2 text-muted" style={{ fontSize: '0.82rem' }}>
                      <span><i className="ti ti-clock me-1"></i> {new Date(heroArticle.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span>3 min read</span>
                    </div>
                    <h2 className="mb-3" style={{ fontSize: '1.8rem', lineHeight: '1.3' }}>{heroArticle.title}</h2>
                    <p className="text-secondary mb-4" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{heroArticle.description}</p>
                    <div className="d-flex align-items-center gap-3">
                      <button className="btn btn-danger btn-sm px-4 py-2" style={{ borderRadius: '20px' }}>
                        Read Full Story <i className="ti ti-arrow-up-right ms-1"></i>
                      </button>
                      <button
                        className={`bookmark-btn-icon position-static ${bookmarks.some(b => b.title === heroArticle.title) ? 'bookmarked' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleBookmark(heroArticle)
                        }}
                      >
                        <i className={`ti ${bookmarks.some(b => b.title === heroArticle.title) ? 'ti-bookmark-filled' : 'ti-bookmark'}`}></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Articles Grid Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4>
                <i className={`ti ${activeTab === 'bookmarks' ? 'ti-bookmark text-warning' : 'ti-news text-danger'} me-2`}></i>
                {activeTab === 'bookmarks' ? 'Saved Articles' : `${category.toUpperCase()} News Grid`}
              </h4>
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                Showing {displayArticles.length} stories
              </span>
            </div>

            {/* Articles Grid */}
            {displayArticles.length === 0 ? (
              <div className="text-center py-5 card p-5" style={{ borderRadius: '20px' }}>
                <i className="ti ti-news-off text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                <h5>No stories found</h5>
                <p className="text-secondary">Try searching for a different keyword or switching categories.</p>
              </div>
            ) : (
              <div className="row g-4">
                {gridArticles.map((article, index) => {
                  const isSaved = bookmarks.some(b => b.title === article.title)
                  return (
                    <div key={index} className="col-md-6 col-lg-4">
                      <div className="news-card" onClick={() => setSelectedArticle(article)} style={{ cursor: 'pointer' }}>
                        <div className="card-img-wrap">
                          <img
                            src={article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80'}
                            alt={article.title}
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80'
                            }}
                          />
                          <span className="source-badge">{article.source?.name || 'News'}</span>
                          <button
                            className={`bookmark-btn-icon ${isSaved ? 'bookmarked' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleBookmark(article)
                            }}
                          >
                            <i className={`ti ${isSaved ? 'ti-bookmark-filled' : 'ti-bookmark'}`}></i>
                          </button>
                        </div>

                        <div className="news-card-body">
                          <h5 className="news-card-title">{article.title}</h5>
                          <p className="news-card-desc">{article.description || 'No description available for this story.'}</p>
                          <div className="news-card-meta">
                            <span><i className="ti ti-user me-1"></i> {article.author ? article.author.slice(0, 18) : 'News Desk'}</span>
                            <span>{new Date(article.publishedAt || Date.now()).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Reader View */}
      {selectedArticle && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <span className="badge bg-danger me-2">{selectedArticle.source?.name || 'Article'}</span>
                <h5 className="modal-title me-auto">{selectedArticle.title}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedArticle(null)}></button>
              </div>
              <div className="modal-body">
                {selectedArticle.urlToImage && (
                  <img
                    src={selectedArticle.urlToImage}
                    alt={selectedArticle.title}
                    className="img-fluid w-100 mb-4"
                    style={{ borderRadius: '16px', maxHeight: '350px', objectFit: 'cover' }}
                  />
                )}
                <p className="lead" style={{ color: 'var(--text-primary)' }}>{selectedArticle.description}</p>
                <p className="text-secondary" style={{ lineHeight: '1.7' }}>
                  {selectedArticle.content || 'Full story content is available directly at the publisher web portal. Click below to view original coverage.'}
                </p>
                <div className="d-flex align-items-center gap-3 text-muted mt-4 pt-3 border-top" style={{ borderColor: 'var(--border-glass)', fontSize: '0.85rem' }}>
                  <span><i className="ti ti-user me-1"></i> {selectedArticle.author || 'Editorial Team'}</span>
                  <span>•</span>
                  <span><i className="ti ti-calendar me-1"></i> {new Date(selectedArticle.publishedAt || Date.now()).toLocaleString()}</span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSelectedArticle(null)}>
                  Close
                </button>
                <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer" className="btn btn-danger btn-sm">
                  Visit Full Article <i className="ti ti-external-link ms-1"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home