// src/components/react/Toast.tsx
import React, { useEffect, useState } from 'react';
import type { SupportedLanguages } from '@/i18n/i18n-config';

export type ToastType = 'success' | 'error';

export interface ToastEvent {
  detail: {
    messageKey: string;
    type: ToastType;
  }
}

interface ToastProps {
  'data-locale': SupportedLanguages;
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )}
        <p className="text-white font-medium">{message}</p>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 text-white hover:text-gray-200 transition-colors"
          aria-label="Close notification"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;