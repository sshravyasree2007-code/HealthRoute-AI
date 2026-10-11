import { useMemo, useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  Clock3,
  FlaskConical,
  MapPin,
  Search,
} from 'lucide-react';
import { DemoBanner } from '@/components/demo-banner';
import {
  useDemoLabBookings,
  type DemoLabBooking,
  type DemoLabBookingInput,
  type DemoLabBookingResult,
} from '@/lib/demo-lab-bookings';

type DemoLabSlot = {
  id: string;
  label: string;
  initiallyAvailable: boolean;
};

type DemoLabTest = {
  name: string;
  slots: DemoLabSlot[];
};

type DemoLab = {
  id: string;
  name: string;
  location: string;
  estimatedQueueMinutes: number;
  tests: DemoLabTest[];
};

type LabAvailability = 'Available' | 'Limited' | 'Full';
type AvailabilityFilter = 'all' | LabAvailability;

const demoLabs: DemoLab[] = [
  {
    id: 'willow-creek-demo-lab',
    name: 'Willow Creek Sample Laboratory',
    location: 'Northfield · Fictional sample district',
    estimatedQueueMinutes: 18,
    tests: [
      { name: 'CBC', slots: [
        { id: 'willow-cbc-2026-10-20-0830', label: 'Tue, Oct 20 · 8:30 am', initiallyAvailable: true },
        { id: 'willow-cbc-2026-10-20-1015', label: 'Tue, Oct 20 · 10:15 am', initiallyAvailable: true },
        { id: 'willow-cbc-2026-10-20-1300', label: 'Tue, Oct 20 · 1:00 pm', initiallyAvailable: false },
      ] },
      { name: 'Blood glucose', slots: [
        { id: 'willow-glucose-2026-10-20-0900', label: 'Tue, Oct 20 · 9:00 am', initiallyAvailable: true },
        { id: 'willow-glucose-2026-10-20-1130', label: 'Tue, Oct 20 · 11:30 am', initiallyAvailable: true },
      ] },
      { name: 'Thyroid profile', slots: [
        { id: 'willow-thyroid-2026-10-20-1400', label: 'Tue, Oct 20 · 2:00 pm', initiallyAvailable: true },
      ] },
    ],
  },
  {
    id: 'harborlight-demo-lab',
    name: 'Harborlight Diagnostics Demo Lab',
    location: 'Riverside · Fictional sample district',
    estimatedQueueMinutes: 32,
    tests: [
      { name: 'CBC', slots: [
        { id: 'harbor-cbc-2026-10-21-0900', label: 'Wed, Oct 21 · 9:00 am', initiallyAvailable: true },
      ] },
      { name: 'Thyroid profile', slots: [
        { id: 'harbor-thyroid-2026-10-21-1030', label: 'Wed, Oct 21 · 10:30 am', initiallyAvailable: true },
        { id: 'harbor-thyroid-2026-10-21-1330', label: 'Wed, Oct 21 · 1:30 pm', initiallyAvailable: false },
      ] },
      { name: 'Lipid profile', slots: [
        { id: 'harbor-lipid-2026-10-21-1500', label: 'Wed, Oct 21 · 3:00 pm', initiallyAvailable: true },
      ] },
    ],
  },
  {
    id: 'cedar-stone-demo-lab',
    name: 'Cedar & Stone Fictional Test Lab',
    location: 'Northfield · Fictional sample district',
    estimatedQueueMinutes: 47,
    tests: [
      { name: 'CBC', slots: [
        { id: 'cedar-cbc-2026-10-20-0900', label: 'Tue, Oct 20 · 9:00 am', initiallyAvailable: false },
      ] },
      { name: 'Blood glucose', slots: [
        { id: 'cedar-glucose-2026-10-20-1130', label: 'Tue, Oct 20 · 11:30 am', initiallyAvailable: false },
      ] },
      { name: 'Thyroid profile', slots: [
        { id: 'cedar-thyroid-2026-10-20-1400', label: 'Tue, Oct 20 · 2:00 pm', initiallyAvailable: false },
      ] },
      { name: 'Lipid profile', slots: [
        { id: 'cedar-lipid-2026-10-20-1530', label: 'Tue, Oct 20 · 3:30 pm', initiallyAvailable: false },
      ] },
    ],
  },
  {
    id: 'meadowline-demo-lab',
    name: 'Meadowline Research Demo Laboratory',
    location: 'Lakewood · Fictional sample district',
    estimatedQueueMinutes: 24,
    tests: [
      { name: 'Blood glucose', slots: [
        { id: 'meadow-glucose-2026-10-21-0800', label: 'Wed, Oct 21 · 8:00 am', initiallyAvailable: true },
      ] },
      { name: 'Lipid profile', slots: [
        { id: 'meadow-lipid-2026-10-21-1030', label: 'Wed, Oct 21 · 10:30 am', initiallyAvailable: true },
      ] },
      { name: 'Thyroid profile', slots: [
        { id: 'meadow-thyroid-2026-10-21-1300', label: 'Wed, Oct 21 · 1:00 pm', initiallyAvailable: false },
      ] },
    ],
  },
];

const testTypes = ['CBC', 'Blood glucose', 'Thyroid profile', 'Lipid profile'];
const labNames = demoLabs.map((lab) => lab.name);

function isSlotOpen(slot: DemoLabSlot, bookings: DemoLabBooking[]) {
  return slot.initiallyAvailable && !bookings.some((booking) => booking.slotId === slot.id);
}

function getAvailability(lab: DemoLab, bookings: DemoLabBooking[]): LabAvailability {
  const openSlotCount = lab.tests
    .flatMap((test) => test.slots)
    .filter((slot) => isSlotOpen(slot, bookings)).length;
  if (openSlotCount === 0) return 'Full';
  return openSlotCount <= 2 ? 'Limited' : 'Available';
}

function LabConfirmation({ booking }: { booking: DemoLabBooking }) {
  return (
    <section className="lab-confirmation" role="status" data-testid="text-lab-booking-confirmation">
      <CheckCircle2 size={21} />
      <div className="lab-confirmation-copy">
        <strong>Fictional demo lab booking confirmed</strong>
        <span>{booking.testName} · fictional demo test</span>
        <span>{booking.labName} · {booking.location}</span>
        <span>Fictional demo slot · {booking.slotLabel}</span>
      </div>
      <div className="lab-reference">
        <span>Unique lab demo reference</span>
        <strong data-testid="text-lab-booking-reference">{booking.reference}</strong>
      </div>
    </section>
  );
}

function LabCard({
  lab,
  bookings,
  onBook,
  onBooked,
}: {
  lab: DemoLab;
  bookings: DemoLabBooking[];
  onBook: (input: DemoLabBookingInput) => DemoLabBookingResult;
  onBooked: (booking: DemoLabBooking) => void;
}) {
  const [selectedTestName, setSelectedTestName] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [error, setError] = useState('');
  const selectedTest = lab.tests.find((test) => test.name === selectedTestName);
  const selectedSlot = selectedTest?.slots.find((slot) => slot.id === selectedSlotId);
  const selectedSlotIsOpen = !!selectedSlot && isSlotOpen(selectedSlot, bookings);
  const availability = getAvailability(lab, bookings);
  const visibleSlots = lab.tests.flatMap((test) =>
    test.slots
      .filter((slot) => isSlotOpen(slot, bookings))
      .map((slot) => ({ testName: test.name, label: slot.label })),
  ).slice(0, 3);

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTest || !selectedSlot) {
      setError('Choose a fictional demo test and an available demo slot.');
      return;
    }
    const result = onBook({
      labId: lab.id,
      labName: lab.name,
      location: lab.location,
      testName: selectedTest.name,
      slotId: selectedSlot.id,
      slotLabel: selectedSlot.label,
      estimatedQueueMinutes: lab.estimatedQueueMinutes,
      slotInitiallyAvailable: selectedSlot.initiallyAvailable,
    });
    if (result.status !== 'booked') {
      setError(result.status === 'already-booked'
        ? 'That demo slot has already been booked in this session. Choose another available time.'
        : 'That demo slot is full. Choose another available time.');
      return;
    }
    setError('');
    setSelectedSlotId('');
    onBooked(result.booking);
  }

  return (
    <article className="panel lab-card" data-testid={`card-lab-${lab.id}`}>
      <div className="lab-card-heading">
        <div className="lab-icon"><FlaskConical size={19} /></div>
        <div className="lab-heading-copy">
          <span>Fictional demo laboratory</span>
          <h2>{lab.name}</h2>
          <p><MapPin size={12} /> {lab.location}</p>
        </div>
        <span className={`lab-availability-badge ${availability.toLowerCase()}`} aria-label={`Fictional demo availability status: ${availability}`} data-testid={`status-lab-${lab.id}`}>{availability} · demo</span>
      </div>

      <div className="lab-card-meta">
        <div className="lab-tests-block">
          <strong>Available tests · fictional demo data</strong>
          <div className="lab-test-tags">{lab.tests.map((test) => {
            const openCount = test.slots.filter((slot) => isSlotOpen(slot, bookings)).length;
            return <span className="lab-test-tag" key={test.name}>{test.name} <small>{openCount} demo {openCount === 1 ? 'slot' : 'slots'}</small></span>;
          })}</div>
        </div>
        <div className="lab-queue">
          <Clock3 size={14} />
          <div><strong>About {lab.estimatedQueueMinutes} min</strong><span>Estimated queue wait · demo</span></div>
        </div>
      </div>

      <div className="lab-slot-preview" aria-label="Fictional available lab appointment slots">
        <strong>Available time slots · fictional demo schedule</strong>
        {visibleSlots.length > 0
          ? <div className="lab-slot-chips">{visibleSlots.map((slot) => <span className="lab-slot-chip" key={`${slot.testName}-${slot.label}`}>{slot.testName} · {slot.label}</span>)}</div>
          : <span className="lab-no-slots">No fictional demo slots are currently open.</span>}
      </div>

      <form className="lab-booking-form" onSubmit={submitBooking} data-testid={`form-book-lab-${lab.id}`}>
        <div className="lab-booking-select">
          <label htmlFor={`lab-test-${lab.id}`}>Choose a fictional demo test</label>
          <select
            id={`lab-test-${lab.id}`}
            value={selectedTestName}
            onChange={(event) => { setSelectedTestName(event.target.value); setSelectedSlotId(''); setError(''); }}
            required
            data-testid={`select-test-${lab.id}`}
          >
            <option value="">Select a sample test</option>
            {lab.tests.map((test) => <option key={test.name} value={test.name}>{test.name} · fictional demo test</option>)}
          </select>
        </div>
        <div className="lab-booking-select">
          <label htmlFor={`lab-slot-${lab.id}`}>Choose an available demo slot</label>
          <select
            id={`lab-slot-${lab.id}`}
            value={selectedSlotId}
            onChange={(event) => { setSelectedSlotId(event.target.value); setError(''); }}
            required
            disabled={!selectedTest}
            data-testid={`select-lab-slot-${lab.id}`}
          >
            <option value="">Select a fictional time slot</option>
            {selectedTest?.slots.map((slot) => {
              const available = isSlotOpen(slot, bookings);
              const slotStatus = !slot.initiallyAvailable
                ? 'Full demo slot'
                : available
                  ? 'Available demo slot'
                  : 'Already booked this session';
              return <option key={slot.id} value={slot.id} disabled={!available}>{slot.label} · {slotStatus}</option>;
            })}
          </select>
        </div>
        <button className="lab-book-button" type="submit" disabled={!selectedSlotIsOpen} data-testid={`button-book-lab-${lab.id}`}>
          <FlaskConical size={14} /> Book demo test
        </button>
        {error && <p className="lab-booking-error" role="alert" data-testid={`error-book-lab-${lab.id}`}>{error}</p>}
      </form>
    </article>
  );
}

export default function Laboratories() {
  const { bookings, bookDemoLabSlot } = useDemoLabBookings();
  const [search, setSearch] = useState('');
  const [testType, setTestType] = useState('all');
  const [labName, setLabName] = useState('all');
  const [availability, setAvailability] = useState<AvailabilityFilter>('all');
  const [confirmation, setConfirmation] = useState<DemoLabBooking | null>(null);

  const filteredLabs = useMemo(() => {
    const term = search.trim().toLowerCase();
    return demoLabs.filter((lab) => {
      const searchMatch = !term
        || [lab.name, lab.location, ...lab.tests.map((test) => test.name)].join(' ').toLowerCase().includes(term);
      const testMatch = testType === 'all' || lab.tests.some((test) => test.name === testType);
      const labMatch = labName === 'all' || lab.name === labName;
      const availabilityMatch = availability === 'all' || getAvailability(lab, bookings) === availability;
      return searchMatch && testMatch && labMatch && availabilityMatch;
    });
  }, [search, testType, labName, availability, bookings]);

  return (
    <main className="content lab-page page-enter">
      <div className="page-kicker"><FlaskConical size={13} /> Fictional laboratory directory</div>
      <h1 className="page-title" data-testid="text-labs-title">Find a lab and book a test</h1>
      <p className="page-subtitle">Explore fictional sample laboratories, tests, and appointment slots.</p>
      <DemoBanner />

      {confirmation && <LabConfirmation booking={confirmation} />}

      <section className="panel lab-search-panel" aria-label="Search and filter fictional laboratories">
        <label className="lab-search-control">
          <span>Search laboratories and tests</span>
          <span className="lab-search-input"><Search size={15} /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Laboratory, location, or test" aria-label="Search fictional laboratories and tests" data-testid="input-lab-search" /></span>
        </label>
        <label className="lab-filter-control">
          <span>Fictional test type</span>
          <select value={testType} onChange={(event) => setTestType(event.target.value)} aria-label="Filter by fictional test type" data-testid="select-lab-test-filter">
            <option value="all">All sample tests</option>
            {testTypes.map((test) => <option key={test} value={test}>{test}</option>)}
          </select>
        </label>
        <label className="lab-filter-control">
          <span>Fictional laboratory</span>
          <select value={labName} onChange={(event) => setLabName(event.target.value)} aria-label="Filter by fictional laboratory" data-testid="select-lab-laboratory">
            <option value="all">All sample laboratories</option>
            {labNames.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </label>
        <label className="lab-filter-control">
          <span>Fictional availability</span>
          <select value={availability} onChange={(event) => setAvailability(event.target.value as AvailabilityFilter)} aria-label="Filter by fictional slot availability" data-testid="select-lab-availability">
            <option value="all">All demo statuses</option>
            <option value="Available">Available</option>
            <option value="Limited">Limited</option>
            <option value="Full">Full</option>
          </select>
        </label>
      </section>
      <p className="lab-demo-caption">All laboratory names, locations, test availability, appointment slots, and estimated queue times are fictional demo data. Nothing here is a real laboratory listing or live availability.</p>

      <div className="lab-results-heading">
        <div><h2>Laboratories to explore</h2><span>{filteredLabs.length} fictional demo {filteredLabs.length === 1 ? 'laboratory' : 'laboratories'}</span></div>
        {(search || testType !== 'all' || labName !== 'all' || availability !== 'all') && (
          <button type="button" className="lab-clear-filters" onClick={() => { setSearch(''); setTestType('all'); setLabName('all'); setAvailability('all'); }} data-testid="button-clear-lab-filters">Clear filters</button>
        )}
      </div>

      {filteredLabs.length > 0 ? (
        <div className="lab-list">
          {filteredLabs.map((lab) => <LabCard key={lab.id} lab={lab} bookings={bookings} onBook={bookDemoLabSlot} onBooked={setConfirmation} />)}
        </div>
      ) : (
        <div className="panel empty-results" data-testid="state-no-labs">
          <div className="empty-icon"><Search size={18} /></div>
          <strong>No fictional laboratories match these filters</strong>
          <p>Try another test, laboratory, availability status, or search term.</p>
          <button type="button" className="reset-search" onClick={() => { setSearch(''); setTestType('all'); setLabName('all'); setAvailability('all'); }}>Reset lab search</button>
        </div>
      )}

      <section className="panel my-lab-bookings-panel" aria-labelledby="my-lab-bookings-heading" data-testid="section-my-lab-bookings">
        <div className="section-heading">
          <div><h2 id="my-lab-bookings-heading">My Lab Bookings</h2><span className="my-lab-bookings-note">Fictional demo bookings · this session only</span></div>
          <span className="my-lab-bookings-count">{bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}</span>
        </div>
        {bookings.length === 0 ? (
          <div className="lab-bookings-empty" data-testid="state-no-lab-bookings">
            <FlaskConical size={18} />
            <div><strong>No demo lab bookings yet</strong><span>Choose a fictional test and available demo slot above to see a booking here.</span></div>
          </div>
        ) : (
          <div className="demo-lab-bookings-list">
            {bookings.map((booking) => (
              <article className="demo-lab-booking" key={booking.reference} data-testid={`lab-booking-${booking.reference}`}>
                <div className="lab-booking-icon"><CheckCircle2 size={17} /></div>
                <div className="demo-lab-booking-main">
                  <strong>{booking.testName} · fictional demo test</strong>
                  <span>{booking.labName} · {booking.location}</span>
                  <span>Fictional demo slot · {booking.slotLabel}</span>
                  <span>Estimated queue wait (demo) · about {booking.estimatedQueueMinutes} min</span>
                </div>
                <div className="lab-reference booking-reference"><span>Unique lab demo reference</span><strong>{booking.reference}</strong></div>
              </article>
            ))}
          </div>
        )}
      </section>
      <div className="footer-note">All laboratory and booking information on this page is fictional sample data for the HealthRoute AI prototype.</div>
    </main>
  );
}
