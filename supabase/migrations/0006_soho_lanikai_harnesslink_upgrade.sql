-- ---------------------------------------------------------------------------
-- Soho Lanikai — fills in the gaps left by the promotional flyer (0005)
-- using his HarnessLink directory profile, supplied by the client as
-- screenshots of https://harnesslink.com/directory/stallion/1168/soho-lanikai/
-- (that domain is blocked by this environment's network egress and could
-- not be fetched directly).
--
-- New facts this adds: the dam's actual name (the flyer only said "a Group
-- 1 winning mare"), colour, full four-name pedigree plus a third
-- generation, the exact race name/margin/time for his sole highlight, and
-- career-summary numbers (earnings, starts, wins) read off the page's
-- summary line "SOMEBEACHSOMEWHERE x OBAHMA JOY - $13,680 - 2, 1:54.0M",
-- interpreted per HarnessLink's standard format as career earnings,
-- starts, and best mile rate. Foaling year (2017) is noted in the
-- biography text rather than `foaled_date`, since only the year — not an
-- exact date — is shown. Service fee, gait and mile rate already matched
-- exactly, confirming this is the same horse as the flyer.
-- ---------------------------------------------------------------------------

update stallions set
  dam = 'Obahma Joy',
  damsire = 'American Ideal',
  colour = 'Brown',
  mile_rate = '1:54.0',
  career_earnings = 13680,
  starts = 2,
  wins = 1,
  short_description = 'Standing at Medowie Lodge. A son of Somebeachsomewhere, out of the Group 1-winning mare Obahma Joy, with 70% winners to starters.',
  full_biography = $body$Extremely well-bred, Soho Lanikai made an emphatic start to his racing career, winning the Express Premiere Stakes on debut by an extraordinary 65.2 metres in a time of 1:54.0. Unfortunately, injury subsequently curtailed what had shaped as a highly promising racing career.

Foaled 2017, brown.$body$
where slug = 'soho-lanikai';

update stallion_highlights set
  race = 'Express Premiere Stakes',
  result = 'Won by 65.2 metres in 1:54.0',
  notes = 'First and only start of his career — a devastating debut performance, showing natural speed, brilliance and raw ability, before injury curtailed what had shaped as a highly promising racing career.'
where stallion_id = (select id from stallions where slug = 'soho-lanikai');

insert into stallion_pedigree (stallion_id, sires_sire, sires_dam, dams_sire, dams_dam, extended)
select
  s.id,
  'Mach Three',
  'Wheres The Beach',
  'American Ideal',
  'Kirrilee Joy',
  jsonb_build_object(
    'sires_sires_sire', 'Matt''s Scooter',
    'sires_sires_dam', 'All Included',
    'sires_dams_sire', 'Beach Towel',
    'sires_dams_dam', 'Where''s Sarah',
    'dams_sires_sire', 'Western Ideal',
    'dams_sires_dam', 'Lifetime Success',
    'dams_dams_sire', 'Safely Kept',
    'dams_dams_dam', 'Intrude'
  )
from stallions s
where s.slug = 'soho-lanikai'
on conflict (stallion_id) do update set
  sires_sire = excluded.sires_sire,
  sires_dam = excluded.sires_dam,
  dams_sire = excluded.dams_sire,
  dams_dam = excluded.dams_dam,
  extended = excluded.extended;
