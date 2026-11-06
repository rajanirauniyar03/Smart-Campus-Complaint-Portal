import React, { createContext, useContext, useState, useEffect } from 'react';

const BrandContext = createContext();

export const INSTITUTIONAL_PRESETS = [
  {
    id: 'nit',
    name: 'National Institute of Technology & Advanced Sciences',
    shortName: 'NIT-AS',
    subTitle: 'Institute of National Importance • Ministry of Education',
    accreditation: 'Accredited Grade A++ by NAAC • NIRF Rank #8 • AICTE Approved',
    academicSession: 'AY 2026–2027 (Even Semester)',
    portalTitle: 'Central Student Grievance Redressal System (C-SGRS)',
    supportEmail: 'grievance.cell@nitas.ac.in',
    helpline: '+91 (011) 2766-7000 / Ext. 402',
    address: 'National Knowledge Corridor, Sector 14, Campus Block A',
    code: 'NITAS-DELHI-001',
  },
  {
    id: 'apex',
    name: 'Apex Institute of Engineering & Technology',
    shortName: 'AIET',
    subTitle: 'Affiliated to State Technological University • Approved by AICTE',
    accreditation: 'NBA Tier-1 Accredited Programs • NAAC Grade A+',
    academicSession: 'AY 2026–2027',
    portalTitle: 'Campus ERP & Student Redressal Portal',
    supportEmail: 'dean.studentaffairs@aiet.edu.in',
    helpline: '+91 (020) 2420-5500',
    address: 'University Road, Knowledge City, Pune',
    code: 'AIET-PUNE-304',
  },
  {
    id: 'scu',
    name: 'State Central University of Science & Technology',
    shortName: 'SCUST',
    subTitle: 'State University Established under Act XI of 1978',
    accreditation: 'UGC Recognized 12(B) Institution • NAAC A Grade',
    academicSession: 'AY 2026–2027',
    portalTitle: 'Office of the Dean of Student Welfare - Grievance Desk',
    supportEmail: 'ombudsperson@scust.ac.in',
    helpline: '+91 (033) 2219-8000',
    address: 'Central Campus, College Square, Academic District',
    code: 'SCUST-STATE-102',
  },
];

export const BrandProvider = ({ children }) => {
  const [institution, setInstitution] = useState(() => {
    const saved = localStorage.getItem('campus_brand_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing brand config', e);
      }
    }
    return INSTITUTIONAL_PRESETS[0];
  });

  const updateInstitution = (newConfig) => {
    setInstitution((prev) => {
      const updated = { ...prev, ...newConfig };
      localStorage.setItem('campus_brand_config', JSON.stringify(updated));
      return updated;
    });
  };

  const applyPreset = (presetId) => {
    const preset = INSTITUTIONAL_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setInstitution(preset);
      localStorage.setItem('campus_brand_config', JSON.stringify(preset));
    }
  };

  const resetToDefault = () => {
    setInstitution(INSTITUTIONAL_PRESETS[0]);
    localStorage.removeItem('campus_brand_config');
  };

  return (
    <BrandContext.Provider
      value={{
        institution,
        updateInstitution,
        applyPreset,
        resetToDefault,
        presets: INSTITUTIONAL_PRESETS,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};
