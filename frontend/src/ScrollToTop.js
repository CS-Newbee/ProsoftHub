import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Agar URL mein hash (#) nahi hai, toh top par scroll karo
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;