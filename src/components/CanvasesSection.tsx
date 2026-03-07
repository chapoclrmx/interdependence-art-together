import { motion } from "framer-motion";
import CanvasCard from "./CanvasCard";

const canvases = [
  {
    id: "venus",
    title: "The Birth of Venus",
    subtitle: "Botticelli, 1485 — Missing: The Wind Gods",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/1280px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg",
    occupied: 3,
    total: 10,
  },
  {
    id: "nighthawks",
    title: "Nighthawks",
    subtitle: "Hopper, 1942 — Missing: The Figures",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Nighthawks_by_Edward_Hopper_1942.jpg/1280px-Nighthawks_by_Edward_Hopper_1942.jpg",
    occupied: 7,
    total: 10,
  },
  {
    id: "blank-1",
    title: "Untitled #001",
    subtitle: "Generative · Abstract",
    occupied: 1,
    total: 8,
    isBlank: true,
  },
  {
    id: "last-supper",
    title: "The Last Supper",
    subtitle: "Da Vinci, 1498 — Missing: The Apostles",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/The_Last_Supper_-_Leonardo_Da_Vinci_-_High_Resolution_32x16.jpg/1280px-The_Last_Supper_-_Leonardo_Da_Vinci_-_High_Resolution_32x16.jpg",
    occupied: 5,
    total: 13,
  },
  {
    id: "blank-2",
    title: "Untitled #002",
    subtitle: "Generative · Fluid",
    occupied: 0,
    total: 6,
    isBlank: true,
  },
  {
    id: "school-athens",
    title: "The School of Athens",
    subtitle: "Raphael, 1511 — Missing: The Philosophers",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg/1280px-%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg",
    occupied: 9,
    total: 15,
  },
];

const CanvasesSection = () => {
  return (
    <section className="relative px-6 py-32 md:px-12 lg:px-24">
      <div className="mb-20 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="font-display text-xs uppercase tracking-[0.5em] text-muted-foreground"
        >
          Select a canvas
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-4 font-display text-3xl font-light uppercase tracking-[0.2em] text-foreground md:text-4xl"
        >
          The Canvases
        </motion.h2>
        <div className="mx-auto mt-6 h-[1px] w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {canvases.map((canvas, i) => (
          <motion.div
            key={canvas.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <CanvasCard {...canvas} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CanvasesSection;
