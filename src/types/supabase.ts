export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      market_sections: {
        Row: {
          id: string
          name: string
          code: string
          capacity: number
          stalls_count: number
          description: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          capacity: number
          stalls_count?: number
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          capacity?: number
          stalls_count?: number
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      vendors: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          business_name: string
          contact_number: string
          status: 'pending' | 'approved' | 'rejected' | 'deactivated'
          stall_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          business_name: string
          contact_number: string
          status?: 'pending' | 'approved' | 'rejected' | 'deactivated'
          stall_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          business_name?: string
          contact_number?: string
          status?: 'pending' | 'approved' | 'rejected' | 'deactivated'
          stall_id?: string | null
        }
      }
      stalls: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          stall_number: string
          location_desc: string | null
          status: string
          vendor_profile: string | null
          section_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          stall_number: string
          location_desc?: string | null
          status?: string
          vendor_profile?: string | null
          section_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          stall_number?: string
          location_desc?: string | null
          status?: string
          vendor_profile?: string | null
          section_id?: string
        }
      }
      admin_profiles: {
        Row: {
          id: string
          auth_user_id: string
          first_name: string | null
          last_name: string | null
          email: string
          phone_number: string | null
          username: string | null
          role: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_user_id: string
          first_name?: string | null
          last_name?: string | null
          email: string
          phone_number?: string | null
          username?: string | null
          role?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_user_id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string
          phone_number?: string | null
          username?: string | null
          role?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      vendor_profiles: {
        Row: {
          id: string
          auth_user_id: string | null
          first_name: string
          last_name: string
          middle_name: string | null
          email: string
          phone_number: string | null
          complete_address: string | null
          business_name: string | null
          business_type: string | null
          username: string
          role: string | null
          status: string | null
          application_status: string | null
          assigned_stall_id: string | null
          contract_id: string | null
          vendor_application_id: string | null
          profile_picture: string | null
          bio: string | null
          created_at: string | null
          updated_at: string | null
          last_login: string | null
        }
        Insert: {
          id?: string
          auth_user_id?: string | null
          first_name: string
          last_name: string
          middle_name?: string | null
          email: string
          phone_number?: string | null
          complete_address?: string | null
          business_name?: string | null
          business_type?: string | null
          username: string
          role?: string | null
          status?: string | null
          application_status?: string | null
          assigned_stall_id?: string | null
          contract_id?: string | null
          vendor_application_id?: string | null
          profile_picture?: string | null
          bio?: string | null
          created_at?: string | null
          updated_at?: string | null
          last_login?: string | null
        }
        Update: {
          id?: string
          auth_user_id?: string | null
          first_name?: string
          last_name?: string
          middle_name?: string | null
          email?: string
          phone_number?: string | null
          complete_address?: string | null
          business_name?: string | null
          business_type?: string | null
          username?: string
          role?: string | null
          status?: string | null
          application_status?: string | null
          assigned_stall_id?: string | null
          contract_id?: string | null
          vendor_application_id?: string | null
          profile_picture?: string | null
          bio?: string | null
          created_at?: string | null
          updated_at?: string | null
          last_login?: string | null
        }
      }
      email_logs: {
        Row: {
          id: string
          recipient_email: string
          subject: string
          content: string
          email_type: string
          sent_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          recipient_email: string
          subject: string
          content: string
          email_type: string
          sent_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          recipient_email?: string
          subject?: string
          content?: string
          email_type?: string
          sent_at?: string
          metadata?: Json
        }
      }
      vendor_applications: {
        Row: {
          id: string
          application_number: string
          first_name: string
          last_name: string
          middle_name: string | null
          age: number | null
          marital_status: string | null
          spouse_name: string | null
          complete_address: string
          actual_occupant_first_name: string | null
          actual_occupant_last_name: string | null
          status: string
          submitted_at: string | null
          approved_at: string | null
          rejected_at: string | null
          rejection_reason: string | null
          person_photo: string | null
          barangay_clearance: string | null
          id_front_photo: string | null
          id_back_photo: string | null
          birth_certificate: string | null
          marriage_certificate: string | null
          notarized_document: string | null
          person_photo_reuploaded: boolean | null
          barangay_clearance_reuploaded: boolean | null
          id_front_photo_reuploaded: boolean | null
          id_back_photo_reuploaded: boolean | null
          birth_certificate_reuploaded: boolean | null
          marriage_certificate_reuploaded: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_number: string
          first_name: string
          last_name: string
          middle_name?: string | null
          age?: number | null
          marital_status?: string | null
          spouse_name?: string | null
          complete_address: string
          actual_occupant_first_name?: string | null
          actual_occupant_last_name?: string | null
          status?: string
          submitted_at?: string | null
          approved_at?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          person_photo?: string | null
          barangay_clearance?: string | null
          id_front_photo?: string | null
          id_back_photo?: string | null
          birth_certificate?: string | null
          marriage_certificate?: string | null
          notarized_document?: string | null
          person_photo_reuploaded?: boolean | null
          barangay_clearance_reuploaded?: boolean | null
          id_front_photo_reuploaded?: boolean | null
          id_back_photo_reuploaded?: boolean | null
          birth_certificate_reuploaded?: boolean | null
          marriage_certificate_reuploaded?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_number?: string
          first_name?: string
          last_name?: string
          middle_name?: string | null
          age?: number | null
          marital_status?: string | null
          spouse_name?: string | null
          complete_address?: string
          actual_occupant_first_name?: string | null
          actual_occupant_last_name?: string | null
          status?: string
          submitted_at?: string | null
          approved_at?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          person_photo?: string | null
          barangay_clearance?: string | null
          id_front_photo?: string | null
          id_back_photo?: string | null
          birth_certificate?: string | null
          marriage_certificate?: string | null
          notarized_document?: string | null
          person_photo_reuploaded?: boolean | null
          barangay_clearance_reuploaded?: boolean | null
          id_front_photo_reuploaded?: boolean | null
          id_back_photo_reuploaded?: boolean | null
          birth_certificate_reuploaded?: boolean | null
          marriage_certificate_reuploaded?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      stall_applications: {
        Row: {
          id: string
          vendor_application_id: string
          stall_id: string
          applied_at: string
        }
        Insert: {
          id?: string
          vendor_application_id: string
          stall_id: string
          applied_at?: string
        }
        Update: {
          id?: string
          vendor_application_id?: string
          stall_id?: string
          applied_at?: string
        }
      }
      vendor_credentials: {
        Row: {
          id: string
          vendor_profile_id: string
          vendor_application_id: string
          setup_token: string
          setup_token_expires_at: string
          password_setup_completed: boolean
          password_setup_completed_at: string | null
          generated_username: string
          temp_password: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vendor_profile_id: string
          vendor_application_id: string
          setup_token: string
          setup_token_expires_at: string
          password_setup_completed?: boolean
          password_setup_completed_at?: string | null
          generated_username: string
          temp_password?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vendor_profile_id?: string
          vendor_application_id?: string
          setup_token?: string
          setup_token_expires_at?: string
          password_setup_completed?: boolean
          password_setup_completed_at?: string | null
          generated_username?: string
          temp_password?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      log_vendor_activation_email: {
        Args: {
          p_email: string
          p_first_name: string
          p_last_name: string
          p_username: string
        }
        Returns: Json
      }
      complete_password_setup: {
        Args: {
          p_setup_token: string
          p_email: string
          p_password: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
