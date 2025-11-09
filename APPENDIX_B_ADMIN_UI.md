# Appendix B: Admin Side User Interface

## Admin Dashboard Overview

The Admin Dashboard serves as the primary control center for the Toril Public Market Management System. It provides administrators with a comprehensive, real-time overview of the market's operational status, vendor activities, and stall occupancy metrics. The dashboard is designed to consolidate critical information into a single, intuitive interface, enabling efficient monitoring and decision-making for market operations.

Upon accessing the dashboard, administrators are presented with a clean and organized layout that automatically updates every 30 seconds to reflect the latest data from the system. A notification banner at the top of the page indicates that "Real-time updates enabled • Dashboard refreshes automatically every 30 seconds," ensuring that administrators are always viewing current information. A manual "Refresh" button is also available in the top-right corner for immediate data updates when needed.

The dashboard displays the last update timestamp (e.g., "Last updated: 04:29:50 PM"), providing administrators with confidence in the timeliness of the information presented. This feature is particularly useful during peak market hours when rapid changes in vendor status or stall availability occur.

### Main Dashboard Sections

The dashboard is organized into several key sections, each serving a specific monitoring and management purpose:

#### 1. Application Management Panel

**Pending Applications**

- Displays the total number of vendor applications awaiting administrative review
- Shows a prominent count (e.g., "0") with an "Awaiting review" status indicator
- Includes a clipboard icon for quick visual identification
- Clicking this panel redirects administrators to the full Vendor Applications page where they can review, approve, or reject pending applications

This section ensures that no vendor application remains unattended, promoting efficient processing of new market participants and maintaining a streamlined onboarding workflow.

#### 2. Vendor Status Overview

**Active Vendors**

- Presents the current count of active, operational vendors in the market
- Displays both the number of inactive vendors and total vendor count (e.g., "1 inactive • 238 total")
- Features a people icon representing the vendor community
- The count reflects only vendors whose accounts are active and in good standing
- Provides a quick snapshot of the market's current occupancy level

This metric is essential for understanding the market's operational capacity and identifying trends in vendor participation over time.

#### 3. Stall Availability Tracker

**Available Stalls**

- Shows the number of vacant stalls currently available for rent
- Includes both occupied and total stall counts (e.g., "164 occupied • 241 total")
- Features a stall/building icon for intuitive recognition
- Color-coded with a yellow/orange theme to draw attention to availability
- Helps administrators quickly assess rental opportunities and market capacity

This information is critical for responding to prospective vendor inquiries and planning market expansion or optimization strategies.

#### 4. Operational Metrics Grid

The dashboard includes a secondary row of detailed metrics providing deeper insights into market operations:

**Occupied Stalls**

- Count: 164
- Status: "Currently in use"
- Indicator: Blue dot
- Represents stalls with active vendor assignments

**Under Maintenance**

- Count: 72
- Status: "Temporarily unavailable"
- Indicator: Red dot
- Tracks stalls undergoing repairs, renovations, or sanitation procedures

**Market Sections**

- Count: 8
- Status: "Active sections"
- Indicator: Purple dot
- Displays the total number of distinct market sections (e.g., Vegetables, Fish, Meat, Dry Goods)

**Occupancy Rate**

- Percentage: 68%
- Visual: Progress bar with blue fill
- Calculation: (Occupied Stalls / Total Available Stalls) × 100
- Provides an at-a-glance view of market utilization efficiency

This occupancy rate is a key performance indicator (KPI) for market management, reflecting both economic health and space optimization.

#### 5. Vendor Operational Status Panel

This section provides real-time information about vendor operations for the current day:

**Open Today**

- Count: 1
- Status: "Scheduled to operate today"
- Indicator: Green circle
- Lists vendors who have indicated they will be open for business

**Closed Today**

- Count: 3
- Status: "Not operating today"
- Indicator: Gray circle
- Shows vendors who are closed for the day (holidays, rest days, or personal reasons)

A footnote clarifies: "\*Based on vendor operating hours schedule. Vendors can update their weekly schedule via mobile app." This feature enables the system to provide accurate information to market visitors about vendor availability, improving customer experience and reducing wasted visits.

#### 6. Quick Actions Panel

The Quick Actions section provides administrators with direct navigation to frequently accessed management functions:

**Manage Vendors** (238 total)

- Icon: People/group symbol in purple
- Direct link to the comprehensive vendor management interface
- Allows viewing, editing, and managing all vendor profiles

**Manage Stalls** (241 total)

- Icon: Building/stall symbol in red
- Navigates to the stall assignment and maintenance interface
- Enables stall status updates, assignments, and spatial management

**Market Sections** (8 sections)

- Icon: Layout/map symbol in blue
- Opens the market section configuration page
- Facilitates section management, category assignments, and organizational structure

**Run Raffle** (Stall assignment)

- Icon: Trophy/ticket symbol in gold
- Launches the stall assignment raffle system
- Used for fair and transparent stall allocation during high-demand periods

These quick action buttons serve as shortcuts to core administrative functions, reducing navigation time and improving workflow efficiency.

#### 7. System Status Monitor

The bottom section of the dashboard displays real-time system health indicators:

**Database Connection**

- Status: Online
- Indicator: Green dot
- Confirms successful connection to the Supabase PostgreSQL database

**Real-time Sync**

- Status: Active
- Indicator: Green dot
- Verifies that live data synchronization is functioning properly

**Map Service**

- Status: Operational
- Indicator: Green dot
- Indicates that the Mappedin indoor mapping service is responsive

These status indicators ensure administrators can quickly identify technical issues that may affect system performance or user experience. If any service shows a red indicator, it signals the need for immediate technical attention.

### Design Philosophy and User Experience

The dashboard's design follows modern UI/UX principles:

**Visual Hierarchy**

- Critical metrics (applications, vendors, stalls) are displayed prominently at the top
- Color coding distinguishes different data categories (yellow for availability, green for active, red for maintenance)
- Font sizes and weights guide the eye to important information

**Responsive Layout**

- The dashboard adapts to different screen sizes and devices
- Grid-based layout ensures consistent spacing and alignment
- Cards and panels maintain readability across various resolutions

**Information Density**

- Balances comprehensive data presentation with clean, uncluttered design
- Uses icons and visual indicators to convey information efficiently
- Employs white space to prevent cognitive overload

**Accessibility**

- High contrast ratios ensure readability for users with visual impairments
- Descriptive labels and status text support screen readers
- Interactive elements have clear hover states and clickable areas

### Data Accuracy and Reliability

The dashboard relies on real-time data synchronization with the Supabase database, ensuring that all displayed metrics reflect the current state of market operations. The system employs the following mechanisms to maintain data integrity:

- **Automatic Refresh**: Dashboard queries the database every 30 seconds
- **Transaction Consistency**: All database operations use atomic transactions to prevent data corruption
- **Error Handling**: Failed data fetches trigger automatic retry mechanisms
- **Cache Invalidation**: Critical updates immediately invalidate cached data to display the latest information

### Navigation and Workflow Integration

The dashboard serves as the central hub from which administrators can access all major system functions through the top navigation bar:

- **Dashboard**: Returns to the overview screen (current page)
- **Market Sections**: Manages section definitions, categories, and spatial organization
- **Vendors**: Full vendor profile management, application processing, and account administration
- **Products**: Product catalog management and vendor inventory oversight
- **Admins**: Administrator account management and permission control
- **Profile**: Current admin user's profile settings and password management

This hierarchical navigation structure ensures administrators can efficiently move between different management tasks while maintaining context awareness of their location within the system.

### Performance Considerations

To ensure optimal dashboard loading times and responsiveness:

- Dashboard queries are optimized with appropriate database indexes
- Only essential data is fetched initially; detailed information loads on-demand
- Real-time updates use delta queries (fetching only changed data) rather than full refreshes
- Static elements are cached in the browser to reduce server requests

### Security and Access Control

The dashboard is protected by multiple layers of security:

- **Authentication**: Only logged-in administrators can access the dashboard
- **Session Management**: Automatic logout after extended periods of inactivity
- **Role-Based Access**: Dashboard metrics display only data relevant to the admin's permission level
- **Audit Logging**: All administrative actions initiated from the dashboard are recorded

Overall, the Admin Dashboard provides a powerful, user-friendly interface that empowers market administrators to monitor operations effectively, identify trends, respond to issues promptly, and make data-driven decisions that enhance the overall efficiency and success of the Toril Public Market.

---

## Market Sections Management Interface

The Market Sections page serves as the comprehensive management hub for organizing and monitoring the various product categories and spatial divisions within Toril Public Market. This interface provides administrators with detailed oversight of market segmentation, stall allocation, occupancy rates, and capacity management across all market sections. The page is designed to facilitate efficient space utilization, vendor assignment, and operational planning through an intuitive, card-based layout that presents complex data in an easily digestible format.

### Page Navigation and Structure

The Market Sections interface features a three-tier navigation system:

**Primary Navigation Bar**
Located at the top of the screen, this bar includes:

- Dashboard
- Market Sections (currently active, indicated by underline)
- Vendors
- Products
- Admins
- Profile

**Secondary Navigation Tabs**
Directly below the primary navigation, three tabs provide access to related functionality:

- **Indoor Map**: Displays the interactive Mappedin visualization of market layout
- **Sections**: Shows the current page with section cards and statistics (active tab)
- **Stalls**: Provides detailed stall-level management interface

This hierarchical navigation structure enables administrators to seamlessly switch between different views of market organization while maintaining context awareness of their current location within the system.

### Page Header and Control Panel

The page header "Market Sections" is accompanied by a descriptive subtitle: "Real-time overview of all market sections, occupancy rates, and stall assignments." This subtitle immediately clarifies the page's purpose and the type of information administrators can expect to find.

**Action Buttons**
Two primary action buttons are positioned in the top-right corner:

1. **Refresh Data Button**

   - Icon: Refresh/sync symbol
   - Function: Manually triggers data reload from the database
   - Use case: When administrators need immediate updates without waiting for automatic refresh
   - Provides visual feedback during the refresh process

2. **Add Section Button**
   - Color: Blue/indigo (primary action color)
   - Icon: Plus (+) symbol
   - Function: Opens a modal dialog for creating a new market section
   - Enables administrators to expand market organization as needed

The placement of these buttons follows standard UI conventions, making them easily discoverable and accessible for frequent administrative tasks.

### Summary Statistics Dashboard

Immediately below the page header, a row of five statistical cards provides high-level metrics about the entire market:

**1. Total Sections**

- Count: 8
- Icon: Grid/section symbol
- Represents the total number of distinct product categories or spatial divisions in the market
- This metric helps administrators understand the market's organizational complexity

**2. Total Stalls**

- Count: 241
- Icon: Building/stall symbol in blue
- Displays the aggregate number of rental spaces across all market sections
- Critical for capacity planning and market expansion decisions

**3. Occupied**

- Count: 235
- Icon: Green checkmark/indicator
- Shows the number of stalls currently assigned to active vendors
- Indicates strong market utilization and vendor participation

**4. Vacant**

- Count: 5
- Icon: Empty stall symbol in gray
- Displays available stalls awaiting vendor assignment
- Important for responding to prospective vendor inquiries

**5. Occupancy Rate**

- Percentage: 97.5%
- Icon: Chart/graph symbol
- Visual: Large, prominent percentage display
- Calculation: (Occupied Stalls / Total Stalls) × 100
- Represents overall market space utilization efficiency
- High occupancy rate (97.5%) indicates optimal market performance

This summary dashboard enables administrators to quickly assess market-wide performance without needing to analyze individual section data.

### Search and Filter Controls

The interface includes robust search and filtering capabilities to help administrators locate specific sections or narrow down the view:

**Search Bar**

- Placeholder text: "Search by name, code, or description..."
- Keyboard shortcut: Ctrl + K
- Function: Real-time search that filters section cards as the user types
- Searches across multiple fields: section name, code, and description
- Example searches: "fish", "DF", "seafood"

**Status Filter Dropdown**

- Label: "Status"
- Default option: "All Statuses"
- Available options:
  - All Statuses
  - Active (sections currently operational)
  - Inactive (temporarily closed sections)
  - Under Maintenance (sections undergoing repairs or renovations)
- Updates the section card display based on selected status

**Occupancy Filter Dropdown**

- Label: "Occupancy"
- Default option: "All Levels"
- Available options:
  - All Levels
  - High (>80% occupied)
  - Medium (50-80% occupied)
  - Low (<50% occupied)
  - Full (100% occupied)
- Helps identify sections with availability or capacity issues

These filtering tools are particularly valuable when managing large markets with numerous sections, enabling administrators to quickly locate specific areas requiring attention.

### Section Display Status Bar

Below the filters, a status bar provides context about the current view:

"Showing 8 of 8 sections"

This text updates dynamically based on active search or filter criteria. When filters are applied, it might display messages such as:

- "Showing 3 of 8 sections" (when filtered)
- "Showing 0 of 8 sections" (when no matches found)

**Status Legend**
Visual indicators show the count of sections in each status:

- **Active: 8** (Green indicator) - Operational sections
- **Inactive: 0** (Gray indicator) - Temporarily closed sections
- **Maintenance: 0** (Yellow/orange indicator) - Sections under repair

**Sort Control**

- Label: "Sort by:"
- Default: "Name"
- Dropdown arrow indicates additional sort options are available
- Possible sort criteria:
  - Name (A-Z)
  - Code (alphabetical)
  - Occupancy Rate (high to low or low to high)
  - Total Stalls (most to least)
  - Last Updated (newest to oldest)

### Market Section Cards

The primary content area displays section information in a responsive card grid layout. Each card represents a distinct market section and includes comprehensive data about that section's operations. The cards are designed to be visually scannable while providing detailed metrics at a glance.

#### Card Structure and Components

Each section card includes the following elements:

**Header Section**

- **Section Name**: Large, bold text (e.g., "Dried Fish", "Eatery", "Fish")
- **Section Code**: Color-coded badge (e.g., "DF", "E", "F")
  - Each section has a unique two-letter code for quick reference
  - Codes are used in stall numbering (e.g., DF-001, F-012)
  - Color coding provides visual distinction between sections
- **Description**: Brief text describing the section's purpose
  - Example: "Dried fish and seafood products"
  - Example: "Food stalls and small restaurants"
  - Example: "Fresh fish and seafood"

**Metrics Display**
Each card displays four key metrics in a two-column layout:

**Left Column:**

1. **Total Stalls**: Total number of rental spaces in the section

   - Example: 2, 12, 72
   - Indicates section size and capacity

2. **Occupied**: Number of stalls with active vendor assignments
   - Example: 2, 12, 69
   - Green text emphasizes active occupancy

**Right Column:** 3. **Vacant**: Number of available stalls

- Example: 0, 0, 3
- Important for identifying rental opportunities

4. **Maintenance**: Number of stalls under repair

   - Example: 0, 0, 0
   - Yellow/orange color indicates temporary unavailability

5. **Capacity**: Maximum occupancy the section can support
   - Example: 24, 12, 72
   - Used for planning and expansion decisions

**Occupancy Rate Indicator**
Each card features a prominent occupancy rate display:

- **Status Label**: "Low", "High", or "Full" with color coding
  - Green: Low occupancy (<60%)
  - Yellow: Medium occupancy (60-90%)
  - Red: High occupancy (>90%)
  - Red with "High" or "Full": Very high/full occupancy
- **Percentage**: Large number showing exact occupancy rate
  - Example: 50.0%, 100.0%, 95.8%, 96.6%
- **Progress Bar**: Visual representation of occupancy
  - Color-coded to match status (green, yellow, or red)
  - Filled proportion corresponds to occupancy percentage

**Card Footer**

- **Last Updated**: Timestamp showing when section data was last modified
  - Format: "Updated 9/1/2025"
  - Ensures administrators know data currency
- **View Stalls Button**: Action button for detailed view
  - Blue text with arrow icon
  - Navigates to stall-level management interface
  - Opens filtered view showing only stalls in the selected section

#### Example Section Cards Breakdown

**1. Dried Fish Section (DF)**

- Total Stalls: 2
- Occupied: 2
- Vacant: 0
- Maintenance: 0
- Capacity: 24
- Occupancy Rate: 50.0% (Low)
- Description: "Dried fish and seafood products"
- Analysis: Despite 100% of existing stalls being occupied, the section operates at only 50% of its planned capacity of 24 stalls, indicating room for expansion.

**2. Eatery Section (E)**

- Total Stalls: 12
- Occupied: 12
- Vacant: 0
- Maintenance: 0
- Capacity: 12
- Occupancy Rate: 100.0% (High)
- Description: "Food stalls and small restaurants"
- Analysis: Fully occupied section with no vacant spaces, may require expansion to meet demand.

**3. Fish Section (F)**

- Total Stalls: 72
- Occupied: 69
- Vacant: 3
- Maintenance: 0
- Capacity: 72
- Occupancy Rate: 95.8% (High)
- Description: "Fresh fish and seafood"
- Analysis: Largest section with high occupancy; 3 vacant stalls available for new vendors.

**4. Fruits and Vegetables Section (FV)**

- Total Stalls: 36
- Occupied: 36
- Vacant: 0
- Maintenance: 0
- Capacity: 36
- Occupancy Rate: 100.0% (High)
- Description: "Fresh produce and vegetables"
- Analysis: Fully occupied; consider expansion if vendor waitlist exists.

**5. Grocery Section (G)**

- Total Stalls: 14
- Occupied: 12
- Vacant: 2
- Maintenance: 0
- Capacity: 14
- Occupancy Rate: 100.0% (High)
- Description: "General merchandise and groceries"
- Note: Shows 100% occupancy despite having 2 vacant stalls, which may indicate a display calculation issue or that these 2 stalls are reserved/unavailable.

**6. Meat Section (M)**

- Total Stalls: 72
- Occupied: 71
- Vacant: 1
- Maintenance: 0
- Capacity: 72
- Occupancy Rate: 96.6% (High)
- Description: "Fresh meat and poultry"
- Analysis: Near-capacity operation with only 1 vacant stall.

**7. Rice and Grains Section (RG)**

- Total Stalls: 20
- Occupied: 20
- Vacant: 0
- Maintenance: 0
- Capacity: 20
- Occupancy Rate: 100.0% (High)
- Description: "Rice, grains, and cereals"
- Analysis: Fully occupied section, indicating strong demand for staple goods.

**8. Variety Section (V)**

- Total Stalls: 13
- Occupied: 13
- Vacant: 0
- Maintenance: 0
- Capacity: 14
- Occupancy Rate: 100.0% (High)
- Description: "Mixed goods and various items"
- Analysis: All operational stalls occupied; 1 stall gap between total (13) and capacity (14) may represent future expansion or unavailable space.

### Section Management Workflows

**Adding a New Section**
When administrators click the "Add Section" button, a modal dialog appears with the following fields:

- Section Name (required)
- Section Code (required, 2-letter abbreviation)
- Description (optional)
- Total Stalls (required, numeric)
- Capacity (required, numeric)
- Initial Status (Active/Inactive/Maintenance)

After submission, the system:

1. Validates that the section code is unique
2. Creates the section record in the database
3. Updates the summary statistics
4. Displays the new section card in the grid
5. Provides success confirmation

**Editing a Section**
Clicking on a section card (or an edit button if available) allows administrators to:

- Update section name or description
- Modify capacity figures
- Change section status
- Adjust stall counts (when physical changes occur)

**Viewing Section Details**
The "View Stalls" button navigates to a detailed view showing:

- Complete list of all stalls within the section
- Individual stall statuses (occupied, vacant, maintenance)
- Vendor assignments for occupied stalls
- Stall numbering and physical locations
- Assignment history

### Data Visualization and Color Coding

The interface employs strategic color coding to enhance information comprehension:

**Occupancy Rate Colors:**

- Green: Healthy occupancy (50-80%)
- Yellow: High occupancy (80-95%)
- Red: Very high/full occupancy (>95%)

**Status Indicators:**

- Green dot: Active section
- Gray dot: Inactive section
- Orange dot: Under maintenance

**Section Code Badges:**

- Each section has a distinct background color for its code badge
- Colors are consistent throughout the system
- Helps administrators quickly identify sections in tables and maps

### Responsive Design and Accessibility

The Market Sections interface is designed to be fully responsive:

**Desktop View (Large Screens):**

- Cards displayed in 3-column grid
- All metrics visible simultaneously
- Optimal information density

**Tablet View (Medium Screens):**

- Cards adjust to 2-column grid
- Maintains readability and touch-target sizes
- Filters may stack vertically

**Mobile View (Small Screens):**

- Single-column card layout
- Collapsible filters to save space
- Touch-optimized buttons and interactive elements

**Accessibility Features:**

- High contrast text and backgrounds
- Screen reader compatible labels
- Keyboard navigation support
- ARIA labels for interactive elements
- Focus indicators for keyboard users

### Real-Time Data Synchronization

The Market Sections page maintains data accuracy through:

**Automatic Updates:**

- Database queries execute at regular intervals
- Changes made by other administrators appear automatically
- No manual refresh required for most operations

**Manual Refresh:**

- Refresh Data button forces immediate update
- Useful when coordinating with other staff members
- Provides visual feedback during refresh process

**Data Consistency:**

- Occupancy calculations update in real-time as stall assignments change
- Summary statistics recalculate when section data is modified
- Cross-page consistency ensures data alignment with Dashboard and Stalls pages

### Performance Optimization

To ensure fast page loading and smooth interactions:

**Efficient Queries:**

- Database queries optimized with appropriate indexes
- Aggregation calculations performed server-side
- Only necessary data fetched initially

**Lazy Loading:**

- Section cards load progressively as user scrolls (if many sections exist)
- Images and detailed data load on-demand

**Caching Strategy:**

- Static section metadata cached in browser
- Dynamic occupancy data refreshed regularly
- Balance between freshness and performance

### Administrative Use Cases

**Scenario 1: Assigning a New Vendor**

1. Administrator searches for sections with vacant stalls
2. Uses Occupancy filter to find sections with availability
3. Reviews section descriptions to match vendor's product type
4. Clicks "View Stalls" to see specific vacant stalls
5. Assigns vendor to appropriate stall

**Scenario 2: Planning Market Expansion**

1. Reviews Occupancy Rate across all sections
2. Identifies sections at or near full capacity
3. Examines gap between Total Stalls and Capacity
4. Determines which sections require physical expansion
5. Updates Capacity values after construction completion

**Scenario 3: Maintenance Scheduling**

1. Administrator identifies sections needing repairs
2. Marks specific stalls as "Under Maintenance"
3. Maintenance count updates on section card
4. Occupancy rate recalculates excluding maintenance stalls
5. Vendors and customers informed of temporary unavailability

**Scenario 4: Market Performance Analysis**

1. Compares occupancy rates across sections
2. Identifies underperforming sections (low occupancy)
3. Investigates causes (location, product type, vendor issues)
4. Implements strategies to improve utilization
5. Monitors changes over time using Last Updated timestamps

### Integration with Other System Components

**Dashboard Integration:**

- Section data aggregates to populate Dashboard metrics
- Changes to sections immediately reflect on Dashboard
- Consistent occupancy calculations across both pages

**Stalls Page Integration:**

- "View Stalls" button provides seamless navigation
- Section filters carry over to Stalls page
- Bidirectional navigation maintains user context

**Indoor Map Integration:**

- Section codes link to map visualizations
- Clicking map areas can navigate to relevant section cards
- Color coding consistent between map and section cards

**Vendor Management Integration:**

- Vendor profiles reference assigned sections
- Section occupancy updates when vendors are added/removed
- Cross-referencing enables comprehensive vendor oversight

### Security and Permissions

The Market Sections page implements appropriate access controls:

**View Permissions:**

- All authenticated administrators can view section data
- Read-only access for junior admin roles (if role hierarchy exists)

**Edit Permissions:**

- Only senior administrators can add/edit sections
- Prevents accidental structural changes by unauthorized users

**Audit Trail:**

- All section modifications logged with timestamp and user ID
- "Last Updated" field reflects most recent change
- Historical data preserved for compliance and analysis

Overall, the Market Sections Management Interface provides administrators with a comprehensive, intuitive tool for organizing and monitoring the market's spatial and categorical structure. Through its card-based layout, real-time data updates, and powerful filtering capabilities, the interface enables efficient market operation, strategic planning, and optimal space utilization that supports the growth and success of Toril Public Market and its vendor community.

---

## Vendor Management Interface

The Vendor Management page serves as the comprehensive administrative hub for managing all vendor accounts, reviewing new applications, monitoring vendor status, and maintaining vendor-related information. This interface provides administrators with complete oversight of the market's vendor community, enabling efficient account management, application processing, and operational monitoring through an organized, data-rich interface.

### Page Structure and Navigation

The Vendor Management interface is accessed through the primary navigation bar by clicking the "Vendors" link. Upon loading, the page presents a dual-tab navigation system that separates vendor management into two distinct workflows:

**Tab Navigation**

1. **Existing Vendors** (Active tab shown in screenshot)

   - Displays all registered vendor accounts
   - Provides search, filter, and management capabilities
   - Shows vendor status, assignments, and contact information
   - Primary interface for day-to-day vendor administration

2. **Applications**
   - Displays pending vendor applications awaiting review
   - Allows administrators to approve or reject new applicants
   - Shows application details, submitted documents, and applicant information
   - Critical for onboarding new vendors into the market system

This tab-based organization separates operational vendor management from the application review process, reducing cognitive load and improving workflow efficiency.

### Page Header and Overview

**Title and Description**

- Main Heading: "Vendor Management"
- Subtitle: "Manage existing vendors and review new applications"
- Purpose Statement: Clearly communicates the page's dual function

**Real-Time Update Indicator**
A green notification banner displays:
"● Real-time updates enabled • Last updated: 4:30:09 PM by default"

This indicator confirms that:

- Data synchronization is active
- The displayed information reflects the current database state
- The timestamp shows when data was last refreshed
- Administrators can trust the accuracy of displayed metrics

**Add Vendor Button**
Located in the top-right corner, this prominent blue button enables administrators to manually add new vendors without requiring them to complete the standard application process. This feature is useful for:

- Walk-in vendor registrations
- Expedited onboarding for pre-approved vendors
- Administrative corrections or data migration
- Emergency vendor assignments

### Summary Statistics Dashboard

Five statistical cards provide an at-a-glance overview of the vendor population:

**1. Total Vendors (238)**

- Icon: People/group symbol
- Count: 238
- Represents all vendor accounts in the system (active and inactive)
- Primary metric for understanding market size and vendor base

**2. Active Vendors (237)**

- Icon: Green checkmark indicator
- Count: 237
- Shows vendors with "Active" status who can operate in the market
- Indicates healthy vendor participation (99.6% of total vendors)

**3. Inactive Vendors (1)**

- Icon: Gray/inactive indicator
- Count: 1
- Displays vendors whose accounts have been deactivated
- May represent suspended accounts, closed businesses, or temporary inactivity

**4. With Stalls (238)**

- Icon: Building/stall symbol in blue
- Count: 238
- Shows vendors who have been assigned a physical stall location
- In this case, 100% of vendors have stall assignments, indicating complete allocation

**5. Pending (0)**

- Icon: Clock/waiting indicator in orange
- Count: 0
- Displays the number of applications awaiting administrative review
- Zero pending applications indicates all submissions have been processed

These metrics provide administrators with immediate insight into vendor population health, account status distribution, and workload (pending applications).

### Search and Filter Controls

The interface includes comprehensive search and filtering capabilities designed to help administrators quickly locate specific vendors or narrow down the vendor list based on various criteria.

**Search Bar**

- Placeholder: "Search by name, username, stall, or actual occupant details..."
- Location: Top-left of the filter section
- Icon: Magnifying glass (search symbol)
- Keyboard Shortcut: Ctrl + F
- Functionality:
  - Real-time search as user types
  - Searches across multiple fields simultaneously:
    - Vendor full name (first name + last name)
    - Username/business name
    - Stall number assignment
    - Actual occupant information (if different from registered vendor)
  - Case-insensitive matching
  - Partial word matching supported
  - Example searches: "Agustina", "M-81", "Eatery", "amos.e"

**Status Filter Dropdown**

- Label: "Status"
- Default: "All Statuses"
- Options available:
  - All Statuses (shows all vendors regardless of status)
  - Active (shows only active vendor accounts)
  - Inactive (shows only deactivated accounts)
  - Pending (shows vendors with pending status changes or verifications)
- Purpose: Quickly filter vendor list by account status
- Use case: Reviewing all inactive accounts, focusing on active vendors

**Section Filter Dropdown**

- Label: "Section"
- Default: "All Sections"
- Options: Lists all market sections
  - All Sections
  - Eatery
  - Fish
  - Meat
  - Rice and Grains
  - Fruits and Vegetables
  - Grocery
  - Variety
  - Dried Fish
- Purpose: Filter vendors by their assigned market section
- Use case: Managing vendors within a specific product category or physical area

**Date Range Filters**
Two date picker fields allow administrators to filter vendors by their account activation date:

1. **Active From**

   - Format: dd/mm/yyyy
   - Default: Empty (no start date limit)
   - Function: Shows vendors who became active on or after this date
   - Use case: Finding recently added vendors, analyzing seasonal patterns

2. **Active To**
   - Format: dd/mm/yyyy
   - Default: Empty (no end date limit)
   - Function: Shows vendors who became active on or before this date
   - Use case: Historical analysis, identifying long-term vendors

**Filter Status Indicator**
Below the filter controls, the system displays:
"Filters active: No active filters"

When filters are applied, this changes to show which filters are currently affecting the display, such as:

- "Filters active: Status = Active, Section = Fish"
- "Filters active: Active From = 01/01/2025"

**Clear All Filters Link**
A clickable link on the right side ("Clear all filters") allows administrators to instantly remove all applied filters and return to the full vendor list view.

### Vendor List Display

The core of the page is the vendor data table, which presents detailed information about each vendor in a structured, sortable format.

**Table Header and Pagination Info**
Above the table:

- Left side: "Showing 10 of 238 vendors" (updates based on filters and pagination)
- Right side: "Sort by: Name" dropdown with options:
  - Name (A-Z or Z-A)
  - Stall Number (ascending/descending)
  - Section (alphabetical)
  - Status (Active first or Inactive first)
  - Registration Date (newest/oldest)

**Column Structure**

The table includes the following columns:

1. **Checkbox Column**

   - Allows selection of multiple vendors for bulk actions
   - Header checkbox selects/deselects all visible vendors
   - Enables mass status updates, bulk notifications, or batch exports

2. **Vendor Column**

   - **Avatar**: Circular badge with vendor's initials
     - Color-coded for visual distinction
     - Example: "AP" in blue, "AM" in blue, "AO" in blue, "AB" in blue, "AA" in blue, "AL" in blue, "AE" in blue
   - **Full Name**: Vendor's registered name (large, bold text)
     - Example: "Agustina D. Pardo"
   - **Username**: System username displayed below name (smaller, gray text)
     - Example: "@apr16"
     - Used for login and system identification

3. **Phone Number Column**

   - Displays vendor's contact phone number
   - In the screenshot, all entries show "None" in red text
   - Red color indicates missing information requiring attention
   - When populated, shows phone number format (e.g., +63 912 345 6789)

4. **Stall Column**

   - Shows assigned stall number
   - Color-coded badge matching section color scheme
   - Examples from screenshot:
     - "E-9" (Eatery section - light blue)
     - "M-81" (Meat section - light blue)
     - "M-60" (Meat section - light blue)
     - "M-83" (Meat section - light blue)
     - "RG-7" (Rice and Grains section - light blue)
     - "F-28" (Fish section - light blue)
     - "F-9" (Fish section - light blue)
     - "RG-8" (Rice and Grains section - light blue)
     - "RG-1" (Rice and Grains section - light blue)
     - "F-70" (Fish section - light blue)
   - Stall numbers follow format: SECTION_CODE-NUMBER
   - Clicking stall number may navigate to stall details or map location

5. **Section Column**

   - Displays the market section name
   - Text format (not badge) for readability
   - Examples from screenshot:
     - "Eatery"
     - "Meat"
     - "Rice and Grains"
     - "Fish"
   - Matches the section assignment shown in stall number

6. **Status Column**

   - Shows current account status with color-coded indicator
   - Two statuses visible in screenshot:
     - **Inactive**: Red dot with red text "● Inactive"
       - Indicates deactivated account
       - Vendor cannot access system or operate
     - **Active**: Green dot with green text "● Active"
       - Indicates operational account in good standing
       - Vendor has full system access
   - Status is prominent for quick scanning of account health

7. **Actions Column**
   - Contains action buttons for each vendor
   - Visible in screenshot: Red "Delete" button with trash icon
   - Additional actions may be available in dropdown or on hover:
     - Edit vendor details
     - View full profile
     - Change status (Activate/Deactivate)
     - View documents
     - Contact vendor
     - View transaction history
   - Delete action likely requires confirmation to prevent accidental removal

**Sample Vendor Entries Analysis**

From the screenshot, we can observe 10 vendor entries:

1. **Agustina D. Pardo** (@apr16)

   - Stall: E-9 (Eatery)
   - Status: Inactive (red)
   - Phone: None
   - Note: Only inactive vendor in the visible list

2. **Aida B. Montalban** (@amos.e)

   - Stall: M-81 (Meat)
   - Status: Active (green)
   - Phone: None

3. **Alex D. Ogasloc** (@ogasloc)

   - Stall: M-60 (Meat)
   - Status: Active (green)
   - Phone: None

4. **Allan F. Bangcaya** (@alleng)

   - Stall: M-83 (Meat)
   - Status: Active (green)
   - Phone: None

5. **Alrich C. Advincula** (@alri7ch.conde)

   - Stall: RG-7 (Rice and Grains)
   - Status: Active (green)
   - Phone: None

6. **Alvin D. Lim** (@s126)

   - Stall: F-28 (Fish)
   - Status: Active (green)
   - Phone: None

7. **Ana Fe D. Estrera** (@anafe2)

   - Stall: F-9 (Fish)
   - Status: Active (green)
   - Phone: None

8. **Angelito D. Morita** (@amos.e)

   - Stall: RG-8 (Rice and Grains)
   - Status: Active (green)
   - Phone: None
   - Note: Shares username with vendor #2, possible data issue

9. **Anica R. Lomala** (@s120)

   - Stall: RG-1 (Rice and Grains)
   - Status: Active (green)
   - Phone: None

10. **Arnalie C. Andaya** (@amatos.s)
    - Stall: F-70 (Fish)
    - Status: Active (green)
    - Phone: None

**Data Quality Observations:**

- All visible vendors have phone numbers listed as "None" (shown in red)
- This indicates incomplete vendor contact information
- Administrators should prioritize collecting phone numbers for emergency contact and communication
- Duplicate username (amos.e) requires investigation and correction

### Pagination Controls

At the bottom of the vendor list, pagination controls enable navigation through large vendor datasets:

**Current Page Indicator**

- Shows "Showing 1 to 10 of 238 results"
- Updates dynamically as user navigates pages
- Provides context about position within full dataset

**Page Navigation Buttons**

- **Page Numbers**: Individual page buttons (1, 2, ..., 24)
  - Current page highlighted in blue (page 1 in screenshot)
  - Clicking a number jumps directly to that page
  - Ellipsis (...) indicates additional pages between shown numbers
- **Previous Button**: Left arrow (disabled on first page)
- **Next Button**: Right arrow (navigates to page 2)
- **First/Last Page**: Quick jump to beginning or end of list

**Records Per Page**
The system displays 10 vendors per page by default. With 238 total vendors:

- Total pages: 24 pages (238 ÷ 10 = 23.8, rounded up to 24)
- This pagination prevents page overload and maintains performance
- Administrators may have the option to adjust records per page (10, 25, 50, 100)

### Vendor Management Workflows

**Scenario 1: Reviewing Vendor Information**

1. Administrator searches for a specific vendor by name or stall number
2. Locates vendor in the list
3. Reviews vendor status, section assignment, and contact information
4. Identifies missing phone number (red "None" indicator)
5. Clicks vendor row or Edit button to update contact details
6. Saves updated information

**Scenario 2: Deactivating a Vendor Account**

1. Administrator searches for the vendor requiring deactivation
2. Selects the vendor from the list
3. Clicks action button (Edit or Status Change)
4. Changes status from "Active" to "Inactive"
5. System prompts for reason (optional): lease expiration, violation, business closure
6. Confirms deactivation
7. Vendor's status indicator changes to red "Inactive"
8. Vendor loses system access and cannot operate their stall

**Scenario 3: Bulk Operations**

1. Administrator applies filters to isolate specific vendor group
   - Example: Section = "Fish", Status = "Active"
2. Checks the header checkbox to select all filtered vendors
3. Chooses bulk action from dropdown:
   - Send mass notification
   - Export vendor list to CSV
   - Update section assignment (if relocating vendors)
   - Mark as needing document verification
4. Confirms bulk action
5. System processes changes and displays success message

**Scenario 4: Adding a New Vendor Manually**

1. Administrator clicks "Add Vendor" button (blue, top-right)
2. Modal or new page opens with vendor registration form
3. Fills in required fields:
   - First Name
   - Last Name
   - Username
   - Email
   - Phone Number
   - Section Assignment
   - Stall Assignment
   - Business Name (optional)
4. Uploads required documents:
   - Valid ID
   - Business permit (if applicable)
   - Previous market credentials
5. Sets initial status (usually "Active")
6. Submits form
7. System creates vendor account and sends credentials via email
8. New vendor appears in vendor list immediately

**Scenario 5: Investigating Data Quality Issues**

1. Administrator notices red "None" indicators for phone numbers
2. Exports vendor list to CSV for data analysis
3. Identifies all vendors with missing contact information
4. Initiates contact collection campaign:
   - Sends email requests for phone number updates
   - Posts notice at market entrance
   - Collects information during in-person visits
5. Updates vendor records as information is received
6. Monitors completion rate through filtered view (Phone Number = Empty)

### Integration with Other System Components

**Application Review Integration**

- Clicking the "Applications" tab displays pending vendor applications
- After approving an application, new vendor automatically appears in "Existing Vendors" list
- Status automatically set to "Active" upon approval
- Stall assignment may occur during or after approval process

**Stall Management Integration**

- Clicking a stall number (e.g., "M-81") may navigate to:
  - Stall detail page showing physical location and specifications
  - Indoor map with stall highlighted
  - Stall history showing previous occupants
- Vendor profile links back to assigned stall
- Reassigning a stall updates vendor's Stall column automatically

**Dashboard Integration**

- Vendor count metrics feed into Dashboard statistics
- Active/inactive counts synchronize between pages
- Changes to vendor status immediately reflect on Dashboard

**Communication System Integration**

- Phone numbers (when provided) enable SMS notifications
- Email addresses support system-generated communications
- Administrators can send individual or bulk messages to vendors

### Data Export and Reporting

While not explicitly visible in the screenshot, typical vendor management systems include:

**Export Options:**

- Export current view to CSV
- Export selected vendors to Excel
- Generate PDF vendor directory
- Export filtered results for targeted communications

**Report Generation:**

- Vendor demographics report
- Section distribution analysis
- Contact information completeness report
- Vendor tenure and turnover analysis
- Compliance and documentation status report

### Security and Access Control

**View Permissions:**

- All authenticated administrators can view vendor list
- Sensitive information (passwords, financial details) not displayed in list

**Edit Permissions:**

- Only authorized administrators can modify vendor accounts
- Status changes may require senior administrator approval
- Account deletions require special permissions and confirmation

**Audit Trail:**

- All vendor account modifications logged
- Logs include: timestamp, administrator ID, action taken, old values, new values
- Provides accountability and enables investigation of discrepancies

**Data Privacy:**

- Vendor personal information protected per data privacy regulations
- Phone numbers and emails used only for market-related communications
- Deletion requests processed according to data retention policies

### Responsive Design and Mobile Access

**Desktop View (Current Screenshot):**

- Full table layout with all columns visible
- Optimal for data entry and bulk operations
- Multiple vendors visible without scrolling

**Tablet View:**

- Some columns may be hidden (priority: Name, Stall, Status)
- Horizontal scrolling enabled for full data access
- Larger touch targets for action buttons

**Mobile View:**

- Card-based layout instead of table
- Vendor information displayed in stacked format
- Key information (name, stall, status) prominently shown
- Swipe gestures for quick actions

### Performance Optimization

**Efficient Data Loading:**

- Pagination limits records per query (10 at a time)
- Database indexes on name, username, stall number, and section for fast searches
- Lazy loading of vendor details (full profile loaded only when clicked)

**Search Optimization:**

- Search queries debounced to prevent excessive database calls
- Minimum character requirement (2-3 characters) before search executes
- Search results cached temporarily for improved responsiveness

**Real-Time Updates:**

- Websocket or polling mechanism checks for changes every 30-60 seconds
- Only modified records refreshed, not entire list
- Update indicator shows timestamp of last synchronization

### Accessibility Features

**Keyboard Navigation:**

- Tab key navigates between interactive elements
- Enter key activates buttons and links
- Arrow keys navigate table rows (when row is focused)
- Escape key closes modals and dropdowns

**Screen Reader Support:**

- ARIA labels on all interactive elements
- Table headers properly associated with data cells
- Status indicators announced with descriptive text
- Form fields have accessible labels

**Visual Accessibility:**

- High contrast between text and backgrounds
- Color is not the only indicator of status (text + icon used)
- Font sizes meet minimum readability standards
- Focus indicators visible for keyboard users

Overall, the Vendor Management Interface provides administrators with a powerful, comprehensive tool for overseeing the market's vendor community. Through its intuitive table layout, robust search and filtering capabilities, and seamless integration with other system components, the interface enables efficient vendor account management, ensures data quality, and supports the operational success of Toril Public Market and its diverse vendor population.

---

## Products Management Interface

The Products Management page serves as the centralized system for managing the market's product catalog, organizing items by category, setting baseline pricing information, and maintaining a comprehensive inventory database. This interface enables administrators to oversee the entire product ecosystem of Toril Public Market, from category-level organization to individual product specifications, ensuring that accurate product information is available for vendors, customers, and market management purposes.

### Page Structure and Overview

The Products page is accessed through the primary navigation bar by clicking the "Products" link. The page is organized into two main sections that provide a complete product management workflow:

1. **Manage Categories Section** (Upper portion)

   - Category-based organization with product counts
   - Quick access to category-specific operations
   - Visual card layout for category management

2. **All Products - Products List Section** (Lower portion)
   - Comprehensive table view of all products across categories
   - Detailed product information and specifications
   - Search, sort, and bulk operation capabilities

This dual-section approach allows administrators to work at both the category (macro) level and the individual product (micro) level within a single interface.

### Page Header and Control Panel

**Main Controls**
Located in the top-right corner, three key control elements provide primary functionality:

1. **Language Toggle** (EN/TL)

   - Switches interface language between English (EN) and Tagalog (TL)
   - Supports bilingual administration
   - Current selection: EN (English)
   - Useful for Filipino administrators who prefer native language interface

2. **Add Category Button** (Green)

   - Opens modal for creating new product categories
   - Enables market expansion into new product lines
   - Essential for organizing diverse market offerings

3. **Add Product Button** (Blue)
   - Primary action button for adding individual products
   - Opens product creation form
   - Allows administrators to expand the product catalog

**Search and Filter Bar**
Below the main controls:

- **Search Field**: "Search products..."
  - Searches across product names
  - Real-time filtering as user types
  - Case-insensitive matching
- **Category Dropdown**: "All Categories"
  - Filters product list by selected category
  - Quick access to category-specific products
  - Options include: All, Beef, Chicken, Dried Fish, Fish, Fruits, Grains, Grocery, Pork, Rice, Vegetable

### Manage Categories Section

This section displays all product categories in a card-based grid layout, with each card representing a distinct product category and providing category-specific management options.

**Category Card Structure**

Each category card contains the following elements:

**Header Information:**

- **Category Name**: Large, bold text (e.g., "Beef", "Chicken", "Fish")
- **Product Count**: Small text indicating number of products in category
  - Format: "XX products"
  - Examples from screenshot:
    - Beef: 13 products
    - Chicken: 13 products
    - Dried Fish: 19 products
    - Fish: 25 products
    - Fruits: 0 products
    - Grains: 7 products
    - Grocery: 1 product
    - Pork: 18 products
    - Rice: 12 products
    - Vegetable: 8 products

**Action Links:**
Each card includes three action options:

1. **Edit** (Blue link)

   - Modifies category name or properties
   - Updates category metadata

2. **Delete** (Red link)

   - Removes category from system
   - Likely requires confirmation
   - May be disabled if products exist in category

3. **View Products** (Gray/neutral link)
   - Navigates to filtered product list
   - Shows only products in selected category
   - Provides quick access to category inventory

**Add Product Button:**

- Blue button with "+ Add Product" text
- Located at bottom of each category card
- Opens product creation form pre-filled with category selection
- Streamlines adding products to specific categories

#### Detailed Category Analysis

**1. Beef Category**

- Product Count: 13 products
- Represents beef and beef-related products
- Typical items: Different cuts of beef, ground beef, beef organs
- Action buttons available: Edit, Delete, View Products, Add Product

**2. Chicken Category**

- Product Count: 13 products
- Contains chicken and poultry products
- Typical items: Whole chicken, chicken parts (breast, thigh, wings), chicken organs
- Action buttons available: Edit, Delete, View Products, Add Product

**3. Dried Fish Category**

- Product Count: 19 products (highest count visible in first row)
- Specialty category for preserved seafood
- Typical items: Various dried fish species, salted fish, fish jerky
- Action buttons available: Edit, Delete, View Products, Add Product

**4. Fish Category**

- Product Count: 25 products (highest overall count)
- Largest category, indicating importance of fresh seafood
- Typical items: Various fresh fish species, seafood products
- Sample products visible in list: ambot, Barracuda/Barakuda, Croaker/Alakaak
- Action buttons available: Edit, Delete, View Products, Add Product

**5. Fruits Category**

- Product Count: 0 products
- Empty category awaiting product additions
- May be newly created or seasonal category
- Action buttons available: Edit, Delete, View Products, Add Product

**6. Grains Category**

- Product Count: 7 products
- Contains grain and cereal products
- Typical items: Different grain types, cereals, grain-based products
- Action buttons available: Edit, Delete, View Products, Add Product

**7. Grocery Category**

- Product Count: 1 product
- Minimal category, possibly for miscellaneous items
- May be consolidation category for general merchandise
- Action buttons available: Edit, Delete, View Products, Add Product

**8. Pork Category**

- Product Count: 18 products
- Significant category for pork products
- Typical items: Various pork cuts, pork organs, processed pork
- Sample products visible: Belly/Liempo, Cheek/Pangi, Brisket/Pecho
- Action buttons available: Edit, Delete, View Products, Add Product

**9. Rice Category**

- Product Count: 12 products
- Important staple category
- Typical items: Different rice varieties, rice qualities, rice grades
- Sample products visible: Black Rice, Brown Rice, Buco Pandan Rice
- Action buttons available: Edit, Delete, View Products, Add Product

**10. Vegetable Category**

- Product Count: 8 products
- Fresh produce category
- Typical items: Various vegetables, leafy greens, root vegetables
- Action buttons available: Edit, Delete, View Products, Add Product

**Category Distribution Insights:**

- Total products across all categories: 116 products
- Largest categories: Fish (25), Dried Fish (19), Pork (18), Chicken (13), Beef (13)
- Smallest categories: Fruits (0), Grocery (1), Grains (7)
- Food products dominate the catalog (meat, seafood, rice, vegetables)
- Empty Fruits category suggests opportunity for expansion

### All Products - Products List Section

The lower portion of the page displays a comprehensive table of all products in the system, providing detailed information about each product and enabling efficient product management.

**Section Header**

- Title: "All Products - Products List"
- Sort Controls: "Sort: A-Z | Z-A"
  - Allows alphabetical sorting in ascending or descending order
  - Default: A-Z (alphabetical by product name)

**Table Structure**

The products table includes the following columns:

**1. Checkbox Column**

- Enables selection of multiple products for bulk operations
- Header checkbox selects/deselects all visible products
- Supports batch editing, deletion, or export

**2. Product Name Column**

- Displays the product's full name
- Left-aligned for readability
- Sortable alphabetically
- Examples from screenshot:
  - ambot
  - Barracuda / Barakuda
  - Belly / Liempo
  - Black Rice
  - Breast / Dibdib
  - Brisket / Pecho
  - Brown Rice
  - Buco Pandan Rice
  - Cheek / Pangi
  - Croaker / Alakaak

**Product Naming Convention:**

- Many products include both English and Filipino/local names
- Format: "English Name / Filipino Name"
- Examples:
  - Belly / Liempo (English / Tagalog)
  - Barracuda / Barakuda (Standard / Local spelling)
  - Breast / Dibdib (English / Tagalog)
  - Brisket / Pecho (English / Tagalog)
  - Cheek / Pangi (English / Tagalog)
  - Croaker / Alakaak (English / Local name)
- Single-name products: ambot, Black Rice, Brown Rice, Buco Pandan Rice
- This bilingual naming supports both English-speaking and Filipino-speaking users

**3. Category Column**

- Displays product's assigned category
- Color-coded badges for visual distinction
- Badge colors from screenshot:
  - **Fish**: Light blue badge
  - **Pork**: Light pink/salmon badge
  - **Rice**: Light blue badge
  - **Chicken**: Light purple badge
  - **Beef**: Light orange badge
- Category badges match the category cards above
- Enables quick visual identification of product type

**4. Base Price Column**

- Shows the baseline price for the product
- Currency: Philippine Peso (₱)
- Format: ₱XX (no decimal places shown in screenshot)
- Price examples:
  - ambot: ₱50
  - Barracuda/Barakuda: ₱25
  - Belly/Liempo: ₱14
  - Black Rice: ₱90
  - Breast/Dibdib: ₱12
  - Brisket/Pecho: ₱0 (possibly missing price or free item)
  - Brown Rice: ₱70
  - Buco Pandan Rice: ₱60
  - Cheek/Pangi: ₱12
  - Croaker/Alakaak: ₱170 (highest visible price)

**Price Analysis:**

- Wide price range: ₱0 to ₱170+
- Rice products: ₱60-₱90 per kg
- Fish products: ₱25-₱170 per kg (large variation based on species)
- Pork products: ₱12-₱14 per piece
- Chicken products: ₱12 per piece
- ₱0 price for Brisket/Pecho indicates missing data requiring correction

**5. Unit Column**

- Specifies the measurement unit for the product
- Two units visible in screenshot:
  - **piece**: For individual items (meat cuts, chicken parts)
    - Examples: ambot, Belly/Liempo, Breast/Dibdib, Brisket/Pecho, Cheek/Pangi
  - **kg**: For weight-based products (fish, rice, bulk items)
    - Examples: Barracuda/Barakuda, Black Rice, Brown Rice, Buco Pandan Rice, Croaker/Alakaak
- Unit determines how product is measured and sold
- Important for pricing calculations and vendor inventory management

**6. Actions Column**

- Contains action buttons for each product
- Two actions visible:
  1. **Edit** (Blue link)
     - Opens product editing form
     - Allows modification of name, category, price, unit
     - Updates product specifications
  2. **Delete** (Red link)
     - Removes product from catalog
     - Likely requires confirmation
     - May check for dependencies (vendor inventories)

#### Sample Products Detailed Analysis

**1. ambot**

- Category: Fish (light blue badge)
- Base Price: ₱50
- Unit: piece
- Note: Single-word name, possibly local fish species
- Actions: Edit, Delete

**2. Barracuda / Barakuda**

- Category: Fish (light blue badge)
- Base Price: ₱25
- Unit: kg
- Note: Bilingual naming (English/Filipino spelling)
- Common predatory fish found in Philippine waters
- Actions: Edit, Delete

**3. Belly / Liempo**

- Category: Pork (light pink badge)
- Base Price: ₱14
- Unit: piece
- Note: Popular pork cut in Filipino cuisine
- Liempo is the Filipino term for pork belly
- Actions: Edit, Delete

**4. Black Rice**

- Category: Rice (light blue badge)
- Base Price: ₱90
- Unit: kg
- Note: Premium rice variety, higher price reflects specialty product
- Nutritious whole grain rice
- Actions: Edit, Delete

**5. Breast / Dibdib**

- Category: Chicken (light purple badge)
- Base Price: ₱12
- Unit: piece
- Note: Chicken breast portion
- Dibdib is Tagalog for breast
- Lowest priced chicken/pork item
- Actions: Edit, Delete

**6. Brisket / Pecho**

- Category: Beef (light orange badge)
- Base Price: ₱0
- Unit: piece
- Note: **Data Quality Issue** - ₱0 price indicates missing pricing information
- Pecho is Tagalog for chest/brisket
- Requires price update
- Actions: Edit, Delete

**7. Brown Rice**

- Category: Rice (light blue badge)
- Base Price: ₱70
- Unit: kg
- Note: Healthier alternative to white rice
- Mid-range pricing for specialty rice
- Actions: Edit, Delete

**8. Buco Pandan Rice**

- Category: Rice (light blue badge)
- Base Price: ₱60
- Unit: kg
- Note: Flavored rice variety (coconut and pandan flavor)
- Lowest priced specialty rice
- Actions: Edit, Delete

**9. Cheek / Pangi**

- Category: Pork (light pink badge)
- Base Price: ₱12
- Unit: piece
- Note: Pork cheek, considered a delicacy in Filipino cuisine
- Pangi is the local term
- Same price as chicken breast
- Actions: Edit, Delete

**10. Croaker / Alakaak**

- Category: Fish (light blue badge)
- Base Price: ₱170
- Unit: kg
- Note: Highest priced item in visible list
- Premium fish species
- Alakaak is the Filipino name
- Actions: Edit, Delete

### Pagination and Data Display

**Pagination Controls**
Located at the bottom of the products table:

- Display text: "Showing 1 to 10 of 107 results"
- Indicates 107 total products in the system
- Current view shows first 10 products (alphabetically sorted A-Z)

**Page Navigation:**

- Page numbers displayed: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, ... (more pages)
- Current page: 1 (highlighted)
- Total pages: 11 pages (107 products ÷ 10 per page = 10.7, rounded to 11)
- Navigation arrows:
  - Previous/Left arrow: Disabled on first page
  - Next/Right arrow: Active, navigates to page 2
- Clicking page numbers jumps directly to that page
- Administrators can quickly navigate through entire product catalog

### Product Management Workflows

**Scenario 1: Adding a New Product**

1. Administrator clicks "Add Product" button (blue, top-right)
   - Or clicks category-specific "+ Add Product" button
2. Product creation form opens with fields:
   - Product Name (required)
   - Filipino/Local Name (optional)
   - Category (dropdown, required)
   - Base Price (numeric, required)
   - Unit (dropdown: piece, kg, bundle, etc.)
   - Description (optional)
   - Image upload (optional)
3. Administrator fills in product details
   - Example: Name = "Tilapia", Category = "Fish", Price = ₱120, Unit = "kg"
4. Submits form
5. System validates data (no duplicate names, price > 0, etc.)
6. New product appears in products list
7. Category product count increments
8. Success message confirms addition

**Scenario 2: Editing Product Information**

1. Administrator searches for product or navigates to page containing it
2. Clicks "Edit" link in Actions column
3. Product edit form opens, pre-filled with current values
4. Administrator modifies information:
   - Corrects spelling errors
   - Updates pricing (e.g., Brisket/Pecho from ₱0 to ₱15)
   - Changes category if misclassified
   - Adjusts unit of measurement
5. Saves changes
6. Updated information displays immediately in table
7. Last modified timestamp updated (if tracked)

**Scenario 3: Managing Product Categories**

1. Administrator reviews category cards in upper section
2. Identifies empty category (Fruits: 0 products)
3. Decides to either:
   - **Option A**: Add products to empty category
     - Clicks "+ Add Product" on Fruits card
     - Adds products: Apple, Banana, Mango, Orange, etc.
     - Category count updates as products are added
   - **Option B**: Delete empty category
     - Clicks "Delete" on Fruits card
     - Confirms deletion in modal
     - Category removed from system
4. Reviews category with few products (Grocery: 1 product)
5. Clicks "View Products" to see what's in the category
6. Determines if category should be expanded or merged

**Scenario 4: Bulk Price Updates**

1. Administrator needs to update prices for all rice products due to market changes
2. Uses category filter dropdown, selects "Rice"
3. Products list filters to show only rice products
4. Selects all visible rice products using checkboxes
5. Clicks bulk action button (if available) or "Edit Selected"
6. Applies percentage increase (e.g., +10%) to all selected products
7. Reviews and confirms changes
8. All rice prices update simultaneously
9. Alternatively, edits each rice product individually if different increases needed

**Scenario 5: Identifying and Correcting Data Quality Issues**

1. Administrator sorts products by Base Price (low to high)
2. Identifies products with ₱0 prices (e.g., Brisket/Pecho)
3. Creates list of products needing price corrections
4. Researches current market prices for these items
5. Edits each product to add correct pricing
6. Validates that all products now have realistic prices
7. Generates report of corrected products for records

**Scenario 6: Adding Bilingual Product Names**

1. Administrator reviews product list
2. Identifies products with only English names
3. Clicks "Edit" for products needing Filipino translation
4. Updates name field to include both names
   - Format: "English Name / Filipino Name"
   - Example: "Squid" becomes "Squid / Pusit"
5. Ensures consistency across all products
6. Improves accessibility for Filipino-speaking vendors and customers

### Category Management Operations

**Adding a New Category:**

1. Click "Add Category" button (green, top-right)
2. Modal opens with category form fields:
   - Category Name (required)
   - Description (optional)
   - Sort Order (optional, determines display order)
3. Enter category information
   - Example: Name = "Condiments", Description = "Sauces and seasonings"
4. Submit form
5. New category card appears in grid
6. Category available in product creation/edit forms
7. Initially shows "0 products"

**Editing a Category:**

1. Click "Edit" link on category card
2. Modal opens with current category information
3. Modify category name or description
4. Save changes
5. Category card updates with new information
6. All products in category remain associated

**Deleting a Category:**

1. Click "Delete" link on category card
2. System checks if category contains products
3. If empty:
   - Confirmation modal appears
   - Administrator confirms deletion
   - Category removed from system
4. If not empty:
   - Warning displays: "Category contains X products"
   - Options provided:
     - Cancel deletion
     - Reassign products to another category before deleting
     - Force delete (removes category and all its products - dangerous)
5. After safe deletion, category card disappears

### Integration with Other System Components

**Vendor Integration:**

- Vendors select from this product catalog when listing their inventory
- Product names, categories, and units standardize vendor listings
- Base prices serve as reference for vendor pricing (vendors can set their own prices)

**Price Monitoring:**

- Base prices establish market baseline
- Administrators can compare vendor prices against base prices
- Identifies price gouging or unrealistic pricing

**Inventory Management:**

- Product catalog feeds into vendor inventory systems
- Vendors mark which products they sell
- Customers can search for products and find vendors who sell them

**Reporting and Analytics:**

- Product catalog enables analysis of:
  - Most commonly sold products
  - Price trends over time
  - Category popularity
  - Product availability across vendors

**Indoor Map Integration:**

- Products link to vendor stalls through inventory
- Customers searching for specific products directed to relevant stalls
- Map can highlight stalls selling searched products

### Data Quality and Standardization

**Naming Conventions:**

- Bilingual format ensures accessibility
- Standardized spelling prevents duplicates
- Example: "Barracuda / Barakuda" rather than multiple variations

**Price Validation:**

- System should enforce minimum price (e.g., ₱1)
- Flag ₱0 prices for administrator review
- Historical price tracking to identify unusual changes

**Unit Standardization:**

- Limited unit options prevent inconsistency
- Standard units: piece, kg, bundle, liter, pack
- Ensures accurate pricing comparisons

**Category Organization:**

- Clear category definitions prevent misclassification
- Regular review of category distribution
- Merge underutilized categories
- Split overcrowded categories

### Responsive Design and Accessibility

**Desktop View (Current):**

- Full category grid (3-4 cards per row)
- Complete products table visible
- Optimal for bulk operations and data entry

**Tablet View:**

- Category cards adjust to 2 per row
- Table may require horizontal scrolling
- Touch-optimized buttons

**Mobile View:**

- Category cards stack vertically (1 per row)
- Table converts to card layout
- Simplified action menus
- Bottom sheet for editing

**Accessibility Features:**

- Keyboard navigation between categories and products
- Screen reader announcements for category counts
- High contrast text on category badges
- ARIA labels for action buttons

### Security and Permissions

**View Permissions:**

- All administrators can view product catalog
- Read-only access for junior admin roles

**Edit Permissions:**

- Product editing limited to senior administrators
- Category management requires elevated permissions
- Deletion actions require confirmation

**Audit Logging:**

- All product additions/modifications logged
- Price changes tracked with timestamp and administrator ID
- Category changes recorded for compliance

**Data Integrity:**

- Deletion of category with products blocked or requires reassignment
- Product name uniqueness enforced within categories
- Price validation prevents negative or zero values (except during data entry)

### Performance Optimization

**Efficient Loading:**

- Pagination limits records per page (10 products)
- Category counts calculated server-side
- Lazy loading of product images

**Search Optimization:**

- Database indexes on product name, category
- Debounced search queries
- Cached category information

**Bulk Operations:**

- Batch updates processed server-side
- Progress indicators for long-running operations
- Rollback capability for failed bulk updates

Overall, the Products Management Interface provides administrators with a comprehensive, well-organized system for managing Toril Public Market's product catalog. Through its dual-section design combining category-level organization with detailed product listings, the interface enables efficient catalog management, ensures data consistency, and supports the diverse product offerings that make the market a vital community resource for fresh food, staples, and specialty items.

---

## Admin Management Interface

The Admin Management page serves as the secure administrative hub for managing system administrator accounts, controlling access permissions, and maintaining the security infrastructure of the Toril Public Market management system. This interface provides senior administrators with complete oversight of the administrative team, enabling account creation, status management, and access control to ensure proper system governance and operational security.

### Page Purpose and Security Context

The Admin Management interface represents one of the most sensitive areas of the system, as it controls who has administrative access to the entire market management platform. Only authorized senior administrators with elevated permissions can access this page, ensuring that administrative account management remains secure and controlled. The page implements strict access controls and audit logging to maintain system integrity and accountability.

### Page Structure and Header

**Navigation Context**
The page is accessed through the primary navigation bar by clicking the "Admins" link. The active state is indicated by an underline beneath the "Admins" menu item, confirming the current page location.

**Page Title and Description**

- **Main Heading**: "Admin Management"
- **Subtitle**: "Manage admin users and send invitations"
- **Purpose**: Clearly communicates the page's dual function:
  1. Managing existing administrator accounts
  2. Inviting new administrators to join the system

This subtitle sets clear expectations about the available functionality and administrative capabilities.

### Search Functionality

**Search Bar**
Located prominently at the top of the page, the search feature enables quick location of specific administrators:

- **Placeholder Text**: "Search admins..."
- **Search Icon**: Magnifying glass symbol on the right side
- **Functionality**:
  - Real-time search as administrator types
  - Searches across multiple fields:
    - Admin name (first and last name)
    - Username
    - Email address
    - Phone number
  - Case-insensitive matching
  - Partial word matching supported
  - Examples: Searching "kent", "kagad", or "945" would find "kent Agad"

**Search Behavior**:

- Results filter instantly as characters are entered
- No search button required (live filtering)
- Empty search returns to full admin list
- Clear/X button appears when text entered (to reset search)

### Summary Statistics Dashboard

Three statistical cards provide an immediate overview of the administrative team composition:

**1. Total Admins**

- Icon: People/group symbol in blue
- Background: Light blue circle
- Count: 2
- Represents all administrator accounts in the system
- Includes both active and inactive administrators
- Indicates small, manageable administrative team

**2. Active**

- Icon: Checkmark within circle in green
- Background: Light green circle
- Count: 2
- Shows administrators with "Active" status
- These admins can log in and perform administrative functions
- 100% active rate (2 active out of 2 total) indicates healthy admin status

**3. Inactive**

- Icon: Prohibition/blocked symbol in gray
- Background: Light gray circle
- Count: 0
- Displays deactivated administrator accounts
- Zero inactive admins indicates no suspended or removed accounts
- Inactive admins cannot access the system

**Statistics Insights**:

- Small administrative team (2 admins) suggests focused management structure
- 100% active rate indicates all administrators are operational
- No inactive accounts suggests good account hygiene and active team
- As market grows, additional administrators may be needed

### Administrator List Table

The core of the page is the administrator data table, presenting comprehensive information about each admin account in a structured, easily scannable format.

**Table Column Structure**

The table includes seven columns providing complete administrator account information:

**1. ADMIN Column**
Displays administrator identity with visual and textual elements:

- **Avatar Badge**: Circular icon with initials

  - Format: Two-letter monogram (first letter of first name + first letter of last name)
  - Color-coded background for visual distinction
  - Examples:
    - "kA" (light blue background) for kent Agad
    - "WB" (light blue background) for Weldore Butch
  - Provides quick visual identification without photos

- **Full Name**: Administrator's complete name
  - Large, bold text for primary identification
  - Format: First name + Last name
  - Examples: "kent Agad", "Weldore Butch"
  - Capitalization may vary based on data entry

**2. USERNAME Column**

- Displays the administrator's system login username
- Format: lowercase, no spaces
- Examples:
  - "kagad" (for kent Agad)
  - "wbutch" (for Weldore Butch)
- Used for system authentication
- Must be unique across all admin accounts
- Typically derived from name or employee ID

**3. EMAIL Column**

- Shows administrator's registered email address
- Format: Standard email format (username@domain)
- Examples:
  - "akpagad@addu.edu.ph" (kent Agad - institutional email)
  - "weldorebutch@gmail.com" (Weldore Butch - personal email)
- Used for:
  - Account recovery and password resets
  - System notifications and alerts
  - Communication from other administrators
  - Login authentication (if email login enabled)
- Must be unique and valid

**Email Domain Analysis**:

- kent Agad: @addu.edu.ph (Ateneo de Davao University institutional email)
  - Suggests academic/institutional affiliation
  - May indicate thesis project or institutional partnership
- Weldore Butch: @gmail.com (personal email)
  - Standard consumer email service
  - May be market staff or consultant

**4. PHONE Column**

- Displays administrator's contact phone number
- Format: Philippine mobile number format (XXX XXX XXXX)
- Examples:
  - "945 776 4588" (kent Agad)
  - "923 156 5413" (Weldore Butch)
- Used for:
  - Emergency contact
  - Two-factor authentication (2FA) if implemented
  - SMS notifications
  - Out-of-system communication
- Both administrators have complete phone numbers (good data quality)

**Phone Number Format**:

- Space-separated groups for readability
- Philippine mobile numbers (typically start with 9)
- Complete 10-digit format
- No country code prefix displayed (+63)

**5. STATUS Column**

- Displays current account status with color-coded indicator
- Visual design: Badge with text
- Two possible statuses:

  **Active Status** (both admins in screenshot):

  - Background: Light green
  - Text: "Active" in green
  - Icon: Green dot (implied by color)
  - Meaning: Administrator can log in and perform all authorized functions
  - Full system access granted
  - Account in good standing

  **Inactive Status** (not shown, but implied):

  - Background: Light red/pink
  - Text: "Inactive" in red
  - Icon: Red dot
  - Meaning: Administrator account disabled
  - Cannot log in to system
  - May be temporary suspension or permanent deactivation

**6. CREATED Column**

- Shows account creation date
- Format: M/D/YYYY (American date format)
- Examples:
  - "11/8/2025" (kent Agad) - created today
  - "9/2/2025" (Weldore Butch) - created approximately 2 months ago
- Provides account age information
- Useful for:
  - Identifying new administrators
  - Tracking account tenure
  - Auditing account creation timeline
  - Understanding administrative team evolution

**Account Creation Timeline**:

- Weldore Butch: September 2, 2025 (original/senior admin)
- kent Agad: November 8, 2025 (recently added)
- Suggests kent Agad is a new addition to administrative team
- Weldore Butch likely the primary system administrator

**7. ACTIONS Column**

- Contains action buttons for managing each administrator
- Two actions visible for each admin:

  **Deactivate Button** (Yellow/Orange):

  - Text: "Deactivate"
  - Color: Orange/yellow text
  - Function: Temporarily disables administrator account
  - Use cases:
    - Administrator on leave or vacation
    - Temporary suspension for investigation
    - Transitioning admin out of role
    - Security precaution during account review
  - Reversible action (can be reactivated later)
  - Does not delete account data

  **Delete Button** (Red):

  - Text: "Delete"
  - Color: Red text
  - Function: Permanently removes administrator account
  - Use cases:
    - Administrator permanently leaving organization
    - Duplicate account cleanup
    - Security breach requiring account removal
  - Destructive action (requires confirmation)
  - May preserve audit logs even after deletion
  - Cannot be undone

**Action Button Layout**:

- Separated by vertical bar (|) or spacing
- Text links rather than icon buttons
- Color-coded for action severity:
  - Orange for reversible action (Deactivate)
  - Red for destructive action (Delete)
- Clear visual hierarchy indicating caution level

### Detailed Administrator Profile Analysis

**Administrator 1: kent Agad**

- **Avatar**: kA (light blue)
- **Username**: kagad
- **Email**: akpagad@addu.edu.ph
- **Phone**: 945 776 4588
- **Status**: Active (green badge)
- **Created**: 11/8/2025 (today, very new account)
- **Actions**: Deactivate | Delete

**Profile Analysis**:

- Newest administrator (account created today)
- Institutional email suggests university affiliation (Ateneo de Davao University)
- May be student researcher or faculty member working on thesis project
- Complete contact information available
- Active status indicates immediate operational role
- Username follows simple name-based pattern (first initial + last name)

**Administrator 2: Weldore Butch**

- **Avatar**: WB (light blue)
- **Username**: wbutch
- **Email**: weldorebutch@gmail.com
- **Phone**: 923 156 5413
- **Status**: Active (green badge)
- **Created**: 9/2/2025 (approximately 2 months old)
- **Actions**: Deactivate | Delete

**Profile Analysis**:

- Senior administrator (older account)
- Personal email suggests individual rather than institutional role
- May be primary system administrator or market staff member
- Complete contact information available
- Active status confirms current operational involvement
- Username follows simple name-based pattern (first initial + last name)
- Likely the primary admin who added kent Agad today

### Administrative Workflows

**Scenario 1: Reviewing Administrator Accounts**

1. Senior administrator accesses Admin Management page
2. Reviews statistics: 2 Total, 2 Active, 0 Inactive
3. Scans admin list table
4. Verifies all admins have complete contact information
5. Confirms all accounts have appropriate status
6. Notes recent account creation (kent Agad added today)
7. Ensures no unauthorized accounts exist

**Scenario 2: Inviting a New Administrator**
Although not visible in the screenshot, the "send invitations" subtitle suggests this functionality:

1. Senior administrator clicks "Invite Admin" or "Add Admin" button (likely in top-right corner, outside screenshot)
2. Invitation form opens with fields:
   - First Name (required)
   - Last Name (required)
   - Email Address (required)
   - Username (auto-generated or manual entry)
   - Phone Number (optional)
   - Role/Permissions level (if role hierarchy exists)
3. Administrator fills in new admin's information
4. Submits invitation
5. System sends email invitation to new admin with:
   - Temporary login link
   - Password setup instructions
   - System access guidelines
6. New admin clicks link, sets password, logs in
7. Account appears in admin list with "Active" status
8. Creation date set to invitation date

**Scenario 3: Deactivating an Administrator**

1. Administrator identifies account requiring deactivation
   - Example: Weldore Butch going on extended leave
2. Clicks "Deactivate" button next to Weldore Butch
3. Confirmation modal appears:
   - Title: "Deactivate Administrator"
   - Message: "Are you sure you want to deactivate Weldore Butch? They will lose access to the admin panel."
   - Buttons: Cancel | Confirm
4. Administrator clicks "Confirm"
5. Weldore Butch's status changes from "Active" (green) to "Inactive" (red)
6. Statistics update: Active count drops to 1, Inactive count rises to 1
7. Weldore Butch cannot log in (receives "account disabled" message)
8. Audit log records: Timestamp, action (deactivation), performed by, target account
9. Account can be reactivated later by clicking "Activate" button

**Scenario 4: Deleting an Administrator**

1. Administrator identifies account for permanent removal
   - Example: Removing duplicate or unauthorized account
2. Clicks "Delete" button
3. Strong confirmation modal appears:
   - Title: "Delete Administrator"
   - Message: "Are you sure you want to permanently delete kent Agad? This action cannot be undone."
   - Warning icon (red)
   - Buttons: Cancel | Delete (red)
4. Administrator clicks "Delete" to confirm
5. Account removed from system:
   - Disappears from admin list
   - Login credentials invalidated
   - Session tokens revoked
6. Statistics update: Total Admins drops to 1
7. Audit log preserves deletion record for compliance
8. kent Agad receives notification email (optional) about account removal

**Scenario 5: Searching for an Administrator**

1. Administrator needs to find specific admin (e.g., to verify contact info)
2. Clicks in search bar
3. Types "weldore" or "wbutch" or "923"
4. Table filters to show only matching results
5. Weldore Butch row displayed, kent Agad row hidden
6. Administrator reviews Weldore's information
7. Clears search or backspaces to return to full list

**Scenario 6: Reactivating a Deactivated Administrator**

1. Administrator reviews admin list
2. Filters or scrolls to find inactive administrator (status shown in red)
3. Clicks "Activate" button (appears instead of "Deactivate" for inactive accounts)
4. Confirmation modal appears
5. Confirms reactivation
6. Status changes from "Inactive" (red) to "Active" (green)
7. Administrator can log in again immediately
8. Statistics update: Active +1, Inactive -1

### Security and Access Control

**Permission Hierarchy**
The Admin Management page implements strict access controls:

**View Permissions**:

- Only administrators with elevated privileges can access this page
- Lower-level administrators (if role hierarchy exists) cannot view admin list
- Prevents unauthorized access to sensitive administrative information

**Edit Permissions**:

- Only senior administrators can deactivate other admins
- May prevent admins from deactivating themselves (to avoid lockout)
- Super admin role may be required for deletion operations

**Self-Management Restrictions**:

- Administrators typically cannot delete or deactivate their own accounts
- Prevents accidental self-lockout from system
- Ensures at least one active admin always exists
- "You cannot deactivate your own account" error shown if attempted

**Account Creation Limits**:

- New admin creation may require specific "user management" permission
- Invitation functionality restricted to prevent unauthorized account proliferation
- Email verification required for new admin accounts

### Audit Logging and Accountability

All actions performed on the Admin Management page are logged for security and compliance:

**Logged Events**:

- Admin account creation (who created, when, initial permissions)
- Status changes (activation/deactivation with reason)
- Account deletions (who deleted, when, account details preserved)
- Failed login attempts for admin accounts
- Permission changes (if role-based system exists)
- Password resets and changes
- Search queries (privacy-respecting, for security monitoring)

**Audit Log Data**:

- Timestamp of action
- Administrator who performed action
- Action type (create, update, delete, deactivate, activate)
- Target account affected
- Old values and new values (for updates)
- IP address of administrator
- Session ID for traceability

**Compliance Uses**:

- Security incident investigation
- Accountability for administrative actions
- Regulatory compliance requirements
- Dispute resolution
- System integrity verification

### Data Validation and Quality

**Email Validation**:

- Must be valid email format (username@domain.com)
- Uniqueness enforced across all admin accounts
- Email verification sent upon account creation
- Cannot use disposable email domains (optional restriction)

**Phone Number Validation**:

- Philippine mobile number format (10 digits)
- Optional but recommended for security
- Used for two-factor authentication if enabled
- SMS verification may be required

**Username Validation**:

- Must be unique across all administrators
- Lowercase letters, numbers, and limited special characters allowed
- Minimum length requirement (e.g., 5 characters)
- Cannot contain offensive or inappropriate terms

**Password Requirements** (not shown, but implied):

- Minimum length (e.g., 8-12 characters)
- Complexity requirements (uppercase, lowercase, numbers, symbols)
- Cannot reuse recent passwords
- Periodic password rotation recommended

### Integration with Other System Components

**Authentication System Integration**:

- Admin accounts authenticate against Supabase Auth
- Login credentials tied to admin profiles
- Session management tracks active admin sessions
- Single sign-on (SSO) may be supported for institutional accounts

**Dashboard Integration**:

- Admin actions throughout system attributed to logged-in admin
- "Last updated by" fields reference admin accounts
- Activity logs show which admin performed which action

**Vendor Management Integration**:

- Admin accounts visible when performing vendor-related actions
- Vendor application approvals/rejections attributed to specific admin
- Communication with vendors tracked by admin account

**Notification System Integration**:

- Email addresses used for system alert notifications
- Phone numbers used for critical system alerts (if SMS enabled)
- Admins notified of important system events
- Failed login attempt notifications sent to admin email

### Responsive Design and Mobile Access

**Desktop View (Current Screenshot)**:

- Full table layout with all columns visible
- Optimal for administrative tasks and account management
- Clear separation of data and actions

**Tablet View**:

- Table may require horizontal scrolling
- Most important columns prioritized (Name, Email, Status)
- Touch-optimized action buttons
- Larger tap targets for mobile interaction

**Mobile View**:

- Card-based layout instead of table
- Stacked information display
- Admin name and status prominently shown
- Actions accessible via menu or swipe gestures
- Search functionality remains at top

**Progressive Disclosure**:

- Less critical information (Created date) may be hidden on small screens
- Tap admin card to expand full details
- Actions available in expanded view or action menu

### Security Best Practices

**Account Security Measures**:

- Two-factor authentication (2FA) recommended for admin accounts
- Strong password requirements enforced
- Account lockout after multiple failed login attempts
- Session timeout after period of inactivity
- IP address restrictions (optional, for high-security environments)

**Operational Security**:

- Minimum two active administrators (prevents single point of failure)
- Regular review of admin accounts (quarterly or semi-annually)
- Immediate deactivation of departing administrators
- Secure password reset process with identity verification

**Monitoring and Alerts**:

- Alerts for unusual admin activity patterns
- Notification when new admin account created
- Alert when admin account deactivated or deleted
- Failed login attempt notifications
- Geographic anomaly detection (login from unusual location)

### Performance Optimization

**Efficient Data Loading**:

- Small admin list (typically <50 accounts) loads quickly
- No pagination required for small datasets
- Full list displayed on single page

**Real-Time Updates**:

- Admin list refreshes when changes made
- Status updates reflect immediately
- No manual refresh required

**Search Performance**:

- Client-side filtering for small datasets (fast, no server calls)
- Server-side search for large deployments
- Debounced search to prevent excessive processing

### Accessibility Features

**Keyboard Navigation**:

- Tab key navigates between search and action buttons
- Enter key activates focused button
- Escape key clears search field

**Screen Reader Support**:

- ARIA labels on all interactive elements
- Status badges announced with descriptive text ("Active" or "Inactive")
- Table headers properly associated with data cells
- Action buttons clearly labeled

**Visual Accessibility**:

- High contrast text for readability
- Color not sole indicator of status (text included)
- Large, readable fonts
- Clear focus indicators for keyboard users

Overall, the Admin Management Interface provides a secure, well-organized system for managing the administrative team that oversees Toril Public Market's management platform. Through its simple yet comprehensive design, the interface enables effective account management, maintains security standards, and ensures proper system governance through controlled access, detailed audit logging, and clear accountability mechanisms that protect the integrity of the entire market management system.

---

## Admin Profile Interface

The Admin Profile page serves as the personal account management center for individual administrators, providing a comprehensive view of their account information, credentials, role assignment, and account status. This interface enables administrators to review their profile details, verify their access level, and securely sign out of the system. Unlike the Admin Management page which manages all administrator accounts, the Profile page focuses solely on the currently logged-in administrator's personal information and settings.

### Page Purpose and Context

The Profile page fulfills several important functions within the administrative system:

1. **Identity Verification**: Administrators can verify their account details are correct
2. **Account Information**: Displays comprehensive profile data in a clear, organized format
3. **Role Confirmation**: Shows the administrator's assigned role and permissions level
4. **Status Awareness**: Displays current account status (Active/Inactive)
5. **Secure Logout**: Provides safe session termination functionality
6. **Self-Service Reference**: Quick access to personal contact information and credentials

This page serves as both an informational dashboard for the logged-in administrator and a secure exit point from the system.

### Page Structure and Header

**Navigation Context**
The page is accessed through the primary navigation bar by clicking the "Profile" link in the top-right corner. The active state is indicated by an underline beneath the "Profile" menu item, confirming the current page location.

**Page Title and Description**

- **Main Heading**: "Admin Profile"
- **Subtitle**: "Manage your account settings and preferences"
- **Purpose**: Communicates that this page displays personal account information
- **Note**: While the subtitle mentions "manage," the current view appears to be read-only (display of information without edit controls visible)

The subtitle suggests potential functionality for editing preferences, though edit buttons or form fields are not visible in the current screenshot. This may indicate:

- View-only mode for security reasons
- Edit functionality accessible through a separate "Edit Profile" button (outside screenshot view)
- Future functionality planned but not yet implemented

### Profile Information Display

The page presents the administrator's profile information in a clean, structured format with label-value pairs organized vertically for optimal readability.

#### Field Structure and Layout

Each profile field follows a consistent two-column layout:

- **Left Column**: Field label in dark gray text
- **Right Column**: Field value in lighter gray text
- **Spacing**: Generous vertical spacing between fields for visual clarity
- **Alignment**: Labels left-aligned, values left-aligned
- **Typography**: Clear hierarchy with labels in smaller font, values in standard font

This design pattern creates a scannable, professional appearance while maintaining accessibility and readability.

### Profile Fields Detailed Analysis

**1. Full Name**

- **Label**: "Full name"
- **Value**: "Weldore Butch"
- **Format**: First name + Last name
- **Purpose**: Primary identity display
- **Usage**:
  - Displayed in page headers and welcome messages
  - Shows in audit logs for accountability
  - Appears in notifications and system communications
  - Used for identification in admin management lists
- **Data Quality**: Complete name provided

**Name Analysis**:

- First Name: Weldore (distinctive, unique spelling)
- Last Name: Butch
- No middle name or initial displayed
- Capitalization follows standard name conventions

**2. Email Address**

- **Label**: "Email address"
- **Value**: "weldorebutch@gmail.com"
- **Format**: Standard email (username@domain.com)
- **Email Type**: Personal Gmail account
- **Purpose**: Primary contact and authentication
- **Usage**:
  - Login authentication (if email login enabled)
  - Password reset notifications
  - System alerts and notifications
  - Communication from other administrators
  - Account recovery
  - Two-factor authentication delivery (if enabled)

**Email Domain Insights**:

- @gmail.com: Consumer email service
- Not institutional email (unlike kent Agad's @addu.edu.ph)
- Suggests:
  - Market staff member
  - Independent contractor/consultant
  - Long-term project administrator
  - Personal rather than institutional affiliation

**3. Username**

- **Label**: "Username"
- **Value**: "wbutch"
- **Format**: Lowercase, no spaces
- **Pattern**: First initial (w) + last name (butch)
- **Purpose**: System login identifier
- **Usage**:
  - Primary login credential
  - System identification
  - Short reference in logs and tables
  - Command-line or API operations (if applicable)
- **Character**: Simple, memorable, professional

**Username Analysis**:

- Follows common naming convention (initial + surname)
- Easy to type and remember
- Unique identifier across all administrator accounts
- Professional format suitable for business system
- No special characters or numbers (clean, simple)

**4. Phone Number**

- **Label**: "Phone Number"
- **Value**: "+63 923 156 5413"
- **Format**: International format with country code
- **Country Code**: +63 (Philippines)
- **Network**: 923 prefix (Philippine mobile network)
- **Complete**: Full 10-digit mobile number

**Phone Number Details**:

- **International Format**: +63 923 156 5413
  - +63: Philippines country code
  - 923: Mobile network prefix
  - 156 5413: Subscriber number
- **Purpose**:
  - Emergency contact
  - Two-factor authentication (SMS-based)
  - Out-of-system communication
  - Account recovery verification
  - Critical system alerts

**Phone Number Format Difference**:

- Profile page: Includes country code (+63 923 156 5413)
- Admin Management page: No country code (923 156 5413)
- This inconsistency may indicate:
  - Different display logic for profile vs. list views
  - International format for personal use
  - Standard format for administrative lists

**5. Role**

- **Label**: "Role"
- **Value**: "admin"
- **Format**: Lowercase text
- **Purpose**: Defines permission level and access rights
- **Significance**: Determines what actions administrator can perform

**Role Analysis**:

- **Current Role**: "admin"
- **Permission Level**: Full administrative access (appears to be top-tier)
- **Capabilities**: Based on system design, likely includes:
  - View all vendor and stall information
  - Approve/reject vendor applications
  - Manage products and categories
  - Access market sections and configuration
  - Manage other administrators (senior admins only)
  - Generate reports and analytics
  - Modify system settings

**Potential Role Hierarchy** (if system implements tiered access):

- **Super Admin**: Full system control, can manage all admins
- **Admin**: Full operational access, limited admin management
- **Junior Admin**: Limited access, cannot manage other admins
- **Read-Only Admin**: View-only access for monitoring

Current "admin" role suggests Weldore Butch has comprehensive system access, consistent with being one of only two administrators and the senior admin (older account creation date: 9/2/2025).

**6. Status**

- **Label**: "Status"
- **Value**: "Active"
- **Format**: Plain text (not badge format like in Admin Management)
- **Color**: Appears in standard text color (not green badge)
- **Purpose**: Indicates current account state

**Status Information**:

- **Active Status**: Account is operational and in good standing
- **Implications**:
  - Can log in to system
  - Full access to assigned features and functions
  - Receives system notifications
  - Actions are recorded in audit logs
  - Account not suspended or restricted

**Status vs. Admin Management Display**:

- Profile page: Simple text "Active"
- Admin Management page: Green badge with "Active" text
- Different visual treatment reflects:
  - Profile focuses on information display
  - Admin Management uses visual indicators for quick scanning

**Possible Status Values**:

- **Active**: Operational account (current)
- **Inactive**: Deactivated account (would prevent login)
- **Suspended**: Temporarily restricted (if system implements)
- **Pending**: New account awaiting verification (if system implements)

### Sign Out Functionality

**Sign Out Button**
Located at the bottom of the profile information section:

**Button Design**:

- **Text**: "Sign Out"
- **Color**: Red text
- **Style**: Outlined button (border, no fill)
- **Position**: Left-aligned below all profile fields
- **Visual Weight**: Prominent but not aggressive

**Button Characteristics**:

- Red color indicates important action (session termination)
- Outlined style (not filled) suggests less frequent use than primary actions
- Clear, unambiguous label ("Sign Out" not "Logout" or "Exit")
- Easily accessible without being accidentally clickable

**Sign Out Functionality**:
When administrator clicks the "Sign Out" button:

1. **Session Termination**:

   - Current authentication session invalidated
   - Session token revoked
   - Cookies cleared
   - Local storage authentication data removed

2. **Security Cleanup**:

   - Prevents unauthorized access if device left unattended
   - Clears sensitive data from browser memory
   - Logs logout event with timestamp

3. **Navigation**:

   - Redirects to login page
   - May display "Successfully signed out" message
   - Login form ready for credentials

4. **Audit Logging**:
   - Records logout event:
     - Timestamp
     - Administrator ID (Weldore Butch)
     - IP address
     - Session duration
   - Supports security monitoring and compliance

**Sign Out Best Practices**:

- Always sign out when:
  - Leaving workstation unattended
  - Using shared or public computer
  - Finishing administrative work session
  - Switching to different user account
- Prevents unauthorized access if device compromised
- Maintains security audit trail
- Complies with security policies

### Profile Management Workflows

**Scenario 1: Verifying Account Information**

1. Administrator logs into system
2. Clicks "Profile" in navigation menu
3. Reviews displayed information:
   - Full name: Correct (Weldore Butch)
   - Email: Correct (weldorebutch@gmail.com)
   - Username: Correct (wbutch)
   - Phone: Correct (+63 923 156 5413)
   - Role: Confirmed as "admin"
   - Status: Active (can perform all functions)
4. Verifies all information accurate
5. Notes any discrepancies for correction
6. Returns to work or signs out

**Scenario 2: Confirming Role and Permissions**

1. Administrator uncertain about their access level
2. Navigates to Profile page
3. Reviews "Role" field: "admin"
4. Confirms they have full administrative access
5. Understands they can:
   - Manage vendors and applications
   - Configure market sections and stalls
   - Add/edit products and categories
   - Access all system features
6. Proceeds with administrative tasks confidently

**Scenario 3: Checking Account Status**

1. Administrator experiences login issues
2. Successfully logs in after troubleshooting
3. Checks Profile page
4. Reviews "Status" field: "Active"
5. Confirms account not deactivated or suspended
6. Determines login issue was temporary (network, password typo)
7. Continues normal operations

**Scenario 4: Secure Session Termination**

1. Administrator completes administrative tasks
2. Navigates to Profile page
3. Reviews personal information one final time
4. Clicks "Sign Out" button
5. System terminates session securely
6. Redirected to login page
7. Receives confirmation: "You have been signed out"
8. Can close browser confidently knowing session is terminated

**Scenario 5: Updating Contact Information** (If edit functionality exists)
Assuming an "Edit Profile" button or edit mode:

1. Administrator's phone number changes
2. Navigates to Profile page
3. Clicks "Edit Profile" button (if available)
4. Form fields become editable
5. Updates phone number: +63 923 156 5413 → +63 917 XXX XXXX
6. Saves changes
7. System validates new phone number
8. Confirmation message: "Profile updated successfully"
9. Updated phone displays in profile
10. Other admins see updated contact info in Admin Management

**Scenario 6: Password Change** (If functionality exists)
Even though not visible in screenshot, profile pages typically include password management:

1. Administrator wants to change password
2. Navigates to Profile page
3. Clicks "Change Password" link or button
4. Password change form appears:
   - Current password field
   - New password field
   - Confirm new password field
5. Enters credentials
6. Submits form
7. System validates:
   - Current password correct
   - New password meets requirements
   - Passwords match
8. Password updated in authentication system
9. Confirmation: "Password changed successfully"
10. Administrator uses new password on next login

### Security Considerations

**Profile Information Security**:

- Profile data only accessible by logged-in administrator
- Cannot view other administrators' profiles (unless in Admin Management with proper permissions)
- Session timeout prevents unauthorized access if left unattended
- Secure HTTPS connection protects data transmission

**Data Privacy**:

- Phone number and email considered personally identifiable information (PII)
- Protected under data privacy regulations
- Not shared with vendors or public users
- Visible only to other administrators with proper permissions

**Password Security** (standard practices, not shown):

- Passwords never displayed (even partially)
- Hash-based storage prevents plain-text exposure
- Password change requires current password verification
- Strong password policies enforced

**Session Management**:

- Active session indicated by ability to view profile
- Session expires after period of inactivity
- Sign out immediately terminates session
- Multiple concurrent sessions may be restricted

### Profile Information Uses

**System-Wide Integration**:

1. **Audit Logging**:

   - Full name appears in all audit logs
   - Actions attributed to "Weldore Butch"
   - Provides accountability for system changes

2. **Notifications**:

   - Email address receives system alerts
   - Phone number used for critical notifications
   - Personalized notification content includes admin name

3. **User Interface**:

   - Name displayed in top-right corner (common pattern)
   - Welcome message: "Welcome, Weldore Butch"
   - Personalized dashboard greetings

4. **Communication**:

   - Other admins can contact via displayed email/phone
   - System-generated emails addressed to admin name
   - Professional communication identification

5. **Access Control**:

   - Role determines visible menu items and features
   - Permission checks reference admin role
   - Feature flags based on role assignment

6. **Reporting**:
   - Reports show "Generated by: Weldore Butch"
   - Export files attributed to admin
   - Data modification history includes admin name

### Design and Usability Analysis

**Visual Hierarchy**:

- Clear heading establishes page purpose
- Subtitle provides context
- Consistent field layout creates predictable pattern
- Adequate spacing prevents visual cluttering
- Sign Out button visually separated from information fields

**Information Architecture**:

- Logical field ordering:
  1. Identity (Name)
  2. Contact (Email, Phone)
  3. Credentials (Username)
  4. Access (Role, Status)
- Groups related information naturally
- Most frequently referenced info (name, email) appears first

**Readability**:

- High contrast between labels and values
- Sufficient font sizes for easy scanning
- Clean, minimalist design reduces cognitive load
- White space improves focus on content

**User Experience**:

- No unnecessary complexity
- Information instantly accessible
- Sign out function prominently placed
- Professional, trustworthy appearance

### Potential Enhancements

**Edit Functionality**:
Current view appears read-only. Common enhancements include:

- "Edit Profile" button to enable field modifications
- In-line editing for quick updates
- Save/Cancel buttons when in edit mode
- Real-time validation of changes

**Additional Profile Features**:
Standard profile pages often include:

- Profile photo upload
- Password change link
- Two-factor authentication setup
- Login history display
- Session management (view/revoke active sessions)
- Notification preferences
- Language/timezone settings
- Theme preferences (dark/light mode)

**Activity Dashboard**:

- Recent actions performed
- Login history with timestamps
- Failed login attempts
- Account security alerts

**Security Settings**:

- Two-factor authentication toggle
- Trusted devices management
- Login notification preferences
- Security question setup

### Responsive Design Considerations

**Desktop View (Current)**:

- Full width layout with comfortable spacing
- All information clearly visible
- Optimal reading experience
- Sign out button easily accessible

**Tablet View**:

- Similar layout maintains readability
- Slightly reduced spacing
- Touch-optimized sign out button
- Portrait and landscape support

**Mobile View**:

- Vertical scrolling for all fields
- Stacked label-value pairs
- Large touch targets
- Sign out button fixed at bottom or top
- Responsive font sizes

### Accessibility Features

**Keyboard Navigation**:

- Tab key moves focus to Sign Out button
- Enter key activates sign out
- Screen reader announces all field labels and values

**Screen Reader Support**:

- Semantic HTML for proper structure
- Labels associated with values
- Role and status announced clearly
- Sign out button clearly identified

**Visual Accessibility**:

- High contrast text
- Readable font sizes
- Clear visual hierarchy
- No reliance on color alone for information

### Integration with Authentication System

**Supabase Auth Integration**:

- Profile data synced with Supabase Auth user record
- Username and email match authentication credentials
- Role stored in admin_profiles table
- Status checked on each login attempt

**Session Validation**:

- Profile page load verifies active session
- Expired sessions redirect to login
- Invalid tokens refresh or re-authenticate
- Secure cookie-based session management

**Sign Out Process**:

- Calls Supabase auth.signOut() method
- Clears authentication tokens
- Invalidates session server-side
- Redirects to login page

Overall, the Admin Profile Interface provides administrators with a clear, comprehensive view of their account information, role assignment, and current status within the Toril Public Market management system. Through its clean, professional design and straightforward information display, the interface enables quick identity verification, role confirmation, and secure session termination. While currently focused on information display, the page establishes a foundation for future profile management capabilities, ensuring administrators can effectively manage their personal account settings while maintaining system security and accountability standards.
