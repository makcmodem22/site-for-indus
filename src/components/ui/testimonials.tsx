// @ts-nocheck
'use client'
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

// TypeScript interface for a single testimonial object
export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  imageSrc: string;
}

// TypeScript interface for the component's props
export interface TestimonialSectionProps {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
}

/**
 * A responsive section component to display customer testimonials.
 * It features a title, subtitle, and a grid of animated testimonial cards.
 */
export const TestimonialSection = ({
  title,
  subtitle,
  testimonials,
}: TestimonialSectionProps) => {
  // Animation variants for the container to orchestrate staggered children animations
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Animation variants for each testimonial card
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="w-full bg-[#0a0a0a] py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-6 lg:px-10 text-center">
        {/* Section Header */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#c9a962]" style={{ fontFamily: "'Inter', sans-serif" }}>
          Testimonials
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-400">
          {subtitle}
        </p>

        {/* Testimonials Grid */}
        <motion.div
          className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="relative overflow-hidden rounded-2xl bg-[#111111] border border-white/[0.05] shadow-sm"
              variants={itemVariants}
            >
              <div className="relative">
                <img
                  src={testimonial.imageSrc}
                  alt={testimonial.name}
                  className="h-80 w-full object-cover"
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-transparent" />
              </div>

              {/* Content within the card */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-left text-white">
                <Quote
                  className="mb-4 h-6 w-6 text-[#c9a962]"
                  aria-hidden="true"
                />
                <blockquote className="text-[15px] italic leading-relaxed text-neutral-300" style={{ fontFamily: "'Playfair Display', serif" }}>
                  "{testimonial.quote}"
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 pt-5 border-t border-white/[0.05]">
                  <div>
                    <p className="text-sm font-medium text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                      &mdash; {testimonial.name}
                    </p>
                    <p className="text-xs text-neutral-500" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {testimonial.role}
                    </p>
                  </div>
                </figcaption>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
