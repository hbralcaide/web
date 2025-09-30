-- Create vendor_profiles table and integrate with new raffle system
-- This table bridges the gap between the new application system and existing mobile auth

-- 1. Create vendor_profiles table (referenced by mobile app but missing)
CREATE TABLE IF NOT EXISTS vendor_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic Information
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    middle_name TEXT,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE, -- Generated username for mobile login
    
    -- Contact Information
    phone_number TEXT,
    complete_address TEXT,
    
    -- Vendor Status
    application_status TEXT DEFAULT 'pending', -- pending, approved, rejected
    status TEXT DEFAULT 'Pending', -- Pending, Active, Inactive, Archived
    role TEXT DEFAULT 'vendor',
    
    -- Stall Assignment (after being chosen in raffle)
    assigned_stall_id UUID, -- Will reference stalls table when created
    contract_id UUID, -- References vendor_contracts table
    
    -- Profile Information
    business_name TEXT,
    business_type TEXT,
    profile_picture TEXT,
    bio TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- 2. Add vendor_application_id to vendor_profiles to link with new system
ALTER TABLE vendor_profiles 
ADD COLUMN IF NOT EXISTS vendor_application_id UUID REFERENCES vendor_applications(id) ON DELETE SET NULL;

-- 3. Create vendor_credentials table for password setup
CREATE TABLE IF NOT EXISTS vendor_credentials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vendor_profile_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    vendor_application_id UUID NOT NULL REFERENCES vendor_applications(id) ON DELETE CASCADE,
    
    -- Credential Setup
    setup_token TEXT NOT NULL UNIQUE, -- Token for password setup
    setup_token_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    password_setup_completed BOOLEAN DEFAULT FALSE,
    password_setup_completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Generated Credentials
    generated_username TEXT NOT NULL, -- Auto-generated username
    temp_password TEXT, -- Temporary password (if needed)
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_auth_user_id ON vendor_profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_username ON vendor_profiles(username);
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_email ON vendor_profiles(email);
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_application_status ON vendor_profiles(application_status);
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_status ON vendor_profiles(status);
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_assigned_stall_id ON vendor_profiles(assigned_stall_id);
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_vendor_application_id ON vendor_profiles(vendor_application_id);

CREATE INDEX IF NOT EXISTS idx_vendor_credentials_vendor_profile_id ON vendor_credentials(vendor_profile_id);
CREATE INDEX IF NOT EXISTS idx_vendor_credentials_vendor_application_id ON vendor_credentials(vendor_application_id);
CREATE INDEX IF NOT EXISTS idx_vendor_credentials_setup_token ON vendor_credentials(setup_token);
CREATE INDEX IF NOT EXISTS idx_vendor_credentials_generated_username ON vendor_credentials(generated_username);

-- 5. Enable Row Level Security
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_credentials ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies for vendor_profiles
CREATE POLICY "Vendors can view their own profile" ON vendor_profiles
    FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "Vendors can update their own profile" ON vendor_profiles
    FOR UPDATE USING (auth_user_id = auth.uid());

CREATE POLICY "Anyone can create vendor profiles" ON vendor_profiles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all vendor profiles" ON vendor_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can update all vendor profiles" ON vendor_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    );

-- 7. Create RLS Policies for vendor_credentials
CREATE POLICY "Vendors can view their own credentials" ON vendor_credentials
    FOR SELECT USING (
        vendor_profile_id IN (
            SELECT id FROM vendor_profiles WHERE auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can create vendor credentials with valid token" ON vendor_credentials
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all vendor credentials" ON vendor_credentials
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    );

-- 8. Create trigger functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. Create triggers for updated_at
CREATE TRIGGER update_vendor_profiles_updated_at
    BEFORE UPDATE ON vendor_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_credentials_updated_at
    BEFORE UPDATE ON vendor_credentials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 10. Create function to generate unique username
CREATE OR REPLACE FUNCTION generate_vendor_username(first_name TEXT, last_name TEXT)
RETURNS TEXT AS $$
DECLARE
    base_username TEXT;
    final_username TEXT;
    exists_count INTEGER;
    counter INTEGER := 1;
BEGIN
    -- Create base username from first and last name
    base_username := LOWER(TRIM(first_name) || TRIM(last_name));
    base_username := REGEXP_REPLACE(base_username, '[^a-z0-9]', '', 'g');
    
    -- Ensure it's at least 3 characters
    IF LENGTH(base_username) < 3 THEN
        base_username := base_username || 'vendor';
    END IF;
    
    -- Limit to 15 characters
    base_username := LEFT(base_username, 15);
    
    final_username := base_username;
    
    LOOP
        -- Check if username exists
        SELECT COUNT(*) INTO exists_count 
        FROM vendor_profiles 
        WHERE username = final_username;
        
        -- If it doesn't exist, return it
        IF exists_count = 0 THEN
            RETURN final_username;
        END IF;
        
        -- Add counter and try again
        final_username := LEFT(base_username, 12) || LPAD(counter::TEXT, 3, '0');
        counter := counter + 1;
        
        -- Prevent infinite loop
        IF counter > 999 THEN
            -- Fallback to random number
            final_username := base_username || LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0');
            RETURN final_username;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 11. Create function to generate setup token
CREATE OR REPLACE FUNCTION generate_setup_token()
RETURNS TEXT AS $$
DECLARE
    token TEXT;
    exists_count INTEGER;
BEGIN
    LOOP
        -- Generate a random token
        token := encode(gen_random_bytes(32), 'hex');
        
        -- Check if it already exists
        SELECT COUNT(*) INTO exists_count 
        FROM vendor_credentials 
        WHERE setup_token = token;
        
        -- If it doesn't exist, return it
        IF exists_count = 0 THEN
            RETURN token;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 12. Create function to create vendor profile after contract approval
CREATE OR REPLACE FUNCTION create_vendor_profile_after_contract()
RETURNS TRIGGER AS $$
DECLARE
    vendor_app_record RECORD;
    generated_username TEXT;
    setup_token TEXT;
    token_expires TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Only trigger when contract status changes to 'active'
    IF NEW.status = 'active' AND (OLD.status IS NULL OR OLD.status != 'active') THEN
        
        -- Get vendor application data
        SELECT * INTO vendor_app_record
        FROM vendor_applications
        WHERE id = NEW.vendor_application_id;
        
        -- Generate username
        generated_username := generate_vendor_username(
            vendor_app_record.first_name, 
            vendor_app_record.last_name
        );
        
        -- Generate setup token (expires in 7 days)
        setup_token := generate_setup_token();
        token_expires := CURRENT_TIMESTAMP + INTERVAL '7 days';
        
        -- Create vendor profile
        INSERT INTO vendor_profiles (
            first_name,
            last_name,
            middle_name,
            email, -- This will need to be provided or generated
            username,
            complete_address,
            application_status,
            status,
            assigned_stall_id,
            contract_id,
            vendor_application_id
        ) VALUES (
            vendor_app_record.first_name,
            vendor_app_record.last_name,
            vendor_app_record.middle_name,
            LOWER(generated_username) || '@mapalengke.local', -- Temporary email
            generated_username,
            vendor_app_record.complete_address,
            'approved',
            'Active',
            NEW.stall_id,
            NEW.id,
            NEW.vendor_application_id
        );
        
        -- Create vendor credentials record
        INSERT INTO vendor_credentials (
            vendor_profile_id,
            vendor_application_id,
            setup_token,
            setup_token_expires_at,
            generated_username
        ) VALUES (
            (SELECT id FROM vendor_profiles WHERE contract_id = NEW.id),
            NEW.vendor_application_id,
            setup_token,
            token_expires,
            generated_username
        );
        
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 13. Create trigger for automatic vendor profile creation
CREATE TRIGGER trigger_create_vendor_profile_after_contract
    AFTER UPDATE ON vendor_contracts
    FOR EACH ROW
    EXECUTE FUNCTION create_vendor_profile_after_contract();

-- 14. Create function to complete password setup
CREATE OR REPLACE FUNCTION complete_password_setup(
    p_setup_token TEXT,
    p_email TEXT,
    p_password TEXT
)
RETURNS JSON AS $$
DECLARE
    credential_record RECORD;
    profile_record RECORD;
    auth_user_id UUID;
    result JSON;
BEGIN
    -- Validate setup token
    SELECT * INTO credential_record
    FROM vendor_credentials
    WHERE setup_token = p_setup_token
    AND setup_token_expires_at > CURRENT_TIMESTAMP
    AND password_setup_completed = FALSE;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Invalid or expired setup token'
        );
    END IF;
    
    -- Get vendor profile
    SELECT * INTO profile_record
    FROM vendor_profiles
    WHERE id = credential_record.vendor_profile_id;
    
    -- Create auth user
    BEGIN
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            p_email,
            crypt(p_password, gen_salt('bf')),
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            '{"provider": "email", "providers": ["email"]}',
            '{"role": "vendor"}',
            false,
            '',
            '',
            '',
            ''
        ) RETURNING id INTO auth_user_id;
        
    EXCEPTION WHEN unique_violation THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Email already exists'
        );
    END;
    
    -- Update vendor profile with auth_user_id and email
    UPDATE vendor_profiles
    SET 
        auth_user_id = auth_user_id,
        email = p_email,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = credential_record.vendor_profile_id;
    
    -- Mark credentials as completed
    UPDATE vendor_credentials
    SET 
        password_setup_completed = TRUE,
        password_setup_completed_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = credential_record.id;
    
    RETURN json_build_object(
        'success', true,
        'username', credential_record.generated_username,
        'email', p_email,
        'message', 'Password setup completed successfully'
    );
    
END;
$$ LANGUAGE plpgsql;



