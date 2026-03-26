import { IType } from '@/shared/interfaces'

export const paths = {
  home: '/',
  profile: {
    about: '/profile/about',
    gallery: '/profile/gallery',
    index: '/profile',
    payment: '/profile/payment',
    portfolio: '/profile/portfolio',
    prices: '/profile/prices',
  }
}

export const DESIGN_TYPES: IType[] = [
  {
    label: 'Дизайн-проект под ключ',
    value: 'dizayn-proekt'
  },
  {
    label: 'Авторский надзор',
    value: 'avtorskiy-nadzor'
  },
  {
    label: 'Интерьерный коллаж',
    value: 'interernyy-kollazh'
  },
  {
    label: 'Визуализация',
    value: 'vizualizatsiya'
  },
  {
    label: 'Хоумстейджинг',
    value: 'khoumsteydzhin'
  },
  {
    label: 'Расстановка мебели',
    value: 'rasstanovka-mebeli'
  },
  {
    label: 'Комплектация',
    value: 'komplektatsiya'
  },
  {
    label: 'Декорирование',
    value: 'dekorinovanie'
  },
  {
    label: 'Обмерный план',
    value: 'obmernyy-plan'
  },
  {
    label: 'Консультация',
    value: 'consultation'
  },
  {
    label: 'Обучение',
    value: 'education'
  }
]

export const DESIGN_STYLES = [
  {
    label: 'Минимализм',
    value: 'minimal'
  },
  {
    label: 'Классический',
    value: 'classic'
  },
  {
    label: 'Современный',
    value: 'modern'
  },
  {
    label: 'Скандинавский',
    value: 'scandinavian'
  },
  {
    label: 'Джапанди',
    value: 'japan'
  },
  {
    label: 'Лофт',
    value: 'loft'
  },
  {
    label: 'Бохо',
    value: 'boho'
  },
  {
    label: 'Eco-дизайн',
    value: 'eco'
  },
  {
    label: 'Неоклассика',
    value: 'neoclassic'
  },
  {
    label: 'Неомемфис',
    value: 'memphis'
  },
  {
    label: 'Контемпорари',
    value: 'contemporary'
  }
]

export const DESIGN_SEGMENT = [
  {
    label: 'Эконом',
    value: 'economy'
  },
  {
    label: 'Комфорт',
    value: 'comfort'
  },
  {
    label: 'Премиум',
    value: 'premium'
  },
  {
    label: 'Эксклюзив',
    value: 'exclusive'
  }
]

export const DESIGN_EXPERIENCE = [
  {
    label: 'До 1 года',
    value: '1'
  },
  {
    label: 'От 1 года до 3 лет',
    value: '3'
  },
  {
    label: 'От 3 до 5 лет',
    value: '5'
  },
  {
    label: 'От 5 до 10 лет',
    value: '10'
  },
  {
    label: 'Более 10 лет',
    value: 'more'
  }
]

export const DESIGN_STATUS = [
  {
    label: 'Частный дизайнер',
    value: 'individual'
  },
  {
    label: 'Студия дизайна',
    value: 'studio'
  },
  {
    label: 'Строительная компания',
    value: 'builder'
  }
]

// Gallery
export const GALLERY_TYPES = [
  {
    label: 'Визуализация',
    value: 'visual'
  },
  {
    label: 'Фото объекта',
    value: 'real'
  }
]
