import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import worldMapBg from "@/assets/world-map-bg.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
        backgroundColor: 'white',
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
          {/* Connection lines - static */}
          {activeUsers.map((user, i) => {
            const nextUser = activeUsers[(i + 1) % activeUsers.length];
            return (
              <line
                key={`line-${activeGroupIndex}-${user.id}`}
                x1={user.x}
                y1={user.y}
                x2={nextUser.x}
                y2={nextUser.y}
                stroke="hsl(var(--primary))"
                strokeWidth={0.8}
                className="line-glow"
                style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.9))' }}
              />
            );
          })}

          {/* User nodes - static */}
          {activeUsers.map((user, i) => (
            <g key={`node-${activeGroupIndex}-${user.id}`}>
              {/* Outer glow */}
              <circle
                cx={user.x}
                cy={user.y}
                r={3}
                fill="hsl(var(--primary))"
                opacity={0.3}
                style={{ filter: 'blur(1px)' }}
              />
              {/* Inner dot */}
              <circle
                cx={user.x}
                cy={user.y}
                r={1.5}
                fill="hsl(var(--primary))"
                className="node-pulse"
                style={{ animationDelay: `${i * 0.4}s` }}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Participants button */}
      <Dialog>
        <DialogTrigger asChild>
          <button className="absolute bottom-4 left-4 flex items-center gap-2 rounded-sm border border-border bg-card/90 px-3 py-2 font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/30 hover:text-foreground">
            <Users className="h-3.5 w-3.5" />
            Participants
          </button>
        </DialogTrigger>
        <DialogContent className="bg-card/95 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="font-display text-sm uppercase tracking-[0.2em]">
              Participants
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            {activeUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 rounded-sm border border-border/50 bg-background/50 p-3"
              >
                <div className="h-2 w-2 rounded-full bg-primary node-pulse" />
                <div>
                  <p className="font-display text-xs uppercase tracking-[0.15em] text-foreground">
                    {user.name}
                  </p>
                  <p className="font-body text-[10px] text-muted-foreground">
                    {user.country}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorldMap;
