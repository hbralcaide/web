# Summary of Admin Interface Screens

## 1. Admin Dashboard Overview

**Figure B.1: Admin Dashboard - Main Overview**

The Admin Dashboard serves as the central command center for the Toril Public Market Management System, providing administrators with a comprehensive, real-time view of market operations. Upon accessing the dashboard, administrators encounter a clean, organized interface that automatically refreshes every 30 seconds, displaying critical metrics and operational data with timestamp verification for data accuracy.

The dashboard is structured into several key functional areas. The Application Management Panel prominently displays pending vendor applications awaiting review, showing the current count with visual indicators and providing direct navigation to the full application review interface. The Vendor Status Overview presents the current count of active vendors alongside inactive and total vendor statistics, offering immediate insight into market participation levels. The Stall Availability Tracker displays vacant stalls with comprehensive occupancy information, helping administrators quickly assess rental opportunities and capacity utilization.

A detailed Operational Metrics Grid provides deeper insights through multiple indicators:

- **Occupied Stalls**: Currently in-use spaces with active vendor assignments
- **Under Maintenance**: Temporarily unavailable stalls undergoing repairs or renovations
- **Market Sections**: Total number of distinct product categories (8 sections)
- **Occupancy Rate**: Visual progress bar showing market utilization at 68%

The Vendor Operational Status Panel tracks real-time vendor operations for the current day, distinguishing between vendors open for business and those closed, based on their scheduled operating hours maintained through the mobile app. Quick Actions buttons provide direct navigation to frequently accessed functions including vendor management (238 vendors), stall management (241 stalls), market section configuration (8 sections), and the stall assignment raffle system. System Status Monitors at the bottom display green indicators for database connection, real-time sync, and map service operational status, enabling immediate identification of any technical issues.

---

## 2. Market Sections Management Interface

**Figure B.2: Market Sections - Complete Interface**

The Market Sections page provides comprehensive oversight of the market's organizational structure, displaying all product categories and spatial divisions through an intuitive card-based layout. The interface features a three-tier navigation system with primary navigation, secondary tabs (Indoor Map, Sections, Stalls), and robust control panels for managing the market's 8 distinct sections containing 241 total stalls with an impressive 97.5% overall occupancy rate.

Summary statistics cards present key metrics at a glance:

- **Total Sections**: 8 distinct market areas
- **Total Stalls**: 241 rental spaces across all sections
- **Occupied**: 235 stalls with active vendor assignments
- **Vacant**: 5 available stalls
- **Occupancy Rate**: 97.5% utilization

Advanced search and filtering capabilities enable administrators to locate specific sections or filter by status (Active, Inactive, Under Maintenance) and occupancy levels (High >80%, Medium 50-80%, Low <50%, Full 100%).

Each section is displayed as a detailed card showing the section name, two-letter code, description, and comprehensive metrics including total stalls, occupied count, vacant spaces, maintenance status, and capacity. Color-coded occupancy rate indicators with progress bars provide visual representation of utilization, ranging from green (healthy) to yellow (high) to red (very high/full).

Notable sections include Fish (72 stalls, 95.8% occupied) as the largest section, followed by Meat (72 stalls, 96.6% occupied), while smaller specialized sections like Eatery (12 stalls, 100% occupied) and Dried Fish (2 stalls, 50.0% occupied) serve specific market needs. Each card includes action links for editing section properties, deleting sections, viewing detailed stall lists, and adding new products directly to the section.

---

## 3. Vendor Management Interface

**Figure B.3: Vendor Management - Complete Interface**

The Vendor Management page serves as the comprehensive administrative hub for overseeing all 238 vendor accounts in the market, with 237 active vendors and just 1 inactive account. The interface features a dual-tab system separating "Existing Vendors" (for managing current accounts) from "Applications" (for reviewing new vendor submissions), with real-time update indicators showing the last refresh timestamp.

Summary statistics provide immediate operational insight:

- **Total Vendors**: 238 registered accounts
- **Active Vendors**: 237 operational accounts (99.6%)
- **Inactive Vendors**: 1 deactivated account
- **With Stalls**: 238 vendors assigned to physical locations (100%)
- **Pending Applications**: 0 awaiting review

The comprehensive search functionality allows filtering across multiple fields including vendor name, username, stall number, and actual occupant details, supplemented by dropdown filters for status (All, Active, Inactive, Pending), section (Eatery, Fish, Meat, Rice and Grains, etc.), and date range selectors for analyzing vendor activity by activation period.

The vendor list table displays detailed information including vendor avatars with initials, full names with usernames, phone numbers, assigned stall numbers with section-coded badges (E-9, M-81, F-28), section assignments, color-coded status indicators, and action buttons for managing each account.

A notable data quality observation is that all visible vendors in the sample display "None" in red text for phone numbers, indicating incomplete contact information requiring administrative attention. The interface supports bulk operations through checkbox selections, enabling mass notifications, status updates, or data exports. Pagination controls manage the display of 10 vendors per page across 24 total pages, with flexible sorting options by name, stall number, section, status, or registration date.

---

## 4. Products Management Interface

**Figure B.4: Products Management - Complete Interface**

The Products Management page provides centralized control over the market's product catalog, organizing 116 total products across 10 distinct categories through a dual-section interface. The upper "Manage Categories" section displays category cards with product counts, while the lower "All Products - Products List" section presents a comprehensive searchable table of individual products with detailed specifications.

The category distribution reveals the market's product focus:

- **Fish**: 25 products (largest category, reflecting seafood importance)
- **Dried Fish**: 19 products (specialty preserved seafood)
- **Pork**: 18 products (various cuts and preparations)
- **Beef**: 13 products (diverse beef offerings)
- **Chicken**: 13 products (poultry products)
- **Rice**: 12 products (staple grain varieties)
- **Vegetable**: 8 products (fresh produce)
- **Grains**: 7 products (cereals and grain products)
- **Grocery**: 1 product (miscellaneous items)
- **Fruits**: 0 products (empty category awaiting additions)

Each category card includes action links for editing category properties, deleting categories, viewing category-specific products, and adding new products directly to that category. Language toggle controls (EN/TL) support bilingual administration, while advanced search and category filtering enable quick product location.

The products list table displays comprehensive information including bilingual product names (English/Filipino format like "Belly/Liempo" or "Barracuda/Barakuda"), color-coded category badges, base prices in Philippine Pesos (ranging from ₱0 to ₱170+), unit specifications (piece or kg), and edit/delete action buttons.

Notable pricing examples include premium items like Croaker/Alakaak at ₱170/kg, specialty rice varieties (Black Rice ₱90/kg, Brown Rice ₱70/kg, Buco Pandan Rice ₱60/kg), and affordable meat cuts (Breast/Dibdib ₱12/piece, Cheek/Pangi ₱12/piece). A data quality issue is evident with Brisket/Pecho showing ₱0, requiring price correction. The interface supports pagination through 11 pages displaying 107 total products, with alphabetical sorting and bulk operation capabilities.

---

## 5. Admin Management Interface

**Figure B.5: Admin Management - Complete Interface**

The Admin Management page provides secure oversight of the system's administrative team, currently managing 2 total administrators with both accounts active (100% active rate) and 0 inactive accounts. This sensitive interface is restricted to senior administrators with elevated permissions, implementing strict access controls and comprehensive audit logging for accountability and security compliance.

The summary statistics display the administrative team composition with visual indicators showing 2 Total Admins, 2 Active administrators, and 0 Inactive accounts, reflecting a small but fully operational administrative structure.

The admin list table displays detailed account information:

- **Administrator 1 (kent Agad)**: Username "kagad", institutional email "akpagad@addu.edu.ph" (Ateneo de Davao University affiliation), phone 945 776 4588, Active status, created 11/8/2025 (newest account)
- **Administrator 2 (Weldore Butch)**: Username "wbutch", personal email "weldorebutch@gmail.com", phone 923 156 5413, Active status, created 9/2/2025 (senior administrator)

Each administrator entry includes a color-coded avatar with initials, full name, unique username for system login, email address for communications and authentication, phone number for emergency contact and two-factor authentication, color-coded status badge (green for Active, red for Inactive), account creation timestamp, and action buttons for account management (Deactivate in orange, Delete in red).

The search functionality enables quick location of specific administrators across name, username, email, and phone fields. Administrative workflows support inviting new administrators, deactivating accounts temporarily (reversible for leave or suspension), permanently deleting accounts (with strong confirmation requirements), reactivating deactivated accounts, and conducting regular security reviews.

Security measures include permission hierarchies restricting page access, self-management restrictions preventing administrators from deactivating their own accounts, comprehensive audit logging of all administrative actions (creation, status changes, deletions, login attempts), email and phone validation, and password complexity requirements. The small two-person administrative team suggests focused management structure, with the institutional email of kent Agad indicating possible academic thesis project involvement while Weldore Butch's personal email suggests market staff or consultant role.

---

## 6. Admin Profile Interface

**Figure B.6: Admin Profile - Complete Interface**

The Admin Profile page serves as the personal account management center for the currently logged-in administrator, displaying comprehensive account information in a clean, organized format with label-value pairs. This interface enables administrators to verify their identity, confirm access level, review contact information, and securely terminate their session through the prominent "Sign Out" button.

The profile displays the following information for the current administrator (Weldore Butch):

- **Full Name**: Weldore Butch (primary identity display)
- **Email Address**: weldorebutch@gmail.com (personal Gmail account for authentication and communications)
- **Username**: wbutch (system login identifier following first initial + last name pattern)
- **Phone Number**: +63 923 156 5413 (international format with Philippine country code, used for emergency contact and two-factor authentication)
- **Role**: admin (full administrative access with comprehensive system permissions)
- **Status**: Active (operational account in good standing with full system access)

The profile information format shows an interesting inconsistency with the Admin Management page: phone numbers display with the +63 country code prefix on the profile page but without it on the management list, potentially indicating different display logic for personal versus administrative list views. The "admin" role designation suggests comprehensive system permissions including vendor management, application processing, product catalog management, market section configuration, and potentially other administrator management capabilities.

The red-outlined "Sign Out" button positioned at the bottom of the profile section provides secure session termination functionality. When clicked, it invalidates the current authentication session, revokes session tokens, clears browser cookies and local storage, logs the logout event with timestamp for audit purposes, and redirects to the login page with confirmation message. This critical security feature ensures proper session cleanup when administrators leave their workstation or complete their administrative tasks.

While the subtitle indicates "Manage your account settings and preferences," the current view appears to be read-only display mode, suggesting that edit functionality may be accessible through a separate "Edit Profile" button (outside the visible screenshot area) or may be planned for future implementation. Standard profile management features that could be added include profile photo upload, password change functionality, two-factor authentication setup, login history display, notification preferences, and security settings configuration.
