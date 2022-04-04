export interface PatchDeliveryDto {
  driver_id?: string;
  order_accept_time?: string;
  customer_id?: string;
  business_name?: string;
  base_pay?: number;
  order_subtotal?: number;
  driver_tip?: number;
  pick_up_time?: string;
  drop_off_time?: string;
}