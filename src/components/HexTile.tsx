import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { useState } from "react";

export type HexTileColor =
  | "blue" | "purple" | "green" | "amber" | "red"
  | "cyan" | "rose" | "indigo" | "teal" | "fuchsia";

const COLOR_GRADIENTS: Record<HexTileColor, string> = {
  blue: "from-blue-500 to-blue-700",
  purple: "from-violet-500 to-violet-700",
  green: "from-emerald-500 to-emerald-700",
  amber: "from-amber-500 to-orange-600",
  red: "from-rose-500 to-rose-700",
  cyan: "from-cyan-500 to-cyan-700",
  rose: "from-pink-500 to-rose-700",
  indigo: "from-indigo-500 to-indigo-700",
  teal: "from-teal-500 to-teal-700",
  fuchsia: "from-fuchsia-500 to-fuchsia-700",
};

interface HexTileProps {
  index: number;
  title: string;
  subtitle?: string;
  color: HexTileColor;
  Icon?: React.ComponentType<{ size?: number; className?: string }>;
  status?: "unread" | "read" | "locked";
  onClick: () => void;
}

export default function HexTile({ index, title, subtitle, color, Icon, status = "unread", onClick }: HexTileProps) {
  const isLocked = status === "locked";
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={isLocked ? undefined : onClick}
      onHoverStart={() => !isLocked && setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={isLocked ? undefined : { scale: 1.1, y: -5 }}
      whileTap={isLocked ? undefined : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 280, damping: 16 }}
      disabled={isLocked}
      className={`hex-tile relative w-full aspect-[1/1.15] bg-gradient-to-br ${COLOR_GRADIENTS[color]} text-white group ${isLocked ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} ${hovered ? "z-20" : ""}`}
      style={{
        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        filter: "drop-shadow(0 6px 12px rgba(15,23,42,0.18))",
        transition: "filter 260ms ease-out",
      }}
      aria-label={`קטע ${index + 1}: ${title}`}
    >
      <motion.div
        animate={{ opacity: hovered ? 1 : 0.7 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/15 pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.55), transparent 55%)" }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at center, rgba(255,255,255,0.22), transparent 75%)" }}
      />

      <span className="absolute top-[18%] left-[18%] text-[2rem] font-black opacity-15 select-none">
        {index + 1}
      </span>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        {Icon && (
          <motion.div
            animate={{ scale: hovered ? 1.15 : 1, rotate: hovered ? -4 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="mb-1.5 opacity-90"
          >
            <Icon size={26} className="text-white" />
          </motion.div>
        )}
        <h4 className="text-[13px] sm:text-sm font-extrabold leading-tight line-clamp-3 px-2">
          {title}
        </h4>
        {subtitle && (
          <p className="text-[10px] mt-1 opacity-80 line-clamp-2 max-w-[80%]">{subtitle}</p>
        )}
      </div>

      {status === "read" && (
        <div className="absolute bottom-[18%] right-[18%] w-6 h-6 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center shadow">
          <Check size={12} className="text-white" strokeWidth={3} />
        </div>
      )}
      {status === "locked" && (
        <div className="absolute bottom-[20%] right-[20%]">
          <Lock size={14} className="text-white/80" />
        </div>
      )}
    </motion.button>
  );
}
