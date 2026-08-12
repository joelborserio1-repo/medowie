-- ---------------------------------------------------------------------------
-- The homepage hero video file was replaced with new footage. The previous
-- 12-second start trim (set in 0005) was calibrated for that specific old
-- clip's slow opening and has no bearing on the new one, so reset it to
-- play from the start. Adjust again via Admin -> Settings if the new
-- footage needs its own trim once it's visible live.
-- ---------------------------------------------------------------------------

update site_settings set hero_video_start_seconds = null
where id = true;
