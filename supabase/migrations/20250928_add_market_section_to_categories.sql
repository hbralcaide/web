-- Add market_section_id to product_categories table
-- This will link product categories to specific market sections

ALTER TABLE product_categories 
ADD COLUMN IF NOT EXISTS market_section_id UUID REFERENCES market_sections(id) ON DELETE CASCADE;

-- Add comment explaining the field
COMMENT ON COLUMN product_categories.market_section_id IS 'Links product category to a specific market section (e.g., Beef category belongs to Meat section)';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_product_categories_market_section ON product_categories(market_section_id);

SELECT 'Market section field added to product_categories table' as status;