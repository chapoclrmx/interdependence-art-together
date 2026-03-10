import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import WorldMap from "../components/WorldMap";
import InspirationCarousel from "../components/InspirationCarousel";
import { getCanvasLatestPhotoUrl } from "../lib/supabaseClient";
import venusHover from "@/assets/venus-hover.png";
import communityRooftop from "@/assets/community-rooftop.png";
import dukesHover from '@/assets/Piero_della_Francesca_woman_sn.jpg';

interface CanvasData {
  title: string;
  subtitle: string;
  imageUrl?: string;
  inspirations?: { url: string; author: string; location: string }[];
  isBlank?: boolean;
}

export const canvasData: Record<string, CanvasData> = {
  venus: {
    title: "The Birth of Venus",
    subtitle: "Botticelli, 1485",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/1280px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg",
    inspirations: [
      { url: venusHover, author: "Group Alpha", location: "Sydney, Australia" },
      { url: communityRooftop, author: "Community Collective", location: "Chicago, USA" },
      { url: venusHover, author: "Group Beta", location: "Tokyo, Japan" },
      { url: venusHover, author: "Group Gamma", location: "Cape Town, South Africa" },
    ],
  },
  "dukes-of-urbino": {
    title: "Ritratto dei Duchi di Urbino",
    subtitle: "Piero della Francesca, 1465",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Piero_della_Francesca_044.jpg/1280px-Piero_della_Francesca_044.jpg",
    inspirations: [{ url: dukesHover, author: "User Recreation", location: "Italy" }],
  },
  "blank-1": { title: "Untitled #001", subtitle: "Generative · Abstract", isBlank: true },
  "last-supper": {
    title: "The Last Supper",
    subtitle: "Da Vinci, 1498",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/The_Last_Supper_-_Leonardo_Da_Vinci_-_High_Resolution_32x16.jpg/1280px-The_Last_Supper_-_Leonardo_Da_Vinci_-_High_Resolution_32x16.jpg",
  },
  "blank-2": { title: "Untitled #002", subtitle: "Generative · Fluid", isBlank: true },
  "school-athens": {
    title: "The School of Athens",
    subtitle: "Raphael, 1511",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg/1280px-%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg",
  },
};

const CanvasView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeInspirationIndex, setActiveInspirationIndex] = useState(0);
  const [collaborativePhotoUrl, setCollaborativePhotoUrl] = useState<string | null>(null);

  const canvas = id ? canvasData[id] : null;

  useEffect(() => {
    // ensure page starts at top when mounting or when id changes
    try {
      window.scrollTo(0, 0);
    } catch {}
  }, [id]);

  // Load collaborative photo when canvas changes
  useEffect(() => {
    if (!id) return;
    const loadCollaborativePhoto = async () => {
      const photoUrl = await getCanvasLatestPhotoUrl(id);
      setCollaborativePhotoUrl(photoUrl);
    };
    loadCollaborativePhoto();
  }, [id]);

  if (!canvas) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-display text-sm uppercase tracking-widest text-muted-foreground">
          Canvas not found
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 md:px-12 lg:px-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 sm:mb-12 flex items-center justify-between"
      >
        <button
          onClick={() => navigate("/")}
          className="font-display text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </button>
        <p className="font-display text-xs uppercase tracking-widest text-muted-foreground">
          Live Canvas
        </p>
      </motion.div>

      <div className="mx-auto max-w-5xl space-y-8 sm:space-y-12">
        {/* Canvas title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="font-display text-xl sm:text-2xl font-light uppercase tracking-wider sm:tracking-[0.2em] text-foreground md:text-4xl">
            {canvas.title}
          </h1>
          <p className="mt-2 font-body text-xs text-muted-foreground">{canvas.subtitle}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="rounded-sm overflow-hidden border border-border"><img src={canvas.imageUrl} alt={canvas.title} className="w-full object-cover block" /></motion.div>

        {/* Inspiration carousel */}
        {canvas.inspirations && canvas.inspirations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <InspirationCarousel 
              images={canvas.inspirations} 
              onSlideChange={setActiveInspirationIndex}
            />
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6"
        >
          <button
            onClick={() => navigate(`/canvas/${id}/new`)}
            className="flex-1 sm:flex-none rounded-sm border border-primary/30 bg-primary/10 px-6 py-4 font-display text-sm uppercase tracking-wider text-primary transition-all hover:bg-primary/20 hover:border-glow"
          >
            START A NEW CANVAS
          </button>
          <button
            onClick={() => navigate(`/canvas/${id}/join`, { state: { bgImage: canvas.inspirations?.[activeInspirationIndex]?.url || canvas.imageUrl } })}
            className="flex-1 sm:flex-none rounded-sm border border-border/50 bg-card px-6 py-4 font-display text-sm uppercase tracking-wider text-foreground transition-all hover:border-foreground/30 hover:bg-card/80"
          >
            JOIN THIS CANVAS
          </button>
        </motion.div>

        {/* The Chain - World Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <WorldMap activeGroupIndex={activeInspirationIndex} />
        </motion.div>
      </div>
    </div>
  );
};

export default CanvasView;
