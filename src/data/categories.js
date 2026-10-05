const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`

export const categories = [
  {
    id: 'electronics',
    nameKey: 'categories.electronics',
    image: u('photo-1498049794561-7780e7231661'),
    gradient: 'bg-blue-600',
    subcategories: ['Smartphones', 'Laptops', 'Audio & Headphones', 'Cameras', 'Smart Watches', 'Gaming', 'TV & Home Theater', 'Accessories'],
    description: 'Cutting-edge devices and gadgets from world-leading brands.'
  },
  {
    id: 'fashion',
    nameKey: 'categories.fashion',
    image: u('photo-1445205170230-053b83016050'),
    gradient: 'bg-pink-500',
    subcategories: ['Men', 'Women', 'Shoes', 'Bags & Wallets', 'Watches', 'Jewelry', 'Sunglasses', 'Activewear'],
    description: 'Premium clothing, footwear and accessories for every style.'
  },
  {
    id: 'home',
    nameKey: 'categories.home',
    image: u('photo-1555041469-a586c61ea9bc'),
    gradient: 'bg-amber-500',
    subcategories: ['Furniture', 'Decor', 'Kitchen', 'Bedding', 'Lighting', 'Garden', 'Smart Home', 'Storage'],
    description: 'Beautiful furniture and decor to transform your living space.'
  },
  {
    id: 'beauty',
    nameKey: 'categories.beauty',
    image: u('photo-1596462502278-27bfdc403348'),
    gradient: 'bg-brand-600',
    subcategories: ['Skincare', 'Makeup', 'Fragrance', 'Hair Care', 'Men Grooming', 'Personal Care', 'Wellness'],
    description: 'Luxury beauty, skincare and wellness products.'
  },
  {
    id: 'sports',
    nameKey: 'categories.sports',
    image: u('photo-1517836357463-d25dfeac3438'),
    gradient: 'bg-emerald-500',
    subcategories: ['Fitness', 'Running', 'Yoga', 'Outdoor', 'Cycling', 'Camping', 'Team Sports', 'Sports Nutrition'],
    description: 'Gear and equipment for athletes and outdoor lovers.'
  },
  {
    id: 'toys',
    nameKey: 'categories.toys',
    image: u('photo-1566576912321-d58ddd7a6088'),
    gradient: 'bg-cyan-500',
    subcategories: ['Action Figures', 'Building Sets', 'Board Games', 'Remote Control', 'STEM Toys', 'Plush Toys', 'Puzzles'],
    description: 'Fun and educational toys for children of all ages.'
  },
  {
    id: 'automotive',
    nameKey: 'categories.automotive',
    image: u('photo-1503376780353-7e6692767b70'),
    gradient: 'bg-slate-700',
    subcategories: ['Car Accessories', 'Tires & Wheels', 'Car Care', 'Interior', 'Electronics', 'Motorcycle', 'Tools'],
    description: 'Everything you need to keep your vehicle in top shape.'
  },
  {
    id: 'books',
    nameKey: 'categories.books',
    image: u('photo-1512820790803-83ca734da794'),
    gradient: 'bg-red-600',
    subcategories: ['Fiction', 'Non-Fiction', 'Children Books', 'Business', 'Science', 'Biography', 'Comics'],
    description: 'Millions of books, audiobooks and more.'
  },
  {
    id: 'grocery',
    nameKey: 'categories.grocery',
    image: u('photo-1542838132-92c53300491e'),
    gradient: 'bg-lime-600',
    subcategories: ['Coffee & Tea', 'Snacks', 'Organic', 'Beverages', 'Pantry', 'Health Foods', 'Imported'],
    description: 'Premium groceries and gourmet foods delivered to your door.'
  },
  {
    id: 'baby',
    nameKey: 'categories.baby',
    image: u('photo-1555252333-9f8e92e65df9'),
    gradient: 'bg-brand-500',
    subcategories: ['Nursery', 'Strollers', 'Feeding', 'Diapers', 'Baby Fashion', 'Toys', 'Safety'],
    description: 'Everything for your little one, from nursery to playtime.'
  }
]

export const brands = [
  { id: 'aurora', name: 'Aurora', logo: 'A', gradient: 'bg-blue-600', country: 'USA', category: 'electronics', description: 'Pioneers in premium consumer electronics.' },
  { id: 'nova', name: 'NOVA', logo: 'N', gradient: 'bg-brand-600', country: 'Germany', category: 'electronics', description: 'German engineering at its finest.' },
  { id: 'velour', name: 'Velour', logo: 'V', gradient: 'bg-pink-500', country: 'Italy', category: 'fashion', description: 'Italian luxury fashion and leather goods.' },
  { id: 'atlas', name: 'Atlas', logo: 'A', gradient: 'bg-emerald-500', country: 'Switzerland', category: 'fashion', description: 'Swiss precision watches and accessories.' },
  { id: 'oasis', name: 'Oasis Living', logo: 'O', gradient: 'bg-amber-500', country: 'Denmark', category: 'home', description: 'Scandinavian home and furniture design.' },
  { id: 'lumen', name: 'Lumen Beauty', logo: 'L', gradient: 'bg-brand-600', country: 'France', category: 'beauty', description: 'Parisian skincare and fragrance.' },
  { id: 'peak', name: 'Peak Performance', logo: 'P', gradient: 'bg-cyan-600', country: 'Sweden', category: 'sports', description: 'Performance gear for the bold.' },
  { id: 'kinetic', name: 'Kinetic', logo: 'K', gradient: 'bg-red-500', country: 'Japan', category: 'toys', description: 'Innovative toys and building sets from Tokyo.' },
  { id: 'torque', name: 'Torque', logo: 'T', gradient: 'bg-slate-700', country: 'USA', category: 'automotive', description: 'Automotive parts and accessories.' },
  { id: 'folio', name: 'Folio Press', logo: 'F', gradient: 'bg-amber-600', country: 'UK', category: 'books', description: 'Publisher of award-winning literature.' },
  { id: 'terra', name: 'Terra Foods', logo: 'T', gradient: 'bg-lime-500', country: 'Brazil', category: 'grocery', description: 'Organic and gourmet foods.' },
  { id: 'bloom', name: 'Bloom Baby', logo: 'B', gradient: 'bg-pink-400', country: 'USA', category: 'baby', description: 'Gentle, safe products for little ones.' }
]

export const testimonials = [
  { name: 'Sofia M.', role: 'Verified Buyer', country: 'Spain', text: 'The quality exceeded my expectations. Delivery was fast and the packaging was impeccable.', rating: 5 },
  { name: 'James K.', role: 'Verified Buyer', country: 'United Kingdom', text: 'I have bought from many marketplaces but Ciar VIP is on another level. Premium experience from start to finish.', rating: 5 },
  { name: 'Amina R.', role: 'Verified Buyer', country: 'UAE', text: 'Customer support resolved my issue in minutes. The luxury products are genuine and beautifully presented.', rating: 5 },
  { name: 'Lucas P.', role: 'Verified Buyer', country: 'Brazil', text: 'Worldwide shipping worked flawlessly. My order arrived earlier than expected and perfectly intact.', rating: 5 },
  { name: 'Yuki T.', role: 'Verified Buyer', country: 'Japan', text: 'Attention to detail is incredible. The app experience is smooth and the selection is unmatched.', rating: 4 },
  { name: 'Meera S.', role: 'Verified Buyer', country: 'India', text: 'Great prices on premium brands and the 30-day returns policy gives me total peace of mind.', rating: 5 }
]

export const couponCodes = [
  { code: 'LUMINA20', discount: 20, minOrder: 50, expires: '2026-12-31', category: 'all' },
  { code: 'FASHION15', discount: 15, minOrder: 30, expires: '2026-11-30', category: 'fashion' },
  { code: 'ELECTRO10', discount: 10, minOrder: 100, expires: '2026-10-31', category: 'electronics' },
  { code: 'HOME25', discount: 25, minOrder: 80, expires: '2026-12-15', category: 'home' },
  { code: 'WELCOME', discount: 10, minOrder: 20, expires: '2027-01-31', category: 'all' }
]
