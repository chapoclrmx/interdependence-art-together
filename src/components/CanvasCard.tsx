import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface CanvasCardProps {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  hoverImageUrl?: string;
  occupied: number;
  total: number;
  isBlank?: boolean;
}

const CanvasCard = ({ id, title, subtitle, imageUrl, hoverImageUrl, occupied, total, isBlank }: CanvasCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group cursor-pointer"
      onClick={() => navigate(`/canvas/${id}`)}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-border bg-card transition-all duration-500 group-hover:border-primary/30 group-hover:border-glow">
        {isBlank ? (
          <div className="flex h-full items-center justify-center bg-gradient-to-b from-card to-secondary/30">
            <div className="text-center">
              <div className="mx-auto mb-3 h-[1px] w-12 bg-primary/30" />
              <p className="font-display text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Blank Canvas
              </p>
              <div className="mx-auto mt-3 h-[1px] w-12 bg-primary/30" />
            </div>
          </div>
        ) : (
          <>
            {imageUrl && (
              <>
                <img
                  src={imageUrl}
                  alt={title}
                  className={`h-full w-full object-cover opacity-70 transition-opacity duration-500 ${hoverImageUrl ? 'group-hover:opacity-0' : 'group-hover:opacity-90'}`}
                />
                {hoverImageUrl && (
                  <img
                    src={hoverImageUrl}
                    alt={`${title} - hover`}
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-90"
                  />
                )}
              </>
            )}
            {/* Missing silhouette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          </>
        )}

        {/* Hover glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--glow)/0.06)_0%,_transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="font-display text-sm font-medium uppercase tracking-[0.15em] text-foreground">
          {title}
        </h3>
        {subtitle && (
          <p className="font-body text-xs text-muted-foreground">{subtitle}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary node-pulse" />
            <span className="font-body text-xs text-muted-foreground">
              {occupied} active
            </span>
          </div>
          <span className="font-display text-[10px] uppercase tracking-[0.2em] text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Join →
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default CanvasCard;
