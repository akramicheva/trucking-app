import type { AxiosError } from 'axios';

type ProblemDetails = {
  title?: string;
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
};

export function getApiErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<ProblemDetails>;
  const data = axiosError.response?.data;

  if (!data) {
    return fallback;
  }

  const firstValidationError = data.errors
    ? Object.values(data.errors).flat()[0]
    : undefined;

  return data.detail ?? firstValidationError ?? data.message ?? data.title ?? fallback;
}
