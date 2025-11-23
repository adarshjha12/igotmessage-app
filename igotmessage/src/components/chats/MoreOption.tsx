"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Settings, Shield } from "lucide-react";

interface PopupMenuProps {
  onClose?: () => void;
}

export default function PopupMenu({ onClose }: PopupMenuProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        transition={{ duration: 0.15 }}
        className="absolute right-0 top-11 mt-2 w-48 rounded-2xl bg-[var(--bgColor)]/80  backdrop-blur-md shadow-xl border border-[var(--borderColor)]/20  overflow-hidden z-50"
      >
        <MenuItem
          href="/dash/profile/settings"
          icon={<Settings className="w-4 h-4" />}
          label="Settings"
          onClick={onClose}
        />
        <MenuItem
          href="/privacy-policy"
          icon={<Shield className="w-4 h-4" />}
          label="Privacy Policy"
          onClick={onClose}
        />
      </motion.div>
    </AnimatePresence>
  );
}

function MenuItem({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--textColor)]  hover:bg-gray-500/60  transition"
    >
      <span >{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
