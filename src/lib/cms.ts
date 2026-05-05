import { createClient, type MicroCMSImage } from 'microcms-js-sdk';
import {
  gallery,
  pages,
  practiceSchedules,
  siteSettings,
  updates,
  type GalleryItem,
  type PageContent,
  type PracticeSchedule,
  type SiteSettings,
  type Update
} from '@data/mock';

const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;
const client =
  serviceDomain && apiKey
    ? createClient({
        serviceDomain,
        apiKey,
        retry: true
      })
    : null;

export const microCmsApis = {
  blogs: 'blogs',
  schedules: 'schedules'
} as const;

type MicroCMSContent<T> = T & {
  id: string;
};

type MicroCMSBlog = {
  title: string;
  date: string;
  category: string | string[];
  summary: string;
  body: string;
  image?: MicroCMSImage;
};

type MicroCMSSchedule = {
  date_text?: string;
  area_text?: string;
};

async function fetchAll<T>(
  endpoint: string,
  queries: Record<string, string | number> = {}
): Promise<MicroCMSContent<T>[] | null> {
  if (!client) return null;

  return client.getAllContents<T>({
    endpoint,
    queries
  }) as Promise<MicroCMSContent<T>[]>;
}

function getCategoryValues(category: string | string[]): string[] {
  return Array.isArray(category) ? category : [category];
}

function toUpdateCategory(category: string | string[]): Update['category'] {
  const values = getCategoryValues(category);
  if (values.includes('出演')) return 'event';
  if (values.includes('募集')) return 'recruiting';
  return 'news';
}

function toCategoryLabel(category: string | string[]): string {
  return getCategoryValues(category).join(' / ');
}

function toUpdate(content: MicroCMSContent<MicroCMSBlog>): Update {
  return {
    id: content.id,
    category: toUpdateCategory(content.category),
    categoryLabel: toCategoryLabel(content.category),
    title: content.title,
    date: content.date,
    summary: content.summary,
    body: content.body,
    bodyHtml: content.body,
    imageUrl: content.image?.url,
    imageAlt: content.title
  };
}

function toPracticeSchedule(content: MicroCMSContent<MicroCMSSchedule>): PracticeSchedule {
  return {
    id: content.id,
    dateText: content.date_text ?? '',
    areaText: content.area_text ?? ''
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return siteSettings;
}

export async function getPages(): Promise<PageContent[]> {
  return pages;
}

export async function getUpdates(): Promise<Update[]> {
  const contents = await fetchAll<MicroCMSBlog>(microCmsApis.blogs, { orders: '-date' });
  if (!contents) return [...updates].sort((a, b) => b.date.localeCompare(a.date));

  return contents.map(toUpdate);
}

export async function getPracticeSchedules(): Promise<PracticeSchedule[]> {
  const contents = await fetchAll<MicroCMSSchedule>(microCmsApis.schedules);
  if (!contents) return practiceSchedules;

  return contents.map(toPracticeSchedule);
}

export async function getGallery(): Promise<GalleryItem[]> {
  return gallery;
}
