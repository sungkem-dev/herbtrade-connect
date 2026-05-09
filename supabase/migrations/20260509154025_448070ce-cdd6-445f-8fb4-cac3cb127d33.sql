
-- Fix PRIVILEGE_ESCALATION: buyer_requests seller-bypass
-- Use verified seller role from user_roles instead of seller_admin_profiles existence
DROP POLICY IF EXISTS "Buyers see own requests; sellers see all open requests" ON public.buyer_requests;

CREATE POLICY "Buyers see own requests; verified sellers see open requests"
ON public.buyer_requests
FOR SELECT
USING (
  auth.uid() = buyer_id
  OR (
    status = 'open'
    AND public.has_role(auth.uid(), 'seller'::app_role)
  )
);

-- Fix MISSING_RLS_PROTECTION: verification_history insert open to any authed user
DROP POLICY IF EXISTS "Authenticated users can insert verification history." ON public.verification_history;

CREATE POLICY "Only sellers or admins can insert verification history"
ON public.verification_history
FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'seller'::app_role)
  OR public.has_role(auth.uid(), 'admin'::app_role)
);
