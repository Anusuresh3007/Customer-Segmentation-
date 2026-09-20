import React from 'react';
import { CheckCircle2, Loader2, Circle, XCircle } from 'lucide-react';
import { Button } from '../common/Button';

interface SegmentationProgressProps {
  currentStep: number;
  totalSteps: number;
  stepMessage: string;
  onCancel: () => void;
}

export const SegmentationProgress: React.FC<SegmentationProgressProps> = ({
  currentStep,
  totalSteps,
  stepMessage,
  onCancel,
}) => {
  const steps = [
    { step: 1, title: 'Validating data', desc: 'Checking dataset integrity and missing value handling' },
    { step: 2, title: 'Processing customer attributes', desc: 'Standard scaling and outlier normalization' },
    { step: 3, title: 'Generating segments', desc: 'Partitioning feature space using distance centroids' },
    { step: 4, title: 'Calculating metrics', desc: 'Computing silhouette scores and centroid coordinates' },
    { step: 5, title: 'Preparing results', desc: 'Synthesizing cluster profiles and behavioral summaries' },
  ];

  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="bg-white rounded-xl border border-blue-200 p-6 sm:p-8 shadow-lg max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
            Clustering Workflow Running
          </span>
          <h3 className="text-lg font-bold text-gray-900 mt-1">
            Analyzing customer dataset...
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{stepMessage}</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          leftIcon={<XCircle className="w-4 h-4 text-red-500" />}
        >
          Cancel Job
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold text-gray-700">
          <span>Step {Math.min(currentStep, totalSteps)} of {totalSteps}</span>
          <span className="text-blue-600 font-bold">{percent}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl bg-gray-50/50 overflow-hidden text-xs">
        {steps.map((s) => {
          const isCompleted = s.step < currentStep;
          const isCurrent = s.step === currentStep;
          const isPending = s.step > currentStep;

          return (
            <div
              key={s.step}
              className={`p-3.5 flex items-start gap-3 transition-colors ${
                isCurrent ? 'bg-blue-50/70' : ''
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isCompleted && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                {isCurrent && <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />}
                {isPending && <Circle className="w-4 h-4 text-gray-300" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p
                    className={`font-semibold ${
                      isCurrent
                        ? 'text-blue-900 font-bold'
                        : isCompleted
                        ? 'text-gray-900'
                        : 'text-gray-400'
                    }`}
                  >
                    Step {s.step}: {s.title}
                  </p>
                  {isCompleted && (
                    <span className="text-[10px] text-green-600 font-semibold">Done ✓</span>
                  )}
                  {isCurrent && (
                    <span className="text-[10px] text-blue-600 font-semibold animate-pulse">
                      In progress...
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5 truncate">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
