// @ts-nocheck
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, Enums } from '@/integrations/supabase/types';
import { useAuth } from './AuthContext';

export type Order = Tables<'orders'> & {
  product_name: string;
  product_image: string;
  buyer_name: string;
  seller_name: string;
};

interface OrderContextType {
  orders: Order[];
  addOrder: (newOrderData: Omit<Tables<'orders'>, 'id' | 'created_at' | 'status' | 'buyer_id' | 'seller_id'> & { buyer_id: string; seller_id: string; }) => Promise<void>;
  updateOrderStatus: (id: string, status: Enums<'order_status'>) => Promise<void>;
  clearOrders: () => Promise<void>;
  loading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products(
            name,
            image_url
          ),
          buyer:profiles!orders_buyer_id_fkey(
            name
          ),
          seller:profiles!orders_seller_id_fkey(
            name
          )
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);

      if (error) {
        console.error('Error fetching orders:', error.message);
        setLoading(false);
        return;
      }

      const formattedOrders: Order[] = data.map((order: any) => ({
        ...order,
        product_name: order.products.name,
        product_image: order.products.image_url,
        buyer_name: order.buyer.name,
        seller_name: order.seller.name,
      }));
      setOrders(formattedOrders);
      setLoading(false);
    };

    fetchOrders();

    const channel = supabase
      .channel('orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
          fetchOrders(); // Re-fetch orders on any change for simplicity
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addOrder = async (newOrderData: Omit<Tables<'orders'>, 'id' | 'created_at' | 'status' | 'buyer_id' | 'seller_id'> & { buyer_id: string; seller_id: string; }) => {
    if (!user) {
      throw new Error('User not authenticated. Please log in to place an order.');
    }

    const { data, error } = await supabase
      .from('orders')
      .insert({ ...newOrderData, status: 'processing' })
      .select(`
        *,
        products(
          name,
          image_url
        ),
        buyer:profiles!orders_buyer_id_fkey(
          name
        ),
        seller:profiles!orders_seller_id_fkey(
          name
        )
      `)
      .single();

    if (error) throw error;

    const newOrder: Order = {
      ...data,
      product_name: data.products.name,
      product_image: data.products.image_url,
      buyer_name: data.buyer.name,
      seller_name: data.seller.name,
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrderStatus = async (id: string, status: Enums<'order_status'>) => {
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);
    if (error) throw error;
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  const clearOrders = async () => {
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const { error } = await supabase.from('orders').delete().or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);
    if (error) throw error;
    setOrders([]);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, clearOrders, loading }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
