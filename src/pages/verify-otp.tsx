import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "@/components/auth/AuthLayout";
import { AuthInput, AuthPrimaryButton, AuthGhostButton } from "@/components/auth/AuthFields";

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location as any;
  const emailFromState = state?.email ?? "";
  const search = typeof location?.search === 'string' ? location.search : '';
  const redirectParam = new URLSearchParams(search).get('redirect') ?? (location?.state as any)?.redirect ?? '/dashboard';

  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { verifyOtp, login } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // If email wasn't provided via state, try to read from localStorage
    if (!email) {
      const stored = localStorage.getItem('scolagest-auth-user') || localStorage.getItem('user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setEmail(parsed?.email || parsed?.username || '');
        } catch {}
      }
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || otp.length < 4) {
      toast({ title: 'Invalid code', description: 'Enter the verification code.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const res = await verifyOtp(email, otp);
      if (!res || !res.success) throw new Error(res?.message ?? 'Verification failed');
      toast({ title: 'Verified', description: 'OTP verified — redirecting...', variant: 'success' });
      navigate(redirectParam as any);
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      toast({ title: 'Verification failed', description: msg, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast({ title: 'Missing email', description: 'Enter your email on the login page first.', variant: 'destructive' });
      return;
    }
    setResendLoading(true);
    try {
      const result = await login(email, '');
      if (result?.needsOtp) {
        toast({ title: 'OTP resent', description: result.message || 'A new code was sent to your email.' });
      } else {
        toast({ title: 'Request sent', description: result.message || 'Check your inbox.' });
      }
    } catch (error) {
      toast({ title: 'Failed to resend', variant: 'destructive' });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthLayout formTitle="Verify OTP" formSubtitle={`A 6-digit code was sent to ${email || 'your email'}`}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <AuthInput
          label="One-time code"
          type="text"
          inputMode="numeric"
          placeholder="6-digit code"
          value={otp}
          onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          maxLength={6}
          required
          disabled={isLoading}
          autoFocus
        />

        <AuthPrimaryButton loading={isLoading}>Verify & continue</AuthPrimaryButton>

        <AuthGhostButton type="button" onClick={handleResend} loading={resendLoading} disabled={isLoading}>
          {resendLoading ? 'Sending…' : 'Resend OTP'}
        </AuthGhostButton>

        <AuthGhostButton type="button" onClick={() => navigate('/login')} disabled={isLoading}>
          ← Back to login
        </AuthGhostButton>
      </form>
    </AuthLayout>
  );
}

export default VerifyOtp;
