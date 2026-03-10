import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  uploadCanvasPhoto,
  saveCanvasState,
} from "../lib/supabaseClient";
import venusLayerGray from "@/assets/layer_grigio_canvas.png";
import venusColor from "@/assets/La_nascita_di_Venere-venere.png";
import zephyrColor from "@/assets/La_nascita_di_Venere-zefiro.png";
import chlorisColor from "@/assets/La_nascita_di_Venere-clori.png";
import horaColor from "@/assets/La_nascita_di_Venere-ore.png";
import contornoVenus from "@/assets/La_nascita_di_Venere-contorno_venere.png";
import contornoZephyr from "@/assets/La_nascita_di_Venere-contorno_zefiro.png";
import contornoChloris from "@/assets/La_nascita_di_Venere-contorno_clori.png";
import contornoHora from "@/assets/La_nascita_di_Venere-contorno_ore.png";

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
      { url: "placeholder", author: "Group Alpha", location: "Sydney, Australia" },
      { url: "placeholder", author: "Community Collective", location: "Chicago, USA" },
      { url: "placeholder", author: "Group Beta", location: "Tokyo, Japan" },
      { url: "placeholder", author: "Group Gamma", location: "Cape Town, South Africa" },
    ],
    characters: [
      { id: "venus", name: "Venus", description: "The goddess, center stage", emoji: "🧜‍♀️" },
      { id: "zephyr", name: "Zephyr", description: "Wind god, flying left", emoji: "🌬️" },
      { id: "chloris", name: "Chloris", description: "Nymph embracing Zephyr", emoji: "🌸" },
      { id: "hora", name: "Hora", description: "Handmaiden with the cloak", emoji: "👗" },
    ],
  },
  // Add other canvases if needed
};

const CanvasNew = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectingCharacter, setSelectingCharacter] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<CanvasCharacter | null>(null);
  const [cameraGranted, setCameraGranted] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoverCharacterId, setHoverCharacterId] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const canvas = id ? canvasData[id] : null;

  useEffect(() => {
    // ensure page starts at top when mounting or when id changes
    try {
      window.scrollTo(0, 0);
    } catch {}
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

  const handleCharacterSelected = (character: CanvasCharacter) => {
    setSelectingCharacter(false);
    setSelectedCharacter(character);
    startCamera();
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        // detach srcObject for cleanup
        // @ts-ignore
        videoRef.current.srcObject = null;
      } catch {}
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    setCameraLoading(true);
    setPhotoDataUrl(null);
    setConfirmed(false);
    try {
      // request camera
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(s);
      setCameraGranted(true);
      setCameraActive(true);
    } catch (err) {
      console.error("Camera permission denied or error:", err);
      setCameraGranted(false);
    } finally {
      setCameraLoading(false);
    }
  };

  // attach stream to video element once React has rendered the <video />
  useEffect(() => {
    if (!videoRef.current) return;
    if (!stream || !cameraActive) return;
    // @ts-ignore
    videoRef.current.srcObject = stream;
    const play = async () => {
      try {
        await videoRef.current?.play();
      } catch (e) {
        // autoplay might be blocked; user can interact to start
        // console.debug('Video play failed', e);
      }
    };
    play();
  }, [stream, cameraActive]);

  useEffect(() => {
    return () => {
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    let canvas = canvasRef.current;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvasRef.current = canvas;
    }
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL('image/png');
    setPhotoDataUrl(dataUrl);
    // stop the stream after capture
    stopStream();
  };

  // countdown handler for timer-based photo
  useEffect(() => {
    if (countdown == null) return;
    if (countdown <= 0) {
      setCountdown(null);
      takePhoto();
      return;
    }
    const id = setTimeout(() => setCountdown((c) => (c ? c - 1 : null)), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  const retryPhoto = () => {
    setPhotoDataUrl(null);
    startCamera();
  };

  const confirmPhoto = async () => {
    if (!photoDataUrl || !id) return;

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadCanvasPhoto(id, photoDataUrl);
      await saveCanvasState(id, uploadedUrl);

      // Close camera and reset states
      stopStream();
      setPhotoDataUrl(null);
      setCameraActive(false);
      setConfirmed(true);

      console.log("Photo uploaded successfully:", uploadedUrl);
    } catch (error) {
      console.error("Failed to upload photo:", error);
      alert("Errore nel caricamento. Riprova.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 md:px-12 lg:px-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 sm:mb-12 flex items-center justify-between"
      >
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={() => {
              stopStream();
              navigate("/");
            }}
            className="font-display text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Home
          </button>
          <button
            onClick={() => {
              stopStream();
              navigate(`/canvas/${id}`);
            }}
            className="font-display text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to Canvas
          </button>
        </div>
        <p className="font-display text-xs uppercase tracking-widest text-muted-foreground">
          Start New Canvas
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

        {/* Interactive Canvas Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative overflow-hidden rounded-sm border border-border"
        >
          {selectingCharacter && canvas.characters ? (
            // Interactive layered selector for Venus canvas
            <div className="relative w-full">
              {/* Base is the original artwork */}
              <img
                src={canvas.imageUrl}
                alt={canvas.title}
                className="w-full h-full object-cover"
              />
              {/* gray layer */}
              <img src={venusLayerGray} alt="layer" className="absolute inset-0 w-full h-full object-cover opacity-80" />

              {/* colored preview on hover */}
              {hoverCharacterId === "venus" && (
                <img src={venusColor} alt="venus" className="absolute inset-0 w-full h-full object-cover" />
              )}
              {hoverCharacterId === "zephyr" && (
                <img src={zephyrColor} alt="zephyr" className="absolute inset-0 w-full h-full object-cover" />
              )}
              {hoverCharacterId === "chloris" && (
                <img src={chlorisColor} alt="chloris" className="absolute inset-0 w-full h-full object-cover" />
              )}
              {hoverCharacterId === "hora" && (
                <img src={horaColor} alt="hora" className="absolute inset-0 w-full h-full object-cover" />
              )}

              {/* clickable hit areas (percentages approximate) */}
              <button
                aria-label="Select Venus"
                onMouseEnter={() => setHoverCharacterId("venus")}
                onMouseLeave={() => setHoverCharacterId(null)}
                onClick={() => {
                  if (hoverCharacterId !== "venus") {
                    setHoverCharacterId("venus");
                  } else {
                    handleCharacterSelected(canvas.characters!.find(c => c.id === "venus")!);
                  }
                }}
                className="absolute left-[28%] top-[20%] w-[30%] h-[45%] bg-transparent"
              />

              <button
                aria-label="Select Zephyr"
                onMouseEnter={() => setHoverCharacterId("zephyr")}
                onMouseLeave={() => setHoverCharacterId(null)}
                onClick={() => {
                  if (hoverCharacterId !== "zephyr") {
                    setHoverCharacterId("zephyr");
                  } else {
                    handleCharacterSelected(canvas.characters!.find(c => c.id === "zephyr")!);
                  }
                }}
                className="absolute left-[6%] top-[10%] w-[28%] h-[30%] bg-transparent"
              />

              <button
                aria-label="Select Chloris"
                onMouseEnter={() => setHoverCharacterId("chloris")}
                onMouseLeave={() => setHoverCharacterId(null)}
                onClick={() => {
                  if (hoverCharacterId !== "chloris") {
                    setHoverCharacterId("chloris");
                  } else {
                    handleCharacterSelected(canvas.characters!.find(c => c.id === "chloris")!);
                  }
                }}
                className="absolute left-[18%] top-[32%] w-[20%] h-[25%] bg-transparent"
              />

              <button
                aria-label="Select Hora"
                onMouseEnter={() => setHoverCharacterId("hora")}
                onMouseLeave={() => setHoverCharacterId(null)}
                onClick={() => {
                  if (hoverCharacterId !== "hora") {
                    setHoverCharacterId("hora");
                  } else {
                    handleCharacterSelected(canvas.characters!.find(c => c.id === "hora")!);
                  }
                }}
                className="absolute left-[64%] top-[30%] w-[24%] h-[40%] bg-transparent"
              />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: [0.7, 1, 0.7], y: 0 }}
                  transition={{ opacity: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
                  className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full text-center shadow-lg border border-white/10"
                >
                  <p className="font-display text-[10px] sm:text-sm uppercase">CHOOSE YOUR CHARACTER</p>
                  <p className="font-body text-[8px] sm:text-xs">Click on a figure to recreate their pose</p>
                </motion.div>
              </div>
            </div>
          ) : cameraLoading ? (
            <div className="text-center">
              <span className="mb-2 block text-2xl">{selectedCharacter?.emoji}</span>
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border border-primary/30 border-t-primary" />
              <p className="font-display text-xs uppercase tracking-wider text-muted-foreground">
                Preparing camera as {selectedCharacter?.name}...
              </p>
            </div>
          ) : photoDataUrl ? (
            <div className="relative text-center px-4 w-full h-full">
              <img src={photoDataUrl} alt="Captured" className="w-full h-full object-cover" />
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-3">
                <button
                  onClick={retryPhoto}
                  disabled={isUploading}
                  className="rounded-full border border-primary/30 bg-card px-4 py-2 font-display text-[10px] sm:text-xs uppercase text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Riprova
                </button>
                <button
                  onClick={confirmPhoto}
                  disabled={isUploading}
                  className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 font-display text-[10px] sm:text-xs uppercase text-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="h-3 w-3 animate-spin rounded-full border border-primary/30 border-t-primary" />
                      Caricamento...
                    </>
                  ) : (
                    "Conferma"
                  )}
                </button>
              </div>
            </div>
          ) : cameraActive ? (
            <div className="relative text-center px-4 w-full h-full">
              <span className="sr-only">Camera active for {selectedCharacter?.name}</span>
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />

              {/* silhouette overlay */}
              {selectedCharacter?.id === "venus" && (
                <img src={contornoVenus} alt="contour" className="pointer-events-none absolute inset-0 w-full h-full object-contain" />
              )}
              {selectedCharacter?.id === "zephyr" && (
                <img src={contornoZephyr} alt="contour" className="pointer-events-none absolute inset-0 w-full h-full object-contain" />
              )}
              {selectedCharacter?.id === "chloris" && (
                <img src={contornoChloris} alt="contour" className="pointer-events-none absolute inset-0 w-full h-full object-contain" />
              )}
              {selectedCharacter?.id === "hora" && (
                <img src={contornoHora} alt="contour" className="pointer-events-none absolute inset-0 w-full h-full object-contain" />
              )}

              {/* camera controls: shutter + timer */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-6">
                <button
                  onClick={() => { stopStream(); setSelectingCharacter(true); setSelectedCharacter(null); }}
                  className="rounded-full border border-primary/30 bg-card px-3 py-2 text-xs text-primary"
                  aria-label="Cancel camera"
                >
                  Annulla
                </button>
                <button
                  onClick={() => setTimerSeconds((s) => (s === 0 ? 3 : s === 3 ? 10 : 0))}
                  className="relative h-10 w-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center font-display text-xs text-white"
                  aria-label="Toggle timer"
                >
                  {timerSeconds}s
                </button>

                <button
                  onClick={() => {
                    if (timerSeconds > 0) setCountdown(timerSeconds);
                    else takePhoto();
                  }}
                  className="h-14 w-14 rounded-full bg-primary flex items-center justify-center shadow-md"
                  aria-label="Take photo"
                >
                  <span className="h-8 w-8 rounded-full bg-white inline-block" />
                </button>
              </div>

              {/* countdown overlay */}
              {countdown != null && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl font-bold text-white drop-shadow-xl">{countdown}</div>
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />
            </div>
          ) : confirmed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-full h-full flex items-center justify-center bg-card/90 backdrop-blur-md p-6"
            >
              <div className="text-center max-w-lg flex flex-col items-center">
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 border border-primary/30"
                >
                  <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>

                {/* Title */}
                <h2 className="mb-2 font-display text-lg sm:text-xl uppercase tracking-[0.2em] text-foreground">
                  La tela si è evoluta
                </h2>

                {/* Description */}
                <p className="mb-8 max-w-md font-body text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  La tua immagine è ora la base ufficiale di questo quadro. L'opera è incompleta: condividi la tela per trovare chi interpreterà gli altri personaggi.
                </p>

                {/* Action Buttons */}
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShareLink}
                    className="flex items-center justify-center gap-2 rounded-sm border border-primary/30 bg-primary px-6 py-3 font-display text-xs uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary/90 hover:border-glow"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {linkCopied ? "Link copiato!" : "Copia link"}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/canvas/${id}`)}
                    className="rounded-sm border border-border/50 bg-card px-6 py-3 font-display text-xs uppercase tracking-wider text-foreground transition-all hover:border-foreground/30 hover:bg-card/80"
                  >
                    Torna alla tela
                  </motion.button>
                </div>

                {/* Collaborative Indicator */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 font-body text-[10px] uppercase tracking-widest text-primary/60"
                >
                  ✨ Prossimamente: Altri artisti si uniranno a te
                </motion.p>
              </div>
            </motion.div>
          ) : (
            <div className="text-center">
              <span className="mb-2 block text-2xl">{selectedCharacter?.emoji}</span>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <div className="h-3 w-3 rounded-full bg-primary node-pulse" />
              </div>
              <p className="font-display text-sm uppercase tracking-wider text-foreground">
                You are {selectedCharacter?.name}
              </p>
              <p className="mt-2 font-body text-xs text-muted-foreground">
                Strike the pose — the canvas evolves with you
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CanvasNew;