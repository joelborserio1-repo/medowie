-- ---------------------------------------------------------------------------
-- Rewrite storage.objects policies as one explicit policy per bucket per
-- operation, instead of 4 shared policies each using
-- `bucket_id in ('stallions', 'horses-for-sale', ...)`.
--
-- The original shared policies were functionally correct — Postgres RLS
-- evaluates `in (...)` against every row regardless of which bucket it's
-- in — but Supabase's dashboard only attributed them to the first-listed
-- bucket ('stallions') in its per-bucket policy count, showing 4 policies
-- for stallions and 0 for every other bucket. That was investigated after
-- an upload to the 'news' bucket failed (ultimately traced to the project
-- having auto-paused from inactivity, not a policy gap) — this migration
-- removes any remaining doubt by giving every bucket its own real,
-- individually-counted policies.
-- ---------------------------------------------------------------------------

drop policy if exists storage_public_read on storage.objects;
drop policy if exists storage_admin_insert on storage.objects;
drop policy if exists storage_admin_update on storage.objects;
drop policy if exists storage_admin_delete on storage.objects;

do $$
declare
  bucket text;
  suffix text;
begin
  foreach bucket in array array['stallions', 'horses-for-sale', 'yearlings', 'training', 'news', 'documents', 'general']
  loop
    suffix := replace(bucket, '-', '_');

    execute format('drop policy if exists %I on storage.objects', 'storage_' || suffix || '_read');
    execute format('drop policy if exists %I on storage.objects', 'storage_' || suffix || '_insert');
    execute format('drop policy if exists %I on storage.objects', 'storage_' || suffix || '_update');
    execute format('drop policy if exists %I on storage.objects', 'storage_' || suffix || '_delete');

    execute format(
      'create policy %I on storage.objects for select using (bucket_id = %L)',
      'storage_' || suffix || '_read', bucket
    );
    execute format(
      'create policy %I on storage.objects for insert with check (bucket_id = %L and is_admin())',
      'storage_' || suffix || '_insert', bucket
    );
    execute format(
      'create policy %I on storage.objects for update using (bucket_id = %L and is_admin())',
      'storage_' || suffix || '_update', bucket
    );
    execute format(
      'create policy %I on storage.objects for delete using (bucket_id = %L and is_admin())',
      'storage_' || suffix || '_delete', bucket
    );
  end loop;
end $$;
