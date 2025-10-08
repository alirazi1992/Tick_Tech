"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { AnyObjectSchema } from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  FolderOpen,
  FileText,
} from "lucide-react";

import { TicketFormStep1 } from "@/components/ticket-form-step1";
import { TicketFormStep2 } from "@/components/ticket-form-step2";
import {
  issueSelectionSchema,
  ticketDetailsSchema,
} from "@/lib/validation-schemas";
import { useAuth } from "@/lib/auth-context";
import type { UploadedFile } from "@/lib/file-upload";

/* ---------- Strong types ---------- */

type Priority = "low" | "medium" | "high" | "urgent";

/** Fields required in Step 1 */
interface IssueSelectionForm {
  priority: Priority | ""; // allow "" before user picks
  mainIssue: string;
  subIssue: string;
}

/** The many fields in Step 2 (all optional here so Step 1 is valid) */
interface TicketDetailsForm {
  title?: string;
  description?: string;
  additionalInfo?: string;

  deviceBrand?: string;
  deviceModel?: string;
  powerStatus?: string;
  lastWorking?: string;
  printerBrand?: string;
  printerType?: string;
  printerProblem?: string;
  monitorSize?: string;
  connectionType?: string;
  displayIssue?: string;
  operatingSystem?: string;
  osVersion?: string;
  osIssueType?: string;
  softwareName?: string;
  softwareVersion?: string;
  applicationIssue?: string;
  internetProvider?: string;
  connectionIssue?: string;
  wifiNetwork?: string;
  deviceType?: string;
  wifiIssue?: string;
  networkLocation?: string;
  emailProvider?: string;
  emailClient?: string;
  errorMessage?: string;
  emailAddress?: string;
  incidentTime?: string;
  securitySeverity?: string;
  affectedData?: string;
  requestedSystem?: string;
  accessLevel?: string;
  accessReason?: string;
  urgencyLevel?: string;
  trainingTopic?: string;
  currentLevel?: string;
  preferredMethod?: string;
  equipmentType?: string;
  maintenanceType?: string;
  preferredTime?: string;

  // dynamic fields will be added at runtime (dyn_*)
  [k: `dyn_${string}`]: unknown;
}

/** Full form values across both steps */
type FormValues = IssueSelectionForm & TicketDetailsForm;

const priorityLabels: Record<Priority, string> = {
  low: "کم",
  medium: "متوسط",
  high: "بالا",
  urgent: "فوری",
};

interface TwoStepTicketFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  categoriesData: any;
}

export function TwoStepTicketForm({
  onClose,
  onSubmit,
  categoriesData,
}: TwoStepTicketFormProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([]);

  // pick schema at runtime; cast to AnyObjectSchema so yupResolver accepts it
  const activeSchema: AnyObjectSchema = (currentStep === 1
    ? issueSelectionSchema
    : ticketDetailsSchema) as unknown as AnyObjectSchema;

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(activeSchema),
    defaultValues: {
      priority: "",
      mainIssue: "",
      subIssue: "",

      title: "",
      description: "",
      additionalInfo: "",

      deviceBrand: "",
      deviceModel: "",
      powerStatus: "",
      lastWorking: "",
      printerBrand: "",
      printerType: "",
      printerProblem: "",
      monitorSize: "",
      connectionType: "",
      displayIssue: "",
      operatingSystem: "",
      osVersion: "",
      osIssueType: "",
      softwareName: "",
      softwareVersion: "",
      applicationIssue: "",
      internetProvider: "",
      connectionIssue: "",
      wifiNetwork: "",
      deviceType: "",
      wifiIssue: "",
      networkLocation: "",
      emailProvider: "",
      emailClient: "",
      errorMessage: "",
      emailAddress: "",
      incidentTime: "",
      securitySeverity: "",
      affectedData: "",
      requestedSystem: "",
      accessLevel: "",
      accessReason: "",
      urgencyLevel: "",
      trainingTopic: "",
      currentLevel: "",
      preferredMethod: "",
      equipmentType: "",
      maintenanceType: "",
      preferredTime: "",
    },
  });

  const watchedValues = watch();
  const watchedPriority = (watchedValues.priority ?? "") as Priority | "";

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) setCurrentStep(2);
  };

  const handleBack = () => setCurrentStep(1);

  const handleFormSubmit = async (data: FormValues) => {
    try {
      const ticketId = `TK-${new Date().getFullYear()}-${String(
        Math.floor(Math.random() * 999) + 1
      ).padStart(3, "0")}`;

      // Extract dynamic fields: map keys starting with dyn_ to clean IDs
      const dynEntries = Object.entries(data)
        .filter(([k, v]) => k.startsWith("dyn_") && v !== undefined && v !== "")
        .map(([k, v]) => [k.replace(/^dyn_/, ""), v]);

      const ticketData = {
        id: ticketId,
        title: data.title,
        description: data.description,
        additionalInfo: data.additionalInfo,
        status: "open",
        priority: data.priority,
        category: data.mainIssue,
        subCategory: data.subIssue,
        clientName: user?.name || "",
        clientEmail: user?.email || "",
        clientPhone: user?.phone || "",
        createdAt: new Date().toISOString(),
        attachments: attachedFiles,
        dynamicFields: {
          // New dynamic fields (admin-defined)
          ...Object.fromEntries(dynEntries),
          // Legacy fields fallback (keep any remaining non-base values)
          ...Object.fromEntries(
            Object.entries(data).filter(
              ([key, value]) =>
                value &&
                !key.startsWith("dyn_") &&
                ![
                  "title",
                  "description",
                  "additionalInfo",
                  "priority",
                  "mainIssue",
                  "subIssue",
                ].includes(key)
            )
          ),
        },
      };

      onSubmit(ticketData);

      toast({
        title: "تیکت با موفقیت ثبت شد",
        description: `شماره تیکت شما: ${ticketId}`,
      });

      onClose();
    } catch {
      toast({
        title: "خطا در ثبت تیکت",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive",
      });
    }
  };

  const renderSummary = () => (
    <Card className="rounded-xl border border-amber-200/70 bg-amber-50/80 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-amber-50/70">
      <CardHeader className="pb-3 border-b border-amber-200/60">
        <CardTitle className="text-right font-iran">
          <span className="inline-flex items-center justify-end gap-2">
            <CheckCircle className="w-5 h-5" />
            خلاصه انتخاب‌های شما
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        <div className="space-y-2">
          <h4 className="font-medium text-right flex items-center gap-2 font-iran">
            <FolderOpen className="w-4 h-4" />
            اطلاعات مشکل
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">اولویت</span>
              <Badge variant="outline" className="text-xs font-iran">
                {watchedPriority
                  ? priorityLabels[watchedPriority as Priority]
                  : "انتخاب نشده"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">دسته‌بندی اصلی</span>
              <span className="font-iran">
                {watchedValues.mainIssue &&
                categoriesData?.[watchedValues.mainIssue]
                  ? categoriesData[watchedValues.mainIssue].label
                  : "انتخاب نشده"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">زیر دسته</span>
              <span className="font-iran">
                {watchedValues.mainIssue &&
                watchedValues.subIssue &&
                categoriesData?.[watchedValues.mainIssue]?.subIssues?.[
                  watchedValues.subIssue
                ]
                  ? categoriesData[watchedValues.mainIssue].subIssues[
                      watchedValues.subIssue
                    ].label
                  : "انتخاب نشده"}
              </span>
            </div>
          </div>
        </div>

        {currentStep === 2 && watchedValues.title ? (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium text-right flex items-center gap-2 font-iran">
                <FileText className="w-4 h-4" />
                عنوان و شرح مشکل
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">عنوان</span>
                  <span className="font-medium text-right max-w-xs font-iran">
                    {watchedValues.title}
                  </span>
                </div>
                {watchedValues.additionalInfo && (
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">
                      اطلاعات تکمیلی برای این مورد
                    </span>
                    <span className="text-right max-w-xs font-iran line-clamp-3">
                      {watchedValues.additionalInfo}
                    </span>
                  </div>
                )}
                {watchedValues.description && (
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">
                      شرح کامل مشکل (اختیاری)
                    </span>
                    <span className="text-right max-w-xs font-iran line-clamp-3">
                      {watchedValues.description}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}

        {attachedFiles.length > 0 ? (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium text-right font-iran">
                فایل‌های پیوست شده
              </h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="text-right font-iran">
                    • {file.name}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6" dir="rtl">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 space-x-reverse">
        <div
          className={`flex items-center ${
            currentStep >= 1 ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 1
                ? "border-primary bg-primary text-primary-foreground"
                : "border-muted-foreground"
            }`}
          >
            {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : "1"}
          </div>
          <span className="mr-2 text-sm font-medium">انتخاب مشکل</span>
        </div>

        <div
          className={`w-12 h-0.5 ${
            currentStep >= 2 ? "bg-primary" : "bg-muted-foreground"
          }`}
        />

        <div
          className={`flex items-center ${
            currentStep >= 2 ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 2
                ? "border-primary bg-primary text-primary-foreground"
                : "border-muted-foreground"
            }`}
          >
            2
          </div>
          <span className="mr-2 text-sm font-medium">جزئیات تیکت</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid gap-6 mt-6 lg:grid-cols-[320px_1fr]">
          <div className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
            {renderSummary()}
          </div>

          <div className="space-y-6">
            {currentStep === 1 && (
              <TicketFormStep1
                control={control}
                errors={errors}
                categoriesData={categoriesData}
              />
            )}

            {currentStep === 2 && (
              <TicketFormStep2
                control={control}
                errors={errors}
                selectedIssue={watchedValues.mainIssue}
                selectedSubIssue={watchedValues.subIssue}
                categoriesData={categoriesData}
                attachedFiles={attachedFiles}
                onFilesChange={setAttachedFiles}
              />
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              انصراف
            </Button>
            {currentStep === 2 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                <ChevronRight className="w-4 h-4 ml-1" />
                مرحله قبل
              </Button>
            )}
          </div>

          <div>
            {currentStep === 1 ? (
              <Button type="button" onClick={handleNext}>
                مرحله بعد
                <ChevronLeft className="w-4 h-4 mr-1" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "در حال ثبت..." : "ثبت تیکت"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
