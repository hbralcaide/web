-- Create function to allow admins to add vendor profiles
-- This bypasses RLS policies for admin operations

CREATE OR REPLACE FUNCTION admin_add_vendor_profile(
    p_first_name TEXT,
    p_last_name TEXT,
    p_middle_name TEXT DEFAULT NULL,
    p_username TEXT,
    p_email TEXT,
    p_market_section_id UUID DEFAULT NULL,
    p_stall_id UUID DEFAULT NULL
)
RETURNS JSON
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_vendor_id UUID;
    stall_number_value TEXT;
    result JSON;
BEGIN
    -- Check if user is admin (caller should be authenticated admin)
    IF NOT EXISTS (
        SELECT 1 FROM admin_profiles 
        WHERE admin_profiles.auth_user_id = auth.uid() 
        AND admin_profiles.role = 'admin'
    ) THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Unauthorized: Admin access required'
        );
    END IF;

    -- Get stall number if stall_id provided
    IF p_stall_id IS NOT NULL THEN
        SELECT stall_number INTO stall_number_value
        FROM stalls
        WHERE id = p_stall_id;
    END IF;

    -- Insert vendor profile (bypasses RLS due to SECURITY DEFINER)
    INSERT INTO vendor_profiles (
        auth_user_id,
        first_name,
        last_name,
        middle_name,
        username,
        email,
        phone_number,
        business_name,
        status,
        role,
        application_status,
        signup_method,
        market_section_id,
        stall_number
    ) VALUES (
        NULL, -- No auth user yet
        p_first_name,
        p_last_name,
        p_middle_name,
        p_username,
        p_email,
        '', -- Empty phone for now
        '', -- Empty business name for now
        'Active',
        'vendor',
        'approved',
        'manual_entry',
        p_market_section_id,
        stall_number_value
    ) RETURNING id INTO new_vendor_id;

    -- Update stall if provided
    IF p_stall_id IS NOT NULL THEN
        UPDATE stalls 
        SET 
            vendor_profile = new_vendor_id,
            status = 'occupied'
        WHERE id = p_stall_id;
    END IF;

    RETURN json_build_object(
        'success', true,
        'vendor_id', new_vendor_id,
        'message', 'Vendor profile created successfully'
    );

EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users (admins will be checked inside function)
GRANT EXECUTE ON FUNCTION admin_add_vendor_profile TO authenticated;