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
import { CloudUpload, AlertTriangle, CheckCircle, Flame, ShieldAlert, TrendingUp, BarChart2, FileText, ArrowLeft } from 'lucide-react';
import { Card, Spinner, Button } from '@heroui/react';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';

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
  const { data: session, isPending: isSessionLoading } = useSession();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { mutate, data, isPending } = useMutation<TelemetryAnalysisResult, Error, File>({
    mutationFn: analyzeTelemetryTelemetry,
    onError: (err: any) => {
      setErrorMsg(err.message || 'Failed to analyze telemetry data file.');
    },
  });

  const isAdmin = (session?.user as any)?.role === 'admin';

  if (isSessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <Spinner size="md" className="text-emerald-500" />
        <p className="text-xs text-neutral-400">Loading session and parameters...</p>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <Card className="w-full p-8 border border-emerald-500/20 bg-zinc-950/40 backdrop-blur-md dark:bg-zinc-900/30 text-center space-y-6 shadow-[0_0_50px_rgba(16,185,129,0.08)] max-w-2xl mx-auto">
        <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <ShieldAlert className="h-8 w-8" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Access Denied</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-md mx-auto">
            Environmental Auditors have exclusive read-write access to telemetry analyzers. Tenant Administrators do not possess authorization to log or modify telemetry records.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/items/manage">
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 mx-auto">
              <ArrowLeft className="h-4 w-4" />
              Manage Audits View
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

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
    <>
      <div className="w-full max-w-6xl mx-auto space-y-8 print:hidden">
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
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-emerald-500" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Emissions & Consumption Trends</h3>
              </div>
              <button
                onClick={() => window.print()}
                className="border border-emerald-500 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors duration-300"
              >
                <FileText className="h-3.5 w-3.5" />
                Download AI Executive Report (PDF)
              </button>
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
                {data.anomalies.map((anomaly, idx) => {
                  const isCritical = anomaly.includes('CRITICAL ANOMALY');
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-300
                        ${isCritical 
                          ? 'bg-red-500/10 dark:bg-red-950/20 border-red-500 text-red-700 dark:text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
                          : 'bg-red-500/5 border-red-500/10 text-neutral-600 dark:text-neutral-350'}`}
                    >
                      {isCritical ? (
                        <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 animate-pulse mt-0.5" />
                      ) : (
                        <span className="text-red-500 text-xs shrink-0 mt-0.5">⚠️</span>
                      )}
                      <div className="flex-1 space-y-1">
                        <p className="text-xs leading-relaxed font-semibold">
                          {anomaly}
                        </p>
                        {isCritical && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white uppercase tracking-wider animate-pulse">
                            Critical Alert
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
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

      {/* Hidden Printable Report Container */}
      {data && !isPending && (
        <div className="hidden print:block print:w-full print:bg-white print:text-black print:p-8 space-y-6">
          <div className="flex justify-between items-center border-b-2 border-emerald-600 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">GreenPulse AI</h1>
              <p className="text-xs text-neutral-500 uppercase tracking-wide font-semibold">Environmental Compliance Report</p>
            </div>
            <div className="text-right text-xs text-neutral-400">
              <p>Report Date: {new Date().toLocaleDateString()}</p>
              <p>Status: Certified AI Analysis</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold text-neutral-800 border-b border-neutral-200 pb-1">1. Executive Summary</h2>
            <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-wrap">
              {data.summary}
            </p>
            <div className="grid grid-cols-3 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-100 mt-2">
              <div>
                <p className="text-[10px] text-neutral-450 font-bold uppercase">Total Emissions</p>
                <p className="text-base font-extrabold text-neutral-900 mt-0.5">{data.kpiMetrics.totalEmissions} tons CO₂e</p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-450 font-bold uppercase">Peak Usage Period</p>
                <p className="text-xs font-bold text-neutral-900 mt-0.5">{data.kpiMetrics.peakUsageTime}</p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-450 font-bold uppercase">Efficiency Score</p>
                <p className="text-base font-extrabold text-neutral-900 mt-0.5">{data.kpiMetrics.efficiencyScore} / 100</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold text-neutral-800 border-b border-neutral-200 pb-1">2. Logged Telemetry Data</h2>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-100 text-[10px] font-bold uppercase tracking-wider text-neutral-550 border-b border-neutral-200">
                  <th className="p-2.5">Time Label</th>
                  <th className="p-2.5 text-right">Energy Consumption (kWh)</th>
                  <th className="p-2.5 text-right">Estimated Emissions (tons CO₂e)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-150">
                {data.chartData.map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 font-medium text-neutral-700">{row.label}</td>
                    <td className="p-2.5 text-right text-neutral-800 font-semibold">{row.consumption.toLocaleString()} kWh</td>
                    <td className="p-2.5 text-right text-neutral-800 font-semibold">{row.emissions.toLocaleString()} t</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 pt-4 border-t-2 border-emerald-600">
            <h2 className="text-sm font-bold text-neutral-800 border-b border-neutral-200 pb-1">3. AI Decarbonization Roadmap</h2>
            <ul className="list-disc pl-4 text-xs text-neutral-600 space-y-1.5">
              <li>Transition office lighting and heavy HVAC elements to smart local power grids.</li>
              <li>Conduct an immediate mechanical audit targeting highlighted baseline anomaly spikes.</li>
              <li>Electrify thermal energy loops and integrate automated solar PV offsets.</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
