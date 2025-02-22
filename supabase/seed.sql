-- supabase/seed.sql
insert into weeks (week_number, score, start_date, end_date, summary, stats) values
(5, 85, '2024-02-17 00:00:00+00', '2024-02-23 00:00:00+00', 
 'SpaceX''s Starship orbital test exceeds expectations. Private sector space competition intensifies as Rocket Lab announces new heavy-lift vehicle development.',
 '{"launchActivity": 92, "industryBuzz": 88, "techImpact": 85}'::jsonb
),
(4, 72, '2024-02-10 00:00:00+00', '2024-02-16 00:00:00+00',
 'NASA confirms critical Artemis milestone ahead of schedule. Blue Origin''s New Glenn preparations signal major launch capabilities expansion.',
 '{"launchActivity": 75, "industryBuzz": 70, "techImpact": 71}'::jsonb
),
(3, 68, '2024-02-03 00:00:00+00', '2024-02-09 00:00:00+00',
 'ESA and JAXA announce joint Mars sample return mission. Virgin Galactic achieves new altitude record with next-gen spacecraft.',
 '{"launchActivity": 65, "industryBuzz": 72, "techImpact": 67}'::jsonb
),
(2, 78, '2024-01-27 00:00:00+00', '2024-02-02 00:00:00+00',
 'Breakthrough in space solar power transmission demos practical energy beaming. China''s space station expansion enters new phase.',
 '{"launchActivity": 80, "industryBuzz": 75, "techImpact": 79}'::jsonb
),
(1, 65, '2024-01-20 00:00:00+00', '2024-01-26 00:00:00+00',
 'First commercial lunar lander touches down successfully. Space tourism bookings surge as new providers enter market.',
 '{"launchActivity": 68, "industryBuzz": 62, "techImpact": 65}'::jsonb
);