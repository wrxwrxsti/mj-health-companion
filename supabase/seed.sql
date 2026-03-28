-- Seed Data for MJ Health Companion
-- Run this after schema.sql in Supabase SQL Editor

-- Current Medications
INSERT INTO medications (name, generic_name, dosage, frequency, route, timing, is_active, notes, category, start_date) VALUES
('Mycophenolate Mofetil (MMF)', 'Mycophenolate Mofetil', '500mg', '2 tabs BD (1hr before meals)', 'oral', '1hr before meals', true, 'Started Oct 2025, replaced Azathioprine', 'immunosuppressant', '2025-10-06'),
('Prednisolone', 'Prednisolone', '5mg', 'OD', 'oral', '7am', true, 'Tapering: 20mg->15->12.5->10->7.5->5mg', 'steroid', '2025-06-05'),
('Septran DS', 'Sulfamethoxazole/Trimethoprim', '1 tab', 'Every alternate day', 'oral', NULL, true, 'PCP prophylaxis while immunosuppressed', 'prophylaxis', '2025-06-08'),
('Pantop', 'Pantoprazole', '40mg', 'OD BBF', 'oral', 'Before breakfast', true, 'Gastric protection with steroids', 'GI_protection', '2025-06-08'),
('Shelcal', 'Calcium Carbonate', '500mg', 'OD', 'oral', NULL, true, 'Calcium with steroid use', 'supplement', '2025-06-08'),
('Vitamin D3', 'Cholecalciferol', '60000 IU', 'Once monthly', 'oral', NULL, true, 'Monthly dose', 'supplement', '2025-06-08'),
('Naproxen', 'Naproxen', '250mg', 'SOS', 'oral', NULL, true, 'As needed for pain', 'analgesic', '2025-06-08');

-- Completed Treatments
INSERT INTO medications (name, generic_name, dosage, frequency, route, is_active, notes, category, start_date, end_date) VALUES
('MPS Pulse (Methylprednisolone)', 'Methylprednisolone', '250mg x 3', '3 days', 'IV', false, 'IV pulse steroids', 'steroid', '2025-06-05', '2025-06-07'),
('ELNT CYC Dose 1', 'Cyclophosphamide', '500mg', 'Single dose', 'IV', false, 'ELNT protocol', 'immunosuppressant', '2025-06-07', '2025-06-07'),
('ELNT CYC Dose 2', 'Cyclophosphamide', '500mg', 'Single dose', 'IV', false, 'ELNT protocol', 'immunosuppressant', '2025-06-20', '2025-06-20'),
('ELNT CYC Dose 3', 'Cyclophosphamide', '500mg', 'Single dose', 'IV', false, 'ELNT protocol', 'immunosuppressant', '2025-07-04', '2025-07-04'),
('ELNT CYC Dose 4', 'Cyclophosphamide', '500mg', 'Single dose', 'IV', false, 'ELNT protocol', 'immunosuppressant', '2025-07-18', '2025-07-18'),
('ELNT CYC Dose 5', 'Cyclophosphamide', '500mg', 'Single dose', 'IV', false, 'ELNT protocol. Wt: 60.6kg', 'immunosuppressant', '2025-08-01', '2025-08-01'),
('ELNT CYC Dose 6', 'Cyclophosphamide', '500mg', 'Single dose', 'IV', false, 'ELNT protocol. Wt: 62.5kg, ESR 13, improving. Final dose.', 'immunosuppressant', '2025-08-18', '2025-08-18');

-- Timeline Events
INSERT INTO timeline_events (event_date, event_type, title, description, hospital, department, severity) VALUES
('2024-04-01', 'symptom_onset', 'Joint pain onset', 'Joint pain onset in knees, ankles, shoulders, and hands', NULL, NULL, 'medium'),
('2025-04-26', 'flare_up', 'Sudden blurring left eye', 'Sudden blurring left eye, vision 6/60', NULL, 'ophthalmology', 'critical'),
('2025-04-27', 'procedure', 'Right eye macular hole surgical repair', 'Macular hole surgical repair performed on right eye', NULL, 'ophthalmology', 'high'),
('2025-04-28', 'procedure', 'Intravitreal steroid injections', 'Intravitreal steroid injections to left eye', NULL, 'ophthalmology', 'high'),
('2025-05-15', 'flare_up', 'Ankle swelling, difficulty walking', 'Ankle swelling developed, causing difficulty walking', NULL, NULL, 'high'),
('2025-05-26', 'flare_up', 'Fever, parotid swelling, leukocytosis', 'Fever, parotid swelling, leukocytosis (WBC 46,000)', NULL, NULL, 'critical'),
('2025-05-31', 'admission', 'Admitted SGPGI Immunology', 'Admitted to SGPGI Immunology department for workup and treatment', 'SGPGI Lucknow', 'immunology', 'high'),
('2025-06-05', 'procedure', 'Sural nerve biopsy (left)', 'Left sural nerve biopsy performed. Confirmed vasculitic neuropathy.', 'SGPGI Lucknow', 'neurology', 'high'),
('2025-06-05', 'test', 'Whole exome sequencing sample sent', 'WES sample sent for genetic analysis', 'SGPGI Lucknow', 'genetics', 'medium'),
('2025-06-07', 'infusion', '1st CYC dose + MPS pulse completed', 'First cyclophosphamide dose (500mg IV) along with methylprednisolone pulse therapy completed', 'SGPGI Lucknow', 'immunology', 'high'),
('2025-06-08', 'discharge', 'Discharged SGPGI', 'Discharged from SGPGI after initial treatment', 'SGPGI Lucknow', 'immunology', 'low'),
('2025-06-20', 'infusion', '2nd CYC dose', 'Second cyclophosphamide dose (500mg IV). Thalassemia trait confirmed.', 'SGPGI Lucknow', 'immunology', 'medium'),
('2025-07-04', 'infusion', '3rd CYC dose', 'Third cyclophosphamide dose (500mg IV)', 'SGPGI Lucknow', 'immunology', 'medium'),
('2025-07-18', 'infusion', '4th CYC dose', 'Fourth cyclophosphamide dose (500mg IV)', 'SGPGI Lucknow', 'immunology', 'medium'),
('2025-08-01', 'infusion', '5th CYC dose', 'Fifth cyclophosphamide dose (500mg IV). Weight: 60.6kg', 'SGPGI Lucknow', 'immunology', 'medium'),
('2025-08-18', 'infusion', '6th CYC dose (final)', 'Final cyclophosphamide dose (500mg IV). Weight: 62.5kg, ESR 13. Neuropathy improving.', 'SGPGI Lucknow', 'immunology', 'medium'),
('2025-09-22', 'follow_up', 'Follow-up, no new issues', 'Routine follow-up visit. No new complaints or issues.', 'SGPGI Lucknow', 'immunology', 'low'),
('2025-10-06', 'medication_change', 'Started MMF, stopped Azathioprine', 'Switched from Azathioprine to Mycophenolate Mofetil (MMF) for maintenance immunosuppression', 'SGPGI Lucknow', 'immunology', 'medium'),
('2025-10-24', 'flare_up', 'Fever 102F, preauricular swelling', 'Fever of 102F with preauricular swelling', NULL, NULL, 'high'),
('2025-11-15', 'diagnosis', 'TNFAIP3 mutation confirmed', 'WES result received. Heterozygous TNFAIP3 mutation confirmed (c.1979G>A, Exon 8). Clinically significant.', 'SGPGI Lucknow', 'genetics', 'critical');

-- Lab Results
INSERT INTO lab_results (test_date, test_name, value, unit, ref_range_low, ref_range_high, is_abnormal, source) VALUES
-- 31/05/2025
('2025-05-31', 'Hemoglobin', 7.6, 'g/dL', 12.0, 15.0, true, 'SGPGI'),
('2025-05-31', 'TLC', 12.6, 'x1000/uL', 4, 10, true, 'SGPGI'),
('2025-05-31', 'Platelets', 400, 'x1000', 150, 410, false, 'SGPGI'),
('2025-05-31', 'ESR', 87, 'mm/hr', 0, 12, true, 'SGPGI'),
('2025-05-31', 'CRP', 64.9, 'mg/L', 0, 5, true, 'SGPGI'),
('2025-05-31', 'Creatinine', 0.71, 'mg/dL', 0.6, 1.2, false, 'SGPGI'),
('2025-05-31', 'AST', 24, 'U/L', 0, 40, false, 'SGPGI'),
('2025-05-31', 'ALT', 23, 'U/L', 0, 40, false, 'SGPGI'),
-- 01/06/2025
('2025-06-01', 'Hemoglobin', 6.7, 'g/dL', 12.0, 15.0, true, 'SGPGI'),
('2025-06-01', 'TLC', 21.67, 'x1000/uL', 4, 10, true, 'SGPGI'),
('2025-06-01', 'Platelets', 411, 'x1000', 150, 410, true, 'SGPGI'),
('2025-06-01', 'ESR', 36, 'mm/hr', 0, 12, true, 'SGPGI'),
('2025-06-01', 'Creatinine', 0.52, 'mg/dL', 0.6, 1.2, true, 'SGPGI'),
('2025-06-01', 'AST', 22, 'U/L', 0, 40, false, 'SGPGI'),
('2025-06-01', 'ALT', 18, 'U/L', 0, 40, false, 'SGPGI'),
-- 04/06/2025
('2025-06-04', 'Hemoglobin', 8.1, 'g/dL', 12.0, 15.0, true, 'SGPGI'),
('2025-06-04', 'TLC', 22.93, 'x1000/uL', 4, 10, true, 'SGPGI'),
('2025-06-04', 'Platelets', 486, 'x1000', 150, 410, true, 'SGPGI'),
('2025-06-04', 'Creatinine', 0.52, 'mg/dL', 0.6, 1.2, true, 'SGPGI'),
('2025-06-04', 'AST', 22, 'U/L', 0, 40, false, 'SGPGI'),
('2025-06-04', 'ALT', 20, 'U/L', 0, 40, false, 'SGPGI'),
-- 18/08/2025
('2025-08-18', 'ESR', 13, 'mm/hr', 0, 12, true, 'SGPGI'),
('2025-08-18', 'Creatinine', 0.7, 'mg/dL', 0.6, 1.2, false, 'SGPGI'),
('2025-08-18', 'AST', 10, 'U/L', 0, 40, false, 'SGPGI'),
('2025-08-18', 'ALT', 13, 'U/L', 0, 40, false, 'SGPGI'),
-- 12/03/2026
('2026-03-12', 'Hemoglobin', 9.2, 'g/dL', 12.0, 15.0, true, 'Tata 1mg Labs'),
('2026-03-12', 'TLC', 9.48, 'x1000/uL', 4, 10, false, 'Tata 1mg Labs'),
('2026-03-12', 'Platelets', 415, 'x1000', 150, 410, true, 'Tata 1mg Labs'),
('2026-03-12', 'ESR', 32, 'mm/hr', 0, 12, true, 'Tata 1mg Labs');
