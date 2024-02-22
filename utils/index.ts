import { RefObject } from "react";

export const convertSecToStandardVideoDate = (totalSecs: number): string => {
  if (!totalSecs) return "0:00";

  // if totalSecs is over 3600 === render in hours format e.g 02:01:56
  if (totalSecs >= 3600) {
    const hrs = totalSecs / 3600;
    const rem_hrs = totalSecs % 3600;
    const mins = rem_hrs / 60;
    const secs = rem_hrs % 60;
    console.log(hrs, mins, secs, totalSecs);

    return `${Math.floor(hrs).toString()}:${Math.floor(mins)
      .toString()
      .padStart(2, "0")}:${Math.floor(secs).toString().padStart(2, "0")}`;
  }
  

  //render in minutes e.g 35:01
  const durationMaths = `${Math.floor(totalSecs / 60)}:${Math.floor(
    totalSecs % 60
  )
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
