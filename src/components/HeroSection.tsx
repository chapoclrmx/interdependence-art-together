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

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-12 w-[1px] bg-gradient-to-b from-transparent via-muted-foreground to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
