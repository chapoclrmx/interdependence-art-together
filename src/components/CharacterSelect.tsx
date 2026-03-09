import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Character {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

interface CharacterSelectProps {
  characters: Character[];
  onSelect: (character: Character) => void;
  onBack: () => void;
}

const CharacterSelect = ({ characters, onSelect, onBack }: CharacterSelectProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-8"
    >
      <p className="mb-2 font-display text-sm uppercase tracking-[0.2em] text-foreground">
        Choose your character
      </p>
      <p className="mb-8 font-body text-xs text-muted-foreground">
        Select the figure whose pose you want to recreate
      </p>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 px-2 sm:px-0">
        {characters.map((char, i) => (
          <motion.button
            key={char.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => onSelect(char)}
            onMouseEnter={() => setHoveredId(char.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="group flex flex-col items-center gap-3 rounded-sm border border-border bg-card p-5 transition-all hover:border-primary/40 hover:bg-primary/5"
          >
            <span className="text-3xl transition-transform group-hover:scale-110">
              {char.emoji}
            </span>
            <div className="text-center">
              <p className="font-display text-xs uppercase tracking-[0.15em] text-foreground">
                {char.name}
              </p>
              <p className="mt-1 font-body text-[10px] text-muted-foreground">
                {char.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <button
        onClick={onBack}
        className="mt-8 font-display text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Cancel
      </button>
    </motion.div>
  );
};

export default CharacterSelect;
