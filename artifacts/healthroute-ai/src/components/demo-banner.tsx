import { Info } from 'lucide-react';

export function DemoBanner() {
  return (
    <div className="demo-banner" role="note" data-testid="notice-synthetic-data">
      <Info size={16} />
      <div><strong>Prototype using synthetic sample data.</strong> This is a demo only—not real patient or hospital information, and not medical advice.</div>
    </div>
  );
}
