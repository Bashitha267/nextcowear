export interface Product {
    id: string;
    name: string;
    category: 'Women' | 'Men' | 'Kids';
    subCategory: string;
    price: number;
    originalPrice?: number;
    image: string;
    hoverImage?: string;
    isNew?: boolean;
    isBestSeller?: boolean;
    rating: number;
    reviews: number;
    colors: { name: string; hex: string }[];
    sizes: string[];
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
        isNew: true,
        rating: 4.8,
        reviews: 24,
        colors: [{ name: 'Gold', hex: '#D4AF37' }, { name: 'Black', hex: '#000000' }],
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
        rating: 4.5,
        reviews: 56,
        colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Beige', hex: '#F5F5DC' }],
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
        colors: [{ name: 'Navy', hex: '#000080' }, { name: 'Grey', hex: '#808080' }],
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
        colors: [{ name: 'Black', hex: '#000000' }, { name: 'Camel', hex: '#C19A6B' }],
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
        colors: [{ name: 'Champagne', hex: '#F7E7CE' }, { name: 'Emerald', hex: '#50C878' }],
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
        colors: [{ name: 'Floral', hex: '#FF69B4' }],
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
        isBestSeller: true,
        rating: 4.6,
        reviews: 89,
        colors: [{ name: 'Light Blue', hex: '#ADD8E6' }, { name: 'White', hex: '#FFFFFF' }],
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
        colors: [{ name: 'Khaki', hex: '#C3B091' }, { name: 'Navy', hex: '#000080' }],
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
        colors: [{ name: 'Charcoal', hex: '#36454F' }, { name: 'Oatmeal', hex: '#E3D7D1' }],
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
        colors: [{ name: 'Grey', hex: '#808080' }, { name: 'Black', hex: '#000000' }],
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
        colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#000000' }],
        sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },

    // KIDS
    {
        id: 'k1',
        name: 'Organic Cotton Onesie',
        category: 'Kids',
        subCategory: 'Infants',
        price: 1800,
        image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&q=80&w=1000',
        isBestSeller: true,
        rating: 4.9,
        reviews: 42,
        colors: [{ name: 'Pale Pink', hex: '#FADADD' }, { name: 'Baby Blue', hex: '#89CFF0' }],
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
        colors: [{ name: 'Green', hex: '#008000' }],
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
        colors: [{ name: 'Rose', hex: '#FF007F' }, { name: 'Gold', hex: '#D4AF37' }],
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
        colors: [{ name: 'Denim', hex: '#1560BD' }],
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
        colors: [{ name: 'Multi', hex: '#FFB6C1' }],
        sizes: ['OS']
    }
];
