import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

const FALLBACK_NEWS = [
  {
    source: { name: 'Reuters' },
    author: 'Reuters News',
    title: 'Global Semiconductor Supply Chains Expand with New Manufacturing Hubs',
    description: 'Major technology manufacturers and governments announce international partnerships to diversify microchip production facilities.',
    url: 'https://www.reuters.com',
    urlToImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    content: 'International investments in semiconductor fabrication facilities aim to strengthen supply chain resilience and support growing demand.'
  },
  {
    source: { name: 'Associated Press' },
    author: 'AP Markets',
    title: 'Renewable Energy Investments Reach New Benchmark Across Global Markets',
    description: 'Utility-scale solar and wind projects continue to expand rapidly as international power grids transition to clean energy sources.',
    url: 'https://apnews.com',
    urlToImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80',
    publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    content: 'Capital investments in renewable energy infrastructure outpaced expectations this quarter, driven by technological efficiencies.'
  },
  {
    source: { name: 'BBC News' },
    author: 'Science & Environment',
    title: 'International Space Agencies Collaborate on Lunar Exploration Missions',
    description: 'Joint scientific teams prepare robotic probes and orbiters to analyze lunar south pole water ice deposits and terrain.',
    url: 'https://www.bbc.com',
    urlToImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    content: 'Space agencies have finalized mission architectures for upcoming scientific payloads designed to study lunar geology and resources.'
  },
  {
    source: { name: 'Bloomberg' },
    author: 'Global Economy Desk',
    title: 'Global Trade Agreements Focus on Sustainable Logistics and Digital Commerce',
    description: 'Commercial corridors and ports integrate automated tracking and streamlined customs protocols to lower cross-border transit times.',
    url: 'https://www.bloomberg.com',
    urlToImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    publishedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    content: 'Modernized customs and port infrastructure are enhancing efficiency for maritime shipping routes and supply networks.'
  },
  {
    source: { name: 'Financial Times' },
    author: 'Industry Report',
    title: 'Electric Mobility and Battery Innovations Drive Automotive Sector Growth',
    description: 'Automakers introduce next-generation charging architectures and higher energy-density platforms for commercial and consumer vehicles.',
    url: 'https://www.ft.com',
    urlToImage: 'https://images.unsplash.com/photo-1558441719-443b38605ad4?auto=format&fit=crop&w=800&q=80',
    publishedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    content: 'High-voltage charging architectures and advancements in battery chemistries are supporting widespread commercial fleet adoption.'
  },
  {
    source: { name: 'TechCrunch' },
    author: 'Enterprise Tech',
    title: 'High-Speed Fiber and Satellite Networks Expand Global Broadband Access',
    description: 'Telecommunications operators deploy expanded low-Earth orbit satellite constellations alongside terrestrial fiber infrastructure.',
    url: 'https://techcrunch.com',
    urlToImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    publishedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    content: 'Hybrid satellite and fiber broadband rollouts bring low-latency connectivity to previously underserved regional hubs.'
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

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const url = `https://saurav.tech/NewsAPI/top-headlines/category/${category}/${country}.json`
      const response = await axios.get(url)
      
      if (response.data && response.data.articles && response.data.articles.length > 0) {
        // Filter out removed articles
        const valid = response.data.articles.filter(a => a.title && a.title !== '[Removed]')
        setData(valid.length > 0 ? valid : FALLBACK_NEWS)
      } else {
        setData(FALLBACK_NEWS)
      }
    } catch (error) {
      console.warn('Live news fetch error, loading curated feeds:', error)
      setData(FALLBACK_NEWS)
    } finally {
      setLoading(false)
    }
  }, [category, country])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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
          <div className="d-flex align-items-center gap-2 overflow-hidden" style={{ whiteSpace: 'nowrap' }}>
            <span className="badge bg-danger text-uppercase px-2 py-1" style={{ fontSize: '0.7rem' }}>Breaking</span>
            <span className="ticker-text-marquee" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              {data && data.length > 0
                ? data.slice(0, 6).map(item => item.title).filter(Boolean).join('   •   ')
                : 'Top headlines and breaking news updates'}
            </span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg newshub-navbar">
        <div className="container">
          <a className="brand-logo" href="#/">
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
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80'
                        }}
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
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80'
                    }}
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