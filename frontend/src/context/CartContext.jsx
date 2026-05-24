import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);
const STORAGE_KEY = "dheeras-cart";

const initialState = {
  items: []
};

function loadCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialState;
  } catch {
    return initialState;
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const product = action.payload;
      const existing = state.items.find((item) => item._id === product._id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
          )
        };
      }
      return { items: [...state.items, { ...product, quantity: 1 }] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((item) => item._id !== action.payload) };
    case "INCREASE":
      return {
        items: state.items.map((item) =>
          item._id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
    case "DECREASE":
      return {
        items: state.items
          .map((item) =>
            item._id === action.payload ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0)
      };
    case "CLEAR_CART":
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => {
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items: state.items,
      subtotal,
      total: subtotal,
      totalQuantity,
      addItem(product) {
        dispatch({ type: "ADD_ITEM", payload: product });
        toast.success(`${product.name} added to cart`);
      },
      removeItem(id) {
        dispatch({ type: "REMOVE_ITEM", payload: id });
        toast.success("Item removed");
      },
      increase(id) {
        dispatch({ type: "INCREASE", payload: id });
      },
      decrease(id) {
        dispatch({ type: "DECREASE", payload: id });
      },
      clearCart() {
        dispatch({ type: "CLEAR_CART" });
      }
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
