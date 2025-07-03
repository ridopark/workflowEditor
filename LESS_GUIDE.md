# Less CSS Architecture

This project uses a well-organized Less CSS architecture for maintainable and scalable styling.

## Structure

```
src/
├── styles/
│   ├── index.less          # Main entry point for all Less modules
│   ├── variables.less      # Global variables (colors, spacing, typography)
│   ├── mixins.less         # Reusable mixins and functions
│   ├── utilities.less      # Utility classes for common patterns
│   └── themes.less         # Theme variations and CSS custom properties
├── components/
│   └── *.less             # Component-specific styles
├── index.less             # Global styles and base elements
└── App.less               # Main app component styles
```

## Key Features

### 🎨 Variables (`variables.less`)
- Consistent color palette
- Standardized spacing scale
- Typography settings
- Responsive breakpoints

### 🛠️ Mixins (`mixins.less`)
- Button base styles
- Card layouts
- Flexbox utilities
- Smooth transitions
- Text gradients

### 🎯 Utilities (`utilities.less`)
- Spacing classes (margin/padding)
- Flexbox utilities
- Text alignment
- Color utilities
- Border radius classes
- Animation helpers

### 🌈 Theming (`themes.less`)
- Multiple theme support
- CSS custom properties
- Dynamic theme switching
- Light/dark/colorful themes

## Usage Examples

### Using Variables
```less
.my-component {
  color: @primary-color;
  padding: @spacing-lg;
  border-radius: @border-radius;
}
```

### Using Mixins
```less
.my-button {
  .button-base();
  background: @primary-color;
  
  &:hover {
    .hover-glow();
  }
}
```

### Nested Rules
```less
.navigation {
  background: @background-dark;
  
  .nav-item {
    padding: @spacing-md;
    
    &:hover {
      background: @background-light;
    }
    
    a {
      color: @text-color;
      .smooth-transition(color);
      
      &:hover {
        color: @primary-color;
      }
    }
  }
}
```

### Mathematical Operations
```less
.responsive-grid {
  .columns {
    width: 100% / 3;
    padding: @spacing-md / 2;
  }
  
  .large-heading {
    font-size: @font-size-base * 2;
  }
}
```

## Best Practices

1. **Import Order**: Always import in the correct order:
   - Variables first
   - Mixins second
   - Utilities/themes last

2. **Component Isolation**: Each component should import the main styles index:
   ```less
   @import '../styles/index.less';
   ```

3. **Variable Naming**: Use semantic names:
   ```less
   @primary-color: #646cff;    // Good
   @blue: #646cff;            // Avoid
   ```

4. **Mixin Usage**: Create mixins for repeated patterns:
   ```less
   .card-shadow() {
     box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
   }
   ```

5. **Nesting**: Keep nesting levels reasonable (max 3-4 levels)

## Development Tips

- Use Less's color functions: `darken()`, `lighten()`, `fade()`
- Leverage mathematical operations for responsive design
- Use guards for conditional styles
- Take advantage of Less's import system for modular CSS
