// @ts-nocheck
import { createContext, ReactNode, useContext, useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables, Enums } from "@/integrations/supabase/types";
import { useAuth } from "./AuthContext";

export type ProductBatch = Tables<"product_batches">;
export type SellerAdministrativeProfile = Tables<"seller_admin_profiles">;
export type VerificationHistoryEntry = Tables<"verification_history">;

export type RealtimeStatus = "connecting" | "connected" | "error" | "offline";

interface ComplianceContextType {
  sellerProfile: SellerAdministrativeProfile | null;
  batches: ProductBatch[];
  verificationHistory: VerificationHistoryEntry[];
  loading: boolean;
  realtimeStatus: RealtimeStatus;
  retryRealtime: () => void;
  refreshCompliance: () => Promise<void>;
  saveSellerProfile: (profile: Omit<SellerAdministrativeProfile, "id" | "user_id" | "created_at">) => Promise<void>;
  createBatch: (input: Omit<ProductBatch, "id" | "created_at" | "tx_hash" | "qr_target_url" | "scan_count">) => Promise<void>;
  updateBatch: (batch: ProductBatch) => Promise<void>;
  getBatchByCode: (batchCode: string) => ProductBatch | undefined;
  recordVerification: (batchId: string, verifierRole: Enums<"verifier_role">, complianceSummary?: string) => Promise<void>;
}

const ComplianceContext = createContext<ComplianceContextType | undefined>(undefined);

const TABLES = ["seller_admin_profiles", "product_batches", "verification_history"] as const;

export const ComplianceProvider = ({ children }: { children: ReactNode }) => {
  const [sellerProfile, setSellerProfile] = useState<SellerAdministrativeProfile | null>(null);
  const [batches, setBatches] = useState<ProductBatch[]>([]);
  const [verificationHistory, setVerificationHistory] = useState<VerificationHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [realtimeStatus, setRealtimeStatus] = useState<RealtimeStatus>("connecting");
  const { user } = useAuth();

  const channelsRef = useRef<ReturnType<typeof supabase.channel>[]>([]);
  const retryAttemptRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subscribedCountRef = useRef(0);

  const fetchComplianceData = useCallback(async () => {
    if (!user) {
      setSellerProfile(null);
      setBatches([]);
      setVerificationHistory([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("seller_admin_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (profileError && profileError.code !== "PGRST116") throw profileError;
      setSellerProfile(profileData ?? null);

      const { data: batchesData, error: batchesError } = await supabase.from("product_batches").select("*");
      if (batchesError) throw batchesError;
      setBatches(batchesData ?? []);

      const { data: historyData, error: historyError } = await supabase.from("verification_history").select("*");
      if (historyError) throw historyError;
      setVerificationHistory(historyData ?? []);
    } catch (error) {
      // Polling-based fallback: keep the UI usable even if realtime is down
      console.error("[ComplianceContext] fetchComplianceData failed:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const teardownChannels = useCallback(() => {
    channelsRef.current.forEach((ch) => {
      try { supabase.removeChannel(ch); } catch (err) { console.warn("[ComplianceContext] removeChannel failed:", err); }
    });
    channelsRef.current = [];
    subscribedCountRef.current = 0;
  }, []);

  const scheduleRetry = useCallback(() => {
    if (retryTimerRef.current) return; // already scheduled
    const attempt = Math.min(retryAttemptRef.current, 5);
    const delay = Math.min(1500 * Math.pow(2, attempt), 30000); // 1.5s → 30s cap
    retryAttemptRef.current = attempt + 1;
    retryTimerRef.current = setTimeout(() => {
      retryTimerRef.current = null;
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      setupRealtime();
    }, delay);
  }, []);

  const setupRealtime = useCallback(() => {
    teardownChannels();
    setRealtimeStatus("connecting");
    subscribedCountRef.current = 0;

    try {
      TABLES.forEach((table) => {
        const channel = supabase
          .channel(`${table}-${Math.random().toString(36).slice(2, 9)}`)
          .on("postgres_changes", { event: "*", schema: "public", table }, () => fetchComplianceData())
          .subscribe((status) => {
            if (status === "SUBSCRIBED") {
              subscribedCountRef.current += 1;
              if (subscribedCountRef.current >= TABLES.length) {
                setRealtimeStatus("connected");
                retryAttemptRef.current = 0;
              }
            } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
              setRealtimeStatus("error");
              scheduleRetry();
            }
          });
        channelsRef.current.push(channel);
      });
    } catch (err) {
      console.error("[ComplianceContext] setupRealtime failed:", err);
      setRealtimeStatus("error");
      scheduleRetry();
    }
  }, [fetchComplianceData, scheduleRetry, teardownChannels]);

  const retryRealtime = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    retryAttemptRef.current = 0;
    fetchComplianceData();
    setupRealtime();
  }, [fetchComplianceData, setupRealtime]);

  useEffect(() => {
    fetchComplianceData();
    setupRealtime();
    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
      teardownChannels();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const saveSellerProfile = async (profile: Omit<SellerAdministrativeProfile, "id" | "user_id" | "created_at">) => {
    if (!user) throw new Error("User not authenticated.");
    const { data, error } = await supabase
      .from("seller_admin_profiles")
      .upsert({ ...profile, user_id: user.id }, { onConflict: "user_id" })
      .select()
      .single();
    if (error) throw error;
    setSellerProfile(data);
  };

  const createBatch = async (input: Omit<ProductBatch, "id" | "created_at" | "tx_hash" | "qr_target_url" | "scan_count">) => {
    if (!user) throw new Error("User not authenticated.");
    const qrTargetUrl = `${window.location.origin}/journey/${input.batch_code}`;
    const { data, error } = await supabase
      .from("product_batches")
      .insert({ ...input, qr_target_url: qrTargetUrl, created_by: user.id })
      .select()
      .single();
    if (error) throw error;
    setBatches((prev) => [data, ...prev]);
  };

  const updateBatch = async (batch: ProductBatch) => {
    if (!user) throw new Error("User not authenticated.");
    const { data, error } = await supabase
      .from("product_batches")
      .update(batch)
      .eq("id", batch.id)
      .select()
      .single();
    if (error) throw error;
    setBatches((prev) => prev.map((b) => (b.id === batch.id ? data : b)));
  };

  const getBatchByCode = (batchCode: string) =>
    batches.find((batch) => batch.batch_code.toLowerCase() === batchCode.toLowerCase());

  const recordVerification = async (batchId: string, verifierRole: Enums<"verifier_role">, complianceSummary?: string) => {
    if (!user) throw new Error("User not authenticated.");
    const { data, error } = await supabase
      .from("verification_history")
      .insert({ batch_id: batchId, verifier_role: verifierRole, compliance_summary: complianceSummary })
      .select()
      .single();
    if (error) throw error;
    setVerificationHistory((prev) => [data, ...prev]);

    const currentBatch = batches.find((b) => b.id === batchId);
    if (currentBatch) {
      await supabase
        .from("product_batches")
        .update({ scan_count: (currentBatch.scan_count || 0) + 1 })
        .eq("id", batchId);
    }
  };

  return (
    <ComplianceContext.Provider
      value={{
        sellerProfile,
        batches,
        verificationHistory,
        loading,
        realtimeStatus,
        retryRealtime,
        refreshCompliance: fetchComplianceData,
        saveSellerProfile,
        createBatch,
        updateBatch,
        getBatchByCode,
        recordVerification,
      }}
    >
      {children}
    </ComplianceContext.Provider>
  );
};

export const useCompliance = () => {
  const context = useContext(ComplianceContext);
  if (!context) {
    throw new Error("useCompliance must be used within a ComplianceProvider");
  }
  return context;
};
