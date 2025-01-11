// src/components/react/Toast.tsx
import React, { useEffect, useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'error';

export interface ToastEvent {
  detail: {
    messageKey: string;
    type: ToastType;
  }
}

interface ToastProps {
  'data-locale': 'en' | 'pl';
  translations: Record<string, any>;
}

const Toast: React.FC<ToastProps> = ({ 'data-locale': locale, translations }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [messageKey, setMessageKey] = useState<string | null>(null);
  const [type, setType] = useState<ToastType>('success');

  useEffect(() => {
    const handleToast = (event: CustomEvent<ToastEvent['detail']>) => {
      setMessageKey(event.detail.messageKey);
      setType(event.detail.type);
      setIsVisible(true);
    };

    window.addEventListener('show-toast', handleToast as EventListener);

    return () => {
      window.removeEventListener('show-toast', handleToast as EventListener);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible || !messageKey || !translations) return null;

  // Get the message from nested keys
  const message = messageKey.split('.').reduce((obj: any, key: string) => obj?.[key], translations);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
          type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}
      >
        {type === 'success' ? (
          <Check className="w-5 h-5 text-white" />
        ) : (
          <AlertCircle className="w-5 h-5 text-white" />
        )}
        <p className="text-white font-medium">{message}</p>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 text-white hover:text-gray-200 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;