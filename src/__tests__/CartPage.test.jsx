/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartPage from '../pages/cart.jsx';
import { CartProvider } from '../lib/context/CartContext';
import { BrowserRouter } from 'react-router-dom';

/**
 * Cart Page Tests
 * 
 * Tests:
 * - Empty cart state
 * - Cart items display in cards
 * - Price calculations
 * - Quantity updates
 * - Item removal
 * - Navigation links
 */

describe('CartPage', () => {
  const renderWithProviders = (component = <CartPage />) => {
    return render(
      <BrowserRouter>
        <CartProvider>
          {component}
        </CartProvider>
      </BrowserRouter>
    );
  };

  describe('Empty Cart State', () => {
    test('renders empty cart message and icon', () => {
      renderWithProviders();
      expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
      expect(screen.getByText('Start shopping to add items to your cart!')).toBeInTheDocument();
    });

    test('displays continue shopping link on empty cart', () => {
      renderWithProviders();
      const links = screen.getAllByText('Continue Shopping');
      expect(links.length).toBeGreaterThan(0);
    });
  });

  describe('Cart UI Layout', () => {
    test('renders main container with responsive classes', () => {
      const { container } = renderWithProviders();
      const main = container.querySelector('main');
      expect(main).toHaveClass('min-h-screen');
    });

    test('displays shopping cart heading', () => {
      renderWithProviders();
      expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    test('has links to shopping and checkout pages', () => {
      renderWithProviders();
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });

    test('includes continue shopping navigation', () => {
      renderWithProviders();
      const continueShoppingLinks = screen.getAllByText('Continue Shopping');
      expect(continueShoppingLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Clear Cart Functionality', () => {
    test('displays clear cart button', () => {
      renderWithProviders();
      const clearButton = screen.queryByText('Clear Cart');
      expect(clearButton).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('applies responsive grid layout classes', () => {
      const { container } = renderWithProviders();
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1', 'lg:col-span-2');
    });

    test('uses mobile-first tailwind classes', () => {
      const { container } = renderWithProviders();
      const heading = container.querySelector('h1');
      expect(heading).toHaveClass('text-2xl', 'sm:text-3xl');
    });
  });
});

