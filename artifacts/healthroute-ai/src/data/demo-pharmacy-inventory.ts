export type PharmacyOpeningStatus = 'Open' | 'Closing soon' | 'Closed';

export type DemoPharmacy = {
  id: string;
  name: string;
  location: string;
  openingStatus: PharmacyOpeningStatus;
};

export type MedicineCategory =
  | 'Pain relief'
  | 'Cold & allergy'
  | 'Digestive care'
  | 'First aid'
  | 'Personal care';

export type DemoMedicine = {
  id: string;
  pharmacyId: string;
  name: string;
  category: MedicineCategory;
  strength: string;
  dosageForm: string;
  demoStockCount: number;
};

export const demoPharmacies: DemoPharmacy[] = [
  { id: 'willow-lane', name: 'Willow Lane Pharmacy (demo)', location: 'Northfield · Sample district', openingStatus: 'Open' },
  { id: 'harborlight', name: 'Harborlight Community Pharmacy (demo)', location: 'Riverside · Sample district', openingStatus: 'Closing soon' },
  { id: 'cedar-corner', name: 'Cedar Corner Pharmacy (demo)', location: 'Lakewood · Sample district', openingStatus: 'Closed' },
];

export const demoMedicines: DemoMedicine[] = [
  { id: 'willow-acetaminophen', pharmacyId: 'willow-lane', name: 'Acetaminophen', category: 'Pain relief', strength: '325 mg', dosageForm: 'Tablet', demoStockCount: 18 },
  { id: 'willow-saline', pharmacyId: 'willow-lane', name: 'Saline nasal spray', category: 'Cold & allergy', strength: '0.9%', dosageForm: 'Nasal spray', demoStockCount: 4 },
  { id: 'willow-antacid', pharmacyId: 'willow-lane', name: 'Calcium carbonate', category: 'Digestive care', strength: '500 mg', dosageForm: 'Chewable tablet', demoStockCount: 0 },
  { id: 'willow-bandage', pharmacyId: 'willow-lane', name: 'Adhesive bandages', category: 'First aid', strength: 'Assorted sizes', dosageForm: 'Bandage', demoStockCount: 32 },
  { id: 'harbor-ibuprofen', pharmacyId: 'harborlight', name: 'Ibuprofen', category: 'Pain relief', strength: '200 mg', dosageForm: 'Tablet', demoStockCount: 7 },
  { id: 'harbor-loratadine', pharmacyId: 'harborlight', name: 'Loratadine', category: 'Cold & allergy', strength: '10 mg', dosageForm: 'Tablet', demoStockCount: 3 },
  { id: 'harbor-oral-rehydration', pharmacyId: 'harborlight', name: 'Oral rehydration salts', category: 'Digestive care', strength: 'Single sachet', dosageForm: 'Powder sachet', demoStockCount: 11 },
  { id: 'harbor-hand-sanitizer', pharmacyId: 'harborlight', name: 'Hand sanitizer', category: 'Personal care', strength: '70% alcohol', dosageForm: 'Gel', demoStockCount: 5 },
  { id: 'cedar-antacid', pharmacyId: 'cedar-corner', name: 'Calcium carbonate', category: 'Digestive care', strength: '750 mg', dosageForm: 'Chewable tablet', demoStockCount: 6 },
  { id: 'cedar-cold-compress', pharmacyId: 'cedar-corner', name: 'Reusable cold compress', category: 'First aid', strength: 'Standard', dosageForm: 'Compress', demoStockCount: 0 },
  { id: 'cedar-moisturizer', pharmacyId: 'cedar-corner', name: 'Fragrance-free moisturizer', category: 'Personal care', strength: '100 mL', dosageForm: 'Cream', demoStockCount: 9 },
];
