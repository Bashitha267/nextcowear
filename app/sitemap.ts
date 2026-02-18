import { MetadataRoute } from 'next'
import { products } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.dresscowear.com'

    // Static routes
    const routes = [
        '',
        '/collections',
        '/reviews',
        '/faqs',
        '/our-heritage',
        '/why-us',
        '/size-chart',
        '/shipping-policy',
        '/refund-policy',
        '/login',
        '/signup',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Dynamic product routes
    const productRoutes = products.map((product) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9, // High priority for products
    }))

    return [...routes, ...productRoutes]
}
