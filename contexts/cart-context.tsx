"use client";

import { type ReactNode, createContext, useContext, useEffect, useReducer, useState } from "react";

import type { CartAction, CartItem, CartState } from "@/types";

import { createClient } from "@/lib/supabase/client";

export type { CartItem };

const CartContext = createContext<{
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string, color: string) => void;
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void;
  toggleCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isLoading: boolean;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );
      if (existingIndex > -1) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += action.payload.quantity;
        return { ...state, items: newItems, isOpen: true };
      }
      return { ...state, items: [...state.items, action.payload], isOpen: true };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !(
              item.id === action.payload.id &&
              item.size === action.payload.size &&
              item.color === action.payload.color
            )
        ),
      };
    case "UPDATE_QUANTITY": {
      const newItems = state.items.map((item) =>
        item.id === action.payload.id &&
        item.size === action.payload.size &&
        item.color === action.payload.color
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return { ...state, items: newItems };
    }
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    case "LOAD_CART":
      return { ...state, items: action.payload };
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);

      if (userId) {
        const { data } = await supabase.from("carts").select("*").eq("user_id", userId);

        if (data && data.length > 0) {
          const items: CartItem[] = data.map((item) => ({
            id: item.product_id,
            name: item.name,
            price: item.price,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            image: item.image || "",
          }));
          dispatch({ type: "LOAD_CART", payload: items });
        }

        const localCart = localStorage.getItem("seesaw-cart");
        if (localCart) {
          const localItems: CartItem[] = JSON.parse(localCart);
          for (const item of localItems) {
            await supabase.from("carts").upsert(
              {
                user_id: userId,
                product_id: item.id,
                name: item.name,
                price: item.price,
                size: item.size,
                color: item.color,
                quantity: item.quantity,
                image: item.image,
              },
              { onConflict: "user_id,product_id,size,color" }
            );
          }
          localStorage.removeItem("seesaw-cart");

          const { data: merged } = await supabase.from("carts").select("*").eq("user_id", userId);
          if (merged) {
            const items: CartItem[] = merged.map((item) => ({
              id: item.product_id,
              name: item.name,
              price: item.price,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              image: item.image || "",
            }));
            dispatch({ type: "LOAD_CART", payload: items });
          }
        }
      } else {
        const saved = localStorage.getItem("seesaw-cart");
        if (saved) {
          dispatch({ type: "LOAD_CART", payload: JSON.parse(saved) });
        }
      }

      setIsLoading(false);
    };

    loadCart();
  }, [userId, supabase]);

  useEffect(() => {
    if (!userId && !isLoading) {
      localStorage.setItem("seesaw-cart", JSON.stringify(state.items));
    }
  }, [state.items, userId, isLoading]);

  const addItem = async (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });

    if (userId) {
      const existing = state.items.find(
        (i) => i.id === item.id && i.size === item.size && i.color === item.color
      );
      const newQuantity = existing ? existing.quantity + item.quantity : item.quantity;

      await supabase.from("carts").upsert(
        {
          user_id: userId,
          product_id: item.id,
          name: item.name,
          price: item.price,
          size: item.size,
          color: item.color,
          quantity: newQuantity,
          image: item.image,
        },
        { onConflict: "user_id,product_id,size,color" }
      );
    }
  };

  const removeItem = async (id: string, size: string, color: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id, size, color } });

    if (userId) {
      await supabase
        .from("carts")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", id)
        .eq("size", size)
        .eq("color", color);
    }
  };

  const updateQuantity = async (id: string, size: string, color: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, size, color, quantity } });

    if (userId) {
      await supabase
        .from("carts")
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("product_id", id)
        .eq("size", size)
        .eq("color", color);
    }
  };

  const toggleCart = () => dispatch({ type: "TOGGLE_CART" });
  const closeCart = () => dispatch({ type: "CLOSE_CART" });

  const clearCart = async () => {
    dispatch({ type: "CLEAR_CART" });

    if (userId) {
      await supabase.from("carts").delete().eq("user_id", userId);
    } else {
      localStorage.removeItem("seesaw-cart");
    }
  };

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        toggleCart,
        closeCart,
        clearCart,
        totalItems,
        subtotal,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
