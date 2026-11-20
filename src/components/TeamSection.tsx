import Image from "next/image";
import { Award } from "lucide-react";

const trainers = [
  {
    name: "Alex Mercer",
    role: "Head Strength Coach",
    specialty: "Powerlifting & Hypertrophy",
    image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sarah Jenkins",
    role: "CrossFit & HIIT Specialist",
    specialty: "Olympic Lifting & Endurance",
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Marcus Vance",
    role: "Bodybuilding Coach",
    specialty: "Contest Prep & Muscle Sculpting",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Elena Rostova",
    role: "Mobility & Yoga Expert",
    specialty: "Injury Prevention & Core Stability",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "David Kim",
    role: "Athletic Conditioning Coach",
    specialty: "Agility, Speed & Boxing",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Jessica Taylor",
    role: "Certified Clinical Nutritionist",
    specialty: "Dietary Strategy & Fat Loss",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
  },
];

export default function TeamSection() {
  return (
    <section id="team" className="max-w-[92%] mx-auto py-20 sm:py-28">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
          <Award className="w-4 h-4" /> Certified Professionals
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 text-white">
          Meet Our <span className="gradient-text">Elite Coaches</span>
        </h2>
        <p className="text-secondary-text text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Our certified personal trainers at GymConnect bring decades of collective expertise in strength training, nutrition, and lifestyle transformation.
        </p>
      </div>

      <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((trainer) => (
            <div
              key={trainer.name}
              className="relative h-80 sm:h-96 rounded-2xl overflow-hidden group cursor-pointer border border-white/10 shadow-lg"
            >
              <Image
                src={trainer.image}
                alt={trainer.name}
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 350px"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

              {/* Information */}
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-accent text-xs font-bold uppercase tracking-wider block mb-1">
                  {trainer.specialty}
                </span>
                <h4 className="text-xl sm:text-2xl font-bold text-white mb-0.5">
                  {trainer.name}
                </h4>
                <p className="text-secondary-text text-sm">
                  {trainer.role}
                </p>
              </div>

              {/* Hover outline */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-accent/50 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
