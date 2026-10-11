import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { demoMedicines, demoPharmacies, type DemoMedicine } from '@/data/demo-pharmacy-inventory';

export type DemoPharmacyOrder = {
  reference: string;
  pharmacyId: string;
  pharmacyName: string;
  medicineId: string;
  medicineName: string;
  strength: string;
  dosageForm: string;
  quantity: number;
};

export type DemoPharmacyOrderInput = {
  pharmacyId: string;
  medicineId: string;
  quantity: number;
};

export type DemoPharmacyOrderResult =
  | { status: 'requested'; order: DemoPharmacyOrder }
  | { status: 'invalid-quantity' | 'unknown-item' | 'insufficient-stock' | 'duplicate'; remaining?: number };

type PharmacyOrderContextValue = {
  orders: DemoPharmacyOrder[];
  getRemainingStock: (medicineId: string) => number;
  requestDemoOrder: (input: DemoPharmacyOrderInput) => DemoPharmacyOrderResult;
};

const PharmacyOrderContext = createContext<PharmacyOrderContextValue | null>(null);

export function DemoPharmacyOrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<DemoPharmacyOrder[]>([]);
  const ordersRef = useRef<DemoPharmacyOrder[]>([]);
  const stockRef = useRef<Record<string, number>>(
    Object.fromEntries(demoMedicines.map((medicine) => [medicine.id, medicine.demoStockCount])),
  );
  const sequenceRef = useRef(0);

  function requestDemoOrder(input: DemoPharmacyOrderInput): DemoPharmacyOrderResult {
    if (!Number.isInteger(input.quantity) || input.quantity <= 0) return { status: 'invalid-quantity' };
    const medicine = demoMedicines.find((item) => item.id === input.medicineId && item.pharmacyId === input.pharmacyId);
    if (!medicine) return { status: 'unknown-item' };
    const remaining = stockRef.current[medicine.id] ?? 0;
    if (ordersRef.current.some((order) =>
      order.pharmacyId === input.pharmacyId
      && order.medicineId === input.medicineId
      && order.quantity === input.quantity,
    )) return { status: 'duplicate', remaining };
    if (input.quantity > remaining) return { status: 'insufficient-stock', remaining };

    stockRef.current[medicine.id] = remaining - input.quantity;
    sequenceRef.current += 1;
    const pharmacyName = demoPharmacies.find((pharmacy) => pharmacy.id === input.pharmacyId)?.name ?? 'Fictional pharmacy (demo)';
    const order: DemoPharmacyOrder = {
      reference: `HR-MED-${String(sequenceRef.current).padStart(4, '0')}`,
      pharmacyId: input.pharmacyId,
      pharmacyName,
      medicineId: medicine.id,
      medicineName: medicine.name,
      strength: medicine.strength,
      dosageForm: medicine.dosageForm,
      quantity: input.quantity,
    };
    const nextOrders = [order, ...ordersRef.current];
    ordersRef.current = nextOrders;
    setOrders(nextOrders);
    return { status: 'requested', order };
  }

  const getRemainingStock = (medicineId: string) => {
    const medicine: DemoMedicine | undefined = demoMedicines.find((item) => item.id === medicineId);
    return medicine ? stockRef.current[medicineId] ?? medicine.demoStockCount : 0;
  };
  const value = useMemo(() => ({ orders, getRemainingStock, requestDemoOrder }), [orders]);

  return <PharmacyOrderContext.Provider value={value}>{children}</PharmacyOrderContext.Provider>;
}

export function useDemoPharmacyOrders() {
  const context = useContext(PharmacyOrderContext);
  if (!context) throw new Error('useDemoPharmacyOrders must be used within DemoPharmacyOrderProvider.');
  return context;
}
