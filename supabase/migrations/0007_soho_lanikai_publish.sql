-- ---------------------------------------------------------------------------
-- Soho Lanikai — published live at the client's explicit request, despite
-- the flyer/HarnessLink profile not confirming current-season standing
-- status (see 0005/0006 comments). This overrides that earlier caution
-- because it's now a direct instruction, not a guess.
-- ---------------------------------------------------------------------------

update stallions set status = 'published'
where slug = 'soho-lanikai';
