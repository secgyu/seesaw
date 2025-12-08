"use client";

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";
import type { WishlistState, WishlistAction } from "./types";

const WishlistContext = createContext<{
  state: WishlistState;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  totalItems: number;
} | null>(null);

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "ADD_ITEM":
      if (state.items.includes(action.payload)) return state;
      return { ...state, items: [...state.items, action.payload] };
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((id) => id !== action.payload) };
    case "LOAD_WISHLIST":
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  useEffect(() => {
    const saved = localStorage.getItem("seesaw-wishlist");
    if (saved) {
      dispatch({ type: "LOAD_WISHLIST", payload: JSON.parse(saved) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("seesaw-wishlist", JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (id: string) => dispatch({ type: "ADD_ITEM", payload: id });
  const removeItem = (id: string) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const toggleItem = (id: string) => {
    if (state.items.includes(id)) {
      removeItem(id);
    } else {
      addItem(id);
    }
  };
  const isInWishlist = (id: string) => state.items.includes(id);
  const totalItems = state.items.length;

  return (
    <WishlistContext.Provider value={{ state, addItem, removeItem, toggleItem, isInWishlist, totalItems }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
