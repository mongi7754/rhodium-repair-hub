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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action_type: string
          created_at: string
          details: Json | null
          employee_id: string | null
          employee_name: string
          entity_id: string | null
          entity_type: string
          id: string
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          details?: Json | null
          employee_id?: string | null
          employee_name?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          details?: Json | null
          employee_id?: string | null
          employee_name?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_insights: {
        Row: {
          action_url: string | null
          created_at: string
          description: string
          id: string
          insight_type: string
          is_dismissed: boolean
          is_read: boolean
          metadata: Json | null
          priority: string
          title: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          description?: string
          id?: string
          insight_type?: string
          is_dismissed?: boolean
          is_read?: boolean
          metadata?: Json | null
          priority?: string
          title?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          description?: string
          id?: string
          insight_type?: string
          is_dismissed?: boolean
          is_read?: boolean
          metadata?: Json | null
          priority?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          total_spent: number
          updated_at: string
          user_id: string
          visit_count: number
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          total_spent?: number
          updated_at?: string
          user_id: string
          visit_count?: number
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          total_spent?: number
          updated_at?: string
          user_id?: string
          visit_count?: number
        }
        Relationships: []
      }
      deliveries: {
        Row: {
          created_at: string
          customer_name: string
          customer_phone: string | null
          delivered_at: string | null
          delivery_address: string | null
          id: string
          notes: string | null
          photo_url: string | null
          qr_verified: boolean
          receiver_name: string | null
          signature_url: string | null
          status: string
          trip_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_name?: string
          customer_phone?: string | null
          delivered_at?: string | null
          delivery_address?: string | null
          id?: string
          notes?: string | null
          photo_url?: string | null
          qr_verified?: boolean
          receiver_name?: string | null
          signature_url?: string | null
          status?: string
          trip_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          customer_phone?: string | null
          delivered_at?: string | null
          delivery_address?: string | null
          id?: string
          notes?: string | null
          photo_url?: string | null
          qr_verified?: boolean
          receiver_name?: string | null
          signature_url?: string | null
          status?: string
          trip_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      discounts: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean
          min_purchase: number
          name: string
          start_date: string | null
          type: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          min_purchase?: number
          name: string
          start_date?: string | null
          type?: string
          user_id: string
          value?: number
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          min_purchase?: number
          name?: string
          start_date?: string | null
          type?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      driver_events: {
        Row: {
          created_at: string
          details: Json | null
          driver_id: string | null
          event_type: string
          id: string
          lat: number | null
          lng: number | null
          severity: string
          speed: number | null
          trip_id: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          driver_id?: string | null
          event_type: string
          id?: string
          lat?: number | null
          lng?: number | null
          severity?: string
          speed?: number | null
          trip_id?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          driver_id?: string | null
          event_type?: string
          id?: string
          lat?: number | null
          lng?: number | null
          severity?: string
          speed?: number | null
          trip_id?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_events_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "fleet_drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_events_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_events_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          pin: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          pin: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          pin?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          description: string
          expense_date: string
          id: string
          user_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          description: string
          expense_date?: string
          id?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          description?: string
          expense_date?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      fleet_alerts: {
        Row: {
          alert_type: string
          created_at: string
          description: string
          details: Json | null
          driver_id: string | null
          id: string
          is_resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          title: string
          trip_id: string | null
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string
          description?: string
          details?: Json | null
          driver_id?: string | null
          id?: string
          is_resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          title: string
          trip_id?: string | null
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string
          description?: string
          details?: Json | null
          driver_id?: string | null
          id?: string
          is_resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          title?: string
          trip_id?: string | null
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fleet_alerts_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "fleet_drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleet_alerts_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleet_alerts_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      fleet_drivers: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          license_expiry: string | null
          license_number: string | null
          name: string
          phone: string | null
          pin: string
          safety_score: number
          status: string
          total_distance: number
          total_trips: number
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          license_expiry?: string | null
          license_number?: string | null
          name: string
          phone?: string | null
          pin?: string
          safety_score?: number
          status?: string
          total_distance?: number
          total_trips?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          license_expiry?: string | null
          license_number?: string | null
          name?: string
          phone?: string | null
          pin?: string
          safety_score?: number
          status?: string
          total_distance?: number
          total_trips?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      fraud_alerts: {
        Row: {
          alert_type: string
          created_at: string
          description: string
          details: Json | null
          employee_id: string | null
          employee_name: string
          id: string
          is_resolved: boolean
          resolved_at: string | null
          severity: string
          title: string
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          description: string
          details?: Json | null
          employee_id?: string | null
          employee_name?: string
          id?: string
          is_resolved?: boolean
          resolved_at?: string | null
          severity?: string
          title: string
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          description?: string
          details?: Json | null
          employee_id?: string | null
          employee_name?: string
          id?: string
          is_resolved?: boolean
          resolved_at?: string | null
          severity?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fraud_alerts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_logs: {
        Row: {
          created_at: string
          driver_id: string | null
          fuel_amount: number
          fuel_cost: number
          fuel_type: string | null
          id: string
          log_type: string
          logged_at: string
          notes: string | null
          odometer_reading: number | null
          receipt_url: string | null
          station_name: string | null
          trip_id: string | null
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string
          driver_id?: string | null
          fuel_amount?: number
          fuel_cost?: number
          fuel_type?: string | null
          id?: string
          log_type?: string
          logged_at?: string
          notes?: string | null
          odometer_reading?: number | null
          receipt_url?: string | null
          station_name?: string | null
          trip_id?: string | null
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string
          driver_id?: string | null
          fuel_amount?: number
          fuel_cost?: number
          fuel_type?: string | null
          id?: string
          log_type?: string
          logged_at?: string
          notes?: string | null
          odometer_reading?: number | null
          receipt_url?: string | null
          station_name?: string | null
          trip_id?: string | null
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fuel_logs_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "fleet_drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_logs_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_logs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      geofences: {
        Row: {
          center_lat: number
          center_lng: number
          created_at: string
          fence_type: string
          id: string
          is_active: boolean
          name: string
          radius_meters: number
          user_id: string
        }
        Insert: {
          center_lat: number
          center_lng: number
          created_at?: string
          fence_type?: string
          id?: string
          is_active?: boolean
          name: string
          radius_meters?: number
          user_id: string
        }
        Update: {
          center_lat?: number
          center_lng?: number
          created_at?: string
          fence_type?: string
          id?: string
          is_active?: boolean
          name?: string
          radius_meters?: number
          user_id?: string
        }
        Relationships: []
      }
      maintenance_records: {
        Row: {
          completed_at: string | null
          cost: number
          created_at: string
          description: string
          id: string
          maintenance_type: string
          next_service_date: string | null
          odometer_at_service: number | null
          service_provider: string | null
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          completed_at?: string | null
          cost?: number
          created_at?: string
          description?: string
          id?: string
          maintenance_type?: string
          next_service_date?: string | null
          odometer_at_service?: number | null
          service_provider?: string | null
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          completed_at?: string | null
          cost?: number
          created_at?: string
          description?: string
          id?: string
          maintenance_type?: string
          next_service_date?: string | null
          odometer_at_service?: number | null
          service_provider?: string | null
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          account_reference: string
          amount: number
          checkout_request_id: string | null
          created_at: string
          id: string
          merchant_request_id: string | null
          mpesa_receipt_number: string | null
          result_code: string | null
          result_desc: string | null
          status: string
          transaction_date: string | null
          transaction_desc: string | null
          updated_at: string
          user_phone: string
        }
        Insert: {
          account_reference: string
          amount: number
          checkout_request_id?: string | null
          created_at?: string
          id?: string
          merchant_request_id?: string | null
          mpesa_receipt_number?: string | null
          result_code?: string | null
          result_desc?: string | null
          status?: string
          transaction_date?: string | null
          transaction_desc?: string | null
          updated_at?: string
          user_phone: string
        }
        Update: {
          account_reference?: string
          amount?: number
          checkout_request_id?: string | null
          created_at?: string
          id?: string
          merchant_request_id?: string | null
          mpesa_receipt_number?: string | null
          result_code?: string | null
          result_desc?: string | null
          status?: string
          transaction_date?: string | null
          transaction_desc?: string | null
          updated_at?: string
          user_phone?: string
        }
        Relationships: []
      }
      pos_sessions: {
        Row: {
          created_at: string
          customer_name: string | null
          customer_phone: string | null
          discount: number
          id: string
          items: Json
          notes: string | null
          payment_method: string | null
          payment_status: string
          receipt_number: string | null
          subtotal: number
          tax: number
          total: number
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          discount?: number
          id?: string
          items?: Json
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          receipt_number?: string | null
          subtotal?: number
          tax?: number
          total?: number
          user_id: string
        }
        Update: {
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          discount?: number
          id?: string
          items?: Json
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          receipt_number?: string | null
          subtotal?: number
          tax?: number
          total?: number
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          buying_price: number
          category: string | null
          created_at: string
          id: string
          name: string
          reorder_level: number
          selling_price: number
          stock_quantity: number
          supplier_id: string | null
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          buying_price?: number
          category?: string | null
          created_at?: string
          id?: string
          name: string
          reorder_level?: number
          selling_price?: number
          stock_quantity?: number
          supplier_id?: string | null
          unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          buying_price?: number
          category?: string | null
          created_at?: string
          id?: string
          name?: string
          reorder_level?: number
          selling_price?: number
          stock_quantity?: number
          supplier_id?: string | null
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          business_name: string
          created_at: string
          full_name: string
          id: string
          language_preference: string | null
          phone: string | null
          pin_code: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_name?: string
          created_at?: string
          full_name?: string
          id?: string
          language_preference?: string | null
          phone?: string | null
          pin_code?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_name?: string
          created_at?: string
          full_name?: string
          id?: string
          language_preference?: string | null
          phone?: string | null
          pin_code?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      returns: {
        Row: {
          created_at: string
          customer_id: string | null
          id: string
          product_name: string
          quantity: number
          reason: string | null
          refund_amount: number
          resolved_at: string | null
          sale_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
          product_name: string
          quantity?: number
          reason?: string | null
          refund_amount?: number
          resolved_at?: string | null
          sale_id?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
          product_name?: string
          quantity?: number
          reason?: string | null
          refund_amount?: number
          resolved_at?: string | null
          sale_id?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "returns_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_items: {
        Row: {
          created_at: string
          discount_amount: number
          id: string
          product_id: string | null
          product_name: string
          quantity: number
          sale_id: string
          total: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          discount_amount?: number
          id?: string
          product_id?: string | null
          product_name: string
          quantity?: number
          sale_id: string
          total: number
          unit_price: number
        }
        Update: {
          created_at?: string
          discount_amount?: number
          id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          sale_id?: string
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          created_at: string
          customer_id: string | null
          customer_name: string | null
          discount_amount: number
          id: string
          logged_via: string | null
          notes: string | null
          payment_method: string | null
          product_id: string | null
          product_name: string
          quantity: number
          sale_date: string
          status: string
          total_amount: number
          unit_price: number
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          discount_amount?: number
          id?: string
          logged_via?: string | null
          notes?: string | null
          payment_method?: string | null
          product_id?: string | null
          product_name: string
          quantity?: number
          sale_date?: string
          status?: string
          total_amount: number
          unit_price: number
          user_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          discount_amount?: number
          id?: string
          logged_via?: string | null
          notes?: string | null
          payment_method?: string | null
          product_id?: string | null
          product_name?: string
          quantity?: number
          sale_date?: string
          status?: string
          total_amount?: number
          unit_price?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          company: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trip_waypoints: {
        Row: {
          fuel_level: number | null
          heading: number | null
          id: string
          lat: number
          lng: number
          recorded_at: string
          speed: number | null
          trip_id: string
        }
        Insert: {
          fuel_level?: number | null
          heading?: number | null
          id?: string
          lat: number
          lng: number
          recorded_at?: string
          speed?: number | null
          trip_id: string
        }
        Update: {
          fuel_level?: number | null
          heading?: number | null
          id?: string
          lat?: number
          lng?: number
          recorded_at?: string
          speed?: number | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_waypoints_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          actual_distance: number | null
          actual_fuel: number | null
          cargo_type: string | null
          cargo_weight: number | null
          created_at: string
          destination_lat: number | null
          destination_lng: number | null
          destination_name: string
          driver_id: string | null
          driver_pin_verified: boolean
          end_time: string | null
          estimated_arrival: string | null
          id: string
          notes: string | null
          origin_lat: number | null
          origin_lng: number | null
          origin_name: string
          planned_distance: number | null
          planned_fuel: number | null
          qr_code_data: string
          qr_scanned: boolean
          start_time: string | null
          status: string
          trip_code: string
          updated_at: string
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          actual_distance?: number | null
          actual_fuel?: number | null
          cargo_type?: string | null
          cargo_weight?: number | null
          created_at?: string
          destination_lat?: number | null
          destination_lng?: number | null
          destination_name?: string
          driver_id?: string | null
          driver_pin_verified?: boolean
          end_time?: string | null
          estimated_arrival?: string | null
          id?: string
          notes?: string | null
          origin_lat?: number | null
          origin_lng?: number | null
          origin_name?: string
          planned_distance?: number | null
          planned_fuel?: number | null
          qr_code_data?: string
          qr_scanned?: boolean
          start_time?: string | null
          status?: string
          trip_code: string
          updated_at?: string
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          actual_distance?: number | null
          actual_fuel?: number | null
          cargo_type?: string | null
          cargo_weight?: number | null
          created_at?: string
          destination_lat?: number | null
          destination_lng?: number | null
          destination_name?: string
          driver_id?: string | null
          driver_pin_verified?: boolean
          end_time?: string | null
          estimated_arrival?: string | null
          id?: string
          notes?: string | null
          origin_lat?: number | null
          origin_lng?: number | null
          origin_name?: string
          planned_distance?: number | null
          planned_fuel?: number | null
          qr_code_data?: string
          qr_scanned?: boolean
          start_time?: string | null
          status?: string
          trip_code?: string
          updated_at?: string
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trips_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "fleet_drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
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
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          assigned_driver_id: string | null
          created_at: string
          current_fuel_level: number
          fuel_capacity: number
          fuel_type: string
          gps_device_id: string | null
          id: string
          insurance_expiry: string | null
          last_lat: number | null
          last_lng: number | null
          last_location_update: string | null
          make: string
          model: string
          notes: string | null
          odometer: number
          plate_number: string
          service_due_date: string | null
          status: string
          updated_at: string
          user_id: string
          vehicle_type: string
          year: number | null
        }
        Insert: {
          assigned_driver_id?: string | null
          created_at?: string
          current_fuel_level?: number
          fuel_capacity?: number
          fuel_type?: string
          gps_device_id?: string | null
          id?: string
          insurance_expiry?: string | null
          last_lat?: number | null
          last_lng?: number | null
          last_location_update?: string | null
          make?: string
          model?: string
          notes?: string | null
          odometer?: number
          plate_number: string
          service_due_date?: string | null
          status?: string
          updated_at?: string
          user_id: string
          vehicle_type?: string
          year?: number | null
        }
        Update: {
          assigned_driver_id?: string | null
          created_at?: string
          current_fuel_level?: number
          fuel_capacity?: number
          fuel_type?: string
          gps_device_id?: string | null
          id?: string
          insurance_expiry?: string | null
          last_lat?: number | null
          last_lng?: number | null
          last_location_update?: string | null
          make?: string
          model?: string
          notes?: string | null
          odometer?: number
          plate_number?: string
          service_due_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          vehicle_type?: string
          year?: number | null
        }
        Relationships: []
      }
      wallet_accounts: {
        Row: {
          account_type: string
          balance: number
          created_at: string
          currency: string
          id: string
          split_percentage: number
          updated_at: string
          user_id: string
        }
        Insert: {
          account_type?: string
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          split_percentage?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          account_type?: string
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          split_percentage?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          account_id: string | null
          amount: number
          category: string
          created_at: string
          description: string | null
          id: string
          is_auto_detected: boolean
          payment_method: string | null
          reference: string | null
          status: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount?: number
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_auto_detected?: boolean
          payment_method?: string | null
          reference?: string | null
          status?: string
          transaction_type?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_auto_detected?: boolean
          payment_method?: string | null
          reference?: string | null
          status?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "wallet_accounts"
            referencedColumns: ["id"]
          },
        ]
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
      app_role: "owner" | "manager" | "cashier"
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
      app_role: ["owner", "manager", "cashier"],
    },
  },
} as const
