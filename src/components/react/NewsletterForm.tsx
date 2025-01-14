// src/components/react/NewsletterForm.tsx
import React, { useState } from 'react';
import type { ToastEvent } from './Toast';

interface NewsletterFormProps {
  translations: {
    title: string;
    description: string;
    placeholder: string;
    button: string;
  };
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ translations }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.currentTarget;
    const email = new FormData(form).get('email') as string;

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      const event = new CustomEvent<ToastEvent['detail']>('show-toast', {
        detail: {
          messageKey: data.success 
            ? 'newsletter.toast.success'
            : data.error === 'Please provide a valid email address'
              ? 'newsletter.toast.error.invalid'
              : data.error === 'Server configuration error'
                ? 'newsletter.toast.error.server'
                : 'newsletter.toast.error.general',
          type: data.success ? 'success' : 'error'
        }
      });
      window.dispatchEvent(event);

      if (data.success) {
        form.reset();
      }
    } catch (error) {
      window.dispatchEvent(new CustomEvent<ToastEvent['detail']>('show-toast', {
        detail: {
          messageKey: 'newsletter.toast.error.general',
          type: 'error'
        }
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="font-bold mb-4">{translations.title}</h3>
      <p className="text-gray-400 mb-4">{translations.description}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <input
            type="email"
            name="email"
            required
            placeholder={translations.placeholder}
            className="flex-1 px-4 py-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-white"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {translations.button}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsletterForm;