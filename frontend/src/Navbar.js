import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleNavClick = (route) => {
    navigate(route);
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setNavbarVisible(false);
      } else {
        setNavbarVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""} ${navbarVisible ? "visible" : "hidden"}`}>
     <div className="logo" onClick={() => handleNavClick("/")}>
      {/* ✅ FIXED IMAGE PATH: Agar 'logo.png' lagana hai to niche wala use karein */}
      <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="Logo" />
      
      {/* (Agar aap janbujh kar prosoft-bg.jpg hi lagana chahte hain to ye use karein):
      <img src={`${process.env.PUBLIC_URL}/images/prosoft-bg.jpg`} alt="Logo" /> */}
        <h1>Prosoft Hub</h1>
      </div>

      <div className={`hamburger ${menuOpen ? "active" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li onClick={() => handleNavClick("/")}>Home</li>
        <li onClick={() => handleNavClick("/about")}>About</li>
        <li onClick={() => handleNavClick("/events")}>Events</li>
        <li onClick={() => handleNavClick("/membership")}>Membership</li>
        <li onClick={() => handleNavClick("/gallery")}>Gallery</li>
        <li onClick={() => handleNavClick("/signin")}>Sign In</li>
        <li onClick={() => handleNavClick("/signup")}>Sign Up</li>
      </ul>
    </nav>
  );
}

export default Navbar;
