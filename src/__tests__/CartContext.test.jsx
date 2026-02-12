/* eslint-env jest */
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, CartContext } from '../lib/context/CartContext';

describe('CartContext', () => {
  test('adds item to cart', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => React.useContext(CartContext), { wrapper });

    act(() => {
      result.current.addItem(
        { id: '1', title: 'iPhone 8' },
        { id: '1-1', color: 'Black', storageGB: 64, condition: 'Excellent', priceCents: 420000 },
        1
      );
    });

    expect(result.current.cart.items.length).toBe(1);
    expect(result.current.cart.items[0].quantity).toBe(1);
  });

  test('removes item from cart', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => React.useContext(CartContext), { wrapper });

    act(() => {
      result.current.addItem(
        { id: '1', title: 'iPhone 8' },
        { id: '1-1', color: 'Black', storageGB: 64, condition: 'Excellent', priceCents: 420000 },
        1
      );
    });

    act(() => {
      result.current.removeItem('1', '1-1');
    });

    expect(result.current.cart.items.length).toBe(0);
  });

  test('updates quantity', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => React.useContext(CartContext), { wrapper });

    act(() => {
      result.current.addItem(
        { id: '1', title: 'iPhone 8' },
        { id: '1-1', color: 'Black', storageGB: 64, condition: 'Excellent', priceCents: 420000 },
        1
      );
    });

    act(() => {
      result.current.updateQuantity('1', '1-1', 3);
    });

    expect(result.current.cart.items[0].quantity).toBe(3);
  });

  test('clears cart', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => React.useContext(CartContext), { wrapper });

    act(() => {
      result.current.addItem(
        { id: '1', title: 'iPhone 8' },
        { id: '1-1', color: 'Black', storageGB: 64, condition: 'Excellent', priceCents: 420000 },
        1
      );
    });

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.cart.items.length).toBe(0);
  });
});
