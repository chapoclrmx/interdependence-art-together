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
        <p className="font-['Georgia',_serif] font-normal text-xl leading-relaxed text-secondary-foreground/80 md:text-xl md:leading-relaxed">
          In questo spazio l'arte non è un atto isolato.
          L'interdipendenza è un rapporto di intima connessione e reciproca dipendenza: 
          l'opera esiste, ma rimane incompleta finché non decidi di partecipare al suo equilibrio.
        </p>
      </motion.div>
    </section>
  );
};

export default EtymologySection;
