// @ts-nocheck
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useAuth } from './AuthContext'; // Assuming an AuthContext exists or will be created

export type CartItem = Partial<Tables<'cart_items'>> & { id: string; product_id: string; quantity: number; product_name: string; image_url: string; price: number; scientific_name: string; supplier_name: string; status?: string; created_at?: string; user_id?: string; };

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateItemQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Get user from AuthContext

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          created_at,
          product_id,
          quantity,
          status,
          products(
            name,
            image_url,
            price,
            scientific_name,
            suppliers(name)
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching cart items:', error.message);
        setLoading(false);
        return;
      }

      const formattedCartItems: CartItem[] = data.map((item: any) => ({
        id: item.id,
        created_at: item.created_at,
        product_id: item.product_id,
        quantity: item.quantity,
        status: item.status,
        product_name: item.products.name,
        image_url: item.products.image_url,
        price: item.products.price,
        scientific_name: item.products.scientific_name,
        supplier_name: item.products.suppliers.name,
      }));
      setCartItems(formattedCartItems);
      setLoading(false);
    };

    fetchCartItems();
  }, [user]);

  const addToCart = async (productId: string, quantity: number) => {
    if (!user) {
      throw new Error('User not authenticated. Please log in to add items to cart.');
    }

    const { data, error } = await supabase
      .from('cart_items')
      .insert({ user_id: user.id, product_id: productId, quantity, status: 'pending' })
      .select(`
        id,
        created_at,
        product_id,
        quantity,
        status,
        products(
          name,
          image_url,
          price,
          scientific_name,
          suppliers(name)
        )
      `)
      .single();

    if (error) throw error;

    const newItem: CartItem = {
      id: data.id,
      created_at: data.created_at,
      product_id: data.product_id,
      quantity: data.quantity,
      status: data.status,
      product_name: data.products.name,
      image_url: data.products.image_url,
      price: data.products.price,
      scientific_name: data.products.scientific_name,
      supplier_name: data.products.suppliers.name,
    };
    setCartItems((prev) => [...prev, newItem]);
  };

  const removeFromCart = async (id: string) => {
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const { error } = await supabase.from('cart_items').delete().eq('id', id).eq('user_id', user.id);
    if (error) throw error;
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItemQuantity = async (id: string, quantity: number) => {
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) throw error;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = async () => {
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const { error } = await supabase.from('cart_items').delete().eq('user_id', user.id);
    if (error) throw error;
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateItemQuantity, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
