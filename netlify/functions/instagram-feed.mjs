const DEFAULT_GRAPH_VERSION = 'v21.0';
const DEFAULT_LIMIT = 6;

function json(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...init.headers
    }
  });
}

function getLimit() {
  const value = Number.parseInt(process.env.INSTAGRAM_FEED_LIMIT ?? '', 10);
  return Number.isFinite(value) && value > 0 ? Math.min(value, 12) : DEFAULT_LIMIT;
}

async function getInstagramUserId(graphVersion, accessToken) {
  if (process.env.INSTAGRAM_USER_ID) return process.env.INSTAGRAM_USER_ID;

  const params = new URLSearchParams({
    fields: 'user_id',
    access_token: accessToken
  });
  const response = await fetch(`https://graph.instagram.com/${graphVersion}/me?${params}`);
  if (!response.ok) return null;

  const payload = await response.json();
  return payload.user_id ?? payload.data?.[0]?.user_id ?? null;
}

function toGalleryItem(media) {
  const imageUrl = media.media_type === 'VIDEO' ? media.thumbnail_url || media.media_url : media.media_url;
  if (!imageUrl || !media.permalink) return null;

  const date = media.timestamp ? new Date(media.timestamp) : null;
  const caption = typeof media.caption === 'string' ? media.caption.trim() : '';
  const title = caption.split(/\r?\n/).find(Boolean)?.replace(/\s+/g, ' ').slice(0, 42) || 'Instagram Post';

  return {
    id: media.id,
    title,
    year: date && !Number.isNaN(date.getTime()) ? String(date.getUTCFullYear()) : '',
    imageUrl,
    alt: title,
    sourceUrl: media.permalink,
    sourceLabel: 'Instagram'
  };
}

export default async function handler() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!accessToken) {
    return json({ items: [] }, { status: 200 });
  }

  try {
    const graphVersion = process.env.INSTAGRAM_GRAPH_VERSION || DEFAULT_GRAPH_VERSION;
    const userId = await getInstagramUserId(graphVersion, accessToken);
    if (!userId) {
      return json({ items: [] }, { status: 200 });
    }

    const params = new URLSearchParams({
      fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp',
      limit: String(getLimit()),
      access_token: accessToken
    });
    const response = await fetch(`https://graph.instagram.com/${graphVersion}/${userId}/media?${params}`);
    if (!response.ok) {
      return json({ items: [] }, { status: 200 });
    }

    const payload = await response.json();
    const items = (Array.isArray(payload.data) ? payload.data : []).map(toGalleryItem).filter(Boolean);

    return json(
      { items },
      {
        headers: {
          'cache-control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=3600'
        }
      }
    );
  } catch {
    return json({ items: [] }, { status: 200 });
  }
}
