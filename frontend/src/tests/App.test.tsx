import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
    test('renders the header', () => {
        render(<App />);
        const headerElement = screen.getByText(/header text/i); // Replace with actual header text
        expect(headerElement).toBeInTheDocument();
    });

    test('renders the footer', () => {
        render(<App />);
        const footerElement = screen.getByText(/footer text/i); // Replace with actual footer text
        expect(footerElement).toBeInTheDocument();
    });

    test('renders the home page by default', () => {
        render(<App />);
        const homeElement = screen.getByText(/home page content/i); // Replace with actual home page content
        expect(homeElement).toBeInTheDocument();
    });
});
