-- Add an optional New Zealand service fee (NZD) alongside the existing AUD fee.
-- Nullable so existing stallions are unaffected; the UI shows both when present.
alter table public.stallions
  add column if not exists service_fee_nz numeric;

comment on column public.stallions.service_fee_nz is 'Optional NZ service fee (NZD). Displayed alongside the AUD service_fee.';
