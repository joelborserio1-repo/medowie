-- Medowie Lodge — Row Level Security
-- Public: read published content only. Admin (listed in admin_users): full CRUD.
-- Enquiries: anon may INSERT only; only admins may SELECT/UPDATE.

create or replace function is_admin() returns boolean as $$
  select exists (
    select 1 from admin_users where id = auth.uid()
  );
$$ language sql security definer stable;

-- ---------------------------------------------------------------------------
alter table admin_users enable row level security;
create policy admin_users_self_read on admin_users for select
  using (auth.uid() = id or is_admin());

-- ---------------------------------------------------------------------------
alter table site_settings enable row level security;
create policy site_settings_public_read on site_settings for select using (true);
create policy site_settings_admin_write on site_settings for update using (is_admin());

-- ---------------------------------------------------------------------------
alter table site_content_blocks enable row level security;
create policy site_content_public_read on site_content_blocks for select
  using (status = 'published' or is_admin());
create policy site_content_admin_write on site_content_blocks for insert with check (is_admin());
create policy site_content_admin_update on site_content_blocks for update using (is_admin());
create policy site_content_admin_delete on site_content_blocks for delete using (is_admin());

-- ---------------------------------------------------------------------------
alter table stallions enable row level security;
create policy stallions_public_read on stallions for select
  using (status = 'published' or is_admin());
create policy stallions_admin_write on stallions for insert with check (is_admin());
create policy stallions_admin_update on stallions for update using (is_admin());
create policy stallions_admin_delete on stallions for delete using (is_admin());

-- child tables of stallions: readable when parent is published (or admin)
create policy stallion_highlights_read on stallion_highlights for select
  using (exists (select 1 from stallions s where s.id = stallion_id and (s.status = 'published' or is_admin())));
create policy stallion_highlights_write on stallion_highlights for all using (is_admin()) with check (is_admin());

create policy stallion_eligibility_read on stallion_eligibility for select
  using (exists (select 1 from stallions s where s.id = stallion_id and (s.status = 'published' or is_admin())));
create policy stallion_eligibility_write on stallion_eligibility for all using (is_admin()) with check (is_admin());

create policy stallion_gallery_read on stallion_gallery for select
  using (exists (select 1 from stallions s where s.id = stallion_id and (s.status = 'published' or is_admin())));
create policy stallion_gallery_write on stallion_gallery for all using (is_admin()) with check (is_admin());

create policy stallion_videos_read on stallion_videos for select
  using (exists (select 1 from stallions s where s.id = stallion_id and (s.status = 'published' or is_admin())));
create policy stallion_videos_write on stallion_videos for all using (is_admin()) with check (is_admin());

create policy stallion_documents_read on stallion_documents for select
  using (exists (select 1 from stallions s where s.id = stallion_id and (s.status = 'published' or is_admin())));
create policy stallion_documents_write on stallion_documents for all using (is_admin()) with check (is_admin());

create policy stallion_progeny_read on stallion_progeny for select
  using (exists (select 1 from stallions s where s.id = stallion_id and (s.status = 'published' or is_admin())));
create policy stallion_progeny_write on stallion_progeny for all using (is_admin()) with check (is_admin());

create policy stallion_pedigree_read on stallion_pedigree for select
  using (exists (select 1 from stallions s where s.id = stallion_id and (s.status = 'published' or is_admin())));
create policy stallion_pedigree_write on stallion_pedigree for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
alter table horses_for_sale enable row level security;
create policy horses_public_read on horses_for_sale for select
  using (status <> 'archive' or is_admin());
create policy horses_admin_write on horses_for_sale for insert with check (is_admin());
create policy horses_admin_update on horses_for_sale for update using (is_admin());
create policy horses_admin_delete on horses_for_sale for delete using (is_admin());

create policy horse_gallery_read on horse_gallery for select
  using (exists (select 1 from horses_for_sale h where h.id = horse_id and (h.status <> 'archive' or is_admin())));
create policy horse_gallery_write on horse_gallery for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
alter table results enable row level security;
create policy results_public_read on results for select using (status = 'published' or is_admin());
create policy results_admin_write on results for insert with check (is_admin());
create policy results_admin_update on results for update using (is_admin());
create policy results_admin_delete on results for delete using (is_admin());

-- ---------------------------------------------------------------------------
alter table news enable row level security;
create policy news_public_read on news for select using (status = 'published' or is_admin());
create policy news_admin_write on news for insert with check (is_admin());
create policy news_admin_update on news for update using (is_admin());
create policy news_admin_delete on news for delete using (is_admin());

-- ---------------------------------------------------------------------------
alter table documents enable row level security;
create policy documents_public_read on documents for select using (active or is_admin());
create policy documents_admin_write on documents for insert with check (is_admin());
create policy documents_admin_update on documents for update using (is_admin());
create policy documents_admin_delete on documents for delete using (is_admin());

-- ---------------------------------------------------------------------------
alter table enquiries enable row level security;
create policy enquiries_anon_insert on enquiries for insert with check (true);
create policy enquiries_admin_read on enquiries for select using (is_admin());
create policy enquiries_admin_update on enquiries for update using (is_admin());
create policy enquiries_admin_delete on enquiries for delete using (is_admin());

alter table enquiry_notes enable row level security;
create policy enquiry_notes_admin_all on enquiry_notes for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
alter table media_assets enable row level security;
create policy media_assets_public_read on media_assets for select using (true);
create policy media_assets_admin_write on media_assets for insert with check (is_admin());
create policy media_assets_admin_update on media_assets for update using (is_admin());
create policy media_assets_admin_delete on media_assets for delete using (is_admin());

-- ---------------------------------------------------------------------------
-- Storage buckets + policies (public read, admin write)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values
  ('stallions', 'stallions', true),
  ('horses-for-sale', 'horses-for-sale', true),
  ('yearlings', 'yearlings', true),
  ('training', 'training', true),
  ('news', 'news', true),
  ('documents', 'documents', true),
  ('general', 'general', true)
on conflict (id) do nothing;

create policy storage_public_read on storage.objects for select
  using (bucket_id in ('stallions', 'horses-for-sale', 'yearlings', 'training', 'news', 'documents', 'general'));

create policy storage_admin_insert on storage.objects for insert
  with check (
    bucket_id in ('stallions', 'horses-for-sale', 'yearlings', 'training', 'news', 'documents', 'general')
    and is_admin()
  );

create policy storage_admin_update on storage.objects for update
  using (
    bucket_id in ('stallions', 'horses-for-sale', 'yearlings', 'training', 'news', 'documents', 'general')
    and is_admin()
  );

create policy storage_admin_delete on storage.objects for delete
  using (
    bucket_id in ('stallions', 'horses-for-sale', 'yearlings', 'training', 'news', 'documents', 'general')
    and is_admin()
  );
