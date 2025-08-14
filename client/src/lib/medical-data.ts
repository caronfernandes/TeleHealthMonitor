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
    label: 'Lymphadenopathy', 
    type: 'select', 
    options: ['Present', 'Absent', 'Cervical', 'Axillary', 'Inguinal', 'Generalized']
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
    label: 'Chest findings', 
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
    label: 'Neurological signs', 
    type: 'textarea', 
    placeholder: 'Describe any neurological abnormalities...'
  },
  { 
    id: 'joints', 
    label: 'Joint swelling / redness', 
    type: 'textarea', 
    placeholder: 'Describe joint involvement, location...'
  }
];

export const investigationOptions = [
  { id: 'cbc', name: 'CBC', hasValues: true, values: ['Hb', 'TLC', 'Platelets', 'DLC'] },
  { id: 'lft', name: 'SGOT/SGPT', hasValues: true, values: ['SGOT', 'SGPT', 'Bilirubin'] },
  { id: 'ana', name: 'ANA', hasValues: true, values: ['Pattern', 'Titre'] },
  { id: 'creat', name: 'Creat', hasValues: true, values: ['Creatinine', 'Urea'] },
  { id: 'rf', name: 'RF', hasValues: true, values: ['RF value'] },
  { id: 'acpa', name: 'ACPA', hasValues: true, values: ['ACPA value'] },
  { id: 'blood_culture', name: 'Blood culture', hasValues: true, values: ['Organism', 'Sensitivity'] },
  { id: 'urine_routine', name: 'Urine routine', hasValues: true, values: ['Protein', 'Sugar', 'Pus cells', 'RBC'] },
  { id: 'chest_xray', name: 'Chest X-ray', hasValues: true, values: ['Findings'] },
  { id: 'ecg', name: 'ECG', hasValues: true, values: ['Rate', 'Rhythm', 'Findings'] },
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

export const getRedFlags = (examinationValues: Record<string, string>) => {
  const flags = [];
  
  // Temperature-based red flags
  const temp = parseFloat(examinationValues.temperature);
  if (temp > 104) { // >40°C
    flags.push({ text: `High-grade fever: ${temp}°F`, critical: true, source: 'temperature' });
  }
  if (temp < 95) { // <35°C
    flags.push({ text: `Hypothermia: ${temp}°F`, critical: true, source: 'temperature' });
  }
  
  // Blood pressure red flags
  const bp = examinationValues.bp;
  if (bp) {
    const bpMatch = bp.match(/(\d+)\/(\d+)/);
    if (bpMatch) {
      const systolic = parseInt(bpMatch[1]);
      const diastolic = parseInt(bpMatch[2]);
      if (systolic < 90) {
        flags.push({ text: `Hypotension: ${bp} mmHg`, critical: true, source: 'bp' });
      }
      if (systolic > 180 || diastolic > 110) {
        flags.push({ text: `Hypertensive crisis: ${bp} mmHg`, critical: true, source: 'bp' });
      }
    }
  }
  
  // Pulse rate red flags
  const pulse = parseInt(examinationValues.pulse);
  if (pulse > 120) {
    flags.push({ text: `Tachycardia: ${pulse}/min`, critical: false, source: 'pulse' });
  }
  if (pulse < 50) {
    flags.push({ text: `Bradycardia: ${pulse}/min`, critical: false, source: 'pulse' });
  }
  
  // Respiratory rate red flags
  const rr = parseInt(examinationValues.respiratory_rate);
  if (rr > 24) {
    flags.push({ text: `Tachypnea: ${rr}/min`, critical: false, source: 'respiratory_rate' });
  }
  if (rr < 8) {
    flags.push({ text: `Bradypnea: ${rr}/min`, critical: true, source: 'respiratory_rate' });
  }
  
  // Clinical findings red flags
  if (examinationValues.pallor === 'Severe') {
    flags.push({ text: 'Severe pallor detected', critical: true, source: 'pallor' });
  }
  
  if (examinationValues.icterus === 'Severe') {
    flags.push({ text: 'Severe icterus detected', critical: false, source: 'icterus' });
  }
  
  if (examinationValues.lymphadenopathy === 'Generalized') {
    flags.push({ text: 'Generalized lymphadenopathy', critical: false, source: 'lymphadenopathy' });
  }
  
  // Text-based red flags (keywords in descriptions)
  if (examinationValues.chest && examinationValues.chest.toLowerCase().includes('wheeze')) {
    flags.push({ text: 'Wheezing detected', critical: false, source: 'chest' });
  }
  
  if (examinationValues.abdomen && examinationValues.abdomen.toLowerCase().includes('rigid')) {
    flags.push({ text: 'Abdominal rigidity', critical: true, source: 'abdomen' });
  }
  
  if (examinationValues.neurological && 
      (examinationValues.neurological.toLowerCase().includes('seizure') || 
       examinationValues.neurological.toLowerCase().includes('unconscious'))) {
    flags.push({ text: 'Neurological emergency signs', critical: true, source: 'neurological' });
  }
  
  return flags;
};
