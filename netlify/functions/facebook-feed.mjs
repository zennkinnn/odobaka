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
  const value = Number.parseInt(process.env.FACEBOOK_FEED_LIMIT ?? '', 10);
  return Number.isFinite(value) && value > 0 ? Math.min(value, 12) : DEFAULT_LIMIT;
}

function getPostImage(post) {
  if (post.full_picture) return post.full_picture;

  const attachments = Array.isArray(post.attachments?.data) ? post.attachments.data : [];
  for (const attachment of attachments) {
    const image = attachment.media?.image?.src;
    if (image) return image;

    const subattachments = Array.isArray(attachment.subattachments?.data)
      ? attachment.subattachments.data
      : [];
    const subImage = subattachments.find((item) => item.media?.image?.src)?.media?.image?.src;
    if (subImage) return subImage;
  }

  return null;
}

function toGalleryItem(post) {
  const imageUrl = getPostImage(post);
  if (!imageUrl) return null;

  const date = post.created_time ? new Date(post.created_time) : null;
  const message = typeof post.message === 'string' ? post.message.trim() : '';
  const title =
    message.split(/\r?\n/).find(Boolean)?.replace(/\s+/g, ' ').slice(0, 42) ||
    post.attachments?.data?.[0]?.title ||
    'Facebook Post';

  return {
    id: post.id,
    title,
    year: date && !Number.isNaN(date.getTime()) ? String(date.getUTCFullYear()) : '',
    imageUrl,
    alt: title,
    sourceUrl: post.permalink_url || `https://www.facebook.com/${post.id}`,
    sourceLabel: 'Facebook'
  };
}

export default async function handler() {
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;

  if (!accessToken || !pageId) {
    return json({ items: [] }, { status: 200 });
  }

  try {
    const graphVersion = process.env.FACEBOOK_GRAPH_VERSION || DEFAULT_GRAPH_VERSION;
    const params = new URLSearchParams({
      fields:
        'id,message,created_time,permalink_url,full_picture,attachments{media,type,url,title,description,subattachments}',
      limit: String(getLimit()),
      access_token: accessToken
    });
    const response = await fetch(`https://graph.facebook.com/${graphVersion}/${pageId}/posts?${params}`);
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
