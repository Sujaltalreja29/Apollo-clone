// components/Seo.tsx
import Head from 'next/head'

interface SeoProps {
  title: string
  description: string
  canonicalUrl?: string
  ogType?: string
  ogImage?: string
  keywords?: string
}

export default function Seo({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = '/og-image.png',
  keywords,
}: SeoProps) {
  // Format the title to include your brand name
  const formattedTitle = `${title} | Apollo 247 Clone`
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="title" content={formattedTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonicalUrl} />
      <meta property="twitter:title" content={formattedTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${siteUrl}${ogImage}`} />
    </Head>
  )
}