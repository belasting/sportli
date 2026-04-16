import React, { createContext, useContext, useState, useMemo } from 'react';
import { Colors } from '../theme/colors';
import { DarkColors } from '../theme/darkColors';

// Ensure both colour objects have identical shape
type ColorsType = typeof Colors;

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ColorsType;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  colors: Colors,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const value = useMemo<ThemeContextType>(
    () => ({
      isDark,
      toggleTheme: () => setIsDark((d) => !d),
      colors: isDark ? (DarkColors as unknown as ColorsType) : Colors,
    }),
    [isDark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/** Full theme context — isDark, toggleTheme, colors */
export const useTheme = () => useContext(ThemeContext);

/** Just the colours — drop-in replacement for the static Colors import */
export const useColors = () => useContext(ThemeContext).colors;
