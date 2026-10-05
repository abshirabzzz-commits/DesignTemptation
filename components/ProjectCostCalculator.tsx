"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  PRICING_CONFIG,
  calculateProjectCost,
  formatINR,
  CalculatorInputs,
  ProjectTypeId,
  PropertyTypeId,
  DesignLevelId,
  OptionalServiceId,
} from "@/data/pricing";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  Info,
  FileQuestion,
  AlertCircle,
} from "lucide-react";

export function ProjectCostCalculator() {
  const [projectType, setProjectType] = useState<ProjectTypeId>(
    PRICING_CONFIG.defaultInputs.projectType
  );
  const [propertyType, setPropertyType] = useState<PropertyTypeId>(
    PRICING_CONFIG.defaultInputs.propertyType
  );
  const [areaInput, setAreaInput] = useState<string>(
    PRICING_CONFIG.defaultInputs.areaSqFt.toString()
  );
  const [designLevel, setDesignLevel] = useState<DesignLevelId>(
    PRICING_CONFIG.defaultInputs.designLevel
  );
  const [selectedServices, setSelectedServices] = useState<OptionalServiceId[]>(
    PRICING_CONFIG.defaultInputs.optionalServices
  );

  // Safe numerical area parser (only allow positive numbers, reject negative values)
  const parsedArea = useMemo(() => {
    const sanitized = areaInput.trim();
    if (!sanitized) return 0;
    const val = parseInt(sanitized.replace(/[^0-9]/g, ""), 10);
    if (isNaN(val) || val <= 0) return 0;
    return val;
  }, [areaInput]);

  const isAreaInvalid = areaInput.trim() !== "" && parsedArea <= 0;
  const isAreaEmpty = areaInput.trim() === "";

  // Dynamic Calculation based on inputs
  const calculation = useMemo(() => {
    const inputs: CalculatorInputs = {
      projectType,
      propertyType,
      areaSqFt: parsedArea,
      designLevel,
      optionalServices: selectedServices,
    };
    return calculateProjectCost(inputs);
  }, [projectType, propertyType, parsedArea, designLevel, selectedServices]);

  // Toggle optional service
  const handleToggleService = (serviceId: OptionalServiceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Reset to default configuration
  const handleReset = () => {
    setProjectType(PRICING_CONFIG.defaultInputs.projectType);
    setPropertyType(PRICING_CONFIG.defaultInputs.propertyType);
    setAreaInput(PRICING_CONFIG.defaultInputs.areaSqFt.toString());
    setDesignLevel(PRICING_CONFIG.defaultInputs.designLevel);
    setSelectedServices(PRICING_CONFIG.defaultInputs.optionalServices);
  };

  // Selected object lookups
  const activeProjectType = PRICING_CONFIG.projectTypes.find((p) => p.id === projectType);
  const activePropertyType = PRICING_CONFIG.propertyTypes.find((p) => p.id === propertyType);
  const activeDesignLevel = PRICING_CONFIG.designLevels.find((d) => d.id === designLevel);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* ============================================================ */}
        {/* LEFT COLUMN: INTERACTIVE INPUT PARAMETERS (Col span 7)       */}
        {/* ============================================================ */}
        <div className="lg:col-span-7 space-y-9">
          {/* Header controls & reset */}
          <div className="flex items-center justify-between pb-3 border-b border-[#ECE7DF]">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8C877E] font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Project Parameters</span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-[#8C877E] hover:text-[#171615] transition-colors focus:outline-none cursor-pointer"
              title="Reset parameters to defaults"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* 1. PROJECT TYPE (Dropdown) */}
          <section className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label
                htmlFor="project-type-select"
                className="text-xs uppercase tracking-[0.16em] font-semibold text-[#171615]"
              >
                1. Project Type
              </label>
              <span className="text-[11px] text-[#8C877E] uppercase tracking-wider">
                Select Scope
              </span>
            </div>

            <div className="relative">
              <select
                id="project-type-select"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value as ProjectTypeId)}
                className="w-full bg-white border border-[#ECE7DF] px-4 py-3.5 pr-10 text-sm font-medium text-[#171615] appearance-none focus:outline-none focus:border-[#171615] transition-colors cursor-pointer"
              >
                {PRICING_CONFIG.projectTypes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C877E] pointer-events-none" />
            </div>

            {/* Contextual Description */}
            {activeProjectType && (
              <div className="p-3 bg-[#F4F1EA] border border-[#ECE7DF] text-xs space-y-1">
                <span className="font-medium text-[#171615] block">
                  {activeProjectType.tagline}
                </span>
                <p className="text-[#5A5752] leading-relaxed">
                  {activeProjectType.description}
                </p>
              </div>
            )}
          </section>

          {/* 2. PROPERTY TYPE (Dropdown) */}
          <section className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label
                htmlFor="property-type-select"
                className="text-xs uppercase tracking-[0.16em] font-semibold text-[#171615]"
              >
                2. Property Type
              </label>
              <span className="text-[11px] text-[#8C877E] uppercase tracking-wider">
                Spatial Typology
              </span>
            </div>

            <div className="relative">
              <select
                id="property-type-select"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyTypeId)}
                className="w-full bg-white border border-[#ECE7DF] px-4 py-3.5 pr-10 text-sm font-medium text-[#171615] appearance-none focus:outline-none focus:border-[#171615] transition-colors cursor-pointer"
              >
                {PRICING_CONFIG.propertyTypes.map((prop) => (
                  <option key={prop.id} value={prop.id}>
                    {prop.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C877E] pointer-events-none" />
            </div>

            {/* Contextual description */}
            {activePropertyType && (
              <p className="text-xs text-[#8C877E]">
                {activePropertyType.description}
              </p>
            )}
          </section>

          {/* 3. PROJECT AREA (Number Input) */}
          <section className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label
                htmlFor="project-area-input"
                className="text-xs uppercase tracking-[0.16em] font-semibold text-[#171615]"
              >
                3. Project Area (sq.ft)
              </label>
              <span className="text-xs text-[#8C877E] font-normal">
                Unit: <span className="text-[#171615] font-medium">sq.ft</span>
              </span>
            </div>

            {/* Direct Number Input */}
            <div
              className={`relative bg-white border transition-colors p-3 ${
                isAreaInvalid || isAreaEmpty
                  ? "border-[#D97706] focus-within:border-[#D97706]"
                  : "border-[#ECE7DF] focus-within:border-[#171615]"
              }`}
            >
              <div className="flex items-center justify-between">
                <input
                  id="project-area-input"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={PRICING_CONFIG.limits.maxArea}
                  step={50}
                  value={areaInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Do not allow negative values
                    if (val.startsWith("-")) return;
                    setAreaInput(val);
                  }}
                  className="w-full font-serif text-2xl sm:text-3xl text-[#171615] bg-transparent focus:outline-none pl-1"
                  placeholder="e.g. 1500"
                  aria-label="Project Area in square feet"
                />
                <span className="text-sm font-sans tracking-wider uppercase text-[#8C877E] pr-2 shrink-0">
                  sq.ft
                </span>
              </div>

              {/* Slider for smooth visual scrubbing */}
              <div className="mt-3 px-1 pt-2 border-t border-[#ECE7DF]/60">
                <input
                  type="range"
                  min={200}
                  max={8000}
                  step={50}
                  value={Math.min(Math.max(parsedArea, 200), 8000)}
                  onChange={(e) => setAreaInput(e.target.value)}
                  className="w-full accent-[#171615] cursor-pointer"
                  aria-label="Slide to adjust area"
                />
                <div className="flex justify-between text-[10px] text-[#8C877E] mt-1">
                  <span>200 sq.ft</span>
                  <span>4,000 sq.ft</span>
                  <span>8,000+ sq.ft</span>
                </div>
              </div>
            </div>

            {/* Area Validation Notice */}
            {(isAreaInvalid || isAreaEmpty) && (
              <div className="flex items-center gap-2 text-xs text-[#B45309] pt-0.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Please enter a valid project area (greater than 0 sq.ft) to generate an estimate.</span>
              </div>
            )}

            {/* Area Preset Quick Chips */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] uppercase tracking-wider text-[#8C877E]">
                Quick Area Presets:
              </p>
              <div className="flex flex-wrap gap-2">
                {PRICING_CONFIG.limits.defaultPresets.map((preset) => {
                  const isCurrent = parsedArea === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAreaInput(preset.toString())}
                      className={`text-xs px-3 py-1.5 border transition-colors cursor-pointer ${
                        isCurrent
                          ? "bg-[#171615] text-[#FAF8F5] border-[#171615]"
                          : "bg-white text-[#5A5752] border-[#ECE7DF] hover:border-[#8C877E] hover:text-[#171615]"
                      }`}
                    >
                      {preset.toLocaleString("en-IN")} sq.ft
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 4. DESIGN LEVEL (Options) */}
          <section className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-xs uppercase tracking-[0.16em] font-semibold text-[#171615]">
                4. Design Level
              </label>
              <span className="text-[11px] text-[#8C877E] uppercase tracking-wider">
                Specification Standard
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PRICING_CONFIG.designLevels.map((lvl) => {
                const isSelected = designLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setDesignLevel(lvl.id)}
                    aria-pressed={isSelected}
                    className={`text-left p-4 border transition-all duration-200 relative group cursor-pointer ${
                      isSelected
                        ? "bg-[#171615] text-[#FAF8F5] border-[#171615] shadow-sm"
                        : "bg-white text-[#171615] border-[#ECE7DF] hover:border-[#8C877E]/60 hover:bg-[#FAF8F5]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4
                        className={`font-serif text-lg ${
                          isSelected ? "text-[#FAF8F5]" : "text-[#171615]"
                        }`}
                      >
                        {lvl.label}
                      </h4>
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "border-[#FAF8F5] bg-[#FAF8F5] text-[#171615]"
                            : "border-[#DFD9CF] group-hover:border-[#8C877E]"
                        }`}
                      >
                        {isSelected && <Check className="w-2 h-2 stroke-[3]" />}
                      </div>
                    </div>
                    <p
                      className={`text-[11px] font-medium mt-1 leading-snug ${
                        isSelected ? "text-[#DFD9CF]" : "text-[#8C877E]"
                      }`}
                    >
                      {lvl.tagline}
                    </p>
                    <p
                      className={`text-xs mt-2.5 leading-relaxed line-clamp-3 ${
                        isSelected ? "text-[#DFD9CF]/80" : "text-[#5A5752]"
                      }`}
                    >
                      {lvl.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 5. OPTIONAL SERVICES (Checkboxes / Toggles) */}
          <section className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-xs uppercase tracking-[0.16em] font-semibold text-[#171615]">
                5. Optional Services
              </label>
              <span className="text-[11px] text-[#8C877E] uppercase tracking-wider">
                Atelier Add-Ons
              </span>
            </div>

            <div className="space-y-3">
              {PRICING_CONFIG.optionalServices.map((service) => {
                const isChecked = selectedServices.includes(service.id);
                return (
                  <div
                    key={service.id}
                    onClick={() => handleToggleService(service.id)}
                    role="checkbox"
                    aria-checked={isChecked}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter") {
                        e.preventDefault();
                        handleToggleService(service.id);
                      }
                    }}
                    className={`p-4 border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isChecked
                        ? "bg-[#171615] text-[#FAF8F5] border-[#171615]"
                        : "bg-white text-[#171615] border-[#ECE7DF] hover:border-[#8C877E]/60 hover:bg-[#FAF8F5]"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-4 h-4 border mt-0.5 shrink-0 flex items-center justify-center transition-colors ${
                          isChecked
                            ? "bg-[#FAF8F5] border-[#FAF8F5] text-[#171615]"
                            : "border-[#8C877E]/60 bg-transparent"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[2.5]" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4
                            className={`font-serif text-base font-normal ${
                              isChecked ? "text-[#FAF8F5]" : "text-[#171615]"
                            }`}
                          >
                            {service.label}
                          </h4>
                          <span
                            className={`text-[10px] uppercase tracking-wider px-2 py-0.5 border ${
                              isChecked
                                ? "border-[#DFD9CF]/30 text-[#DFD9CF]"
                                : "border-[#ECE7DF] text-[#8C877E] bg-[#FAF8F5]"
                            }`}
                          >
                            {service.displayRateNote}
                          </span>
                        </div>
                        <p
                          className={`text-xs mt-1 leading-relaxed ${
                            isChecked ? "text-[#DFD9CF]/80" : "text-[#5A5752]"
                          }`}
                        >
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: REAL-TIME RESULT & INVESTMENT BREAKDOWN        */}
        {/* ============================================================ */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="bg-[#171615] text-[#FAF8F5] p-6 sm:p-8 lg:p-9 border border-[#171615] shadow-sm relative overflow-hidden">
            {/* Subtle architectural background texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#FAF8F5_1px,transparent_1px)] [background-size:20px_20px]" />

            <div className="relative z-10 space-y-6">
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-[#DFD9CF]/15 pb-4">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#DFD9CF]/70 font-medium">
                  Project Investment
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] tracking-wider uppercase text-[#DFD9CF]/90">
                  <Sparkles className="w-3 h-3 text-[#DFD9CF]" />
                  <span>Real-Time Model</span>
                </span>
              </div>

              {/* CASE 1: "OTHER" PROJECT TYPE -> CUSTOM ESTIMATE STATE */}
              {calculation.isCustomEstimate ? (
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#FAF8F5]/10 border border-[#DFD9CF]/20 text-[#DFD9CF] text-[11px] tracking-widest uppercase">
                    <FileQuestion className="w-3 h-3" />
                    <span>Bespoke Scope</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-3xl sm:text-4xl text-[#FAF8F5] font-light tracking-tight">
                      Custom Estimate
                    </h3>
                    <p className="text-sm text-[#DFD9CF]/80 font-light leading-relaxed">
                      Pricing depends on your project requirements and scope. Submit your project
                      details to receive a personalized quotation.
                    </p>
                  </div>

                  <div className="p-4 bg-[#FAF8F5]/[0.04] border border-[#DFD9CF]/15 text-xs text-[#DFD9CF]/75 space-y-2">
                    <p className="font-medium text-[#FAF8F5]">Why a custom quotation?</p>
                    <p className="leading-relaxed font-light">
                      Non-standard typologies (hospitality, cultural institutions, bespoke
                      pavilions, and unique multi-use spaces) involve customized structural and
                      finish parameters that require an individualized atelier appraisal.
                    </p>
                  </div>

                  {/* Clear CTA for Custom Estimate */}
                  <div className="pt-2">
                    <Link
                      href="/contact"
                      className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-[#FAF8F5] text-[#171615] text-xs font-semibold uppercase tracking-[0.16em] hover:bg-white active:bg-[#DFD9CF] transition-colors group"
                    >
                      <span>START A PROJECT</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ) : !calculation.isValid ? (
                /* CASE 2: INVALID / PENDING INPUT STATE */
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-2 text-[#D97706]">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Area Required</span>
                  </div>
                  <p className="text-xs text-[#DFD9CF]/80 leading-relaxed font-light">
                    {calculation.validationError ||
                      "Please enter a valid project area (greater than 0 sq.ft) to calculate an estimate."}
                  </p>
                  <div className="p-3 bg-[#FAF8F5]/[0.03] border border-[#DFD9CF]/10 text-xs text-[#DFD9CF]/60">
                    Enter your space dimensions in square feet above to view the estimated investment and range.
                  </div>
                </div>
              ) : (
                /* CASE 3: STANDARD CALCULATED ESTIMATE */
                <div className="space-y-6">
                  {/* Primary Prominent Cost Display */}
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#DFD9CF]/70">
                      Estimated Project Cost
                    </p>
                    <div
                      className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#FAF8F5] tracking-tight py-1"
                      aria-live="polite"
                    >
                      {formatINR(calculation.totalCost)}
                    </div>
                  </div>

                  {/* Prominent Estimated Range Display */}
                  <div className="space-y-1 pt-3 border-t border-[#DFD9CF]/15">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#DFD9CF]/60">
                      Estimated Range
                    </p>
                    <div className="font-serif text-lg sm:text-xl text-[#DFD9CF] tracking-wide">
                      {formatINR(calculation.rangeMin)} – {formatINR(calculation.rangeMax)}
                    </div>
                  </div>

                  {/* Detailed Transparent Calculation Breakdown */}
                  <div className="space-y-3 pt-5 border-t border-[#DFD9CF]/15 text-xs text-[#DFD9CF]/85">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#8C877E] font-medium">
                      Calculation Summary
                    </p>

                    {/* Base rate breakdown */}
                    <div className="space-y-1.5 bg-[#FAF8F5]/[0.03] p-3 border border-[#DFD9CF]/10">
                      <div className="flex items-center justify-between">
                        <span className="text-[#DFD9CF]/80">Effective Base Rate:</span>
                        <span className="font-medium text-[#FAF8F5]">
                          {formatINR(calculation.ratePerSqFt)} / sq.ft
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#DFD9CF]/60">
                        <span>
                          {calculation.areaSqFt.toLocaleString("en-IN")} sq.ft × {formatINR(calculation.ratePerSqFt)}
                        </span>
                        <span className="font-medium text-[#FAF8F5]">
                          {formatINR(calculation.baseCost)}
                        </span>
                      </div>
                    </div>

                    {/* Add-on services breakdown */}
                    {calculation.servicesBreakdown.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px] text-[#8C877E] uppercase">
                          <span>Optional Services Selected:</span>
                          <span>{formatINR(calculation.servicesTotal)}</span>
                        </div>
                        {calculation.servicesBreakdown.map((srv) => (
                          <div
                            key={srv.id}
                            className="flex items-center justify-between text-[11px] text-[#DFD9CF]/75 pl-2 border-l border-[#DFD9CF]/20"
                          >
                            <span>{srv.label}</span>
                            <span>{formatINR(srv.cost)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Selected parameters snapshot */}
                    <div className="pt-2 text-[11px] text-[#DFD9CF]/60 flex flex-wrap gap-x-2 gap-y-1">
                      <span>{activeProjectType?.label}</span>
                      <span>•</span>
                      <span>{activePropertyType?.label}</span>
                      <span>•</span>
                      <span>{activeDesignLevel?.label} Level</span>
                    </div>
                  </div>

                  {/* REQUIRED DISCLAIMER */}
                  <div className="pt-4 border-t border-[#DFD9CF]/15 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-[#8C877E] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#DFD9CF]/70 font-light leading-relaxed">
                      Estimate only. Final pricing may vary based on project scope, materials,
                      specifications and execution requirements.
                    </p>
                  </div>

                  {/* REQUIRED CTA: Start a Project */}
                  <div className="pt-2">
                    <Link
                      href="/contact"
                      className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-[#FAF8F5] text-[#171615] text-xs font-semibold uppercase tracking-[0.16em] hover:bg-white active:bg-[#DFD9CF] transition-colors group"
                    >
                      <span>START A PROJECT</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Direct Consultation Assistance Card */}
          <div className="bg-white p-5 sm:p-6 border border-[#ECE7DF] space-y-2">
            <h5 className="font-serif text-base text-[#171615]">Need a detailed architectural audit?</h5>
            <p className="text-xs text-[#5A5752] leading-relaxed">
              For complex multi-acre master plans, bespoke heritage restorations, or multi-unit commercial developments, our partners provide custom structural feasibility studies.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="text-xs uppercase tracking-wider text-[#171615] font-semibold editorial-link"
              >
                Schedule Private Consultation →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
