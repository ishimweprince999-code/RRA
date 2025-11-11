import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import useAuth from "../../store/auth.js";
import { User, Shield, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [mode, setMode] = useState("trader");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuth((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (mode === "trader") {
        login({ token: "mock-trader", role: "trader", user: { name: "Trader Joe" } });
        navigate(from || "/trader/dashboard", { replace: true });
      } else {
        login({ token: "mock-admin", role: "admin", user: { name: "Admin Jane" } });
        navigate(from || "/admin/dashboard", { replace: true });
      }
    }, 700);
  };

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400">Sign in to your SmartTax account</p>
          </div>

          <div className="flex gap-2 mb-6">
            <button 
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                mode==="trader"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "bg-slate-700/30 text-slate-400 hover:bg-slate-700/50"
              }`} 
              onClick={()=>setMode("trader")}
            >
              <User size={18} />
              Trader
            </button>
            <button 
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                mode==="admin"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "bg-slate-700/30 text-slate-400 hover:bg-slate-700/50"
              }`} 
              onClick={()=>window.location.href="/admin/login"}
            >
              <Shield size={18} />
              Admin Portal
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode==="trader" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                  <input 
                    className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    placeholder="+250 XXX XXX XXX" 
                    value={phone} 
                    onChange={(e)=>setPhone(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">PIN</label>
                  <input 
                    className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    placeholder="4-digit PIN" 
                    value={pin} 
                    onChange={(e)=>setPin(e.target.value)} 
                    type="password" 
                    maxLength={4}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input 
                    className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    placeholder="admin@rra.gov.rw" 
                    value={email} 
                    onChange={(e)=>setEmail(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                  <input 
                    className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    placeholder="••••••••" 
                    value={pwd} 
                    onChange={(e)=>setPwd(e.target.value)} 
                    type="password"
                  />
                </div>
              </>
            )}
            <button 
              disabled={loading} 
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading?"Logging in...":"Login"}
            </button>
            <div className="flex justify-between text-xs text-slate-400 pt-2">
              <button type="button" className="hover:text-blue-400 transition-colors">Reset PIN</button>
              <button type="button" className="hover:text-blue-400 transition-colors">Contact Support</button>
            </div>
          </form>

          {mode === "trader" && (
            <div className="mt-6 text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Register here
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
