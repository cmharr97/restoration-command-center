export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action_type: string
          company_id: string | null
          created_at: string
          description: string | null
          id: string
          job_id: string | null
          metadata: Json | null
          title: string
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          action_type?: string
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          job_id?: string | null
          metadata?: Json | null
          title: string
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          action_type?: string
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          job_id?: string | null
          metadata?: Json | null
          title?: string
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_rules: {
        Row: {
          action_type: string
          config: Json | null
          created_at: string
          created_by: string | null
          description: string | null
          enabled: boolean | null
          id: string
          name: string
          trigger_type: string
        }
        Insert: {
          action_type: string
          config?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          name: string
          trigger_type: string
        }
        Update: {
          action_type?: string
          config?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          name?: string
          trigger_type?: string
        }
        Relationships: []
      }
      claims: {
        Row: {
          carrier_response_status: string | null
          company_id: string | null
          created_at: string
          created_by: string | null
          denied_items: Json | null
          estimate_submitted_date: string | null
          id: string
          job_id: string
          notes: string | null
          outstanding_balance: number | null
          payments_received: number | null
          pending_approvals: Json | null
          recoverable_depreciation: number | null
          reinspection_date: string | null
          reinspection_requested: boolean | null
          supplement_status: string | null
          updated_at: string
        }
        Insert: {
          carrier_response_status?: string | null
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          denied_items?: Json | null
          estimate_submitted_date?: string | null
          id?: string
          job_id: string
          notes?: string | null
          outstanding_balance?: number | null
          payments_received?: number | null
          pending_approvals?: Json | null
          recoverable_depreciation?: number | null
          reinspection_date?: string | null
          reinspection_requested?: boolean | null
          supplement_status?: string | null
          updated_at?: string
        }
        Update: {
          carrier_response_status?: string | null
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          denied_items?: Json | null
          estimate_submitted_date?: string | null
          id?: string
          job_id?: string
          notes?: string | null
          outstanding_balance?: number | null
          payments_received?: number | null
          pending_approvals?: Json | null
          recoverable_depreciation?: number | null
          reinspection_date?: string | null
          reinspection_requested?: boolean | null
          supplement_status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "claims_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          email: string | null
          id: string
          license_number: string | null
          logo_url: string | null
          name: string
          owner_id: string
          phone: string | null
          service_area: string | null
          services: string[] | null
          state: string | null
          team_size: string | null
          updated_at: string
          website: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          license_number?: string | null
          logo_url?: string | null
          name: string
          owner_id: string
          phone?: string | null
          service_area?: string | null
          services?: string[] | null
          state?: string | null
          team_size?: string | null
          updated_at?: string
          website?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          license_number?: string | null
          logo_url?: string | null
          name?: string
          owner_id?: string
          phone?: string | null
          service_area?: string | null
          services?: string[] | null
          state?: string | null
          team_size?: string | null
          updated_at?: string
          website?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      drying_logs: {
        Row: {
          created_at: string
          created_by: string | null
          date: string
          day: number
          equipment: Json | null
          gpp: number | null
          id: string
          job_id: string
          notes: string | null
          readings: Json | null
          rh: number | null
          tech_name: string
          temp: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          date: string
          day: number
          equipment?: Json | null
          gpp?: number | null
          id?: string
          job_id: string
          notes?: string | null
          readings?: Json | null
          rh?: number | null
          tech_name: string
          temp?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date?: string
          day?: number
          equipment?: Json | null
          gpp?: number | null
          id?: string
          job_id?: string
          notes?: string | null
          readings?: Json | null
          rh?: number | null
          tech_name?: string
          temp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "drying_logs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_messages: {
        Row: {
          attachments: Json | null
          channel_type: string
          company_id: string | null
          created_at: string
          id: string
          job_id: string
          message_text: string
          sender_avatar: string | null
          sender_id: string
          sender_name: string
        }
        Insert: {
          attachments?: Json | null
          channel_type: string
          company_id?: string | null
          created_at?: string
          id?: string
          job_id: string
          message_text: string
          sender_avatar?: string | null
          sender_id: string
          sender_name: string
        }
        Update: {
          attachments?: Json | null
          channel_type?: string
          company_id?: string | null
          created_at?: string
          id?: string
          job_id?: string
          message_text?: string
          sender_avatar?: string | null
          sender_id?: string
          sender_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_messages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_messages_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_photos: {
        Row: {
          caption: string | null
          company_id: string | null
          created_at: string
          id: string
          job_id: string
          photo_type: string | null
          taken_at: string | null
          uploaded_by: string | null
          uploaded_by_name: string | null
          url: string
        }
        Insert: {
          caption?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          job_id: string
          photo_type?: string | null
          taken_at?: string | null
          uploaded_by?: string | null
          uploaded_by_name?: string | null
          url: string
        }
        Update: {
          caption?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          job_id?: string
          photo_type?: string | null
          taken_at?: string | null
          uploaded_by?: string | null
          uploaded_by_name?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_photos_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_photos_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          address: string
          adjuster: string | null
          adjuster_email: string | null
          adjuster_phone: string | null
          carrier: string | null
          claim_no: string | null
          company_id: string | null
          contract_value: number | null
          created_at: string
          created_by: string | null
          customer: string
          date_of_loss: string | null
          day_of_drying: number | null
          id: string
          loss_subtype: string | null
          loss_type: string
          mitigation_value: number | null
          moisture_alerts: number | null
          mortgage_company: string | null
          notes: string | null
          payment_type: string
          phone: string | null
          pm_id: string | null
          pm_name: string | null
          priority: string | null
          recon: boolean | null
          recon_value: number | null
          scope_notes: string | null
          stage: string
          updated_at: string
        }
        Insert: {
          address?: string
          adjuster?: string | null
          adjuster_email?: string | null
          adjuster_phone?: string | null
          carrier?: string | null
          claim_no?: string | null
          company_id?: string | null
          contract_value?: number | null
          created_at?: string
          created_by?: string | null
          customer: string
          date_of_loss?: string | null
          day_of_drying?: number | null
          id: string
          loss_subtype?: string | null
          loss_type?: string
          mitigation_value?: number | null
          moisture_alerts?: number | null
          mortgage_company?: string | null
          notes?: string | null
          payment_type?: string
          phone?: string | null
          pm_id?: string | null
          pm_name?: string | null
          priority?: string | null
          recon?: boolean | null
          recon_value?: number | null
          scope_notes?: string | null
          stage?: string
          updated_at?: string
        }
        Update: {
          address?: string
          adjuster?: string | null
          adjuster_email?: string | null
          adjuster_phone?: string | null
          carrier?: string | null
          claim_no?: string | null
          company_id?: string | null
          contract_value?: number | null
          created_at?: string
          created_by?: string | null
          customer?: string
          date_of_loss?: string | null
          day_of_drying?: number | null
          id?: string
          loss_subtype?: string | null
          loss_type?: string
          mitigation_value?: number | null
          moisture_alerts?: number | null
          mortgage_company?: string | null
          notes?: string | null
          payment_type?: string
          phone?: string | null
          pm_id?: string | null
          pm_name?: string | null
          priority?: string | null
          recon?: boolean | null
          recon_value?: number | null
          scope_notes?: string | null
          stage?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_pm_id_fkey"
            columns: ["pm_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          check_number: string | null
          company_id: string | null
          created_at: string
          created_by: string | null
          customer_responsibility: number | null
          date_received: string | null
          deductible_amount: number | null
          deductible_collected: boolean | null
          id: string
          job_id: string
          mortgage_hold: boolean | null
          mortgage_hold_amount: number | null
          notes: string | null
          payment_type: string
          source: string | null
        }
        Insert: {
          amount?: number
          check_number?: string | null
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          customer_responsibility?: number | null
          date_received?: string | null
          deductible_amount?: number | null
          deductible_collected?: boolean | null
          id?: string
          job_id: string
          mortgage_hold?: boolean | null
          mortgage_hold_amount?: number | null
          notes?: string | null
          payment_type?: string
          source?: string | null
        }
        Update: {
          amount?: number
          check_number?: string | null
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          customer_responsibility?: number | null
          date_received?: string | null
          deductible_amount?: number | null
          deductible_collected?: boolean | null
          id?: string
          job_id?: string
          mortgage_hold?: boolean | null
          mortgage_hold_amount?: number | null
          notes?: string | null
          payment_type?: string
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          certs: string[] | null
          company_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          onboarding_complete: boolean | null
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          status: string | null
        }
        Insert: {
          avatar?: string | null
          certs?: string[] | null
          company_id?: string | null
          created_at?: string
          email: string
          id: string
          name: string
          onboarding_complete?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: string | null
        }
        Update: {
          avatar?: string | null
          certs?: string[] | null
          company_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          onboarding_complete?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      subcontractor_assignments: {
        Row: {
          amount: number | null
          completed_date: string | null
          created_at: string
          id: string
          job_id: string
          notes: string | null
          scheduled_date: string | null
          status: string | null
          subcontractor_id: string
          trade: string
        }
        Insert: {
          amount?: number | null
          completed_date?: string | null
          created_at?: string
          id?: string
          job_id: string
          notes?: string | null
          scheduled_date?: string | null
          status?: string | null
          subcontractor_id: string
          trade: string
        }
        Update: {
          amount?: number | null
          completed_date?: string | null
          created_at?: string
          id?: string
          job_id?: string
          notes?: string | null
          scheduled_date?: string | null
          status?: string | null
          subcontractor_id?: string
          trade?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcontractor_assignments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subcontractor_assignments_subcontractor_id_fkey"
            columns: ["subcontractor_id"]
            isOneToOne: false
            referencedRelation: "subcontractors"
            referencedColumns: ["id"]
          },
        ]
      }
      subcontractors: {
        Row: {
          company_id: string | null
          company_name: string | null
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          insurance_expiry: string | null
          license_number: string | null
          name: string
          notes: string | null
          phone: string | null
          status: string | null
          trade: string
        }
        Insert: {
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          insurance_expiry?: string | null
          license_number?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          trade?: string
        }
        Update: {
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          insurance_expiry?: string | null
          license_number?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          trade?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcontractors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      supplements: {
        Row: {
          approved_amount: number | null
          carrier_estimate_url: string | null
          carrier_total: number | null
          company_id: string | null
          contractor_estimate_url: string | null
          contractor_total: number | null
          created_at: string
          created_by: string | null
          difference: number | null
          id: string
          job_id: string
          justification: string | null
          missing_items: Json | null
          notes: string | null
          pricing_differences: Json | null
          quantity_differences: Json | null
          response_date: string | null
          scope_differences: Json | null
          status: string | null
          submitted_date: string | null
          supplement_number: number | null
          updated_at: string
        }
        Insert: {
          approved_amount?: number | null
          carrier_estimate_url?: string | null
          carrier_total?: number | null
          company_id?: string | null
          contractor_estimate_url?: string | null
          contractor_total?: number | null
          created_at?: string
          created_by?: string | null
          difference?: number | null
          id?: string
          job_id: string
          justification?: string | null
          missing_items?: Json | null
          notes?: string | null
          pricing_differences?: Json | null
          quantity_differences?: Json | null
          response_date?: string | null
          scope_differences?: Json | null
          status?: string | null
          submitted_date?: string | null
          supplement_number?: number | null
          updated_at?: string
        }
        Update: {
          approved_amount?: number | null
          carrier_estimate_url?: string | null
          carrier_total?: number | null
          company_id?: string | null
          contractor_estimate_url?: string | null
          contractor_total?: number | null
          created_at?: string
          created_by?: string | null
          difference?: number | null
          id?: string
          job_id?: string
          justification?: string | null
          missing_items?: Json | null
          notes?: string | null
          pricing_differences?: Json | null
          quantity_differences?: Json | null
          response_date?: string | null
          scope_differences?: Json | null
          status?: string | null
          submitted_date?: string | null
          supplement_number?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplements_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_company_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "owner"
        | "project_manager"
        | "estimator"
        | "office_admin"
        | "field_tech"
        | "subcontractor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "owner",
        "project_manager",
        "estimator",
        "office_admin",
        "field_tech",
        "subcontractor",
      ],
    },
  },
} as const
