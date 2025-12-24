import { useState, useEffect, useCallback } from "react";
import useLocalStorage from "./useLocalStorage";

type Theme = "light" | "dark";

function useTheme(): [Theme, () => void] {
  const [storedTheme, setStoredTheme] = useLocalStorage<Theme>("taskflow-theme", "dark");
  const [theme, setTheme] = useState<Theme>(storedTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    setStoredTheme(theme);
  }, [theme, setStoredTheme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return [theme, toggleTheme];
}

export default useTheme;
