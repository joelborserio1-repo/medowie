-- Medowie Lodge — page content upgrades
-- Adds: homepage hero video controls, and a flexible `meta` column on
-- site_content_blocks for page-specific structured extras (taglines,
-- stat callouts, small repeatable feature lists) that don't warrant a
-- dedicated table of their own.

alter table site_settings
  add column hero_video_url text,
  add column hero_video_start_seconds numeric(6, 2),
  add column hero_video_end_seconds numeric(6, 2);

alter table site_content_blocks
  add column meta jsonb not null default '{}'::jsonb;

comment on column site_content_blocks.meta is
  'Flexible per-block extras, e.g. {"tagline": "...", "features": [{"heading": "...", "body": "..."}]}';
