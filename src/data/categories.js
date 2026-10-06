const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`

export const categories = [
  {
    id: 'women',
    nameKey: 'categories.women',
    image: u('photo-1566174053879-31528523f8ae'),
    gradient: 'bg-rose-700',
    subcategories: ['Haute Couture', 'Evening Gowns', 'Luxury Abayas', 'Cocktail Dresses', 'Cashmere Knitwear', 'Designer Outerwear'],
    description: 'Haute couture, evening gowns and signature pieces from the great fashion houses.'
  },
  {
    id: 'men',
    nameKey: 'categories.men',
    image: u('photo-1617127365659-c47fa864d8bc'),
    gradient: 'bg-slate-800',
    subcategories: ['Bespoke Suits', 'Tuxedos', 'Luxury Thobes', 'Cashmere Coats', 'Silk Shirts', 'Leather Jackets'],
    description: 'Bespoke tailoring, rare fabrics and refined menswear for gentlemen of distinction.'
  },
  {
    id: 'bags',
    nameKey: 'categories.bags',
    image: u('photo-1591561954557-26941169b49e'),
    gradient: 'bg-amber-700',
    subcategories: ['Iconic Handbags', 'Clutches', 'Totes', 'Top-Handle Bags', 'Exotic Leather', 'Small Leather Goods'],
    description: 'Iconic handbags and investment pieces, including the rarest exotic leathers.'
  },
  {
    id: 'watches',
    nameKey: 'categories.watches',
    image: u('photo-1587836374828-4dbafa94cf0e'),
    gradient: 'bg-midnight-900',
    subcategories: ['Grand Complications', 'Sports Luxury', 'Dress Watches', 'Skeleton Watches', 'Limited Editions', 'Pre-Owned Rare'],
    description: 'Haute horlogerie from Geneva and beyond, from grand complications to waitlist icons.'
  },
  {
    id: 'jewelry',
    nameKey: 'categories.jewelry',
    image: u('photo-1611591437281-460bfbe1220a'),
    gradient: 'bg-amber-600',
    subcategories: ['High Jewelry', 'Diamond Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Pearls'],
    description: 'High jewelry, certified diamonds and precious stones set by legendary maisons.'
  },
  {
    id: 'shoes',
    nameKey: 'categories.shoes',
    image: u('photo-1596703263926-eb0762ee17e4'),
    gradient: 'bg-red-800',
    subcategories: ['Stilettos', 'Couture Pumps', 'Oxford & Derby', 'Loafers', 'Bespoke Shoes'],
    description: 'Couture heels and hand-welted shoes crafted by the masters of footwear.'
  },
  {
    id: 'fragrance',
    nameKey: 'categories.fragrance',
    image: u('photo-1594035910387-fea47794261f'),
    gradient: 'bg-yellow-700',
    subcategories: ['Niche Perfumes', 'Oud & Oriental', 'Haute Parfumerie', 'Extraits', 'Fragrance Sets'],
    description: 'Niche perfumes, precious oud and rare extraits from the finest perfume houses.'
  },
  {
    id: 'beauty',
    nameKey: 'categories.beauty',
    image: u('photo-1598440947619-2c35fc9aa908'),
    gradient: 'bg-pink-700',
    subcategories: ['Luxury Skincare', 'Anti-Aging', 'Caviar & Gold Care', 'Makeup Couture', 'Spa Rituals'],
    description: 'Prestige skincare and beauty rituals with caviar, gold and rare botanicals.'
  },
  {
    id: 'accessories',
    nameKey: 'categories.accessories',
    image: u('photo-1572635196237-14b3f281503f'),
    gradient: 'bg-stone-700',
    subcategories: ['Writing Instruments', 'Sunglasses', 'Leather Belts', 'Silk Scarves', 'Cufflinks', 'Wallets'],
    description: 'Fine writing instruments, eyewear and leather accessories that complete the look.'
  },
  {
    id: 'home',
    nameKey: 'categories.home',
    image: u('photo-1555041469-a586c61ea9bc'),
    gradient: 'bg-emerald-800',
    subcategories: ['Crystal & Lighting', 'Designer Furniture', 'Fine Tableware', 'Home Fragrance', 'Silverware'],
    description: 'Designer furniture, crystal and objets d’art for exceptional residences.'
  },
  {
    id: 'tech',
    nameKey: 'categories.tech',
    image: u('photo-1546435770-a3e426bf472b'),
    gradient: 'bg-zinc-800',
    subcategories: ['Luxury Phones', 'High-End Audio', 'Premium Cameras', 'Bespoke Devices'],
    description: 'Handcrafted phones, audiophile sound and precision cameras.'
  },
  {
    id: 'travel',
    nameKey: 'categories.travel',
    image: u('photo-1565026057447-bc90a3dceb87'),
    gradient: 'bg-teal-700',
    subcategories: ['Luxury Luggage', 'Weekenders', 'Travel Cases', 'Trunks'],
    description: 'Iconic luggage and travel cases for first-class journeys.'
  },
  {
    id: 'leisure',
    nameKey: 'categories.leisure',
    image: u('photo-1567899378494-47b22a2ae96a'),
    gradient: 'bg-sky-800',
    subcategories: ['Golf', 'Equestrian', 'Yachting', 'Ski & Après-Ski'],
    description: 'Golf, equestrian, yachting and alpine pursuits of the elite.'
  },
  {
    id: 'art',
    nameKey: 'categories.art',
    image: u('photo-1579783902614-a3fb3927b6a5'),
    gradient: 'bg-orange-800',
    subcategories: ['Fine Art', 'Sculptures', 'Limited Editions', 'Chess Sets', 'Objets d’Art'],
    description: 'Original artworks, collectible objects and limited editions for the discerning collector.'
  }
]

const brand = (id, name, logo, country, category, description, rare = false, gradient = 'bg-midnight-900') => ({
  id,
  name,
  logo,
  country,
  category,
  description,
  rare,
  gradient
})

export const brands = [
  brand('chanel', 'Chanel', 'CC', 'France', 'women', 'The Parisian house of timeless tweed, N°5 and haute couture.'),
  brand('dior', 'Dior', 'D', 'France', 'women', 'The New Look legacy of Christian Dior, from couture to the Bar jacket.', false, 'bg-slate-700'),
  brand('valentino', 'Valentino', 'V', 'Italy', 'women', 'Roman couture famed for its signature Valentino red.', false, 'bg-red-800'),
  brand('elie-saab', 'Elie Saab', 'ES', 'Lebanon', 'women', 'Beirut-born haute couture of embroidered, ethereal evening gowns.', false, 'bg-amber-700'),
  brand('zuhair-murad', 'Zuhair Murad', 'ZM', 'Lebanon', 'women', 'Red-carpet couture with intricate lace and crystal work.', false, 'bg-rose-800'),
  brand('brioni', 'Brioni', 'B', 'Italy', 'men', 'Roman tailoring house dressing heads of state since 1945.'),
  brand('kiton', 'Kiton', 'K', 'Italy', 'men', 'Neapolitan bespoke tailoring, among the rarest suits in the world.', true, 'bg-stone-800'),
  brand('tom-ford', 'Tom Ford', 'TF', 'USA', 'men', 'Sharp, glamorous tailoring and evening wear.', false, 'bg-zinc-900'),
  brand('loro-piana', 'Loro Piana', 'LP', 'Italy', 'men', 'The world’s finest cashmere, baby cashmere and vicuña.', false, 'bg-amber-800'),
  brand('stefano-ricci', 'Stefano Ricci', 'SR', 'Italy', 'men', 'Florentine luxury for the most discerning gentlemen.', true, 'bg-yellow-800'),
  brand('hermes', 'Hermès', 'H', 'France', 'bags', 'Parisian saddler since 1837, maker of the Birkin and Kelly.', true, 'bg-orange-700'),
  brand('louis-vuitton', 'Louis Vuitton', 'LV', 'France', 'bags', 'The trunk-maker that defined luxury travel.', false, 'bg-amber-900'),
  brand('gucci', 'Gucci', 'G', 'Italy', 'bags', 'Florentine house of bold, iconic leather goods.', false, 'bg-emerald-900'),
  brand('goyard', 'Goyard', 'GY', 'France', 'bags', 'Discreet Parisian trunk-maker, sold only in its own boutiques.', true, 'bg-stone-700'),
  brand('moynat', 'Moynat', 'M', 'France', 'bags', 'One of the oldest Parisian trunk-makers, loved by connoisseurs.', true, 'bg-red-900'),
  brand('delvaux', 'Delvaux', 'DX', 'Belgium', 'bags', 'The oldest fine leather luxury house in the world, since 1829.', true, 'bg-teal-800'),
  brand('bottega-veneta', 'Bottega Veneta', 'BV', 'Italy', 'bags', 'Intrecciato leather craftsmanship without logos.', false, 'bg-lime-900'),
  brand('patek-philippe', 'Patek Philippe', 'PP', 'Switzerland', 'watches', 'Geneva manufacture of the world’s most coveted timepieces.', true),
  brand('rolex', 'Rolex', 'R', 'Switzerland', 'watches', 'The crown of Swiss watchmaking, from the Submariner to the Datejust.', false, 'bg-emerald-800'),
  brand('hublot', 'Hublot', 'HB', 'Switzerland', 'watches', 'The art of fusion: bold Big Bang chronographs in titanium, ceramic and gold.', false, 'bg-slate-800'),
  brand('iwc', 'IWC Schaffhausen', 'IWC', 'Switzerland', 'watches', 'Engineering-led haute horlogerie from Schaffhausen since 1868.', true, 'bg-sky-900'),
  brand('omega', 'Omega', 'Ω', 'Switzerland', 'watches', 'Master Chronometers worn on the Moon and in the deepest oceans.', false, 'bg-red-800'),
  brand('cartier', 'Cartier', 'C', 'France', 'jewelry', 'The jeweler of kings, creator of the Love bracelet.', false, 'bg-red-800'),
  brand('van-cleef', 'Van Cleef & Arpels', 'VCA', 'France', 'jewelry', 'Poetic high jewelry and the iconic Alhambra motif.', false, 'bg-emerald-900'),
  brand('bulgari', 'Bulgari', 'BVL', 'Italy', 'jewelry', 'Roman jeweler of bold colors and the Serpenti icon.', false, 'bg-amber-800'),
  brand('graff', 'Graff', 'GR', 'United Kingdom', 'jewelry', 'Home of the world’s most fabulous diamonds.', true, 'bg-slate-900'),
  brand('harry-winston', 'Harry Winston', 'HW', 'USA', 'jewelry', 'The King of Diamonds, jeweler to the stars.', true, 'bg-blue-900'),
  brand('mikimoto', 'Mikimoto', 'MK', 'Japan', 'jewelry', 'Inventor of the cultured pearl and master of Akoya pearls.', false, 'bg-stone-600'),
  brand('faberge', 'Fabergé', 'F', 'United Kingdom', 'jewelry', 'Imperial jeweler famed for its legendary eggs.', true, 'bg-indigo-900'),
  brand('louboutin', 'Christian Louboutin', 'CL', 'France', 'shoes', 'Couture heels with the unmistakable red sole.', false, 'bg-red-700'),
  brand('manolo-blahnik', 'Manolo Blahnik', 'MBL', 'United Kingdom', 'shoes', 'Sculptural, hand-made shoes beloved by icons.', false, 'bg-blue-800'),
  brand('john-lobb', 'John Lobb', 'JL', 'United Kingdom', 'shoes', 'Bootmaker by Royal Warrant, hand-welted in Northampton.', true, 'bg-amber-900'),
  brand('berluti', 'Berluti', 'BE', 'France', 'shoes', 'Parisian bootmaker known for its unique Venezia leather patinas.', true, 'bg-orange-900'),
  brand('clive-christian', 'Clive Christian', 'CLC', 'United Kingdom', 'fragrance', 'The crown perfumer behind one of the world’s most precious fragrances.', true, 'bg-yellow-800'),
  brand('roja', 'Roja Parfums', 'RJ', 'United Kingdom', 'fragrance', 'Haute parfumerie by master perfumer Roja Dove.', true, 'bg-stone-800'),
  brand('amouage', 'Amouage', 'AM', 'Oman', 'fragrance', 'The gift of kings, Omani haute parfumerie built on oud and frankincense.', false, 'bg-amber-700'),
  brand('mfk', 'Maison Francis Kurkdjian', 'MFK', 'France', 'fragrance', 'Parisian couture perfumery, creator of Baccarat Rouge 540.', false, 'bg-rose-800'),
  brand('creed', 'Creed', 'CR', 'France', 'fragrance', 'A royal heritage perfume house since 1760.', false, 'bg-zinc-800'),
  brand('la-mer', 'La Mer', 'LM', 'USA', 'beauty', 'The legendary Miracle Broth and Crème de la Mer.', false, 'bg-teal-900'),
  brand('la-prairie', 'La Prairie', 'LPR', 'Switzerland', 'beauty', 'Swiss science, caviar and pure gold skincare.', false, 'bg-blue-900'),
  brand('cle-de-peau', 'Clé de Peau Beauté', 'CDP', 'Japan', 'beauty', 'The key to radiant skin, Tokyo’s ultimate luxury beauty.', true, 'bg-indigo-800'),
  brand('sisley', 'Sisley Paris', 'SP', 'France', 'beauty', 'French phyto-cosmetology with precious plant extracts.', false, 'bg-slate-700'),
  brand('montblanc', 'Montblanc', 'MB', 'Germany', 'accessories', 'Masterpieces of fine writing since 1906.'),
  brand('st-dupont', 'S.T. Dupont', 'STD', 'France', 'accessories', 'Parisian maker of lacquered pens and fine objects since 1872.', true, 'bg-zinc-700'),
  brand('fendi-casa', 'Fendi Casa', 'FC', 'Italy', 'home', 'Roman luxury furniture with couture upholstery.', false, 'bg-amber-800'),
  brand('baccarat', 'Baccarat', 'BC', 'France', 'home', 'Royal crystal manufacture since 1764.', false, 'bg-red-900'),
  brand('lalique', 'Lalique', 'LQ', 'France', 'home', 'Art Deco crystal and lighting masterpieces.', true, 'bg-sky-800'),
  brand('vertu', 'Vertu', 'VT', 'United Kingdom', 'tech', 'Handcrafted luxury phones with sapphire and exotic leathers.', true, 'bg-zinc-900'),
  brand('caviar', 'Caviar', 'CV', 'Italy', 'tech', 'Bespoke gold and titanium editions of flagship phones.', true, 'bg-yellow-800'),
  brand('bang-olufsen', 'Bang & Olufsen', 'B&O', 'Denmark', 'tech', 'Danish audio design icons since 1925.', false, 'bg-slate-800'),
  brand('devialet', 'Devialet', 'DV', 'France', 'tech', 'Parisian sound engineering with patented ADH technology.', false, 'bg-zinc-700'),
  brand('leica', 'Leica', 'L', 'Germany', 'tech', 'Legendary German optics since 1914.', false, 'bg-red-700'),
  brand('rimowa', 'Rimowa', 'RW', 'Germany', 'travel', 'Iconic grooved aluminium luggage since 1898.', false, 'bg-slate-600'),
  brand('globe-trotter', 'Globe-Trotter', 'GT', 'United Kingdom', 'travel', 'Hand-made vulcanised fibreboard cases since 1897.', true, 'bg-teal-800'),
  brand('honma', 'Honma', 'HO', 'Japan', 'leisure', 'Sakata-crafted golf clubs finished in 24K gold and platinum.', true, 'bg-yellow-700'),
  brand('moncler', 'Moncler Grenoble', 'MG', 'France', 'leisure', 'High-performance alpine luxury born in Grenoble.', false, 'bg-blue-800'),
  brand('riva', 'Riva', 'RV', 'Italy', 'leisure', 'The legendary Italian yacht builder since 1842.', true, 'bg-sky-900'),
  brand('ciar-gallery', 'Ciar Private Gallery', 'CPG', 'Saudi Arabia', 'art', 'Curated original artworks and collectibles with full provenance.', true, 'bg-orange-800')
]

export const testimonials = [
  { name: 'Sara A.', role: 'Private Client', country: 'Saudi Arabia', text: 'My Birkin arrived in pristine condition with every certificate. The concierge service is unmatched.', rating: 5 },
  { name: 'Khalid M.', role: 'Private Client', country: 'UAE', text: 'Ciar VIP sourced a Patek Philippe I had been waiting years for. Discreet, fast and completely authentic.', rating: 5 },
  { name: 'Layla H.', role: 'Private Client', country: 'Kuwait', text: 'The couture selection rivals the boutiques of Paris. White-glove delivery to my door.', rating: 5 },
  { name: 'James K.', role: 'Private Client', country: 'United Kingdom', text: 'Rare brands I could not find anywhere else, presented beautifully and delivered impeccably.', rating: 5 },
  { name: 'Noura S.', role: 'Private Client', country: 'Qatar', text: 'From high jewelry to oud, every piece feels curated just for me.', rating: 5 },
  { name: 'Omar F.', role: 'Private Client', country: 'Bahrain', text: 'The personal shopper understood my taste immediately. A true luxury experience.', rating: 5 }
]

export const couponCodes = [
  { code: 'CIARVIP10', discount: 10, minOrder: 1000, expires: '2027-12-31', category: 'all' },
  { code: 'PRIVATE15', discount: 15, minOrder: 5000, expires: '2027-06-30', category: 'all' },
  { code: 'COUTURE8', discount: 8, minOrder: 2000, expires: '2027-03-31', category: 'women' },
  { code: 'HORLOGERIE5', discount: 5, minOrder: 10000, expires: '2027-03-31', category: 'watches' },
  { code: 'WELCOMEVIP', discount: 5, minOrder: 500, expires: '2027-12-31', category: 'all' }
]
