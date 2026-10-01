import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
    window.scrollTo(0, 0);          // 滾動到最上方
    }, [pathname]);

    return null;
}

export default ScrollToTop;