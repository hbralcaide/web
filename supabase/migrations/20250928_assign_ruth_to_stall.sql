-- Fix Ruth's stall assignment
-- Update stall E-1 to be assigned to Ruth and marked as occupied

UPDATE stalls 
SET vendor_profile_id = 'b5d664b7-b48d-40a0-9136-53bca99d6e59',
    status = 'occupied'
WHERE stall_number = 'E-1' 
AND section_id = 'a570a395-e959-44e2-bc33-a28f1b7c88c2';

-- Verify the update
SELECT 
    s.stall_number,
    s.status,
    s.vendor_profile_id,
    vp.first_name,
    vp.last_name,
    vp.username
FROM stalls s
LEFT JOIN vendor_profiles vp ON s.vendor_profile_id = vp.id
WHERE s.stall_number = 'E-1';

SELECT 'Ruth has been assigned to stall E-1' as status;