import React, { useEffect } from "react";
import Footer from "./Footer";
import "./About.css";

function About() {

  // Intersection Observer for vision animation
  useEffect(() => {
    const rows = document.querySelectorAll(".vision-row");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          } else {
            entry.target.classList.remove("active");
          }
        });
      },
      { threshold: 0.5 }
    );
    rows.forEach((row) => observer.observe(row));
    return () => rows.forEach((row) => observer.unobserve(row));
  }, []);

  return (
    <div className="about-page">

      {/* Intro Section */}
<div className="about-intro">
  <h2>About Prosoft Hub</h2>
  <p>
    Welcome to <span>Prosoft Hub</span>! We are a vibrant student community focused on 
    technology, innovation, and creative learning. Our mission is to empower students 
    with hands-on workshops, projects, and events to develop real-world skills in software 
    development, design, and networking.
  </p>
  <div className="intro-decor"></div>
</div>


      {/* Vision Section */}
      <div className="vision-section">
        <h2>Our Vision</h2>
        <div className="vision-container">
          <div className="vision-row">
            <img src="/images/github-workshop.png" alt="GitHub Workshop" />
            <div className="vision-text">
              <p>We conducted a GitHub workshop to teach version control and collaboration skills.
                 Learn how to use GitHub for version control, collaborate on projects, track changes, and 
                 contribute to real-world software development workflows.</p>
            </div>
          </div>
          <div className="vision-row">
            <img src="/images/figma-workshop.png" alt="Figma Workshop" />
            <div className="vision-text">
              <p>Figma workshop helped members improve UI/UX design skills and prototype applications.
                 Interactive session covering Figma basics, mockup creation, and design best practices 
                 for building professional user interfaces.</p>
            </div>
          </div>
          <div className="vision-row">
            <img src="/images/hcipak-workshop.png" alt="HCIPAK Workshop" />
            <div className="vision-text">
              <p>HCIPAK workshop focused on networking and cybersecurity knowledge for students.
                 Hands-on workshop focused on networking and IT fundamentals, exploring Cisco
                 technologies and practical configurations to enhance real-world networking skills.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="video-section">
        <h2>Watch Our Introduction Video</h2>
        <video 
          controls 
          style={{
            width: '90%',
            maxWidth: '900px',
            borderRadius: '15px',
            display: 'block',
            margin: '0 auto'
          }}
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Team Hierarchy Section */}
      <div className="team-section">
        <h2>Team Hierarchy</h2>
        <div className="team-image-container">
          <img src="/images/team-hierarchy.png" alt="Team Hierarchy" />
        </div>
      </div>
           <Footer />

    </div>
  );
}

export default About;
