import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance.ts';
import { getApiErrorMessage } from '../../api/getApiErrorMessage';
import { Order } from '../../types/order';
import { formatDate } from '../../utils/formatDate';

export const OrdersList: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadOrders = useCallback(async () => {
        setError(null);

        try {
            const response = await api.get<Order[]>('/orders');
            setOrders(response.data);
        } catch (error) {
            setError(getApiErrorMessage(error, 'Не удалось загрузить список заказов'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    if (isLoading) {
        return <div className="text-center p-10 font-bold text-gray-500">Загрузка...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Заказы на доставку</h2>
                    <p className="text-gray-500">Всего активных заказов: {orders.length}</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        type="button"
                        onClick={loadOrders}
                        aria-label="Обновить список"
                        className="p-2.5 bg-white border-2 border-gray-200 text-gray-400 hover:border-blue-500 hover:text-blue-600 rounded-xl transition-all active:scale-95 shadow-sm"
                        title="Обновить список"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>

                    <Link
                        to="/create"
                        className="flex items-center gap-2 bg-white border-2 border-slate-800 text-slate-800 hover:bg-indigo-600 hover:text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95"
                    >
                        <span>+ НОВЫЙ ЗАКАЗ</span>
                    </Link>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map(order => (
                    <div
                        key={order.id}
                        className="group bg-white border-2 border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="mb-4">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Заказ №</span>
                            <div className="text-lg font-mono font-black text-blue-600">{order.orderNumber}</div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full bg-gray-300 ring-4 ring-gray-50"></div>
                                <div>
                                    <div className="text-xs text-gray-400 font-bold uppercase">Откуда</div>
                                    <div className="text-sm font-semibold text-gray-800">{order.senderCity}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-50"></div>
                                <div>
                                    <div className="text-xs text-gray-400 font-bold uppercase">Куда</div>
                                    <div className="text-sm font-semibold text-gray-800">{order.receiverCity}</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                            <div>
                                <div className="text-xs text-gray-400 font-bold uppercase">Вес</div>
                                <div className="text-sm font-black text-gray-700">{order.weight} кг</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-400 font-bold uppercase">Дата</div>
                                <div className="text-sm font-black text-gray-700">{formatDate(order.pickupDate)}</div>
                            </div>
                        </div>

                        <Link
                            to={`/order/${order.id}`}
                            className="flex items-center justify-center gap-2 w-full py-3 mt-6 bg-gray-50 text-gray-400 border-2 border-transparent rounded-xl opacity-70 scale-[0.98] transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 group-hover:shadow-lg"
                        >
                            <span className="font-black text-sm tracking-wide">ПОДРОБНЕЕ</span>
                            <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>
                ))}
            </div>

            {!error && orders.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold">Список заказов пуст</p>
                </div>
            )}
        </div>
    );
};
