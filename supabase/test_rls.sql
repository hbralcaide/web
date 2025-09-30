-- Temporarily disable RLS to test if that's the issue
ALTER TABLE market_sections DISABLE ROW LEVEL SECURITY;

-- Test query to see if we can now insert
INSERT INTO market_sections (name, code, capacity, description) 
VALUES ('Test Section', 'TS', 10, 'This is a test section');

-- Check if the insert worked
SELECT * FROM market_sections WHERE name = 'Test Section';

-- Re-enable RLS after testing
ALTER TABLE market_sections ENABLE ROW LEVEL SECURITY;

-- Delete the test record
DELETE FROM market_sections WHERE name = 'Test Section';
