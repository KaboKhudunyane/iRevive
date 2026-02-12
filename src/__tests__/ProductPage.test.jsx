/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductPage from '../pages/product.jsx';
import { BrowserRouter } from 'react-router-dom';

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
        { id: '1-1', color: 'Black', storageGB: 64, condition: 'Excellent', inventory: 5, priceCents: 420000, image: '/assets/iPhone8 Black.jpg' },
        { id: '1-2', color: 'White', storageGB: 64, condition: 'Good', inventory: 0, priceCents: 400000, image: '/assets/iPhone8 White.jpg' },
      ],
    })
  ),
}));

describe('ProductPage', () => {
  test('renders product title and variant options', async () => {
    render(
      <BrowserRouter>
        <ProductPage />
      </BrowserRouter>
    );

    // Wait for product title to appear
    const title = await screen.findByText(/iPhone 8/i);
    expect(title).toBeInTheDocument();

    // Check color options
    const blackColorBtn = screen.getByRole('button', { name: /Black/i });
    expect(blackColorBtn).toBeInTheDocument();

    const whiteColorBtn = screen.getByRole('button', { name: /White/i });
    expect(whiteColorBtn).toBeInTheDocument();

    // Check Add to Cart button enabled for in-stock variant
    const addToCartBtn = screen.getByRole('button', { name: /Add to Cart/i });
    expect(addToCartBtn).toBeEnabled();

    // Select out-of-stock variant and check button disabled
    fireEvent.click(whiteColorBtn);
    expect(screen.getByRole('button', { name: /Out of Stock/i })).toBeDisabled();
  });
});
