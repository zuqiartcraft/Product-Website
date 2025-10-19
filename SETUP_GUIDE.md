# ZuqiArt&Crafts Website - Setup Guide

## 🚀 Quick Start

### 1. Database Setup (Supabase)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is ready, go to the SQL Editor
3. Run the following SQL to create your products table:

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  short_description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  size TEXT,
  image_url TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
```

### 2. Environment Variables

1. Create a file named `.env.local` in the root directory
2. Copy the following and fill in your values:

```env
# Supabase Configuration
# Find these in your Supabase project settings under API
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Admin Credentials
# Set your own secure credentials
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
```

**How to find Supabase credentials:**

- Go to your Supabase project dashboard
- Click on Settings (gear icon) → API
- Copy the "Project URL" for `NEXT_PUBLIC_SUPABASE_URL`
- Copy the "anon public" key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Your website will be available at:

- **Main Website:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin

## 📱 Using the Website

### Main Website (/)

- Browse all active products in a beautiful grid layout
- Click on any product to view full details
- Use pagination to navigate through products
- Toggle between light and dark mode using the sun/moon icon
- Click "Buy Now" or "Chat on WhatsApp" on product pages

### Admin Panel (/admin)

1. Navigate to http://localhost:3000/admin
2. Login with the credentials you set in `.env.local`
3. Once logged in, you can:
   - **Add Products:** Click the "Add Product" button
   - **Edit Products:** Click the edit (pencil) icon on any product
   - **Disable/Enable Products:** Click the eye icon to toggle visibility
   - **Delete Products:** Click the trash icon (with confirmation)

### Adding Your First Product

1. Login to admin panel
2. Click "Add Product"
3. Fill in the form:
   - **Name:** Your product name
   - **Short Description:** Brief description (shown on product cards)
   - **Long Description:** Detailed information (shown on product detail page)
   - **Size:** Product size/dimensions (optional)
   - **Image URL:** Full URL to product image (e.g., from Cloudinary, Imgur, etc.)
   - **Price:** Product price in USD
4. Click "Add Product"

## 🖼️ Image Hosting Recommendations

For product images, you can use:

- **Cloudinary** (free tier available) - https://cloudinary.com
- **Imgur** - https://imgur.com
- **Supabase Storage** - Use your own Supabase project storage
- Any other image hosting service that provides direct image URLs

## 🎨 Features

✅ **Main Website**

- Responsive product grid (1-4 columns based on screen size)
- Product detail pages
- Pagination
- Search bar (UI ready)
- Dark/Light mode
- WhatsApp integration

✅ **Admin Panel**

- Secure login
- Add/Edit/Delete products
- Enable/Disable products (soft delete)
- Real-time updates
- Dark/Light mode

## 🔧 Customization

### Changing Colors

Edit `src/components/` files to modify the color scheme. The primary color is blue (`bg-blue-600`, `text-blue-600`, etc.)

### WhatsApp Number

Edit `src/app/product/[id]/page.tsx` line ~68:

```typescript
const whatsappUrl = `https://wa.me/YOUR_PHONE_NUMBER?text=${encodeURIComponent(
  message
)}`;
```

Replace `YOUR_PHONE_NUMBER` with your WhatsApp business number (format: country code + number, e.g., 1234567890)

### Buy Now Functionality

Currently shows an alert. Implement your payment gateway in `src/app/product/[id]/page.tsx` in the `handleBuyNow` function.

## 📦 Production Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add your environment variables in Vercel project settings
5. Deploy!

Vercel will automatically detect it's a Next.js project and configure everything.

## 🆘 Troubleshooting

**Issue:** Products not showing

- Check if products exist in your database
- Verify `is_active` is set to `true` for products
- Check browser console for errors
- Verify Supabase credentials in `.env.local`

**Issue:** Can't login to admin

- Verify credentials in `.env.local` match what you're entering
- Make sure the variables are prefixed with `NEXT_PUBLIC_`
- Restart the dev server after changing `.env.local`

**Issue:** Images not loading

- Verify image URLs are correct and accessible
- Check if the hosting service allows external linking
- Try using a different image hosting service

## 📝 Notes

- Admin credentials are checked on the client side for simplicity
- For production, implement server-side authentication with sessions/JWT
- The "Buy Now" button is a placeholder - integrate your payment provider
- Search functionality UI is ready but needs implementation
- You can add more product fields by updating the database schema and forms
