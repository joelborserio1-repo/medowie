-- Medowie Lodge — verified content seed
--
-- Every value below was taken verbatim (or lightly copy-edited for grammar
-- only) from the live medowielodge.com.au site or its Facebook page as of
-- the migration date. Nothing here is invented. Fields that could not be
-- verified (service fees, full biographies, statistics, pedigree detail,
-- images, current-season status) are left NULL or set to 'admin_review' so
-- staff can confirm and publish them from /admin rather than the public
-- site showing guessed information.

update site_settings set
  business_name = 'Medowie Lodge',
  tagline = 'Standardbred Stud & Racing Stables',
  phone = '0429 817 199',
  email = 'medowielodge@bigpond.com',
  address_line1 = '951 Richardson Road',
  suburb = 'Medowie',
  state = 'NSW',
  postcode = '2318',
  facebook_url = 'https://www.facebook.com/medowielodge',
  enquiry_recipient_email = 'medowielodge@bigpond.com',
  seo_default_title = 'Medowie Lodge — Standardbred Stud & Harness Racing Stables, NSW',
  seo_default_description = 'Medowie Lodge is a Standardbred stud and harness racing stable at Medowie, NSW, operated by Darren Reay and family. Stallion services, race training and yearling preparation in the Hunter Region.'
where id = true;

insert into site_content_blocks (key, label, heading, body, status) values
  (
    'homepage_intro',
    'Homepage — Introduction',
    'Medowie Lodge',
    E'Welcome to Medowie Lodge, a Standardbred stud located at Medowie in the Port Stephens area of the Hunter Region, New South Wales.\n\nMedowie Lodge is run by Darren Reay and family. Darren is a licensed Harness Racing trainer, studmaster, breeder and owner, and Vice President of Harness Breeders NSW.',
    'published'
  ),
  (
    'training_intro',
    'Training — Introduction',
    'Training and Breaking-In',
    'Contact Darren Reay and team at Medowie Lodge for information regarding yearling preparation, breaking-in and race training.',
    'published'
  ),
  (
    'yearling_preparation_intro',
    'Yearling Preparation — Introduction',
    'Yearling Preparation',
    'Medowie Lodge presents well-bred, hand-raised yearlings annually at both the Sydney APG Yearling Sale and the Bathurst Yearling Sale, held during February and March each year.',
    'published'
  ),
  (
    'about_intro',
    'About — Introduction',
    'Medowie Lodge',
    'Medowie Lodge is a Standardbred stud and harness racing stable based at Medowie in the Port Stephens area of the Hunter Region, New South Wales, operated by Darren Reay and family.',
    'published'
  ),
  (
    'about_darren',
    'About — Darren Reay',
    'Darren Reay',
    'Darren Reay is a licensed Harness Racing trainer, studmaster, breeder and owner, and Vice President of Harness Breeders NSW.',
    'published'
  ),
  ('footer_note', 'Footer — Legal Note', null,
    'Website information is subject to change. Service fees and availability should be confirmed directly with Medowie Lodge.', 'published')
on conflict (key) do nothing;

-- Sections invited by the brief but not yet written on the source site.
-- Seeded as drafts (hidden from the public page) so staff can expand them
-- from /admin rather than the site showing placeholder marketing copy.
insert into site_content_blocks (key, label, heading, body, status) values
  ('training_race_training', 'Training — Race Training', 'Race Training', null, 'draft'),
  ('training_breaking_in', 'Training — Breaking-In', 'Breaking-In', null, 'draft'),
  ('training_education', 'Training — Education & Preparation', 'Education & Preparation', null, 'draft'),
  ('training_facilities', 'Training — Facilities', 'Facilities', null, 'draft'),
  ('yearling_sale_preparation', 'Yearling Preparation — Sale Preparation', 'Sale Preparation', null, 'draft'),
  ('yearling_handling_education', 'Yearling Preparation — Handling & Education', 'Handling & Education', null, 'draft'),
  ('yearling_presentation', 'Yearling Preparation — Presentation', 'Presentation', null, 'draft'),
  ('about_breeding', 'About — Breeding', 'Breeding', null, 'draft'),
  ('about_training', 'About — Training', 'Training', null, 'draft'),
  ('about_region', 'About — Medowie / Hunter Region', 'Medowie & the Hunter Region', null, 'draft')
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- Stallions
--
-- The four stallions below were listed by name on the Medowie Lodge
-- homepage as "standing" for a breeding season labelled 2023/2024 — the
-- live site has not been updated since, so current-season status cannot be
-- confirmed and each is seeded as admin_review rather than published.
-- "TR" against a name on the source site denoted Trotter; horses without
-- the suffix are seeded as Pacer, consistent with the site's own notation.
-- My Chaching Chaching (NZ) appeared in the stallion image grid but was not
-- included in that season's name list, so its status is unverified too.
-- ---------------------------------------------------------------------------

insert into stallions (name, slug, country_suffix, gait, status, display_order) values
  ('Tiger Tara', 'tiger-tara', 'NZ', 'Pacer', 'admin_review', 1),
  ('Follow the Stars', 'follow-the-stars', 'AUS', 'Pacer', 'admin_review', 2),
  ('Timothy Red', 'timothy-red', 'AUS', 'Trotter', 'admin_review', 3),
  ('My High Expectations', 'my-high-expectations', 'USA', 'Trotter', 'admin_review', 4),
  ('My Chaching Chaching', 'my-chaching-chaching', 'NZ', null, 'admin_review', 5)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Horses for sale — archived record of a real, previously reported sale
--
-- These three lots were shown on the Medowie Lodge "Horses for Sale" page
-- as horses "presented and sold at the 2018 Sydney APG Yearling Sale".
-- They are seeded as sold/archive records for historical accuracy, not as
-- current listings. No sale price was published, so none is recorded.
-- ---------------------------------------------------------------------------

insert into horses_for_sale (name, slug, status, sale_type, sex, sire, dam, sale_name, sale_date, lot_number, price_type, display_order) values
  ('Lot 327 — Somebeachsomewhere x Go Right Babe', 'apg-2018-lot-327', 'sold', 'Yearling Sale', 'Colt', 'Somebeachsomewhere', 'Go Right Babe', 'Sydney APG Yearling Sale', '2018-02-25', '327', 'poa', 1),
  ('Lot 357 — Well Said x Lotus Lobell', 'apg-2018-lot-357', 'sold', 'Yearling Sale', 'Colt', 'Well Said', 'Lotus Lobell', 'Sydney APG Yearling Sale', '2018-02-25', '357', 'poa', 2),
  ('Lot 428 — Bettor''s Delight x So Savvy', 'apg-2018-lot-428', 'sold', 'Yearling Sale', 'Colt', 'Bettor''s Delight', 'So Savvy', 'Sydney APG Yearling Sale', '2018-02-25', '428', 'poa', 3)
on conflict (slug) do nothing;
