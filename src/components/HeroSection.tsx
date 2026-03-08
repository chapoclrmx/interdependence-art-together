import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Subtle ambient gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--glow)/0.04)_0%,_transparent_70%)]" />
      
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="font-display text-[clamp(3rem,10vw,8rem)] font-light uppercase tracking-[0.3em] text-foreground"
        >
          Interdependence
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
          className="mt-4 font-body text-sm uppercase tracking-[0.5em] text-muted-foreground"
        >
          Relying on each other
        </motion.p>
      </div>

    </section>
  );
};

export default HeroSection;
