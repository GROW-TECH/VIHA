// src/types.ts
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

export interface Product {
  id: string;
  sr_no: number;
  productCode: string;
  productName: string;
  description: string;
  colorCode: string;
  quantity: string;
}

export interface Purchase {
  id: string;
  productId?: string;
  date: string;
  productCode: string;
  productName: string;
  description?: string;
  colorCode?: string;
  quantity: string;
}
