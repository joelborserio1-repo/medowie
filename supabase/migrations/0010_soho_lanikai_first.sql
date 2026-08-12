-- ---------------------------------------------------------------------------
-- List Soho Lanikai first on the stallions page, per the owner's request.
-- The public listing and homepage grid both sort by display_order
-- ascending, so 0 puts him ahead of every other stallion (lowest existing
-- value was 1).
-- ---------------------------------------------------------------------------

update stallions set display_order = 0
where slug = 'soho-lanikai';
