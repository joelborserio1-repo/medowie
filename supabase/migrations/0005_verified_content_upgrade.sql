-- Medowie Lodge — verified content upgrade
--
-- Adds everything gathered directly from the client after the initial
-- 0003 seed: the hero video's start time, the full About page narrative
-- (supplied verbatim by the client), the Yearling Preparation flyer's
-- copy/stats/features, the Training page's still-empty sections left as
-- drafts, and the Soho Lanikai stallion from his own promotional flyer.
-- Uses upsert (on conflict do update) so it can safely overwrite the
-- earlier placeholder/draft rows from 0003 without erroring, and is safe
-- to re-run.

update site_settings set
  hero_video_start_seconds = 12
where id = true and hero_video_start_seconds is null;

-- Superseded by the richer content blocks below: about_breeding/training/
-- region were empty draft placeholders that got dedicated keys instead
-- (about_stud_services, about_race_training, about_hunter_region), and
-- yearling_preparation_intro is the same copy now living under
-- yearling_intro (which also carries the tagline/stat/features).
delete from site_content_blocks
where key in ('about_breeding', 'about_training', 'about_region', 'yearling_preparation_intro');

-- ---------------------------------------------------------------------------
-- Yearling Preparation — real flyer copy, tagline, "30 years experience"
-- stat and the four feature blocks, all read directly off the flyer image
-- the client supplied.
-- ---------------------------------------------------------------------------

insert into site_content_blocks (key, label, heading, body, status, meta) values (
  'yearling_intro',
  'Yearling Preparation — Introduction',
  'Yearling Preparation',
  $body$Medowie Lodge presents well-bred, hand-raised yearlings annually at both the Sydney APG Yearling Sale and the Bathurst Yearling Sale, held during February and March each year.

Give your yearling the best start to their future with expert preparation and proven results.$body$,
  'published',
  jsonb_build_object(
    'tagline', 'Experience. Dedication. Results.',
    'years_experience', 30,
    'features', jsonb_build_array(
      jsonb_build_object('heading', 'Expert Handling & Training', 'body', 'Building confidence, manners and foundation.'),
      jsonb_build_object('heading', 'Fitness & Development', 'body', 'Tailored programs to improve strength, balance & coordination.'),
      jsonb_build_object('heading', 'Prepared for Success', 'body', 'Setting your yearling up for the sales ring and beyond.'),
      jsonb_build_object('heading', 'Professional Photos & Videos', 'body', 'High quality content to showcase your yearling at their best.')
    )
  )
)
on conflict (key) do update set
  heading = excluded.heading,
  body = excluded.body,
  status = excluded.status,
  meta = excluded.meta;

-- ---------------------------------------------------------------------------
-- About page — the complete narrative supplied directly by the client,
-- formatted into the site's section structure. Twelve blocks in reading
-- order: intro, Darren Reay, then the nine section essays, ending with
-- the closing "Built on Experience" section.
-- ---------------------------------------------------------------------------

insert into site_content_blocks (key, label, heading, body, status, meta) values
(
  'about_intro',
  'About — Introduction',
  'About Medowie Lodge',
  $body$Medowie Lodge is a proudly Australian Standardbred operation based in Medowie, in the Hunter Region of New South Wales.

Built around practical horsemanship, experience and a genuine understanding of the racing industry, Medowie Lodge provides a complete range of services across breeding, breaking-in, yearling preparation and race training.$body$,
  'published',
  jsonb_build_object('tagline', 'Experience. Dedication. Results.')
),
(
  'about_darren',
  'About — Darren Reay & Family',
  'Darren Reay & Family',
  $body$At the centre of the operation is Darren Reay, a licensed Harness Racing trainer with decades of experience working with Standardbreds at every stage of their development. Over the years, Darren has built a reputation for being hands-on, consistent and highly attentive to the individual needs of each horse.

The philosophy at Medowie Lodge is straightforward: every horse is different, and every horse deserves to be prepared accordingly.

Whether a young horse is taking its first steps through the breaking-in process, a yearling is being prepared for the sales ring, a racehorse is progressing through its training program, or a stallion is standing for the breeding season, the focus remains the same: good care, good foundations and professional preparation.$body$,
  'published',
  '{}'::jsonb
),
(
  'about_complete_operation',
  'About — A Complete Standardbred Operation',
  'A Complete Standardbred Operation',
  $body$One of the strengths of Medowie Lodge is the ability to provide multiple services from the one property.

The operation combines stud services, yearling preparation, breaking-in and race training, allowing horses to remain within a familiar and professionally managed environment throughout different stages of their development.

For owners and breeders, this provides continuity.

The people handling the horse understand its history, temperament, strengths and individual requirements. Training and preparation can be adjusted as the horse develops, rather than taking a one-size-fits-all approach.

This continuity is particularly valuable with young horses, where consistent handling and good early experiences can have a significant impact on their confidence and future performance.$body$,
  'published',
  '{}'::jsonb
),
(
  'about_experience',
  'About — Experience That Comes From Doing The Work',
  'Experience That Comes From Doing The Work',
  $body$Medowie Lodge is not built around theory.

It is built around years spent working with horses every day.

That experience covers the full process, from handling young stock and preparing yearlings through to educating horses in harness and conditioning racehorses for competition.

Darren and the Medowie Lodge team understand that successful preparation is often found in the small details: knowing when a horse needs to be pushed forward, when it needs more time, when something feels different and when a program needs to be adjusted.

There are no shortcuts to producing a well-prepared horse.

It takes time, patience, consistency and experienced hands.

That is the standard Medowie Lodge works towards with every horse that comes through the property.$body$,
  'published',
  '{}'::jsonb
),
(
  'about_breaking_in',
  'About — Breaking-In and Early Education',
  'Breaking-In and Early Education',
  $body$The breaking-in stage is one of the most important parts of a young Standardbred's development.

At Medowie Lodge, the emphasis is on creating confident, manageable horses with a solid foundation for their future racing careers.

Young horses are introduced progressively to the equipment, routine and expectations that will become part of their working life.

Rather than rushing the process, horses are given the opportunity to understand what is being asked of them.

Good early education should produce a horse that is willing, confident and comfortable in its work.

The aim is not simply to get a horse into harness.

The aim is to give that horse the best possible foundation to move forward into training.$body$,
  'published',
  '{}'::jsonb
),
(
  'about_race_training',
  'About — Race Training',
  'Race Training',
  $body$Darren Reay is a licensed Harness Racing trainer preparing Standardbreds from the Medowie property.

Training programs are developed around the individual horse, taking into consideration its age, experience, fitness, temperament and stage of preparation.

From young horses beginning their first racing campaign through to experienced racehorses returning to work, the focus is on building fitness progressively while maintaining soundness and confidence.

The team takes a practical approach to training, paying close attention to how each horse is coping physically and mentally throughout its preparation.

Race day may be the final destination, but the work that happens in the weeks and months beforehand is what creates the opportunity to perform.$body$,
  'published',
  '{}'::jsonb
),
(
  'about_yearling_preparation',
  'About — Yearling Preparation',
  'Yearling Preparation',
  $body$Medowie Lodge prepares Standardbred yearlings for presentation at major sales including the Sydney APG and Bathurst yearling sales.

Yearling preparation begins well before the horse enters the sales ring.

Horses are handled regularly and introduced to a structured routine designed to improve their manners, fitness, presentation and confidence.

The goal is to have each yearling arrive at the sales prepared to present professionally and show itself at its best.

Attention is given to conditioning, handling, grooming, movement and overall presentation.

For buyers, first impressions matter.

For breeders and vendors, presenting a yearling well is an important part of showcasing the work that has gone into producing that horse.

Medowie Lodge treats that responsibility seriously.$body$,
  'published',
  '{}'::jsonb
),
(
  'about_stud_services',
  'About — Stud Services',
  'Stud Services',
  $body$Medowie Lodge also stands Standardbred stallions during the breeding season.

Depending on the stallion and availability, services may include chilled semen, frozen semen and on-property natural cover.

The stud operation is managed with the same practical and professional approach applied throughout the rest of the property.

Breeders can expect clear communication, experienced handling and a strong focus on the welfare of both stallions and mares throughout the breeding process.

The aim is to make breeding arrangements as straightforward as possible while maintaining a high standard of care.$body$,
  'published',
  '{}'::jsonb
),
(
  'about_horse_welfare',
  'About — Horse Welfare Comes First',
  'Horse Welfare Comes First',
  $body$While racing and sales are results-driven industries, Medowie Lodge believes those results begin with the way horses are cared for.

Horse welfare is central to the operation.

Every horse is monitored closely and treated as an individual.

Training, handling and preparation programs are adapted where necessary based on the horse's condition, temperament and progress.

Good horsemanship means understanding when to ask for more and when to give a horse time.

It means creating routines that allow horses to thrive physically and mentally.

Most importantly, it means never losing sight of the fact that the horse comes first.$body$,
  'published',
  '{}'::jsonb
),
(
  'about_hands_on',
  'About — A Hands-On Approach',
  'A Hands-On Approach',
  $body$Medowie Lodge remains a genuinely hands-on operation.

Darren and the team are directly involved in the day-to-day management, handling and preparation of the horses in their care.

That means owners and breeders are dealing with people who know their horses.

They understand how they are progressing, how they are behaving and what stage they are at within their program.

For owners, that level of involvement provides confidence.

For the horses, it provides consistency.$body$,
  'published',
  '{}'::jsonb
),
(
  'about_hunter_region',
  'About — Based in the Hunter Region',
  'Based in the Hunter Region',
  $body$Located at Medowie, NSW, Medowie Lodge is positioned within the Hunter Region and provides services to owners and breeders from across New South Wales and beyond.

The property brings together the facilities required for breeding, education, preparation and training within the one operation.

It allows horses to be managed within a dedicated equine environment while remaining within convenient reach of major harness racing and sales centres.$body$,
  'published',
  '{}'::jsonb
),
(
  'about_built_on_experience',
  'About — Built on Experience. Focused on the Future.',
  'Built on Experience. Focused on the Future.',
  $body$For Medowie Lodge, the objective has always been bigger than preparing a horse for one race or one sale.

It is about giving horses the foundations they need for the next stage of their career.

A well-handled yearling becomes easier to educate.

A well-educated young horse becomes easier to train.

A well-prepared racehorse is given the opportunity to perform at its best.

That progression is what Medowie Lodge is built around.

From the breeding barn to the sales ring and the racetrack, Medowie Lodge provides experienced, professional care through every stage of the Standardbred journey.$body$,
  'published',
  '{}'::jsonb
)
on conflict (key) do update set
  heading = excluded.heading,
  body = excluded.body,
  status = excluded.status,
  meta = excluded.meta;

-- ---------------------------------------------------------------------------
-- Soho Lanikai — supplied as a dedicated Medowie Lodge promotional flyer
-- (service fee, race result and pedigree facts read directly from it).
-- The flyer carries no date, so — consistent with the other five stallions
-- — current-season standing status can't be confirmed and this is seeded
-- as admin_review rather than published. The dam's name was not given on
-- the flyer (only "a Group 1 winning mare"), so `dam` is left null rather
-- than guessed.
-- ---------------------------------------------------------------------------

insert into stallions (
  name, slug, status, gait, sire, service_fee, includes_gst, mile_rate, headline, short_description, display_order
) values (
  'Soho Lanikai',
  'soho-lanikai',
  'admin_review',
  'Pacer',
  'Somebeachsomewhere',
  2000,
  true,
  '1:54',
  'Son of Somebeachsomewhere',
  'Standing at Medowie Lodge. A son of Somebeachsomewhere, out of a Group 1-winning mare, with 70% winners to starters.',
  6
)
on conflict (slug) do nothing;

insert into stallion_highlights (stallion_id, race, result, notes, display_order)
select s.id, 'First start', 'Won by 65 metres in 1:54', 'A devastating first-up performance, showing natural speed, brilliance and raw ability.', 1
from stallions s
where s.slug = 'soho-lanikai'
  and not exists (select 1 from stallion_highlights h where h.stallion_id = s.id);
