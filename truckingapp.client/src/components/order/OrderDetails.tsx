import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { getApiErrorMessage } from '../../api/getApiErrorMessage';
import { Order } from '../../types/order';
import { formatDate } from '../../utils/formatDate';

export const OrderDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            setError('Заказ не найден');
            setIsLoading(false);
            return;
        }

        setError(null);
        setIsLoading(true);

        api.get<Order>(`/orders/${id}`)
            .then(response => setOrder(response.data))
            .catch(error => setError(getApiErrorMessage(error, 'Не удалось загрузить заказ')))
            .finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
        return <div className="p-10 text-center font-bold">Загрузка...</div>;
    }

    if (error || !order) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <button type="button" onClick={() => navigate('/orders')} className="mb-6 text-blue-600 font-bold flex items-center gap-2">
                    ← Назад к списку
                </button>
                <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                    {error ?? 'Заказ не найден'}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <button type="button" onClick={() => navigate('/orders')} className="mb-6 text-blue-600 font-bold flex items-center gap-2">
                ← Назад к списку
            </button>

            <div className="bg-white border-2 border-gray-100 rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-900 p-8 text-white rounded-t-3xl shadow-lg relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-600/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-violet-200">
                            Детали заказа
                        </h1>
                        <p className="text-violet-400 font-mono text-lg mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]"></span>
                            {order.orderNumber}
                        </p>
                    </div>
                </div>

                <div className="p-10 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <section>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Отправитель</h3>
                            <p className="text-xl font-bold text-gray-900">{order.senderCity}</p>
                            <p className="text-gray-500">{order.senderAddress}</p>
                        </section>
                        <section>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Получатель</h3>
                            <p className="text-xl font-bold text-gray-900">{order.receiverCity}</p>
                            <p className="text-gray-500">{order.receiverAddress}</p>
                        </section>
                    </div>

                    <div className="grid grid-cols-2 gap-10 border-t pt-10">
                        <section>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Вес</h3>
                            <p className="text-2xl font-black">{order.weight} кг</p>
                        </section>
                        <section>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Дата забора</h3>
                            <p className="text-2xl font-black">{formatDate(order.pickupDate)}</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};
