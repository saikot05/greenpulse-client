'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { useMutation } from '@tanstack/react-query';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyzeCarbonData } from '@/lib/api-client';
import { CloudUpload, AlertCircle, CheckCircle, Flame } from 'lucide-react';

interface CarbonAnalysisResult {
  summary: {
    totalEmissionsCo2e: number;
    scope1: number;
    scope2: number;
    scope3: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  anomalies: Array<{
    date: string;
    issue: string;
    severity: 'WARNING' | 'CRITICAL';
  }>;
  recommendations: Array<{
    title: string;
    action: string;
    estimatedReductionImpact: string;
  }>;
  chartData: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = ['#10b981', '#34d399', '#6ee7b7']; // Green palette for scopes

export default function CarbonAnalysisPanel() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { mutate, data, isPending } = useMutation({
    mutationFn: analyzeCarbonData,
    onError: (err: any) => {
      setErrorMsg(err.message || 'Failed to analyze data.');
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setErrorMsg(null);
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length) {
            setErrorMsg('Failed to parse CSV.');
            return;
          }
          mutate(results.data);
        },
      });
    } else if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          mutate(Array.isArray(json) ? json : [json]);
        } catch {
          setErrorMsg('Failed to parse JSON.');
        }
      };
      reader.readAsText(file);
    } else {
      setErrorMsg('Unsupported file format. Please upload CSV or JSON.');
    }
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
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Upload Area */}
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors
          ${isDragActive ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/80'}`}
      >
        <input {...getInputProps()} />
        <CloudUpload className="h-12 w-12 text-emerald-500 mb-4" />
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {isDragActive ? 'Drop your carbon records here' : 'Drag & drop Carbon Records'}
        </h3>
        <p className="text-sm text-neutral-500 mt-2">
          Upload CSV or JSON files containing energy usage, fleet data, or supply chain logs.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" /> {errorMsg}
        </div>
      )}

      {/* Loading State */}
      {isPending && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-2xl"></div>
          <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-2xl"></div>
          <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-2xl"></div>
          <div className="col-span-1 md:col-span-3 h-64 bg-neutral-200 dark:bg-neutral-800 rounded-2xl mt-4"></div>
        </div>
      )}

      {/* Results Rendering */}
      {data && !isPending && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-sm">
              <p className="text-sm text-neutral-500 font-medium mb-1">Total Emissions (CO2e)</p>
              <h4 className="text-3xl font-bold text-neutral-900 dark:text-white">
                {data.summary.totalEmissionsCo2e.toLocaleString()} <span className="text-lg font-normal text-neutral-500">tons</span>
              </h4>
            </div>
            <div className="p-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-sm">
              <p className="text-sm text-neutral-500 font-medium mb-1">Risk Level</p>
              <div className="flex items-center gap-2 mt-1">
                {data.summary.riskLevel === 'HIGH' ? (
                  <Flame className="h-8 w-8 text-red-500" />
                ) : data.summary.riskLevel === 'MEDIUM' ? (
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
                ) : (
                  <CheckCircle className="h-8 w-8 text-emerald-500" />
                )}
                <h4 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {data.summary.riskLevel}
                </h4>
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-sm flex items-center justify-center">
              <ResponsiveContainer width="100%" height={100}>
                <PieChart>
                  <Pie data={data.chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={30} outerRadius={45}>
                    {data.chartData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Anomalies */}
            <div className="p-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" /> Detected Anomalies
              </h3>
              <div className="space-y-4">
                {data.anomalies.map((anomaly: any, i: number) => (
                  <div key={i} className="flex gap-3 items-start border-l-4 border-red-500 pl-3 py-1">
                    <div>
                      <p className="text-xs font-semibold text-neutral-500">{anomaly.date} • {anomaly.severity}</p>
                      <p className="text-sm text-neutral-800 dark:text-neutral-200 mt-1">{anomaly.issue}</p>
                    </div>
                  </div>
                ))}
                {data.anomalies.length === 0 && (
                  <p className="text-sm text-neutral-500">No anomalies detected in the provided records.</p>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" /> AI Recommendations
              </h3>
              <div className="space-y-4">
                {data.recommendations.map((rec: any, i: number) => (
                  <div key={i} className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                    <h4 className="font-semibold text-emerald-800 dark:text-emerald-400 text-sm">{rec.title}</h4>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">{rec.action}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-2 font-medium">Impact: {rec.estimatedReductionImpact}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
