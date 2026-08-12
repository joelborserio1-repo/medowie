-- ---------------------------------------------------------------------------
-- Muscle M Up — a seventh stallion standing at Medowie Lodge, not
-- previously in the database. Sourced from client-supplied screenshots of
-- his HarnessLink directory profile (harnesslink.com/directory/stallion/...
-- /muscle-m-up/ — that domain is blocked by this environment's network
-- egress and could not be fetched directly).
--
-- Career earnings ($US195,233) are in US dollars per the page's own "$US"
-- prefix, from his US racing career before standing in Australia — noted
-- in the biography text since the `career_earnings` column doesn't carry
-- a currency. "Nine times placed" isn't broken out into seconds/thirds on
-- the source page, so those two columns are left null rather than split
-- by guesswork. No photo file was supplied (only a screenshot of the
-- webpage), so no gallery/hero image is set here — add real photos via
-- Admin -> Media once available. Published directly per the owner's
-- explicit "make it live" instruction earlier in this session.
-- ---------------------------------------------------------------------------

insert into stallions (
  name, slug, status, gait, colour, sire, dam, damsire,
  service_fee, includes_gst, mile_rate, career_earnings, starts, wins,
  headline, short_description, full_biography, display_order
) values (
  'Muscle M Up',
  'muscle-m-up',
  'published',
  'Trotter',
  'Bay',
  'Muscle Hill',
  'Fashion Athena',
  'Broadway Hall',
  1650,
  true,
  '1:51.4',
  195233,
  41,
  12,
  'Son of Muscle Hill',
  'Standing at Medowie Lodge. A son of Muscle Hill, out of Fashion Athena, with a record of 1:51.4 and $US195,233 in career stakes.',
  $body$Muscle M Up, who had a record of 1:51.4, was a smart racehorse in his own right. From 41 starts he won 12 and was nine times placed for $US195,233 in stakes. He was not extensively raced as a juvenile, winning two of his three starts including a division of the Pennsylvania Sires Stake, while at three he took a record of 1:54.8. Muscle M Up showed that he was up to the best horses of his time, winning in free-for-all company as a four-year-old when he took his mark of 1:51.4 in a $50,000 leg of the Graduate Series at The Meadowlands with the final quarter in a stunning 26.2. After finishing second in another leg, he was race-timed in a sensational 1:50 racing against Atlanta, Manchego, Six Pack and co in the world record-breaking $250,000 Graduate Final. Champion trainer Ake Svanstedt, who trained Muscle M Up, said: "He was a real racehorse. He had a very good heart."

Foaled 2015.$body$,
  7
)
on conflict (slug) do nothing;

insert into stallion_highlights (stallion_id, race, track, result, notes, display_order)
select s.id, 'Graduate Series (leg)', 'The Meadowlands', 'Won in 1:51.4', '$50,000 leg, free-for-all company, age 4 — final quarter in 26.2.', 1
from stallions s where s.slug = 'muscle-m-up'
and not exists (select 1 from stallion_highlights h where h.stallion_id = s.id and h.race = 'Graduate Series (leg)');

insert into stallion_highlights (stallion_id, race, track, result, notes, display_order)
select s.id, 'Graduate Final', 'The Meadowlands', '2nd, race-timed in 1:50', '$250,000 world-record-breaking final, against Atlanta, Manchego, Six Pack and co.', 2
from stallions s where s.slug = 'muscle-m-up'
and not exists (select 1 from stallion_highlights h where h.stallion_id = s.id and h.race = 'Graduate Final');

insert into stallion_highlights (stallion_id, race, result, notes, display_order)
select s.id, 'Pennsylvania Sires Stake (division)', 'Won', 'As a 2yo, won two of his three starts including this division.', 3
from stallions s where s.slug = 'muscle-m-up'
and not exists (select 1 from stallion_highlights h where h.stallion_id = s.id and h.race = 'Pennsylvania Sires Stake (division)');

insert into stallion_pedigree (stallion_id, sires_sire, sires_dam, dams_sire, dams_dam, extended)
select
  s.id,
  'Muscles Yankee',
  'Yankee Blondie',
  'Broadway Hall',
  'Athena Hanover',
  jsonb_build_object(
    'sires_sires_sire', 'Valley Victory',
    'sires_sires_dam', 'Maiden Yankee',
    'sires_dams_sire', 'American Winner',
    'sires_dams_dam', 'Yankee Bambi',
    'dams_sires_sire', 'Conway Hall',
    'dams_sires_dam', 'B Cor Tamgo',
    'dams_dams_sire', 'Tagliabue',
    'dams_dams_dam', 'Atavistic Hanover'
  )
from stallions s
where s.slug = 'muscle-m-up'
on conflict (stallion_id) do update set
  sires_sire = excluded.sires_sire,
  sires_dam = excluded.sires_dam,
  dams_sire = excluded.dams_sire,
  dams_dam = excluded.dams_dam,
  extended = excluded.extended;
