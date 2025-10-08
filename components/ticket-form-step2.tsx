"use client";

import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/file-upload";
import { DynamicFieldRenderer } from "@/components/dynamic-field-renderer";
import type { FormFieldDef } from "@/lib/dynamic-forms";
import {
  FileText,
  Paperclip,
  AlertCircle,
  Settings,
  HardDrive,
  Monitor,
  Printer,
  Wifi,
  Shield,
  Key,
  GraduationCap,
  Wrench,
} from "lucide-react";
import type { UploadedFile } from "@/lib/file-upload";

interface TicketFormStep2Props {
  control: any;
  errors: any;
  selectedIssue: string;
  selectedSubIssue: string;
  categoriesData?: any;
  attachedFiles: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
}

export function TicketFormStep2({
  control,
  errors,
  selectedIssue,
  selectedSubIssue,
  categoriesData,
  attachedFiles,
  onFilesChange,
}: TicketFormStep2Props) {
  const getDefinedFields = (): FormFieldDef[] => {
    if (!categoriesData || !selectedIssue) return [];
    const cat = categoriesData[selectedIssue];
    if (!cat) return [];
    const sub = selectedSubIssue
      ? cat?.subIssues?.[selectedSubIssue]
      : undefined;
    const subFields: FormFieldDef[] = sub?.fields || [];
    const catFields: FormFieldDef[] = cat?.fields || [];
    return (subFields && subFields.length > 0 ? subFields : catFields) || [];
  };

  const dynamicDefs = getDefinedFields();

  // force custom fields to be required + mark label with *
  const mandatoryDefs: FormFieldDef[] = dynamicDefs.map((f) => ({
    ...f,
    required: true,
    label: f.label?.includes("*") ? f.label : `${f.label} *`,
  }));

  // ----------------- fallback cards (only when there are no custom fields) -----------------
  const renderDynamicFields = () => {
    if (selectedIssue === "hardware") {
      if (selectedSubIssue === "computer-not-working") {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-right flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                اطلاعات تکمیلی رایانه *
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deviceBrand" className="text-right">
                    برند رایانه *
                  </Label>
                  <Controller
                    name="deviceBrand"
                    control={control}
                    rules={{ required: "برند رایانه الزامی است." }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        dir="rtl"
                      >
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="انتخاب برند" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dell">Dell</SelectItem>
                          <SelectItem value="hp">HP</SelectItem>
                          <SelectItem value="lenovo">Lenovo</SelectItem>
                          <SelectItem value="asus">ASUS</SelectItem>
                          <SelectItem value="acer">Acer</SelectItem>
                          <SelectItem value="apple">Apple</SelectItem>
                          <SelectItem value="other">سایر</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.deviceBrand && (
                    <p className="text-sm text-red-500 text-right">
                      {errors.deviceBrand.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deviceModel" className="text-right">
                    مدل رایانه *
                  </Label>
                  <Controller
                    name="deviceModel"
                    control={control}
                    rules={{ required: "مدل رایانه الزامی است." }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="مثال: OptiPlex 7090"
                        className="text-right"
                        dir="rtl"
                      />
                    )}
                  />
                  {errors.deviceModel && (
                    <p className="text-sm text-red-500 text-right">
                      {errors.deviceModel.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="powerStatus" className="text-right">
                    وضعیت روشن شدن *
                  </Label>
                  <Controller
                    name="powerStatus"
                    control={control}
                    rules={{ required: "انتخاب وضعیت روشن شدن الزامی است." }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        dir="rtl"
                      >
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="انتخاب وضعیت" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-power">
                            هیچ چراغی روشن نمی‌شود
                          </SelectItem>
                          <SelectItem value="power-but-no-display">
                            چراغ روشن می‌شود اما صفحه سیاه است
                          </SelectItem>
                          <SelectItem value="starts-then-shuts">
                            روشن می‌شود اما خاموش می‌شود
                          </SelectItem>
                          <SelectItem value="strange-sounds">
                            صدای عجیب می‌دهد
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.powerStatus && (
                    <p className="text-sm text-red-500 text-right">
                      {errors.powerStatus.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastWorking" className="text-right">
                    آخرین بار کی کار می‌کرد؟ *
                  </Label>
                  <Controller
                    name="lastWorking"
                    control={control}
                    rules={{ required: "انتخاب زمان الزامی است." }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        dir="rtl"
                      >
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="انتخاب زمان" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">امروز صبح</SelectItem>
                          <SelectItem value="yesterday">دیروز</SelectItem>
                          <SelectItem value="few-days">چند روز پیش</SelectItem>
                          <SelectItem value="week">یک هفته پیش</SelectItem>
                          <SelectItem value="longer">
                            بیشتر از یک هفته
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.lastWorking && (
                    <p className="text-sm text-red-500 text-right">
                      {errors.lastWorking.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }

      if (selectedSubIssue === "printer-issues") {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-right flex items-center gap-2">
                <Printer className="w-4 h-4" />
                اطلاعات تکمیلی چاپگر *
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="printerBrand" className="text-right">
                    برند چاپگر *
                  </Label>
                  <Controller
                    name="printerBrand"
                    control={control}
                    rules={{ required: "برند چاپگر الزامی است." }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        dir="rtl"
                      >
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="انتخاب برند" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hp">HP</SelectItem>
                          <SelectItem value="canon">Canon</SelectItem>
                          <SelectItem value="epson">Epson</SelectItem>
                          <SelectItem value="brother">Brother</SelectItem>
                          <SelectItem value="samsung">Samsung</SelectItem>
                          <SelectItem value="other">سایر</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.printerBrand && (
                    <p className="text-sm text-red-500 text-right">
                      {errors.printerBrand.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="printerType" className="text-right">
                    نوع چاپگر *
                  </Label>
                  <Controller
                    name="printerType"
                    control={control}
                    rules={{ required: "نوع چاپگر الزامی است." }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        dir="rtl"
                      >
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="نوع چاپگر" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inkjet">جوهرافشان</SelectItem>
                          <SelectItem value="laser">لیزری</SelectItem>
                          <SelectItem value="multifunction">چندکاره</SelectItem>
                          <SelectItem value="dot-matrix">سوزنی</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.printerType && (
                    <p className="text-sm text-red-500 text-right">
                      {errors.printerType.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="printerProblem" className="text-right">
                  مشکل دقیق چاپگر *
                </Label>
                <Controller
                  name="printerProblem"
                  control={control}
                  rules={{ required: "انتخاب مشکل چاپگر الزامی است." }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      dir="rtl"
                    >
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="انتخاب مشکل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-print">
                          اصلاً چاپ نمی‌کند
                        </SelectItem>
                        <SelectItem value="poor-quality">
                          کیفیت چاپ ضعیف
                        </SelectItem>
                        <SelectItem value="paper-jam">
                          کاغذ گیر می‌کند
                        </SelectItem>
                        <SelectItem value="ink-problem">
                          مشکل جوهر یا تونر
                        </SelectItem>
                        <SelectItem value="connection-issue">
                          مشکل اتصال
                        </SelectItem>
                        <SelectItem value="error-message">
                          پیام خطا می‌دهد
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.printerProblem && (
                  <p className="text-sm text-red-500 text-right">
                    {errors.printerProblem.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      }

      if (selectedSubIssue === "monitor-problems") {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-right flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                اطلاعات تکمیلی مانیتور *
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monitorSize" className="text-right">
                    سایز مانیتور *
                  </Label>
                  <Controller
                    name="monitorSize"
                    control={control}
                    rules={{ required: "انتخاب سایز مانیتور الزامی است." }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        dir="rtl"
                      >
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="انتخاب سایز" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="19">19 اینچ</SelectItem>
                          <SelectItem value="21">21 اینچ</SelectItem>
                          <SelectItem value="24">24 اینچ</SelectItem>
                          <SelectItem value="27">27 اینچ</SelectItem>
                          <SelectItem value="32">32 اینچ</SelectItem>
                          <SelectItem value="other">سایر</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.monitorSize && (
                    <p className="text-sm text-red-500 text-right">
                      {errors.monitorSize.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="connectionType" className="text-right">
                    نوع اتصال *
                  </Label>
                  <Controller
                    name="connectionType"
                    control={control}
                    rules={{ required: "انتخاب نوع اتصال الزامی است." }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        dir="rtl"
                      >
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="نوع کابل" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hdmi">HDMI</SelectItem>
                          <SelectItem value="vga">VGA</SelectItem>
                          <SelectItem value="dvi">DVI</SelectItem>
                          <SelectItem value="displayport">
                            DisplayPort
                          </SelectItem>
                          <SelectItem value="usb-c">USB-C</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.connectionType && (
                    <p className="text-sm text-red-500 text-right">
                      {errors.connectionType.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayIssue" className="text-right">
                  مشکل نمایش *
                </Label>
                <Controller
                  name="displayIssue"
                  control={control}
                  rules={{ required: "انتخاب مشکل نمایش الزامی است." }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      dir="rtl"
                    >
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="انتخاب مشکل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-display">
                          هیچ تصویری نمایش نمی‌دهد
                        </SelectItem>
                        <SelectItem value="flickering">
                          تصویر چشمک می‌زند
                        </SelectItem>
                        <SelectItem value="color-problem">مشکل رنگ</SelectItem>
                        <SelectItem value="resolution-issue">
                          مشکل وضوح تصویر
                        </SelectItem>
                        <SelectItem value="lines-spots">
                          خط یا لکه روی صفحه
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.displayIssue && (
                  <p className="text-sm text-red-500 text-right">
                    {errors.displayIssue.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      }

      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-right flex items-center gap-2">
              <Settings className="w-4 h-4" />
              اطلاعات تکمیلی سخت‌افزار *
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deviceBrand" className="text-right">
                  برند دستگاه *
                </Label>
                <Controller
                  name="deviceBrand"
                  control={control}
                  rules={{ required: "برند دستگاه الزامی است." }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="مثال: HP, Dell, ..."
                      className="text-right"
                      dir="rtl"
                    />
                  )}
                />
                {errors.deviceBrand && (
                  <p className="text-sm text-red-500 text-right">
                    {errors.deviceBrand.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="deviceModel" className="text-right">
                  مدل دستگاه *
                </Label>
                <Controller
                  name="deviceModel"
                  control={control}
                  rules={{ required: "مدل دستگاه الزامی است." }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="مدل دقیق دستگاه"
                      className="text-right"
                      dir="rtl"
                    />
                  )}
                />
                {errors.deviceModel && (
                  <p className="text-sm text-red-500 text-right">
                    {errors.deviceModel.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (selectedIssue === "software") {
      if (selectedSubIssue === "os-issues") {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-right flex items-center gap-2">
                <Settings className="w-4 h-4" />
                اطلاعات تکمیلی سیستم عامل *
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="operatingSystem" className="text-right">
                    سیستم عامل *
                  </Label>
                  <Controller
                    name="operatingSystem"
                    control={control}
                    rules={{ required: "انتخاب سیستم عامل الزامی است." }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        dir="rtl"
                      >
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="انتخاب سیستم عامل" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="windows-11">Windows 11</SelectItem>
                          <SelectItem value="windows-10">Windows 10</SelectItem>
                          <SelectItem value="windows-8">Windows 8</SelectItem>
                          <SelectItem value="macos">macOS</SelectItem>
                          <SelectItem value="linux">Linux</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.operatingSystem && (
                    <p className="text-sm text-red-500 text-right">
                      {errors.operatingSystem.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="osVersion" className="text-right">
                    نسخه سیستم عامل *
                  </Label>
                  <Controller
                    name="osVersion"
                    control={control}
                    rules={{ required: "نسخه سیستم عامل الزامی است." }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="مثال: 22H2, Big Sur"
                        className="text-right"
                        dir="rtl"
                      />
                    )}
                  />
                  {errors.osVersion && (
                    <p className="text-sm text-red-500 text-right">
                      {errors.osVersion.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="osIssueType" className="text-right">
                  نوع مشکل سیستم عامل *
                </Label>
                <Controller
                  name="osIssueType"
                  control={control}
                  rules={{ required: "انتخاب نوع مشکل الزامی است." }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      dir="rtl"
                    >
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="انتخاب مشکل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="boot-problem">
                          مشکل راه‌اندازی
                        </SelectItem>
                        <SelectItem value="slow-performance">
                          عملکرد کند
                        </SelectItem>
                        <SelectItem value="frequent-crashes">
                          خرابی مکرر
                        </SelectItem>
                        <SelectItem value="update-issues">
                          مشکل به‌روزرسانی
                        </SelectItem>
                        <SelectItem value="driver-problems">
                          مشکل درایور
                        </SelectItem>
                        <SelectItem value="blue-screen">
                          صفحه آبی مرگ
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.osIssueType && (
                  <p className="text-sm text-red-500 text-right">
                    {errors.osIssueType.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      }

      if (selectedSubIssue === "application-problems") {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-right flex items-center gap-2">
                <Settings className="w-4 h-4" />
                اطلاعات تکمیلی نرم‌افزار *
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="softwareName" className="text-right">
                    نام نرم‌افزار *
                  </Label>
                  <Controller
                    name="softwareName"
                    control={control}
                    rules={{ required: "نام نرم‌افزار الزامی است." }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="مثال: Microsoft Office"
                        className="text-right"
                        dir="rtl"
                      />
                    )}
                  />
                  {errors.softwareName && (
                    <p className="text-sm text-red-500 text-right">
                      {errors.softwareName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="softwareVersion" className="text-right">
                    نسخه نرم‌افزار *
                  </Label>
                  <Controller
                    name="softwareVersion"
                    control={control}
                    rules={{ required: "نسخه نرم‌افزار الزامی است." }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="مثال: 2021, v3.5"
                        className="text-right"
                        dir="rtl"
                      />
                    )}
                  />
                  {errors.softwareVersion && (
                    <p className="text-sm text-red-500 text-right">
                      {errors.softwareVersion.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="applicationIssue" className="text-right">
                  مشکل نرم‌افزار *
                </Label>
                <Controller
                  name="applicationIssue"
                  control={control}
                  rules={{ required: "انتخاب مشکل نرم‌افزار الزامی است." }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      dir="rtl"
                    >
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="انتخاب مشکل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wont-start">اجرا نمی‌شود</SelectItem>
                        <SelectItem value="crashes-frequently">
                          مکرراً خراب می‌شود
                        </SelectItem>
                        <SelectItem value="feature-not-working">
                          قابلیت خاص کار نمی‌کند
                        </SelectItem>
                        <SelectItem value="slow-performance">
                          عملکرد کند
                        </SelectItem>
                        <SelectItem value="error-messages">
                          پیام خطا می‌دهد
                        </SelectItem>
                        <SelectItem value="file-corruption">
                          فایل‌ها خراب می‌شوند
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.applicationIssue && (
                  <p className="text-sm text-red-500 text-right">
                    {errors.applicationIssue.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      }

      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-right flex items-center gap-2">
              <Settings className="w-4 h-4" />
              اطلاعات تکمیلی نرم‌افزار *
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="softwareName" className="text-right">
                نام نرم‌افزار *
              </Label>
              <Controller
                name="softwareName"
                control={control}
                rules={{ required: "نام نرم‌افزار الزامی است." }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="نام نرم‌افزار مورد نظر"
                    className="text-right"
                    dir="rtl"
                  />
                )}
              />
              {errors.softwareName && (
                <p className="text-sm text-red-500 text-right">
                  {errors.softwareName.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    if (selectedIssue === "network") {
      if (selectedSubIssue === "internet-connection") {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-right flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                اطلاعات تکمیلی اتصال اینترنت *
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="connectionType" className="text-right">
                    نوع اتصال *
                  </Label>
                  <Controller
                    name="connectionType"
                    control={control}
                    rules={{ required: "نوع اتصال الزامی است." }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        dir="rtl"
                      >
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="نوع اتصال" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ethernet">
                            اترنت (کابلی)
                          </SelectItem>
                          <SelectItem value="wifi">Wi-Fi (بی‌سیم)</SelectItem>
                          <SelectItem value="mobile">اینترنت موبایل</SelectItem>
                          <SelectItem value="adsl">ADSL</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.connectionType && (
                    <p className="text-sm text-red-500 text-right">
                      {errors.connectionType.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="internetProvider" className="text-right">
                    ارائه‌دهنده اینترنت *
                  </Label>
                  <Controller
                    name="internetProvider"
                    control={control}
                    rules={{ required: "ارائه‌دهنده اینترنت الزامی است." }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="مثال: ایرانسل، شاتل"
                        className="text-right"
                        dir="rtl"
                      />
                    )}
                  />
                  {errors.internetProvider && (
                    <p className="text-sm text-red-500 text-right">
                      {errors.internetProvider.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="connectionIssue" className="text-right">
                  مشکل اتصال *
                </Label>
                <Controller
                  name="connectionIssue"
                  control={control}
                  rules={{ required: "انتخاب مشکل اتصال الزامی است." }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      dir="rtl"
                    >
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="انتخاب مشکل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-connection">
                          اصلاً اتصال ندارم
                        </SelectItem>
                        <SelectItem value="intermittent">
                          گاهی قطع می‌شود
                        </SelectItem>
                        <SelectItem value="very-slow">خیلی کند است</SelectItem>
                        <SelectItem value="limited-access">
                          دسترسی محدود
                        </SelectItem>
                        <SelectItem value="specific-sites">
                          سایت‌های خاص باز نمی‌شود
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.connectionIssue && (
                  <p className="text-sm text-red-500 text-right">
                    {errors.connectionIssue.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      }

      // >>> Wi-Fi details: MANDATORY <<<
      if (selectedSubIssue === "wifi-problems") {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-right flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                اطلاعات تکمیلی Wi-Fi *
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SSID */}
                <div className="space-y-2">
                  <Label htmlFor="wifiNetwork" className="text-right">
                    نام شبکه Wi-Fi (SSID) *
                  </Label>
                  <Controller
                    name="wifiNetwork"
                    control={control}
                    rules={{ required: "نام شبکه الزامی است." }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="نام شبکه (SSID)"
                        className="text-right"
                        dir="rtl"
                      />
                    )}
                  />
                  {errors.wifiNetwork && (
                    <p className="text-sm text-red-500 text-right">
                      {errors.wifiNetwork.message}
                    </p>
                  )}
                </div>
                {/* Device type */}
                <div className="space-y-2">
                  <Label htmlFor="deviceType" className="text-right">
                    نوع دستگاه *
                  </Label>
                  <Controller
                    name="deviceType"
                    control={control}
                    rules={{ required: "انتخاب نوع دستگاه الزامی است." }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        dir="rtl"
                      >
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="نوع دستگاه" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="laptop">لپ‌تاپ</SelectItem>
                          <SelectItem value="desktop">رایانه رومیزی</SelectItem>
                          <SelectItem value="mobile">موبایل</SelectItem>
                          <SelectItem value="tablet">تبلت</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.deviceType && (
                    <p className="text-sm text-red-500 text-right">
                      {errors.deviceType.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Wi-Fi issue */}
              <div className="space-y-2">
                <Label htmlFor="wifiIssue" className="text-right">
                  مشکل Wi-Fi *
                </Label>
                <Controller
                  name="wifiIssue"
                  control={control}
                  rules={{ required: "انتخاب مشکل Wi-Fi الزامی است." }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      dir="rtl"
                    >
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="انتخاب مشکل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cant-see-network">
                          شبکه را نمی‌بینم
                        </SelectItem>
                        <SelectItem value="cant-connect">
                          نمی‌توانم وصل شوم
                        </SelectItem>
                        <SelectItem value="weak-signal">سیگنال ضعیف</SelectItem>
                        <SelectItem value="keeps-disconnecting">
                          مدام قطع می‌شود
                        </SelectItem>
                        <SelectItem value="wrong-password">
                          رمز عبور اشتباه است
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.wifiIssue && (
                  <p className="text-sm text-red-500 text-right">
                    {errors.wifiIssue.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      }

      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-right flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              اطلاعات تکمیلی شبکه *
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="networkLocation" className="text-right">
                محل شبکه *
              </Label>
              <Controller
                name="networkLocation"
                control={control}
                rules={{ required: "محل شبکه الزامی است." }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="مثال: طبقه دوم، اتاق 205"
                    className="text-right"
                    dir="rtl"
                  />
                )}
              />
              {errors.networkLocation && (
                <p className="text-sm text-red-500 text-right">
                  {errors.networkLocation.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    if (selectedIssue === "email") {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-right flex items-center gap-2">
              <Settings className="w-4 h-4" />
              اطلاعات تکمیلی ایمیل *
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emailProvider" className="text-right">
                  ارائه‌دهنده ایمیل *
                </Label>
                <Controller
                  name="emailProvider"
                  control={control}
                  rules={{ required: "ارائه‌دهنده ایمیل الزامی است." }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      dir="rtl"
                    >
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="ارائه‌دهنده ایمیل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gmail">Gmail</SelectItem>
                        <SelectItem value="outlook">Outlook</SelectItem>
                        <SelectItem value="yahoo">Yahoo</SelectItem>
                        <SelectItem value="company">ایمیل شرکت</SelectItem>
                        <SelectItem value="other">سایر</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.emailProvider && (
                  <p className="text-sm text-red-500 text-right">
                    {errors.emailProvider.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailClient" className="text-right">
                  نرم‌افزار ایمیل *
                </Label>
                <Controller
                  name="emailClient"
                  control={control}
                  rules={{ required: "انتخاب نرم‌افزار ایمیل الزامی است." }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      dir="rtl"
                    >
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="نرم‌افزار" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="outlook-app">Outlook</SelectItem>
                        <SelectItem value="thunderbird">Thunderbird</SelectItem>
                        <SelectItem value="web-browser">مرورگر وب</SelectItem>
                        <SelectItem value="mobile-app">اپ موبایل</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.emailClient && (
                  <p className="text-sm text-red-500 text-right">
                    {errors.emailClient.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="errorMessage" className="text-right">
                پیام خطا (در صورت وجود)
              </Label>
              <Controller
                name="errorMessage"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="متن کامل پیام خطا را اینجا بنویسید"
                    rows={2}
                    className="text-right"
                    dir="rtl"
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>
      );
    }

    if (selectedIssue === "security") {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-right flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-500" />
              اطلاعات تکمیلی امنیتی *
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="incidentTime" className="text-right">
                زمان تقریبی حادثه *
              </Label>
              <Controller
                name="incidentTime"
                control={control}
                rules={{ required: "انتخاب زمان حادثه الزامی است." }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    dir="rtl"
                  >
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="انتخاب زمان" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="just-now">همین الان</SelectItem>
                      <SelectItem value="today">امروز</SelectItem>
                      <SelectItem value="yesterday">دیروز</SelectItem>
                      <SelectItem value="this-week">این هفته</SelectItem>
                      <SelectItem value="not-sure">مطمئن نیستم</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.incidentTime && (
                <p className="text-sm text-red-500 text-right">
                  {errors.incidentTime.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="securitySeverity" className="text-right">
                شدت مشکل *
              </Label>
              <Controller
                name="securitySeverity"
                control={control}
                rules={{ required: "انتخاب شدت مشکل الزامی است." }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    dir="rtl"
                  >
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="انتخاب شدت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">کم - فقط مشکوک است</SelectItem>
                      <SelectItem value="medium">
                        متوسط - احتمال مشکل
                      </SelectItem>
                      <SelectItem value="high">بالا - مشکل جدی</SelectItem>
                      <SelectItem value="critical">بحرانی - فوری</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.securitySeverity && (
                <p className="text-sm text-red-500 text-right">
                  {errors.securitySeverity.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="affectedData" className="text-right">
                اطلاعات تحت تأثیر *
              </Label>
              <Controller
                name="affectedData"
                control={control}
                rules={{ required: "توضیح اطلاعات تحت تأثیر الزامی است." }}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="چه اطلاعاتی ممکن است تحت تأثیر قرار گرفته باشد؟"
                    rows={2}
                    className="text-right"
                    dir="rtl"
                  />
                )}
              />
              {errors.affectedData && (
                <p className="text-sm text-red-500 text-right">
                  {errors.affectedData.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    if (selectedIssue === "access") {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-right flex items-center gap-2">
              <Key className="w-4 h-4" />
              اطلاعات تکمیلی دسترسی *
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="requestedSystem" className="text-right">
                سیستم یا نرم‌افزار مورد نظر *
              </Label>
              <Controller
                name="requestedSystem"
                control={control}
                rules={{ required: "نام سیستم/نرم‌افزار الزامی است." }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="نام سیستم یا نرم‌افزار"
                    className="text-right"
                    dir="rtl"
                  />
                )}
              />
              {errors.requestedSystem && (
                <p className="text-sm text-red-500 text-right">
                  {errors.requestedSystem.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="accessLevel" className="text-right">
                سطح دسترسی مورد نیاز *
              </Label>
              <Controller
                name="accessLevel"
                control={control}
                rules={{ required: "انتخاب سطح دسترسی الزامی است." }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    dir="rtl"
                  >
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="انتخاب سطح" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="read-only">فقط خواندن</SelectItem>
                      <SelectItem value="read-write">خواندن و نوشتن</SelectItem>
                      <SelectItem value="admin">مدیریت</SelectItem>
                      <SelectItem value="full">دسترسی کامل</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.accessLevel && (
                <p className="text-sm text-red-500 text-right">
                  {errors.accessLevel.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="accessReason" className="text-right">
                دلیل درخواست *
              </Label>
              <Controller
                name="accessReason"
                control={control}
                rules={{ required: "نوشتن دلیل درخواست الزامی است." }}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="چرا به این دسترسی نیاز دارید؟"
                    rows={2}
                    className="text-right"
                    dir="rtl"
                  />
                )}
              />
              {errors.accessReason && (
                <p className="text-sm text-red-500 text-right">
                  {errors.accessReason.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    if (selectedIssue === "training") {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-right flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              اطلاعات تکمیلی آموزش *
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trainingTopic" className="text-right">
                موضوع آموزش *
              </Label>
              <Controller
                name="trainingTopic"
                control={control}
                rules={{ required: "موضوع آموزش الزامی است." }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="چه چیزی می‌خواهید یاد بگیرید؟"
                    className="text-right"
                    dir="rtl"
                  />
                )}
              />
              {errors.trainingTopic && (
                <p className="text-sm text-red-500 text-right">
                  {errors.trainingTopic.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentLevel" className="text-right">
                سطح فعلی شما *
              </Label>
              <Controller
                name="currentLevel"
                control={control}
                rules={{ required: "انتخاب سطح فعلی الزامی است." }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    dir="rtl"
                  >
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="انتخاب سطح" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">مبتدی</SelectItem>
                      <SelectItem value="intermediate">متوسط</SelectItem>
                      <SelectItem value="advanced">پیشرفته</SelectItem>
                      <SelectItem value="expert">حرفه‌ای</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.currentLevel && (
                <p className="text-sm text-red-500 text-right">
                  {errors.currentLevel.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredMethod" className="text-right">
                روش آموزش ترجیحی *
              </Label>
              <Controller
                name="preferredMethod"
                control={control}
                rules={{ required: "انتخاب روش آموزش الزامی است." }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    dir="rtl"
                  >
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="انتخاب روش" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-person">حضوری</SelectItem>
                      <SelectItem value="online">آنلاین</SelectItem>
                      <SelectItem value="documentation">مستندات</SelectItem>
                      <SelectItem value="video">ویدیو</SelectItem>
                      <SelectItem value="hands-on">عملی</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.preferredMethod && (
                <p className="text-sm text-red-500 text-right">
                  {errors.preferredMethod.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    return null;
  };
  // ----------------- end fallback cards -----------------

  return (
    <div className="space-y-6" dir="rtl">
      {/* Title + custom fields here */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <FileText className="w-5 h-5" />
            عنوان و شرح مشکل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title (required) */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-right">
              عنوان تیکت *
            </Label>
            <Controller
              name="title"
              control={control}
              rules={{ required: "عنوان تیکت الزامی است." }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="عنوان کوتاه و واضح از مشکل"
                  className="text-right"
                  dir="rtl"
                />
              )}
            />
            {errors.title && (
              <p className="text-sm text-red-500 text-right">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Custom fields (MANDATORY) */}
          {mandatoryDefs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mandatoryDefs.map((f) => (
                <DynamicFieldRenderer
                  key={f.id}
                  field={f}
                  control={control}
                  errors={errors}
                />
              ))}
            </div>
          )}

          {/* Description (optional) */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-right">
              شرح کامل مشکل (اختیاری)
            </Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="در صورت نیاز، توضیحات تکمیلی بیشتری برای مشکل وارد کنید (اختیاری)."
                  rows={4}
                  className="text-right"
                  dir="rtl"
                />
              )}
            />
            {errors.description && (
              <p className="text-sm text-red-500 text-right">
                {errors.description.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* If no custom fields: show fallback blocks */}
      {mandatoryDefs.length === 0 && <>{renderDynamicFields()}</>}

      {/* Guidance Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800 text-right">
            <p className="font-medium mb-1">راهنما برای ثبت بهتر مشکل:</p>
            <ul className="list-disc list-inside space-y-1 text-right">
              <li>
                قدم‌هایی که قبل از بروز مشکل انجام دادید را به ترتیب بنویسید.
              </li>
              <li>
                اگر پیام خطا دارید، متن کامل آن را دقیقاً کپی و پیوست کنید.
              </li>
              <li>
                زمان تقریبی شروع مشکل و اینکه آیا تکرارشونده است یا خیر را ذکر
                کنید.
              </li>
              <li>
                اگر تغییرات اخیر (آپدیت، نصب نرم‌افزار، تعویض قطعه) داشتید،
                حتماً بنویسید.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <Paperclip className="w-5 h-5" />
            پیوست فایل (اختیاری)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload onFilesChange={onFilesChange} maxFiles={5} />
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 text-right">
              <strong>توصیه:</strong> برای تسریع در حل مشکل، فایل‌های زیر را
              پیوست کنید:
            </p>
            <ul className="list-disc list-inside mt-2 text-sm text-green-700 text-right space-y-1">
              <li>تصاویر از صفحه خطا یا مشکل</li>
              <li>فایل‌های لاگ مربوطه</li>
              <li>اسکرین‌شات از تنظیمات</li>
              <li>مستندات مرتبط</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
