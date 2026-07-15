import React, { useState, useEffect } from "react";
import "./ManageGallery.css";

const BACKEND_URL = "http://localhost:5000";

const ManageGallery = () => {
  const categories = [
    "Upcoming Events",
    "Previous Events",
    "Community / Member Highlights",
    "Workshops",
  ];

  const [gallery, setGallery] = useState({
    "Upcoming Events": [],
    "Previous Events": [],
    "Community / Member Highlights": [],
    Workshops: [],
  });

  const [selectedCategory, setSelectedCategory] = useState("Upcoming Events");
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 5000);
  };

  useEffect(() => {
    const fetchGalleryFromBackend = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/gallery`);
        if (res.ok) {
          const data = await res.json();
          setGallery(data);
          localStorage.setItem("galleryData", JSON.stringify(data));
          console.log("✅ Gallery loaded from backend");
        } else {
          throw new Error("Backend fetch failed");
        }
      } catch (err) {
        console.log("⚠️ Using offline mode");
        const savedGallery = localStorage.getItem("galleryData");
        if (savedGallery) {
          setGallery(JSON.parse(savedGallery));
        }
      }
    };

    fetchGalleryFromBackend();
  }, []);

  const isValidImageURL = (url) => /^https?:\/\/.+/i.test(url);

  const handleAddImage = async () => {
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      if (!imageURL.trim()) {
        showError("Please enter an image URL");
        setLoading(false);
        return;
      }

      if (!isValidImageURL(imageURL)) {
        showError("Invalid image URL. Must start with http:// or https://");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/api/gallery/add-url`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            category: selectedCategory, 
            imageUrl: imageURL 
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const newImage = { id: data.id, url: imageURL };

          setGallery((prev) => {
            const updated = {
              ...prev,
              [selectedCategory]: [...prev[selectedCategory], newImage],
            };
            localStorage.setItem("galleryData", JSON.stringify(updated));
            return updated;
          });

          setImageURL("");
          showSuccess("✅ Image added successfully!");
          setLoading(false);
          return;
        }
      } catch (backendError) {
        console.log("⚠️ Backend unavailable, saving locally");
      }

      const localId = Date.now();
      setGallery((prev) => {
        const updated = {
          ...prev,
          [selectedCategory]: [
            ...prev[selectedCategory],
            { id: localId, url: imageURL },
          ],
        };
        localStorage.setItem("galleryData", JSON.stringify(updated));
        return updated;
      });

      setImageURL("");
      showSuccess("✅ Image added!");

    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    setError("");
    setSuccessMessage("");

    setGallery((prev) => {
      const updated = {
        ...prev,
        [selectedCategory]: prev[selectedCategory].filter((img) => img.id !== id),
      };
      localStorage.setItem("galleryData", JSON.stringify(updated));
      return updated;
    });

    try {
      await fetch(`${BACKEND_URL}/api/gallery/${id}`, { 
        method: "DELETE" 
      });
      console.log("✅ Deleted from backend, ID:", id);
    } catch (err) {
      console.log("⚠️ Backend delete skipped (offline mode)");
    }

    showSuccess("✅ Image deleted!");
  };

  const handleClearCategory = async () => {
    if (!window.confirm(`Clear all images from "${selectedCategory}"?`)) return;

    setError("");
    setSuccessMessage("");

    setGallery((prev) => {
      const updated = { ...prev, [selectedCategory]: [] };
      localStorage.setItem("galleryData", JSON.stringify(updated));
      return updated;
    });

    try {
      await fetch(
        `${BACKEND_URL}/api/gallery/category/${encodeURIComponent(selectedCategory)}`,
        { method: "DELETE" }
      );
      console.log("✅ Category cleared from backend");
    } catch (err) {
      console.log("⚠️ Backend clear skipped (offline mode)");
    }

    showSuccess(`✅ All images cleared!`);
  };

  return (
    // FIXED BACKGROUND STYLING APPLIED HERE TO MATCH THE ADVISOR DASHBOARD BLUE
    <div className="manage-gallery" style={{
      background: "linear-gradient(135deg, #0f62ac 0%, #002d62 100%)",
      minHeight: "100vh",
      color: "white",
      padding: "30px"
    }}>
      <h1 style={{ color: "white", marginBottom: "20px" }}>Manage Gallery</h1>

      <div className="category-select">
        {categories.map((cat) => (
          <button
            key={cat}
            className={selectedCategory === cat ? "active" : ""}
            onClick={() => {
              setSelectedCategory(cat);
              setError("");
              setSuccessMessage("");
            }}
          >
            {cat} <span>({gallery[cat].length})</span>
          </button>
        ))}
      </div>

      <div className="add-image">
        <input
          type="text"
          placeholder={`Enter ${selectedCategory} Image URL`}
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddImage()}
          disabled={loading}
        />
        <button onClick={handleAddImage} disabled={loading}>
          {loading ? "Adding..." : "Add Image"}
        </button>

        {gallery[selectedCategory].length > 0 && (
          <button className="clear-btn" onClick={handleClearCategory}>
            Clear All
          </button>
        )}
      </div>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="gallery-images">
        {gallery[selectedCategory].length === 0 ? (
          <p style={{ color: "#e0e0e0" }}>No images added yet in this category</p>
        ) : (
          gallery[selectedCategory].map((img) => (
            <div key={img.id} className="image-card">
              <img
                src={img.url}
                alt="gallery"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
                }}
              />
              <button
                className="delete-btn"
                onClick={() => handleDeleteImage(img.id)}
                title="Delete this image"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <div className="image-count" style={{ marginTop: "20px", color: "#cbd5e1" }}>
        Total Images in {selectedCategory}: {gallery[selectedCategory].length}
      </div>
    </div>
  );
};

export default ManageGallery;