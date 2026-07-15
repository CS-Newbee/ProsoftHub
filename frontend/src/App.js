import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import { useNavigate } from 'react-router-dom';
import "./App.css";



// Slider Images (Exact extensions from your public folder)
const sliderImages = [
  `${process.env.PUBLIC_URL}/images/image.jpg`,
  `${process.env.PUBLIC_URL}/images/1image.jpg`,
  `${process.env.PUBLIC_URL}/images/2image.jpg`,
  `${process.env.PUBLIC_URL}/images/3image.jpg`
];

function App() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const scrollToModules = () => {
    const section = document.querySelector(".modules-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openModal = (team) => {
    setSelectedTeam(team);
  };

  const closeModal = () => {
    setSelectedTeam(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const moduleItems = document.querySelectorAll(".module-item");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("active");
            }, idx * 150);
          } else {
            entry.target.classList.remove("active");
          }
        });
      },
      { threshold: 0.3 }
    );
    moduleItems.forEach((item) => observer.observe(item));
    return () => moduleItems.forEach((item) => observer.unobserve(item));
  }, []);

  useEffect(() => {
    const statItems = document.querySelectorAll(".stat-item");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("active");
            }, idx * 200);
          }
        });
      },
      { threshold: 0.5 }
    );
    statItems.forEach((item) => observer.observe(item));
    return () => statItems.forEach((item) => observer.unobserve(item));
  }, []);

  // Modules & Members Array perfectly mapped with your exact filenames and extensions
  const modules = [
    { 
      title: "Technicians", 
      img: "techtitans.jpg",
      members: [
        { name: "Wafa Abbas", role: "Lead Developer", image: "wafa.JPG", social: { instagram: "#", linkedin: "#", github: "#" } },
        { name: "Ahsan Zaman", role: "Backend Developer", image: "avatar2.avif", social: { instagram: "#", linkedin: "#", github: "#" } }, // placeholder template image
        { name: "Roman Fatima", role: "Frontend Developer", image: "roman .jpeg", social: { instagram: "#", linkedin: "#", github: "#" } } // Notice the exact space in filename
      ]
    },
    { 
      title: "Design Forge", 
      img: "Designer-UI.jpg",
      members: [
        { name: "Muhammad Abdullah", role: "UI/UX Lead", image: "avatarmale.jpg", social: { instagram: "#", linkedin: "#", behance: "#" } },
        { name: "Ali Khan", role: "Graphic Designer", image: "avatar2.avif", social: { instagram: "#", linkedin: "#", behance: "#" } },
        { name: "Rejab Zahra", role: "Visual Designer", image: "avatarfemale.avif", social: { instagram: "#", linkedin: "#", behance: "#" } }
      ]
    },
    { 
      title: "Creative Studio", 
      img: "CreativeStudio.jpg",
      members: [
        { name: "Roha Ejaz", role: "Content Head", image: "Avatar.avif", social: { instagram: "#", linkedin: "#", twitter: "#" } },
        { name: "Asma Fatima", role: "Content Writer", image: "avatarfemale.avif", social: { instagram: "#", linkedin: "#", twitter: "#" } },
        { name: "Aden Butt", role: "Creative Designer", image: "aden.JPG", social: { instagram: "#", linkedin: "#", twitter: "#" } }
      ]
    },
    { 
      title: "Event Architects", 
      img: "EventArchitects.jpg",
      members: [
        { name: "Aqib Ali", role: "Event Manager", image: "aqib.jpeg", social: { instagram: "#", linkedin: "#", facebook: "#" } },
        { name: "Muhammad Shehryar", role: "Event Coordinator", image: "moiz.jpeg", social: { instagram: "#", linkedin: "#", facebook: "#" } },
        { name: "Urwa Munawar", role: "Event Planner", image: "urwa.jpeg", social: { instagram: "#", linkedin: "#", facebook: "#" } }
      ]
    },
    { 
      title: "Media Mavericks", 
      img: "Media.jpg",
      members: [
        { name: "Abdul Rehman", role: "Social Media Lead", image: "avatarmale.jpg", social: { instagram: "#", linkedin: "#", twitter: "#" } },
        { name: "Muhammad Zaman", role: "Content Manager", image: "avatar2.avif", social: { instagram: "#", linkedin: "#", twitter: "#" } },
        { name: "Rimsha Jannat", role: "Digital Marketer", image: "rimsha.jpeg", social: { instagram: "#", linkedin: "#", twitter: "#" } }
      ]
    },
  ];

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">
          <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="Prosoft Hub Logo" className="logo-image" />
          <h1>Prosoft Hub</h1>
        </div>
        <ul className="nav-links">
          <li onClick={() => navigate('/')}>Home</li>
          <li onClick={() => navigate('/about')}>About</li>  
          <li onClick={() => navigate('/events')}>Events</li>
          <li onClick={() => navigate('/membership')}>Membership</li>
          <li onClick={() => navigate('/gallery')}>Gallery</li>
          <li onClick={() => navigate('/signin')}>Sign In</li>
          <li onClick={() => navigate('/signup')}>Sign Up</li>
        </ul>
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <div
          className="hero-image"
          style={{
            backgroundImage: `url(${sliderImages[index]})`,
            transition: "background-image 1s ease-in-out",
          }}
        >
          <div className="overlay">
            <h2>Explore Prosoft Hub 🌟</h2>
            <p>"Experience creativity and technology like never before."</p>
            <button className="prosoft-btn" onClick={scrollToModules}>Discover Now</button>
          </div>
        </div>
      </div>

      {/* Modules Section */}
      <div className="modules-section">
        <h2>Meet Our Teams</h2>
        <p className="modules-subtitle">Discover the talented people behind Prosoft Hub</p>
        <div className="modules-row">
          {modules.map((module, idx) => (
            <div className="module-item" key={idx}>
              <div className="module-circle">
                <img 
                  src={`${process.env.PUBLIC_URL}/images/${module.img}`} 
                  alt={module.title} 
                  onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Prosoft+Team"; }} 
                />
              </div>
              <div className="module-title">{module.title}</div>
              <button className="small-btn" onClick={() => openModal(module)}>View Details</button>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <h2>Our Achievements</h2>
        <p className="stats-subtitle">Making a difference in the tech community</p>
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-icon">👥</div>
            <div className="stat-number">500+</div>
            <div className="stat-label">Active Members</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🎉</div>
            <div className="stat-number">50+</div>
            <div className="stat-label">Events Organized</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🎓</div>
            <div className="stat-number">30+</div>
            <div className="stat-label">Workshops Conducted</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🏆</div>
            <div className="stat-number">15+</div>
            <div className="stat-label">Awards Won</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Join Prosoft Hub Today! 🚀</h2>
          <p className="cta-subtitle">Be part of the most innovative tech community</p>
          <div className="cta-benefits">
            <div className="benefit-item"><span>✨</span> <span>Access to exclusive workshops</span></div>
            <div className="benefit-item"><span>🤝</span> <span>Network with industry professionals</span></div>
            <div className="benefit-item"><span>📚</span> <span>Learn cutting-edge technologies</span></div>
            <div className="benefit-item"><span>🎯</span> <span>Build your portfolio with real projects</span></div>
          </div>
          <button className="cta-button" onClick={() => navigate('/signup')}>Join Now - It's Free! 🎉</button>
          <p className="cta-note">Already a member? <span onClick={() => navigate('/signin')} className="signin-link">Sign In</span></p>
        </div>
      </div>

      {/* Team Modal */}
      {selectedTeam && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-content-close" style={{position: "absolute", right: "20px", top: "10px", fontSize: "30px", background: "none", border: "none", cursor: "pointer", color: "#000"}} onClick={closeModal}>×</button>
            <h2 className="modal-title">{selectedTeam.title} Team</h2>
            <div className="team-members-grid">
              {selectedTeam.members.map((member, idx) => (
                <div className="member-card" key={idx}>
                  <div className="member-image">
                    {/* SAFE DYNAMIC PATH FOR MEMEBER IMAGES */}
                    <img 
                      src={`${process.env.PUBLIC_URL}/images/${member.image}`} 
                      alt={member.name} 
                      onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Prosoft+Member"; }}
                    />
                  </div>
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <div className="member-socials">
                    {member.social.instagram && <a href={member.social.instagram} target="_blank" rel="noopener noreferrer"><i className="social-icon">📷</i></a>}
                    {member.social.linkedin && <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer"><i className="social-icon">💼</i></a>}
                    {member.social.github && <a href={member.social.github} target="_blank" rel="noopener noreferrer"><i className="social-icon">💻</i></a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <div className="contact-section">
        <p className="contact-label">CONTACT US</p>
        <h2>Get in Touch</h2>
        <div className="contact-container">
          <div className="contact-info">
            <h3>Send us a message 📧</h3>
            <p className="contact-description">
              Feel free to reach out through contact form or find our contact information below.
            </p>
            <div className="contact-details">
              <div className="contact-item"><span>📧</span> <span>prosoft@university.edu</span></div>
              <div className="contact-item"><span>📞</span> <span>+92 123-456-7890</span></div>
              <div className="contact-item"><span>📍</span> <span>University Campus, Gujranwala, Punjab, Pakistan</span></div>
            </div>
          </div>
          <div className="contact-form">
            <div className="form-group"><label>Your name</label><input type="text" placeholder="Enter your name" /></div>
            <div className="form-group"><label>Phone Number</label><input type="tel" placeholder="Enter your mobile number" /></div>
            <div className="form-group"><label>Write your messages here</label><textarea placeholder="Enter your message" rows="5"></textarea></div>
            <button className="submit-btn">Submit now →</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;