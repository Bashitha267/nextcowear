export interface Product {
    id: string;
    name: string;
    category: 'Women' | 'Men' | 'Kids';
    subCategory: string;
    price: number;
    originalPrice?: number;
    image: string;
    additionalImages?: string[];
    hoverImage?: string;
    description?: string;
    isNew?: boolean;
    isBestSeller?: boolean;
    isFeatured?: boolean;
    rating: number;
    reviews: number;
    colors: {
        classic?: { name: string; hex: string }[];
        seasonal?: { name: string; hex: string }[];
    };
    sizes: string[];
    details?: {
        overview: string;
        sustainability: string;
        fit: string;
        returns: string;
    };
}

export const CATEGORIES = [
    {
        name: 'Women',
        subCategories: ['Dresses', 'Tops', 'Skirts', 'Trousers', 'Activewear', 'Accessories']
    },
    {
        name: 'Men',
        subCategories: ['Shirts', 'T-shirts', 'Trousers', 'Suits', 'Casual', 'Outerwear']
    },
    {
        name: 'Kids',
        subCategories: ['Boys', 'Girls', 'Infants', 'Toys', 'Accessories']
    }
];

export const products: Product[] = [
    // WOMEN
    {
        id: 'w1',
        name: 'Silk Wrap Midi Dress',
        category: 'Women',
        subCategory: 'Dresses',
        price: 12500,
        originalPrice: 15600,
        image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=1000',
        additionalImages: [
            'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=1000' // Placeholder
        ],
        isNew: true,
        rating: 4.8,
        reviews: 24,
        colors: {
            classic: [{ name: 'Gold', hex: '#D4AF37' }, { name: 'Black', hex: '#000000' }]
        },
        sizes: ['XS', 'S', 'M', 'L']
    },
    {
        id: 'w2',
        name: 'Linen Summer Blouse',
        category: 'Women',
        subCategory: 'Tops',
        price: 4500,
        image: 'https://res.cloudinary.com/dnfbik3if/image/upload/v1770473787/Brown_Aesthetic_Fashion_Sale_Billboard_Landscape_mbid2g.jpg',
        isBestSeller: true,
        isFeatured: true,
        rating: 4.5,
        reviews: 56,
        colors: {
            classic: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Beige', hex: '#F5F5DC' }]
        },
        sizes: ['S', 'M', 'L']
    },
    {
        id: 'w3',
        name: 'Classic Pleated Skirt',
        category: 'Women',
        subCategory: 'Skirts',
        price: 6800,
        image: 'https://res.cloudinary.com/dnfbik3if/image/upload/v1770473787/Brown_Aesthetic_Fashion_Sale_Billboard_Landscape_1_dxqmkq.jpg',
        rating: 4.7,
        reviews: 32,
        colors: {
            classic: [{ name: 'Navy', hex: '#000080' }, { name: 'Grey', hex: '#808080' }]
        },
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: 'w4',
        name: 'High-Waist Tailored Trousers',
        category: 'Women',
        subCategory: 'Trousers',
        price: 8900,
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=1000',
        isNew: true,
        rating: 4.9,
        reviews: 18,
        colors: {
            classic: [{ name: 'Black', hex: '#000000' }, { name: 'Camel', hex: '#C19A6B' }]
        },
        sizes: ['XS', 'S', 'M', 'L']
    },
    {
        id: 'w5',
        name: 'Evening Satin Gown',
        category: 'Women',
        subCategory: 'Dresses',
        price: 24500,
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=1000',
        isBestSeller: true,
        rating: 5.0,
        reviews: 12,
        colors: {
            classic: [{ name: 'Champagne', hex: '#F7E7CE' }, { name: 'Emerald', hex: '#50C878' }]
        },
        sizes: ['S', 'M', 'L']
    },
    {
        id: 'w6',
        name: 'Boho Floral Maxi',
        category: 'Women',
        subCategory: 'Dresses',
        price: 9200,
        image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=1000',
        rating: 4.4,
        reviews: 45,
        colors: {
            seasonal: [{ name: 'Floral', hex: '#FF69B4' }]
        },
        sizes: ['S', 'M', 'L', 'XL']
    },

    // MEN
    {
        id: 'm1',
        name: 'Premium Oxford Shirt',
        category: 'Men',
        subCategory: 'Shirts',
        price: 5600,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=1000',
        additionalImages: [
            'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=1000' // Placeholder back view
        ],
        isBestSeller: true,
        rating: 4.6,
        reviews: 89,
        colors: {
            classic: [{ name: 'Light Blue', hex: '#ADD8E6' }, { name: 'White', hex: '#FFFFFF' }]
        },
        sizes: ['M', 'L', 'XL', 'XXL']
    },
    {
        id: 'm2',
        name: 'Slim Fit Chinos',
        category: 'Men',
        subCategory: 'Trousers',
        price: 7400,
        image: 'https://images.unsplash.com/photo-1624371414361-e6e9ef0ed98d?auto=format&fit=crop&q=80&w=1000',
        rating: 4.5,
        reviews: 67,
        colors: {
            classic: [{ name: 'Khaki', hex: '#C3B091' }, { name: 'Navy', hex: '#000080' }]
        },
        sizes: ['30', '32', '34', '36']
    },
    {
        id: 'm3',
        name: 'Merino Wool Sweater',
        category: 'Men',
        subCategory: 'Casual',
        price: 11200,
        image: 'https://images.unsplash.com/photo-1614975058789-41131dea784e?auto=format&fit=crop&q=80&w=1000',
        isNew: true,
        rating: 4.8,
        reviews: 34,
        colors: {
            classic: [{ name: 'Charcoal', hex: '#36454F' }, { name: 'Oatmeal', hex: '#E3D7D1' }]
        },
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: 'm4',
        name: 'Italian Wool Suit',
        category: 'Men',
        subCategory: 'Suits',
        price: 45000,
        image: 'https://images.unsplash.com/photo-1594932224010-74f43a16354b?auto=format&fit=crop&q=80&w=1000',
        rating: 5.0,
        reviews: 8,
        colors: {
            classic: [{ name: 'Grey', hex: '#808080' }, { name: 'Black', hex: '#000000' }]
        },
        sizes: ['48', '50', '52', '54']
    },
    {
        id: 'm5',
        name: 'Graphic Print Tee',
        category: 'Men',
        subCategory: 'T-shirts',
        price: 2800,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1000',
        rating: 4.3,
        reviews: 120,
        colors: {
            classic: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#000000' }]
        },
        sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },

    // KIDS
    {
        id: 'k1',
        name: 'Premium Fabric Onesie',
        category: 'Kids',
        subCategory: 'Infants',
        price: 1800,
        image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&q=80&w=1000',
        isBestSeller: true,
        rating: 4.9,
        reviews: 42,
        colors: {
            classic: [{ name: 'Pale Pink', hex: '#FADADD' }, { name: 'Baby Blue', hex: '#89CFF0' }]
        },
        sizes: ['NB', '3M', '6M', '12M']
    },
    {
        id: 'k2',
        name: 'Dinosaur Print T-shirt',
        category: 'Kids',
        subCategory: 'Boys',
        price: 2200,
        image: 'https://images.unsplash.com/photo-1519235106638-30cc588c668b?auto=format&fit=crop&q=80&w=1000',
        isNew: true,
        rating: 4.7,
        reviews: 28,
        colors: {
            seasonal: [{ name: 'Green', hex: '#008000' }]
        },
        sizes: ['2T', '3T', '4T', '5T']
    },
    {
        id: 'k3',
        name: 'Tulle Party Dress',
        category: 'Kids',
        subCategory: 'Girls',
        price: 4800,
        image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=1000',
        rating: 4.8,
        reviews: 35,
        colors: {
            classic: [{ name: 'Rose', hex: '#FF007F' }, { name: 'Gold', hex: '#D4AF37' }]
        },
        sizes: ['3T', '4T', '5T', '6T']
    },
    {
        id: 'k4',
        name: 'Soft Denim Overalls',
        category: 'Kids',
        subCategory: 'Boys',
        price: 3500,
        image: 'https://images.unsplash.com/photo-1519457431-75514e710079?auto=format&fit=crop&q=80&w=1000',
        rating: 4.6,
        reviews: 15,
        colors: {
            classic: [{ name: 'Denim', hex: '#1560BD' }]
        },
        sizes: ['2T', '4T', '6T']
    },
    {
        id: 'k5',
        name: 'Matching Hair Bows Set',
        category: 'Kids',
        subCategory: 'Accessories',
        price: 1200,
        image: 'https://images.unsplash.com/photo-1544146195-2d93e185c786?auto=format&fit=crop&q=80&w=1000',
        rating: 4.5,
        reviews: 60,
        colors: {
            seasonal: [{ name: 'Multi', hex: '#FFB6C1' }]
        },
        sizes: ['OS']
    },
    {
        id: 'elbow-v-neck',
        name: "Womens Elbow Sleeve V-Neck",
        category: 'Women',
        subCategory: 'Tops',
        price: 25500,
        image: "https://res.cloudinary.com/dnfbik3if/image/upload/v1770443016/pro_stuf7a.jpg",
        additionalImages: [
            "https://res.cloudinary.com/dnfbik3if/image/upload/v1770443016/pro_stuf7a.jpg",
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1000",
            "https://res.cloudinary.com/dnfbik3if/image/upload/v1770443930/Beige_White_and_Brown_Modern_Fashion_Facebook_Cover_on5b6y.jpg"
        ],
        description: "THE BEST-SELLING T-SHIRT, NOW IN A V-NECK. Our best-selling elbow sleeve tee—now with the timeless V-neckline you've been asking for. Made from the same ultra-soft, breathable premium fabric as our customer-favorite crew neck, this new style was created by popular demand. Designed for a relaxed yet refined drape, it's perfect for effortless layering or wearing solo. Thoughtfully crafted in Sri Lanka with sustainability in mind, this versatile staple is as comfortable as it is conscious.",
        isBestSeller: true,
        rating: 4.8,
        reviews: 235,
        colors: {
            classic: [
                { name: 'White', hex: '#FFFFFF' },
                { name: 'Black', hex: '#000000' },
                { name: 'Navy', hex: '#1B2631' },
                { name: 'Charcoal', hex: '#2C3E50' },
                { name: 'Slate', hex: '#34495E' },
                { name: 'Grey', hex: '#7F8C8D' },
                { name: 'Lavender', hex: '#D5D8DC' },
                { name: 'Cloud', hex: '#F4F6F7' }
            ],
            seasonal: [
                { name: 'Sky', hex: '#AED6F1' },
                { name: 'Moss', hex: '#52BE80' },
                { name: 'Rose', hex: '#EC7063' },
                { name: 'Peach', hex: '#F5B041' },
                { name: 'Plum', hex: '#8E44AD' },
                { name: 'Sun', hex: '#F4D03F' },
                { name: 'Crimson', hex: '#C0392B' }
            ]
        },
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        details: {
            overview: "A timeless V-neck tee with elegant elbow-length sleeves, crafted for effortless layering or wearing solo. Pre-shrunk for a consistent fit. Family-made with care and attention to every stitch.",
            sustainability: "Ethically produced in Sri Lanka using 100% locally sourced premium fabrics. Our facilities are solar-powered and we implement a zero-waste cutting policy to minimize environmental impact.",
            fit: "Tailored with a contoured yet comfortable fit. McKenna is 5'9\" (measurements: 34\" 27\" 37\") and is wearing a size SMALL. If you prefer a more oversized look, we recommend sizing up one size.",
            returns: "Enjoy free returns and exchanges within 30 days of purchase. We provide a pre-paid shipping label for all domestic orders to ensure a seamless experience."
        }
    }
];

