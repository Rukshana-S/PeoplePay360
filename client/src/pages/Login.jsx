import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { mockAuthService } from "../services/mockAuth";
import { toast } from "react-toastify";
import { Lock, Mail, Loader2, ArrowRight, Info, KeyRound } from "lucide-react";
import { Button } from "../components/ui/button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent double-clicks

    // Pre-flight client validation
    if (!email.trim()) {
      toast.error("Please enter your Work Email.");
      return;
    }

    if (!password) {
      toast.error("Please enter your Password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}! Redirecting to dashboard...`);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.message || "Authentication failed. Please check credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function for quick mock user fill
  const handleQuickFill = (userAccount) => {
    setEmail(userAccount.email);
    setPassword("123456");
  };

  const mockAccounts = mockAuthService.getMockAccounts();

  return (
    <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-8 shadow-2xl w-full max-w-md backdrop-blur-md">
      {/* Header section */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5B8DEF]/10 border border-[#5B8DEF]/20 text-[#5B8DEF] text-xs font-semibold uppercase tracking-wider mb-3">
          <KeyRound className="w-3.5 h-3.5" />
          HR Portal
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Welcome back
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Sign in to access your PeoplePay360 workspace
        </p>
      </div>

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Work Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              disabled={isSubmitting}
              className="w-full pl-10 pr-4 py-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#5B8DEF] focus:ring-1 focus:ring-[#5B8DEF] transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <button
              type="button"
              onClick={() => toast.info("Contact your system administrator to reset password.")}
              className="text-xs text-[#5B8DEF] hover:underline font-medium"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmitting}
              className="w-full pl-10 pr-4 py-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#5B8DEF] focus:ring-1 focus:ring-[#5B8DEF] transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-[#5B8DEF] hover:bg-[#4a7ad8] text-white font-semibold rounded-lg shadow-lg shadow-[#5B8DEF]/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      {/* Quick Role Switcher for Hackathon Testing */}
      <div className="mt-6 pt-5 border-t border-[#1E293B]">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Demo Mock Accounts (Password: <code className="text-slate-300 bg-slate-800 px-1 py-0.5 rounded">123456</code>)
        </p>
        <div className="flex flex-wrap gap-1.5">
          {mockAccounts.map((acc) => (
            <button
              key={acc.id}
              type="button"
              onClick={() => handleQuickFill(acc)}
              className="text-[11px] px-2.5 py-1 rounded bg-[#020817] hover:bg-[#1E293B] border border-[#1E293B] text-slate-300 hover:text-white transition-colors"
            >
              {acc.role}
            </button>
          ))}
        </div>
      </div>

      {/* Required Footer Notice */}
      <div className="mt-6 pt-4 border-t border-[#1E293B]/60 space-y-2 text-center text-xs text-slate-400">
        <p className="flex items-center justify-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Accounts are created by an administrator.</span>
        </p>
        <p className="text-[11px] text-slate-400 leading-relaxed px-2">
          After sign-in, show only the modules and actions allowed by the user's assigned role.
        </p>
      </div>
    </div>
  );
};

export default Login;
