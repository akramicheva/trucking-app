import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import { getApiErrorMessage } from '../../api/getApiErrorMessage';

interface RegisterFormValues {
    email: string;
    password: string;
    confirmPassword: string;
}

export const RegisterForm: React.FC = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValues>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const password = watch("password");

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            await api.post('/register', {
                email: data.email,
                password: data.password
            });

            navigate('/login');
        } catch (err) {
            setError(getApiErrorMessage(err, 'Не удалось зарегистрироваться'));
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder-gray-400";
    const labelClass = "block text-sm font-bold text-gray-700 mb-1 ml-1";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-900 p-8 text-white rounded-t-3xl shadow-lg relative overflow-hidden">
                    <h2 className="text-2xl font-black uppercase tracking-tight">Регистрация</h2>
                    <p className="text-slate-400 text-sm mt-1">Создайте аккаунт для управления перевозками</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className={labelClass}>Email</label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "Email обязателен",
                                pattern: { value: /^\S+@\S+$/i, message: "Некорректный формат email" }
                            })}
                            className={inputClass}
                            placeholder="mail@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Пароль</label>
                        <input
                            type="password"
                            {...register("password", {
                                required: "Придумайте пароль",
                                minLength: { value: 6, message: "Минимум 6 символов" }
                            })}
                            className={inputClass}
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Подтвердите пароль</label>
                        <input
                            type="password"
                            {...register("confirmPassword", {
                                required: "Повторите пароль",
                                validate: value => value === password || "Пароли не совпадают"
                            })}
                            className={inputClass}
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message as string}</p>}
                    </div>

                    <button
                        disabled={isLoading}
                        type="submit"
                        className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all transform active:scale-95
                            ${isLoading ? 'bg-gray-400' : 'bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-900 hover:bg-slate-900 shadow-slate-200'}`}
                    >
                        {isLoading ? 'СОЗДАНИЕ...' : 'ЗАРЕГИСТРИРОВАТЬСЯ'}
                    </button>

                    <div className="text-center pt-4">
                        <span className="text-sm text-gray-500">Уже есть аккаунт? </span>
                        <Link to="/login" className="text-sm font-bold text-indigo-600 hover:underline">Войти</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
