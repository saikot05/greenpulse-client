import { Metadata } from 'next';
import CarbonAnalysisPanel from '@/components/carbon/CarbonAnalysisPanel';
import { Leaf } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Carbon Analysis | GreenPulse AI',
  description: 'AI-driven carbon footprint analysis and risk assessment.',
};

export default function CarbonAnalysisPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
          <Leaf className="h-6 w-6 text-emerald-500" />
          Carbon Analysis
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          Upload telemetry records (CSV/JSON) to receive AI-generated footprint analysis, anomaly detection, and reduction recommendations.
        </p>
      </div>

      <CarbonAnalysisPanel />
    </div>
  );
}
