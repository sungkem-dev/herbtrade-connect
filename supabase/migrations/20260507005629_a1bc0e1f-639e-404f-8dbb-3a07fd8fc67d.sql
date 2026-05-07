
-- 1. profiles: remove public read
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- 2. user_roles: remove self-insert/self-delete (privilege escalation)
DROP POLICY IF EXISTS "Allow individual insert access" ON public.user_roles;
DROP POLICY IF EXISTS "Allow individual delete access" ON public.user_roles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);
-- INSERT/DELETE: no policies → only service_role / SECURITY DEFINER functions can write.

-- Helper SECURITY DEFINER function to assign a role to the current user during KYC submission.
CREATE OR REPLACE FUNCTION public.assign_role_to_self(_role public.app_role)
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
  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), _role)
  ON CONFLICT DO NOTHING;
END;
$$;
REVOKE ALL ON FUNCTION public.assign_role_to_self(public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.assign_role_to_self(public.app_role) TO authenticated;

-- 3. request_matches: restrict reads
DROP POLICY IF EXISTS "Request matches are viewable by everyone." ON public.request_matches;
CREATE POLICY "Buyers and matched suppliers can view request matches"
ON public.request_matches FOR SELECT
USING (
  auth.uid() = supplier_id
  OR EXISTS (
    SELECT 1 FROM public.buyer_requests br
    WHERE br.id = request_matches.request_id AND br.buyer_id = auth.uid()
  )
);

-- 4. Fix has_role search_path
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
END;
$$;
