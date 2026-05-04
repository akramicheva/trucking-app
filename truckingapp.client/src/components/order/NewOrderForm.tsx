import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { getApiErrorMessage } from '../../api/getApiErrorMessage';
import { CreateOrderDto, Order } from '../../types/order';
import { getTodayInputValue } from '../../utils/formatDate';

export const NewOrderForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateOrderDto>();
    const navigate = useNavigate();
    const [error, setError] = React.useState<string | null>(null);
    const minPickupDate = getTodayInputValue();

    const onSubmit = async (data: CreateOrderDto) => {
        setError(null);

        try {
            await api.post<Order>('/orders', data);
            navigate('/orders');
        } catch (error) {
            setError(getApiErrorMessage(error, 'Ошибка при сохранении заказа'));
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
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={sectionTitle}>Пункт отправления</div>
                    <div>
                        <label className={labelClass}>Город</label>
                        <input
                            {...register("senderCity", { required: "Укажите город отправления" })}
                            className={inputClass}
                            placeholder="Откуда везем?"
                        />
                        {errors.senderCity && <p className="text-red-500 text-xs mt-1">{errors.senderCity.message}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>Адрес</label>
                        <input
                            {...register("senderAddress", { required: "Укажите адрес отправления" })}
                            className={inputClass}
                            placeholder="Улица, дом, склад"
                        />
                        {errors.senderAddress && <p className="text-red-500 text-xs mt-1">{errors.senderAddress.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={sectionTitle}>Пункт назначения</div>
                    <div>
                        <label className={labelClass}>Город</label>
                        <input
                            {...register("receiverCity", { required: "Укажите город назначения" })}
                            className={inputClass}
                            placeholder="Куда доставляем?"
                        />
                        {errors.receiverCity && <p className="text-red-500 text-xs mt-1">{errors.receiverCity.message}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>Адрес</label>
                        <input
                            {...register("receiverAddress", { required: "Укажите адрес назначения" })}
                            className={inputClass}
                            placeholder="Пункт выгрузки"
                        />
                        {errors.receiverAddress && <p className="text-red-500 text-xs mt-1">{errors.receiverAddress.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className={sectionTitle}>Характеристики</div>
                    <div>
                        <label className={labelClass}>Вес груза (кг)</label>
                        <input
                            type="number"
                            step="0.1"
                            {...register("weight", {
                                required: "Укажите вес",
                                min: { value: 0.1, message: "Вес должен быть больше нуля" },
                                valueAsNumber: true
                            })}
                            className={inputClass}
                        />
                        {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>Дата забора</label>
                        <input
                            type="date"
                            min={minPickupDate}
                            {...register("pickupDate", {
                                required: "Укажите дату забора",
                                validate: value => value >= minPickupDate || "Дата забора не может быть в прошлом"
                            })}
                            className={inputClass}
                        />
                        {errors.pickupDate && <p className="text-red-500 text-xs mt-1">{errors.pickupDate.message}</p>}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full font-black py-4 rounded-xl shadow-lg transform active:scale-95 transition-all text-white
                        ${isSubmitting ? 'bg-gray-400 shadow-gray-100 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
                >
                    {isSubmitting ? 'СОХРАНЯЕМ...' : 'ОФОРМИТЬ ЗАКАЗ'}
                </button>
                <button type="button" onClick={() => navigate('/orders')} className="mb-6 text-blue-600 font-bold flex items-center gap-2">
                    ← Назад к списку
                </button>
            </form>
        </div>
    );
};
