import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('Agentic Engineering Dashboard', () => {
  it('renders dashboard title and main sections', () => {
    render(<App />);
    
    // Check that the title is rendered
    expect(screen.getByText('Agentic Engineering Dashboard')).toBeInTheDocument();
    
    // Check that key dashboard sections are present
    expect(screen.getByText('Execution Task Queue')).toBeInTheDocument();
    expect(screen.getByText('Agent Activity Logs')).toBeInTheDocument();
    
    // Check that the default metrics cards are present
    expect(screen.getByText('Engine LLM')).toBeInTheDocument();
    expect(screen.getByText('Active Tasks')).toBeInTheDocument();
  });
});
