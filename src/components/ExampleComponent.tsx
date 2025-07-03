import React from 'react';
import './ExampleComponent.less';

interface ExampleComponentProps {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
}

const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title = "Less CSS in Action",
  subtitle = "Showcasing variables, mixins, and nested rules",
  description = "This component demonstrates the power of Less CSS with variables for consistent theming, mixins for reusable patterns, and nested rules for organized styling.",
  features = [
    "Variables for consistent colors and spacing",
    "Mixins for reusable button and card styles",
    "Nested rules for organized CSS hierarchy",
    "Responsive design with media queries",
    "CSS functions like darken() for color manipulation"
  ]
}) => {
  return (
    <div className="example-component">
      <div className="header">
        <h2>{title}</h2>
        <div className="subtitle">{subtitle}</div>
      </div>
      
      <div className="content">
        <div className="description">
          {description}
        </div>
        
        <ul className="feature-list">
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
      
      <div className="actions">
        <button className="btn-primary">
          Primary Action
        </button>
        <button className="btn-secondary">
          Secondary Action
        </button>
      </div>
    </div>
  );
};

export default ExampleComponent;
