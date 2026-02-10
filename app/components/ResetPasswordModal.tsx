import { useState, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

interface ResetPasswordModalProps {
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
}

export default function ResetPasswordModal({
  onClose,
  onSubmit,
}: ResetPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Debounced submit handler
  const handleSubmit = useCallback(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Validate
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Email is required');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    // Set debounce timer (500ms)
    debounceTimerRef.current = setTimeout(async () => {
      setIsSubmitting(true);
      setError('');

      try {
        await onSubmit(trimmedEmail);
      } catch (err: any) {
        setError(err.message || 'Failed to send reset link');
      } finally {
        setIsSubmitting(false);
      }
    }, 500);
  }, [email, onSubmit]);

  // Clean up timer on unmount
  const handleClose = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full m-4 p-8">
        {/* Header */}
        <h2 className="text-2xl font-bold text-slate-800 mb-3 text-center">
          Reset Password
        </h2>
        <p className="text-gray-500 mb-6 text-center">
          Enter your email address to receive a password reset link.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Email Input */}
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          placeholder="Email"
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        />

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={!email.trim() || isSubmitting}
            className="px-8 py-3 bg-blue-900 text-white rounded-full font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[180px]"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Send Reset Link
          </button>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-8 py-3 border-2 border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
