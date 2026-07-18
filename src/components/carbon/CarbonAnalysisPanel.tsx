'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { analyzeTelemetryTelemetry } from '@/lib/api-client';
import { CloudUpload, AlertTriangle, CheckCircle, Flame, ShieldAlert, TrendingUp, BarChart2 } from 'lucide-react';
import { Card, Spinner } from '@heroui/react';

interface TelemetryAnalysisResult {
  summary: string;
  anomalies: string[];
  kpiMetrics: {
    totalEmissions: number;
    peakUsageTime: string;
    efficiencyScore: number;
  };
  chartData: Array<{
    label: string;
    emissions: number;
    consumption: number;
  }>;
}

export default function CarbonAnalysisPanel() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { mutate, data, isPending } = useMutation<TelemetryAnalysisResult, Error, File>({
    mutationFn: analyzeTelemetryTelemetry,
    onError: (err: any) => {
      setErrorMsg(err.message || 'Failed to analyze telemetry data file.');
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setErrorMsg(null);
    const file = acceptedFiles[0];
    if (!file) return;

    const allowedExtensions = ['.csv', '.json'];
    const hasValidExt = allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      setErrorMsg('Unsupported file format. Please upload a CSV or JSON file.');
      return;
    }

    mutate(file);
  }, [mutate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
    },
    multiple: false,
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Drag & Drop File Upload */}
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300
          ${isDragActive ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/5' : 'border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:bg-neutral-50 dark:hover:bg-neutral-900/80 shadow-sm'}`}
      >
        <input {...getInputProps()} />
        <CloudUpload className="h-12 w-12 text-emerald-500 mb-4 animate-bounce" />
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {isDragActive ? 'Drop your carbon telemetry here' : 'Drag & drop Telemetry logs'}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 max-w-md text-center">
          Upload energy telemetry CSV or JSON files (up to 5MB) containing hourly consumption metrics to receive AI carbon classifications.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-950 flex items-center gap-2 text-xs font-semibold">
          <AlertTriangle className="h-5 w-5 shrink-0" /> {errorMsg}
        </div>
      )}

      {/* Loading & Processing State */}
      {isPending && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-2xl"></div>
            <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-2xl"></div>
            <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-2xl"></div>
          </div>
          <Card className="p-8 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col items-center justify-center min-h-[300px] gap-3">
            <Spinner size="md" className="text-emerald-500" />
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Smart AI Agent is parsing logs and calculating Scope emissions...
            </p>
          </Card>
        </div>
      )}

      {/* Results Rendering */}
      {data && !isPending && (
        <div className="space-y-6 animate-fade-in">
          {/* KPI Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-lg shadow-emerald-500/5 flex flex-row items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Total Emissions</p>
                <h4 className="text-2xl font-extrabold text-neutral-950 dark:text-white mt-1">
                  {data.kpiMetrics.totalEmissions.toLocaleString()} <span className="text-xs font-normal text-neutral-500">tons CO₂e</span>
                </h4>
              </div>
            </Card>

            <Card className="p-6 border border-amber-500/20 bg-amber-50/20 dark:bg-amber-950/10 shadow-lg shadow-amber-500/5 flex flex-row items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Peak Usage Period</p>
                <h4 className="text-lg font-extrabold text-neutral-950 dark:text-white mt-1 break-words">
                  {data.kpiMetrics.peakUsageTime}
                </h4>
              </div>
            </Card>

            <Card className="p-6 border border-cyan-500/20 bg-cyan-50/20 dark:bg-cyan-950/10 shadow-lg shadow-cyan-500/5 flex flex-row items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Efficiency Score</p>
                <h4 className="text-2xl font-extrabold text-neutral-950 dark:text-white mt-1">
                  {data.kpiMetrics.efficiencyScore} <span className="text-xs font-normal text-neutral-500">/ 100</span>
                </h4>
              </div>
            </Card>
          </div>

          {/* Recharts Graphical Line Chart */}
          <Card className="p-6 border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-emerald-500" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Emissions & Consumption Trends</h3>
            </div>
            <div className="w-full h-80 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-800" />
                  <XAxis dataKey="label" className="text-[10px] text-neutral-500" />
                  <YAxis className="text-[10px] text-neutral-500" />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="consumption" name="Energy Usage (kWh)" stroke="#f59e0b" strokeWidth={2.5} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="emissions" name="Footprint (tons CO₂e)" stroke="#10b981" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* AI Trend Analysis & Anomalies Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-7 p-6 border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">AI Technical Trend Analysis</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line border-t border-neutral-100 dark:border-neutral-800 pt-4 font-medium">
                {data.summary}
              </p>
            </Card>

            <Card className="lg:col-span-5 p-6 border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500" /> Anomalies Checklist
              </h3>
              <div className="space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                {data.anomalies.map((anomaly, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-red-500/5 rounded-xl border border-red-500/10">
                    <span className="text-red-500 text-xs shrink-0 mt-0.5">⚠️</span>
                    <p className="text-xs text-neutral-600 dark:text-neutral-350 leading-relaxed font-semibold">
                      {anomaly}
                    </p>
                  </div>
                ))}
                {data.anomalies.length === 0 && (
                  <div className="flex items-start gap-3 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                    <span className="text-emerald-500 text-xs shrink-0">✅</span>
                    <p className="text-xs text-neutral-600 dark:text-neutral-350 leading-relaxed font-semibold">
                      No operational baseline anomalies detected.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
