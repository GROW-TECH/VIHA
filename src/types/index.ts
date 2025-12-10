export interface Client {
  id: string;
  sr_no: number;
  client_name: string;
  mobile: string;
  alternate_mobile?: string;
  city_area?: string;
  client_type: string;
  gst_no?: string;
  opening_balance: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Design {
  id: string;
  design_code: string;
  design_name: string;
  saree_type?: string;
  fabric?: string;
  colour_pattern?: string;
  default_rate: number;
  default_mrp: number;
  opening_stock: number;
  photo_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductionOrder {
  id: string;
  order_no: string;
  order_date: string;
  client_id?: string;
  design_id?: string;
  batch_lot_no?: string;
  qty_ordered: number;
  rate_per_piece: number;
  expected_delivery_date?: string;
  grey_material_issued?: string;
  status: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  design_id?: string;
  movement_date: string;
  transaction_type: string;
  batch_lot_no?: string;
  qty_in: number;
  qty_out: number;
  reference?: string;
  remarks?: string;
  created_at: string;
}

export interface ProductionStockUsed {
  id: string;
  production_order_id?: string;
  material_type: string;
  description?: string;
  qty_issued: number;
  unit: string;
  remarks?: string;
  created_at: string;
}

export interface ProductionCompletion {
  id: string;
  production_order_id?: string;
  production_date: string;
  good_pieces_produced: number;
  damaged_reject_pieces: number;
  total_material_used?: number;
  waste_qty?: number;
  waste_remarks?: string;
  final_amount?: number;
  payment_status: string;
  qr_code_url?: string;
  created_at: string;
  updated_at: string;
}
