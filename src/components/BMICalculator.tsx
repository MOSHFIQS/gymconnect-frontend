"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Scale,
  Flame,
  Droplets,
  Target,
  RotateCcw,
  Activity,
  ArrowRight,
} from "lucide-react";

type HeightUnit = "cm" | "ft_in" | "meter";
type WeightUnit = "kg" | "lbs";
type Gender = "male" | "female";
type FitnessGoal = "cut" | "maintain" | "bulk";

const ACTIVITY_LEVELS = [
  { value: 1.2, label: "Sedentary", desc: "Little or no exercise, desk job" },
  { value: 1.375, label: "Light", desc: "1-3 days/week light exercise" },
  { value: 1.55, label: "Moderate", desc: "3-5 days/week moderate workout" },
  { value: 1.725, label: "Very Active", desc: "6-7 days/week intense training" },
  { value: 1.9, label: "Athlete", desc: "Twice per day, heavy lifting or sports" },
];

export default function BMICalculator() {
  // Input states
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState<number>(22);
  const [goal, setGoal] = useState<FitnessGoal>("maintain");
  const [activity, setActivity] = useState<number>(1.55);

  // Canonical metric values
  const [weightKg, setWeightKg] = useState<number>(65);
  const [heightCm, setHeightCm] = useState<number>(162);

  // Calculations for Height across cm, meter, feet and inches
  const heightM = heightCm / 100;
  const totalInches = heightCm / 2.54;
  const heightFeet = Math.floor(totalInches / 12);
  const heightInches = Math.round(totalInches % 12);

  const handleHeightFtInChange = (ft: number, inc: number) => {
    const totalIn = ft * 12 + inc;
    setHeightCm(Math.max(120, Math.min(230, Math.round(totalIn * 2.54))));
  };

  const handleHeightMeterChange = (m: number) => {
    setHeightCm(Math.max(120, Math.min(230, Math.round(m * 100))));
  };

  // Calculations for Weight across kg and lbs
  const weightLbs = Math.round(weightKg * 2.20462);

  // Calculations
  const stats = useMemo(() => {
    const hM = heightCm / 100;
    const bmi = weightKg / (hM * hM);

    // BMI Category
    let status = "Normal Weight";
    let color = "#22c55e"; // green
    let advice = "You have an optimal body weight. Focus on lean muscle development and cardiovascular stamina.";
    let percentOnScale = 50;

    if (bmi < 18.5) {
      status = "Underweight";
      color = "#38bdf8"; // sky blue
      advice = "Prioritize nutrient-dense whole foods and progressive strength training to build lean mass safely.";
      percentOnScale = Math.max(5, ((bmi - 14) / (18.5 - 14)) * 25);
    } else if (bmi < 25) {
      status = "Normal Weight";
      color = "#22c55e"; // emerald green
      advice = "Great balance! Keep maintaining consistent lifting workouts and balanced daily macronutrients.";
      percentOnScale = 25 + ((bmi - 18.5) / (25 - 18.5)) * 25;
    } else if (bmi < 30) {
      status = "Overweight";
      color = "#f59e0b"; // amber
      advice = "Aim for a moderate caloric deficit with 4-5 weekly gym resistance & HIIT cardio sessions.";
      percentOnScale = 50 + ((bmi - 25) / (30 - 25)) * 25;
    } else {
      status = "Obese";
      color = "#ef4444"; // red
      advice = "Consult with our certified GymConnect coaches for a structured low-impact cardio & strength roadmap.";
      percentOnScale = Math.min(95, 75 + ((bmi - 30) / (40 - 30)) * 25);
    }

    // Ideal healthy weight range (BMI 18.5 to 24.9)
    const minHealthyWeight = 18.5 * hM * hM;
    const maxHealthyWeight = 24.9 * hM * hM;

    // BMR (Mifflin-St Jeor)
    const bmr =
      gender === "male"
        ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

    // TDEE
    const tdee = bmr * activity;

    // Goal Caloric Adjustment
    let targetCalories = tdee;
    let proteinRatio = 2.0; // g per kg
    if (goal === "cut") {
      targetCalories = tdee - 500;
      proteinRatio = 2.2;
    } else if (goal === "bulk") {
      targetCalories = tdee + 350;
      proteinRatio = 2.0;
    }

    // Macros
    const proteinGrams = Math.round(weightKg * proteinRatio);
    const fatGrams = Math.round((targetCalories * 0.25) / 9);
    const carbsGrams = Math.max(30, Math.round((targetCalories - proteinGrams * 4 - fatGrams * 9) / 4));

    // Daily Water
    const waterLiters = +(weightKg * 0.035).toFixed(1);

    // Body Fat % (Deurenberg Formula)
    const genderFactor = gender === "male" ? 1 : 0;
    const estimatedBodyFat = Math.max(
      5,
      +(1.2 * bmi + 0.23 * age - 10.8 * genderFactor - 5.4).toFixed(1)
    );

    return {
      bmi: +bmi.toFixed(1),
      status,
      color,
      advice,
      percentOnScale,
      minHealthyWeight: Math.round(minHealthyWeight),
      maxHealthyWeight: Math.round(maxHealthyWeight),
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      proteinGrams,
      fatGrams,
      carbsGrams,
      waterLiters,
      estimatedBodyFat,
    };
  }, [weightKg, heightCm, age, gender, activity, goal]);

  const resetDefaults = () => {
    setWeightKg(65);
    setHeightCm(162);
    setAge(22);
    setGender("male");
    setGoal("maintain");
    setActivity(1.55);
    setHeightUnit("cm");
    setWeightUnit("kg");
  };

  return (
    <section id="bmi" className="py-20 sm:py-28 relative overflow-hidden bg-black/60">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[92%] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
            <Scale className="w-3.5 h-3.5" /> Professional Fitness Analytics
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 tracking-tight text-white">
            Smart BMI &amp; <span className="gradient-text">Health Calculator</span>
          </h2>
          <p className="text-secondary-text text-base sm:text-lg leading-relaxed">
            Calculate your exact BMI using your choice of units: <strong>Centimeter (cm)</strong>, <strong>Meter (m)</strong>, or <strong>Feet &amp; Inches (ft / in)</strong>. Instant metabolic and macro breakdown.
          </p>
        </div>

        {/* Main 2-Column Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-6 glass rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-2xl">
            {/* Top Toolbar: Reset */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                Input Metrics
              </span>

              {/* Reset button */}
              <button
                type="button"
                onClick={resetDefaults}
                className="flex items-center gap-1.5 text-xs text-white/50 hover:text-accent transition-colors cursor-pointer"
                title="Reset to default values"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-secondary-text block mb-2">
                Biological Gender
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  className={`py-2.5 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    gender === "male"
                      ? "bg-accent/20 border-accent text-white shadow-lg shadow-accent/20"
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                  }`}
                >
                  <span>Male</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  className={`py-2.5 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    gender === "female"
                      ? "bg-accent/20 border-accent text-white shadow-lg shadow-accent/20"
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                  }`}
                >
                  <span>Female</span>
                </button>
              </div>
            </div>

            {/* Fitness Goal */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-secondary-text block mb-2">
                Primary Fitness Goal
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "cut", label: "Fat Loss", sub: "-500 kcal" },
                  { id: "maintain", label: "Maintain", sub: "TDEE match" },
                  { id: "bulk", label: "Muscle Gain", sub: "+350 kcal" },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGoal(g.id as FitnessGoal)}
                    className={`py-2 px-1.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      goal === g.id
                        ? "bg-accent text-white border-accent shadow-md shadow-accent/30"
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-xs font-bold">{g.label}</div>
                    <div className="text-[10px] opacity-75">{g.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Age Slider */}
            <div className="space-y-2 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-white">Age</span>
                <span className="font-black text-accent text-base">
                  {age} <span className="text-xs text-white/50 font-normal">years</span>
                </span>
              </div>
              <input
                type="range"
                min={14}
                max={85}
                value={age}
                onChange={(e) => setAge(+e.target.value)}
                className="w-full accent-[#e6533c] cursor-pointer"
              />
            </div>

            {/* Height Control Section (Supports cm, meter, foot/inches) */}
            <div className="space-y-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">Height</span>

                  {/* Height Unit Switcher Tabs */}
                  <div className="flex items-center bg-black/60 p-0.5 rounded-lg border border-white/10 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setHeightUnit("cm")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        heightUnit === "cm"
                          ? "bg-accent text-white shadow-sm"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      cm
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeightUnit("ft_in")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        heightUnit === "ft_in"
                          ? "bg-accent text-white shadow-sm"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      ft / in
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeightUnit("meter")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        heightUnit === "meter"
                          ? "bg-accent text-white shadow-sm"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      meter
                    </button>
                  </div>
                </div>

                {/* Display Value */}
                <div className="text-left sm:text-right">
                  <div className="font-black text-accent text-lg leading-tight">
                    {heightUnit === "cm" && `${heightCm} cm`}
                    {heightUnit === "ft_in" && `${heightFeet} ft ${heightInches} in`}
                    {heightUnit === "meter" && `${heightM.toFixed(2)} m`}
                  </div>
                  {/* Simultaneous conversions */}
                  <div className="text-[11px] text-secondary-text font-medium">
                    {heightUnit === "cm" && `≈ ${heightFeet} ft ${heightInches} in • ${heightM.toFixed(2)} m`}
                    {heightUnit === "ft_in" && `≈ ${heightCm} cm • ${heightM.toFixed(2)} m`}
                    {heightUnit === "meter" && `≈ ${heightCm} cm • ${heightFeet} ft ${heightInches} in`}
                  </div>
                </div>
              </div>

              {/* Slider for Centimeter */}
              {heightUnit === "cm" && (
                <div className="space-y-1">
                  <input
                    type="range"
                    min={120}
                    max={225}
                    value={heightCm}
                    onChange={(e) => setHeightCm(+e.target.value)}
                    className="w-full accent-[#e6533c] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-white/40">
                    <span>120 cm (3&apos;11&quot;)</span>
                    <span>175 cm (5&apos;9&quot;)</span>
                    <span>225 cm (7&apos;5&quot;)</span>
                  </div>
                </div>
              )}

              {/* Slider for Meter */}
              {heightUnit === "meter" && (
                <div className="space-y-1">
                  <input
                    type="range"
                    min={1.2}
                    max={2.25}
                    step={0.01}
                    value={+heightM.toFixed(2)}
                    onChange={(e) => handleHeightMeterChange(+e.target.value)}
                    className="w-full accent-[#e6533c] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-white/40">
                    <span>1.20 m</span>
                    <span>1.75 m</span>
                    <span>2.25 m</span>
                  </div>
                </div>
              )}

              {/* Sliders for Feet & Inches */}
              {heightUnit === "ft_in" && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {/* Feet */}
                  <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-white/70">Feet</span>
                      <span className="text-accent font-bold">{heightFeet} ft</span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={7}
                      value={heightFeet}
                      onChange={(e) => handleHeightFtInChange(+e.target.value, heightInches)}
                      className="w-full accent-[#e6533c] cursor-pointer"
                    />
                  </div>

                  {/* Inches */}
                  <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-white/70">Inches</span>
                      <span className="text-accent font-bold">{heightInches} in</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={11}
                      value={heightInches}
                      onChange={(e) => handleHeightFtInChange(heightFeet, +e.target.value)}
                      className="w-full accent-[#e6533c] cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Weight Control Section (Supports kg and lbs) */}
            <div className="space-y-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">Current Weight</span>

                  {/* Weight Unit Switcher Tabs */}
                  <div className="flex items-center bg-black/60 p-0.5 rounded-lg border border-white/10 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setWeightUnit("kg")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        weightUnit === "kg"
                          ? "bg-accent text-white shadow-sm"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      kg
                    </button>
                    <button
                      type="button"
                      onClick={() => setWeightUnit("lbs")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        weightUnit === "lbs"
                          ? "bg-accent text-white shadow-sm"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      lbs
                    </button>
                  </div>
                </div>

                {/* Display Value */}
                <div className="text-left sm:text-right">
                  <div className="font-black text-accent text-lg leading-tight">
                    {weightUnit === "kg" ? `${weightKg} kg` : `${weightLbs} lbs`}
                  </div>
                  <div className="text-[11px] text-secondary-text font-medium">
                    {weightUnit === "kg" ? `≈ ${weightLbs} lbs` : `≈ ${weightKg} kg`}
                  </div>
                </div>
              </div>

              {/* Slider for Weight */}
              <div className="space-y-1">
                {weightUnit === "kg" ? (
                  <input
                    type="range"
                    min={30}
                    max={180}
                    value={weightKg}
                    onChange={(e) => setWeightKg(+e.target.value)}
                    className="w-full accent-[#e6533c] cursor-pointer"
                  />
                ) : (
                  <input
                    type="range"
                    min={66}
                    max={396}
                    value={weightLbs}
                    onChange={(e) => setWeightKg(Math.round(+e.target.value / 2.20462))}
                    className="w-full accent-[#e6533c] cursor-pointer"
                  />
                )}
                <div className="flex justify-between text-[10px] text-white/40">
                  <span>{weightUnit === "kg" ? "30 kg" : "66 lbs"}</span>
                  <span>{weightUnit === "kg" ? "70 kg" : "154 lbs"}</span>
                  <span>{weightUnit === "kg" ? "180 kg" : "396 lbs"}</span>
                </div>
              </div>
            </div>

            {/* Physical Activity Level Selection */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-secondary-text block mb-2">
                Physical Activity Level
              </label>
              <div className="space-y-2">
                {ACTIVITY_LEVELS.map((act) => (
                  <button
                    key={act.value}
                    type="button"
                    onClick={() => setActivity(act.value)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      activity === act.value
                        ? "bg-accent/15 border-accent text-white"
                        : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white">{act.label}</div>
                      <div className="text-[11px] text-secondary-text">{act.desc}</div>
                    </div>
                    {activity === act.value && (
                      <span className="w-2.5 h-2.5 rounded-full bg-accent shadow-md shadow-accent/50" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Results & Analytics */}
          <div className="lg:col-span-6 space-y-6">
            {/* Primary BMI Score Card */}
            <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ backgroundColor: stats.color }}
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-secondary-text block mb-1">
                    Your Calculated BMI
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span
                      className="text-6xl sm:text-7xl font-black tracking-tight"
                      style={{ color: stats.color }}
                    >
                      {stats.bmi}
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${stats.color}25`,
                        color: stats.color,
                        border: `1px solid ${stats.color}50`,
                      }}
                    >
                      {stats.status}
                    </span>
                  </div>
                </div>

                {/* Body Fat Estimation */}
                <div className="text-center sm:text-right bg-white/5 border border-white/10 rounded-2xl p-3.5 sm:px-5">
                  <span className="text-[11px] font-bold uppercase text-secondary-text block">
                    Est. Body Fat
                  </span>
                  <span className="text-2xl font-black text-white">
                    ~{stats.estimatedBodyFat}%
                  </span>
                </div>
              </div>

              {/* Visual Multi-Color BMI Spectrum Bar */}
              <div className="space-y-2 mb-6">
                <div className="relative h-3 rounded-full overflow-hidden bg-white/10 flex">
                  <div className="w-1/4 bg-sky-400" title="Underweight (<18.5)" />
                  <div className="w-1/4 bg-emerald-500" title="Normal (18.5 - 24.9)" />
                  <div className="w-1/4 bg-amber-400" title="Overweight (25 - 29.9)" />
                  <div className="w-1/4 bg-rose-500" title="Obese (30+)" />
                </div>

                {/* Marker pointer */}
                <div className="relative h-4">
                  <div
                    className="absolute -top-1 -translate-x-1/2 flex flex-col items-center transition-all duration-500"
                    style={{ left: `${stats.percentOnScale}%` }}
                  >
                    <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-white" />
                    <span className="text-[10px] font-bold text-white bg-white/20 px-1.5 py-0.2 rounded mt-0.5">
                      You: {stats.bmi}
                    </span>
                  </div>
                </div>

                {/* Spectrum Labels */}
                <div className="flex justify-between text-[10px] text-secondary-text pt-1">
                  <span>Under (&lt;18.5)</span>
                  <span>Normal (18.5-24.9)</span>
                  <span>Over (25-29.9)</span>
                  <span>Obese (30+)</span>
                </div>
              </div>

              {/* Advice Box */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white/80 leading-relaxed mb-4">
                <p>{stats.advice}</p>
              </div>

              {/* Healthy Weight Benchmark */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-secondary-text pt-3 border-t border-white/10">
                <span>Healthy weight for your height ({heightCm} cm / {heightFeet}&apos;{heightInches}&quot;):</span>
                <span className="font-bold text-white">
                  {stats.minHealthyWeight} kg – {stats.maxHealthyWeight} kg{" "}
                  <span className="text-secondary-text font-normal">
                    ({Math.round(stats.minHealthyWeight * 2.20462)} – {Math.round(stats.maxHealthyWeight * 2.20462)} lbs)
                  </span>
                </span>
              </div>
            </div>

            {/* Metabolic Calorie & Water Targets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="glass rounded-2xl p-4 border border-white/10 text-center">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-2">
                  <Flame className="w-4 h-4" />
                </div>
                <div className="text-xl font-black text-white">{stats.targetCalories}</div>
                <div className="text-[11px] text-secondary-text font-medium">Daily Target (kcal)</div>
              </div>

              <div className="glass rounded-2xl p-4 border border-white/10 text-center">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="text-xl font-black text-white">{stats.tdee}</div>
                <div className="text-[11px] text-secondary-text font-medium">Maintenance (TDEE)</div>
              </div>

              <div className="glass rounded-2xl p-4 border border-white/10 text-center col-span-2 sm:col-span-1">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-2">
                  <Droplets className="w-4 h-4" />
                </div>
                <div className="text-xl font-black text-white">{stats.waterLiters} L</div>
                <div className="text-[11px] text-secondary-text font-medium">Water Target/Day</div>
              </div>
            </div>

            {/* Daily Macronutrients Breakdown Card */}
            <div className="glass rounded-3xl p-6 sm:p-7 border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-accent" />
                  Target Macronutrient Split
                </h4>
                <span className="text-xs text-accent font-bold uppercase">
                  {goal.toUpperCase()} PLAN
                </span>
              </div>

              {/* Macro Bars */}
              <div className="space-y-3.5">
                {/* Protein */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-white">Protein (Muscle Synthesis)</span>
                    <span className="text-accent">{stats.proteinGrams}g ({stats.proteinGrams * 4} kcal)</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (stats.proteinGrams / 200) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Carbs */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-white">Carbohydrates (Energy &amp; Strength)</span>
                    <span className="text-sky-400">{stats.carbsGrams}g ({stats.carbsGrams * 4} kcal)</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-sky-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (stats.carbsGrams / 350) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Fats */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-white">Healthy Fats (Hormone Health)</span>
                    <span className="text-amber-400">{stats.fatGrams}g ({stats.fatGrams * 9} kcal)</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (stats.fatGrams / 100) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* GymConnect Recommendation CTA */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-secondary-text">
                  Want our certified trainers to coach you on this plan?
                </span>
                <Link
                  href="#pricing"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-hover transition-colors shrink-0"
                >
                  <span>Choose a Membership</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
