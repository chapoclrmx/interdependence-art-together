import { motion, AnimatePresence } from "framer-motion";
import worldMapBg from "@/assets/world-map-bg.png";

interface ConnectedUser {
  id: string;
  name: string;
  x: number;
  y: number;
  country: string;
}

// Groups of users - each group corresponds to a different recreation photo
const userGroups: ConnectedUser[][] = [
  // Group 1 - Australia, Europe, North America
  [
    { id: "1", name: "Aiko M.", x: 85, y: 72, country: "Australia" },
    { id: "2", name: "Lena S.", x: 52, y: 32, country: "Germany" },
    { id: "3", name: "Sofia V.", x: 22, y: 35, country: "USA" },
  ],
  // Group 2 - Brazil, Japan, UK
  [
    { id: "4", name: "Lucas R.", x: 30, y: 62, country: "Brazil" },
    { id: "5", name: "Yuki T.", x: 82, y: 38, country: "Japan" },
    { id: "6", name: "Emma W.", x: 48, y: 28, country: "UK" },
  ],
  // Group 3 - India, Canada, South Africa
  [
    { id: "7", name: "Priya K.", x: 70, y: 42, country: "India" },
    { id: "8", name: "Marc D.", x: 18, y: 28, country: "Canada" },
    { id: "9", name: "Thabo M.", x: 55, y: 68, country: "South Africa" },
  ],
];

interface WorldMapProps {
  activeGroupIndex?: number;
}

const WorldMap = ({ activeGroupIndex = 0 }: WorldMapProps) => {
  const activeUsers = userGroups[activeGroupIndex] || userGroups[0];

  return (
    <div 
      className="relative w-full overflow-hidden rounded-sm border border-border p-8"
      style={{
        backgroundImage: `url(${worldMapBg})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'hsl(var(--card) / 0.9)',
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-muted-foreground">
          The Chain — Connected Users
        </p>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary node-pulse" />
          <span className="font-body text-xs text-muted-foreground">
            {activeUsers.length} connected
          </span>
        </div>
      </div>

      <div className="relative aspect-[2/1] w-full">
        {/* SVG overlay for connections and nodes */}
        <svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full">
          {/* Connection lines */}
          <AnimatePresence mode="wait">
            {activeUsers.map((user, i) => {
              const nextUser = activeUsers[(i + 1) % activeUsers.length];
              return (
                <motion.line
                  key={`line-${activeGroupIndex}-${user.id}`}
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  x1={user.x}
                  y1={user.y}
                  x2={nextUser.x}
                  y2={nextUser.y}
                  stroke="hsl(var(--primary))"
                  strokeWidth={0.4}
                  className="line-glow"
                  style={{ filter: 'drop-shadow(0 0 6px hsl(var(--primary) / 0.8))' }}
                />
              );
            })}
          </AnimatePresence>

          {/* User nodes */}
          <AnimatePresence mode="wait">
            {activeUsers.map((user, i) => (
              <motion.g 
                key={`node-${activeGroupIndex}-${user.id}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3, delay: i * 0.15 }}
              >
                {/* Outer glow */}
                <circle
                  cx={user.x}
                  cy={user.y}
                  r={2.5}
                  fill="hsl(var(--primary))"
                  opacity={0.25}
                  style={{ filter: 'blur(1px)' }}
                />
                {/* Inner dot */}
                <circle
                  cx={user.x}
                  cy={user.y}
                  r={1}
                  fill="hsl(var(--primary))"
                  className="node-pulse"
                  style={{ animationDelay: `${i * 0.4}s` }}
                />
              </motion.g>
            ))}
          </AnimatePresence>
        </svg>

        {/* Labels */}
        <AnimatePresence mode="wait">
          {activeUsers.map((user, i) => (
            <motion.div
              key={`label-${activeGroupIndex}-${user.id}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
              className="pointer-events-none absolute rounded-sm border border-primary/20 bg-card/90 px-2 py-1 backdrop-blur-sm"
              style={{
                left: `${user.x}%`,
                top: `${(user.y / 80) * 100 - 6}%`,
                transform: "translateX(-50%)",
              }}
            >
              <p className="font-display text-[9px] uppercase tracking-[0.15em] text-primary">
                {user.name}
              </p>
              <p className="font-body text-[7px] text-muted-foreground">
                {user.country}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WorldMap;
