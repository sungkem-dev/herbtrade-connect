-- Atomic role switch + KYC verification RPC.
-- When a user submits a fresh KYC for buyer or seller, this clears any
-- previously self-assigned trade role (buyer/seller) so the active role
-- always matches the latest KYC submission, then verifies the profile.
CREATE OR REPLACE FUNCTION public.set_active_trade_role(_role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF _role NOT IN ('buyer','seller') THEN
    RAISE EXCEPTION 'Role % cannot be self-assigned', _role;
  END IF;

  -- Remove any previously held trade role (buyer/seller) for this user.
  DELETE FROM public.user_roles
  WHERE user_id = auth.uid()
    AND role IN ('buyer','seller');

  -- Assign the freshly selected trade role.
  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), _role);

  -- Auto-verify KYC status (review step intentionally disabled).
  UPDATE public.profiles
  SET kyc_status = 'verified'
  WHERE id = auth.uid();
END;
$$;

REVOKE ALL ON FUNCTION public.set_active_trade_role(app_role) FROM public;
GRANT EXECUTE ON FUNCTION public.set_active_trade_role(app_role) TO authenticated;