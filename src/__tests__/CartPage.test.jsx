/* eslint-env jest */
import React from 'react';
import { render, screen } from '@testing-library/react';
import CartPage from '../pages/cart.jsx';
import { CartProvider } from '../lib/context/CartContext';
import { BrowserRouter } from 'react-router-dom';

describe('CartPage', () => {
  test('renders empty cart message', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <CartPage />
        </CartProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
  });

  // Additional tests for cart with items can be added after cart functionality is fully implemented
});
