

import Head from 'next/head';
import { DefaultSeo } from 'next-seo';

const SEO = ({ title, description, canonical }) => {
  return (
    <>
      <DefaultSeo
        title={title}
        description={description}
        canonical={canonical}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: canonical,
          title,
          description,
          images: [
            {
              url: 'https://example.com/og-image.jpg',
              width: 1200,
              height: 630,
              alt: 'Og Image Alt',
            },
          ],
        }}
        twitter={{
          handle: '@handle',
          site: '@site',
          cardType: 'summary_large_image',
        }}
      />
      <Head>
        <link rel="canonical" href={canonical} />
      </Head>
    </>
  );
};

export default SEO;
