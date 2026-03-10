import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  getCanvasLatestPhotoUrl,
  uploadCanvasPhoto,
  saveCanvasState,
} from "../lib/supabaseClient";
import { ImageSegmenter, FilesetResolver } from "@mediapipe/tasks-vision";
import { canvasData } from "./CanvasView";

interface JoinCharacter {
  id: string;
  name: string;
  emoji: string;
}

const characterLibrary: Record<string, JoinCharacter[]> = {
  venus: [
    { id: "venus", name: "Venus", emoji: "🧜‍♀️" },
    { id: "zephyr", name: "Zephyr", emoji: "🌬️" },
    { id: "chloris", name: "Chloris", emoji: "🌸" },
    { id: "hora", name: "Hora", emoji: "👗" },
  ],
  "dukes-of-urbino": [
    { id: "duke", name: "Duke", emoji: "🧔" },
    { id: "duchess", name: "Duchess", emoji: "👩" },
  ],
};

const CanvasJoin = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [collaborativePhotoUrl, setCollaborativePhotoUrl] = useState<string | null>(null);
  const [cameraGranted, setCameraGranted] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const personCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const scaledBgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [segmenter, setSegmenter] = useState<ImageSegmenter | null>(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [artAspectRatio, setArtAspectRatio] = useState(16 / 9);
  const [characterSelectionMode, setCharacterSelectionMode] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<JoinCharacter | null>(null);
  const [selectedTimer, setSelectedTimer] = useState<0 | 3 | 10>(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const characters = id ? characterLibrary[id] ?? [{ id: "participant", name: "Participant", emoji: "🧑‍🎨" }] : [];

  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch {}
  }, [id]);

  useEffect(() => {
    if (location.state?.bgImage) {
      setBgImage(location.state.bgImage);
    } else {
      const canvas = id ? canvasData[id] : null;
      if (canvas?.imageUrl) {
        setBgImage(canvas.imageUrl);
      }
    }
  }, [location.state, id]);

  useEffect(() => {
    streamRef.current = stream;
  }, [stream]);

  useEffect(() => {
    if (!bgImage) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = bgImage;
    img.onload = () => {
      bgImageRef.current = img;
      const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 16 / 9;
      setArtAspectRatio(ratio);

      if (!scaledBgCanvasRef.current) scaledBgCanvasRef.current = document.createElement("canvas");
      const bgCanvas = scaledBgCanvasRef.current;
      const ctx = bgCanvas.getContext("2d");
      if (!ctx) return;

      bgCanvas.width = 1280;
      bgCanvas.height = Math.round(1280 / ratio);
      const scale = Math.max(bgCanvas.width / img.width, bgCanvas.height / img.height);
      const x = bgCanvas.width / 2 - (img.width / 2) * scale;
      const y = bgCanvas.height / 2 - (img.height / 2) * scale;
      ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };
  }, [bgImage]);

  useEffect(() => {
    const loadModel = async () => {
      setModelLoading(true);
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2/wasm"
        );
        const imageSegmenter = await ImageSegmenter.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          outputCategoryMask: true,
          outputConfidenceMasks: false,
        });
        setSegmenter(imageSegmenter);
      } catch (error) {
        console.error("Errore caricamento MediaPipe:", error);
      } finally {
        setModelLoading(false);
      }
    };
    loadModel();
  }, []);

  useEffect(() => {
    if (!id) return;
    const loadCollaborativePhoto = async () => {
      const photoUrl = await getCanvasLatestPhotoUrl(id);
      setCollaborativePhotoUrl(photoUrl);
    };
    loadCollaborativePhoto();
  }, [id]);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setStream(null);
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        // @ts-ignore
        videoRef.current.srcObject = null;
      } catch {}
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setCountdown(null);
    setCameraActive(false);
  };

  const startCamera = async () => {
    setCameraLoading(true);
    setCapturedImageUrl(null);
    setCountdown(null);
    setShowSuccess(false);
    try {
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

  useEffect(() => {
    if (!videoRef.current || !stream || !cameraActive) return;
    // @ts-ignore
    videoRef.current.srcObject = stream;
    const play = async () => {
      try {
        await videoRef.current?.play();
        if (segmenter && bgImage && !capturedImageUrl) {
          processFrame();
        }
      } catch {}
    };
    play();
  }, [stream, cameraActive, segmenter, bgImage, capturedImageUrl]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      setCountdown(null);
      takePhoto();
      return;
    }
    const timerId = window.setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => window.clearTimeout(timerId);
  }, [countdown]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      const activeStream = streamRef.current;
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        try {
          videoRef.current.pause();
          // @ts-ignore
          videoRef.current.srcObject = null;
        } catch {}
      }
    };
  }, []);

  const processFrame = () => {
    if (!videoRef.current || !canvasRef.current || !segmenter || !bgImageRef.current || !scaledBgCanvasRef.current || capturedImageUrl) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx || video.readyState < 2 || video.videoWidth === 0) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    let targetWidth = video.videoWidth;
    let targetHeight = Math.round(targetWidth / artAspectRatio);
    if (targetHeight > video.videoHeight) {
      targetHeight = video.videoHeight;
      targetWidth = Math.round(targetHeight * artAspectRatio);
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const videoRatio = video.videoWidth / video.videoHeight;
    let sx = 0;
    let sy = 0;
    let sw = video.videoWidth;
    let sh = video.videoHeight;

    if (videoRatio > artAspectRatio) {
      sw = Math.round(video.videoHeight * artAspectRatio);
      sx = Math.round((video.videoWidth - sw) / 2);
    } else {
      sh = Math.round(video.videoWidth / artAspectRatio);
      sy = Math.round((video.videoHeight - sh) / 2);
    }

    const startTimeMs = performance.now();
    segmenter.segmentForVideo(video, startTimeMs, (result) => {
      const mask = result.categoryMask;
      if (!mask) return;
      if (!maskCanvasRef.current) maskCanvasRef.current = document.createElement("canvas");
      const mCanvas = maskCanvasRef.current;
      mCanvas.width = mask.width;
      mCanvas.height = mask.height;
      const mCtx = mCanvas.getContext("2d");
      if (!mCtx) return;

      const maskArray = mask.getAsUint8Array();
      const maskData = mCtx.createImageData(mCanvas.width, mCanvas.height);
      for (let i = 0; i < maskArray.length; i++) {
        maskData.data[i * 4 + 3] = maskArray[i] === 0 ? 255 : 0;
      }
      mCtx.putImageData(maskData, 0, 0);

      if (!personCanvasRef.current) personCanvasRef.current = document.createElement("canvas");
      const pCanvas = personCanvasRef.current;
      pCanvas.width = canvas.width;
      pCanvas.height = canvas.height;
      const pCtx = pCanvas.getContext("2d");
      if (!pCtx) return;

      pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
      pCtx.drawImage(mCanvas, 0, 0, pCanvas.width, pCanvas.height);
      pCtx.globalCompositeOperation = "source-in";
      pCtx.drawImage(video, sx, sy, sw, sh, 0, 0, pCanvas.width, pCanvas.height);

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(scaledBgCanvasRef.current, 0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
      ctx.drawImage(pCanvas, 0, 0);
      ctx.restore();

      ctx.restore();
    });
    animationFrameRef.current = requestAnimationFrame(processFrame);
  };

  const takePhoto = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL("image/png");
    setCapturedImageUrl(dataUrl);
  };

  const takePhotoWithTimer = () => {
    if (countdown !== null) return;
    if (selectedTimer === 0) {
      takePhoto();
      return;
    }
    setCountdown(selectedTimer);
  };

  const cycleTimer = () => {
    if (countdown !== null) return;
    setSelectedTimer((prev) => {
      if (prev === 0) return 3;
      if (prev === 3) return 10;
      return 0;
    });
  };

  const handleConfirmUpload = async () => {
    if (!capturedImageUrl || !id) return;
    setIsUploading(true);
    try {
      const uploadedUrl = await uploadCanvasPhoto(id, capturedImageUrl);
      await saveCanvasState(id, uploadedUrl);
      stopStream();
      setShowSuccess(true);
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

  const currentCanvas = id ? canvasData[id] : null;
  const subtitleParts = currentCanvas?.subtitle?.split(",") ?? [];
  const canvasTitle = currentCanvas?.title ?? "Untitled Canvas";
  const canvasAuthor = subtitleParts[0]?.trim() || "Unknown Author";
  const canvasYear = subtitleParts[1]?.trim() || "Unknown Year";

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 md:px-12 lg:px-24">
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
        <button
          type="button"
          onClick={() => navigate("/canvas/new")}
          className="font-display text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        >
          Start New Canvas
        </button>
      </motion.div>

      <div className="mx-auto max-w-5xl space-y-8 sm:space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="font-display text-xl sm:text-2xl md:text-4xl font-light uppercase tracking-[0.2em] sm:tracking-[0.3em] text-foreground">
            {canvasTitle}
          </h1>
          <p className="mt-2 font-body text-xs text-muted-foreground">
            {canvasAuthor}, {canvasYear}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative mx-auto w-full overflow-hidden rounded-sm border border-border"
          style={{ aspectRatio: artAspectRatio }}
        >
          {showSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-full h-full flex items-center justify-center bg-card/90 backdrop-blur-md p-6"
            >
              <div className="text-center max-w-lg flex flex-col items-center">
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

                <h2 className="mb-2 font-display text-lg sm:text-xl uppercase tracking-[0.2em] text-foreground">
                  La tela si e evoluta
                </h2>

                <p className="mb-8 max-w-md font-body text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  La tua immagine e ora la base ufficiale di questo quadro. L'opera e incompleta: condividi la tela per trovare chi interpretera gli altri personaggi.
                </p>

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
              </div>
            </motion.div>
          ) : characterSelectionMode ? (
            <div className="relative w-full h-full bg-card/30 p-6 sm:p-10 flex flex-col items-center justify-center gap-6">
              <p className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">Choose your character</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl">
                {characters.map((character) => (
                  <button
                    key={character.id}
                    onClick={() => {
                      setSelectedCharacter(character);
                      setCharacterSelectionMode(false);
                      startCamera();
                    }}
                    className="rounded-sm border border-primary/30 bg-primary/10 px-4 py-4 font-display text-xs uppercase tracking-wider text-primary transition-all hover:bg-primary/20 hover:border-glow"
                  >
                    <span className="block text-xl mb-2">{character.emoji}</span>
                    {character.name}
                  </button>
                ))}
              </div>
            </div>
          ) : cameraLoading || modelLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border border-primary/30 border-t-primary" />
              <p className="font-display text-xs uppercase tracking-wider text-muted-foreground">
                {cameraLoading ? `Preparing camera${selectedCharacter ? ` as ${selectedCharacter.name}` : ""}...` : "Loading AI Model..."}
              </p>
            </div>
          ) : cameraActive ? (
            <div className="relative w-full aspect-video overflow-hidden bg-black rounded-sm" style={{ aspectRatio: artAspectRatio }}>
              <video ref={videoRef} className="hidden" autoPlay playsInline muted />
              <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full object-cover z-20 ${capturedImageUrl ? "hidden" : "block"}`} />

              {capturedImageUrl && (
                <img src={capturedImageUrl} alt="Captured" className="absolute inset-0 w-full h-full object-cover z-20" />
              )}

              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-6 z-30">
                {!capturedImageUrl ? (
                  <>
                    <button
                      onClick={() => {
                        stopStream();
                        setCharacterSelectionMode(true);
                      }}
                      className="rounded-full border border-primary/30 bg-card px-3 py-2 text-xs text-primary"
                    >
                      Annulla
                    </button>
                    <button
                      onClick={cycleTimer}
                      className="relative h-10 w-10 rounded-full bg-black/50 border border-white/20 text-xs text-white"
                    >
                      {countdown !== null ? `${countdown}s` : `${selectedTimer}s`}
                    </button>
                    <button
                      onClick={takePhotoWithTimer}
                      className="h-14 w-14 rounded-full bg-primary flex items-center justify-center"
                    >
                      <span className="h-8 w-8 rounded-full bg-white" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setCapturedImageUrl(null)}
                      className="rounded-full border border-primary/30 bg-card px-3 py-2 text-xs text-primary"
                    >
                      RIPROVA
                    </button>
                    <button
                      onClick={handleConfirmUpload}
                      disabled={isUploading}
                      className="rounded-sm border border-glow bg-primary/20 px-4 py-2 font-display text-xs text-primary transition-all hover:bg-primary/30 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isUploading ? "CARICAMENTO..." : "CONFERMA"}
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {bgImage && (
                <img
                  src={bgImage}
                  alt="background"
                  className="absolute inset-0 w-full h-full object-cover blur-md"
                />
              )}
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6">
                <button
                  onClick={startCamera}
                  className="rounded-sm border border-primary/30 bg-primary/10 px-4 sm:px-6 py-2 sm:py-2.5 font-display text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-[0.2em] text-primary transition-all hover:bg-primary/20 hover:border-glow"
                >
                  Enable Camera
                </button>
                <p className="mt-4 font-body text-xs sm:text-sm text-white/70">
                  Enable your camera to become part of the work
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CanvasJoin;
