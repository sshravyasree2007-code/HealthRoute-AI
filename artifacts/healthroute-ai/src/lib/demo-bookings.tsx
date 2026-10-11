import { createContext, useContext, useRef, useState, type ReactNode } from 'react';

export type DemoBookingInput = {
  doctorId: string;
  doctorName: string;
  specialization: string;
  hospital: string;
  slotId: string;
  slotLabel: string;
  estimatedWaitMinutes: number;
  slotInitiallyAvailable: boolean;
};

export type DemoBooking = Omit<DemoBookingInput, 'slotInitiallyAvailable'> & {
  token: string;
};

export type DemoBookingResult =
  | { status: 'booked'; booking: DemoBooking }
  | { status: 'unavailable' }
  | { status: 'already-booked' };

type DemoBookingContextValue = {
  bookings: DemoBooking[];
  bookDemoSlot: (input: DemoBookingInput) => DemoBookingResult;
};

const DemoBookingContext = createContext<DemoBookingContextValue | null>(null);

export function DemoBookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<DemoBooking[]>([]);
  const bookingsRef = useRef<DemoBooking[]>([]);
  const nextTokenNumber = useRef(1);

  function bookDemoSlot(input: DemoBookingInput): DemoBookingResult {
    if (!input.slotInitiallyAvailable) return { status: 'unavailable' };
    if (bookingsRef.current.some((booking) => booking.slotId === input.slotId)) {
      return { status: 'already-booked' };
    }

    let token = '';
    do {
      token = `HR-DEMO-${String(nextTokenNumber.current).padStart(4, '0')}`;
      nextTokenNumber.current += 1;
    } while (bookingsRef.current.some((booking) => booking.token === token));

    const { slotInitiallyAvailable: _slotInitiallyAvailable, ...bookingDetails } = input;
    const booking: DemoBooking = { ...bookingDetails, token };
    const nextBookings = [...bookingsRef.current, booking];
    bookingsRef.current = nextBookings;
    setBookings(nextBookings);
    return { status: 'booked', booking };
  }

  return (
    <DemoBookingContext.Provider value={{ bookings, bookDemoSlot }}>
      {children}
    </DemoBookingContext.Provider>
  );
}

export function useDemoBookings() {
  const context = useContext(DemoBookingContext);
  if (!context) {
    throw new Error('Doctor booking pages must be rendered inside DemoBookingProvider.');
  }
  return context;
}
