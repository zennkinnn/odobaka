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

export const microCmsApis = {
  practiceSchedules: 'practice-schedules',
  latestInfo: [
    'latest-news',
    'latest-events',
    'latest-recruiting',
    'latest-reports'
  ]
} as const;

type MicroCMSListResponse<T> = {
  contents: T[];
};

async function fetchList<T>(endpoint: string): Promise<T[] | null> {
  if (!serviceDomain || !apiKey) return null;

  const response = await fetch(`https://${serviceDomain}.microcms.io/api/v1/${endpoint}?limit=100`, {
    headers: {
      'X-MICROCMS-API-KEY': apiKey
    }
  });

  if (!response.ok) {
    throw new Error(`microCMS request failed: ${endpoint}`);
  }

  const data = (await response.json()) as MicroCMSListResponse<T>;
  return data.contents;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return siteSettings;
}

export async function getPages(): Promise<PageContent[]> {
  return pages;
}

export async function getUpdates(): Promise<Update[]> {
  const fetchedUpdates = await Promise.all(
    microCmsApis.latestInfo.map((endpoint) => fetchList<Update>(endpoint))
  );
  const contents = fetchedUpdates.every((items) => items === null)
    ? updates
    : fetchedUpdates.flatMap((items) => items ?? []);

  return [...contents].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPracticeSchedules(): Promise<PracticeSchedule[]> {
  const contents =
    (await fetchList<PracticeSchedule>(microCmsApis.practiceSchedules)) ?? practiceSchedules;
  return [...contents].sort((a, b) => a.date.localeCompare(b.date));
}

export async function getGallery(): Promise<GalleryItem[]> {
  return gallery;
}
