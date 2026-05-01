import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { getApiErrorMessage } from '../../api/getApiErrorMessage';

interface LoginResponse {
    accessToken: string;
}

interface LoginFormValues {
    email: string;
    password: string;
}

export const LoginForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post<LoginResponse>('/login', data);
            localStorage.setItem('token', response.data.accessToken);
            navigate('/orders');
        } catch (err) {
            setError(getApiErrorMessage(err, 'Неверный логин или пароль'));
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100"
            >
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Вход в систему</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email / Логин</label>
                        <input
                            {...register("email", { required: "Введите email" })}
                            type="text"
                            className={inputClass}
                            placeholder="admin@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Пароль</label>
                        <input
                            {...register("password", { required: "Введите пароль" })}
                            type="password"
                            className={inputClass}
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
                    </div>

                    <button
                        disabled={isLoading}
                        type="submit"
                        className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all shadow-md
                            ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
                    >
                        {isLoading ? 'Загрузка...' : 'Войти'}
                    </button>
                    <div className="text-center pt-6 mt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Нет аккаунта?{' '}
                            <Link
                                to="/register"
                                className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                            >
                                Зарегистрироваться
                            </Link>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
};

