# Deployment & SEO Guide for Mapalengke

## 🚀 Quick Deployment (Vercel - Recommended)

### Method 1: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Method 2: Using Vercel Dashboard (Easier)

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import your `hbralcaide/web` repository
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. **Add Environment Variables** in Vercel Dashboard:
   
   **Public Variables (VITE_ prefix - safe to expose):**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_FUNCTIONS_URL`
   - `VITE_MAPPEDIN_SKIP_MAPDATA`
   - `VITE_MAPPEDIN_API_KEY`
   - `VITE_MAPPEDIN_MAP_ID`
   - `VITE_MAPPEDIN_MVF_URL`
   
   **Private Variables (NO VITE_ prefix - server-only):**
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `MAPPEDIN_SECRET`
   
   ⚠️ See `SECURITY_GUIDE.md` for detailed security information!

7. Click "Deploy"

Your site will be live at: `https://your-project-name.vercel.app`

---

## 🔍 Making Your Website Discoverable on Google

### Step 1: Update Your URLs

After deployment, update these files with your actual domain:

1. **public/robots.txt** - Replace `https://yourwebsite.com` with your actual URL
2. **public/sitemap.xml** - Replace all instances of `https://yourwebsite.com`
3. **index.html** - Update the `og:url` meta tag

### Step 2: Submit to Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add Property"
3. Enter your website URL
4. Verify ownership (Vercel makes this easy with DNS verification)
5. Submit your sitemap: `https://yourwebsite.com/sitemap.xml`

### Step 3: Submit to Bing Webmaster Tools

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site
3. Verify ownership
4. Submit sitemap

### Step 4: Get Indexed Faster

After submitting to search consoles:
- Request indexing for your main pages manually
- Share your website on social media
- Get backlinks from other websites
- Create quality content

---

## 📊 SEO Best Practices Implemented

✅ **Meta Tags** - Title, description, keywords added to `index.html`
✅ **Open Graph Tags** - For social media sharing
✅ **robots.txt** - Tells search engines what to crawl
✅ **sitemap.xml** - Lists all your important pages
✅ **Mobile Responsive** - Already configured with viewport meta tag

---

## 🎯 Additional SEO Tips

1. **Custom Domain** (Optional but Recommended)
   - Buy a domain (e.g., mapalengke.com from Namecheap/GoDaddy)
   - Add it to Vercel in Project Settings > Domains
   - Update all URLs in robots.txt, sitemap.xml, and meta tags

2. **SSL Certificate**
   - Vercel automatically provides HTTPS (already done!)

3. **Performance**
   - Your Vite build is already optimized
   - Consider adding lazy loading for images

4. **Content**
   - Add more text content to your pages
   - Use proper heading tags (h1, h2, h3)
   - Add alt text to images

5. **Analytics** (Optional)
   - Add Google Analytics to track visitors
   - Add to `index.html`:
     ```html
     <!-- Google Analytics -->
     <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
     <script>
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'GA_MEASUREMENT_ID');
     </script>
     ```

---

## ⏱️ Timeline for Google Indexing

- **Immediate**: Submit to Google Search Console
- **1-2 days**: Google starts crawling
- **1-4 weeks**: Site appears in search results
- **Ongoing**: Rankings improve with content and backlinks

---

## 🔧 Troubleshooting

**Site not appearing in Google?**
- Check Google Search Console for errors
- Verify robots.txt isn't blocking Google
- Make sure site is actually deployed and accessible
- Wait at least 1-2 weeks after submission

**Want to speed up indexing?**
- Create quality content
- Get mentioned on other websites
- Share on social media
- Request manual indexing in Google Search Console

---

## 📝 Next Steps

1. ✅ Deploy to Vercel (follow steps above)
2. ✅ Update URLs in robots.txt and sitemap.xml
3. ✅ Submit to Google Search Console
4. ✅ Submit to Bing Webmaster Tools
5. ⏳ Wait for indexing (1-4 weeks)
6. 📈 Monitor in Search Console
