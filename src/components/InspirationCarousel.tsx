import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface InspirationImage {
  url: string;
  author: string;
  location: string;
}

interface InspirationCarouselProps {
  images: InspirationImage[];
  onSlideChange?: (index: number) => void;
}

const InspirationCarousel = ({ images, onSlideChange }: InspirationCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    onSlideChange?.(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    onSlideChange?.(newIndex);
  };

  if (images.length === 0) return null;

  return (
    <div className="space-y-4">
      <p className="text-center font-display text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Inspired Recreations
      </p>
      
      <div className="relative">
        {/* Navigation buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-4 rounded-full border border-border bg-card/90 p-2 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-primary/10"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5 text-muted-foreground" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-4 rounded-full border border-border bg-card/90 p-2 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-primary/10"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Image container */}
        <div className="overflow-hidden rounded-sm border border-border">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={images[currentIndex].url}
                alt={`Recreation by ${images[currentIndex].author}`}
                className="w-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Image info */}
        <motion.div 
          key={`info-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 flex items-center justify-between"
        >
          <div>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-foreground">
              {images[currentIndex].author}
            </p>
            <p className="font-body text-[10px] text-muted-foreground">
              {images[currentIndex].location}
            </p>
          </div>
          <div className="flex gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  onSlideChange?.(index);
                }}
                className={`h-1.5 w-1.5 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-primary w-4"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InspirationCarousel;
