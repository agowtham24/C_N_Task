export interface AddProduct {
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface UpdateProduct {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
}
