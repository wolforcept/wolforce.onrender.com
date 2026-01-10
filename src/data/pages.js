// Windows 98 Desktop - Pages Configuration
// Master list of all pages/apps with their properties
// Content from https://wolforcept.github.io/

// Note: Many websites block iframe embedding via X-Frame-Options headers.
// Some sites (especially .onrender.com) may not display in the windows.

const WOLFORCEPT_BASE = 'https://wolforcept.github.io';

export const pages = {
  // ============================================================================
  // Web Games
  // ============================================================================
  'seedmix2': {
    label: 'Seedmix2',
    icon: `${WOLFORCEPT_BASE}/images/webgames/seedmix2.png`,
    url: 'https://seedmix2.onrender.com',
    size: { width: 500, height: 900 },
  },
  'pokegene2': {
    label: 'PokeGene 2',
    icon: `${WOLFORCEPT_BASE}/images/webgames/pokegene.png`,
    url: 'https://pokegene2.onrender.com',
    size: { width: 900, height: 700 },
  },
  'pokeidler': {
    label: 'PokeIdler',
    icon: `${WOLFORCEPT_BASE}/images/webgames/pokeball.png`,
    url: 'https://wolforcept.github.io/pokeidler',
  },
  'elementalpixel': {
    label: 'Elemental Pixel',
    icon: `${WOLFORCEPT_BASE}/images/webgames/elementalpixel.png`,
    url: 'https://elementalpixel.onrender.com',
  },
  'concept': {
    label: 'Concept',
    icon: `${WOLFORCEPT_BASE}/images/webgames/concept2.png`,
    url: 'https://wolforcept.github.io/concept/',
  },
  'angelsvsdemons': {
    label: 'Angels vs Demons',
    icon: `${WOLFORCEPT_BASE}/images/webgames/avd.png`,
    url: 'https://angelsvsdemons.onrender.com',
  },
  'worddish': {
    label: 'WordDish',
    icon: `${WOLFORCEPT_BASE}/images/webgames/worddish.png`,
    url: 'https://worddish.onrender.com',
    size: { width: 1000, height: 800 },
  },
  'cobra2': {
    label: 'Cobra 2',
    icon: `${WOLFORCEPT_BASE}/images/webgames/cobra2.png`,
    url: 'https://wolforcept.github.io/Cobra2',
    size: { width: 1000, height: 700 },
  },
  'mover': {
    label: 'Mover',
    icon: `${WOLFORCEPT_BASE}/mover/icon.png`,
    url: 'https://wolforcept.github.io/mover',
  },

  // ============================================================================
  // Quiz Games
  // ============================================================================
  'lolblurs': {
    label: 'LoL Blurs',
    icon: `${WOLFORCEPT_BASE}/images/webgames/lolblurs128.png`,
    url: 'https://wolforcept.github.io/blurs/lol',
  },
  'lolquiz': {
    label: 'LoL Quiz',
    icon: `${WOLFORCEPT_BASE}/images/webgames/lolquiz.png`,
    url: 'https://wolforcept.github.io/lolquiz',
  },
  'pokeblurs': {
    label: 'Poke Blurs',
    icon: `${WOLFORCEPT_BASE}/images/webgames/pokeblurs.png`,
    url: 'https://wolforcept.github.io/blurs/pokemon',
  },

  // ============================================================================
  // Board Games & Companions
  // ============================================================================
  'ecogenesis': {
    label: 'Ecogenesis',
    icon: `${WOLFORCEPT_BASE}/images/webgames/ecogenesis.png`,
    url: 'https://ecogenesis-app.onrender.com',
    size: { width: 1400, height: 600 },
  },
  'projectelite': {
    label: 'Project Elite',
    icon: 'https://project-elite-companion.onrender.com/assets/images/title2.svg',
    url: 'https://project-elite-companion.onrender.com',
  },
  'cryptid': {
    label: 'Cryptid',
    icon: `${WOLFORCEPT_BASE}/images/webgames/cryptid.png`,
    url: 'https://cryptid-companion-app.onrender.com',
  },
  'spacecaptain': {
    label: 'Space Captain',
    icon: `${WOLFORCEPT_BASE}/images/webgames/spacecaptain.png`,
    url: 'https://spacecaptain.onrender.com',
  },

  // ============================================================================
  // Mobile Games
  // ============================================================================
  'wordaria': {
    label: 'Wordaria',
    icon: `${WOLFORCEPT_BASE}/images/mobile/wordaria.png`,
    url: 'https://play.google.com/store/apps/details?id=wolforce.games.wordaria',
    forceExternal: true, // Google Play doesn't work in iframes
  },

  // ============================================================================
  // Links
  // ============================================================================
  'homepage': {
    label: 'WolforcePT Homepage',
    icon: `${WOLFORCEPT_BASE}/images/icon128.png`,
    url: 'https://wolforcept.github.io/',
    size: { width: 800, height: 600 },
  },
  'patreon': {
    label: 'Patreon',
    icon: `${WOLFORCEPT_BASE}/images/patreon128.png`,
    url: 'https://www.patreon.com/wolforce',
    forceExternal: true, // Patreon blocks iframe embedding
  },

  // ============================================================================
  // System Items
  // ============================================================================
  'my-computer': {
    label: 'My Computer',
    icon: '/icons/my-computer.svg',
    // Special: opens the file system root folder
    opensFolder: 'root',
    size: { width: 800, height: 600 },
  },
  'recycle-bin': {
    label: 'Recycle Bin',
    icon: '/icons/recycle-bin.svg',
    contentType: 'recycleBin',
    size: { width: 600, height: 400 },
  },
  'code-editor': {
    label: 'Code Editor',
    icon: '/icons/notepad.svg',
    contentType: 'editor',
    size: { width: 900, height: 600 },
  },
  'find': {
    label: 'Find...',
    icon: '/icons/find.svg',
    url: 'https://duckduckgo.com',
  },
  'help': {
    label: 'Help',
    icon: '/icons/help.svg',
    url: 'https://www.wikipedia.org/wiki/Windows_98',
  },
};

