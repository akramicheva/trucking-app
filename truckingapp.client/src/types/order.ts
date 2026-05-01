export interface Order {

  id: number;
  orderNumber: string; 
 
  senderCity: string;
  senderAddress: string;
  

  receiverCity: string;
  receiverAddress: string;
  
  
  weight: number;
  pickupDate: string; 
  createdAt?: string;
 
}

export type CreateOrderDto = Omit<Order, 'id' | 'orderNumber' | 'createdAt'>;