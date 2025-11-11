import { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Shield, ChevronDown, Check } from 'lucide-react';
import useAdminHierarchy from '../store/adminHierarchy.js';
import { rwandaProvinces, getDistrictsByProvince, getSectorsByDistrict } from '../data/hierarchy.js';
import useTheme from '../store/theme.js';

export default function AdminRegistration({ isOpen, onClose, onSuccess }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  const { addNationalAdmin, addProvincialAdmin, addDistrictAdmin, addSectorAdmin } = useAdminHierarchy();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    level: 'provincial',
    provinceId: '',
    districtId: '',
    sectorId: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\+250\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone must be in format +250 XXX XXX XXX';
    }
    
    if (formData.level === 'provincial' && !formData.provinceId) {
      newErrors.provinceId = 'Province is required';
    }
    if (formData.level === 'district' && (!formData.provinceId || !formData.districtId)) {
      if (!formData.provinceId) newErrors.provinceId = 'Province is required';
      if (!formData.districtId) newErrors.districtId = 'District is required';
    }
    if (formData.level === 'sector' && (!formData.provinceId || !formData.districtId || !formData.sectorId)) {
      if (!formData.provinceId) newErrors.provinceId = 'Province is required';
      if (!formData.districtId) newErrors.districtId = 'District is required';
      if (!formData.sectorId) newErrors.sectorId = 'Sector is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const adminData = {
        id: `admin-${formData.level}-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        level: formData.level,
        createdAt: new Date().toISOString()
      };
      
      if (formData.level === 'provincial') {
        adminData.provinceId = formData.provinceId;
        addProvincialAdmin(adminData);
      } else if (formData.level === 'district') {
        adminData.provinceId = formData.provinceId;
        adminData.districtId = formData.districtId;
        addDistrictAdmin(adminData);
      } else if (formData.level === 'sector') {
        adminData.provinceId = formData.provinceId;
        adminData.districtId = formData.districtId;
        adminData.sectorId = formData.sectorId;
        addSectorAdmin(adminData);
      } else if (formData.level === 'national') {
        addNationalAdmin(adminData);
      }
      
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error creating admin:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      level: 'provincial',
      provinceId: '',
      districtId: '',
      sectorId: ''
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getLevelDescription = (level) => {
    switch(level) {
      case 'national': return 'Controls all provinces, districts, and sectors nationwide';
      case 'provincial': return 'Controls all districts and sectors within selected province';
      case 'district': return 'Controls all sectors within selected district';
      case 'sector': return 'Controls only the selected sector';
      default: return '';
    }
  };

  const districts = formData.provinceId ? getDistrictsByProvince(formData.provinceId) : [];
  const sectors = formData.districtId ? getSectorsByDistrict(formData.provinceId, formData.districtId) : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
        
        <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl ${
          isLight ? 'bg-white' : 'bg-slate-800'
        }`}>
          <div className={`flex items-center justify-between p-6 border-b ${
            isLight ? 'border-gray-200' : 'border-slate-700'
          }`}>
            <div>
              <h3 className={`text-xl font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                Register New Administrator
              </h3>
              <p className={`mt-1 text-sm ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>
                Add an admin to manage specific administrative levels
              </p>
            </div>
            <button
              onClick={handleClose}
              className={`p-2 rounded-lg transition-colors ${
                isLight ? 'hover:bg-gray-100' : 'hover:bg-slate-700'
              }`}
            >
              <X size={20} className={isLight ? 'text-gray-500' : 'text-slate-400'} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className={`text-sm font-medium mb-4 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                  Basic Information
                </h4>
                <div className="grid gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isLight ? 'text-gray-700' : 'text-slate-300'
                    }`}>
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        isLight ? 'text-gray-400' : 'text-slate-500'
                      }`} />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                          errors.name
                            ? 'border-red-500 focus:ring-red-500'
                            : isLight 
                              ? 'border-gray-300 focus:ring-blue-500' 
                              : 'border-slate-600 focus:ring-blue-500'
                        } focus:outline-none focus:ring-2 ${
                          isLight ? 'bg-white text-gray-900' : 'bg-slate-700 text-white'
                        }`}
                        placeholder="Enter full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isLight ? 'text-gray-700' : 'text-slate-300'
                    }`}>
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        isLight ? 'text-gray-400' : 'text-slate-500'
                      }`} />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                          errors.email
                            ? 'border-red-500 focus:ring-red-500'
                            : isLight 
                              ? 'border-gray-300 focus:ring-blue-500' 
                              : 'border-slate-600 focus:ring-blue-500'
                        } focus:outline-none focus:ring-2 ${
                          isLight ? 'bg-white text-gray-900' : 'bg-slate-700 text-white'
                        }`}
                        placeholder="admin@rra.gov.rw"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isLight ? 'text-gray-700' : 'text-slate-300'
                    }`}>
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        isLight ? 'text-gray-400' : 'text-slate-500'
                      }`} />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                          errors.phone
                            ? 'border-red-500 focus:ring-red-500'
                            : isLight 
                              ? 'border-gray-300 focus:ring-blue-500' 
                              : 'border-slate-600 focus:ring-blue-500'
                        } focus:outline-none focus:ring-2 ${
                          isLight ? 'bg-white text-gray-900' : 'bg-slate-700 text-white'
                        }`}
                        placeholder="+250 788 123 456"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Administrative Level */}
              <div>
                <h4 className={`text-sm font-medium mb-4 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                  Administrative Level
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isLight ? 'text-gray-700' : 'text-slate-300'
                    }`}>
                      Admin Level
                    </label>
                    <div className="relative">
                      <Shield size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        isLight ? 'text-gray-400' : 'text-slate-500'
                      }`} />
                      <select
                        value={formData.level}
                        onChange={(e) => handleInputChange('level', e.target.value)}
                        className={`w-full pl-10 pr-10 py-3 rounded-lg border appearance-none ${
                          isLight 
                            ? 'border-gray-300 focus:ring-blue-500' 
                            : 'border-slate-600 focus:ring-blue-500'
                        } focus:outline-none focus:ring-2 ${
                          isLight ? 'bg-white text-gray-900' : 'bg-slate-700 text-white'
                        }`}
                      >
                        <option value="national">National Administrator</option>
                        <option value="provincial">Provincial Administrator</option>
                        <option value="district">District Administrator</option>
                        <option value="sector">Sector Administrator</option>
                      </select>
                      <ChevronDown size={18} className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                        isLight ? 'text-gray-400' : 'text-slate-500'
                      }`} />
                    </div>
                    <p className={`mt-2 text-sm ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>
                      {getLevelDescription(formData.level)}
                    </p>
                  </div>

                  {/* Province Selection */}
                  {formData.level !== 'national' && (
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isLight ? 'text-gray-700' : 'text-slate-300'
                      }`}>
                        Province
                      </label>
                      <div className="relative">
                        <MapPin size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                          isLight ? 'text-gray-400' : 'text-slate-500'
                        }`} />
                        <select
                          value={formData.provinceId}
                          onChange={(e) => handleInputChange('provinceId', e.target.value)}
                          className={`w-full pl-10 pr-10 py-3 rounded-lg border appearance-none ${
                            errors.provinceId
                              ? 'border-red-500 focus:ring-red-500'
                              : isLight 
                                ? 'border-gray-300 focus:ring-blue-500' 
                                : 'border-slate-600 focus:ring-blue-500'
                          } focus:outline-none focus:ring-2 ${
                            isLight ? 'bg-white text-gray-900' : 'bg-slate-700 text-white'
                          }`}
                        >
                          <option value="">Select Province</option>
                          {rwandaProvinces.map(province => (
                            <option key={province.id} value={province.id}>
                              {province.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={18} className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                          isLight ? 'text-gray-400' : 'text-slate-500'
                        }`} />
                      </div>
                      {errors.provinceId && (
                        <p className="mt-1 text-sm text-red-500">{errors.provinceId}</p>
                      )}
                    </div>
                  )}

                  {/* District Selection */}
                  {(formData.level === 'district' || formData.level === 'sector') && formData.provinceId && (
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isLight ? 'text-gray-700' : 'text-slate-300'
                      }`}>
                        District
                      </label>
                      <div className="relative">
                        <MapPin size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                          isLight ? 'text-gray-400' : 'text-slate-500'
                        }`} />
                        <select
                          value={formData.districtId}
                          onChange={(e) => handleInputChange('districtId', e.target.value)}
                          className={`w-full pl-10 pr-10 py-3 rounded-lg border appearance-none ${
                            errors.districtId
                              ? 'border-red-500 focus:ring-red-500'
                              : isLight 
                                ? 'border-gray-300 focus:ring-blue-500' 
                                : 'border-slate-600 focus:ring-blue-500'
                          } focus:outline-none focus:ring-2 ${
                            isLight ? 'bg-white text-gray-900' : 'bg-slate-700 text-white'
                          }`}
                        >
                          <option value="">Select District</option>
                          {districts.map(district => (
                            <option key={district.id} value={district.id}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={18} className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                          isLight ? 'text-gray-400' : 'text-slate-500'
                        }`} />
                      </div>
                      {errors.districtId && (
                        <p className="mt-1 text-sm text-red-500">{errors.districtId}</p>
                      )}
                    </div>
                  )}

                  {/* Sector Selection */}
                  {formData.level === 'sector' && formData.districtId && (
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isLight ? 'text-gray-700' : 'text-slate-300'
                      }`}>
                        Sector
                      </label>
                      <div className="relative">
                        <MapPin size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                          isLight ? 'text-gray-400' : 'text-slate-500'
                        }`} />
                        <select
                          value={formData.sectorId}
                          onChange={(e) => handleInputChange('sectorId', e.target.value)}
                          className={`w-full pl-10 pr-10 py-3 rounded-lg border appearance-none ${
                            errors.sectorId
                              ? 'border-red-500 focus:ring-red-500'
                              : isLight 
                                ? 'border-gray-300 focus:ring-blue-500' 
                                : 'border-slate-600 focus:ring-blue-500'
                          } focus:outline-none focus:ring-2 ${
                            isLight ? 'bg-white text-gray-900' : 'bg-slate-700 text-white'
                          }`}
                        >
                          <option value="">Select Sector</option>
                          {sectors.map(sector => (
                            <option key={sector.id} value={sector.id}>
                              {sector.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={18} className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                          isLight ? 'text-gray-400' : 'text-slate-500'
                        }`} />
                      </div>
                      {errors.sectorId && (
                        <p className="mt-1 text-sm text-red-500">{errors.sectorId}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={`flex gap-3 pt-6 border-t ${
              isLight ? 'border-gray-200' : 'border-slate-700'
            }`}>
              <button
                type="button"
                onClick={handleClose}
                className={`flex-1 px-4 py-3 rounded-lg border font-medium transition-colors ${
                  isLight 
                    ? 'border-gray-300 text-gray-700 hover:bg-gray-50' 
                    : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Admin...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Create Administrator
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
