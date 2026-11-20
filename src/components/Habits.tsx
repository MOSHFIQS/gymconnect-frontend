import Image from "next/image";

const habits = [
  {
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
    title: "Functional Movement",
    description: "Multi-joint compound movements to build natural strength and athletic agility.",
  },
  {
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
    title: "Progressive Overload",
    description: "Science-backed resistance training protocols tracked by certified GymConnect trainers.",
  },
  {
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
    title: "Consistent Practice",
    description: "Daily discipline routines designed to turn fitness into an effortless lifestyle.",
  },
  {
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=600&q=80",
    title: "Body Recomposition",
    description: "Targeted fat loss and lean muscle synthesis with customized nutrition guidance.",
  },
];

export default function Habits() {
  return (
    <section id="habits" className="py-20 sm:py-28 relative">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto px-6 mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 tracking-tight">
          Transform Your <span className="gradient-text">Habits</span>
        </h2>
        <p className="text-secondary-text text-sm sm:text-base leading-relaxed">
          At GymConnect, we believe true fitness is built on sustainable daily routines. Explore the core pillars that guide our members to peak performance.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-[92%] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {habits.map((habit, i) => (
          <div
            key={habit.title}
            className="glass rounded-3xl p-6 group flex flex-col items-center text-center border border-white/10 hover:border-accent/40 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative w-36 h-36 mb-6 overflow-hidden rounded-full border-2 border-accent/30 group-hover:border-accent shadow-xl group-hover:scale-105 transition-all duration-500">
              <Image
                src={habit.image}
                alt={habit.title}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                sizes="150px"
              />
              <div className="absolute inset-0 bg-accent/10 group-hover:bg-accent/0 transition-colors duration-300" />
            </div>

            <h4 className="text-xl font-bold mb-2.5 text-white group-hover:text-accent transition-colors duration-300">
              {habit.title}
            </h4>
            <p className="text-secondary-text text-sm leading-relaxed">
              {habit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
