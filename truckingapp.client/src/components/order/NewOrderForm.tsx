import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { CreateOrderDto, Order } from '../../types/order';

export const NewOrderForm: React.FC = () => {
    const { register, handleSubmit, reset/*, formState: { errors } */} = useForm<CreateOrderDto>();
    const navigate = useNavigate();
    const onSubmit = async (data: CreateOrderDto) => {
        try {
            const response = await api.post<Order>('/orders/create-order', data);
            alert(`Заказ №${response.data.orderNumber} успешно создан!`);
            window.location.href = '/'; 
            reset();
        } catch (error) {
            alert('Ошибка при сохранении заказа');
        }
    };

  
    const inputClass = "w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-xl shadow-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 placeholder-gray-400";
    const labelClass = "block text-sm font-bold text-gray-800 mb-1.5 ml-1";
    const sectionTitle = "md:col-span-2 text-sm font-black uppercase tracking-wider text-gray-500 mb-2 border-b-2 border-gray-100 pb-1";

    return (
        <div className="max-w-3xl mx-auto my-12 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 p-6 border-b border-gray-200">
                <h2 className="text-2xl font-black text-gray-900">Новая доставка</h2>
                <p className="text-gray-500 text-sm">Заполните данные</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
                {/* Отправитель */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={sectionTitle}>Пункт отправления</div>
                    <div>
                        <label className={labelClass}>Город</label>
                        <input {...register("senderCity", { required: true })} className={inputClass} placeholder="Откуда везем?" />
                    </div>
                    <div>
                        <label className={labelClass}>Адрес</label>
                        <input {...register("senderAddress", { required: true })} className={inputClass} placeholder="Улица, дом, склад" />
                    </div>
                </div>

                {/* Получатель */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={sectionTitle}>Пункт назначения</div>
                    <div>
                        <label className={labelClass}>Город</label>
                        <input {...register("receiverCity", { required: true })} className={inputClass} placeholder="Куда доставляем?" />
                    </div>
                    <div>
                        <label className={labelClass}>Адрес</label>
                        <input {...register("receiverAddress", { required: true })} className={inputClass} placeholder="Пункт выгрузки" />
                    </div>
                </div>

                {/* Параметры */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className={sectionTitle}>Характеристики</div>
                    <div>
                        <label className={labelClass}>Вес груза (кг)</label>
                        <input type="number" step="0.1" {...register("weight", { required: true, min: 0.1 })} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Дата забора</label>
                        <input type="date" {...register("pickupDate", { required: true })} className={inputClass} />
                    </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-black py-4 rounded-xl shadow-lg shadow-blue-200 transform active:scale-95 transition-all">
                    ОФОРМИТЬ ЗАКАЗ
                </button>
                {/* Кнопка назад */}
                <button onClick={() => navigate('/orders')} className="mb-6 text-blue-600 font-bold flex items-center gap-2">
                    ← Назад к списку
                </button>
            </form>
        </div>
    );
};

