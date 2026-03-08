import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import WorldMap from "../components/WorldMap";
import venusHover from "@/assets/venus-hover.png";

const canvasData: Record<string, { title: string; subtitle: string; imageUrl?: string; inspirationUrl?: string; isBlank?: boolean }> = {
  venus: {
    title: "The Birth of Venus",
    subtitle: "Botticelli, 1485",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/1280px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg",
    inspirationUrl: venusHover,
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
  const [cameraRequested, setCameraRequested] = useState(false);
  const [cameraGranted, setCameraGranted] = useState(false);

  const canvas = id ? canvasData[id] : null;

  if (!canvas) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Canvas not found
        </p>
      </div>
    );
  }

  const handleCameraRequest = () => {
    setCameraRequested(true);
    // Simulate camera permission dialog
    setTimeout(() => setCameraGranted(true), 1500);
  };

  return (
    <div className="min-h-screen px-6 py-8 md:px-12 lg:px-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-12 flex items-center justify-between"
      >
        <button
          onClick={() => navigate("/")}
          className="font-display text-xs uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </button>
        <p className="font-display text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Live Canvas
        </p>
      </motion.div>

      <div className="mx-auto max-w-5xl space-y-12">
        {/* Canvas title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="font-display text-2xl font-light uppercase tracking-[0.2em] text-foreground md:text-4xl">
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
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-card via-secondary/20 to-card">
              {!cameraRequested ? (
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-primary/20">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="mb-2 font-display text-sm uppercase tracking-[0.2em] text-foreground">
                    Your presence is required
                  </p>
                  <p className="mb-6 font-body text-xs text-muted-foreground">
                    Enable your camera to become part of the work
                  </p>
                  <button
                    onClick={handleCameraRequest}
                    className="rounded-sm border border-primary/30 bg-primary/10 px-6 py-2.5 font-display text-xs uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary/20 hover:border-glow"
                  >
                    Enable Camera
                  </button>
                </div>
              ) : !cameraGranted ? (
                <div className="text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border border-primary/30 border-t-primary" />
                  <p className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Requesting access...
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <div className="h-3 w-3 rounded-full bg-primary node-pulse" />
                  </div>
                  <p className="font-display text-sm uppercase tracking-[0.2em] text-foreground">
                    You are connected
                  </p>
                  <p className="mt-2 font-body text-xs text-muted-foreground">
                    The canvas evolves with each participant
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <img
                src={canvas.imageUrl}
                alt={canvas.title}
                className="w-full object-cover"
              />
              {/* Silhouette overlays */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-24 w-16 rounded-t-full border border-dashed border-primary/20 bg-background/30 backdrop-blur-sm md:h-40 md:w-24"
                    />
                  ))}
                </div>
              </div>
              {/* Camera prompt overlay */}
              {!cameraGranted && (
                <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-background/80 to-transparent pb-12">
                  {!cameraRequested ? (
                    <button
                      onClick={handleCameraRequest}
                      className="rounded-sm border border-primary/30 bg-card/80 px-6 py-3 font-display text-xs uppercase tracking-[0.2em] text-primary backdrop-blur-sm transition-all hover:bg-primary/10"
                    >
                      Fill a silhouette — Enable Camera
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 animate-spin rounded-full border border-primary/30 border-t-primary" />
                      <p className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Connecting...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Inspiration photo */}
        {canvas.inspirationUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <p className="text-center font-display text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Inspired Recreation
            </p>
            <div className="overflow-hidden rounded-sm border border-border">
              <img
                src={canvas.inspirationUrl}
                alt={`${canvas.title} — inspired recreation`}
                className="w-full object-cover"
              />
            </div>
          </motion.div>
        )}

        {/* The Chain - World Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <WorldMap />
        </motion.div>
      </div>
    </div>
  );
};

export default CanvasView;
