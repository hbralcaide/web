import { supabase } from '../lib/supabase'

export interface PhotoUploadResult {
    success: boolean
    url?: string
    error?: string
}

export const uploadPhoto = async (
    file: File,
    applicationId: string,
    photoType: 'person_photo' | 'barangay_clearance' | 'id_front_photo' | 'id_back_photo' | 'birth_certificate' | 'marriage_certificate' | 'notarized_document'
): Promise<PhotoUploadResult> => {
    try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            return { success: false, error: 'File must be an image' }
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            return { success: false, error: 'File size must be less than 5MB' }
        }

        // Generate unique filename
        const fileExtension = file.type.split('/')[1] || 'jpg'
        const fileName = `applications/${applicationId}/${photoType}_${Date.now()}.${fileExtension}`

        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
            .from('vendor-profiles')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (error) {
            console.error('Upload error:', error)
            return { success: false, error: error.message }
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('vendor-profiles')
            .getPublicUrl(fileName)

        return {
            success: true,
            url: urlData.publicUrl
        }

    } catch (error: any) {
        console.error('Photo upload error:', error)
        return { success: false, error: error.message || 'Upload failed' }
    }
}

export const deletePhoto = async (fileName: string): Promise<boolean> => {
    try {
        const { error } = await supabase.storage
            .from('vendor-profiles')
            .remove([fileName])

        if (error) {
            console.error('Delete error:', error)
            return false
        }

        return true
    } catch (error) {
        console.error('Photo delete error:', error)
        return false
    }
}

export const getPhotoUrl = (fileName: string): string => {
    const { data } = supabase.storage
        .from('vendor-profiles')
        .getPublicUrl(fileName)

    return data.publicUrl
}
