"use client";

import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { WishlistState, WishlistAction } from "@/types";

const WishlistContext = createContext<{
  state: WishlistState;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  totalItems: number;
  isLoading: boolean;
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
    const loadWishlist = async () => {
      setIsLoading(true);

      if (userId) {
        const { data } = await supabase.from("wishlists").select("product_id").eq("user_id", userId);

        if (data && data.length > 0) {
          const items = data.map((item) => item.product_id);
          dispatch({ type: "LOAD_WISHLIST", payload: items });
        }

        const localWishlist = localStorage.getItem("seesaw-wishlist");
        if (localWishlist) {
          const localItems: string[] = JSON.parse(localWishlist);
          for (const productId of localItems) {
            await supabase
              .from("wishlists")
              .upsert({ user_id: userId, product_id: productId }, { onConflict: "user_id,product_id" });
          }
          localStorage.removeItem("seesaw-wishlist");

          const { data: merged } = await supabase.from("wishlists").select("product_id").eq("user_id", userId);
          if (merged) {
            const items = merged.map((item) => item.product_id);
            dispatch({ type: "LOAD_WISHLIST", payload: items });
          }
        }
      } else {
        const saved = localStorage.getItem("seesaw-wishlist");
        if (saved) {
          dispatch({ type: "LOAD_WISHLIST", payload: JSON.parse(saved) });
        }
      }
      setIsLoading(false);
    };

    loadWishlist();
  }, [userId, supabase]);

  useEffect(() => {
    if (!userId && !isLoading) {
      localStorage.setItem("seesaw-wishlist", JSON.stringify(state.items));
    }
  }, [state.items, userId, isLoading]);

  const addItem = async (id: string) => {
    dispatch({ type: "ADD_ITEM", payload: id });

    if (userId) {
      await supabase
        .from("wishlists")
        .upsert({ user_id: userId, product_id: id }, { onConflict: "user_id,product_id" });
    }
  };

  const removeItem = async (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });

    if (userId) {
      await supabase.from("wishlists").delete().eq("user_id", userId).eq("product_id", id);
    }
  };

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
    <WishlistContext.Provider value={{ state, addItem, removeItem, toggleItem, isInWishlist, totalItems, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
