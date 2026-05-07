
-- 1. product_batches: add owner column + scope UPDATE/INSERT to that owner
ALTER TABLE public.product_batches
  ADD COLUMN IF NOT EXISTS created_by uuid;

-- Backfill existing rows to the first matching seller_admin_profiles owner if available
UPDATE public.product_batches pb
SET created_by = sap.user_id
FROM public.seller_admin_profiles sap
WHERE pb.created_by IS NULL
  AND sap.user_id IS NOT NULL
  AND pb.farmer_id = sap.user_id::text;

DROP POLICY IF EXISTS "Sellers can update their own product batches." ON public.product_batches;
DROP POLICY IF EXISTS "Authenticated sellers can insert their own product batches." ON public.product_batches;

CREATE POLICY "Sellers can insert their own product batches"
ON public.product_batches FOR INSERT
WITH CHECK (
  auth.uid() = created_by
  AND EXISTS (SELECT 1 FROM public.seller_admin_profiles sap WHERE sap.user_id = auth.uid())
);

CREATE POLICY "Sellers can update only their own product batches"
ON public.product_batches FOR UPDATE
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- 2. buyer_requests: restrict reads
DROP POLICY IF EXISTS "Buyer requests are viewable by everyone." ON public.buyer_requests;
CREATE POLICY "Buyers see own requests; sellers see all open requests"
ON public.buyer_requests FOR SELECT
USING (
  auth.uid() = buyer_id
  OR EXISTS (SELECT 1 FROM public.seller_admin_profiles sap WHERE sap.user_id = auth.uid())
);
