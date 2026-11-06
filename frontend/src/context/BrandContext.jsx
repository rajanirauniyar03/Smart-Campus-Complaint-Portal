import React, { createContext, useContext, useState, useEffect } from 'react';

const BrandContext = createContext();

export const INSTITUTIONAL_PRESETS = [
  {
    id: 'gtu',
    name: 'Gujarat Technological University',
    nativeName: 'ગુજરાત ટેકનોલોજીકલ યુનિવર્સિટી',
    shortName: 'GTU',
    subTitle: 'Established by Government of Gujarat under Gujarat Act No. 20 of 2007 • State Technical University',
    accreditation: 'Accredited Grade A+ by NAAC • Recognized under Section 12(B) of UGC Act • AICTE Approved',
    academicSession: 'Academic Year 2026–2027 (Even Semester)',
    portalTitle: 'GTU Samadhan — Central Student Grievance Redressal Portal (C-SGRS)',
    supportEmail: 'sgrc@gtu.ac.in',
    helpline: '+91 (079) 2326-7521 / 2326-7500',
    address: 'Nr. Visat Three Roads, Chandkheda, Ahmedabad, Gujarat - 382424',
    code: 'GTU-AHM-STATE-2007',
    website: 'https://www.gtu.ac.in/',
    viceChancellor: 'Prof. (Dr.) Rajul K. Gajjar',
    registrar: 'Dr. K. N. Kher',
  },
  {
    id: 'nit',
    name: 'National Institute of Technology & Advanced Sciences',
    nativeName: 'राष्ट्रीय प्रौद्योगिकी संस्थान',
    shortName: 'NIT-AS',
    subTitle: 'Institute of National Importance • Ministry of Education',
    accreditation: 'Accredited Grade A++ by NAAC • NIRF Rank #8 • AICTE Approved',
    academicSession: 'AY 2026–2027 (Even Semester)',
    portalTitle: 'Central Student Grievance Redressal System (C-SGRS)',
    supportEmail: 'grievance.cell@nitas.ac.in',
    helpline: '+91 (011) 2766-7000 / Ext. 402',
    address: 'National Knowledge Corridor, Sector 14, Campus Block A',
    code: 'NITAS-DELHI-001',
    website: 'https://nitas.ac.in/',
  },
  {
    id: 'apex',
    name: 'Apex Institute of Engineering & Technology',
    nativeName: 'एपेक्स इंस्टीट्यूट ऑफ इंजीनियरिंग',
    shortName: 'AIET',
    subTitle: 'Affiliated to State Technological University • Approved by AICTE',
    accreditation: 'NBA Tier-1 Accredited Programs • NAAC Grade A+',
    academicSession: 'AY 2026–2027',
    portalTitle: 'Campus ERP & Student Redressal Portal',
    supportEmail: 'dean.studentaffairs@aiet.edu.in',
    helpline: '+91 (020) 2420-5500',
    address: 'University Road, Knowledge City, Pune',
    code: 'AIET-PUNE-304',
    website: 'https://aiet.edu.in/',
  },
];

export const BrandProvider = ({ children }) => {
  const [institution, setInstitution] = useState(() => {
    const saved = localStorage.getItem('campus_brand_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If previously saved under old default, upgrade smoothly to GTU
        if (parsed.id === 'gtu') return parsed;
      } catch (e) {
        console.error('Error parsing brand config', e);
      }
    }
    // Default flagship institution is Gujarat Technological University
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
    localStorage.setItem('campus_brand_config', JSON.stringify(INSTITUTIONAL_PRESETS[0]));
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
