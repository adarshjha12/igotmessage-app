import { useState, useEffect } from "react";

interface AvatarProps {
  firstLetter?: string;
  color?: string;
  bgColor?: string;
}

const COLORS = ["red", "green", "blue", "yellow", "purple", "orange", "teal", "gray", "indigo", "pink", "cyan", "lime"];

export default function dynamicTextAvatar(text: string) {
  const [avatar, setAvatar] = useState<AvatarProps>({});

  useEffect(() => {
    const match = text.match(/[a-zA-Z]/);
    if (match) {
      const firstLetter = match[0].toUpperCase();
      const ascii = firstLetter.toLowerCase().charCodeAt(0);
      const colorIndex = ascii % COLORS.length;
      setAvatar({
        firstLetter,
        color: COLORS[colorIndex],
        bgColor: COLORS[colorIndex] 
      });
    }
  }, [text]);

  return avatar;
}
