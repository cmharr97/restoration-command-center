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
      jobs: {
        Row: {
          address: string
          adjuster: string | null
          adjuster_phone: string | null
          carrier: string | null
          claim_no: string | null
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
          notes: string | null
          phone: string | null
          pm_id: string | null
          pm_name: string | null
          priority: string | null
          recon: boolean | null
          recon_value: number | null
          stage: string
          updated_at: string
        }
        Insert: {
          address?: string
          adjuster?: string | null
          adjuster_phone?: string | null
          carrier?: string | null
          claim_no?: string | null
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
          notes?: string | null
          phone?: string | null
          pm_id?: string | null
          pm_name?: string | null
          priority?: string | null
          recon?: boolean | null
          recon_value?: number | null
          stage?: string
          updated_at?: string
        }
        Update: {
          address?: string
          adjuster?: string | null
          adjuster_phone?: string | null
          carrier?: string | null
          claim_no?: string | null
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
          notes?: string | null
          phone?: string | null
          pm_id?: string | null
          pm_name?: string | null
          priority?: string | null
          recon?: boolean | null
          recon_value?: number | null
          stage?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_pm_id_fkey"
            columns: ["pm_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: Json | null
          channel_id: string
          created_at: string
          id: string
          mentions: string[] | null
          sender_id: string
          sender_name: string
          text: string
        }
        Insert: {
          attachments?: Json | null
          channel_id: string
          created_at?: string
          id?: string
          mentions?: string[] | null
          sender_id: string
          sender_name: string
          text: string
        }
        Update: {
          attachments?: Json | null
          channel_id?: string
          created_at?: string
          id?: string
          mentions?: string[] | null
          sender_id?: string
          sender_name?: string
          text?: string
        }
        Relationships: []
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
