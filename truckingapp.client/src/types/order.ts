export interface Order {
  id: number;
  orderNumber: string;
  senderCity: string;
  senderAddress: string;
  receiverCity: string;
  receiverAddress: string;
  cargoType: string;
  weight: number;
  price: number;
  pickupDate: string;
  createdAt?: string;
}

export type CargoType = 'Standard' | 'Fragile' | 'Hazardous';
export const CARGO_TYPE_LABELS: Record<CargoType, string> = {
  Standard: 'Стандартный груз',
  Fragile: 'Хрупкий груз',
  Hazardous: 'Опасный груз',
};

export type CreateOrderDto = Pick<Order,'senderCity' | 'senderAddress' | 'receiverCity' | 'receiverAddress' | 'cargoType' | 'weight' | 'pickupDate'>;
