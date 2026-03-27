import { motion, useScroll, useTransform } from "framer-motion";

const HeroSection = () => {
  const { scrollY } = useScroll();
  const indicatorOpacity = useTransform(scrollY, [0, 250], [1, 0]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Subtle ambient gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--glow)/0.04)_0%,_transparent_70%)]" />
      
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase tracking-wider sm:tracking-widest md:tracking-[0.3em] text-foreground"
        >
          Interdependence
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
          className="mt-4 font-body text-xs sm:text-sm uppercase tracking-widest sm:tracking-[0.5em] text-muted-foreground"
        >
          Relying on each other
        </motion.p>
      </div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{
          y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{ opacity: indicatorOpacity }}
        className="absolute bottom-8 left-0 right-0 z-10 mx-auto w-fit flex flex-col items-center gap-2 text-muted-foreground"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
        <span className="font-display text-[10px] sm:text-xs tracking-[0.2em] text-center whitespace-nowrap">SCROLL TO EXPLORE</span>
      </motion.div>

    </section>
  );
};

export default HeroSection;
