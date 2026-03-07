import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConnectedUser {
  id: string;
  name: string;
  x: number;
  y: number;
}

const mockUsers: ConnectedUser[] = [
  { id: "1", name: "Aiko M.", x: 78, y: 38 },
  { id: "2", name: "Lena S.", x: 48, y: 28 },
  { id: "3", name: "Marco R.", x: 50, y: 42 },
  { id: "4", name: "Priya K.", x: 68, y: 50 },
  { id: "5", name: "Sofia V.", x: 30, y: 35 },
  { id: "6", name: "Yusuf A.", x: 55, y: 35 },
];

// Simple dot-map world outline (SVG viewBox coordinates mapped to percentages)
const worldDots: [number, number][] = [];
// Generate a sparse dot grid representing continents
const continentRegions = [
  // North America
  ...[...Array(20)].map(() => [15 + Math.random() * 18, 20 + Math.random() * 18] as [number, number]),
  // South America
  ...[...Array(12)].map(() => [25 + Math.random() * 10, 45 + Math.random() * 25] as [number, number]),
  // Europe
  ...[...Array(15)].map(() => [45 + Math.random() * 10, 20 + Math.random() * 12] as [number, number]),
  // Africa
  ...[...Array(18)].map(() => [45 + Math.random() * 12, 35 + Math.random() * 25] as [number, number]),
  // Asia
  ...[...Array(25)].map(() => [58 + Math.random() * 22, 18 + Math.random() * 25] as [number, number]),
  // Australia
  ...[...Array(8)].map(() => [75 + Math.random() * 10, 60 + Math.random() * 10] as [number, number]),
];

continentRegions.forEach(([x, y]) => worldDots.push([x, y]));

const WorldMap = () => {
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);

  return (
    <div className="relative w-full overflow-hidden rounded-sm border border-border bg-card/50 p-8">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-muted-foreground">
          The Chain — Connected Users
        </p>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary node-pulse" />
          <span className="font-body text-xs text-muted-foreground">
            {mockUsers.length} connected
          </span>
        </div>
      </div>

      <div className="relative aspect-[2/1] w-full">
        {/* Dot map */}
        <svg viewBox="0 0 100 80" className="h-full w-full">
          {/* World dots */}
          {worldDots.map(([x, y], i) => (
            <circle
              key={`dot-${i}`}
              cx={x}
              cy={y}
              r={0.3}
              className="fill-muted-foreground/20"
            />
          ))}

          {/* Connection lines */}
          {mockUsers.map((user, i) => {
            const nextUser = mockUsers[(i + 1) % mockUsers.length];
            return (
              <line
                key={`line-${user.id}`}
                x1={user.x}
                y1={user.y}
                x2={nextUser.x}
                y2={nextUser.y}
                stroke="hsl(var(--glow))"
                strokeWidth={0.15}
                opacity={hoveredUser === user.id || hoveredUser === nextUser.id ? 0.8 : 0.2}
                className="line-glow transition-opacity duration-300"
              />
            );
          })}

          {/* User nodes */}
          {mockUsers.map((user) => (
            <g key={user.id}>
              {/* Outer glow */}
              <circle
                cx={user.x}
                cy={user.y}
                r={hoveredUser === user.id ? 2.5 : 1.5}
                fill="hsl(var(--glow))"
                opacity={hoveredUser === user.id ? 0.15 : 0.08}
                className="transition-all duration-300"
              />
              {/* Inner dot */}
              <circle
                cx={user.x}
                cy={user.y}
                r={0.6}
                fill="hsl(var(--glow))"
                className="node-pulse cursor-pointer"
                style={{ animationDelay: `${parseInt(user.id) * 0.4}s` }}
                onMouseEnter={() => setHoveredUser(user.id)}
                onMouseLeave={() => setHoveredUser(null)}
              />
            </g>
          ))}
        </svg>

        {/* Tooltips rendered as HTML overlays */}
        <AnimatePresence>
          {hoveredUser && (() => {
            const user = mockUsers.find(u => u.id === hoveredUser);
            if (!user) return null;
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="pointer-events-none absolute rounded-sm border border-primary/20 bg-card/90 px-3 py-1.5 backdrop-blur-sm"
                style={{
                  left: `${user.x}%`,
                  top: `${(user.y / 80) * 100 - 8}%`,
                  transform: "translateX(-50%)",
                }}
              >
                <p className="font-display text-[10px] uppercase tracking-[0.2em] text-primary">
                  {user.name}
                </p>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WorldMap;
