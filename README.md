# Workflow Editor

A modern React TypeScript frontend application built with Vite. This project provides a clean starting point for building performant web applications with modern tooling.

## Features

- ⚡ **Vite** - Fast development server and build tool
- ⚛️ **React 19** - Latest React with concurrent features
- 🔷 **TypeScript** - Full type safety and IntelliSense
- 🎨 **Less CSS** - Advanced CSS preprocessing with variables, mixins, and nesting
- 📦 **ES Modules** - Modern JavaScript module system
- 🔥 **Hot Module Replacement** - Instant updates during development
- 🧹 **ESLint** - Code linting with React-specific rules

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/              # React components
│   ├── ExampleComponent.tsx
│   └── ExampleComponent.less
├── styles/                  # Less CSS architecture
│   ├── index.less          # Main entry point
│   ├── variables.less      # Global variables
│   ├── mixins.less         # Reusable mixins
│   ├── utilities.less      # Utility classes
│   └── themes.less         # Theme system
├── App.tsx                 # Main application component
├── App.less                # App-specific styles
├── main.tsx               # Application entry point
├── index.less             # Global styles
└── assets/                # Static assets
```

## Less CSS Architecture

This project features a comprehensive Less CSS setup with:

- **Variables**: Consistent design tokens for colors, spacing, and typography
- **Mixins**: Reusable styling patterns for buttons, cards, and animations  
- **Utilities**: Helper classes for common styling needs
- **Themes**: Multiple theme support with CSS custom properties
- **Modular Structure**: Organized imports and component-specific styles

### Key Features
- Variables for consistent theming (`@primary-color`, `@spacing-md`, etc.)
- Mixins for reusable patterns (`.button-base()`, `.card-base()`, etc.)
- Nested rules with `&` selectors for organized CSS hierarchy
- Color functions (`darken()`, `lighten()`, `fade()`) for dynamic styling
- Responsive design with clean media query organization
- Theme switching capabilities with CSS custom properties

See [LESS_GUIDE.md](./LESS_GUIDE.md) for detailed documentation.

## Development Guidelines

- Use functional components with React hooks
- Implement proper TypeScript types for all components and functions
- Follow React best practices for state management and component composition
- Ensure components are accessible and follow WCAG guidelines
- Write clean, maintainable code with proper error handling

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
