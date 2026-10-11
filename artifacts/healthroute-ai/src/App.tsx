import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Activity,
  ArrowDownUp,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Compass,
  FileText,
  FlaskConical,
  HeartHandshake,
  Hospital,
  MapPin,
  Pill,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import { Route, Switch, Link, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { DemoBanner } from '@/components/demo-banner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import DoctorAppointments from '@/pages/doctor-appointments';
import Laboratories from '@/pages/laboratories';
import Pharmacies from '@/pages/pharmacies';
import NotFound from '@/pages/not-found';
import { DemoBookingProvider } from '@/lib/demo-bookings';
import { DemoLabBookingProvider } from '@/lib/demo-lab-bookings';
import { DemoPharmacyOrderProvider } from '@/lib/demo-pharmacy-orders';

const queryClient = new QueryClient();

function Logo() {
  return (
    <Link href="/" className="brand" data-testid="link-brand">
      <span className="brand-mark"><HeartHandshake size={20} strokeWidth={1.9} /></span>
      <span className="brand-name">healthroute<span>AI</span></span>
    </Link>
  );
}

function NavLinks({ mobile = false }: { mobile?: boolean }) {
  const [location] = useLocation();
  return (
    <nav className={mobile ? 'mobile-nav' : 'side-nav'} aria-label={mobile ? 'Mobile navigation' : 'Main navigation'}>
      <Link href="/" className={`side-link ${location === '/' ? 'active' : ''}`} data-testid={mobile ? 'mobile-link-dashboard' : 'link-dashboard'}>
        <Activity className="side-icon" /><span>My overview</span>
      </Link>
      <Link href="/hospitals" className={`side-link ${location === '/hospitals' ? 'active' : ''}`} data-testid={mobile ? 'mobile-link-hospitals' : 'link-hospitals'}>
        <Hospital className="side-icon" /><span>Find hospitals</span>
      </Link>
      <Link href="/doctors" className={`side-link ${location === '/doctors' ? 'active' : ''}`} data-testid={mobile ? 'mobile-link-doctors' : 'link-doctors'}>
        <CalendarDays className="side-icon" /><span>Find a doctor</span>
      </Link>
      <Link href="/labs" className={`side-link ${location === '/labs' ? 'active' : ''}`} data-testid={mobile ? 'mobile-link-labs' : 'link-labs'}>
        <FlaskConical className="side-icon" /><span>Find a lab</span>
      </Link>
      <Link href="/pharmacies" className={`side-link ${location === '/pharmacies' ? 'active' : ''}`} data-testid={mobile ? 'mobile-link-pharmacies' : 'link-pharmacies'}>
        <Pill className="side-icon" /><span>Find a pharmacy</span>
      </Link>
    </nav>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const pageName = location === '/hospitals' ? 'Find hospitals' : location === '/doctors' ? 'Doctors & appointments' : location === '/labs' ? 'Find a lab' : location === '/pharmacies' ? 'Find a pharmacy' : 'My overview';
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Logo />
        <div className="sidebar-label">Your space</div>
        <NavLinks />
        <div className="side-bottom">
          <div className="demo-side-note">
            <strong><ShieldCheck size={14} /> Demo environment</strong>
            All details are fictional examples made for this prototype.
          </div>
          <div className="sidebar-footer">A clearer path through care</div>
        </div>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><span>HealthRoute AI</span><ChevronRight size={13} /><strong>{pageName}</strong></div>
          <div className="profile-mini"><span>Sample profile</span><div className="profile-dot" aria-label="Synthetic sample profile">SP</div></div>
        </header>
        {children}
      </div>
      <NavLinks mobile />
    </div>
  );
}

function Dashboard() {
  return (
    <main className="content page-enter">
      <div className="welcome-row">
        <div>
          <div className="page-kicker"><Sparkles size={13} /> A little more clarity</div>
          <h1 className="page-title" data-testid="text-dashboard-title">Your care, at a glance</h1>
          <p className="page-subtitle">A simple place to keep the moving pieces of care together.</p>
        </div>
        <div className="date-label">Sample care plan · Updated just now</div>
      </div>
      <DemoBanner />
      <div className="dashboard-grid">
        <section className="panel care-card" aria-labelledby="care-path-heading">
          <div className="card-top">
            <div>
              <h2 className="card-title" id="care-path-heading">A sample care pathway</h2>
              <div className="card-caption">Example milestones for this prototype</div>
            </div>
            <span className="status-pill"><span className="status-dot" /> Sample plan</span>
          </div>
          <div className="care-progress" aria-label="Example pathway with two of four steps completed">
            <div className="progress-track"><div className="progress-fill" /></div>
            <div className="steps">
              <div className="step done"><span className="step-circle"><Check size={15} /></span><span className="step-label">Share<br />preferences</span></div>
              <div className="step done"><span className="step-circle"><Check size={15} /></span><span className="step-label">Review<br />options</span></div>
              <div className="step current"><span className="step-circle"><Hospital size={14} /></span><span className="step-label">Explore<br />hospitals</span></div>
              <div className="step"><span className="step-circle"><CalendarDays size={14} /></span><span className="step-label">Plan a<br />visit</span></div>
            </div>
          </div>
          <div className="care-detail">
            <span><strong>Up next</strong> &nbsp; Browse example hospital options</span>
            <Link href="/hospitals" className="link-arrow" data-testid="link-explore-hospitals">Explore <ArrowRight size={14} /></Link>
          </div>
        </section>
        <section className="panel appointment-card" aria-label="Example upcoming appointment">
          <div className="small-overline">Example · next appointment</div>
          <div className="appointment-date">
            <div className="date-tile"><span>Oct</span><span>24</span></div>
            <div className="appointment-info"><strong>Care planning visit</strong><span>Example appointment · 10:30 am</span></div>
          </div>
          <div className="appointment-foot"><span>Location</span><strong>To be decided in this demo</strong></div>
        </section>
      </div>
      <div className="lower-grid">
        <section className="panel section-panel" aria-labelledby="checklist-heading">
          <div className="section-heading"><h2 id="checklist-heading">A few things to explore</h2><span>Example checklist</span></div>
          <div className="task-list">
            <div className="task-row">
              <div className="task-icon"><FileText size={16} /></div>
              <div className="task-copy"><strong>Review your sample care summary</strong><span>See how a care plan can be organized</span></div>
              <CheckCircle2 className="task-mark" size={17} />
            </div>
            <div className="task-row">
              <div className="task-icon"><Compass size={16} /></div>
              <div className="task-copy"><strong>Compare local example hospitals</strong><span>Filter by location and services</span></div>
              <Link href="/hospitals" className="link-arrow" aria-label="Browse sample hospitals" data-testid="link-checklist-hospitals"><ArrowRight size={15} /></Link>
            </div>
            <div className="task-row">
              <div className="task-icon"><CircleHelp size={16} /></div>
              <div className="task-copy"><strong>Write down questions to ask</strong><span>Use this space as a planning prompt</span></div>
              <Clock3 className="task-mark" size={17} />
            </div>
          </div>
        </section>
        <section className="panel resource-card" aria-labelledby="resource-heading">
          <div className="section-heading"><h2 id="resource-heading">Finding a good fit</h2><span>Start with what matters</span></div>
          <p className="resource-copy">Distance, services, and your own preferences can all help shape a hospital search. Explore the sample directory to see how it works.</p>
          <Link href="/hospitals" className="resource-link" data-testid="link-resource-hospitals">Open hospital search <ArrowRight size={14} /></Link>
        </section>
      </div>
      <div className="footer-note">HealthRoute AI is a coordination prototype. All information shown here is synthetic sample data.</div>
    </main>
  );
}

type SampleHospital = {
  id: string;
  name: string;
  city: string;
  distance: number;
  services: string[];
  type: string;
  note: string;
  emergencyBeds: {
    total: number;
    available: number;
    estimatedWaitMinutes: number;
  };
};

const sampleHospitals: SampleHospital[] = [
  { id: 'willow', name: 'Willow Creek Community Hospital', city: 'Northfield', distance: 2.4, services: ['Cardiology', 'Imaging', 'Outpatient care'], type: 'Community hospital', note: 'A fictional community hospital listing with a broad selection of example services.', emergencyBeds: { total: 24, available: 9, estimatedWaitMinutes: 18 } },
  { id: 'harbor', name: 'Harborlight Medical Center', city: 'Riverside', distance: 4.8, services: ['Orthopedics', 'Imaging', 'Rehabilitation'], type: 'Medical center', note: 'A fictional medical center entry for exploring directory filters.', emergencyBeds: { total: 36, available: 6, estimatedWaitMinutes: 42 } },
  { id: 'cedar', name: 'Cedar & Stone Health Pavilion', city: 'Northfield', distance: 6.1, services: ['Family medicine', 'Outpatient care', 'Rehabilitation'], type: 'Community hospital', note: 'A made-up listing in this sample set; service labels are for interface demonstration only.', emergencyBeds: { total: 18, available: 0, estimatedWaitMinutes: 78 } },
  { id: 'meadow', name: 'Meadowline Regional Hospital', city: 'Lakewood', distance: 8.7, services: ['Cardiology', 'Orthopedics', 'Imaging'], type: 'Regional hospital', note: 'A fictional regional hospital entry with sample service categories.', emergencyBeds: { total: 42, available: 17, estimatedWaitMinutes: 12 } },
  { id: 'brighton', name: 'Brighton Vale Care Center', city: 'Riverside', distance: 11.3, services: ['Family medicine', 'Rehabilitation', 'Outpatient care'], type: 'Care center', note: 'A fictional care center entry; details do not represent a real facility.', emergencyBeds: { total: 20, available: 4, estimatedWaitMinutes: 36 } },
  { id: 'pine', name: 'Pine Terrace Medical House', city: 'Eastbank', distance: 14.2, services: ['Imaging', 'Family medicine'], type: 'Medical center', note: 'An invented listing included to demonstrate local search and filtering.', emergencyBeds: { total: 16, available: 0, estimatedWaitMinutes: 65 } },
];

const serviceOptions = ['Cardiology', 'Family medicine', 'Imaging', 'Orthopedics', 'Outpatient care', 'Rehabilitation'];
type EmergencyStatus = 'Available' | 'Limited' | 'Full';
type AvailabilityFilter = 'all' | EmergencyStatus;

function getEmergencyStatus(hospital: SampleHospital): EmergencyStatus {
  if (hospital.emergencyBeds.available === 0) return 'Full';
  return hospital.emergencyBeds.available <= Math.ceil(hospital.emergencyBeds.total * 0.25) ? 'Limited' : 'Available';
}

function HospitalCard({ hospital, index }: { hospital: SampleHospital; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = index % 2 === 0 ? Hospital : Stethoscope;
  const emergencyStatus = getEmergencyStatus(hospital);
  const occupiedBeds = hospital.emergencyBeds.total - hospital.emergencyBeds.available;
  return (
    <article className="panel hospital-card" data-testid={`card-hospital-${hospital.id}`}>
      <div className={`hospital-emblem ${index % 2 ? 'alt' : ''}`}><Icon size={21} strokeWidth={1.8} /></div>
      <div>
        <h2 className="hospital-name">{hospital.name}</h2>
        <div className="hospital-location"><MapPin size={12} /> {hospital.city} · {hospital.type}</div>
        <div className="hospital-tags">{hospital.services.map((service) => <span className="hospital-tag" key={service}>{service}</span>)}</div>
      </div>
      <div className="distance">{hospital.distance.toFixed(1)} mi</div>
      <section className="er-availability" aria-label={`Fictional emergency room availability for ${hospital.name}`} data-testid={`panel-er-availability-${hospital.id}`}>
        <div className="er-availability-heading">
          <div>
            <strong>Emergency room availability</strong>
            <span>Fictional demo data · not live</span>
          </div>
          <span className={`er-status-badge ${emergencyStatus.toLowerCase()}`} data-testid={`status-er-${hospital.id}`}>{emergencyStatus}</span>
        </div>
        <div className="er-metrics">
          <div><strong>{hospital.emergencyBeds.total}</strong><span>Total emergency beds</span></div>
          <div><strong>{hospital.emergencyBeds.available}</strong><span>Available emergency beds</span></div>
          <div><strong>{occupiedBeds}</strong><span>Occupied emergency beds</span></div>
          <div><strong>{hospital.emergencyBeds.estimatedWaitMinutes} min</strong><span>Estimated wait (demo)</span></div>
        </div>
      </section>
      <div className="hospital-action">
        <span className="detail-caption">Synthetic sample listing · not a real facility</span>
        <button className="details-button" type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} data-testid={`button-hospital-details-${hospital.id}`}>
          {expanded ? 'Hide details' : 'View details'} <ChevronDown size={13} />
        </button>
      </div>
      {expanded && <div className="detail-expanded" data-testid={`text-hospital-detail-${hospital.id}`}>{hospital.note} These example details are not verified facility information.</div>}
    </article>
  );
}

function Hospitals() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [city, setCity] = useState('all');
  const [radius, setRadius] = useState('any');
  const [services, setServices] = useState<string[]>([]);
  const [availability, setAvailability] = useState<AvailabilityFilter>('all');
  const [sort, setSort] = useState('distance');

  const filtered = useMemo(() => {
    const term = submittedQuery.trim().toLowerCase();
    return sampleHospitals
      .filter((hospital) => {
        const textMatch = !term || [hospital.name, hospital.city, hospital.type, ...hospital.services].join(' ').toLowerCase().includes(term);
        const cityMatch = city === 'all' || hospital.city === city;
        const radiusMatch = radius === 'any' || hospital.distance <= Number(radius);
        const serviceMatch = services.length === 0 || services.every((service) => hospital.services.includes(service));
        const availabilityMatch = availability === 'all' || getEmergencyStatus(hospital) === availability;
        return textMatch && cityMatch && radiusMatch && serviceMatch && availabilityMatch;
      })
      .sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : a.distance - b.distance);
  }, [submittedQuery, city, radius, services, availability, sort]);

  function toggleService(service: string) {
    setServices((current) => current.includes(service) ? current.filter((item) => item !== service) : [...current, service]);
  }
  function resetFilters() {
    setQuery('');
    setSubmittedQuery('');
    setCity('all');
    setRadius('any');
    setServices([]);
    setAvailability('all');
    setSort('distance');
  }
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedQuery(query);
  }

  return (
    <main className="content page-enter">
      <div className="page-kicker"><Compass size={13} /> A directory for exploring</div>
      <section className="search-hero">
        <div className="page-kicker"><Sparkles size={13} /> Sample directory</div>
        <h1 data-testid="text-hospitals-title">Find a hospital that fits</h1>
        <p>Explore fictional hospital listings and see how local search can feel simpler.</p>
        <form className="search-bar" onSubmit={search} role="search">
          <label className="search-input-wrap">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, city, or service" aria-label="Search example hospitals" data-testid="input-hospital-search" />
          </label>
          <button className="search-button" type="submit" data-testid="button-hospital-search"><Search size={16} /><span>Search</span></button>
        </form>
      </section>
      <DemoBanner />
      <div className="hospital-layout">
        <aside className="panel filter-panel" aria-label="Hospital filters">
          <div className="filter-title"><strong><SlidersHorizontal size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} /> Refine search</strong><button className="clear-filter" type="button" onClick={resetFilters} data-testid="button-clear-filters">Clear all</button></div>
          <div className="filter-group">
            <label htmlFor="city-filter">Example area</label>
            <select id="city-filter" className="filter-select" value={city} onChange={(event) => setCity(event.target.value)} data-testid="select-hospital-city">
              <option value="all">All sample areas</option><option value="Northfield">Northfield</option><option value="Riverside">Riverside</option><option value="Lakewood">Lakewood</option><option value="Eastbank">Eastbank</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="radius-filter">Sample distance</label>
            <select id="radius-filter" className="filter-select" value={radius} onChange={(event) => setRadius(event.target.value)} data-testid="select-hospital-radius">
              <option value="any">Any distance</option><option value="5">Within 5 miles</option><option value="10">Within 10 miles</option><option value="15">Within 15 miles</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="emergency-availability-filter">Fictional ER availability</label>
            <select id="emergency-availability-filter" className="filter-select" value={availability} onChange={(event) => setAvailability(event.target.value as AvailabilityFilter)} data-testid="select-er-availability">
              <option value="all">All demo statuses</option><option value="Available">Available</option><option value="Limited">Limited</option><option value="Full">Full</option>
            </select>
            <p className="filter-help">Status uses fictional bed counts only; availability is not live.</p>
          </div>
          <div className="filter-group">
            <label>Example services</label>
            <div className="check-list">
              {serviceOptions.map((service) => <label className="check-option" key={service}><input type="checkbox" checked={services.includes(service)} onChange={() => toggleService(service)} data-testid={`checkbox-service-${service.toLowerCase().replaceAll(' ', '-')}`} />{service}</label>)}
            </div>
          </div>
        </aside>
        <section aria-label="Sample hospital results">
          <div className="results-heading">
            <div><strong>Hospitals to explore</strong><span className="results-count" data-testid="text-results-count">{filtered.length} sample {filtered.length === 1 ? 'result' : 'results'}</span></div>
            <label className="sort-control"><ArrowDownUp size={13} /><span>Sort</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort hospital results" data-testid="select-hospital-sort">
                <option value="distance">Nearest</option><option value="name">Name</option>
              </select>
            </label>
          </div>
          {filtered.length > 0 ? (
            <div className="hospital-list">{filtered.map((hospital, index) => <HospitalCard hospital={hospital} index={index} key={hospital.id} />)}</div>
          ) : (
            <div className="panel empty-results" data-testid="state-no-hospitals">
              <div className="empty-icon"><Search size={18} /></div>
              <strong>No sample listings match yet</strong>
              <p>Try another search or loosen one of the filters.</p>
              <button className="reset-search" type="button" onClick={resetFilters} data-testid="button-reset-hospital-search">Reset search and filters</button>
            </div>
          )}
          <p className="results-disclaimer">All facility names, locations, distances, service categories, emergency bed counts, and estimated wait times shown are fictional demo examples—not real or live availability, verified facility information, or medical guidance.</p>
        </section>
      </div>
      <div className="footer-note">HealthRoute AI · Team Crafty Crew · Healthcare coordination prototype</div>
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Shell>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/hospitals" component={Hospitals} />
          <Route path="/doctors" component={DoctorAppointments} />
          <Route path="/labs" component={Laboratories} />
          <Route path="/pharmacies" component={Pharmacies} />
          <Route component={NotFound} />
        </Switch>
      </Shell>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DemoBookingProvider>
          <DemoLabBookingProvider>
            <DemoPharmacyOrderProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
                <Router />
              </WouterRouter>
            </DemoPharmacyOrderProvider>
          </DemoLabBookingProvider>
        </DemoBookingProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
