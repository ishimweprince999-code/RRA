import { useState } from 'react';
import { ChevronDown, ChevronRight, Users, MapPin, Shield, Plus, Edit, Trash2, Ban, Check } from 'lucide-react';
import useAdminHierarchy from '../store/adminHierarchy.js';
import useTheme from '../store/theme.js';
import useAuth from '../store/auth.js';

export default function AdminHierarchy({ search = '', levelFilter = 'all', onAddNew, hideHeader = false }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  const {
    nationalAdmin,
    provincialAdmins,
    districtAdmins,
    sectorAdmins,
    getAccessibleJurisdictions,
    setCurrentAdmin,
    removeAdmin,
    toggleAdminSuspension
  } = useAdminHierarchy();
  const { adminLevel } = useAuth();
  const isSuperAdmin = adminLevel === 'national';
  
  const [expandedSections, setExpandedSections] = useState(() => {
    const isSmall = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
    return {
      national: true,
      provincial: !isSmall,
      district: !isSmall,
      sector: !isSmall
    };
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const AdminCard = ({ admin, level, jurisdiction, onEdit, onDelete, onToggleSuspend }) => {
    const getLevelColor = (level) => {
      switch(level) {
        case 'national': return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'provincial': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'district': return 'bg-green-100 text-green-800 border-green-200';
        case 'sector': return 'bg-orange-100 text-orange-800 border-orange-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    const getLevelIcon = (level) => {
      switch(level) {
        case 'national': return <Shield size={16} />;
        case 'provincial': return <MapPin size={16} />;
        case 'district': return <MapPin size={16} />;
        case 'sector': return <MapPin size={16} />;
        default: return <Users size={16} />;
      }
    };

    return (
      <div className={`p-4 rounded-lg border ${
        isLight 
          ? 'bg-white border-gray-200 hover:shadow-md' 
          : 'bg-slate-800 border-slate-700 hover:border-slate-600'
      } transition-all`}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getLevelColor(level)}`}>
                {getLevelIcon(level)}
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </div>
              {jurisdiction && (
                <span className={`text-sm ${isLight ? 'text-gray-600' : 'text-slate-400'} truncate`}>
                  {jurisdiction}
                </span>
              )}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold border ${
                admin.status === 'suspended'
                  ? 'bg-red-500/10 text-red-500 border-red-500/20'
                  : 'bg-green-500/10 text-green-500 border-green-500/20'
              }`}>
                {admin.status === 'suspended' ? 'Suspended' : 'Active'}
              </span>
            </div>
            <h3 className={`font-semibold ${isLight ? 'text-gray-900' : 'text-white'} break-words` }>
              {admin.name}
            </h3>
            <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-slate-400'} mb-1 break-all sm:break-normal truncate`}>
              {admin.email}
            </p>
            <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-slate-400'} break-all sm:break-normal`}>
              {admin.phone}
            </p>
          </div>
          <div className="flex gap-2 sm:self-auto sm:mt-0 self-end mt-2">
            <button
              onClick={() => onEdit(admin)}
              className={`p-2 rounded-lg transition-colors ${
                isLight 
                  ? 'hover:bg-gray-100 text-gray-600' 
                  : 'hover:bg-slate-700 text-slate-400'
              }`}
            >
              <Edit size={16} />
            </button>
            {isSuperAdmin && (
              <button
                onClick={() => onToggleSuspend(admin.id, level)}
                className={`p-2 rounded-lg transition-colors ${
                  admin.status === 'suspended'
                    ? (isLight ? 'hover:bg-green-50 text-green-600' : 'hover:bg-green-900/20 text-green-400')
                    : (isLight ? 'hover:bg-red-50 text-red-600' : 'hover:bg-red-900/20 text-red-400')
                }`}
                title={admin.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
              >
                {admin.status === 'suspended' ? <Check size={16} /> : <Ban size={16} />}
              </button>
            )}
            <button
              onClick={() => onDelete(admin.id, level)}
              className={`p-2 rounded-lg transition-colors ${
                isLight 
                  ? 'hover:bg-red-50 text-red-600' 
                  : 'hover:bg-red-900/20 text-red-400'
              }`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const HierarchySection = ({ title, level, admins, icon: Icon, jurisdictionMap }) => {
    const isExpanded = expandedSections[level];
    
    return (
      <div className={`rounded-lg border ${
        isLight 
          ? 'bg-white border-gray-200' 
          : 'bg-slate-800 border-slate-700'
      }`}>
        <button
          onClick={() => toggleSection(level)}
          className={`w-full p-4 flex items-center justify-between ${
            isLight ? 'hover:bg-gray-50' : 'hover:bg-slate-700'
          } transition-colors`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isLight ? 'bg-gray-100' : 'bg-slate-700'
            }`}>
              <Icon size={20} className={isLight ? 'text-gray-600' : 'text-slate-400'} />
            </div>
            <div className="text-left">
              <h3 className={`font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {title}
              </h3>
              <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>
                {admins.length} {admins.length === 1 ? 'admin' : 'admins'}
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronDown size={20} className={isLight ? 'text-gray-400' : 'text-slate-500'} />
          ) : (
            <ChevronRight size={20} className={isLight ? 'text-gray-400' : 'text-slate-500'} />
          )}
        </button>
        
        {isExpanded && (
          <div className={`p-4 pt-0 border-t ${
            isLight ? 'border-gray-100' : 'border-slate-700'
          }`}>
            {admins.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {admins.map(admin => (
                  <AdminCard
                    key={admin.id}
                    admin={admin}
                    level={admin.level}
                    jurisdiction={jurisdictionMap?.[admin.id]}
                    onEdit={(admin) => console.log('Edit admin:', admin)}
                    onDelete={(id, level) => removeAdmin(level, id)}
                    onToggleSuspend={(id, level) => toggleAdminSuspension(level, id)}
                  />
                ))}
              </div>
            ) : (
              <div className={`text-center py-8 ${
                isLight ? 'text-gray-500' : 'text-slate-500'
              }`}>
                <Users size={48} className="mx-auto mb-3 opacity-50" />
                <p>No {level} admins assigned</p>
                <button
                  className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    isLight 
                      ? 'border-gray-300 text-gray-700 hover:bg-gray-50' 
                      : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                  } transition-colors`}
                >
                  <Plus size={16} />
                  Add {level.charAt(0).toUpperCase() + level.slice(1)} Admin
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const norm = (v) => (v || '').toString().toLowerCase();
  const matches = (admin) => {
    const q = norm(search);
    if (!q) return true;
    return [admin.name, admin.email, admin.phone, admin.provinceId, admin.districtId, admin.sectorId]
      .some((v) => norm(v).includes(q));
  };

  const showSection = (section) => levelFilter === 'all' || levelFilter === section;

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
              Admin Hierarchy Management
            </h2>
            <p className={`mt-1 ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>
              Manage administrators across Rwanda's administrative levels
            </p>
          </div>
          <button onClick={onAddNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-md transition-all">
            <Plus size={16} />
            Add New Admin
          </button>
        </div>
      )}

      <div className="grid gap-6">
        {/* National Admin */}
        {nationalAdmin && showSection('national') && (
          <HierarchySection
            title="National Administrator"
            level="national"
            admins={[nationalAdmin].filter(matches)}
            icon={Shield}
          />
        )}

        {/* Provincial Admins */}
        {showSection('provincial') && (
          <HierarchySection
            title="Provincial Administrators"
            level="provincial"
            admins={provincialAdmins.filter(matches)}
            icon={MapPin}
            jurisdictionMap={provincialAdmins.filter(matches).reduce((acc, admin) => {
              const province = admin.provinceId?.charAt(0).toUpperCase() + admin.provinceId?.slice(1);
              acc[admin.id] = province;
              return acc;
            }, {})}
          />
        )}

        {/* District Admins */}
        {showSection('district') && (
          <HierarchySection
            title="District Administrators"
            level="district"
            admins={districtAdmins.filter(matches)}
            icon={MapPin}
            jurisdictionMap={districtAdmins.filter(matches).reduce((acc, admin) => {
              const district = admin.districtId?.charAt(0).toUpperCase() + admin.districtId?.slice(1);
              acc[admin.id] = district;
              return acc;
            }, {})}
          />
        )}

        {/* Sector Admins */}
        {showSection('sector') && (
          <HierarchySection
            title="Sector Administrators"
            level="sector"
            admins={sectorAdmins.filter(matches)}
            icon={MapPin}
            jurisdictionMap={sectorAdmins.filter(matches).reduce((acc, admin) => {
              const sector = admin.sectorId?.charAt(0).toUpperCase() + admin.sectorId?.slice(1);
              acc[admin.id] = sector;
              return acc;
            }, {})}
          />
        )}
      </div>
    </div>
  );
}
