// app/sitemap.ts
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'
  
  // Get all your specialties
  const specialtiesResponse = await fetch(`${baseUrl}/api/specialties`)
  const specialties = await specialtiesResponse.json()
  
  const specialtyUrls = specialties.map((specialty: any) => ({
    url: `${baseUrl}/specialties/${specialty.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))
  
  // Static routes
  const routes = [
    '',
    '/doctors',
    '/pharmacy',
    '/lab-tests',
    '/health-records',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  }))
  
  return [...routes, ...specialtyUrls]
}