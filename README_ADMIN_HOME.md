# Mapalengke Admin Web - Public Home Page

## Overview
This web application now includes a public home page that displays available stalls for potential vendors to view and apply for. The page shows:

- **Available Stalls**: Real-time count of available stalls across all market sections
- **Market Sections**: Detailed view of each market section with stall availability
- **Admin Login**: Direct link for administrators to access the admin dashboard
- **Contact Information**: Easy ways for potential vendors to get in touch

## Features Added

### 1. Public Home Page (`/`)
- **Stats Overview**: Shows total available stalls, occupied stalls, and market sections
- **Market Sections Display**: Each section shows:
  - Section name and description
  - Available vs total stalls count
  - Visual grid of all stalls with status indicators
  - Special highlighting for available stalls
- **Call to Action**: Prominent section encouraging vendor applications
- **Admin Login Link**: Easy access for administrators

### 2. Database Integration
- **Stalls Table**: Created with proper relationships to market sections
- **Sample Data**: Automatically populated with sample stalls for each section
- **Real-time Data**: Fetches live data from Supabase database

### 3. Navigation Updates
- **Default Route**: Public home page is now the default landing page
- **Admin Access**: Login page moved to `/login` route
- **Seamless Navigation**: Easy flow between public and admin areas

## How to Run

### Prerequisites
1. Make sure you have Node.js installed
2. Ensure your Supabase database is set up and running
3. Run the database migration to create the stalls table

### Database Setup
```bash
# Run the migration to create the stalls table
# This will create the stalls table and populate it with sample data
```

### Development Server
```bash
# Navigate to the web directory
cd web

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build
```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

## Database Schema

### Stalls Table
- `id`: UUID primary key
- `stall_number`: Unique stall identifier (e.g., "E-01", "FV-15")
- `location`: Human-readable location description
- `status`: 'available', 'occupied', or 'maintenance'
- `vendor_id`: Reference to vendor (if occupied)
- `section_id`: Reference to market section
- `created_at`, `updated_at`: Timestamps

### Sample Data
The migration automatically creates sample stalls for each market section:
- **Eatery (E)**: 10 stalls (3 occupied, 1 maintenance, 6 available)
- **Fruits and Vegetables (FV)**: 10 stalls (3 occupied, 1 maintenance, 6 available)
- **Dried Fish (DF)**: 10 stalls (3 occupied, 1 maintenance, 6 available)
- **Grocery (G)**: 10 stalls (3 occupied, 1 maintenance, 6 available)
- **Rice and Grains (RG)**: 10 stalls (3 occupied, 1 maintenance, 6 available)
- **Fish (F)**: 10 stalls (3 occupied, 1 maintenance, 6 available)
- **Meat (M)**: 10 stalls (3 occupied, 1 maintenance, 6 available)
- **Variety (V)**: 10 stalls (3 occupied, 1 maintenance, 6 available)

## User Flow

### For Potential Vendors
1. Visit the public home page
2. Browse available stalls by market section
3. See real-time availability status
4. Contact admin via email or phone to apply
5. Get information about the application process

### For Administrators
1. Visit the public home page
2. Click "Admin Login" button
3. Log in with admin credentials
4. Access full admin dashboard for stall management

## Customization

### Contact Information
Update the contact details in `PublicHome.tsx`:
- Email: `admin@mapalengke.com`
- Phone: `(123) 456-7890`

### Styling
The page uses Tailwind CSS for styling. You can customize:
- Colors and branding
- Layout and spacing
- Typography and icons

### Content
Modify the text content in `PublicHome.tsx`:
- Welcome messages
- Call-to-action text
- Footer information

## Security

### Row Level Security (RLS)
- Market sections: Public read access, admin write access
- Stalls: Public read access, admin write access
- Admin profiles: Admin-only access

### Authentication
- Public pages: No authentication required
- Admin pages: Protected by authentication middleware
- Supabase handles all authentication and authorization

## Next Steps

1. **Run the database migration** to create the stalls table
2. **Start the development server** to see the new public home page
3. **Test the admin login** functionality
4. **Customize the contact information** and branding
5. **Add more market sections or stalls** as needed

The public home page provides a professional, informative interface for potential vendors while maintaining easy access for administrators to manage the system.



