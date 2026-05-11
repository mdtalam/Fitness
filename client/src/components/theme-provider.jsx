import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/services/api";

const accents = {
    lime: { primary: "#aff200", foreground: "#000000" },
    blue: { primary: "#3b82f6", foreground: "#ffffff" },
    rose: { primary: "#f43f5e", foreground: "#ffffff" },
    amber: { primary: "#f59e0b", foreground: "#000000" },
    violet: { primary: "#8b5cf6", foreground: "#ffffff" },
    cyan: { primary: "#06b6d4", foreground: "#000000" },
};

const navbarStyles = {
    default: "hsl(var(--background) / 0.8)",
    primary: "var(--primary)",
    glass: "transparent",
    dark: "#000000",
    indigo: "#1e1b4b",
};

const ThemeProviderContext = createContext({
    theme: "system",
    setTheme: () => null,
    accent: "lime",
    setAccent: () => null,
    navbarColor: "default",
    setNavbarColor: () => null,
    availableAccents: Object.keys(accents),
    availableNavbarColors: Object.keys(navbarStyles),
});

export function ThemeProvider({
    children,
    defaultTheme = "system",
    defaultAccent = "lime",
    defaultNavbarColor = "default",
    storageKey = "vite-ui-theme",
    accentKey = "vite-ui-accent",
    navbarKey = "vite-ui-navbar",
    ...props
}) {
    const { user } = useAuth();
    const [theme, setTheme] = useState(
        () => localStorage.getItem(storageKey) || defaultTheme
    );
    const [accent, setAccent] = useState(
        () => localStorage.getItem(accentKey) || defaultAccent
    );
    const [navbarColor, setNavbarColor] = useState(
        () => localStorage.getItem(navbarKey) || defaultNavbarColor
    );

    // Sync with user preferences from DB on load
    useEffect(() => {
        if (user?.theme) {
            setTheme(user.theme);
            localStorage.setItem(storageKey, user.theme);
        }
        if (user?.accentColor) {
            setAccent(user.accentColor);
            localStorage.setItem(accentKey, user.accentColor);
        }
        if (user?.navbarColor) {
            setNavbarColor(user.navbarColor);
            localStorage.setItem(navbarKey, user.navbarColor);
        }
    }, [user?.id]); // Only run when user changes or loads

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light";

            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }

        // Apply accent color
        const accentData = accents[accent] || accents.lime;
        root.style.setProperty("--primary", accentData.primary);
        root.style.setProperty("--primary-foreground", accentData.foreground);
        root.style.setProperty("--ring", accentData.primary);
        root.style.setProperty("--chart-1", accentData.primary);

        // Apply Navbar color
        const navStyle = navbarStyles[navbarColor] || navbarStyles.default;
        root.style.setProperty("--navbar-bg", navStyle);

    }, [theme, accent, navbarColor]);

    const value = {
        theme,
        setTheme: async (theme) => {
            localStorage.setItem(storageKey, theme);
            setTheme(theme);
            if (user) {
                try {
                    await api.put('/users/preferences', { theme });
                } catch (error) {
                    console.error('Failed to sync theme to DB', error);
                }
            }
        },
        accent,
        setAccent: async (accent) => {
            localStorage.setItem(accentKey, accent);
            setAccent(accent);
            if (user) {
                try {
                    await api.put('/users/preferences', { accentColor: accent });
                } catch (error) {
                    console.error('Failed to sync accent to DB', error);
                }
            }
        },
        navbarColor,
        setNavbarColor: async (color) => {
            localStorage.setItem(navbarKey, color);
            setNavbarColor(color);
            if (user) {
                try {
                    await api.put('/users/preferences', { navbarColor: color });
                } catch (error) {
                    console.error('Failed to sync navbar color to DB', error);
                }
            }
        },
        availableAccents: Object.keys(accents),
        availableNavbarColors: Object.keys(navbarStyles),
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider");

    return context;
};
