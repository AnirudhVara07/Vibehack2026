import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";

export const Route = createFileRoute("/join")({
  component: JoinComponent,
});

// Adjectives & Animals for Anonymous Kahoot-style name generation
const ADJECTIVES = [
  "Gentle",
  "Serene",
  "Quiet",
  "Wise",
  "Calm",
  "Thoughtful",
  "Peaceful",
  "Brave",
  "Kind",
  "Warm",
  "Cozy",
  "Soft",
  "Bright",
  "Patient",
  "Clever",
  "Loyal",
  "Cheerful",
  "Playful",
  "Caring",
  "Zen",
  "Friendly",
  "Compassionate",
  "Creative",
  "Curious",
];

const ANIMALS = [
  "Panda",
  "Koala",
  "Otter",
  "Owl",
  "Badger",
  "Fox",
  "Deer",
  "Rabbit",
  "Squirrel",
  "Robin",
  "Hedgehog",
  "Turtle",
  "Dolphin",
  "Seal",
  "Penguin",
  "Bear",
  "Elephant",
  "Swan",
  "Lynx",
  "Falcon",
  "Koala",
  "Dove",
  "Dove",
  "Fawn",
];

const UK_UNIVERSITIES = [
  "University College London (UCL)",
  "University of Manchester",
  "University of Edinburgh",
  "King's College London",
  "Imperial College London",
  "University of Oxford",
  "University of Cambridge",
  "University of Bristol",
  "University of Warwick",
  "University of Leeds",
  "University of Glasgow",
  "University of Sheffield",
  "University of Birmingham",
  "University of Nottingham",
  "Southampton University",
  "Newcastle University",
  "Queen Mary University of London",
  "Loughborough University",
  "University of York",
  "University of Bath",
  "Cardiff University",
  "Durham University",
  "University of Exeter",
  "University of Liverpool",
  "London School of Economics (LSE)",
];

function generateRandomName() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const anim = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num = Math.floor(10 + Math.random() * 90); // add 2-digit number for extra uniqueness
  return `${adj}${anim}${num}`;
}

function generateUUID() {
  try {
    return window.crypto.randomUUID();
  } catch (e) {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
      (
        +c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
      ).toString(16),
    );
  }
}

interface OnboardingData {
  mindset: string;
  university: string;
  course: string;
  yearOfStudy: string;
  age: string;
  area: string;
  livingSituation: string;
  displayName: string;
  timeSlot: string;
  customSchedule: string[];
}

function JoinComponent() {
  const navigate = useNavigate();
  // Start onboarding directly at step 2 (Demographics)
  const [step, setStep] = useState(2);
  const [animating, setAnimating] = useState(false);
  const [spinKey, setSpinKey] = useState(0);

  const [formData, setFormData] = useState<OnboardingData>({
    mindset: "",
    university: "",
    course: "",
    yearOfStudy: "",
    age: "",
    area: "",
    livingSituation: "",
    displayName: "",
    timeSlot: "",
    customSchedule: [],
  });

  // University query search state
  const [uniQuery, setUniQuery] = useState("");
  const [showUniDropdown, setShowUniDropdown] = useState(false);

  // Generate initial display name
  useEffect(() => {
    if (!formData.displayName) {
      setFormData((prev) => ({ ...prev, displayName: generateRandomName() }));
    }
  }, []);

  // Handle transition helper
  const goToStep = (targetStep: number) => {
    setAnimating(true);
    setTimeout(() => {
      setStep(targetStep);
      setAnimating(false);
    }, 250);
  };

  // Step 4: Time slot options
  const timeSlots = [
    {
      id: "evening",
      label: "Evening (7–9pm)",
      emoji: "🌅",
      desc: "Wind down after lectures or labs",
    },
    {
      id: "latenight",
      label: "Late Night (10pm–midnight)",
      emoji: "🌌",
      desc: "A quiet space before sleep",
    },
    {
      id: "weekends",
      label: "Weekends",
      emoji: "🏖️",
      desc: "Flexible time during Saturday & Sunday",
    },
    {
      id: "custom",
      label: "Custom",
      emoji: "📅",
      desc: "Select your own preferred times",
    },
  ];

  const handleSelectTimeSlot = (label: string, id: string) => {
    setFormData((prev) => ({ ...prev, timeSlot: label }));
    if (id !== "custom") {
      goToStep(5);
    }
  };

  const toggleCustomTime = (day: string, time: string) => {
    const key = `${day}-${time}`;
    setFormData((prev) => {
      const schedule = prev.customSchedule.includes(key)
        ? prev.customSchedule.filter((k) => k !== key)
        : [...prev.customSchedule, key];
      return { ...prev, customSchedule: schedule };
    });
  };

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const timesOfDay = ["Morning", "Afternoon", "Evening"];

  // Step 5: Save and Enter Circle
  const handleCompleteOnboarding = () => {
    const sessionId = generateUUID();
    const finalSession = {
      ...formData,
      sessionId,
      joinedAt: new Date().toISOString(),
    };

    // Save to localStorage
    localStorage.setItem(
      "mindcircle_user_session",
      JSON.stringify(finalSession),
    );

    // Navigate to /select-group
    navigate({ to: "/select-group" });
  };

  // Generate new name
  const handleRegenerateName = () => {
    setSpinKey((prev) => prev + 1);
    setFormData((prev) => ({ ...prev, displayName: generateRandomName() }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFFFF] text-[#1B2D4A] font-sans relative">
      {/* Dynamic Keyframe Injection for step fade animations */}
      <style>{`
        @keyframes stepFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .step-transition-enter {
          animation: stepFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes spinDice {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spinDice 0.5s ease-out;
        }
      `}</style>

      {/* Progress Indicator */}
      <div className="sticky top-0 z-50 w-full bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#93D4F7]/20 px-6 py-4 flex flex-col gap-3">
        <div className="max-w-xl w-full mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="font-sans text-xl  text-[#2882B4] hover:opacity-85 transition-opacity"
          >
            circle
          </Link>
          <span className="text-xs font-semibold text-[#4BACD5] uppercase tracking-widest">
            Step {step} of 5
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="max-w-xl w-full mx-auto bg-[#93D4F7]/20 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#93D4F7]/20 text-[#2882B4] h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${step * 20}%` }}
          />
        </div>
      </div>

      {/* Multi-step Container */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 py-6">
        <div
          className={`max-w-xl w-full bg-white/40 border border-[#93D4F7]/40 rounded-[32px] p-6 md:p-8 shadow-sm backdrop-blur-sm transition-opacity duration-200 ${
            animating ? "opacity-0" : "opacity-100 step-transition-enter"
          }`}
        >
          {/* STEP 2: Help us find your people */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#4BACD5]">
                  Demographics (Optional)
                </span>
                <h1 className="font-sans text-4xl text-[#1B2D4A] mt-2">
                  Help us find your people
                </h1>
                <p className="text-sm text-[#2882B4] mt-2">
                  Everything is optional. Sharing context helps us match you
                  with peers in similar situations.
                </p>
              </div>

              <div className="space-y-4">
                {/* University Input with Autocomplete */}
                <div className="relative">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2882B4] mb-2">
                    University
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UCL, Manchester, Edinburgh"
                    value={uniQuery || formData.university}
                    onChange={(e) => {
                      setUniQuery(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        university: e.target.value,
                      }));
                      setShowUniDropdown(true);
                    }}
                    onFocus={() => setShowUniDropdown(true)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#93D4F7]/40 bg-[#FFFFFF] text-sm text-[#1B2D4A] focus:outline-none focus:ring-2 focus:ring-[#93D4F7]/60 focus:border-[#93D4F7]/60 transition-all"
                  />
                  {showUniDropdown && filteredUniversities.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-[#FFFFFF] border border-[#93D4F7]/40 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {filteredUniversities.map((uni) => (
                        <button
                          key={uni}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              university: uni,
                            }));
                            setUniQuery(uni);
                            setShowUniDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-[#1B2D4A] hover:bg-[#F4FAFD] transition-colors"
                        >
                          {uni}
                        </button>
                      ))}
                    </div>
                  )}
                  {showUniDropdown && uniQuery && (
                    <div className="absolute right-3 top-9 flex items-center">
                      <button
                        type="button"
                        onClick={() => {
                          setUniQuery("");
                          setFormData((prev) => ({ ...prev, university: "" }));
                          setShowUniDropdown(false);
                        }}
                        className="text-xs text-[#4BACD5]/70 hover:text-[#2882B4]"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                {/* Course/Subject */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2882B4] mb-2">
                    Course / Subject Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science, Medicine"
                    value={formData.course}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        course: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-[#93D4F7]/40 bg-[#FFFFFF] text-sm text-[#1B2D4A] focus:outline-none focus:ring-2 focus:ring-[#93D4F7]/60 focus:border-[#93D4F7]/60 transition-all"
                  />
                </div>

                {/* Grid for Year of Study, Age & Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#2882B4] mb-2">
                      Year of Study
                    </label>
                    <select
                      value={formData.yearOfStudy}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          yearOfStudy: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-[#93D4F7]/40 bg-[#FFFFFF] text-sm text-[#1B2D4A] focus:outline-none focus:ring-2 focus:ring-[#93D4F7]/60 focus:border-[#93D4F7]/60 transition-all"
                    >
                      <option value="">Select Year...</option>
                      <option value="First year">First year</option>
                      <option value="Second year">Second year</option>
                      <option value="Third year">Third year</option>
                      <option value="Masters">Masters</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#2882B4] mb-2">
                      Age
                    </label>
                    <select
                      value={formData.age}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          age: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-xl border border-[#93D4F7]/40 bg-[#FFFFFF] text-sm text-[#1B2D4A] focus:outline-none focus:ring-2 focus:ring-[#93D4F7]/60 focus:border-[#93D4F7]/60 transition-all"
                    >
                      <option value="">Select Age...</option>
                      {["18", "19", "20", "21", "22", "23", "24", "25+"].map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#2882B4] mb-2">
                      Area / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. East London"
                      value={formData.area}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          area: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-xl border border-[#93D4F7]/40 bg-[#FFFFFF] text-sm text-[#1B2D4A] focus:outline-none focus:ring-2 focus:ring-[#93D4F7]/60 focus:border-[#93D4F7]/60 transition-all"
                    />
                  </div>
                </div>



                <p className="text-[11px] text-[#4BACD5] text-center leading-relaxed">
                  "The more you share, the better we can match you with people
                  in similar situations. Everything is optional."
                </p>

                {/* Progress Controls */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => navigate({ to: "/" })}
                    className="px-6 py-3 border border-[#93D4F7]/40 hover:bg-[#FFFFFF]/50 rounded-full font-medium text-sm text-[#2882B4] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      setShowUniDropdown(false);
                      goToStep(3);
                    }}
                    className="flex-1 py-3 bg-[#93D4F7]/20 text-[#2882B4]  rounded-full font-medium text-sm transition-transform active:scale-[0.98]"
                  >
                    {!formData.university &&
                    !formData.course &&
                    !formData.yearOfStudy &&
                    !formData.area &&
                    !formData.livingSituation
                      ? "Skip"
                      : "Continue"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Pick a display name */}
          {step === 3 && (
            <div>
              <div className="text-center mb-8">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#4BACD5]">
                  Anonymity First
                </span>
                <h1 className="font-sans text-4xl text-[#1B2D4A] mt-2">
                  Pick a display name
                </h1>
                <p className="text-sm text-[#2882B4] mt-2">
                  We generate anonymous names to protect your identity. You will
                  remain anonymous to your circle.
                </p>
              </div>

              <div className="flex flex-col items-center gap-6 py-6">
                {/* ID / Name Tag display */}
                <div className="w-full bg-[#FFFFFF] border border-[#93D4F7]/50 rounded-[24px] p-6 text-center shadow-inner relative overflow-hidden flex flex-col items-center justify-center min-h-[140px]">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-[#93D4F7]/20 text-[#2882B4]" />
                  <span className="text-[10px] font-semibold tracking-widest text-[#4BACD5]/60 uppercase mb-2">
                    ANONYMOUS STUDENT ALIAS
                  </span>
                  <div className="font-sans text-3xl md:text-4xl text-[#1B2D4A] tracking-tight  select-all">
                    {formData.displayName || "Generating..."}
                  </div>

                  {/* Dice roll animation trigger */}
                  <button
                    onClick={handleRegenerateName}
                    className="absolute right-4 bottom-4 p-2 bg-[#F4FAFD] hover:bg-[#E5F4FC]/80 rounded-full ring-1 ring-black/5 transition-all active:scale-90"
                    title="Generate another name"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`w-5 h-5 text-[#2882B4] ${spinKey > 0 ? "spin-animation" : ""}`}
                      key={spinKey}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>
                  </button>
                </div>

                {/* Options and Action */}
                <div className="w-full flex flex-col gap-3">


                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => goToStep(2)}
                      className="px-6 py-3 border border-[#93D4F7]/40 hover:bg-[#FFFFFF]/50 rounded-full font-medium text-sm text-[#2882B4] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => goToStep(4)}
                      className="flex-1 py-3 bg-[#93D4F7]/20 text-[#2882B4]  rounded-full font-medium text-sm transition-transform active:scale-[0.98]"
                    >
                      Looks good
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: When works best for you? */}
          {step === 4 && (
            <div>
              <div className="text-center mb-8">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#4BACD5]">
                  Scheduling
                </span>
                <h1 className="font-sans text-4xl text-[#1B2D4A] mt-2">
                  When works best?
                </h1>
                <p className="text-sm text-[#2882B4] mt-2">
                  Circles meet at regular times. Select your preferred
                  availability.
                </p>
              </div>

              <div className="space-y-4">
                {timeSlots.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTimeSlot(item.label, item.id)}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left ${
                      formData.timeSlot === item.label
                        ? "bg-[#F4FAFD] border-[#93D4F7]/80"
                        : "bg-[#FFFFFF] border-black/5 hover:border-[#93D4F7]/60 hover:bg-[#FFFFFF]/50"
                    } active:scale-[0.98]`}
                  >
                    <div className="text-3xl">{item.emoji}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-base text-[#1B2D4A]">
                        {item.label}
                      </h3>
                      <p className="text-xs text-[#4BACD5] mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                    <div>
                      <svg viewBox="0 0 16 16" fill="currentColor" className={`w-4 h-4 ${formData.timeSlot === item.label ? "text-[#2882B4]" : "text-[#4BACD5]/60"}`}>
                        <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>
                ))}

                {/* Custom Grid */}
                {formData.timeSlot === "Custom" && (
                  <div className="mt-6 p-5 bg-[#F4FAFD] rounded-2xl border border-[#93D4F7]/40 step-transition-enter">
                    <h3 className="font-medium text-sm text-[#1B2D4A] mb-4 text-center">Tap to select your available times</h3>
                    <div className="grid grid-cols-8 gap-2 items-center">
                      <div className="col-span-1"></div>
                      {daysOfWeek.map((day) => (
                        <div key={day} className="text-[10px] font-semibold text-center text-[#2882B4] uppercase tracking-wider">{day}</div>
                      ))}
                      
                      {timesOfDay.map((time) => (
                        <React.Fragment key={time}>
                          <div className="text-[10px] font-semibold text-right text-[#2882B4] uppercase tracking-wider pr-2">{time}</div>
                          {daysOfWeek.map((day) => {
                            const isSelected = formData.customSchedule.includes(`${day}-${time}`);
                            return (
                              <button
                                key={`${day}-${time}`}
                                onClick={() => toggleCustomTime(day, time)}
                                className={`h-8 rounded-lg transition-all border ${
                                  isSelected 
                                    ? "bg-[#93D4F7] border-[#4BACD5] shadow-inner" 
                                    : "bg-white border-[#93D4F7]/30 hover:bg-[#93D4F7]/10"
                                }`}
                              />
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-6">
                  <button
                    onClick={() => goToStep(3)}
                    className="px-6 py-3 border border-[#93D4F7]/40 hover:bg-[#FFFFFF]/50 rounded-full font-medium text-sm text-[#2882B4] transition-colors"
                  >
                    Back
                  </button>
                  {formData.timeSlot === "Custom" && (
                    <button
                      onClick={() => goToStep(5)}
                      disabled={formData.customSchedule.length === 0}
                      className={`flex-1 py-3 rounded-full font-medium text-sm transition-all ${
                        formData.customSchedule.length > 0 
                          ? "bg-[#93D4F7]/20 text-[#2882B4] active:scale-[0.98]" 
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Confirm Schedule
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Confirmation screen */}
          {step === 5 && (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-full text-emerald-600 mb-4">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <h1 className="font-sans text-4xl text-[#1B2D4A]">
                  You're all set ✓
                </h1>
                <p className="text-sm text-[#2882B4] mt-3">
                  We're matching you with a circle. You'll be able to join
                  shortly.
                </p>
              </div>

              {/* Recipe/Summary Card */}
              <div className="bg-[#FFFFFF] border border-[#93D4F7]/40 rounded-2xl p-6 mb-8 text-xs space-y-4">
                <div className="border-b border-[#93D4F7]/20 pb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4BACD5]/70">
                    Your Anonymous Alias
                  </span>
                  <div className="text-lg font-sans  text-[#1B2D4A] mt-0.5">
                    {formData.displayName}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4BACD5]/70">
                      Focus Area
                    </span>
                    <div className="font-medium text-[#1B2D4A] mt-0.5">
                      {formData.mindset}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4BACD5]/70">
                      Scheduled Sessions
                    </span>
                    <div className="font-medium text-[#1B2D4A] mt-0.5">
                      {formData.timeSlot}
                    </div>
                  </div>
                </div>

                {/* Show details if entered */}
                {(formData.university ||
                  formData.course ||
                  formData.yearOfStudy) && (
                  <div className="pt-3 border-t border-[#93D4F7]/20">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4BACD5]/70">
                      University Context
                    </span>
                    <div className="text-[#2882B4]/80 leading-relaxed mt-1">
                      {formData.university && (
                        <div>🏫 {formData.university}</div>
                      )}
                      {formData.course && (
                        <div>
                          📚 {formData.course}{" "}
                          {formData.yearOfStudy
                            ? `(${formData.yearOfStudy})`
                            : ""}
                        </div>
                      )}
                      {(formData.area || formData.livingSituation) && (
                        <div className="mt-0.5 text-[11px] text-[#4BACD5]">
                          Located around {formData.area || "Campus"} · Living in{" "}
                          {formData.livingSituation || "other"}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Finish Actions */}
              <div className="space-y-6">
                <button
                  onClick={handleCompleteOnboarding}
                  className="w-full flex items-center justify-between py-4 pr-3 pl-6 bg-[#93D4F7]/20 text-[#2882B4]  rounded-full font-medium text-sm transition-transform active:scale-[0.98]"
                >
                  Enter your Circle
                  <span className="w-8 h-8 bg-[#FFFFFF] text-[#2882B4] rounded-full flex items-center justify-center shadow-sm">
                    <svg
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </button>

                {/* Crisis Resources Reminder */}
                <div className="border-t border-[#93D4F7]/40 pt-6 text-center">
                  <span className="block text-[10px] font-bold tracking-widest text-red-700/70 uppercase mb-2">
                    🚨 Need Immediate Help?
                  </span>
                  <p className="text-[11px] text-[#4BACD5] leading-relaxed max-w-sm mx-auto">
                    MindCircle is a peer support community, not a crisis line.
                    If you are in distress, reach out to{" "}
                    <strong>Samaritans</strong> at{" "}
                    <a
                      href="tel:116123"
                      className="underline font-semibold text-[#1B2D4A]"
                    >
                      116 123
                    </a>
                    , text <strong>Shout</strong> to{" "}
                    <a
                      href="sms:85258"
                      className="underline font-semibold text-[#1B2D4A]"
                    >
                      85258
                    </a>
                    , or call emergency services.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating supportive detail background blur elements */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#E5F4FC]/20 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#F4FAFD]/30 rounded-full blur-[120px] pointer-events-none -z-10" />
    </div>
  );
}
