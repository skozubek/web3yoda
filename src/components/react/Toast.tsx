import React, { useEffect, useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { ui } from '../../i18n/ui';

export type ToastType = 'success' | 'error';

interface ToastEvent {
  messageKey: keyof typeof ui.en;
  type: ToastType;
}

interface ToastProps {
  locale: 'en' | 'pl';
}

const Toast: React.FC<ToastProps> = ({ locale }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [messageKey, setMessageKey] = useState<keyof typeof ui.en | null>(null);
  const [type, setType] = useState<ToastType>('success');

  useEffect(() => {
    const handleToast = (event: CustomEvent<ToastEvent>) => {
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

  if (!isVisible || !messageKey) return null;

  // Get the translated message
  const message = ui[locale][messageKey];

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