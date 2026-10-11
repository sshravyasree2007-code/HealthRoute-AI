import { useMemo, useState, type FormEvent } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Search,
  Stethoscope,
} from 'lucide-react';
import { DemoBanner } from '@/components/demo-banner';
import { useDemoBookings, type DemoBooking, type DemoBookingInput, type DemoBookingResult } from '@/lib/demo-bookings';

type DemoSlot = {
  id: string;
  label: string;
  initiallyAvailable: boolean;
};

type DemoDoctor = {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  estimatedWaitMinutes: number;
  slots: DemoSlot[];
};

const demoDoctors: DemoDoctor[] = [
  {
    id: 'amara-chen',
    name: 'Dr. Amara Chen',
    specialization: 'Cardiology',
    hospital: 'Willow Creek Community Hospital',
    estimatedWaitMinutes: 18,
    slots: [
      { id: 'amara-chen-2026-10-20-0930', label: 'Tue, Oct 20 · 9:30 am', initiallyAvailable: true },
      { id: 'amara-chen-2026-10-20-1115', label: 'Tue, Oct 20 · 11:15 am', initiallyAvailable: true },
      { id: 'amara-chen-2026-10-20-1400', label: 'Tue, Oct 20 · 2:00 pm', initiallyAvailable: false },
    ],
  },
  {
    id: 'mateo-singh',
    name: 'Dr. Mateo Singh',
    specialization: 'Orthopedics',
    hospital: 'Harborlight Medical Center',
    estimatedWaitMinutes: 26,
    slots: [
      { id: 'mateo-singh-2026-10-21-1000', label: 'Wed, Oct 21 · 10:00 am', initiallyAvailable: true },
      { id: 'mateo-singh-2026-10-21-1330', label: 'Wed, Oct 21 · 1:30 pm', initiallyAvailable: true },
      { id: 'mateo-singh-2026-10-22-0900', label: 'Thu, Oct 22 · 9:00 am', initiallyAvailable: true },
    ],
  },
  {
    id: 'lila-okafor',
    name: 'Dr. Lila Okafor',
    specialization: 'Family Medicine',
    hospital: 'Cedar & Stone Health Pavilion',
    estimatedWaitMinutes: 14,
    slots: [
      { id: 'lila-okafor-2026-10-20-0845', label: 'Tue, Oct 20 · 8:45 am', initiallyAvailable: true },
      { id: 'lila-okafor-2026-10-20-1030', label: 'Tue, Oct 20 · 10:30 am', initiallyAvailable: false },
      { id: 'lila-okafor-2026-10-20-1500', label: 'Tue, Oct 20 · 3:00 pm', initiallyAvailable: true },
    ],
  },
  {
    id: 'rowan-ellis',
    name: 'Dr. Rowan Ellis',
    specialization: 'Neurology',
    hospital: 'Meadowline Regional Hospital',
    estimatedWaitMinutes: 31,
    slots: [
      { id: 'rowan-ellis-2026-10-21-1100', label: 'Wed, Oct 21 · 11:00 am', initiallyAvailable: true },
      { id: 'rowan-ellis-2026-10-21-1415', label: 'Wed, Oct 21 · 2:15 pm', initiallyAvailable: true },
      { id: 'rowan-ellis-2026-10-22-0930', label: 'Thu, Oct 22 · 9:30 am', initiallyAvailable: false },
    ],
  },
  {
    id: 'sofia-park',
    name: 'Dr. Sofia Park',
    specialization: 'Rehabilitation',
    hospital: 'Brighton Vale Care Center',
    estimatedWaitMinutes: 22,
    slots: [
      { id: 'sofia-park-2026-10-22-0900', label: 'Thu, Oct 22 · 9:00 am', initiallyAvailable: true },
      { id: 'sofia-park-2026-10-22-1230', label: 'Thu, Oct 22 · 12:30 pm', initiallyAvailable: false },
      { id: 'sofia-park-2026-10-23-1030', label: 'Fri, Oct 23 · 10:30 am', initiallyAvailable: true },
    ],
  },
];

const specializations = [...new Set(demoDoctors.map((doctor) => doctor.specialization))].sort();
const hospitals = [...new Set(demoDoctors.map((doctor) => doctor.hospital))].sort();

function AppointmentConfirmation({ booking }: { booking: DemoBooking }) {
  return (
    <section className="booking-confirmation" role="status" data-testid="text-booking-confirmation">
      <CheckCircle2 size={21} />
      <div className="booking-confirmation-copy">
        <strong>Demo appointment booked</strong>
        <span>{booking.doctorName} · {booking.specialization}</span>
        <span>{booking.hospital}</span>
        <span>Fictional appointment slot · {booking.slotLabel}</span>
      </div>
      <div className="booking-token">
        <span>Digital demo token</span>
        <strong data-testid="text-booking-token">{booking.token}</strong>
      </div>
    </section>
  );
}

function DoctorCard({
  doctor,
  bookings,
  onBook,
  onBooked,
}: {
  doctor: DemoDoctor;
  bookings: DemoBooking[];
  onBook: (input: DemoBookingInput) => DemoBookingResult;
  onBooked: (booking: DemoBooking) => void;
}) {
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [error, setError] = useState('');
  const selectedSlot = doctor.slots.find((slot) => slot.id === selectedSlotId);
  const selectedSlotIsOpen = !!selectedSlot
    && selectedSlot.initiallyAvailable
    && !bookings.some((booking) => booking.slotId === selectedSlot.id);

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedSlot) {
      setError('Choose an available fictional demo appointment slot.');
      return;
    }
    const result = onBook({
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialization: doctor.specialization,
      hospital: doctor.hospital,
      slotId: selectedSlot.id,
      slotLabel: selectedSlot.label,
      estimatedWaitMinutes: doctor.estimatedWaitMinutes,
      slotInitiallyAvailable: selectedSlot.initiallyAvailable,
    });
    if (result.status !== 'booked') {
      setError(result.status === 'already-booked'
        ? 'That demo slot was already booked in this session. Choose another available time.'
        : 'That demo slot is full. Choose another available time.');
      return;
    }
    setError('');
    setSelectedSlotId('');
    onBooked(result.booking);
  }

  return (
    <article className="panel doctor-card" data-testid={`card-doctor-${doctor.id}`}>
      <div className="doctor-card-heading">
        <div className="doctor-avatar"><Stethoscope size={20} /></div>
        <div className="doctor-heading-copy">
          <span className="doctor-demo-label">Fictional demo doctor</span>
          <h2>{doctor.name}</h2>
        </div>
        <div className="doctor-wait">
          <Clock3 size={14} />
          <div><strong>About {doctor.estimatedWaitMinutes} min</strong><span>Estimated wait · demo</span></div>
        </div>
      </div>
      <div className="doctor-details">
        <div><span>Fictional specialization</span><strong>{doctor.specialization}</strong></div>
        <div><span>Fictional sample hospital</span><strong><MapPin size={12} />{doctor.hospital}</strong></div>
      </div>
      <form className="doctor-booking-form" onSubmit={submitBooking} data-testid={`form-book-doctor-${doctor.id}`}>
        <div className="doctor-slot-control">
          <label htmlFor={`slot-${doctor.id}`}>Available appointment slots · fictional demo schedule</label>
          <select
            id={`slot-${doctor.id}`}
            value={selectedSlotId}
            onChange={(event) => {
              setSelectedSlotId(event.target.value);
              setError('');
            }}
            required
            data-testid={`select-slot-${doctor.id}`}
          >
            <option value="">Choose a demo appointment slot</option>
            {doctor.slots.map((slot) => {
              const alreadyBooked = bookings.some((booking) => booking.slotId === slot.id);
              const isAvailable = slot.initiallyAvailable && !alreadyBooked;
              const availabilityText = !slot.initiallyAvailable
                ? 'Full demo slot'
                : alreadyBooked
                  ? 'Already booked this session'
                  : 'Available demo slot';
              return (
                <option key={slot.id} value={slot.id} disabled={!isAvailable}>
                  {slot.label} · {availabilityText}
                </option>
              );
            })}
          </select>
          <span className="doctor-slot-note">Slots are fictional demo times, not real schedules.</span>
        </div>
        <button className="doctor-book-button" type="submit" disabled={!selectedSlotIsOpen} data-testid={`button-book-doctor-${doctor.id}`}>
          <CalendarDays size={15} /> Book demo appointment
        </button>
        {error && <p className="doctor-booking-error" role="alert" data-testid={`error-book-doctor-${doctor.id}`}>{error}</p>}
      </form>
    </article>
  );
}

export default function DoctorAppointments() {
  const { bookings, bookDemoSlot } = useDemoBookings();
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('all');
  const [hospital, setHospital] = useState('all');
  const [confirmation, setConfirmation] = useState<DemoBooking | null>(null);

  const filteredDoctors = useMemo(() => {
    const term = search.trim().toLowerCase();
    return demoDoctors.filter((doctor) => {
      const searchMatch = !term
        || [doctor.name, doctor.specialization, doctor.hospital].join(' ').toLowerCase().includes(term);
      const specializationMatch = specialization === 'all' || doctor.specialization === specialization;
      const hospitalMatch = hospital === 'all' || doctor.hospital === hospital;
      return searchMatch && specializationMatch && hospitalMatch;
    });
  }, [search, specialization, hospital]);

  return (
    <main className="content doctor-page page-enter">
      <div className="page-kicker"><CalendarDays size={13} /> Fictional doctor directory</div>
      <div className="doctor-page-heading">
        <div>
          <h1 className="page-title" data-testid="text-doctors-title">Find a doctor and plan a visit</h1>
          <p className="page-subtitle">Explore fictional specialists and reserve a sample appointment slot.</p>
        </div>
      </div>
      <DemoBanner />

      {confirmation && <AppointmentConfirmation booking={confirmation} />}

      <section className="doctor-search-panel panel" aria-label="Search and filter fictional doctors">
        <label className="doctor-search-control">
          <span>Search doctors</span>
          <span className="doctor-search-input"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Doctor, specialization, or hospital" aria-label="Search fictional doctors" data-testid="input-doctor-search" /></span>
        </label>
        <label className="doctor-filter-control">
          <span>Fictional specialization</span>
          <select value={specialization} onChange={(event) => setSpecialization(event.target.value)} aria-label="Filter by fictional specialization" data-testid="select-doctor-specialization">
            <option value="all">All specializations</option>
            {specializations.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="doctor-filter-control">
          <span>Fictional sample hospital</span>
          <select value={hospital} onChange={(event) => setHospital(event.target.value)} aria-label="Filter by fictional hospital" data-testid="select-doctor-hospital">
            <option value="all">All sample hospitals</option>
            {hospitals.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </section>
      <p className="doctor-demo-caption">Doctor names, specializations, hospital associations, available slots, and estimated waiting times are fictional demo data only.</p>

      <div className="doctor-results-heading">
        <div><h2>Doctors to explore</h2><span>{filteredDoctors.length} fictional demo {filteredDoctors.length === 1 ? 'doctor' : 'doctors'}</span></div>
        {(search || specialization !== 'all' || hospital !== 'all') && (
          <button type="button" className="doctor-clear-filters" onClick={() => { setSearch(''); setSpecialization('all'); setHospital('all'); }} data-testid="button-clear-doctor-filters">Clear filters</button>
        )}
      </div>

      {filteredDoctors.length > 0 ? (
        <div className="doctor-list">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} bookings={bookings} onBook={bookDemoSlot} onBooked={setConfirmation} />
          ))}
        </div>
      ) : (
        <div className="panel empty-results" data-testid="state-no-doctors">
          <div className="empty-icon"><Search size={18} /></div>
          <strong>No fictional doctors match these filters</strong>
          <p>Try another search, specialization, or sample hospital.</p>
          <button type="button" className="reset-search" onClick={() => { setSearch(''); setSpecialization('all'); setHospital('all'); }}>Reset doctor search</button>
        </div>
      )}

      <section className="panel my-appointments-panel" aria-labelledby="my-appointments-heading" data-testid="section-my-appointments">
        <div className="section-heading">
          <div><h2 id="my-appointments-heading">My Appointments</h2><span className="my-appointments-note">Fictional demo bookings · this session only</span></div>
          <span className="my-appointments-count">{bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}</span>
        </div>
        {bookings.length === 0 ? (
          <div className="appointments-empty" data-testid="state-no-appointments">
            <CalendarDays size={18} />
            <div><strong>No demo appointments yet</strong><span>Choose an available fictional slot above to see your booking here.</span></div>
          </div>
        ) : (
          <div className="demo-appointments-list">
            {bookings.map((booking) => (
              <article className="demo-appointment" key={booking.token} data-testid={`appointment-${booking.token}`}>
                <div className="demo-appointment-icon"><CheckCircle2 size={17} /></div>
                <div className="demo-appointment-main">
                  <strong>{booking.doctorName} · {booking.specialization}</strong>
                  <span>{booking.hospital}</span>
                  <span>Fictional appointment slot · {booking.slotLabel}</span>
                  <span>Estimated wait (demo) · about {booking.estimatedWaitMinutes} min</span>
                </div>
                <div className="booking-token appointment-token"><span>Digital demo token</span><strong>{booking.token}</strong></div>
              </article>
            ))}
          </div>
        )}
      </section>
      <div className="footer-note">All doctor details and appointments are fictional examples for this healthcare coordination prototype.</div>
    </main>
  );
}
