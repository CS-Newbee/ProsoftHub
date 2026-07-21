import React, { useState, useEffect } from "react";
import "./Gallery.css";

const BACKEND_URL = process.env.REACT_APP_API_URL || "https://prosofthub-production.up.railway.app";

const categories = [
  { key: "Upcoming Events", icon: "🚀" },
  { key: "Previous Events", icon: "🎉" },
  { key: "Community / Member Highlights", icon: "🌟" },
  { key: "Workshops", icon: "🛠️" },
];

// Fallback Sample Images (Fixed absolute path logic for local and deployed environments)
const sampleImages = {
  "Upcoming Events": [
    { id: 101, url: "/images/events.png" },
    { id: 102, url: "/images/1image.jpg" }
  ],
  "Previous Events": [
    { id: 201, url: "/images/2image.jpg" },
    { id: 202, url: "/images/3image.jpg" },
    { id: 203, url: "/images/4image.jpg" }
  ],
  "Community / Member Highlights": [
    { id: 301, url: "/images/team-hierarchy.png" },
    { id: 302, url: "/images/gallery.png" },
    { id: 303, url: "FACEBOOK_VIDEO_EMBED", isVideo: true } 
  ],
  "Workshops": [
    { id: 401, url: "/images/figma-workshop.png" },
    { id: 402, url: "/images/github-workshop.png" },
    { id: 403, url: "/images/hcipak-workshop.png" }
  ]
};

const Gallery = () => {
  const [gallery, setGallery] = useState({
    "Upcoming Events": [],
    "Previous Events": [],
    "Community / Member Highlights": [],
    Workshops: [],
  });

  const [selectedCategory, setSelectedCategory] = useState("Upcoming Events");
  const [lightbox, setLightbox] = useState(null); // { url, index }
  const [loaded, setLoaded] = useState(false);

  /* ── Load from backend, fallback to localStorage/Sample Images ── */
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/gallery`);
        if (res.ok) {
          const data = await res.json();
          if (data && data["Upcoming Events"]) {
            // Ensure video card persists when backend loads
            if (data["Community / Member Highlights"] && !data["Community / Member Highlights"].some(img => img.isVideo)) {
              data["Community / Member Highlights"].push({ id: 303, url: "FACEBOOK_VIDEO_EMBED", isVideo: true });
            }
            setGallery(data);
            localStorage.setItem("galleryData", JSON.stringify(data));
          } else {
            throw new Error();
          }
        } else throw new Error();
      } catch {
        const saved = localStorage.getItem("galleryData");
        if (saved) {
          setGallery(JSON.parse(saved));
        } else {
          setGallery(sampleImages);
        }
      } finally {
        setLoaded(true);
      }
    };
    fetchGallery();
  }, []);

  /* ── Lightbox keyboard nav ── */
  useEffect(() => {
    if (!lightbox) return;
    const imgs = (gallery[selectedCategory] || []).filter(img => !img.isVideo);
    if (imgs.length === 0) return;
    
    const handler = (e) => {
      if (e.key === "ArrowRight")
        setLightbox({ url: imgs[(lightbox.index + 1) % imgs.length].url, index: (lightbox.index + 1) % imgs.length });
      if (e.key === "ArrowLeft")
        setLightbox({ url: imgs[(lightbox.index - 1 + imgs.length) % imgs.length].url, index: (lightbox.index - 1 + imgs.length) % imgs.length });
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, gallery, selectedCategory]);

  const currentImages = gallery[selectedCategory] || [];
  
  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = "auto";
    }
  }, [lightbox]);

  return (
    <div className={`gallery-page ${loaded ? "gallery-loaded" : ""}`}>
      {/* ── Hero ── */}
      <div className="gallery-hero">
        <div className="gallery-hero-bg" />
        <div className="gallery-hero-content">
          <span className="gallery-eyebrow">Prosoft Hub</span>
          
          {/* 🌟 INLINE OVERRIDES REMOVED TAAKE CSS GRADIENT AUR ANIMATION PHATKE CHALEIN */}
       <h1 className="gallery-title">
             <span className="gallery-title-accent">Our Gallery</span>
       </h1>
          
          <p className="gallery-subtitle">
            Moments captured, memories preserved — explore our events and community highlights.
          </p>
        </div>
        <div className="gallery-hero-orb orb1" />
        <div className="gallery-hero-orb orb2" />
        <div className="gallery-hero-orb orb3" />
      </div>

      {/* ── Category Tabs ── */}
      <div className="gallery-tabs-wrapper">
        <div className="gallery-tabs">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`gallery-tab ${selectedCategory === cat.key ? "gallery-tab-active" : ""}`}
              onClick={() => setSelectedCategory(cat.key)}
            >
              <span className="tab-icon">{cat.icon}</span>
              <span className="tab-label">{cat.key}</span>
              <span className="tab-count">
                {gallery[cat.key]?.length || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="gallery-grid-section">
        {!loaded ? (
          <div className="gallery-loading">
            <div className="loading-spinner" />
            <p>Loading gallery...</p>
          </div>
        ) : currentImages.length === 0 ? (
          <div className="gallery-empty">
            <div className="empty-icon">🖼️</div>
            <h3>No images yet</h3>
            <p>Images will appear here once the advisor adds them.</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {currentImages.map((img, idx) => {
              if (img.isVideo) {
                return (
                  <div key={img.id || idx} className="gallery-card video-card">
                    <div className="gallery-card-inner" style={{ background: "rgba(0, 45, 98, 0.6)", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", border: "1px dashed #38bdf8" }}>
                      <div style={{ height: "180px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "50px", background: "#0f62ac" }}>
                        🎬
                      </div>
                      <div style={{ padding: "15px", textAlign: "center", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <h4 style={{ margin: "0 0 10px 0", fontSize: "0.95rem", color: "#fff" }}>Official Prosoft Event Highlights</h4>
                        <a 
                          href="https://www.facebook.com/share/v/14f2J3CPqS5/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ display: "block", background: "#38bdf8", color: "#002d62", padding: "8px 12px", borderRadius: "6px", fontWeight: "bold", textDecoration: "none", fontSize: "0.85rem" }}
                        >
                          Watch Video on Facebook ↗
                        </a>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={img.id || idx}
                  className="gallery-card"
                  style={{ animationDelay: `${idx * 0.07}s` }}
                  onClick={() => {
                    const nonVideoImgs = currentImages.filter(i => !i.isVideo);
                    const realIdx = nonVideoImgs.findIndex(i => i.id === img.id);
                    setLightbox({ url: img.url, index: realIdx >= 0 ? realIdx : 0 });
                  }}
                >
                  <div className="gallery-card-inner">
                    <img
                      src={img.url}
                      alt={`gallery-${idx}`}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                      }}
                    />
                    <div className="gallery-card-overlay">
                      <span className="card-zoom-icon">🔍</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Image count badge */}
        {currentImages.length > 0 && (
          <div className="gallery-count-badge">
            {currentImages.length} item{currentImages.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="lightbox-overlay"
          onClick={(e) => {
            if (e.target.classList.contains("lightbox-overlay")) {
              setLightbox(null);
            }
          }}
        >
          <div className="lightbox-box" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
            <button
              className="lightbox-arrow lightbox-prev"
              onClick={() => {
                const imgs = gallery[selectedCategory].filter(i => !i.isVideo);
                const prev = (lightbox.index - 1 + imgs.length) % imgs.length;
                setLightbox({ url: imgs[prev].url, index: prev });
              }}
            >‹</button>
            <img src={lightbox.url} alt="lightbox"
              onError={(e) => { e.target.src = "https://via.placeholder.com/800x600?text=Not+Found"; }} />
            <button
              className="lightbox-arrow lightbox-next"
              onClick={() => {
                const imgs = gallery[selectedCategory].filter(i => !i.isVideo);
                const next = (lightbox.index + 1) % imgs.length;
                setLightbox({ url: imgs[next].url, index: next });
              }}
            >›</button>
            <div className="lightbox-counter">
              {lightbox.index + 1} / {gallery[selectedCategory].filter(i => !i.isVideo).length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;