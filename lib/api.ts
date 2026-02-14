import { supabase } from './supabase';
import { Product } from './data'; // We might redefine Product or import it, let's redefine locally or extended version

// Re-exporting or redefining types to match Supabase return + UI needs
export interface Category {
    id: string;
    name: string;
    subCategories: SubCategory[];
}

export interface SubCategory {
    id: string;
    name: string;
    mainCategoryId: string;
}

export interface SupabaseProduct {
    id: string;
    name: string;
    regular_price: number;
    sale_price: number;
    is_new_arrival: boolean;
    is_best_seller: boolean;
    rating: number;
    review_count: number;
    main_image: string;
    additional_images: string[];
    description: string;
    main_category?: { name: string };
    sub_category?: { name: string };
    product_colors?: { color: { name: string; hex_value: string } }[];
    product_sizes?: { size: { name: string } }[];
}

export interface ProductReview {
    id: string;
    product_id: string;
    author_name: string;
    author_image_url?: string;
    rating: number;
    title?: string;
    content: string;
    is_approved: boolean;
    created_at: string;
}

export interface NavbarSubCategory {
    name: string;
    topProducts: { id: string; name: string }[];
}

export interface NavbarCategory {
    id: string;
    name: string;
    subCategories: NavbarSubCategory[];
}

// Function to fetch all categories and their subcategories
export async function getCategories() {
    const { data: mainCategories, error: mainError } = await supabase
        .from('main_categories')
        .select('id, name, display_order')
        .order('display_order');

    if (mainError) {
        console.error('Error fetching main categories:', mainError);
        return [];
    }

    const { data: subCategories, error: subError } = await supabase
        .from('sub_categories')
        .select('id, name, main_category_id, display_order')
        .order('display_order');

    if (subError) {
        console.error('Error fetching sub categories:', subError);
        return [];
    }

    // Map subcategories to main categories
    const categoriesWithSubs = mainCategories.map((cat: any) => ({
        ...cat,
        subCategories: subCategories
            .filter((sub: any) => sub.main_category_id === cat.id)
            .map((sub: any) => sub.name) // Just the name for now as per UI usage
    }));

    return categoriesWithSubs;
}

// Function to fetch navbar data including top selling products per subcategory
export async function getNavbarCategories() {
    // Fetch Main Categories
    const { data: mainCategories, error: mainError } = await supabase
        .from('main_categories')
        .select('id, name, display_order')
        .order('display_order');

    if (mainError) {
        console.error('Error fetching main categories:', mainError);
        return [];
    }

    // Fetch Sub Categories
    const { data: subCategories, error: subError } = await supabase
        .from('sub_categories')
        .select('id, name, main_category_id, display_order')
        .order('display_order');

    if (subError) {
        console.error('Error fetching sub categories:', subError);
        return [];
    }

    // Fetch Top Products (Best Sellers)
    const { data: bestSellers, error: prodError } = await supabase
        .from('products')
        .select('id, name, sub_category_id') // We need sub_category_id for mapping
        .eq('is_best_seller', true)
        .eq('is_active', true)
        .limit(100);

    if (prodError) {
        console.error('Error fetching navbar products:', prodError);
        return [];
    }

    // Assemble
    return mainCategories.map((main: any) => {
        const subs = subCategories
            .filter((sub: any) => sub.main_category_id === main.id)
            .map((sub: any) => {
                // Find products for this subcategory, limit to 2
                const products = bestSellers
                    .filter((p: any) => p.sub_category_id === sub.id)
                    .slice(0, 2)
                    .map((p: any) => ({ id: p.id, name: p.name }));

                return {
                    name: sub.name,
                    topProducts: products
                };
            });

        return {
            id: main.id,
            name: main.name,
            subCategories: subs
        };
    });
}

// Function to fetch best selling products with limit
export async function getBestSellers(limit: number = 30) {
    const { data, error } = await supabase
        .from('products')
        .select(`
            id,
            name,
            regular_price,
            sale_price,
            is_new_arrival,
            is_best_seller,
            rating,
            review_count,
            main_image,
            additional_images,
            description,
            main_category:main_categories(name),
            sub_category:sub_categories(name),
            product_colors(color:colors(name, hex_value)),
            product_sizes(size:sizes(name))
        `)
        .eq('is_best_seller', true)
        .eq('is_active', true)
        .limit(limit);

    if (error) {
        console.error('Error fetching best sellers:', error);
        return [];
    }

    return mapSupabaseProductsToUI(data);
}

// Function to fetch all products for collections page with filters
export async function getProducts() {
    const { data, error } = await supabase
        .from('products')
        .select(`
            id,
            name,
            regular_price,
            sale_price,
            is_new_arrival,
            is_best_seller,
            rating,
            review_count,
            main_image,
            additional_images,
            description,
            main_category:main_categories(name),
            sub_category:sub_categories(name),
            product_colors(color:colors(name, hex_value)),
            product_sizes(size:sizes(name))
        `)
        .eq('is_active', true);

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return mapSupabaseProductsToUI(data);
}

// Function to fetch a single product by ID
export async function getProductById(id: string) {
    const { data, error } = await supabase
        .from('products')
        .select(`
            id,
            name,
            regular_price,
            sale_price,
            is_new_arrival,
            is_best_seller,
            rating,
            review_count,
            main_image,
            additional_images,
            description,
            main_category:main_categories(name),
            sub_category:sub_categories(name),
            product_colors(color:colors(name, hex_value)),
            product_sizes(size:sizes(name))
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return null;
    }

    // Wrap single result in array then unpack
    const mapped = mapSupabaseProductsToUI([data]);
    return mapped.length > 0 ? mapped[0] : null;
}

// Function to fetch related products
export async function getRelatedProducts(category: string, excludeId: string, limit: number = 4) {
    // Use inner join to filter by category name
    const { data, error } = await supabase
        .from('products')
        .select(`
            id,
            name,
            regular_price,
            sale_price,
            is_new_arrival,
            is_best_seller,
            rating,
            review_count,
            main_image,
            additional_images,
            description,
            main_category:main_categories!inner(name),
            sub_category:sub_categories(name),
            product_colors(color:colors(name, hex_value)),
            product_sizes(size:sizes(name))
        `)
        .eq('is_active', true)
        .neq('id', excludeId)
        .eq('main_categories.name', category)
        .limit(limit);

    if (error) {
        console.error('Error fetching related products:', error);
        return [];
    }

    return mapSupabaseProductsToUI(data);
}

// Function to fetch distinct colors and sizes for filters
export async function getFilterOptions() {
    const { data: colors, error: colorError } = await supabase
        .from('colors')
        .select('name, hex_value')
        .order('display_order');

    const { data: sizes, error: sizeError } = await supabase
        .from('sizes')
        .select('name')
        .order('display_order');

    if (colorError || sizeError) {
        console.error('Error fetching filter options:', colorError, sizeError);
        return { colors: [], sizes: [] };
    }

    return {
        colors: colors || [],
        sizes: sizes?.map(s => s.name) || [] // Just names for sizes
    };
}

// Function to fetch approved site reviews
export async function getSiteReviews() {
    const { data, error } = await supabase
        .from('site_reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching site reviews:', error);
        return [];
    }
    return data;
}

// Function to fetch featured site reviews
export async function getFeaturedReviews(limit: number = 3) {
    let { data, error } = await supabase
        .from('site_reviews')
        .select('*')
        .eq('is_approved', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching featured site reviews:', error);
        return [];
    }

    // Fallback to most recent approved site reviews if no featured ones exist
    if (!data || data.length === 0) {
        const { data: fallbackData, error: fallbackError } = await supabase
            .from('site_reviews')
            .select('*')
            .eq('is_approved', true)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (fallbackError) {
            console.error('Error fetching site reviews fallback:', fallbackError);
            return [];
        }
        return fallbackData || [];
    }

    return data;
}

// Function to fetch approved reviews for a specific product
export async function getReviewsByProductId(productId: string) {
    const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reviews for product:', error);
        return [];
    }
    return data as ProductReview[];
}

// Function to submit a review
export async function submitReview(reviewData: Omit<ProductReview, 'id' | 'is_approved' | 'created_at'>) {
    const { data, error } = await supabase
        .from('product_reviews')
        .insert([{
            ...reviewData,
            is_approved: false // Always needs admin approval
        }])
        .select();

    if (error) {
        console.error('Error submitting review:', error);
        throw error;
    }
    return data;
}

// Function to fetch approved product reviews
export async function getProductReviews() {
    const { data, error } = await supabase
        .from('product_reviews')
        .select(`
            *,
            product:products(name, main_image)
        `)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching product reviews:', error);
        return [];
    }
    return data;
}


// Function to create a new order
export async function createOrder(orderData: any, items: any[]) {
    // Generate a short, readable order number (e.g., #DC-123456)
    // Using timestamp suffix for basic uniqueness in low-volume dev
    const shortId = Date.now().toString().slice(-6) + Math.random().toString().slice(2, 4);
    const orderNumber = `DC-${shortId}`;

    // 1. Create the order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
            ...orderData,
            order_number: orderNumber // Explicitly set if schema doesn't auto-generate it
        }])
        .select()
        .single();

    if (orderError) throw orderError;

    // 2. Create the order items
    const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image_url: item.image,
        color_name: item.color,
        size_name: item.size,
        unit_price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

    if (itemsError) throw itemsError;

    return order;
}

// Function to fetch orders for a specific user
export async function getOrdersByUserId(userId: string) {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            order_items(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching user orders:', error);
        return [];
    }
    return data;
}

// Function to fetch all orders (Admin)
export async function getAllOrders(filters?: { status?: string, search?: string }) {
    let query = supabase
        .from('orders')
        .select(`
            *,
            order_items(*)
        `)
        .order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
    }

    if (filters?.search) {
        // Search by order_number or customer_name
        query = query.or(`order_number.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching all orders:', error);
        return [];
    }
    return data;
}

// Function to update order status
export async function updateOrderStatus(orderId: string, status: string) {
    const updateData: any = { status, updated_at: new Date().toISOString() };

    if (status === 'shipped') updateData.shipped_at = new Date().toISOString();
    if (status === 'delivered') updateData.delivered_at = new Date().toISOString();
    if (status === 'cancelled') updateData.cancelled_at = new Date().toISOString();

    const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select();

    if (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
    return data;
}

// Helper to map DB response to UI Product interface
function mapSupabaseProductsToUI(data: any[]): Product[] {
    return data.map((item) => ({
        id: item.id,
        name: item.name,
        category: (item.main_category?.name || 'Women') as any, // Default or strictly typed
        subCategory: item.sub_category?.name || '',
        price: Number(item.sale_price) || Number(item.regular_price),
        originalPrice: item.sale_price ? Number(item.regular_price) : undefined,
        image: item.main_image || '',
        additionalImages: item.additional_images || [],
        isNew: item.is_new_arrival,
        isBestSeller: item.is_best_seller,
        rating: Number(item.rating),
        reviews: item.review_count,
        description: item.description,
        colors: {
            classic: item.product_colors?.map((pc: any) => ({
                name: pc.color.name,
                hex: pc.color.hex_value
            })) || [],
            seasonal: [] // Assuming all are classic for now unless distinguished in DB
        },
        sizes: item.product_sizes?.map((ps: any) => ps.size.name) || [],
        details: {
            overview: item.description || "Crafted from our signature premium fabric, this essential piece combines timeless style with unparalleled comfort.",
            sustainability: "Ethically produced in Sri Lanka using 100% locally sourced premium fabrics. Our facilities are solar-powered and we implement a zero-waste cutting policy.",
            fit: "Tailored with a contoured yet comfortable fit. If you prefer a more oversized look, we recommend sizing up one size.",
            returns: "Enjoy free returns and exchanges within 30 days of purchase. We provide a pre-paid shipping label for all domestic orders."
        }
    }));
}
