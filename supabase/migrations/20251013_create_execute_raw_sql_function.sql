-- Create a custom function to execute raw SQL queries
CREATE OR REPLACE FUNCTION execute_raw_sql(query TEXT)
RETURNS SETOF RECORD AS $$
BEGIN
  RETURN QUERY EXECUTE query;
END;
$$ LANGUAGE plpgsql;