import { useEffect } from "react";
import { useLocation } from "react-router"; // usa "react-router" invece di "react-router-dom"

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export { ScrollToTop };
