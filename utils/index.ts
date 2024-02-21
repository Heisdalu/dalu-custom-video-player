export const convertSecToStandardVideoDate = (secs: number): string => {
  if (!secs) return "0:00";
  // not done yet
  const durationMaths = `${Math.floor(secs / 60)}:${Math.floor(secs % 60)
    .toString()
    .padStart(2, "0")}`;

  return durationMaths;
};
