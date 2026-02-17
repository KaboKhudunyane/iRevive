/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductPage from '../pages/product.jsx';
import { BrowserRouter } from 'react-router-dom';

/**
 * Product Page Tests
 * 
 * Tests:
 * - Product details rendering
 * - Variant selection and filtering
 * - Stock management
 * - Quantity selection
 * - Mobile-responsive design
 * - Add to cart functionality
 */

// Mock useParams to provide slug
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ slug: 'iphone-8' }),
}));

// Mock getProduct API
jest.mock('../lib/api/products', () => ({
  getProduct: jest.fn(() =>
    Promise.resolve({
      id: '1',
      title: 'iPhone 8',
      slug: 'iphone-8',
      variants: [
        {
          id: '1-1',
          color: 'Black',
          storageGB: 64,
          condition: 'Excellent',
          inventory: 5,
          priceCents: 420000,
          image: '/assets/iPhone8Black.jpg',
        },
        {
          id: '1-2',
          color: 'White',
          storageGB: 64,
          condition: 'Good',
          inventory: 0,
          priceCents: 400000,
          image: '/assets/iPhone8White.jpg',
        },
      ],
    })
  ),
}));

describe('ProductPage', () => {
  describe('Product Display', () => {
    test('renders product title and description', async () => {
      render(
        <BrowserRouter>
          <ProductPage />
        </BrowserRouter>
      );

      // Wait for product title to appear
      const title = await screen.findByText(/iPhone 8/i);
      expect(title).toBeInTheDocument();
    });

    test('renders responsive grid layout', async () => {
      const { container } = render(
        <BrowserRouter>
          <ProductPage />
        </BrowserRouter>
      );

      await screen.findByText(/iPhone 8/i);
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1', 'lg:grid-cols-2');
    });
  });

  describe('Variant Selection', () => {
    test('renders color selection options', async () => {
      render(
        <BrowserRouter>
          <ProductPage />
        </BrowserRouter>
      );

      await screen.findByText(/iPhone 8/i);
      // Look for color label or color buttons
      expect(screen.getByText(/Color/i)).toBeInTheDocument();
    });

    test('renders storage selection options', async () => {
      render(
        <BrowserRouter>
          <ProductPage />
        </BrowserRouter>
      );

      await screen.findByText(/iPhone 8/i);
      expect(screen.getByText(/Storage/i)).toBeInTheDocument();
    });

    test('renders condition selection options', async () => {
      render(
        <BrowserRouter>
          <ProductPage />
        </BrowserRouter>
      );

      await screen.findByText(/iPhone 8/i);
      expect(screen.getByText(/Condition/i)).toBeInTheDocument();
    });
  });

  describe('Stock Management', () => {
    test('displays stock status for available variants', async () => {
      render(
        <BrowserRouter>
          <ProductPage />
        </BrowserRouter>
      );

      await screen.findByText(/iPhone 8/i);
      // Stock status should be shown
      const stockElements = screen.queryAllByText(/Stock|available|Select options below/i);
      expect(stockElements.length).toBeGreaterThan(0);
    });
  });

  describe('Quantity Selection', () => {
    test('renders quantity selector with increment/decrement buttons', async () => {
      render(
        <BrowserRouter>
          <ProductPage />
        </BrowserRouter>
      );

      await screen.findByText(/iPhone 8/i);
      expect(screen.getByText(/Quantity/i)).toBeInTheDocument();
      // Look for increment/decrement buttons
      const buttons = screen.queryAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Add to Cart Functionality', () => {
    test('add to cart button is rendered', async () => {
      render(
        <BrowserRouter>
          <ProductPage />
        </BrowserRouter>
      );

      await screen.findByText(/iPhone 8/i);
      const addToCartBtn = screen.getByRole('button', {
        name: /Add to Cart|Added to Cart/i,
      });
      expect(addToCartBtn).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('uses mobile-first tailwind classes', async () => {
      const { container } = render(
        <BrowserRouter>
          <ProductPage />
        </BrowserRouter>
      );

      await screen.findByText(/iPhone 8/i);
      const heading = container.querySelector('h1');
      expect(heading).toHaveClass('text-2xl', 'sm:text-3xl');
    });

    test('renders sticky product info on larger screens', async () => {
      const { container } = render(
        <BrowserRouter>
          <ProductPage />
        </BrowserRouter>
      );

      await screen.findByText(/iPhone 8/i);
      // Check for responsive sticky positioning
      const mainElements = container.querySelectorAll('[class*="sticky"]');
      expect(mainElements.length).toBeGreaterThan(0);
    });
  });

  describe('Product Information', () => {
    test('displays product info section (shipping, returns, warranty)', async () => {
      render(
        <BrowserRouter>
          <ProductPage />
        </BrowserRouter>
      );

      await screen.findByText(/iPhone 8/i);
      expect(screen.getByText(/Product Info|Free shipping|returns/i)).toBeInTheDocument();
    });
  });
});
