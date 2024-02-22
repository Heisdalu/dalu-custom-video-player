import { RefObject } from "react";

export const convertSecToStandardVideoDate = (secs: number): string => {
  if (!secs) return "0:00";
  // not done yet
  const durationMaths = `${Math.floor(secs / 60)}:${Math.floor(secs % 60)
    .toString()
    .padStart(2, "0")}`;

  return durationMaths;
};

export const rangeTimeFormat = (
  currentTime: number,
  duration: number
): number | null => {
  if (!currentTime && !duration) return null;

  const value = (currentTime / duration) * 100;
  return value;
};


export interface VideoRefProps {
  videoRef: RefObject<HTMLVideoElement | null>;
}