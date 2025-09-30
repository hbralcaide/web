-- Update stall_applications table to properly reference stalls table
-- This migration fixes the foreign key reference that was missing

-- First, check if the stall_applications table exists and update it
DO $$
BEGIN
    -- Check if stall_applications table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'stall_applications') THEN
        -- Add the foreign key constraint if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'stall_applications_stall_id_fkey'
        ) THEN
            ALTER TABLE stall_applications 
            ADD CONSTRAINT stall_applications_stall_id_fkey 
            FOREIGN KEY (stall_id) REFERENCES stalls(id) ON DELETE CASCADE;
        END IF;
    ELSE
        -- Create the table if it doesn't exist
        CREATE TABLE stall_applications (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            vendor_application_id UUID NOT NULL REFERENCES vendor_applications(id) ON DELETE CASCADE,
            stall_id UUID NOT NULL REFERENCES stalls(id) ON DELETE CASCADE,
            applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            
            -- Ensure one application per vendor per stall
            UNIQUE(vendor_application_id, stall_id)
        );
        
        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_stall_applications_stall_id ON stall_applications(stall_id);
        CREATE INDEX IF NOT EXISTS idx_stall_applications_vendor_application_id ON stall_applications(vendor_application_id);
        
        -- Enable RLS
        ALTER TABLE stall_applications ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policies
        CREATE POLICY "Anyone can create stall applications" ON stall_applications
            FOR INSERT WITH CHECK (true);

        CREATE POLICY "Anyone can view stall applications" ON stall_applications
            FOR SELECT USING (true);
            
        CREATE POLICY "Admins can manage stall applications" ON stall_applications
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM admin_profiles 
                    WHERE admin_profiles.auth_user_id = auth.uid() 
                    AND admin_profiles.role = 'admin'
                )
            );
    END IF;
END $$;

-- Add comment to table
COMMENT ON TABLE stall_applications IS 'Links vendor applications to specific stalls they applied for';


