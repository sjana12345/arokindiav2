const setMeta = (selector, attr, attrVal, content) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setCanonical = (url) => {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', url);
};

export const applySeo = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  twitterHandle,
  canonicalUrl,
} = {}) => {
  if (title) document.title = title;

  if (description) {
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:description"]', 'property', 'og:description', ogDescription || description);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', ogDescription || description);
  }

  if (keywords) setMeta('meta[name="keywords"]', 'name', 'keywords', keywords);

  if (ogTitle || title) {
    const t = ogTitle || title;
    setMeta('meta[property="og:title"]', 'property', 'og:title', t);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', t);
  }

  if (ogImage) {
    setMeta('meta[property="og:image"]', 'property', 'og:image', ogImage);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);
  }

  setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
  setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');

  if (twitterHandle) {
    const handle = twitterHandle.startsWith('@') ? twitterHandle : `@${twitterHandle}`;
    setMeta('meta[name="twitter:site"]', 'name', 'twitter:site', handle);
  }

  if (canonicalUrl) setCanonical(canonicalUrl);
};
