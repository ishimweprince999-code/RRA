import { create } from "zustand";
import { rwandaProvinces } from "../data/hierarchy.js";

const useAdminHierarchy = create((set, get) => ({
  // Current admin info
  currentAdmin: null,
  
  // Admin hierarchy data
  nationalAdmin: null,
  provincialAdmins: [],
  districtAdmins: [],
  sectorAdmins: [],
  
  // Set current admin
  setCurrentAdmin: (admin) => {
    set({ currentAdmin: admin });
  },
  
  // Add national admin
  addNationalAdmin: (admin) => {
    const normalized = { status: 'active', ...admin };
    set({ nationalAdmin: normalized });
  },
  
  // Add provincial admin
  addProvincialAdmin: (admin) => {
    const normalized = { status: 'active', ...admin };
    set(state => ({
      provincialAdmins: [
        ...state.provincialAdmins.filter(a => a.provinceId !== normalized.provinceId),
        normalized
      ]
    }));
  },
  
  // Add district admin
  addDistrictAdmin: (admin) => {
    const normalized = { status: 'active', ...admin };
    set(state => ({
      districtAdmins: [
        ...state.districtAdmins.filter(a => a.districtId !== normalized.districtId),
        normalized
      ]
    }));
  },
  
  // Add sector admin
  addSectorAdmin: (admin) => {
    const normalized = { status: 'active', ...admin };
    set(state => ({
      sectorAdmins: [
        ...state.sectorAdmins.filter(a => a.sectorId !== normalized.sectorId),
        normalized
      ]
    }));
  },
  
  // Remove admin
  removeAdmin: (type, id) => {
    switch(type) {
      case 'national':
        set({ nationalAdmin: null });
        break;
      case 'provincial':
        set(state => ({
          provincialAdmins: state.provincialAdmins.filter(a => a.id !== id)
        }));
        break;
      case 'district':
        set(state => ({
          districtAdmins: state.districtAdmins.filter(a => a.id !== id)
        }));
        break;
      case 'sector':
        set(state => ({
          sectorAdmins: state.sectorAdmins.filter(a => a.id !== id)
        }));
        break;
    }
  },

  // Set admin status (active | suspended)
  setAdminStatus: (type, id, status) => {
    switch (type) {
      case 'national':
        set(state => ({
          nationalAdmin: state.nationalAdmin && state.nationalAdmin.id === id
            ? { ...state.nationalAdmin, status }
            : state.nationalAdmin
        }));
        break;
      case 'provincial':
        set(state => ({
          provincialAdmins: state.provincialAdmins.map(a => a.id === id ? { ...a, status } : a)
        }));
        break;
      case 'district':
        set(state => ({
          districtAdmins: state.districtAdmins.map(a => a.id === id ? { ...a, status } : a)
        }));
        break;
      case 'sector':
        set(state => ({
          sectorAdmins: state.sectorAdmins.map(a => a.id === id ? { ...a, status } : a)
        }));
        break;
    }
  },

  // Toggle suspension convenience method
  toggleAdminSuspension: (type, id) => {
    const state = get();
    const getByType = () => {
      switch (type) {
        case 'national': return state.nationalAdmin && state.nationalAdmin.id === id ? state.nationalAdmin : null;
        case 'provincial': return state.provincialAdmins.find(a => a.id === id);
        case 'district': return state.districtAdmins.find(a => a.id === id);
        case 'sector': return state.sectorAdmins.find(a => a.id === id);
        default: return null;
      }
    };
    const admin = getByType();
    if (!admin) return;
    const next = admin.status === 'suspended' ? 'active' : 'suspended';
    get().setAdminStatus(type, id, next);
  },
  
  // Get admins by level
  getAdminsByLevel: (level) => {
    switch(level) {
      case 'national':
        return get().nationalAdmin ? [get().nationalAdmin] : [];
      case 'provincial':
        return get().provincialAdmins;
      case 'district':
        return get().districtAdmins;
      case 'sector':
        return get().sectorAdmins;
      default:
        return [];
    }
  },
  
  // Get admin by jurisdiction
  getAdminByJurisdiction: (type, id) => {
    switch(type) {
      case 'national':
        return get().nationalAdmin;
      case 'provincial':
        return get().provincialAdmins.find(a => a.provinceId === id);
      case 'district':
        return get().districtAdmins.find(a => a.districtId === id);
      case 'sector':
        return get().sectorAdmins.find(a => a.sectorId === id);
      default:
        return null;
    }
  },
  
  // Check if current admin can access specific jurisdiction
  canAccessJurisdiction: (admin, jurisdictionType, jurisdictionId) => {
    if (!admin) return false;
    
    switch(admin.level) {
      case 'national':
        return true; // National admin can access everything
      case 'provincial':
        return jurisdictionType === 'province' && admin.provinceId === jurisdictionId ||
               jurisdictionType === 'district' && admin.provinceId === jurisdictionId.substring(0, jurisdictionId.indexOf('-')) ||
               jurisdictionType === 'sector' && admin.provinceId === jurisdictionId.substring(0, jurisdictionId.indexOf('-'));
      case 'district':
        return jurisdictionType === 'district' && admin.districtId === jurisdictionId ||
               jurisdictionType === 'sector' && admin.districtId === jurisdictionId.substring(0, jurisdictionId.lastIndexOf('-'));
      case 'sector':
        return jurisdictionType === 'sector' && admin.sectorId === jurisdictionId;
      default:
        return false;
    }
  },
  
  // Get accessible jurisdictions for current admin
  getAccessibleJurisdictions: (admin) => {
    if (!admin) return { provinces: [], districts: [], sectors: [] };
    
    switch(admin.level) {
      case 'national':
        return {
          provinces: rwandaProvinces,
          districts: rwandaProvinces.flatMap(p => p.districts),
          sectors: rwandaProvinces.flatMap(p => 
            p.districts.flatMap(d => d.sectors)
          )
        };
      case 'provincial':
        const province = rwandaProvinces.find(p => p.id === admin.provinceId);
        return {
          provinces: province ? [province] : [],
          districts: province ? province.districts : [],
          sectors: province ? province.districts.flatMap(d => d.sectors) : []
        };
      case 'district':
        const district = rwandaProvinces
          .flatMap(p => p.districts)
          .find(d => d.id === admin.districtId);
        return {
          provinces: [],
          districts: district ? [district] : [],
          sectors: district ? district.sectors : []
        };
      case 'sector':
        const sector = rwandaProvinces
          .flatMap(p => p.districts)
          .flatMap(d => d.sectors)
          .find(s => s.id === admin.sectorId);
        return {
          provinces: [],
          districts: [],
          sectors: sector ? [sector] : []
        };
      default:
        return { provinces: [], districts: [], sectors: [] };
    }
  },
  
  // Initialize with mock data
  initializeMockData: () => {
    set({
      nationalAdmin: {
        id: 'admin-national-001',
        name: 'Jean Baptiste Nsengiyumva',
        email: 'admin@rra.gov.rw',
        phone: '+250788123456',
        level: 'national',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      provincialAdmins: [
        {
          id: 'admin-province-001',
          name: 'Marie Uwimana',
          email: 'kigali@rra.gov.rw',
          phone: '+250788123457',
          level: 'provincial',
          provinceId: 'kigali',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      ],
      districtAdmins: [
        {
          id: 'admin-district-001',
          name: 'Eric Mugisha',
          email: 'nyarugenge@rra.gov.rw',
          phone: '+250788123458',
          level: 'district',
          provinceId: 'kigali',
          districtId: 'nyarugenge',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      ]
    });
  },
  
  // Clear all data
  clearAll: () => {
    set({
      currentAdmin: null,
      nationalAdmin: null,
      provincialAdmins: [],
      districtAdmins: [],
      sectorAdmins: []
    });
  }
}));

export default useAdminHierarchy;
