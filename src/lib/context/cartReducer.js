// Cart reducer actions
export const cartActions = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
}

// Cart reducer
export const cartReducer = (state, action) => {
  switch (action.type) {
    case cartActions.ADD_ITEM: {
      const existingItem = state.items.find(
        item =>
          item.variant.id === action.payload.variant.id &&
          item.product.id === action.payload.product.id
      )

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.variant.id === action.payload.variant.id &&
            item.product.id === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        }
      }

      return {
        ...state,
        items: [...state.items, action.payload]
      }
    }

    case cartActions.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(
          item =>
            !(item.variant.id === action.payload.variantId &&
              item.product.id === action.payload.productId)
        )
      }
    }

    case cartActions.UPDATE_QUANTITY: {
      return {
        ...state,
        items: state.items.map(item =>
          item.variant.id === action.payload.variantId &&
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      }
    }

    case cartActions.CLEAR_CART: {
      return {
        ...state,
        items: []
      }
    }

    case cartActions.LOAD_CART: {
      return action.payload
    }

    default:
      return state
  }
}

// Initial cart state
export const initialCartState = {
  items: [],
  get totalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0)
  },
  get totalPrice() {
    return this.items.reduce((total, item) => total + (item.variant.priceCents * item.quantity), 0)
  }
}
