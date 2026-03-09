import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import WorldMap from "../components/WorldMap";
import InspirationCarousel from "../components/InspirationCarousel";
import CharacterSelect from "../components/CharacterSelect";
import venusHover from "@/assets/venus-hover.png";
import communityRooftop from "@/assets/community-rooftop.png";

interface CanvasCharacter {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

interface CanvasData {
  title: string;
  subtitle: string;
  imageUrl?: string;
  inspirations?: { url: string; author: string; location: string }[];
  isBlank?: boolean;
  characters?: CanvasCharacter[];
}

const canvasData: Record<string, CanvasData> = {
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
    characters: [
      { id: "venus", name: "Venus", description: "The goddess, center stage", emoji: "🧜‍♀️" },
      { id: "zephyr", name: "Zephyr", description: "Wind god, flying left", emoji: "🌬️" },
      { id: "chloris", name: "Chloris", description: "Nymph embracing Zephyr", emoji: "🌸" },
      { id: "hora", name: "Hora", description: "Handmaiden with the cloak", emoji: "👗" },
    ],
  },
  nighthawks: {
    title: "Nighthawks",
    subtitle: "Hopper, 1942",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Nighthawks_by_Edward_Hopper_1942.jpg/1280px-Nighthawks_by_Edward_Hopper_1942.jpg",
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
  const [selectingCharacter, setSelectingCharacter] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<CanvasCharacter | null>(null);
  const [cameraGranted, setCameraGranted] = useState(false);
  const [activeInspirationIndex, setActiveInspirationIndex] = useState(0);

  const canvas = id ? canvasData[id] : null;

  if (!canvas) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-display text-sm uppercase tracking-widest text-muted-foreground">
          Canvas not found
        </p>
      </div>
    );
  }

  const handleCameraRequest = () => {
    if (canvas.characters && canvas.characters.length > 0) {
      setSelectingCharacter(true);
    } else {
      setSelectedCharacter({ id: "default", name: "Participant", description: "", emoji: "📷" });
      setTimeout(() => setCameraGranted(true), 1500);
    }
  };

  const handleCharacterSelected = (character: CanvasCharacter) => {
    setSelectingCharacter(false);
    setSelectedCharacter(character);
    setTimeout(() => setCameraGranted(true), 1500);
  };

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

        {/* Canvas display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative overflow-hidden rounded-sm border border-border"
        >
          {canvas.isBlank ? (
            <div className="flex aspect-[4/3] sm:aspect-video items-center justify-center bg-gradient-to-br from-card via-secondary/20 to-card">
              {selectingCharacter && canvas.characters ? (
                <CharacterSelect
                  characters={canvas.characters}
                  onSelect={handleCharacterSelected}
                  onBack={() => setSelectingCharacter(false)}
                />
              ) : !selectedCharacter ? (
                <div className="text-center px-4">
                  <div className="mx-auto mb-4 sm:mb-6 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-primary/20">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="mb-2 font-display text-xs sm:text-sm uppercase tracking-wider sm:tracking-[0.2em] text-foreground">
                    Your presence is required
                  </p>
                  <p className="mb-4 sm:mb-6 font-body text-[10px] sm:text-xs text-muted-foreground">
                    Enable your camera to become part of the work
                  </p>
                  <button
                    onClick={handleCameraRequest}
                    className="rounded-sm border border-primary/30 bg-primary/10 px-4 sm:px-6 py-2 sm:py-2.5 font-display text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-[0.2em] text-primary transition-all hover:bg-primary/20 hover:border-glow"
                  >
                    Enable Camera
                  </button>
                </div>
              ) : !cameraGranted ? (
                <div className="text-center">
                  <span className="mb-2 block text-2xl">{selectedCharacter.emoji}</span>
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border border-primary/30 border-t-primary" />
                  <p className="font-display text-xs uppercase tracking-wider text-muted-foreground">
                    Preparing as {selectedCharacter.name}...
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <span className="mb-2 block text-2xl">{selectedCharacter.emoji}</span>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <div className="h-3 w-3 rounded-full bg-primary node-pulse" />
                  </div>
                  <p className="font-display text-sm uppercase tracking-wider text-foreground">
                    You are {selectedCharacter.name}
                  </p>
                  <p className="mt-2 font-body text-xs text-muted-foreground">
                    Strike the pose — the canvas evolves with you
                  </p>
                </div>
              )}
            </div>
          ) : (
            <img
              src={canvas.imageUrl}
              alt={canvas.title}
              className="w-full object-cover"
            />
          )}
        </motion.div>

        {/* Character selection or camera button - outside the canvas */}
        {!canvas.isBlank && !cameraGranted && (
          <AnimatePresence mode="wait">
            {selectingCharacter && canvas.characters ? (
              <motion.div
                key="char-select"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CharacterSelect
                  characters={canvas.characters}
                  onSelect={handleCharacterSelected}
                  onBack={() => setSelectingCharacter(false)}
                />
              </motion.div>
            ) : !selectedCharacter ? (
              <motion.div
                key="join-btn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center"
              >
                <button
                  onClick={handleCameraRequest}
                  className="rounded-sm border border-primary/30 bg-card px-4 sm:px-8 py-3 sm:py-4 font-display text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-[0.2em] text-primary transition-all hover:bg-primary/10 hover:border-glow"
                >
                  Join this canvas — Choose your character
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="connecting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-3"
              >
                <span className="text-lg">{selectedCharacter.emoji}</span>
                <div className="h-5 w-5 animate-spin rounded-full border border-primary/30 border-t-primary" />
                <p className="font-display text-xs uppercase tracking-wider text-muted-foreground">
                  Connecting as {selectedCharacter.name}...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Inspiration carousel */}
        {canvas.inspirations && canvas.inspirations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <InspirationCarousel 
              images={canvas.inspirations} 
              onSlideChange={setActiveInspirationIndex}
            />
          </motion.div>
        )}

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
