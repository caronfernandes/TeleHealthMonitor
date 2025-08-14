// Symptom data structure based on IC4 medical guidelines
export const symptoms = [
  { 
    id: 'fever', 
    label: 'Fever', 
    icon: 'fas fa-thermometer-half', 
    color: 'bg-medical-blue', 
    description: 'Pyrexia', 
    note: 'Most common presentation',
    details: {
      duration: ['<3 days', '3–7 days', '> 7 days', 'Intermittent', 'Persistent', 'Recurrent'],
      pattern: ['Continuous', 'Intermittent', 'Remittent', 'Quotidian', 'Step-ladder', 'Relapsing'],
      response: ['Responds well', 'Temporary relief', 'No relief'],
      associated: ['Rash', 'Cough', 'Headache', 'Joint pain', 'Burning micturition', 'Vomiting', 'Abdominal pain', 'Sore throat', 'Weight loss', 'Night sweats'],
      rashTypes: ['Maculopapular', 'Petechial', 'Vesicular', 'Urticarial'],
      coughTypes: ['Dry', 'Productive', 'Hemoptysis'],
      jointPainTypes: ['Monoarticular', 'Polyarticular', 'Migratory'],
      burningMicturitionTypes: ['Associated with urgency', 'Flank pain'],
      abdominalPainTypes: ['Localized', 'Diffuse']
    }
  },
  { 
    id: 'cough', 
    label: 'Cough', 
    icon: 'fas fa-lungs', 
    color: 'bg-medical-green', 
    description: 'Respiratory symptom', 
    note: 'Common respiratory complaint',
    details: {
      onset: ['Acute (<3 weeks)', 'Subacute (3–8 weeks)', 'Chronic (>8 weeks)'],
      type: ['Dry', 'Productive'],
      sputumColor: ['White', 'Yellow', 'Green', 'Brown'],
      sputumQuantity: ['Scanty', 'Moderate', 'Copious'],
      hemoptysis: ['Streaky', 'Frank blood', 'Clots'],
      timing: ['Daytime predominant', 'Nighttime predominant', 'Continuous'],
      associated: ['Fever', 'Breathlessness', 'Wheezing', 'Chest pain', 'Weight loss', 'Voice change', 'Hemoptysis']
    }
  },
  { 
    id: 'weight_change', 
    label: 'Weight Loss/Gain', 
    icon: 'fas fa-weight', 
    color: 'bg-purple-500', 
    description: 'Weight change', 
    note: 'Constitutional symptom',
    details: {
      type: ['Weight loss', 'Weight gain'],
      onset: ['Sudden', 'Gradual'],
      weightLossAssociated: ['Fever', 'Night sweats', 'Cough', 'Diarrhea', 'Abdominal pain', 'Loss of appetite', 'Depression'],
      weightGainAssociated: ['Swelling of feet', 'Breathlessness', 'Menstrual irregularity', 'Mood changes']
    }
  },
  { 
    id: 'fatigue', 
    label: 'Fatigue/Malaise', 
    icon: 'fas fa-battery-quarter', 
    color: 'bg-medical-orange', 
    description: 'Fatigue and malaise', 
    note: 'General weakness',
    details: {
      onset: ['Sudden', 'Gradual'],
      relation: ['Worse in morning', 'Worse in evening', 'All day'],
      malaise: ['Intermittent', 'Continuous'],
      appetite: ['Partial loss', 'Complete loss'],
      associated: ['Fever', 'Joint pains', 'Rashes', 'Weight loss', 'Nausea', 'Early satiety']
    }
  },
  { 
    id: 'edema', 
    label: 'Edema', 
    icon: 'fas fa-tint', 
    color: 'bg-medical-red', 
    description: 'Fluid retention', 
    note: 'Localized or generalized',
    details: {
      type: ['Localised', 'Generalised'],
      site: ['Lower limb', 'Upper limb', 'Periorbital', 'Scrotal', 'Other'],
      laterality: ['Unilateral', 'Bilateral'],
      character: ['Pitting', 'Non-pitting'],
      pain: ['Painful', 'Painless'],
      associated: ['Breathlessness', 'Weight gain', 'Fatigue', 'Redness', 'Warmth']
    }
  },
  { 
    id: 'weakness', 
    label: 'Generalized Weakness', 
    icon: 'fas fa-tired', 
    color: 'bg-indigo-500', 
    description: 'Muscle weakness', 
    note: 'Neuromuscular symptom',
    details: {
      duration: ['Acute', 'Subacute', 'Chronic'],
      onset: ['Sudden', 'Gradual'],
      variation: ['Worse morning', 'Worse evening', 'Constant'],
      associated: ['Myalgia', 'Cramps', 'Breathlessness', 'Paresthesia']
    }
  }
];

export const examinationItems = [
  { 
    id: 'temperature', 
    label: 'Temperature (exact)', 
    type: 'input', 
    unit: '°F',
    placeholder: 'e.g., 101.2',
    normalRange: '98.6-99.5°F'
  },
  { 
    id: 'pulse', 
    label: 'Pulse rate & pattern', 
    type: 'input', 
    unit: '/min',
    placeholder: 'e.g., 92',
    normalRange: '60-100/min'
  },
  { 
    id: 'bp', 
    label: 'Blood pressure', 
    type: 'input', 
    unit: 'mmHg',
    placeholder: 'e.g., 120/80',
    normalRange: '<120/80 mmHg'
  },
  { 
    id: 'respiratory_rate', 
    label: 'Respiratory rate', 
    type: 'input', 
    unit: '/min',
    placeholder: 'e.g., 18',
    normalRange: '12-20/min'
  },
  { 
    id: 'oxygen_saturation', 
    label: 'Oxygen saturation (SpO2)', 
    type: 'input', 
    unit: '%',
    placeholder: 'e.g., 98',
    normalRange: '≥94%'
  },
  { 
    id: 'pallor', 
    label: 'Pallor', 
    type: 'select', 
    options: ['Present', 'Absent', 'Mild', 'Moderate', 'Severe']
  },
  { 
    id: 'icterus', 
    label: 'Icterus', 
    type: 'select', 
    options: ['Present', 'Absent', 'Mild', 'Moderate', 'Severe']
  },
  { 
    id: 'lymphadenopathy', 
    label: 'Lymphadenopathy (location, size, tenderness)', 
    type: 'textarea', 
    placeholder: 'Describe location, size, and tenderness of lymph nodes...'
  },
  { 
    id: 'rash', 
    label: 'Rash description & distribution', 
    type: 'textarea', 
    placeholder: 'Describe rash appearance, location, size...'
  },
  { 
    id: 'oral_ulcers', 
    label: 'Oral ulcers / pharyngitis', 
    type: 'select', 
    options: ['Present', 'Absent', 'Oral ulcers', 'Pharyngitis', 'Both']
  },
  { 
    id: 'chest', 
    label: 'Chest findings (crepitations, bronchial breathing)', 
    type: 'textarea', 
    placeholder: 'Describe breath sounds, adventitious sounds...'
  },
  { 
    id: 'abdomen', 
    label: 'Abdominal tenderness / organomegaly', 
    type: 'textarea', 
    placeholder: 'Describe tenderness, hepatomegaly, splenomegaly...'
  },
  { 
    id: 'neurological', 
    label: 'Neurological signs (meningism, focal deficits)', 
    type: 'textarea', 
    placeholder: 'Describe any neurological abnormalities...'
  },
  { 
    id: 'joints', 
    label: 'Joint swelling / redness / restriction of movement', 
    type: 'textarea', 
    placeholder: 'Describe joint involvement, location...'
  }
];

export const investigationOptions = [
  // Basic investigations for fever
  { id: 'cbc', name: 'CBC with Differential', hasValues: true, values: ['Hb', 'TLC', 'Platelets', 'DLC', 'ESR'] },
  { id: 'malaria', name: 'Peripheral smear for malaria (thick & thin)', hasValues: true, values: ['Result', 'Species'] },
  { id: 'malaria_antigen', name: 'Rapid Malaria Antigen Test', hasValues: true, values: ['Result'] },
  { id: 'urine_routine', name: 'Urine Routine & Culture', hasValues: true, values: ['Protein', 'Sugar', 'Pus cells', 'RBC', 'Culture'] },
  { id: 'blood_culture', name: 'Blood Cultures ×2 (before antibiotics)', hasValues: true, values: ['Organism', 'Sensitivity'] },
  { id: 'chest_xray', name: 'Chest X-ray', hasValues: true, values: ['Findings'] },
  
  // Viral/Bacterial panels
  { id: 'dengue', name: 'Dengue NS1, Dengue IgM', hasValues: true, values: ['NS1', 'IgM'] },
  { id: 'chikungunya', name: 'Chikungunya IgM & RNA PCR', hasValues: true, values: ['IgM', 'RNA PCR'] },
  { id: 'influenza', name: 'Influenza A/B & H1N1 PCR', hasValues: true, values: ['Influenza A', 'Influenza B', 'H1N1'] },
  { id: 'covid', name: 'COVID-19 RT-PCR / RAT', hasValues: true, values: ['RT-PCR', 'RAT'] },
  { id: 'respiratory_panel', name: 'Respiratory BioFire® multiplex PCR panel', hasValues: true, values: ['Results'] },
  { id: 'ebv_cmv', name: 'EBV IgM, CMV IgM', hasValues: true, values: ['EBV IgM', 'CMV IgM'] },
  { id: 'hiv', name: 'HIV ELISA / Rapid test', hasValues: true, values: ['Result'] },
  
  // Specific tests
  { id: 'typhoid', name: 'Widal / Typhidot / Salmonella PCR', hasValues: true, values: ['Widal', 'Typhidot', 'PCR'] },
  { id: 'scrub_typhus', name: 'Scrub Typhus IgM', hasValues: true, values: ['Result'] },
  { id: 'leptospira', name: 'Leptospira IgM / PCR', hasValues: true, values: ['IgM', 'PCR'] },
  { id: 'tb_tests', name: 'TB GeneXpert / IGRA', hasValues: true, values: ['GeneXpert', 'IGRA'] },
  { id: 'blood_smear', name: 'Blood smear for Babesia / other parasites', hasValues: true, values: ['Findings'] },
  { id: 'stool', name: 'Stool Routine & Culture (if GI symptoms)', hasValues: true, values: ['Routine', 'Culture'] },
  
  // Advanced imaging
  { id: 'usg_abdomen', name: 'Ultrasound Abdomen', hasValues: true, values: ['Findings'] },
  { id: 'ct_scan', name: 'CT chest/abdomen/pelvis', hasValues: true, values: ['Findings'] },
  { id: 'mri_brain', name: 'MRI brain (if neurological symptoms)', hasValues: true, values: ['Findings'] },
  { id: 'pet_ct', name: 'PET-CT (for PUO)', hasValues: true, values: ['Findings'] },
  
  // Additional tests
  { id: 'lft', name: 'LFT', hasValues: true, values: ['SGOT', 'SGPT', 'Bilirubin', 'ALP'] },
  { id: 'rft', name: 'RFT', hasValues: true, values: ['Creatinine', 'Urea', 'eGFR'] },
  { id: 'crp', name: 'CRP', hasValues: true, values: ['Value'] },
  { id: 'ana', name: 'ANA (IFA)', hasValues: true, values: ['Pattern', 'Titre'] },
  { id: 'others', name: 'Others', hasValues: false, values: [] }
];

export const frequencyOptions = [
  { label: 'Once Daily (OD)', value: 'OD', times: '1' },
  { label: 'Twice Daily (BD)', value: 'BD', times: '2' },
  { label: 'Three Times (TDS)', value: 'TDS', times: '3' },
  { label: 'Four Times (QDS)', value: 'QDS', times: '4' },
  { label: 'Every 4 hours', value: 'Q4H', times: '6' },
  { label: 'Every 6 hours', value: 'Q6H', times: '4' },
  { label: 'Every 8 hours', value: 'Q8H', times: '3' },
  { label: 'As needed (SOS)', value: 'SOS', times: 'PRN' }
];

export const durationOptions = [
  '3 Days', '5 Days', '7 Days', '10 Days', '14 Days', '21 Days', '1 Month', '2 Months', '3 Months', 'Ongoing'
];

export const instructionOptions = [
  'After food', 'Before food', 'With food', 'Empty stomach', 'At bedtime', 
  'Morning', 'Evening', 'With plenty of water', 'Avoid alcohol', 'Complete the course'
];

// Red flags based on IC4 medical guidelines
export const redFlagCriteria = [
  'Altered mental status / confusion',
  'Neck stiffness',
  'Petechiae / purpura', 
  'Hypotension (SBP <90 mmHg)',
  'SpO₂ <94%',
  'Persistent vomiting',
  'Severe abdominal pain',
  'Seizures',
  'Signs of shock (cold extremities, weak pulse)',
  'High-grade fever >40°C',
  'Immunosuppressed state (HIV, chemotherapy, transplant)'
];

export const getRedFlags = (examinationValues: Record<string, string>) => {
  const flags = [];
  
  // Temperature-based red flags
  const temp = parseFloat(examinationValues.temperature);
  if (temp > 104) { // >40°C
    flags.push({ text: `🚨 High-grade fever >40°C: ${temp}°F`, critical: true, source: 'temperature' });
  }
  if (temp < 95) { // <35°C
    flags.push({ text: `🚨 Hypothermia: ${temp}°F`, critical: true, source: 'temperature' });
  }
  
  // Blood pressure red flags - Hypotension
  const bp = examinationValues.bp;
  if (bp) {
    const bpMatch = bp.match(/(\d+)\/(\d+)/);
    if (bpMatch) {
      const systolic = parseInt(bpMatch[1]);
      const diastolic = parseInt(bpMatch[2]);
      if (systolic < 90) {
        flags.push({ text: `🚨 Hypotension (SBP <90 mmHg): ${bp}`, critical: true, source: 'bp' });
      }
      if (systolic > 180 || diastolic > 110) {
        flags.push({ text: `⚠️ Hypertensive crisis: ${bp} mmHg`, critical: false, source: 'bp' });
      }
    }
  }
  
  // Oxygen saturation red flag
  const spo2 = parseFloat(examinationValues.oxygen_saturation);
  if (spo2 < 94 && spo2 > 0) {
    flags.push({ text: `🚨 SpO₂ <94%: ${spo2}%`, critical: true, source: 'oxygen_saturation' });
  }
  
  // Pulse rate red flags
  const pulse = parseInt(examinationValues.pulse);
  if (pulse > 120) {
    flags.push({ text: `⚠️ Tachycardia: ${pulse}/min`, critical: false, source: 'pulse' });
  }
  if (pulse < 50) {
    flags.push({ text: `⚠️ Bradycardia: ${pulse}/min`, critical: false, source: 'pulse' });
  }
  
  // Respiratory rate red flags
  const rr = parseInt(examinationValues.respiratory_rate);
  if (rr > 24) {
    flags.push({ text: `⚠️ Tachypnea: ${rr}/min`, critical: false, source: 'respiratory_rate' });
  }
  if (rr < 8) {
    flags.push({ text: `🚨 Bradypnea: ${rr}/min`, critical: true, source: 'respiratory_rate' });
  }
  
  // Clinical findings red flags
  if (examinationValues.pallor === 'Severe') {
    flags.push({ text: '🚨 Severe pallor detected', critical: true, source: 'pallor' });
  }
  
  if (examinationValues.icterus === 'Severe') {
    flags.push({ text: '⚠️ Severe icterus detected', critical: false, source: 'icterus' });
  }
  
  // Text-based red flags (keywords in descriptions)
  const neurological = examinationValues.neurological?.toLowerCase() || '';
  if (neurological.includes('altered mental status') || neurological.includes('confusion')) {
    flags.push({ text: '🚨 Altered mental status / confusion', critical: true, source: 'neurological' });
  }
  if (neurological.includes('neck stiffness') || neurological.includes('meningism')) {
    flags.push({ text: '🚨 Neck stiffness (meningism)', critical: true, source: 'neurological' });
  }
  if (neurological.includes('seizure')) {
    flags.push({ text: '🚨 Seizures', critical: true, source: 'neurological' });
  }
  
  const rash = examinationValues.rash?.toLowerCase() || '';
  if (rash.includes('petechiae') || rash.includes('purpura')) {
    flags.push({ text: '🚨 Petechiae / purpura', critical: true, source: 'rash' });
  }
  
  const abdomen = examinationValues.abdomen?.toLowerCase() || '';
  if (abdomen.includes('severe') && abdomen.includes('pain')) {
    flags.push({ text: '🚨 Severe abdominal pain', critical: true, source: 'abdomen' });
  }
  if (abdomen.includes('rigid')) {
    flags.push({ text: '🚨 Abdominal rigidity', critical: true, source: 'abdomen' });
  }
  
  const chest = examinationValues.chest?.toLowerCase() || '';
  if (chest.includes('wheeze')) {
    flags.push({ text: '⚠️ Wheezing detected', critical: false, source: 'chest' });
  }
  
  // Check for signs of shock in pulse description
  const pulseDesc = examinationValues.pulse?.toLowerCase() || '';
  if (pulseDesc.includes('weak') || pulseDesc.includes('thready')) {
    flags.push({ text: '🚨 Signs of shock (weak pulse)', critical: true, source: 'pulse' });
  }
  
  return flags;
};
