import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://dresscowear.com'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/admin/',
                '/account/',
                '/checkout/',
                '/order-success/',
                '/api/',
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
