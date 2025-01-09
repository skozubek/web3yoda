// src/i18n/ui.ts

export const languages = {
    en: 'English',
    pl: 'Polski'
} as const;

export const defaultLang = 'en';
export const showDefaultLang = false;

export const ui = {
    en: {
      'nav.schedule': 'Schedule a Call',
      'nav.twitter': 'X (Twitter)',
      'newsletter.title': 'Newsletter',
      'newsletter.description': 'Get the latest Web3 insights delivered to your inbox.',
      'newsletter.placeholder': 'Enter your email',
      'newsletter.button': 'Subscribe',
      'footer.description': 'Bridging the gap between Web2 and Web3 through expert guidance and education.',
      'copyright': '© 2024 Web3Yoda. All rights reserved.'
    },
    pl: {
      'nav.schedule': 'Umów rozmowę',
      'nav.twitter': 'X (Twitter)',
      'newsletter.title': 'Newsletter',
      'newsletter.description': 'Otrzymuj najnowsze informacje o Web3 prosto na swoją skrzynkę.',
      'newsletter.placeholder': 'Twój email',
      'newsletter.button': 'Subskrybuj',
      'footer.description': 'Łączymy świat Web2 i Web3 poprzez profesjonalne doradztwo i edukację.',
      'copyright': '© 2024 Web3Yoda. Wszelkie prawa zastrzeżone.'
    }
  } as const;
  
  export type UiKey = keyof typeof ui.en;