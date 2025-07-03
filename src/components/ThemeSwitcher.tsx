import React, { useState } from 'react';
import './ThemeSwitcher.less';

type Theme = 'dark' | 'light' | 'colorful';

const ThemeSwitcher: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark');

  const switchTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  return (
    <div className="theme-switcher">
      <h3>Theme Switcher</h3>
      <p className="description">
        Demonstrating dynamic theming with Less CSS and CSS custom properties
      </p>
      
      <div className="theme-options">
        {(['dark', 'light', 'colorful'] as Theme[]).map((theme) => (
          <button
            key={theme}
            className={`theme-btn ${currentTheme === theme ? 'active' : ''}`}
            onClick={() => switchTheme(theme)}
          >
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="theme-preview">
        <div className="preview-card">
          <h4>Preview Card</h4>
          <p>This card changes appearance based on the selected theme.</p>
          <button className="preview-button">Sample Button</button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
