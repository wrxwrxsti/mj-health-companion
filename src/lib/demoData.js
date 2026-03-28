// Demo seed data matching the PRD Section 6
// Used when Supabase is not configured

export const demoMedications = [
  { id: '1', name: 'Mycophenolate Mofetil (MMF)', generic_name: 'Mycophenolate Mofetil', dosage: '500mg', frequency: '2 tabs BD (1hr before meals)', route: 'oral', timing: '1hr before meals', is_active: true, notes: 'Started Oct 2025, replaced Azathioprine', category: 'immunosuppressant', start_date: '2025-10-06', end_date: null, prescribed_by: null, prescribed_date: null },
  { id: '2', name: 'Prednisolone', generic_name: 'Prednisolone', dosage: '5mg', frequency: 'OD', route: 'oral', timing: '7am', is_active: true, notes: 'Tapering: 20mg->15->12.5->10->7.5->5mg', category: 'steroid', start_date: '2025-06-05', end_date: null, prescribed_by: null, prescribed_date: null },
  { id: '3', name: 'Septran DS', generic_name: 'Sulfamethoxazole/Trimethoprim', dosage: '1 tab', frequency: 'Every alternate day', route: 'oral', timing: null, is_active: true, notes: 'PCP prophylaxis while immunosuppressed', category: 'prophylaxis', start_date: '2025-06-08', end_date: null, prescribed_by: null, prescribed_date: null },
  { id: '4', name: 'Pantop', generic_name: 'Pantoprazole', dosage: '40mg', frequency: 'OD BBF', route: 'oral', timing: 'Before breakfast', is_active: true, notes: 'Gastric protection with steroids', category: 'GI_protection', start_date: '2025-06-08', end_date: null, prescribed_by: null, prescribed_date: null },
  { id: '5', name: 'Shelcal', generic_name: 'Calcium Carbonate', dosage: '500mg', frequency: 'OD', route: 'oral', timing: null, is_active: true, notes: 'Calcium with steroid use', category: 'supplement', start_date: '2025-06-08', end_date: null, prescribed_by: null, prescribed_date: null },
  { id: '6', name: 'Vitamin D3', generic_name: 'Cholecalciferol', dosage: '60000 IU', frequency: 'Once monthly', route: 'oral', timing: null, is_active: true, notes: 'Monthly dose', category: 'supplement', start_date: '2025-06-08', end_date: null, prescribed_by: null, prescribed_date: null },
  { id: '7', name: 'Naproxen', generic_name: 'Naproxen', dosage: '250mg', frequency: 'SOS', route: 'oral', timing: null, is_active: true, notes: 'As needed for pain', category: 'analgesic', start_date: '2025-06-08', end_date: null, prescribed_by: null, prescribed_date: null },
  { id: '8', name: 'MPS Pulse (Methylprednisolone)', generic_name: 'Methylprednisolone', dosage: '250mg x 3', frequency: '3 days', route: 'IV', timing: null, is_active: false, notes: 'IV pulse steroids', category: 'steroid', start_date: '2025-06-05', end_date: '2025-06-07', prescribed_by: null, prescribed_date: null },
  { id: '9', name: 'ELNT CYC Dose 1', generic_name: 'Cyclophosphamide', dosage: '500mg', frequency: 'Single dose', route: 'IV', timing: null, is_active: false, notes: 'ELNT protocol', category: 'immunosuppressant', start_date: '2025-06-07', end_date: '2025-06-07', prescribed_by: null, prescribed_date: null },
  { id: '10', name: 'ELNT CYC Dose 2', generic_name: 'Cyclophosphamide', dosage: '500mg', frequency: 'Single dose', route: 'IV', timing: null, is_active: false, notes: 'ELNT protocol', category: 'immunosuppressant', start_date: '2025-06-20', end_date: '2025-06-20', prescribed_by: null, prescribed_date: null },
  { id: '11', name: 'ELNT CYC Dose 3', generic_name: 'Cyclophosphamide', dosage: '500mg', frequency: 'Single dose', route: 'IV', timing: null, is_active: false, notes: 'ELNT protocol', category: 'immunosuppressant', start_date: '2025-07-04', end_date: '2025-07-04', prescribed_by: null, prescribed_date: null },
  { id: '12', name: 'ELNT CYC Dose 4', generic_name: 'Cyclophosphamide', dosage: '500mg', frequency: 'Single dose', route: 'IV', timing: null, is_active: false, notes: 'ELNT protocol', category: 'immunosuppressant', start_date: '2025-07-18', end_date: '2025-07-18', prescribed_by: null, prescribed_date: null },
  { id: '13', name: 'ELNT CYC Dose 5', generic_name: 'Cyclophosphamide', dosage: '500mg', frequency: 'Single dose', route: 'IV', timing: null, is_active: false, notes: 'ELNT protocol. Wt: 60.6kg', category: 'immunosuppressant', start_date: '2025-08-01', end_date: '2025-08-01', prescribed_by: null, prescribed_date: null },
  { id: '14', name: 'ELNT CYC Dose 6', generic_name: 'Cyclophosphamide', dosage: '500mg', frequency: 'Single dose', route: 'IV', timing: null, is_active: false, notes: 'ELNT protocol. Wt: 62.5kg, ESR 13, improving. Final dose.', category: 'immunosuppressant', start_date: '2025-08-18', end_date: '2025-08-18', prescribed_by: null, prescribed_date: null },
]

export const demoTimelineEvents = [
  { id: '1', event_date: '2024-04-01', event_type: 'symptom_onset', title: 'Joint pain onset', description: 'Joint pain onset in knees, ankles, shoulders, and hands', hospital: null, department: null, severity: 'medium', doctor_name: null },
  { id: '2', event_date: '2025-04-26', event_type: 'flare_up', title: 'Sudden blurring left eye', description: 'Sudden blurring left eye, vision 6/60', hospital: null, department: 'ophthalmology', severity: 'critical', doctor_name: null },
  { id: '3', event_date: '2025-04-27', event_type: 'procedure', title: 'Right eye macular hole surgical repair', description: 'Macular hole surgical repair performed on right eye', hospital: null, department: 'ophthalmology', severity: 'high', doctor_name: null },
  { id: '4', event_date: '2025-04-28', event_type: 'procedure', title: 'Intravitreal steroid injections', description: 'Intravitreal steroid injections to left eye', hospital: null, department: 'ophthalmology', severity: 'high', doctor_name: null },
  { id: '5', event_date: '2025-05-15', event_type: 'flare_up', title: 'Ankle swelling, difficulty walking', description: 'Ankle swelling developed, causing difficulty walking', hospital: null, department: null, severity: 'high', doctor_name: null },
  { id: '6', event_date: '2025-05-26', event_type: 'flare_up', title: 'Fever, parotid swelling, leukocytosis', description: 'Fever, parotid swelling, leukocytosis (WBC 46,000)', hospital: null, department: null, severity: 'critical', doctor_name: null },
  { id: '7', event_date: '2025-05-31', event_type: 'admission', title: 'Admitted SGPGI Immunology', description: 'Admitted to SGPGI Immunology department for workup and treatment', hospital: 'SGPGI Lucknow', department: 'immunology', severity: 'high', doctor_name: null },
  { id: '8', event_date: '2025-06-05', event_type: 'procedure', title: 'Sural nerve biopsy (left)', description: 'Left sural nerve biopsy performed. Confirmed vasculitic neuropathy.', hospital: 'SGPGI Lucknow', department: 'neurology', severity: 'high', doctor_name: null },
  { id: '9', event_date: '2025-06-05', event_type: 'test', title: 'Whole exome sequencing sample sent', description: 'WES sample sent for genetic analysis', hospital: 'SGPGI Lucknow', department: 'genetics', severity: 'medium', doctor_name: null },
  { id: '10', event_date: '2025-06-07', event_type: 'infusion', title: '1st CYC dose + MPS pulse completed', description: 'First cyclophosphamide dose (500mg IV) along with methylprednisolone pulse therapy completed', hospital: 'SGPGI Lucknow', department: 'immunology', severity: 'high', doctor_name: null },
  { id: '11', event_date: '2025-06-08', event_type: 'discharge', title: 'Discharged SGPGI', description: 'Discharged from SGPGI after initial treatment', hospital: 'SGPGI Lucknow', department: 'immunology', severity: 'low', doctor_name: null },
  { id: '12', event_date: '2025-06-20', event_type: 'infusion', title: '2nd CYC dose', description: 'Second cyclophosphamide dose (500mg IV). Thalassemia trait confirmed.', hospital: 'SGPGI Lucknow', department: 'immunology', severity: 'medium', doctor_name: null },
  { id: '13', event_date: '2025-07-04', event_type: 'infusion', title: '3rd CYC dose', description: 'Third cyclophosphamide dose (500mg IV)', hospital: 'SGPGI Lucknow', department: 'immunology', severity: 'medium', doctor_name: null },
  { id: '14', event_date: '2025-07-18', event_type: 'infusion', title: '4th CYC dose', description: 'Fourth cyclophosphamide dose (500mg IV)', hospital: 'SGPGI Lucknow', department: 'immunology', severity: 'medium', doctor_name: null },
  { id: '15', event_date: '2025-08-01', event_type: 'infusion', title: '5th CYC dose', description: 'Fifth cyclophosphamide dose (500mg IV). Weight: 60.6kg', hospital: 'SGPGI Lucknow', department: 'immunology', severity: 'medium', doctor_name: null },
  { id: '16', event_date: '2025-08-18', event_type: 'infusion', title: '6th CYC dose (final)', description: 'Final cyclophosphamide dose (500mg IV). Weight: 62.5kg, ESR 13. Neuropathy improving.', hospital: 'SGPGI Lucknow', department: 'immunology', severity: 'medium', doctor_name: null },
  { id: '17', event_date: '2025-09-22', event_type: 'follow_up', title: 'Follow-up, no new issues', description: 'Routine follow-up visit. No new complaints or issues.', hospital: 'SGPGI Lucknow', department: 'immunology', severity: 'low', doctor_name: null },
  { id: '18', event_date: '2025-10-06', event_type: 'medication_change', title: 'Started MMF, stopped Azathioprine', description: 'Switched from Azathioprine to Mycophenolate Mofetil (MMF) for maintenance immunosuppression', hospital: 'SGPGI Lucknow', department: 'immunology', severity: 'medium', doctor_name: null },
  { id: '19', event_date: '2025-10-24', event_type: 'flare_up', title: 'Fever 102F, preauricular swelling', description: 'Fever of 102F with preauricular swelling', hospital: null, department: null, severity: 'high', doctor_name: null },
  { id: '20', event_date: '2025-11-15', event_type: 'diagnosis', title: 'TNFAIP3 mutation confirmed', description: 'WES result received. Heterozygous TNFAIP3 mutation confirmed (c.1979G>A, Exon 8). Clinically significant.', hospital: 'SGPGI Lucknow', department: 'genetics', severity: 'critical', doctor_name: null },
]

export const demoLabResults = [
  { id: '1', test_date: '2025-05-31', test_name: 'Hemoglobin', value: 7.6, unit: 'g/dL', ref_range_low: 12.0, ref_range_high: 15.0, is_abnormal: true, source: 'SGPGI' },
  { id: '2', test_date: '2025-05-31', test_name: 'TLC', value: 12.6, unit: 'x1000/uL', ref_range_low: 4, ref_range_high: 10, is_abnormal: true, source: 'SGPGI' },
  { id: '3', test_date: '2025-05-31', test_name: 'Platelets', value: 400, unit: 'x1000', ref_range_low: 150, ref_range_high: 410, is_abnormal: false, source: 'SGPGI' },
  { id: '4', test_date: '2025-05-31', test_name: 'ESR', value: 87, unit: 'mm/hr', ref_range_low: 0, ref_range_high: 12, is_abnormal: true, source: 'SGPGI' },
  { id: '5', test_date: '2025-06-01', test_name: 'Hemoglobin', value: 6.7, unit: 'g/dL', ref_range_low: 12.0, ref_range_high: 15.0, is_abnormal: true, source: 'SGPGI' },
  { id: '6', test_date: '2025-06-01', test_name: 'TLC', value: 21.67, unit: 'x1000/uL', ref_range_low: 4, ref_range_high: 10, is_abnormal: true, source: 'SGPGI' },
  { id: '7', test_date: '2025-06-01', test_name: 'Platelets', value: 411, unit: 'x1000', ref_range_low: 150, ref_range_high: 410, is_abnormal: true, source: 'SGPGI' },
  { id: '8', test_date: '2025-06-01', test_name: 'ESR', value: 36, unit: 'mm/hr', ref_range_low: 0, ref_range_high: 12, is_abnormal: true, source: 'SGPGI' },
  { id: '9', test_date: '2025-06-04', test_name: 'Hemoglobin', value: 8.1, unit: 'g/dL', ref_range_low: 12.0, ref_range_high: 15.0, is_abnormal: true, source: 'SGPGI' },
  { id: '10', test_date: '2025-06-04', test_name: 'TLC', value: 22.93, unit: 'x1000/uL', ref_range_low: 4, ref_range_high: 10, is_abnormal: true, source: 'SGPGI' },
  { id: '11', test_date: '2025-06-04', test_name: 'Platelets', value: 486, unit: 'x1000', ref_range_low: 150, ref_range_high: 410, is_abnormal: true, source: 'SGPGI' },
  { id: '12', test_date: '2025-08-18', test_name: 'ESR', value: 13, unit: 'mm/hr', ref_range_low: 0, ref_range_high: 12, is_abnormal: true, source: 'SGPGI' },
  { id: '13', test_date: '2026-03-12', test_name: 'Hemoglobin', value: 9.2, unit: 'g/dL', ref_range_low: 12.0, ref_range_high: 15.0, is_abnormal: true, source: 'Tata 1mg Labs' },
  { id: '14', test_date: '2026-03-12', test_name: 'TLC', value: 9.48, unit: 'x1000/uL', ref_range_low: 4, ref_range_high: 10, is_abnormal: false, source: 'Tata 1mg Labs' },
  { id: '15', test_date: '2026-03-12', test_name: 'Platelets', value: 415, unit: 'x1000', ref_range_low: 150, ref_range_high: 410, is_abnormal: true, source: 'Tata 1mg Labs' },
  { id: '16', test_date: '2026-03-12', test_name: 'ESR', value: 32, unit: 'mm/hr', ref_range_low: 0, ref_range_high: 12, is_abnormal: true, source: 'Tata 1mg Labs' },
]

export const demoAppointments = []

export const demoDocuments = []
