'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import {
  Card,
  TextField,
  Label,
  Input,
  TextArea,
  FieldError,
  Select,
  ListBox,
  Button,
  Spinner,
} from '@heroui/react';

import { useSession } from '@/lib/auth-client';
import { parseUtilityBill, createAudit, type IEsgAuditInput } from '@/lib/api-client';

// ─── SVG Icons ──────────────────────────────────────────────────────────────
function CloudUploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
    </svg>
  );
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  );
}

function SuccessIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

// ─── Zod Validation Schema ──────────────────────────────────────────────────
const auditSchema = z.object({
  title: z
    .string()
    .min(3, 'Audit title must be at least 3 characters.')
    .trim(),
  facilityName: z
    .string()
    .min(2, 'Facility name must be at least 2 characters.')
    .trim(),
  facilityType: z
    .string()
    .min(1, 'Please select a facility type.'),
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters.')
    .trim(),
  auditYear: z.coerce
    .number()
    .int('Year must be an integer.')
    .min(1900, 'Year must be 1900 or later.')
    .max(2100, 'Year cannot exceed 2100.'),
  scopeCategory: z
    .string()
    .min(1, 'Please select a scope category.'),
  carbonScoreTons: z.coerce
    .number()
    .min(0, 'Carbon score cannot be negative.'),
  energyUsageKwh: z.coerce
    .number()
    .min(0, 'Energy usage cannot be negative.'),
  riskRating: z
    .string()
    .min(1, 'Please select a risk rating.'),
  shortDescription: z
    .string()
    .min(10, 'Short description must be at least 10 characters.')
    .trim(),
  fullOverview: z
    .string()
    .min(20, 'Full overview must be at least 20 characters.')
    .trim(),
  imageUrl: z
    .string()
    .url('Must be a valid HTTP URL.')
    .optional()
    .or(z.literal('')),
});

type AuditFormData = z.infer<typeof auditSchema>;

export default function AddAuditPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // OCR state management
  const [ocrFile, setOcrFile] = useState<File | null>(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [ocrSuccess, setOcrSuccess] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Form initialization
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(auditSchema),
    defaultValues: {
      title: '',
      facilityName: '',
      facilityType: '',
      location: '',
      auditYear: new Date().getFullYear(),
      scopeCategory: '',
      carbonScoreTons: 0,
      energyUsageKwh: 0,
      riskRating: '',
      shortDescription: '',
      fullOverview: '',
      imageUrl: '',
    },
  });

  const selectedFacilityType = watch('facilityType');
  const selectedScopeCategory = watch('scopeCategory');
  const selectedRiskRating = watch('riskRating');

  // Protect layout: redirect if unauthenticated
  useEffect(() => {
    if (!isSessionLoading && !session?.user) {
      router.push('/login');
    }
  }, [session, isSessionLoading, router]);

  // ─── API Mutations ────────────────────────────────────────────────────────

  // Gemini OCR Scan utility bill mutation
  const ocrMutation = useMutation({
    mutationFn: (file: File) => parseUtilityBill(file),
    onMutate: () => {
      setOcrError(null);
      setOcrSuccess(false);
      setOcrProgress(15);
      const interval = setInterval(() => {
        setOcrProgress((prev) => (prev < 90 ? prev + 12 : prev));
      }, 400);
      return { interval };
    },
    onSuccess: (rawData) => {
      setOcrSuccess(true);
      setOcrProgress(100);
      
      const data = (rawData as any)?.data || rawData;
      const facilityName = data?.facilityName || 'Unknown Facility';
      const energyUsageKwh = Number(data?.energyUsageKwh ?? data?.energyUsage ?? 0);
      const estimatedCarbonTons = Number(data?.estimatedCarbonTons ?? data?.carbonScoreTons ?? 0);

      // Auto-populate form fields
      reset({
        title: `Audit - ${facilityName} (${energyUsageKwh} kWh)`,
        facilityName: facilityName,
        facilityType: data?.facilityType || 'Corporate Office',
        location: 'Detected Location',
        auditYear: new Date().getFullYear(),
        scopeCategory: data?.scopeCategory || 'Scope 2 (Indirect Energy)',
        carbonScoreTons: estimatedCarbonTons,
        energyUsageKwh: energyUsageKwh,
        riskRating: data?.riskRating || 'Low Carbon',
        shortDescription: data?.shortDescription || 'AI Generated Decarbonization Audit',
        fullOverview: data?.fullOverview || 'Detailed environmental sustainability assessment.',
        imageUrl: '',
      });
    },
    onError: (err) => {
      setOcrError(err.message || 'Failed to analyze invoice data.');
      setOcrProgress(0);
      setToastMsg({
        type: 'error',
        text: 'The AI Agent router quota is temporarily full. Please wait 10-15 seconds and retry, or enter values manually.',
      });
      setTimeout(() => setToastMsg(null), 8000);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.interval) {
        clearInterval(context.interval);
      }
    },
  });

  // Create Audit Mutation
  const createAuditMutation = useMutation({
    mutationFn: createAudit,
    onSuccess: () => {
      router.push('/explore');
      router.refresh();
    },
  });

  // ─── File Upload Dropzone Handlers ─────────────────────────────────────────

  const handleFileChange = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setOcrError('Unsupported file type. Please upload a PDF or an image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setOcrError('File size exceeds the 5MB limit.');
      return;
    }

    setOcrFile(file);
    ocrMutation.mutate(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const onSubmit = (data: AuditFormData) => {
    const payload: IEsgAuditInput & { createdBy?: string } = {
      ...data,
      tags: [], // Handled by server if empty
      createdBy: session?.user?.id,
    };
    createAuditMutation.mutate(payload);
  };

  if (!mounted || isSessionLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Spinner size="lg" />
        <span className="text-sm text-neutral-500">Checking session...</span>
      </div>
    );
  }

  if (!session?.user) {
    return null; // Prevents flashing before redirect
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Title Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl">
          Add sustainability audit
        </h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Create a new environmental trace log manually or use Gemini AI scanner to pre-fill from a utility bill.
        </p>
      </div>

      {/* ─── AI Dropzone Section ─────────────────────────────────────────────── */}
      <Card className="p-6 mb-8 border border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-lg shadow-emerald-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-md font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
            <span>✨</span> Magic AI Pre-fill with Utility Bill OCR
          </h2>
          <span className="inline-flex items-center rounded-md bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
            ✨ Powered by GreenPulse Smart AI Agent
          </span>
        </div>
        
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-emerald-300 dark:border-emerald-800/80 hover:border-emerald-500 dark:hover:border-emerald-600 rounded-xl p-8 text-center transition-colors cursor-pointer group bg-white/50 dark:bg-neutral-900/40"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*,application/pdf';
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) handleFileChange(file);
            };
            input.click();
          }}
        >
          <div className="flex flex-col items-center justify-center">
            {ocrMutation.isPending ? (
              <div className="w-full max-w-xs space-y-4">
                <Spinner size="md" />
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  Smart AI Agent is analyzing invoice data...
                </p>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${ocrProgress}%` }} />
                </div>
              </div>
            ) : ocrSuccess ? (
              <div className="space-y-2">
                <SuccessIcon className="h-10 w-10 text-emerald-500 mx-auto" />
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                  Utility bill parsed successfully!
                </p>
                <p className="text-xs text-neutral-400">
                  {(ocrFile?.name ?? '')} · Click to scan another file
                </p>
              </div>
            ) : (
              <>
                <CloudUploadIcon className="h-10 w-10 text-emerald-500 group-hover:scale-105 transition-transform mb-3" />
                <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Drag and drop utility bill invoice, or click to upload
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Supports JPEG, PNG, WebP images or PDF files (max 5MB)
                </p>
              </>
            )}
          </div>
        </div>

        {ocrError && (
          <div className="mt-4 flex items-start gap-2.5 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 text-sm text-red-700 dark:text-red-400">
            <WarningIcon className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{ocrError}</span>
          </div>
        )}
      </Card>

      {/* ─── Form Fields Section ─────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6 border border-neutral-200 dark:border-neutral-800 shadow-md">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            
            {/* Title */}
            <div className="sm:col-span-2">
              <TextField isInvalid={!!errors.title}>
                <Label>Audit Title</Label>
                <Input placeholder="e.g. Q3 Electricity Carbon Audit" {...register('title')} aria-label="Audit Title" />
                {errors.title && <FieldError>{errors.title.message}</FieldError>}
              </TextField>
            </div>

            {/* Facility Name */}
            <div>
              <TextField isInvalid={!!errors.facilityName}>
                <Label>Facility Name</Label>
                <Input placeholder="e.g. Austin DC-2" {...register('facilityName')} aria-label="Facility Name" />
                {errors.facilityName && <FieldError>{errors.facilityName.message}</FieldError>}
              </TextField>
            </div>

            {/* Facility Type */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Facility Type</label>
              <Select
                placeholder="Select facility type"
                className="w-full"
                selectedKey={selectedFacilityType || null}
                onSelectionChange={(key) => {
                  setValue('facilityType', String(key ?? ''), { shouldValidate: true });
                }}
                aria-label="Facility Type"
              >
                <Select.Trigger className="w-full flex items-center justify-between border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl bg-white dark:bg-neutral-950 p-1.5 z-50">
                  <ListBox>
                    <ListBox.Item id="Manufacturing" textValue="Manufacturing" className="px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer">
                      Manufacturing
                    </ListBox.Item>
                    <ListBox.Item id="Data Center" textValue="Data Center" className="px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer">
                      Data Center
                    </ListBox.Item>
                    <ListBox.Item id="Corporate Office" textValue="Corporate Office" className="px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer">
                      Corporate Office
                    </ListBox.Item>
                    <ListBox.Item id="Logistics Hub" textValue="Logistics Hub" className="px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer">
                      Logistics Hub
                    </ListBox.Item>
                    <ListBox.Item id="Retail Store" textValue="Retail Store" className="px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer">
                      Retail Store
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
              {errors.facilityType && (
                <span className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.facilityType.message}</span>
              )}
            </div>

            {/* Location */}
            <div>
              <TextField isInvalid={!!errors.location}>
                <Label>Location</Label>
                <Input placeholder="e.g. Austin, TX" {...register('location')} aria-label="Location" />
                {errors.location && <FieldError>{errors.location.message}</FieldError>}
              </TextField>
            </div>

            {/* Audit Year */}
            <div>
              <TextField isInvalid={!!errors.auditYear}>
                <Label>Audit Year</Label>
                <Input type="number" placeholder="e.g. 2026" {...register('auditYear')} aria-label="Audit Year" />
                {errors.auditYear && <FieldError>{errors.auditYear.message}</FieldError>}
              </TextField>
            </div>

            {/* Scope Category */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Scope Category</label>
              <Select
                placeholder="Select scope"
                className="w-full"
                selectedKey={selectedScopeCategory || null}
                onSelectionChange={(key) => {
                  setValue('scopeCategory', String(key ?? ''), { shouldValidate: true });
                }}
                aria-label="Scope Category"
              >
                <Select.Trigger className="w-full flex items-center justify-between border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl bg-white dark:bg-neutral-950 p-1.5 z-50">
                  <ListBox>
                    <ListBox.Item id="Scope 1 (Direct)" textValue="Scope 1 (Direct)" className="px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer">
                      Scope 1 (Direct)
                    </ListBox.Item>
                    <ListBox.Item id="Scope 2 (Indirect Energy)" textValue="Scope 2 (Indirect Energy)" className="px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer">
                      Scope 2 (Indirect Energy)
                    </ListBox.Item>
                    <ListBox.Item id="Scope 3 (Value Chain)" textValue="Scope 3 (Value Chain)" className="px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer">
                      Scope 3 (Value Chain)
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
              {errors.scopeCategory && (
                <span className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.scopeCategory.message}</span>
              )}
            </div>

            {/* Risk Rating */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Risk Rating</label>
              <Select
                placeholder="Select risk level"
                className="w-full"
                selectedKey={selectedRiskRating || null}
                onSelectionChange={(key) => {
                  setValue('riskRating', String(key ?? ''), { shouldValidate: true });
                }}
                aria-label="Risk Rating"
              >
                <Select.Trigger className="w-full flex items-center justify-between border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl bg-white dark:bg-neutral-950 p-1.5 z-50">
                  <ListBox>
                    <ListBox.Item id="Low Carbon" textValue="Low Carbon" className="px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer">
                      Low Carbon
                    </ListBox.Item>
                    <ListBox.Item id="Moderate Impact" textValue="Moderate Impact" className="px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer">
                      Moderate Impact
                    </ListBox.Item>
                    <ListBox.Item id="High Emissions" textValue="High Emissions" className="px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer">
                      High Emissions
                    </ListBox.Item>
                    <ListBox.Item id="Critical Failure" textValue="Critical Failure" className="px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer">
                      Critical Failure
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
              {errors.riskRating && (
                <span className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.riskRating.message}</span>
              )}
            </div>

            {/* Energy Usage */}
            <div>
              <TextField isInvalid={!!errors.energyUsageKwh}>
                <Label>Energy Usage (kWh)</Label>
                <Input type="number" placeholder="e.g. 4500" {...register('energyUsageKwh')} aria-label="Energy Usage (kWh)" />
                {errors.energyUsageKwh && <FieldError>{errors.energyUsageKwh.message}</FieldError>}
              </TextField>
            </div>

            {/* Carbon Score */}
            <div>
              <TextField isInvalid={!!errors.carbonScoreTons}>
                <Label>Carbon Score (Tons)</Label>
                <Input type="number" step="0.01" placeholder="e.g. 1.25" {...register('carbonScoreTons')} aria-label="Carbon Score (Tons)" />
                {errors.carbonScoreTons && <FieldError>{errors.carbonScoreTons.message}</FieldError>}
              </TextField>
            </div>

            {/* Short Description */}
            <div className="sm:col-span-2">
              <TextField isInvalid={!!errors.shortDescription}>
                <Label>Short Description</Label>
                <Input placeholder="Provide a quick summary of the audit findings (min 10 characters)" {...register('shortDescription')} aria-label="Short Description" />
                {errors.shortDescription && <FieldError>{errors.shortDescription.message}</FieldError>}
              </TextField>
            </div>

            {/* Full Overview */}
            <div className="sm:col-span-2">
              <TextField isInvalid={!!errors.fullOverview}>
                <Label>Full Overview</Label>
                <TextArea placeholder="Provide a detailed breakdown of carbon output tracing... (min 20 characters)" {...register('fullOverview')} rows={4} aria-label="Full Overview" />
                {errors.fullOverview && <FieldError>{errors.fullOverview.message}</FieldError>}
              </TextField>
            </div>

            {/* Image URL */}
            <div className="sm:col-span-2">
              <TextField isInvalid={!!errors.imageUrl}>
                <Label>Optional Image URL</Label>
                <Input placeholder="https://example.com/facility.jpg" {...register('imageUrl')} aria-label="Optional Image URL" />
                {errors.imageUrl && <FieldError>{errors.imageUrl.message}</FieldError>}
              </TextField>
            </div>
          </div>
        </Card>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onPress={() => router.back()}
            className="font-medium"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isDisabled={createAuditMutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-500 font-semibold text-white shadow-md shadow-emerald-500/20 disabled:bg-emerald-400"
          >
            {createAuditMutation.isPending ? <Spinner size="sm" /> : null}
            {createAuditMutation.isPending ? 'Saving...' : 'Save Audit'}
          </Button>
        </div>
      </form>

      {/* Floating Warning Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 rounded-xl border border-red-500 bg-red-50 dark:bg-red-950/90 text-red-800 dark:text-red-300 shadow-2xl animate-fade-in transition-all duration-300">
          <WarningIcon className="h-5 w-5 shrink-0" />
          <span className="text-sm font-semibold">{toastMsg.text}</span>
          <button 
            type="button"
            onClick={() => setToastMsg(null)} 
            className="ml-2 text-red-500 hover:text-red-700 dark:hover:text-red-200 transition-colors font-bold text-sm"
            aria-label="Close Toast"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
