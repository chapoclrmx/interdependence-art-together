import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const EtymologySection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3], [60, 0]);

  return (
    <section ref={ref} className="relative flex min-h-screen items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--glow)/0.03)_0%,_transparent_60%)]" />
      
      <motion.div style={{ opacity, y }} className="max-w-3xl text-center">
        <p className="font-display text-lg font-light uppercase tracking-[0.4em] text-primary md:text-xl">
          De-pendēre
        </p>
        <p className="mt-3 font-body text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Latin — "To hang from"
        </p>

        <div className="mx-auto my-10 h-[1px] w-16 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <p className="font-body text-lg leading-relaxed text-secondary-foreground/80 md:text-xl md:leading-relaxed">
          In this space, art doesn't stand alone. We hang on the lips, hands, and
          presence of others. To see the work, we must accept our dependence on
          whoever is connected to us in this moment.
        </p>
      </motion.div>
    </section>
  );
};

export default EtymologySection;
