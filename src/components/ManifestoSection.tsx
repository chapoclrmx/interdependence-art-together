import { motion } from "framer-motion";

const ManifestoSection = () => {
  return (
    <section className="relative overflow-hidden px-6 py-32 md:px-12 lg:px-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(var(--glow)/0.04)_0%,_transparent_60%)]" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-16"
        >
          <p className="font-display text-xs uppercase tracking-[0.5em] text-muted-foreground">
            Manifesto
          </p>
          <h2 className="mt-4 font-display text-3xl font-light uppercase tracking-[0.15em] text-foreground md:text-5xl">
            Why We Depend
          </h2>
        </motion.div>

        <div className="grid gap-16 md:grid-cols-[1.2fr_1fr] md:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <p className="font-body text-lg leading-relaxed text-secondary-foreground/80 md:text-xl md:leading-relaxed">
              We live in an era of algorithmic individualism — a world where every
              feed is a mirror, every recommendation a confirmation. The myth of
              the solitary genius has been algorithmically amplified until creation
              itself feels like a performance of isolation.
            </p>
            <p className="font-body text-lg leading-relaxed text-secondary-foreground/80 md:text-xl md:leading-relaxed">
              Interdependence refuses this premise. Here, art is returned to the
              collective. No single person can complete a work. No viewer is
              passive. The image you see exists only because someone else chose to
              be here at the same time as you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8 md:mt-24"
          >
            <p className="font-body text-lg leading-relaxed text-secondary-foreground/80">
              Every masterpiece displayed here carries a void — a deliberate
              absence that can only be filled by the presence of strangers.
              The blank canvases are even more radical: their very existence is
              contingent on collective participation.
            </p>
            <div className="space-y-4 border-l border-primary/30 pl-6">
              <p className="font-display text-sm font-light uppercase tracking-[0.2em] text-primary">
                The work is never finished.
              </p>
              <p className="font-display text-sm font-light uppercase tracking-[0.2em] text-primary/70">
                The work is never alone.
              </p>
              <p className="font-display text-sm font-light uppercase tracking-[0.2em] text-primary/50">
                The work is never yours.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom separator */}
      <div className="mx-auto mt-32 max-w-6xl">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="mt-12 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p className="font-display text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground">
            Interdependence © 2026
          </p>
          <p className="font-display text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground">
            Art is collective
          </p>
        </div>
      </div>
    </section>
  );
};

export default ManifestoSection;
