import Image from "next/image";

const exercises = [
  {
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
    label: "Heavy Compound Weightlifting",
    category: "Strength",
    colSpan: "col-span-2 lg:col-span-1",
  },
  {
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80",
    label: "CrossFit & Battle Ropes",
    category: "Conditioning",
    colSpan: "col-span-2 lg:col-span-2",
  },
  {
    image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=800&q=80",
    label: "Commercial Cardio & Cycling",
    category: "Endurance",
    colSpan: "col-span-2 lg:col-span-1 hidden lg:block",
  },
  {
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
    label: "Bodybuilding & Hypertrophy",
    category: "Muscle Building",
    colSpan: "col-span-2",
  },
  {
    image: "https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=800&q=80",
    label: "Combat & Boxing Drills",
    category: "Agility",
    colSpan: "col-span-2 lg:col-span-1",
  },
  {
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
    label: "Core & Calisthenics Routine",
    category: "Flexibility",
    colSpan: "col-span-2 lg:col-span-1 hidden lg:block",
  },
];

export default function TrainingGrid() {
  return (
    <section id="training" className="max-w-[92%] mx-auto mb-20 sm:mb-28">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 text-white">
          Training &amp; <span className="gradient-text">Workout Zones</span>
        </h2>
        <p className="text-secondary-text text-base sm:text-lg max-w-xl">
          Discover our specialized fitness zones designed for high performance, functional bodybuilding, and personal transformation at GymConnect.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {exercises.map((exercise, i) => (
          <div
            key={i}
            className={`${exercise.colSpan} relative h-48 sm:h-64 lg:h-[360px] rounded-2xl overflow-hidden group cursor-pointer border border-white/10`}
          >
            <Image
              src={exercise.image}
              alt={exercise.label}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:from-black/95 transition-all duration-300" />

            {/* Content tags */}
            <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6 z-10">
              <span className="self-start px-3 py-1 rounded-full text-xs font-bold bg-accent/80 text-white backdrop-blur-md">
                {exercise.category}
              </span>
              <div>
                <p className="text-white font-bold text-base sm:text-xl drop-shadow-md group-hover:text-accent transition-colors duration-300">
                  {exercise.label}
                </p>
              </div>
            </div>

            {/* Hover border glow */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-accent/60 transition-all duration-500" />
          </div>
        ))}
      </div>
    </section>
  );
}
