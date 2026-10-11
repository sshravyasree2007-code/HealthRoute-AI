import { createContext, useContext, useRef, useState, type ReactNode } from 'react';

export type DemoLabBookingInput = {
  labId: string;
  labName: string;
  location: string;
  testName: string;
  slotId: string;
  slotLabel: string;
  estimatedQueueMinutes: number;
  slotInitiallyAvailable: boolean;
};

export type DemoLabBooking = Omit<DemoLabBookingInput, 'slotInitiallyAvailable'> & {
  reference: string;
};

export type DemoLabBookingResult =
  | { status: 'booked'; booking: DemoLabBooking }
  | { status: 'unavailable' }
  | { status: 'already-booked' };

type DemoLabBookingContextValue = {
  bookings: DemoLabBooking[];
  bookDemoLabSlot: (input: DemoLabBookingInput) => DemoLabBookingResult;
};

const DemoLabBookingContext = createContext<DemoLabBookingContextValue | null>(null);

export function DemoLabBookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<DemoLabBooking[]>([]);
  const bookingsRef = useRef<DemoLabBooking[]>([]);
  const nextReferenceNumber = useRef(1);

  function bookDemoLabSlot(input: DemoLabBookingInput): DemoLabBookingResult {
    if (!input.slotInitiallyAvailable) return { status: 'unavailable' };
    if (bookingsRef.current.some((booking) => booking.slotId === input.slotId)) {
      return { status: 'already-booked' };
    }

    let reference = '';
    do {
      reference = `LAB-DEMO-${String(nextReferenceNumber.current).padStart(4, '0')}`;
      nextReferenceNumber.current += 1;
    } while (bookingsRef.current.some((booking) => booking.reference === reference));

    const booking: DemoLabBooking = {
      labId: input.labId,
      labName: input.labName,
      location: input.location,
      testName: input.testName,
      slotId: input.slotId,
      slotLabel: input.slotLabel,
      estimatedQueueMinutes: input.estimatedQueueMinutes,
      reference,
    };
    const nextBookings = [...bookingsRef.current, booking];
    bookingsRef.current = nextBookings;
    setBookings(nextBookings);
    return { status: 'booked', booking };
  }

  return (
    <DemoLabBookingContext.Provider value={{ bookings, bookDemoLabSlot }}>
      {children}
    </DemoLabBookingContext.Provider>
  );
}

export function useDemoLabBookings() {
  const context = useContext(DemoLabBookingContext);
  if (!context) {
    throw new Error('Lab booking pages must be rendered inside DemoLabBookingProvider.');
  }
  return context;
}
