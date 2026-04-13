import { toast as sonnerToast } from 'sonner';

/**
 * Custom toast utility for consistent messaging across the application.
 * Utilizes Sonner for premium look and feel.
 */
export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      duration: 4000,
    });
  },
  
  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      duration: 5000,
    });
  },
  
  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      duration: 4000,
    });
  },
  
  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
      duration: 4000,
    });
  },
  
  promise: <T>(
    promise: Promise<T>,
    {
      loading = 'Loading...',
      success = 'Action completed successfully',
      error = 'Something went wrong',
    }: {
      loading?: string;
      success?: string | ((data: T) => string);
      error?: string | ((err: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
    });
  },
  
  message: (message: string, description?: string) => {
    sonnerToast(message, {
      description,
    });
  },
};
