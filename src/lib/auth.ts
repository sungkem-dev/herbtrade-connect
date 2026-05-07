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

export const authService = {
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
    const user = await this.getCurrentUser();
    if (!user) throw new Error("User not authenticated.");

    // Update profile kyc_status
    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({ kyc_status: "pending" })
      .eq("id", user.id);
    if (profileUpdateError) throw profileUpdateError;

    // Insert KYC data into appropriate table
    if (role === "buyer") {
      const { error: buyerKycError } = await supabase.from("buyer_kyc").insert({
        user_id: user.id,
        legal_name: kycData.legalName,
        nib: kycData.nibNumber,
        npwp: kycData.nikOrNpwp,
        simplisia_needed: kycData.simplisiaNeeded,
        purchase_volume_kg: kycData.purchaseVolumeKg,
        preferred_origin: kycData.preferredOrigin,
        import_destination: kycData.importDestination,
      });
      if (buyerKycError) throw buyerKycError;
    } else if (role === "seller") {
      const { error: sellerKycError } = await supabase.from("seller_kyc").insert({
        user_id: user.id,
        legal_name: kycData.legalName,
        nib: kycData.nibNumber,
        npwp: kycData.nikOrNpwp,
        land_name: kycData.landName,
        land_location: kycData.landLocation,
        land_area_hectares: kycData.landAreaHectares,
        geotag_lat: kycData.geotagLatitude,
        geotag_lng: kycData.geotagLongitude,
        simplisia_offered: kycData.simplisiaOffered,
        cultivation_method: kycData.cultivationMethod,
        monthly_capacity_kg: kycData.monthlyCapacityKg,
      });
      if (sellerKycError) throw sellerKycError;
    }

    // Add role via SECURITY DEFINER RPC (only buyer/seller permitted)
    const { error: roleError } = await supabase.rpc("assign_role_to_self", { _role: role });
    if (roleError) throw roleError;
  },
};
