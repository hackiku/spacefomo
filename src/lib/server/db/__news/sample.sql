insert into news_items (
  id,
  title,
  viral_title,
  url,
  source,
  publication_date,
  read_time,
  score,
  tags,
  week_id,
  entities,
  context,
  impact_score
) values (
  9,
  'Hubble Discovers "Blue Lurker" Spinning So Fast, It''s Breaking Astronomers'' Models',
  'Hubble Finds Rare ''Hidden'' Star Spinning 7x Faster Than Our Sun 🌟',
  'https://scitechdaily.com/hubble-discovers-blue-lurker-spinning-so-fast-its-breaking-astronomers-models/',
  'SciTechDaily',
  '2025-01-24',
  6,
  78,
  '["astronomy", "Hubble", "stellar evolution", "blue lurker", "star clusters", "M67"]'::jsonb,
  5,
  '{
    "organizations": [
      {"name": "NASA", "role": "research_agency"},
      {"name": "ESA", "role": "research_agency"},
      {"name": "Space Telescope Science Institute", "role": "operations"},
      {"name": "Illinois Institute of Technology", "role": "research_institution"}
    ],
    "people": [
      {"name": "Emily Leiner", "role": "Researcher", "institution": "Illinois Institute of Technology"}
    ],
    "facilities": [
      {"name": "Hubble Space Telescope", "type": "space_telescope"},
      {"name": "Kepler Space Telescope", "type": "space_telescope", "status": "retired"}
    ],
    "celestial_objects": [
      {
        "name": "Blue Lurker",
        "type": "star",
        "location": "M67 cluster",
        "distance": "2,800 light-years",
        "properties": {
          "rotation_period": "4 days",
          "companion": "white dwarf",
          "white_dwarf_mass": "0.72 solar masses",
          "white_dwarf_temperature": "23,000 degrees Fahrenheit"
        }
      }
    ]
  }'::jsonb,
  '{
    "timeline": {
      "discovery_date": "2025-01",
      "merger_event": "~500 million years ago",
      "presentation": "245th American Astronomical Society meeting"
    },
    "scientific_significance": {
      "unique_features": [
        "triple-star system evolution",
        "unusual rotation speed",
        "massive white dwarf companion",
        "rare observable case"
      ],
      "implications": [
        "stellar evolution models",
        "triple star system dynamics",
        "mass transfer processes"
      ]
    },
    "narrative_thread": {
      "type": "scientific_discovery",
      "themes": [
        "stellar evolution",
        "observational astronomy",
        "unexpected phenomena"
      ]
    }
  }'::jsonb,
  72
);