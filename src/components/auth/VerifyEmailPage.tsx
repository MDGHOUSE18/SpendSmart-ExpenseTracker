import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      // Approach 1: token_hash in query params (our custom emailRedirectTo)
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');

      if (token_hash && type) {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as 'signup' | 'email_change' | 'recovery',
          });

          if (error) {
            setStatus('error');
            setMessage(error.message);
          } else {
            setStatus('success');
            setMessage('Your email has been verified successfully!');
            // Sign them out so they log in fresh
            await supabase.auth.signOut();
            setTimeout(() => navigate('/login', { replace: true }), 2500);
          }
        } catch {
          setStatus('error');
          setMessage('An unexpected error occurred. Please try again.');
        }
        return;
      }

      // Approach 2: Supabase {{ .ConfirmationURL }} redirects back with session in URL hash
      // The Supabase client auto-processes the hash fragment — listen for the auth event
      const hash = window.location.hash;
      if (hash && (hash.includes('access_token') || hash.includes('type=signup') || hash.includes('type=recovery'))) {
        // Supabase client picks up the hash automatically; wait for session
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
            subscription.unsubscribe();
            setStatus('success');
            setMessage('Your email has been verified successfully!');
            // Sign out so they log in properly (confirmed state)
            supabase.auth.signOut().then(() => {
              setTimeout(() => navigate('/login', { replace: true }), 2500);
            });
          }
        });

        // Fallback: if no event fires in 5s, get current session
        const timeout = setTimeout(async () => {
          subscription.unsubscribe();
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setStatus('success');
            setMessage('Your email has been verified successfully!');
            await supabase.auth.signOut();
            setTimeout(() => navigate('/login', { replace: true }), 2500);
          } else {
            setStatus('error');
            setMessage('Verification failed or link has expired. Please try again.');
          }
        }, 5000);

        return () => {
          subscription.unsubscribe();
          clearTimeout(timeout);
        };
      }

      // Approach 3: Already verified — session exists (user clicked confirm and was redirected here)
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email_confirmed_at) {
        setStatus('success');
        setMessage('Your email has been verified successfully!');
        await supabase.auth.signOut();
        setTimeout(() => navigate('/login', { replace: true }), 2500);
        return;
      }

      // Nothing matched — show error
      setStatus('error');
      setMessage('Invalid or expired verification link. Please request a new confirmation email.');
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Verifying your email
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Email verified!
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {message}
              </p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                Redirecting you to sign in...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Verification failed
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mb-6">{message}</p>
              <button
                onClick={() => navigate('/login')}
                className="py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20"
              >
                Back to login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
