export const SITE_TITLE = '2064 | The Panther Project';

export const MISSION_STATEMENT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

export const GOOGLE_CALENDAR_EMBED_URL =
  'https://calendar.google.com/calendar/embed?src=c_a246400a88a21fe4e3b65cc96f43ae4020788d8410fe2a1c572ab632d872a20a%40group.calendar.google.com&ctz=America%2FNew_York';

export const HACK_CLUB_DONATION_URL = 'https://TODO.example/hack-club-donation';

export const SUMMER_CAMP_SIGNUP_URL = 'https://TODO.example/summer-camp-google-form';

export const SPONSOR_CONTACT_EMAIL = 'info@2064.team';

export const DOCS_PRODUCTION_URL = 'https://docs.2064.team/';
export const DOCS_DEVELOPMENT_URL = 'http://localhost:4322/';

export const getDocsUrl = (isDev: boolean) => (isDev ? DOCS_DEVELOPMENT_URL : DOCS_PRODUCTION_URL);

export const sponsors = [
  {
    name: 'Ace',
    logo: '/SponsorLogos/Ace.png'
  },
  {
    name: 'BAE Systems',
    logo: '/SponsorLogos/BAESystems.png'
  },
  {
    name: 'Boeing',
    logo: '/SponsorLogos/Boeing.png'
  },
  {
    name: 'Connecticut Manufacturing',
    logo: '/SponsorLogos/CTMFG.png'
  },
  {
    name: 'D&V',
    logo: '/SponsorLogos/D&V.png'
  },
  {
    name: 'RTX',
    logo: '/SponsorLogos/RTX.png'
  },
  {
    name: 'FRC Tees',
    logo: '/SponsorLogos/frctees.png'
  },
  {
    name: 'MannKind',
    logo: '/SponsorLogos/mannkind.png'
  },
  {
    name: 'Sperry',
    logo: '/SponsorLogos/sperry.png'
  }
];
