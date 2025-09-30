-- Create a placeholder auth user for manual vendor entries
-- This allows the vendor_profiles table to satisfy the foreign key constraint

-- First, check if the placeholder user already exists
DO $$
BEGIN
    -- Only insert if the user doesn't already exist
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '11111111-1111-1111-1111-111111111111') THEN
        -- Create a placeholder auth user for manual entries
        INSERT INTO auth.users (
            id,
            instance_id,
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
            '11111111-1111-1111-1111-111111111111',
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'manual-entries@admin.local',
            '$2a$10$placeholder.hash.for.manual.entries.only',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            '{"provider": "manual", "providers": ["manual"]}',
            '{"role": "manual_entry_placeholder"}',
            false,
            '',
            '',
            '',
            ''
        );
    END IF;
END $$;

-- Alternatively, if you prefer to make auth_user_id nullable for manual entries:
-- ALTER TABLE vendor_profiles ALTER COLUMN auth_user_id DROP NOT NULL;

SELECT 'Placeholder auth user created for manual vendor entries' as status;