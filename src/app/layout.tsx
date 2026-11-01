import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Thendral Day Out | Private Day Out & Swimming Pool in Tenkasi',
  description:
    'Thendral Day Out in Panpoli, Tenkasi offers private full-day family outings with swimming pools, kids play area, garden, dining space and birthday party hall. Book your date for ₹3,000.',
  keywords: [
    'Thendral Day Out',
    'Thendral Day Out Tenkasi',
    'private day outing Tenkasi',
    'family day outing Tenkasi',
    'swimming pool Tenkasi',
    'private swimming pool Tenkasi',
    'family swimming pool Panpoli',
    'day out Panpoli',
    'private venue Tenkasi',
    'birthday party venue Tenkasi',
    'birthday party hall Panpoli',
    'family outing near Tenkasi',
  ],
  authors: [{ name: 'Thendral Groups' }],
  metadataBase: new URL('https://thendraldayout.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Thendral Day Out | Private Day Out & Swimming Pool in Tenkasi',
    description:
      'Private full-day venue reservation for your family and friends in Panpoli, Tenkasi. Swimming pool, artificial falls, kids play area, birthday hall & garden for ₹3,000 / full day.',
    url: 'https://thendraldayout.com',
    siteName: 'Thendral Day Out',
    images: [
      {
        url: '/images/pool-main.jpg',
        width: 1024,
        height: 576,
        alt: 'Thendral Day Out Swimming Pool in Panpoli Tenkasi',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thendral Day Out | Private Day Out & Swimming Pool in Tenkasi',
    description:
      'Private full-day family recreation and celebration venue in Panpoli, Tenkasi for ₹3,000 / day.',
    images: ['/images/pool-main.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: [
      'fWRteDfwIDh9Wxw_8wfTTsSnOL2NOfo2k26qEGtfjUA',
      'G2S0SfkA7BuxSPYH2EM6Qi5FglhdYOTvlNrTnqiy_GQ',
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Thendral Day Out',
    legalName: 'Thendral Day Out by Thendral Groups',
    url: 'https://thendraldayout.com',
    logo: 'https://thendraldayout.com/images/logo.png',
    image: 'https://thendraldayout.com/images/pool-main.jpg',
    description:
      'Private full-day family recreation and celebration venue in Panpoli, Tenkasi with swimming pools, kids play area, garden, dining space, and birthday party hall.',
    telephone: '+91-8778038383',
    priceRange: '₹3,000',
    currenciesAccepted: 'INR',
    paymentAccepted: 'UPI',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Near Panpoli Thaika Bus Stop',
      addressLocality: 'Panpoli, Tenkasi',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 9.0184843,
      longitude: 77.261947,
    },
    hasMap: 'https://maps.app.goo.gl/SoSykGNBFHepynWr9',
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Thendral Day Out',
    url: 'https://thendraldayout.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://thendraldayout.com/#availability',
      'query-input': 'required name=search_term_string',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the price?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '₹3,000 for the full-day private booking.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is the price per person?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. The booking is for the venue for the selected date.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can we bring our own food?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Guests can bring their own prepared food and use the dining area.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is there a swimming pool for children?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Separate adult and kids swimming spaces are available.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is the entire place private?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A confirmed booking reserves the venue exclusively for the booking group for that date.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I book?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Check availability, select your date and contact the business through WhatsApp or phone.',
        },
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
