"use client";

import { useState } from "react";
import { BarChart3, Mail, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";

interface LoginPageProps {
  onLogin: (email: string, role: "creator" | "user") => void;
  onBack: () => void;
}

type Step = "email" | "otp" | "success";

const CREATOR_EMAIL = "creator@gmail.com";
const VALID_OTP = "123456";

export default function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (val: string) => {
    if (!val) return "Email tidak boleh kosong.";
    if (!val.endsWith("@gmail.com")) return "Hanya email @gmail.com yang diizinkan.";
    if (val.length < 12) return "Format email tidak valid.";
    return "";
  };

  const handleEmailSubmit = () => {
    const err = validateEmail(email);
    if (err) { setEmailError(err); return; }
    setEmailError("");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpSubmit = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) { setOtpError("Masukkan 6 digit kode OTP."); return; }
    if (enteredOtp !== VALID_OTP) { setOtpError("Kode OTP salah. Coba lagi."); return; }
    setOtpError("");
    setIsLoading(true);
    setStep("success");
    setTimeout(() => {
      const role = email === CREATOR_EMAIL ? "creator" : "user";
      onLogin(email, role);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8" style={{ animation: "fadeSlideUp 0.6s ease both" }}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-violet-500/40">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Si Paling Data</h1>
          <p className="text-gray-500 text-sm mt-1">AI Data Analytics Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm" style={{ animation: "fadeSlideUp 0.6s ease 0.1s both" }}>

          {/* Step Email */}
          {step === "email" && (
            <div>
              <button
                onClick={onBack}
                className="text-gray-500 hover:text-white text-xs mb-4 flex items-center gap-1 transition-colors"
              >
                ← Kembali ke beranda
              </button>
              <h2 className="text-xl font-bold text-white mb-1">Selamat Datang!</h2>
              <p className="text-gray-400 text-sm mb-6">Masuk atau daftar menggunakan Gmail kamu</p>

              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-2 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                      placeholder="contoh@gmail.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors text-sm"
                    />
                  </div>
                  {emailError && (
                    <div className="flex items-center gap-2 text-red-400 text-xs mt-2">
                      <AlertCircle className="w-3 h-3" />
                      {emailError}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleEmailSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Kirim Kode OTP
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Info */}
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-blue-300 text-xs text-center">
                  💡 Gunakan email <span className="font-bold">@gmail.com</span> untuk masuk atau mendaftar
                </p>
              </div>
            </div>
          )}

          {/* Step OTP */}
          {step === "otp" && (
            <div>
              <button
                onClick={() => setStep("email")}
                className="text-gray-500 hover:text-white text-xs mb-4 flex items-center gap-1 transition-colors"
              >
                ← Ganti email
              </button>

              <h2 className="text-xl font-bold text-white mb-1">Cek Email Kamu</h2>
              <p className="text-gray-400 text-sm mb-2">
                Kode OTP telah dikirim ke
              </p>
              <p className="text-violet-400 font-semibold text-sm mb-6">{email}</p>

              {/* OTP Input */}
              <div className="flex gap-3 justify-center mb-4">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center text-xl font-bold bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                ))}
              </div>

              {otpError && (
                <div className="flex items-center justify-center gap-2 text-red-400 text-xs mb-4">
                  <AlertCircle className="w-3 h-3" />
                  {otpError}
                </div>
              )}

              <button
                onClick={handleOtpSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Verifikasi OTP
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Hint */}
              <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-amber-300 text-xs text-center">
                  🔑 Untuk demo: gunakan kode <span className="font-bold text-amber-200">123456</span>
                </p>
              </div>

              <button
                onClick={() => { setOtp(["", "", "", "", "", ""]); setOtpError(""); }}
                className="w-full text-gray-500 hover:text-white text-xs mt-3 transition-colors"
              >
                Kirim ulang kode
              </button>
            </div>
          )}

          {/* Step Success */}
          {step === "success" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Berhasil Masuk!</h2>
              <p className="text-gray-400 text-sm">Mengarahkan ke dashboard...</p>
              <div className="mt-4 flex justify-center">
                <div className="w-5 h-5 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-6">
          Platform Analisis Data Bisnis Berbasis AI
        </p>
      </div>

      <style jsx global>{`
        @keyframes fadeSlideUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}