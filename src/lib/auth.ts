import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type UserRole = Database["public"]["Enums"]["app_role"];
export type KycStatus = Database["public"]["Enums"]["kyc_status"];

export interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  country?: string;
  kycStatus: KycStatus;
  roles: UserRole[];
}

export const KYC_STATUS_LABELS: Record<string, string> = {
  not_started: "Not Started",
  pending: "Pending Review",
  verified: "Verified",
  rejected: "Rejected",
};

export const getKycStatusLabel = (status?: string | null) =>
  (status && KYC_STATUS_LABELS[status]) || "Not Started";

export const authService = {
  getKycStatusLabel,
  async signUp(email: string, password: string, name: string, role: UserRole) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, initial_role: role },
      },
    });

    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    let { data: profile } = await supabase
      .from("profiles")
      .select("id, name, email, company, country, kyc_status")
      .eq("id", user.id)
      .maybeSingle();

    // Auto-create profile row if missing (defensive fallback)
    if (!profile) {
      const fallbackName =
        (user.user_metadata as any)?.name || user.email?.split("@")[0] || "HerBlocX User";
      const { data: inserted } = await supabase
        .from("profiles")
        .insert({ id: user.id, name: fallbackName, email: user.email, kyc_status: "not_started" })
        .select("id, name, email, company, country, kyc_status")
        .maybeSingle();
      profile = inserted ?? {
        id: user.id,
        name: fallbackName,
        email: user.email ?? "",
        company: null,
        country: null,
        kyc_status: "not_started",
      } as any;
    }

    const { data: userRoles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    return {
      id: profile!.id,
      name: profile!.name || user.email?.split("@")[0] || "HerBlocX User",
      email: profile!.email || user.email || "",
      company: profile!.company || "",
      country: profile!.country || "",
      kycStatus: (profile!.kyc_status as KycStatus) || "not_started",
      roles: (userRoles ?? []).map((r) => r.role),
    };
  },

  async updateProfile(updates: Partial<Omit<User, "id" | "email" | "roles" | "kycStatus">>) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("User not authenticated.");

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (error) throw error;
  },

  async hasRole(role: UserRole): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.roles.includes(role) || false;
  },

  async isKycVerified(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.kycStatus === "verified" || false;
  },

  async submitKyc(role: UserRole, kycData: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated. Silakan login kembali.");

    if (role !== "buyer" && role !== "seller") {
      throw new Error(`Role "${role}" tidak diperkenankan untuk self-KYC.`);
    }

    // Validate minimum KYC payload up-front so navigation never happens on bad data
    const requiredCommon = ["legalName", "nibNumber", "nikOrNpwp"];
    const missing = requiredCommon.filter((k) => !String(kycData?.[k] ?? "").trim());
    if (missing.length) {
      throw new Error(`Field wajib belum lengkap: ${missing.join(", ")}`);
    }

    // 1. Insert / upsert KYC data BEFORE granting role + verified status,
    //    so a failure here leaves the account untouched.
    if (role === "buyer") {
      if (!Array.isArray(kycData.simplisiaNeeded) || kycData.simplisiaNeeded.length === 0) {
        throw new Error("Pilih minimal satu simplisia yang dibutuhkan.");
      }
      const { error: buyerKycError } = await supabase.from("buyer_kyc").upsert(
        {
          user_id: user.id,
          legal_name: kycData.legalName,
          nib: kycData.nibNumber,
          npwp: kycData.nikOrNpwp,
          simplisia_needed: kycData.simplisiaNeeded,
          purchase_volume_kg: Number(kycData.purchaseVolumeKg) || null,
          preferred_origin: kycData.preferredOrigin ?? null,
          import_destination: kycData.importDestination ?? null,
        },
        { onConflict: "user_id" },
      );
      if (buyerKycError) throw new Error(`Gagal menyimpan Buyer KYC: ${buyerKycError.message}`);
    } else {
      const requiredSeller = ["landName", "landLocation"];
      const missingSeller = requiredSeller.filter((k) => !String(kycData?.[k] ?? "").trim());
      if (missingSeller.length) {
        throw new Error(`Field lahan wajib belum lengkap: ${missingSeller.join(", ")}`);
      }
      const { error: sellerKycError } = await supabase.from("seller_kyc").upsert(
        {
          user_id: user.id,
          legal_name: kycData.legalName,
          nib: kycData.nibNumber,
          npwp: kycData.nikOrNpwp,
          land_name: kycData.landName,
          land_location: kycData.landLocation,
          land_area_hectares: Number(kycData.landAreaHectares) || null,
          geotag_lat: Number(kycData.geotagLatitude) || null,
          geotag_lng: Number(kycData.geotagLongitude) || null,
          simplisia_offered: Array.isArray(kycData.simplisiaOffered) ? kycData.simplisiaOffered : [],
          cultivation_method: kycData.cultivationMethod ?? null,
          monthly_capacity_kg: Number(kycData.monthlyCapacityKg) || null,
        },
        { onConflict: "user_id" },
      );
      if (sellerKycError) throw new Error(`Gagal menyimpan Seller KYC: ${sellerKycError.message}`);
    }

    // 2. Atomic: replace any prior trade role with the freshly chosen one
    //    AND mark KYC as verified, in a single SECURITY DEFINER RPC.
    //    This guarantees a buyer submission never leaves the user as seller
    //    (or vice-versa).
    const { error: rpcError } = await supabase.rpc("set_active_trade_role", { _role: role });
    if (rpcError) {
      throw new Error(`Gagal mengaktifkan role ${role}: ${rpcError.message}`);
    }
  },
};
