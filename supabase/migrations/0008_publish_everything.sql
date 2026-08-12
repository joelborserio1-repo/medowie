-- ---------------------------------------------------------------------------
-- Publish everything currently gated behind /admin, at the owner's explicit
-- request — overriding the earlier "leave unconfirmed content in
-- admin_review/draft" caution from 0003/0005 (see those migrations'
-- comments for why each record started out gated).
--
-- No data is changed here, only visibility: the five original stallions
-- (Tiger Tara, Follow the Stars, Timothy Red, My High Expectations, My
-- Chaching Chaching) go from admin_review to published, and the draft
-- content blocks (all still empty — nothing written for them yet) go to
-- published too, which has no visible effect until staff add real copy in
-- /admin, since the frontend hides any block with no body.
-- ---------------------------------------------------------------------------

update stallions set status = 'published'
where status = 'admin_review';

update site_content_blocks set status = 'published'
where status = 'draft';
