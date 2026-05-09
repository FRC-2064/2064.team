// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

const sidebar = [
  { label: 'Home', link: '/' },
  {
    label: 'Phase 1: Rookie Foundations',
    items: [
      { label: 'Rookie Home', slug: 'frc/rookielanding' },
      {
        label: 'Module 1.1: FRC Basics',
        items: [
          { slug: 'frc/FIRST' },
          { slug: 'frc/botbasics' },
          { slug: 'frc/gameanalysis' },
          { slug: 'engineering/designprocess' },
          { slug: 'frc/buildseason' },
          { slug: 'frc/poweron' }
        ]
      },
      {
        label: 'Module 1.2: Basic CAD',
        items: [
          { slug: 'engineering/cad/CAD' },
          { slug: 'engineering/cad/stage0' },
          { slug: 'engineering/cad/stage1A' },
          { slug: 'engineering/cad/stage1B' },
          { slug: 'engineering/cad/stage1C' }
        ]
      },
      {
        label: 'Module 1.3: Safety Certification',
        items: [
          { slug: 'safety/safetylanding' },
          { slug: 'safety/Safety' },
          { slug: 'safety/machinesafety' },
          { slug: 'safety/Safetyquiz' },
          { slug: 'safety/safetypractical' }
        ]
      },
      {
        label: 'Module 1.4: Basic Fabrication',
        items: [
          { slug: 'fabrication/fabricationbasic' },
          {
            label: 'Level 01 Overview',
            items: [
              { slug: 'fabrication/level1/level1' },
              { slug: 'fabrication/level1/Closet' },
              { slug: 'fabrication/level1/fasteners' }
            ]
          },
          {
            label: 'Level 01 - Measuring',
            items: [
              { slug: 'fabrication/level1/measuring/measuringtools' },
              { slug: 'fabrication/level1/measuring/blueprintlayout' }
            ]
          },
          {
            label: 'Level 01 - Hand Tools',
            items: [
              { slug: 'fabrication/level1/handtools/Handtools' },
              { slug: 'fabrication/level1/handtools/pliers' },
              { slug: 'fabrication/level1/handtools/centerpunch' },
              { slug: 'fabrication/level1/handtools/crimping' }
            ]
          },
          {
            label: 'Level 01 - 3D Printer',
            items: [{ slug: 'fabrication/level1/3dprinter' }]
          },
          {
            label: 'Skill Check - Level 01',
            items: [{ slug: 'fabrication/level1/handtoolsquiz' }]
          },
          {
            label: 'Level 02 Overview',
            items: [{ slug: 'fabrication/level2/level2' }]
          },
          {
            label: 'Level 02 - Powered Hand Tools',
            items: [
              { slug: 'fabrication/level2/poweredhandtools/poweredtools' },
              { slug: 'fabrication/level2/poweredhandtools/cordlesssaw' },
              { slug: 'fabrication/level2/powertools/soldering' }
            ]
          },
          {
            label: 'Skill Check Level 02',
            items: [{ slug: 'fabrication/level2/powertoolsquiz' }]
          }
        ]
      },
      {
        label: 'Module 1.5: XRP Starter Bot',
        items: [
          { slug: 'xrprobotics/xrplanding' },
          {
            label: 'XRP Start',
            items: [
              { slug: 'xrprobotics/module1/Build' },
              { slug: 'xrprobotics/module1/gettingtoknow' },
              { slug: 'xrprobotics/module1/xrpwpilib' },
              { slug: 'xrprobotics/module1/basicdriveXRP' },
              { slug: 'xrprobotics/module1/XRPdrivechallenge' }
            ]
          },
          {
            label: 'XRP Advanced',
            items: [
              { slug: 'xrprobotics/module2/Ping-Pong-Launcher-Challenge' },
              { slug: 'xrprobotics/module2/PingPongAssemble' },
              { slug: 'xrprobotics/module2/wiringpingpongxrp' },
              { slug: 'xrprobotics/module2/pingpongcode' },
              { slug: 'xrprobotics/module2/PingPongCompetition' }
            ]
          }
        ]
      }
    ]
  },
  {
    label: 'Phase 2: Specialization Pathways',
    items: [
      { label: 'Specialization Paths', slug: 'engineering/engineeringlanding' },
      {
        label: 'Pathway 2.1: Advanced CAD',
        items: [
          { slug: 'engineering/cad/stage1D' },
          { slug: 'engineering/cad/stage1E' },
          { slug: 'engineering/cad/cadonshapecourse' }
        ]
      },
      {
        label: 'Pathway 2.2: Advanced Fabrication',
        items: [
          { slug: 'fabrication/fabricationadvanced' },
          {
            label: 'Level 3 Overview',
            items: [
              { slug: 'fabrication/level3/level3' },
              { slug: 'fabrication/level3/3dprinting2' },
              { slug: 'fabrication/level3/stationary/horizontalsaw' },
              { slug: 'fabrication/level3/stationary/woodbandsaw' },
              { slug: 'fabrication/level3/lathe' },
              { slug: 'fabrication/level3/millingmachine' },
              { slug: 'fabrication/level3/machinelessons' }
            ]
          },
          {
            label: 'Level 4 Overview',
            items: [
              { slug: 'fabrication/level4/level4' },
              { slug: 'fabrication/level4/laserengraver' },
              { slug: 'fabrication/level4/cncrouter' },
              { slug: 'fabrication/level4/cam' },
              { slug: 'fabrication/level4/machinelessonsadvanced' }
            ]
          }
        ]
      },
      {
        label: 'Pathway 2.3: Software & Controls',
        items: [
          { slug: 'engineering/programming/WPIlib' },
          { slug: 'engineering/programming/filestructure' },
          { slug: 'engineering/programming/sensors' },
          { slug: 'engineering/programming/autonomous' },
          { slug: 'engineering/programming/vision' },
          { slug: 'engineering/programming/advancedjava' },
          { slug: 'engineering/programming/controlboard' },
          { slug: 'engineering/programming/subsystems/statemachines' },
          { slug: 'engineering/programming/subsystems/subsystems' }
        ]
      },
      {
        label: 'Pathway 2.4: Media & NEMO',
        items: [
          { slug: 'media/medialanding' },
          { slug: 'media/branding' },
          { slug: 'media/photoshop' },
          { slug: 'media/illustrator' },
          { slug: 'media/cricut' },
          { slug: 'media/buttonmaker' },
          { slug: 'media/publicspeaking' }
        ]
      }
    ]
  },
  {
    label: 'Phase 3: Leadership & Competition',
    items: [
      { label: 'Advanced Pathways', slug: 'leadership/leadershiplanding' },
      {
        label: 'Pathway 3.1: Strategy',
        items: [
          { slug: 'strategy/game-manual' },
          { slug: 'strategy/scouting' },
          { slug: 'strategy/data-viz' },
          { slug: 'strategy/alliance-selection' }
        ]
      },
      {
        label: 'Pathway 3.2: Pit Crew',
        items: [
          { slug: 'competition/packing' },
          { slug: 'competition/triage' },
          { slug: 'competition/inspection' },
          { slug: 'competition/field-checks' },
          { slug: 'engineering/bumpers' }
        ]
      },
      {
        label: 'Pathway 3.3: Project Management',
        items: [
          { slug: 'leadership/timeline' },
          { slug: 'leadership/awards' },
          { slug: 'leadership/design-review' },
          { slug: 'leadership/budget' },
          { slug: 'leadership/mentorship' }
        ]
      }
    ]
  },
  {
    label: 'Team Resources',
    items: [
      { slug: 'resources/resourceslanding' },
      { slug: 'resources/outline' },
      { slug: 'resources/frckeywords' },
      { slug: 'resources/rubric' }
    ]
  }
];

export default defineConfig({
  site: 'https://docs.2064.team',

  integrations: [
    starlight({
      title: '2064 Docs',
      favicon: '/img/favicon.ico',
      customCss: ['./src/styles/global.css'],
      logo: {
        src: './src/assets/team-logo.png',
        replacesTitle: false
      },
      editLink: {
        baseUrl: 'https://github.com/mrmarganski/mkdoc/edit/main/docs/'
      },
      social: [
        {
          icon: 'github',
          label: 'MkDocs source repository',
          href: 'https://github.com/mrmarganski/mkdoc'
        },
        {
          icon: 'instagram',
          label: 'Team 2064 Instagram',
          href: 'https://www.instagram.com/frc2064/'
        }
      ],
      sidebar
    })
  ],

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: vercel({
    webAnalytics: { enabled: false }
  })
});
