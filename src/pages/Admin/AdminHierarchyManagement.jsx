import { useEffect, useState } from 'react';
import AdminHierarchy from '../../components/AdminHierarchy.jsx';
import AdminRegistration from '../../components/AdminRegistration.jsx';
import useAdminHierarchy from '../../store/adminHierarchy.js';
import { Users, Shield, MapPin, TrendingUp, Activity } from 'lucide-react';
import useTheme from '../../store/theme.js';

export default function AdminHierarchyManagement() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  const { 
    nationalAdmin, 
    provincialAdmins, 
    districtAdmins, 
    sectorAdmins,
    initializeMockData 
  } = useAdminHierarchy();
  
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  // Initialize mock data on component mount
  useEffect(() => {
    initializeMockData();
  }, [initializeMockData]);

  const stats = [
    {
      title: 'National Admin',
      count: nationalAdmin ? 1 : 0,
      icon: Shield,
      color: 'purple',
      description: 'Controls nationwide operations'
    },
    {
      title: 'Provincial Admins',
      count: provincialAdmins.length,
      icon: MapPin,
      color: 'blue',
      description: 'Manage provincial operations'
    },
    {
      title: 'District Admins', 
      count: districtAdmins.length,
      icon: MapPin,
      color: 'green',
      description: 'Oversee district operations'
    },
    {
      title: 'Sector Admins',
      count: sectorAdmins.length, 
      icon: Users,
      color: 'orange',
      description: 'Handle sector-level operations'
    }
  ];

  const getStatCardClass = (color) => {
    const colorClasses = {
      purple: isLight 
        ? 'bg-purple-50 border-purple-200 text-purple-700' 
        : 'bg-purple-900/20 border-purple-800/50 text-purple-400',
      blue: isLight 
        ? 'bg-blue-50 border-blue-200 text-blue-700' 
        : 'bg-blue-900/20 border-blue-800/50 text-blue-400',
      green: isLight 
        ? 'bg-green-50 border-green-200 text-green-700' 
        : 'bg-green-900/20 border-green-800/50 text-green-400',
      orange: isLight 
        ? 'bg-orange-50 border-orange-200 text-orange-700' 
        : 'bg-orange-900/20 border-orange-800/50 text-orange-400'
    };
    return colorClasses[color] || colorClasses.blue;
  };

  const getIconBgClass = (color) => {
    const bgClasses = {
      purple: isLight ? 'bg-purple-100' : 'bg-purple-800/30',
      blue: isLight ? 'bg-blue-100' : 'bg-blue-800/30',
      green: isLight ? 'bg-green-100' : 'bg-green-800/30',
      orange: isLight ? 'bg-orange-100' : 'bg-orange-800/30'
    };
    return bgClasses[color] || bgClasses.blue;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl md:text-3xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
          Admin Hierarchy Management
        </h1>
        <p className={`mt-2 text-sm md:text-base ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>
          Manage administrators across Rwanda's administrative levels - National, Provincial, District, and Sector
        </p>
      </div>

      {/* Toolbar */}
      <div className={`flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-xl border p-3 md:p-4 ${
        isLight ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700'
      }`}>
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search admins by name, email, phone, or jurisdiction"
            className={`w-full sm:max-w-md rounded-lg px-3 py-2 text-sm border focus:outline-none focus:ring-2 ${
              isLight
                ? 'bg-white border-gray-300 placeholder:text-gray-400 focus:ring-blue-500'
                : 'bg-slate-900 border-slate-700 placeholder:text-slate-500 focus:ring-blue-400'
            }`}
          />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className={`w-full sm:w-48 rounded-lg px-3 py-2 text-sm border focus:outline-none focus:ring-2 ${
              isLight
                ? 'bg-white border-gray-300 focus:ring-blue-500'
                : 'bg-slate-900 border-slate-700 focus:ring-blue-400'
            }`}
          >
            <option value="all">All levels</option>
            <option value="national">National</option>
            <option value="provincial">Provincial</option>
            <option value="district">District</option>
            <option value="sector">Sector</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsRegistrationOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium shadow-md transition-all"
          >
            Add New Admin
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className={`p-4 md:p-6 rounded-xl border ${getStatCardClass(stat.color)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs md:text-sm font-medium opacity-80">{stat.title}</p>
                  <p className="text-2xl md:text-3xl font-bold mt-2">{stat.count}</p>
                  <p className="text-xs md:text-sm mt-2 opacity-70">{stat.description}</p>
                </div>
                <div className={`p-2 md:p-3 rounded-lg ${getIconBgClass(stat.color)}`}>
                  <Icon size={20} className="md:hidden" />
                  <Icon size={24} className="hidden md:block" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hierarchy Overview */}
      <div className={`rounded-xl border p-4 md:p-6 ${
        isLight ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 md:p-2.5 rounded-lg ${isLight ? 'bg-blue-100' : 'bg-blue-900/30'}`}>
            <Activity size={18} className={`${isLight ? 'text-blue-600' : 'text-blue-400'} md:hidden`} />
            <Activity size={20} className={`${isLight ? 'text-blue-600' : 'text-blue-400'} hidden md:block`} />
          </div>
          <div>
            <h2 className={`text-lg md:text-xl font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>
              Administrative Structure
            </h2>
            <p className={`text-xs md:text-sm ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>
              Current hierarchy and control flow
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* National Level */}
          <div className={`p-4 rounded-lg border ${
            isLight ? 'bg-purple-50 border-purple-200' : 'bg-purple-900/20 border-purple-800/50'
          }`}>
            <div className="flex items-center gap-3">
              <Shield className="text-purple-600" size={18} />
              <div className="flex-1">
                <h3 className={`text-sm md:text-base font-semibold ${isLight ? 'text-purple-900' : 'text-purple-300'}`}>
                  National Administrator
                </h3>
                <p className={`text-xs md:text-sm ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>
                  {nationalAdmin ? nationalAdmin.name : 'Not assigned'} • Controls all administrative levels nationwide
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                isLight ? 'bg-purple-200 text-purple-800' : 'bg-purple-800/50 text-purple-300'
              }`}>
                {nationalAdmin ? 'Active' : 'Vacant'}
              </div>
            </div>
          </div>

          {/* Provincial Level */}
          <div className={`p-4 rounded-lg border ${
            isLight ? 'bg-blue-50 border-blue-200' : 'bg-blue-900/20 border-blue-800/50'
          }`}>
            <div className="flex items-center gap-3">
              <MapPin className="text-blue-600" size={18} />
              <div className="flex-1">
                <h3 className={`text-sm md:text-base font-semibold ${isLight ? 'text-blue-900' : 'text-blue-300'}`}>
                  Provincial Administrators
                </h3>
                <p className={`text-xs md:text-sm ${isLight ? 'text-blue-700' : 'text-blue-400'}`}>
                  {provincialAdmins.length} assigned • Control districts and sectors within provinces
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                isLight ? 'bg-blue-200 text-blue-800' : 'bg-blue-800/50 text-blue-300'
              }`}>
                {provincialAdmins.length}/4 Provinces
              </div>
            </div>
          </div>

          {/* District Level */}
          <div className={`p-4 rounded-lg border ${
            isLight ? 'bg-green-50 border-green-200' : 'bg-green-900/20 border-green-800/50'
          }`}>
            <div className="flex items-center gap-3">
              <MapPin className="text-green-600" size={18} />
              <div className="flex-1">
                <h3 className={`text-sm md:text-base font-semibold ${isLight ? 'text-green-900' : 'text-green-300'}`}>
                  District Administrators
                </h3>
                <p className={`text-xs md:text-sm ${isLight ? 'text-green-700' : 'text-green-400'}`}>
                  {districtAdmins.length} assigned • Control sectors within districts
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                isLight ? 'bg-green-200 text-green-800' : 'bg-green-800/50 text-green-300'
              }`}>
                {districtAdmins.length}/30 Districts
              </div>
            </div>
          </div>

          {/* Sector Level */}
          <div className={`p-4 rounded-lg border ${
            isLight ? 'bg-orange-50 border-orange-200' : 'bg-orange-900/20 border-orange-800/50'
          }`}>
            <div className="flex items-center gap-3">
              <Users className="text-orange-600" size={18} />
              <div className="flex-1">
                <h3 className={`text-sm md:text-base font-semibold ${isLight ? 'text-orange-900' : 'text-orange-300'}`}>
                  Sector Administrators
                </h3>
                <p className={`text-xs md:text-sm ${isLight ? 'text-orange-700' : 'text-orange-400'}`}>
                  {sectorAdmins.length} assigned • Handle operations at sector level
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                isLight ? 'bg-orange-200 text-orange-800' : 'bg-orange-800/50 text-orange-300'
              }`}>
                {sectorAdmins.length}/416 Sectors
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Hierarchy Component */}
      <AdminHierarchy 
        search={search} 
        levelFilter={levelFilter} 
        onAddNew={() => setIsRegistrationOpen(true)} 
        hideHeader
      />

      {/* Registration Modal */}
      <AdminRegistration
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        onSuccess={() => {
          console.log('Admin created successfully');
        }}
      />
    </div>
  );
}
