// Generated from live Supabase project Mara_vera (hctykprkwenhatbjxkpb) on 2026-09-08.
// Re-generate from Supabase when the live schema changes. Do not hand-maintain parallel DB row interfaces.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.5" }
  public: {
    Tables: {
      commerce_checkout_intents: {
        Row: { amount_minor:number; client_request_id:string; created_at:string; currency:string; id:string; metadata:Json; offer_id:string; provider:string; provider_checkout_id:string|null; provider_checkout_url:string|null; status:string; updated_at:string; user_id:string }
        Insert: { amount_minor:number; client_request_id:string; created_at?:string; currency:string; id?:string; metadata?:Json; offer_id:string; provider:string; provider_checkout_id?:string|null; provider_checkout_url?:string|null; status?:string; updated_at?:string; user_id:string }
        Update: { amount_minor?:number; client_request_id?:string; created_at?:string; currency?:string; id?:string; metadata?:Json; offer_id?:string; provider?:string; provider_checkout_id?:string|null; provider_checkout_url?:string|null; status?:string; updated_at?:string; user_id?:string }
        Relationships: []
      }
      commerce_contributions: {
        Row: { amount_minor:number; amount_visibility:string; community_alias:string|null; created_at:string; currency:string; goal_id:string; id:string; metadata:Json; offer_id:string; purchase_id:string; refunded_at:string|null; status:string; user_id:string }
        Insert: { amount_minor:number; amount_visibility?:string; community_alias?:string|null; created_at?:string; currency:string; goal_id:string; id?:string; metadata?:Json; offer_id:string; purchase_id:string; refunded_at?:string|null; status?:string; user_id:string }
        Update: { amount_minor?:number; amount_visibility?:string; community_alias?:string|null; created_at?:string; currency?:string; goal_id?:string; id?:string; metadata?:Json; offer_id?:string; purchase_id?:string; refunded_at?:string|null; status?:string; user_id?:string }
        Relationships: []
      }
      commerce_entitlements: {
        Row: { entitlement_key:string; granted_at:string; id:string; metadata:Json; offer_id:string; purchase_id:string; revoked_at:string|null; status:string; user_id:string }
        Insert: { entitlement_key:string; granted_at?:string; id?:string; metadata?:Json; offer_id:string; purchase_id:string; revoked_at?:string|null; status?:string; user_id:string }
        Update: { entitlement_key?:string; granted_at?:string; id?:string; metadata?:Json; offer_id?:string; purchase_id?:string; revoked_at?:string|null; status?:string; user_id?:string }
        Relationships: []
      }
      commerce_goals: {
        Row: { completed_at:string|null; created_at:string; currency:string; description:string; funded_amount_minor:number; id:string; metadata:Json; offer_id:string; slug:string; status:string; target_amount_minor:number; title:string; updated_at:string; visual_path:string|null; world_state_key:string }
        Insert: { completed_at?:string|null; created_at?:string; currency:string; description:string; funded_amount_minor?:number; id?:string; metadata?:Json; offer_id:string; slug:string; status?:string; target_amount_minor:number; title:string; updated_at?:string; visual_path?:string|null; world_state_key:string }
        Update: { completed_at?:string|null; created_at?:string; currency?:string; description?:string; funded_amount_minor?:number; id?:string; metadata?:Json; offer_id?:string; slug?:string; status?:string; target_amount_minor?:number; title?:string; updated_at?:string; visual_path?:string|null; world_state_key?:string }
        Relationships: []
      }
      commerce_offers: {
        Row: { amount_minor:number|null; created_at:string; creator_id:string|null; currency:string; demand_request_id:string|null; description:string; fulfillment_key:string|null; id:string; max_amount_minor:number|null; metadata:Json; min_amount_minor:number|null; offer_family:string; price_mode:string; slug:string; status:string; title:string; type:string; updated_at:string; world_id:string|null }
        Insert: { amount_minor?:number|null; created_at?:string; creator_id?:string|null; currency:string; demand_request_id?:string|null; description:string; fulfillment_key?:string|null; id?:string; max_amount_minor?:number|null; metadata?:Json; min_amount_minor?:number|null; offer_family?:string; price_mode:string; slug:string; status?:string; title:string; type:string; updated_at?:string; world_id?:string|null }
        Update: { amount_minor?:number|null; created_at?:string; creator_id?:string|null; currency?:string; demand_request_id?:string|null; description?:string; fulfillment_key?:string|null; id?:string; max_amount_minor?:number|null; metadata?:Json; min_amount_minor?:number|null; offer_family?:string; price_mode?:string; slug?:string; status?:string; title?:string; type?:string; updated_at?:string; world_id?:string|null }
        Relationships: []
      }
      commerce_purchases: {
        Row: { amount_minor:number; checkout_intent_id:string|null; created_at:string; creator_id:string|null; currency:string; fulfilled_at:string|null; id:string; metadata:Json; offer_id:string; provider:string; provider_payment_id:string; refunded_at:string|null; status:string; updated_at:string; user_id:string; world_id:string|null }
        Insert: { amount_minor:number; checkout_intent_id?:string|null; created_at?:string; creator_id?:string|null; currency:string; fulfilled_at?:string|null; id?:string; metadata?:Json; offer_id:string; provider:string; provider_payment_id:string; refunded_at?:string|null; status:string; updated_at?:string; user_id:string; world_id?:string|null }
        Update: { amount_minor?:number; checkout_intent_id?:string|null; created_at?:string; creator_id?:string|null; currency?:string; fulfilled_at?:string|null; id?:string; metadata?:Json; offer_id?:string; provider?:string; provider_payment_id?:string; refunded_at?:string|null; status?:string; updated_at?:string; user_id?:string; world_id?:string|null }
        Relationships: []
      }
      commerce_webhook_events: {
        Row: { error:string|null; event_type:string; id:string; payload_sha256:string|null; processed_at:string|null; provider:string; provider_event_id:string; received_at:string; status:string }
        Insert: { error?:string|null; event_type:string; id?:string; payload_sha256?:string|null; processed_at?:string|null; provider:string; provider_event_id:string; received_at?:string; status?:string }
        Update: { error?:string|null; event_type?:string; id?:string; payload_sha256?:string|null; processed_at?:string|null; provider?:string; provider_event_id?:string; received_at?:string; status?:string }
        Relationships: []
      }
      creator_customer_relationships: {
        Row: { attribution_source:string; created_at:string; creator_id:string; first_seen_at:string; last_activity_at:string; last_creator_action_at:string|null; updated_at:string; user_id:string }
        Insert: { attribution_source?:string; created_at?:string; creator_id:string; first_seen_at?:string; last_activity_at?:string; last_creator_action_at?:string|null; updated_at?:string; user_id:string }
        Update: { attribution_source?:string; created_at?:string; creator_id?:string; first_seen_at?:string; last_activity_at?:string; last_creator_action_at?:string|null; updated_at?:string; user_id?:string }
        Relationships: []
      }
      creator_worlds: {
        Row: { created_at:string; creator_id:string; description:string; display_name:string; id:string; persona:Json; settings:Json; slug:string; status:string; updated_at:string; visibility:string }
        Insert: { created_at?:string; creator_id:string; description?:string; display_name:string; id?:string; persona?:Json; settings?:Json; slug:string; status?:string; updated_at?:string; visibility?:string }
        Update: { created_at?:string; creator_id?:string; description?:string; display_name?:string; id?:string; persona?:Json; settings?:Json; slug?:string; status?:string; updated_at?:string; visibility?:string }
        Relationships: []
      }
      creators: {
        Row: { created_at:string; id:string; onboarding_state:string; plan:string; status:string; updated_at:string; user_id:string }
        Insert: { created_at?:string; id?:string; onboarding_state?:string; plan?:string; status?:string; updated_at?:string; user_id:string }
        Update: { created_at?:string; id?:string; onboarding_state?:string; plan?:string; status?:string; updated_at?:string; user_id?:string }
        Relationships: []
      }
      demand_request_metrics: {
        Row: { commit_count:number; commit_wtp_total_minor:number; demand_request_id:string; pledge_count:number; pledge_wtp_total_minor:number; updated_at:string; want_count:number; wtp_count:number; wtp_total_minor:number }
        Insert: { commit_count?:number; commit_wtp_total_minor?:number; demand_request_id:string; pledge_count?:number; pledge_wtp_total_minor?:number; updated_at?:string; want_count?:number; wtp_count?:number; wtp_total_minor?:number }
        Update: { commit_count?:number; commit_wtp_total_minor?:number; demand_request_id?:string; pledge_count?:number; pledge_wtp_total_minor?:number; updated_at?:string; want_count?:number; wtp_count?:number; wtp_total_minor?:number }
        Relationships: []
      }
      demand_requests: {
        Row: { category:string; created_at:string; created_by_user_id:string|null; creator_id:string; description:string; fulfillment_type:string; id:string; location_label:string|null; origin:string; privacy_mode:string; status:string; target_commitments:number; title:string; updated_at:string; world_id:string }
        Insert: { category:string; created_at?:string; created_by_user_id?:string|null; creator_id:string; description?:string; fulfillment_type:string; id?:string; location_label?:string|null; origin?:string; privacy_mode?:string; status?:string; target_commitments?:number; title:string; updated_at?:string; world_id:string }
        Update: { category?:string; created_at?:string; created_by_user_id?:string|null; creator_id?:string; description?:string; fulfillment_type?:string; id?:string; location_label?:string|null; origin?:string; privacy_mode?:string; status?:string; target_commitments?:number; title?:string; updated_at?:string; world_id?:string }
        Relationships: []
      }
      demand_signals: {
        Row: { created_at:string; currency:string|null; demand_request_id:string; privacy_mode:string; signal_level:string; updated_at:string; user_id:string; wtp_amount_minor:number|null }
        Insert: { created_at?:string; currency?:string|null; demand_request_id:string; privacy_mode?:string; signal_level:string; updated_at?:string; user_id:string; wtp_amount_minor?:number|null }
        Update: { created_at?:string; currency?:string|null; demand_request_id?:string; privacy_mode?:string; signal_level?:string; updated_at?:string; user_id?:string; wtp_amount_minor?:number|null }
        Relationships: []
      }
      launch_events: {
        Row: { amount_bucket:string|null; capricho_slug:string|null; currency:string|null; days_since_first_bucket:string|null; entry_source:string; event:string; id:string; memory_source:string|null; occurred_at:string; offer_slug:string|null; offer_type:string|null; placement:string|null; preference_group:string|null; properties:Json; provider_status:string|null; received_at:string; return_count_bucket:string|null; session_id:string|null; surface:string|null; target:string|null }
        Insert: { amount_bucket?:string|null; capricho_slug?:string|null; currency?:string|null; days_since_first_bucket?:string|null; entry_source?:string; event:string; id?:string; memory_source?:string|null; occurred_at:string; offer_slug?:string|null; offer_type?:string|null; placement?:string|null; preference_group?:string|null; properties?:Json; provider_status?:string|null; received_at?:string; return_count_bucket?:string|null; session_id?:string|null; surface?:string|null; target?:string|null }
        Update: Record<string, never>
        Relationships: []
      }
      preference_events: {
        Row: { alternative_option:string; choice_group:string; client_event_id:string; context_version:string; created_at:string; creator_id:string|null; event_type:string; id:number; selected_option:string; signal_scope:string; surface:string; user_id:string; world_id:string|null }
        Insert: { alternative_option:string; choice_group:string; client_event_id:string; context_version:string; created_at?:string; creator_id?:string|null; event_type:string; id?:never; selected_option:string; signal_scope?:string; surface:string; user_id:string; world_id?:string|null }
        Update: { alternative_option?:string; choice_group?:string; client_event_id?:string; context_version?:string; created_at?:string; creator_id?:string|null; event_type?:string; id?:never; selected_option?:string; signal_scope?:string; surface?:string; user_id?:string; world_id?:string|null }
        Relationships: []
      }
      profiles: {
        Row: { alias:string|null; created_at:string; id:string; updated_at:string }
        Insert: { alias?:string|null; created_at?:string; id:string; updated_at?:string }
        Update: { alias?:string|null; created_at?:string; id?:string; updated_at?:string }
        Relationships: []
      }
      relationship_state: {
        Row: { first_seen_at:string|null; last_private_offer_at:string|null; last_private_session_at:string|null; last_ritual_completed_at:string|null; last_ritual_key:string|null; last_seen_at:string|null; last_visual_choice:string|null; launch_completed:boolean; preferred_private_style:string|null; private_session_count:number; return_count:number; updated_at:string; user_id:string }
        Insert: { first_seen_at?:string|null; last_private_offer_at?:string|null; last_private_session_at?:string|null; last_ritual_completed_at?:string|null; last_ritual_key?:string|null; last_seen_at?:string|null; last_visual_choice?:string|null; launch_completed?:boolean; preferred_private_style?:string|null; private_session_count?:number; return_count?:number; updated_at?:string; user_id:string }
        Update: { first_seen_at?:string|null; last_private_offer_at?:string|null; last_private_session_at?:string|null; last_ritual_completed_at?:string|null; last_ritual_key?:string|null; last_seen_at?:string|null; last_visual_choice?:string|null; launch_completed?:boolean; preferred_private_style?:string|null; private_session_count?:number; return_count?:number; updated_at?:string; user_id?:string }
        Relationships: []
      }
      user_declared_preferences: {
        Row: { created_at:string; creator_id:string|null; creator_visible:boolean; id:string; last_confirmed_at:string; preference_type:string; scope:string; source:string; updated_at:string; user_id:string; value_text:string; world_id:string|null }
        Insert: { created_at?:string; creator_id?:string|null; creator_visible?:boolean; id?:string; last_confirmed_at?:string; preference_type:string; scope:string; source?:string; updated_at?:string; user_id:string; value_text:string; world_id?:string|null }
        Update: { created_at?:string; creator_id?:string|null; creator_visible?:boolean; id?:string; last_confirmed_at?:string; preference_type?:string; scope?:string; source?:string; updated_at?:string; user_id?:string; value_text?:string; world_id?:string|null }
        Relationships: []
      }
      user_world_knowledge: {
        Row: { discovered_at:string; fact_key:string; source_key:string; user_id:string }
        Insert: { discovered_at?:string; fact_key:string; source_key:string; user_id:string }
        Update: { discovered_at?:string; fact_key?:string; source_key?:string; user_id?:string }
        Relationships: []
      }
    }
    Views: {
      creator_customer_summary: { Row: { alias:string|null; attribution_source:string|null; creator_gmv_minor:number|null; creator_id:string|null; first_purchase_at:string|null; first_seen_at:string|null; fulfilled_purchase_count:number|null; last_activity_at:string|null; last_creator_action_at:string|null; last_fulfillment_at:string|null; last_purchase_at:string|null; lifecycle_stage:string|null; purchase_count:number|null; user_id:string|null }; Relationships: [] }
      creator_demand_opportunities: { Row: { average_commit_wtp_minor:number|null; category:string|null; commit_count:number|null; creator_id:string|null; demand_request_id:string|null; fulfillment_type:string|null; pledge_count:number|null; pledged_demand_gmv_minor:number|null; progress_percent:number|null; status:string|null; target_commitments:number|null; title:string|null; updated_at:string|null; verified_demand_gmv_minor:number|null; want_count:number|null; world_id:string|null; wtp_count:number|null; wtp_total_minor:number|null }; Relationships: [] }
      creator_next_best_actions: { Row: { action:string|null; creator_id:string|null; evidence:Json|null; priority:string|null; reason:string|null; user_id:string|null }; Relationships: [] }
      user_activity_history: { Row: { creator_id:string|null; event_at:string|null; event_type:string|null; metadata:Json|null; object_id:string|null; user_id:string|null; world_id:string|null }; Relationships: [] }
    }
    Functions: {
      complete_mara_creator_fulfillment: { Args:{ p_purchase_id:string }; Returns:{ fulfilled_at:string; purchase_id:string }[] }
      complete_mara_ritual: { Args:{ p_ritual_key:string }; Returns:{ last_ritual_completed_at:string; last_ritual_key:string }[] }
      fulfill_mara_commerce_checkout: { Args:{ p_amount_minor:number; p_currency:string; p_event_type?:string; p_payload_sha256?:string; p_provider:string; p_provider_checkout_id:string; p_provider_event_id:string; p_provider_payment_id:string }; Returns:string }
      mark_private_offer_shown: { Args:never; Returns:{ last_private_offer_at:string; last_private_session_at:string; preferred_private_style:string; private_session_count:number }[] }
      merge_mara_relationship_state: { Args:{ p_first_seen_at:string; p_last_seen_at:string; p_last_visual_choice:string; p_launch_completed:boolean; p_return_count:number }; Returns:undefined }
      record_private_moment: { Args:{ p_style:string }; Returns:{ last_private_offer_at:string; last_private_session_at:string; preferred_private_style:string; private_session_count:number }[] }
      record_sofi_found_footage: { Args:never; Returns:{ discovered_at:string; fact_key:string; source_key:string }[] }
      refund_mara_commerce_purchase: { Args:{ p_payload_sha256?:string; p_provider:string; p_provider_event_id:string; p_provider_payment_id:string }; Returns:string }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends { Row: infer R } ? R : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends { Row: infer R } ? R : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals } ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends { Insert: infer I } ? I : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends { Insert: infer I } ? I : never : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals } ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends { Update: infer U } ? U : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends { Update: infer U } ? U : never : never

export const Constants = { public: { Enums: {} } } as const
