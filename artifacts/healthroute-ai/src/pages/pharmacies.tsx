import { useMemo, useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  ClipboardList,
  MapPin,
  PackageCheck,
  Search,
  ShieldCheck,
  Store,
} from 'lucide-react';
import { DemoBanner } from '@/components/demo-banner';
import {
  demoMedicines,
  demoPharmacies,
  type MedicineCategory,
} from '@/data/demo-pharmacy-inventory';
import {
  useDemoPharmacyOrders,
  type DemoPharmacyOrder,
} from '@/lib/demo-pharmacy-orders';
import './pharmacies.css';

type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';
type StockFilter = 'all' | StockStatus;

function stockStatus(count: number): StockStatus {
  if (count === 0) return 'Out of Stock';
  return count <= 5 ? 'Low Stock' : 'In Stock';
}

function OrderConfirmation({ order }: { order: DemoPharmacyOrder }) {
  return (
    <section className="pharmacy-confirmation" role="status" data-testid="pharmacy-order-confirmation">
      <CheckCircle2 size={21} aria-hidden="true" />
      <div className="pharmacy-confirmation-copy">
        <strong>Demo request received</strong>
        <span>{order.quantity} × {order.medicineName} {order.strength} · fictional listing</span>
        <span>{order.pharmacyName}</span>
        <span>This is not a real reservation or a guarantee of availability.</span>
      </div>
      <div className="pharmacy-reference"><span>Demo reference</span><strong>{order.reference}</strong></div>
    </section>
  );
}

export default function Pharmacies() {
  const { orders, getRemainingStock, requestDemoOrder } = useDemoPharmacyOrders();
  const [search, setSearch] = useState('');
  const [pharmacyFilter, setPharmacyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [selectedPharmacy, setSelectedPharmacy] = useState(demoPharmacies[0]?.id ?? '');
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [formError, setFormError] = useState('');
  const [confirmation, setConfirmation] = useState<DemoPharmacyOrder | null>(null);

  const categories = useMemo(() => Array.from(new Set(demoMedicines.map((item) => item.category))) as MedicineCategory[], []);
  const visibleMedicines = useMemo(() => {
    const term = search.trim().toLowerCase();
    return demoMedicines.filter((medicine) => {
      const pharmacy = demoPharmacies.find((item) => item.id === medicine.pharmacyId);
      const textMatch = !term || [medicine.name, medicine.category, medicine.strength, medicine.dosageForm, pharmacy?.name, pharmacy?.location].join(' ').toLowerCase().includes(term);
      const pharmacyMatch = pharmacyFilter === 'all' || medicine.pharmacyId === pharmacyFilter;
      const categoryMatch = categoryFilter === 'all' || medicine.category === categoryFilter;
      const statusMatch = stockFilter === 'all' || stockStatus(getRemainingStock(medicine.id)) === stockFilter;
      return textMatch && pharmacyMatch && categoryMatch && statusMatch;
    });
  }, [search, pharmacyFilter, categoryFilter, stockFilter, getRemainingStock, orders]);

  const pharmacyMedicines = demoMedicines.filter((medicine) => medicine.pharmacyId === selectedPharmacy);
  const activeMedicineId = pharmacyMedicines.some((medicine) => medicine.id === selectedMedicine)
    ? selectedMedicine
    : pharmacyMedicines[0]?.id ?? '';
  const selectedMedicineData = demoMedicines.find((medicine) => medicine.id === activeMedicineId);
  const selectedPharmacyData = demoPharmacies.find((pharmacy) => pharmacy.id === selectedPharmacy);
  const selectedRemaining = selectedMedicineData ? getRemainingStock(selectedMedicineData.id) : 0;

  function resetFilters() {
    setSearch('');
    setPharmacyFilter('all');
    setCategoryFilter('all');
    setStockFilter('all');
  }

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedQuantity = Number(quantity);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      setFormError('Enter a whole-number quantity greater than zero.');
      return;
    }
    if (!selectedMedicineData) {
      setFormError('Choose a fictional demo medicine first.');
      return;
    }
    const result = requestDemoOrder({
      pharmacyId: selectedPharmacy,
      medicineId: selectedMedicineData.id,
      quantity: parsedQuantity,
    });
    if (result.status !== 'requested') {
      const messages = {
        'invalid-quantity': 'Enter a whole-number quantity greater than zero.',
        'unknown-item': 'That fictional demo listing could not be found. Please choose it again.',
        'insufficient-stock': `Only ${result.remaining ?? 0} fictional demo ${result.remaining === 1 ? 'unit remains' : 'units remain'}. Adjust your quantity.`,
        duplicate: 'This exact pharmacy, medicine, and quantity request was already submitted this session.',
      };
      setFormError(messages[result.status]);
      return;
    }
    setFormError('');
    setQuantity('1');
    setConfirmation(result.order);
  }

  return (
    <main className="content pharmacy-page page-enter">
      <div className="page-kicker"><Store size={13} /> Fictional medicine directory</div>
      <h1 className="page-title" data-testid="text-pharmacies-title">Browse demo medicine availability</h1>
      <p className="page-subtitle">Compare sample stock across fictional pharmacies, then try a session-only request.</p>
      <DemoBanner />

      <section className="pharmacy-safety-note" aria-label="Important demo and medicine safety information">
        <ShieldCheck size={18} aria-hidden="true" />
        <p><strong>Demo information only.</strong> All pharmacy listings, medicine details, stock counts, and opening statuses are fictional. Orders are requests in a demo only, not real reservations. Ask a qualified pharmacist or clinician about suitability. Prescription-only products require a valid prescription.</p>
      </section>

      {confirmation && <OrderConfirmation order={confirmation} />}

      <section className="panel pharmacy-filters" aria-label="Search and filter fictional medicine inventory">
        <label className="pharmacy-filter-search">
          <span>Search demo inventory</span>
          <span className="pharmacy-search-input"><Search size={15} aria-hidden="true" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Medicine, form, category, or pharmacy" aria-label="Search fictional medicine inventory" data-testid="input-pharmacy-search" /></span>
        </label>
        <label className="pharmacy-filter-control"><span>Fictional pharmacy</span>
          <select value={pharmacyFilter} onChange={(event) => setPharmacyFilter(event.target.value)} aria-label="Filter by fictional pharmacy" data-testid="select-pharmacy-filter">
            <option value="all">All sample pharmacies</option>
            {demoPharmacies.map((pharmacy) => <option value={pharmacy.id} key={pharmacy.id}>{pharmacy.name}</option>)}
          </select>
        </label>
        <label className="pharmacy-filter-control"><span>Demo category</span>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} aria-label="Filter by demo medicine category" data-testid="select-medicine-category">
            <option value="all">All sample categories</option>
            {categories.map((category) => <option value={category} key={category}>{category}</option>)}
          </select>
        </label>
        <label className="pharmacy-filter-control"><span>Fictional stock status</span>
          <select value={stockFilter} onChange={(event) => setStockFilter(event.target.value as StockFilter)} aria-label="Filter by fictional stock availability" data-testid="select-stock-availability">
            <option value="all">All demo stock statuses</option><option value="In Stock">In Stock (&gt;5)</option><option value="Low Stock">Low Stock (1–5)</option><option value="Out of Stock">Out of Stock (0)</option>
          </select>
        </label>
      </section>

      <div className="pharmacy-main-grid">
        <section aria-label="Fictional pharmacy inventory results">
          <div className="pharmacy-results-heading">
            <div><h2>Sample inventory</h2><span>{visibleMedicines.length} fictional demo {visibleMedicines.length === 1 ? 'listing' : 'listings'}</span></div>
            {(search || pharmacyFilter !== 'all' || categoryFilter !== 'all' || stockFilter !== 'all') && <button type="button" className="pharmacy-clear" onClick={resetFilters} data-testid="button-clear-pharmacy-filters">Clear filters</button>}
          </div>
          {visibleMedicines.length ? (
            <div className="pharmacy-inventory-list">
              {visibleMedicines.map((medicine) => {
                const pharmacy = demoPharmacies.find((item) => item.id === medicine.pharmacyId);
                const remaining = getRemainingStock(medicine.id);
                const status = stockStatus(remaining);
                return (
                  <article className="panel pharmacy-medicine-card" key={medicine.id} data-testid={`card-medicine-${medicine.id}`}>
                    <div className="pharmacy-medicine-icon"><PackageCheck size={19} aria-hidden="true" /></div>
                    <div className="pharmacy-medicine-copy">
                      <span className="pharmacy-listing-label">Fictional demo medicine</span>
                      <h3>{medicine.name} <span>{medicine.strength}</span></h3>
                      <div className="pharmacy-medicine-meta"><span>{medicine.dosageForm}</span><span>{medicine.category}</span></div>
                      <div className="pharmacy-location"><MapPin size={12} aria-hidden="true" />{pharmacy?.name} · {pharmacy?.location}<span className={`pharmacy-opening ${pharmacy?.openingStatus.toLowerCase().replace(' ', '-')}`} aria-label={`Fictional demo opening status: ${pharmacy?.openingStatus ?? 'unknown'}`}>Opening status · {pharmacy?.openingStatus} · demo</span></div>
                    </div>
                    <div className="pharmacy-stock" aria-label={`${remaining} fictional demo units, ${status}`} data-testid={`status-stock-${medicine.id}`}>
                      <span className={`pharmacy-stock-badge ${status.toLowerCase().replaceAll(' ', '-')}`}>{status} · demo</span>
                      <strong>{remaining}</strong><span>demo {remaining === 1 ? 'unit' : 'units'} remaining</span>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="panel pharmacy-empty" data-testid="state-no-pharmacy-results">
              <div className="pharmacy-empty-mark"><Search size={18} /></div>
              <strong>No fictional inventory matches</strong>
              <p>Try a different term or clear one or more filters.</p>
              <button type="button" onClick={resetFilters} data-testid="button-reset-pharmacy-search">Reset search and filters</button>
            </div>
          )}
          <p className="pharmacy-results-disclaimer">Names, categories, stock counts, and pharmacy statuses are invented examples. Stock updates only in this browser session and is not live inventory.</p>
        </section>

        <aside className="panel pharmacy-order-panel" aria-labelledby="pharmacy-order-heading">
          <div className="pharmacy-order-heading">
            <div className="pharmacy-order-icon"><ClipboardList size={18} /></div>
            <div><span>Session-only interaction</span><h2 id="pharmacy-order-heading">Try a demo request</h2></div>
          </div>
          <p className="pharmacy-order-intro">Select a fictional listing and quantity to see how a request flow works.</p>
          <form className="pharmacy-order-form" onSubmit={submitOrder} noValidate data-testid="form-pharmacy-order">
            <label htmlFor="demo-order-pharmacy">Fictional pharmacy</label>
            <select id="demo-order-pharmacy" value={selectedPharmacy} onChange={(event) => { setSelectedPharmacy(event.target.value); setSelectedMedicine(''); setFormError(''); }} data-testid="select-order-pharmacy">
              {demoPharmacies.map((pharmacy) => <option key={pharmacy.id} value={pharmacy.id}>{pharmacy.name}</option>)}
            </select>
            {selectedPharmacyData && <div className="pharmacy-selected-location"><MapPin size={12} />{selectedPharmacyData.location}<span className={`pharmacy-opening ${selectedPharmacyData.openingStatus.toLowerCase().replace(' ', '-')}`} aria-label={`Fictional demo opening status: ${selectedPharmacyData.openingStatus}`}>Opening status · {selectedPharmacyData.openingStatus} · demo</span></div>}
            <label htmlFor="demo-order-medicine">Fictional demo medicine</label>
            <select id="demo-order-medicine" value={activeMedicineId} onChange={(event) => { setSelectedMedicine(event.target.value); setFormError(''); }} disabled={!pharmacyMedicines.length} data-testid="select-order-medicine">
              {pharmacyMedicines.map((medicine) => <option value={medicine.id} key={medicine.id}>{medicine.name} · {medicine.strength} · demo</option>)}
            </select>
            {selectedMedicineData && <div className="pharmacy-remaining-note">{selectedMedicineData.dosageForm} · {selectedMedicineData.category} · {selectedRemaining} fictional demo {selectedRemaining === 1 ? 'unit' : 'units'} remaining</div>}
            <label htmlFor="demo-order-quantity">Quantity</label>
            <input id="demo-order-quantity" type="number" min="1" step="1" inputMode="numeric" value={quantity} onChange={(event) => { setQuantity(event.target.value); setFormError(''); }} aria-describedby="demo-order-quantity-help" data-testid="input-order-quantity" />
            <span id="demo-order-quantity-help" className="pharmacy-quantity-help">Enter a positive whole number, up to the fictional demo stock remaining.</span>
            <button className="pharmacy-request-button" type="submit" disabled={!selectedMedicineData || selectedRemaining === 0} data-testid="button-submit-pharmacy-order">Send demo request</button>
            {formError && <p className="pharmacy-form-error" role="alert" data-testid="error-pharmacy-order">{formError}</p>}
          </form>
          <p className="pharmacy-order-caveat">A request here is not a reservation or a promise of stock. Ask a qualified pharmacist or clinician about suitability.</p>
        </aside>
      </div>

      <section className="panel my-pharmacy-orders" aria-labelledby="my-pharmacy-orders-heading" data-testid="section-my-medicine-orders">
        <div className="pharmacy-results-heading">
          <div><h2 id="my-pharmacy-orders-heading">My Medicine Orders</h2><span className="pharmacy-session-note">Demo requests · this session only</span></div>
          <span className="pharmacy-order-count">{orders.length} {orders.length === 1 ? 'request' : 'requests'}</span>
        </div>
        {orders.length === 0 ? (
          <div className="pharmacy-orders-empty" data-testid="state-no-medicine-orders">
            <ClipboardList size={18} aria-hidden="true" />
            <div><strong>No demo requests yet</strong><span>Submitted fictional requests will appear here with a unique demo reference.</span></div>
          </div>
        ) : (
          <div className="pharmacy-orders-list">
            {orders.map((order) => (
              <article className="pharmacy-order-row" key={order.reference} data-testid={`medicine-order-${order.reference}`}>
                <div className="pharmacy-order-row-mark"><CheckCircle2 size={16} /></div>
                <div className="pharmacy-order-row-copy">
                  <strong>{order.quantity} × {order.medicineName} {order.strength} · fictional demo</strong>
                  <span>{order.dosageForm} · {order.pharmacyName}</span>
                  <span>Demo request only · not a real reservation</span>
                </div>
                <div className="pharmacy-order-row-reference"><span>Demo reference</span><strong>{order.reference}</strong></div>
              </article>
            ))}
          </div>
        )}
      </section>
      <div className="footer-note">HealthRoute AI · Team Crafty Crew · Fictional sample inventory for a coordination prototype</div>
    </main>
  );
}
