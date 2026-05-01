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

export type CreateOrderDto = Pick<Order,'senderCity' | 'senderAddress' | 'receiverCity' | 'receiverAddress' | 'weight' | 'pickupDate'>;
