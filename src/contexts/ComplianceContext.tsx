import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables, Enums } from "@/integrations/supabase/types";
import { useAuth } from "./AuthContext";

export type ProductBatch = Tables<"product_batches">;
export type SellerAdministrativeProfile = Tables<"seller_admin_profiles">;
export type VerificationHistoryEntry = Tables<"verification_history">;

interface ComplianceContextType {
  sellerProfile: SellerAdministrativeProfile | null;
  batches: ProductBatch[];
  verificationHistory: VerificationHistoryEntry[];
  loading: boolean;
  saveSellerProfile: (profile: Omit<SellerAdministrativeProfile, "id" | "user_id" | "created_at">) => Promise<void>;
  createBatch: (input: Omit<ProductBatch, "id" | "created_at" | "tx_hash" | "qr_target_url" | "scan_count">) => Promise<void>;
  updateBatch: (batch: ProductBatch) => Promise<void>;
  getBatchByCode: (batchCode: string) => ProductBatch | undefined;
  recordVerification: (batchId: string, verifierRole: Enums<"verifier_role">, complianceSummary?: string) => Promise<void>;
}

const ComplianceContext = createContext<ComplianceContextType | undefined>(undefined);

export const ComplianceProvider = ({ children }: { children: ReactNode }) => {
  const [sellerProfile, setSellerProfile] = useState<SellerAdministrativeProfile | null>(null);
  const [batches, setBatches] = useState<ProductBatch[]>([]);
  const [verificationHistory, setVerificationHistory] = useState<VerificationHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchComplianceData = async () => {
    if (!user) {
      setSellerProfile(null);
      setBatches([]);
      setVerificationHistory([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch seller profile
      const { data: profileData, error: profileError } = await supabase
        .from("seller_admin_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        // PGRST116 means no rows found, which is expected for new sellers
        throw profileError;
      }
      setSellerProfile(profileData);

      // Fetch product batches
      const { data: batchesData, error: batchesError } = await supabase
        .from("product_batches")
        .select("*"); // Assuming batches are public or RLS will handle visibility

      if (batchesError) throw batchesError;
      setBatches(batchesData);

      // Fetch verification history
      const { data: historyData, error: historyError } = await supabase
        .from("verification_history")
        .select("*"); // Assuming history is public or RLS will handle visibility

      if (historyError) throw historyError;
      setVerificationHistory(historyData);

    } catch (error) {
      console.error("Error fetching compliance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplianceData();

    const profileChannel = supabase
      .channel("seller_admin_profiles")
      .on("postgres_changes", { event: "*", schema: "public", table: "seller_admin_profiles" }, () => fetchComplianceData())
      .subscribe();

    const batchesChannel = supabase
      .channel("product_batches")
      .on("postgres_changes", { event: "*", schema: "public", table: "product_batches" }, () => fetchComplianceData())
      .subscribe();

    const historyChannel = supabase
      .channel("verification_history")
      .on("postgres_changes", { event: "*", schema: "public", table: "verification_history" }, () => fetchComplianceData())
      .subscribe();

    return () => {
      supabase.removeChannel(profileChannel);
      supabase.removeChannel(batchesChannel);
      supabase.removeChannel(historyChannel);
    };
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
      .insert({ ...input, qr_target_url: qrTargetUrl })
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

  const getBatchByCode = (batchCode: string) => {
    return batches.find((batch) => batch.batch_code.toLowerCase() === batchCode.toLowerCase());
  };

  const recordVerification = async (batchId: string, verifierRole: Enums<"verifier_role">, complianceSummary?: string) => {
    if (!user) throw new Error("User not authenticated.");

    const { data, error } = await supabase
      .from("verification_history")
      .insert({ batch_id: batchId, verifier_role: verifierRole, compliance_summary: complianceSummary })
      .select()
      .single();

    if (error) throw error;
    setVerificationHistory((prev) => [data, ...prev]);

    // Increment scan_count on the product_batch
    const currentBatch = batches.find(b => b.id === batchId);
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
