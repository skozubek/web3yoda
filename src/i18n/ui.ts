// src/i18n/ui.ts

export const languages = {
    en: 'English',
    pl: 'Polski'
} as const;

export const defaultLang = 'en';
export const showDefaultLang = false;

export const ui = {
    en: {
      'meta.description': 'Start your Web3 journey with a seasoned guide. Expert consultations and practical knowledge for Web3 transition.',
      'nav.schedule': 'Schedule a Call',
      'nav.twitter': 'X (Twitter)',
      'newsletter.title': 'Newsletter',
      'newsletter.description': 'Get the latest Web3 insights delivered to your inbox.',
      'newsletter.placeholder': 'Enter your email',
      'newsletter.button': 'Subscribe',
      'newsletter.toast.success': 'Thanks for subscribing!',
      'newsletter.toast.error.general': 'Something went wrong. Please try again.',
      'newsletter.toast.error.invalid': 'Please provide a valid email address',
      'newsletter.toast.error.failed': 'Failed to subscribe. Please try again.',
      'newsletter.toast.error.server': 'Server configuration error',
      'footer.description': 'Bridging the gap between Web2 and Web3 through expert guidance and education.',
      'copyright': '© 2024 Web3Yoda. All rights reserved.'
    },
    pl: {
      'meta.description': 'Zacznij bezpiecznie korzystać z technologii blockchain. Praktyczna wiedza bez zbędnej teorii',
      'nav.schedule': 'Umów rozmowę',
      'nav.twitter': 'X (Twitter)',
      'newsletter.title': 'Newsletter',
      'newsletter.description': 'Otrzymuj najnowsze informacje o Web3 prosto na swoją skrzynkę.',
      'newsletter.placeholder': 'Twój email',
      'newsletter.button': 'Subskrybuj',
      'newsletter.toast.success': 'Dziękujemy za subskrypcję!',
      'newsletter.toast.error.general': 'Coś poszło nie tak. Spróbuj ponownie.',
      'newsletter.toast.error.invalid': 'Podaj prawidłowy adres email',
      'newsletter.toast.error.failed': 'Nie udało się zapisać. Spróbuj ponownie.',
      'newsletter.toast.error.server': 'Błąd serwera',
      'footer.description': 'Łączymy świat Web2 i Web3 poprzez profesjonalne doradztwo i edukację.',
      'copyright': '© 2024 Web3Yoda. Wszelkie prawa zastrzeżone.'
    }
  } as const;
  
  export type UiKey = keyof typeof ui.en;