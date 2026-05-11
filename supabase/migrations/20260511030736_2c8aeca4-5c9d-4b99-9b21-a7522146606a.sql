
-- 1. Recreate suppliers view with security_invoker (Postgres 15+) to avoid SECURITY DEFINER view warning
DROP VIEW IF EXISTS public.suppliers;
CREATE VIEW public.suppliers
WITH (security_invoker = true) AS
SELECT
  p.id,
  p.name,
  p.email,
  p.company,
  p.country,
  p.avatar_url,
  p.kyc_status,
  p.created_at
FROM public.profiles p
JOIN public.user_roles ur ON p.id = ur.user_id
WHERE ur.role = 'seller'::app_role;

-- 2. Tighten verification_history INSERT: must be the seller who created the batch, or an admin
DROP POLICY IF EXISTS "Only sellers or admins can insert verification history" ON public.verification_history;
CREATE POLICY "Batch owners or admins can insert verification history"
ON public.verification_history
FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.product_batches pb
    WHERE pb.id = verification_history.batch_id
      AND pb.created_by = auth.uid()
      AND public.has_role(auth.uid(), 'seller'::app_role)
  )
);

-- 3. seller_admin_profiles: replace ALL policy with explicit per-command policies including WITH CHECK
DROP POLICY IF EXISTS "Sellers can view and update their own admin profile." ON public.seller_admin_profiles;
CREATE POLICY "Sellers select own admin profile"
  ON public.seller_admin_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Sellers insert own admin profile"
  ON public.seller_admin_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Sellers update own admin profile"
  ON public.seller_admin_profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Sellers delete own admin profile"
  ON public.seller_admin_profiles FOR DELETE USING (auth.uid() = user_id);
