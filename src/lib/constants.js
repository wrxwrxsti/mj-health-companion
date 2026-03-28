export const SEVERITY_COLORS = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200',
}

export const SEVERITY_DOT_COLORS = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
}

export const DEPARTMENT_COLORS = {
  immunology: 'bg-blue-100 text-blue-700',
  ophthalmology: 'bg-emerald-100 text-emerald-700',
  neurology: 'bg-purple-100 text-purple-700',
  pathology: 'bg-gray-100 text-gray-700',
  genetics: 'bg-pink-100 text-pink-700',
}

export const CATEGORY_COLORS = {
  immunosuppressant: 'bg-blue-100 text-blue-700',
  steroid: 'bg-amber-100 text-amber-700',
  prophylaxis: 'bg-teal-100 text-teal-700',
  supplement: 'bg-green-100 text-green-700',
  analgesic: 'bg-red-100 text-red-700',
  GI_protection: 'bg-purple-100 text-purple-700',
}

export const DOC_TYPE_LABELS = {
  discharge_summary: 'Discharge Summary',
  blood_test: 'Blood Test',
  imaging: 'Imaging',
  prescription: 'Prescription',
  biopsy: 'Biopsy',
  genetic_test: 'Genetic Test',
  urine_test: 'Urine Test',
  other: 'Other',
}

export const EVENT_TYPE_LABELS = {
  diagnosis: 'Diagnosis',
  admission: 'Admission',
  discharge: 'Discharge',
  test: 'Test',
  procedure: 'Procedure',
  medication_change: 'Medication Change',
  flare_up: 'Flare Up',
  improvement: 'Improvement',
  infusion: 'Infusion',
  follow_up: 'Follow Up',
  symptom_onset: 'Symptom Onset',
}

export const HEALTH_BRIEF = {
  doctor: `Patient: Mahak Jahan Aara, 20F. Dx: Undifferentiated vasculitis (ANCA-negative) with left eye panuveitis, retinal vasculitis; right eye macular hole (post-surgical repair); bilateral lower limb inflammatory edema; mononeuritis multiplex (NCV: reduced CMAPs bilateral ulnar motor and bilateral sural nerves); vasculitic neuropathy confirmed on sural nerve biopsy. Thalassemia trait (HbA2 5.7%). WES: Heterozygous TNFAIP3 mutation (c.1979G>A, Exon 8). Rx: Completed 6 cycles IV Cyclophosphamide (ELNT protocol, 500mg q2w, June-August 2025). Currently on Mycophenolate Mofetil (MMF) 500mg BD as maintenance, Prednisolone tapering (last documented 5mg OD). Septran DS prophylaxis alternate days. Labs (March 2026): Hgb 9.2 g/dL (microcytic, MCV 60.2 fL, consistent with thalassemia trait), ESR 32 mm/hr (elevated but trending down from 87 at admission), Platelets 415 (borderline). Urine R/M normal, no proteinuria. Status: Neuropathy improving. No active aches. Intrinsic hand muscle weakness improving. Weight 62.5-63.1 kg. Under care of Immunology Dept, SGPGI Lucknow.`,
  simple: `MJ has a condition called undifferentiated vasculitis — this means her immune system sometimes attacks her own blood vessels by mistake, causing inflammation in different parts of her body. It has affected her left eye (inflammation inside the eye and in the retinal blood vessels), her right eye (a hole in the retina that was surgically repaired), her legs (swelling), and her nerves (numbness and weakness in hands and feet). A genetic test found a specific gene change (TNFAIP3) that may be connected to this condition. She also carries a thalassemia trait, which means her red blood cells are smaller than normal and she tends to have lower hemoglobin — this is not the same as thalassemia disease and is usually manageable.

She completed a strong treatment course (6 rounds of cyclophosphamide, a powerful immune-suppressing medicine given through IV) between June-August 2025. Now she is on a milder maintenance medicine called Mycophenolate (MMF) and a low dose of Prednisolone (a steroid that is being gradually reduced). Her nerve symptoms are improving, and her latest blood tests show her inflammation markers are coming down. She continues to be monitored at SGPGI Lucknow.`,
}
