'use client';

import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical: string;
}

/**
 * App-Router-safe SEO helper.
 *
 * The App Router manages document head via the metadata API, so this
 * component simply keeps `document.title` in sync for client navigation.
 */
const SEO = ({ title, description }: SEOProps) => {
  useEffect(() => {
    document.title = title ? `${title} — SubHub247` : 'SubHub247';
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
};

export default SEO;
