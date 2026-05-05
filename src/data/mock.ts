export type SiteSettings = {
  name: string;
  tagline: string;
  description: string;
  email: string;
  instagramUrl: string;
  joinFormUrl: string;
  seoTitle: string;
  seoDescription: string;
};

export type PageContent = {
  slug: 'about' | 'join';
  title: string;
  body: string;
};

export type Update = {
  id: string;
  slug: string;
  category: 'news' | 'event';
  title: string;
  date: string;
  summary: string;
  body: string;
  venue?: string;
  times?: string[];
};

export type PracticeSchedule = {
  id: string;
  date: string;
  time: string;
  venue: string;
  area: string;
  isTrialOpen: boolean;
};

export type GalleryItem = {
  id: string;
  title: string;
  year: string;
  imageUrl: string;
  alt: string;
  sourceUrl?: string;
  sourceLabel?: 'Instagram' | 'Facebook';
};

export const siteSettings: SiteSettings = {
  name: '踊るBAKA! TOKYO',
  tagline: '東京で踊る、笑う、熱くなる。',
  description:
    '東京を拠点に活動するよさこいチーム。祭り、練習、仲間との時間を全力で楽しむ踊りBAKAな集団です。',
  email: 'odorubaka.tokyo@gmail.com',
  instagramUrl: 'https://www.instagram.com/odorubaka_tokyo/',
  joinFormUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLScFwqW2w1p6RmXAekgtctze_k58gKuq53CdRqVsLMyjdoGYDA/viewform',
  seoTitle: '踊るBAKA! TOKYO | 東京よさこいチーム',
  seoDescription:
    '東京のよさこいチーム「踊るBAKA! TOKYO」。練習日程、イベント出演、メンバー募集、ギャラリーを掲載しています。'
};

export const pages: PageContent[] = [
  {
    slug: 'about',
    title: '踊るほど、日常が熱くなる。',
    body:
      'プロではないけれど、踊ることが好きでたまらない。見てくれる人の心を動かし、自分たちも毎回本気で楽しむ。それが踊るBAKA! TOKYOです。'
  },
  {
    slug: 'join',
    title: '経験よりも、まずは好奇心。',
    body:
      'よさこい未経験でも大歓迎です。見学からでも参加できます。練習の雰囲気、チームの温度感、祭りの楽しさをまずは体験してください。'
  }
];

export const updates: Update[] = [
  {
    id: 'theme-2026',
    slug: 'theme-2026',
    category: 'news',
    title: '2026年テーマ「励舞Rave」に決定',
    date: '2026-04-21',
    summary: '今年のテーマが決定しました。新しい踊りと音で、祭りの場を熱くします。',
    body:
      '2026年の踊るBAKA! TOKYOは「励舞Rave」をテーマに活動します。練習や出演情報は順次更新します。'
  },
  {
    id: 'kazusa-2026',
    slug: 'kazusa-2026',
    category: 'event',
    title: '第24回かずさ木更津よさこいまつり 出演',
    date: '2026-05-04',
    summary: '木更津舞尊に出演します。東部会場と一番街会場で演舞予定です。',
    body:
      '第24回かずさ木更津よさこいまつりに参加します。会場でお会いできるのを楽しみにしています。',
    venue: '木更津市内',
    times: ['13:32 東部会場 ステージ', '16:27 一番街会場 パレード', '16:41 一番街会場 パレード']
  },
  {
    id: 'trial-open',
    slug: 'trial-open',
    category: 'news',
    title: 'メンバー見学受付中',
    date: '2026-05-10',
    summary: '練習見学、体験参加を受け付けています。初心者の方も歓迎です。',
    body:
      '見学希望の方はフォームまたはメールからご連絡ください。日程に合わせて参加しやすい回をご案内します。'
  }
];

export const practiceSchedules: PracticeSchedule[] = [
  {
    id: 'practice-1',
    date: '2026-05-12',
    time: '19:00-21:30',
    venue: '都内公共施設',
    area: '東京都内',
    isTrialOpen: true
  },
  {
    id: 'practice-2',
    date: '2026-05-19',
    time: '19:00-21:30',
    venue: '都内体育館',
    area: '東京都内',
    isTrialOpen: true
  },
  {
    id: 'practice-3',
    date: '2026-05-26',
    time: '19:00-21:30',
    venue: '都内公共施設',
    area: '東京都内',
    isTrialOpen: false
  }
];

export const gallery: GalleryItem[] = [
  {
    id: 'gallery-1',
    title: 'Festival Stage',
    year: '2026',
    imageUrl:
      'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1200&q=80',
    alt: '舞台照明の下で踊るダンサー',
    sourceUrl: 'https://www.instagram.com/odorubaka_tokyo/',
    sourceLabel: 'Instagram'
  },
  {
    id: 'gallery-2',
    title: 'Parade Energy',
    year: '2025',
    imageUrl:
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80',
    alt: '屋外フェスティバルの熱気',
    sourceUrl: 'https://www.instagram.com/odorubaka_tokyo/',
    sourceLabel: 'Instagram'
  },
  {
    id: 'gallery-3',
    title: 'Team Moment',
    year: '2025',
    imageUrl:
      'https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?auto=format&fit=crop&w=1200&q=80',
    alt: '仲間と集まるチームの雰囲気',
    sourceUrl: 'https://www.instagram.com/odorubaka_tokyo/',
    sourceLabel: 'Instagram'
  }
];
