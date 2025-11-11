import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import useAuth from "../../store/auth.js";
import useAdminHierarchy from "../../store/adminHierarchy.js";
import { Shield, ArrowLeft, MapPin, Users } from "lucide-react";
import useTheme from "../../store/theme.js";

export default function AdminLoginPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("provincial");
  
  const login = useAuth((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const adminLevels = [
    {
      id: 'national',
      title: 'National Administrator',
      description: 'Full access to all provinces, districts, and sectors',
      icon: Shield,
      color: 'purple'
    },
    {
      id: 'provincial', 
      title: 'Provincial Administrator',
      description: 'Control districts and sectors within assigned province',
      icon: MapPin,
      color: 'blue'
    },
    {
      id: 'district',
      title: 'District Administrator', 
      description: 'Manage sectors within assigned district',
      icon: MapPin,
      color: 'green'
    },
    {
      id: 'sector',
      title: 'Sector Administrator',
      description: 'Handle operations at sector level',
      icon: Users,
      color: 'orange'
    }
  ];

  const getLevelColorClass = (color) => {
    const colors = {
      purple: isLight 
        ? 'border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-700' 
        : 'border-purple-600/30 bg-purple-900/20 hover:bg-purple-900/30 text-purple-300',
      blue: isLight 
        ? 'border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700' 
        : 'border-blue-600/30 bg-blue-900/20 hover:bg-blue-900/30 text-blue-300',
      green: isLight 
        ? 'border-green-300 bg-green-50 hover:bg-green-100 text-green-700' 
        : 'border-green-600/30 bg-green-900/20 hover:bg-green-900/30 text-green-300',
      orange: isLight 
        ? 'border-orange-300 bg-orange-50 hover:bg-orange-100 text-orange-700' 
        : 'border-orange-600/30 bg-orange-900/20 hover:bg-orange-900/30 text-orange-300'
    };
    return colors[color] || colors.blue;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      const mockAdmins = {
        national: {
          name: "Jean Baptiste Nsengiyumva",
          email: "admin@rra.gov.rw",
          adminLevel: "national",
          jurisdiction: null
        },
        provincial: {
          name: "Marie Uwimana", 
          email: "kigali@rra.gov.rw",
          adminLevel: "provincial",
          jurisdiction: { provinceId: "kigali" }
        },
        district: {
          name: "Eric Mugisha",
          email: "nyarugenge@rra.gov.rw", 
          adminLevel: "district",
          jurisdiction: { provinceId: "kigali", districtId: "nyarugenge" }
        },
        sector: {
          name: "Jean Paul Niyonzima",
          email: "sector@rra.gov.rw",
          adminLevel: "sector", 
          jurisdiction: { provinceId: "kigali", districtId: "nyarugenge", sectorId: "nyabugogo" }
        }
      };

      const adminData = mockAdmins[selectedLevel];
      
      login({
        token: `mock-${selectedLevel}-admin-${Date.now()}`,
        role: "admin",
        user: {
          name: adminData.name,
          email: adminData.email
        },
        adminLevel: adminData.adminLevel,
        jurisdiction: adminData.jurisdiction
      });
      
      navigate(from || "/admin/dashboard", { replace: true });
    }, 1000);
  };

  return (
    <div className={`min-h-screen grid place-items-center p-6 ${
      isLight 
        ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
        : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
    }`}>
      <div className="w-full max-w-4xl">
        <Link to="/" className={`inline-flex items-center gap-2 ${
          isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
        } mb-6 transition-colors`}>
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        
        <div className={`rounded-2xl shadow-2xl p-8 ${
          isLight 
            ? 'bg-white border border-gray-200' 
            : 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50'
        }`}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-xl mb-4">
              <Shield size={32} className="text-white" />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${
              isLight ? 'text-gray-900' : 'text-white'
            }`}>
              Admin Portal Login
            </h1>
            <p className={isLight ? 'text-gray-600' : 'text-slate-400'}>
              Select your administrative level and sign in to access the SmartTax admin dashboard
            </p>
          </div>

          {/* Admin Level Selection */}
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-4 ${
              isLight ? 'text-gray-900' : 'text-white'
            }`}>
              Select Administrative Level
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adminLevels.map((level) => {
                const Icon = level.icon;
                return (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setSelectedLevel(level.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedLevel === level.id
                        ? getLevelColorClass(level.color).replace('hover:bg-', 'bg-').replace('hover:border-', 'border-')
                        : getLevelColorClass(level.color)
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        isLight ? 'bg-white shadow-sm' : 'bg-slate-800'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold mb-1 ${
                          isLight ? 'text-gray-900' : 'text-white'
                        }`}>
                          {level.title}
                        </h4>
                        <p className={`text-sm ${
                          isLight ? 'text-gray-600' : 'text-slate-400'
                        }`}>
                          {level.description}
                        </p>
                      </div>
                      {selectedLevel === level.id && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isLight ? 'text-gray-700' : 'text-slate-300'
              }`}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  isLight 
                    ? 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500' 
                    : 'border-slate-600 bg-slate-700 text-white focus:ring-blue-500'
                } focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                placeholder={`Enter your ${selectedLevel} admin email`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isLight ? 'text-gray-700' : 'text-slate-300'
              }`}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  isLight 
                    ? 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500' 
                    : 'border-slate-600 bg-slate-700 text-white focus:ring-blue-500'
                } focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Shield size={18} />
                  Sign in as {selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)} Admin
                </>
              )}
            </button>

            <div className="flex justify-between text-sm pt-2">
              <button 
                type="button" 
                className={`${
                  isLight ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'
                } transition-colors`}
              >
                Forgot Password?
              </button>
              <button 
                type="button" 
                className={`${
                  isLight ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'
                } transition-colors`}
              >
                Contact IT Support
              </button>
            </div>
          </form>

          <div className={`mt-6 text-center text-sm ${
            isLight ? 'text-gray-600' : 'text-slate-400'
          }`}>
            <p>🇷🇼 Rwanda Revenue Authority - Secure Admin Portal</p>
            <p className="mt-1">For authorized personnel only</p>
          </div>
        </div>
      </div>
    </div>
  );
}
