// @ts-nocheck
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables, Enums } from "@/integrations/supabase/types";
import { useAuth } from "./AuthContext";

export type BuyerRequest = Tables<"buyer_requests"> & {
  buyer_name: string;
};

interface BuyerRequestContextType {
  requests: BuyerRequest[];
  addRequest: (newRequestData: Omit<Tables<"buyer_requests">, "id" | "created_at" | "status" | "buyer_id">) => Promise<void>;
  removeRequest: (id: string) => Promise<void>;
  updateRequestStatus: (id: string, status: Enums<"request_status">) => Promise<void>;
  loading: boolean;
}

const BuyerRequestContext = createContext<BuyerRequestContextType | undefined>(undefined);

export function BuyerRequestProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBuyerRequests = async () => {
      if (!user) {
        setRequests([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("buyer_requests")
        .select(`
          *,
          buyer:profiles!buyer_requests_buyer_id_fkey(
            name
          )
        `)
        .eq("buyer_id", user.id);

      if (error) {
        console.error("Error fetching buyer requests:", error.message);
        setLoading(false);
        return;
      }

      const formattedRequests: BuyerRequest[] = data.map((req: any) => ({
        ...req,
        buyer_name: req.buyer.name,
      }));
      setRequests(formattedRequests);
      setLoading(false);
    };

    fetchBuyerRequests();

    const channel = supabase
      .channel(`buyer_requests-${Math.random().toString(36).slice(2, 9)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "buyer_requests" }, (payload) => {
        if (payload.eventType === "INSERT" || payload.eventType === "UPDATE" || payload.eventType === "DELETE") {
          fetchBuyerRequests();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addRequest = async (newRequestData: Omit<Tables<"buyer_requests">, "id" | "created_at" | "status" | "buyer_id">) => {
    if (!user) {
      throw new Error("User not authenticated. Please log in to create a buyer request.");
    }

    const { data, error } = await supabase
      .from("buyer_requests")
      .insert({ ...newRequestData, buyer_id: user.id, status: "open" })
      .select(`
        *,
        buyer:profiles!buyer_requests_buyer_id_fkey(
          name
        )
      `)
      .single();

    if (error) throw error;

    const newRequest: BuyerRequest = {
      ...data,
      buyer_name: data.buyer.name,
    };
    setRequests((prev) => [newRequest, ...prev]);
  };

  const removeRequest = async (id: string) => {
    if (!user) {
      throw new Error("User not authenticated.");
    }
    const { error } = await supabase.from("buyer_requests").delete().eq("id", id).eq("buyer_id", user.id);
    if (error) throw error;
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const updateRequestStatus = async (id: string, status: Enums<"request_status">) => {
    if (!user) {
      throw new Error("User not authenticated.");
    }
    const { error } = await supabase
      .from("buyer_requests")
      .update({ status })
      .eq("id", id)
      .eq("buyer_id", user.id);
    if (error) throw error;
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
  };

  return (
    <BuyerRequestContext.Provider value={{ requests, addRequest, removeRequest, updateRequestStatus, loading }}>
      {children}
    </BuyerRequestContext.Provider>
  );
}

export function useBuyerRequests() {
  const ctx = useContext(BuyerRequestContext);
  if (!ctx) throw new Error("useBuyerRequests must be used within BuyerRequestProvider");
  return ctx;
}
