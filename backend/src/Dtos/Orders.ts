export interface AddOrder {
  customerName: string;
  productId: string;
  status: string;
}
export interface UpdateOrder {
  customerName?: string;
  productId?: string;
  status?: string;
}
