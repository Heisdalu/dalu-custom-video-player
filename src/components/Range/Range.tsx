const Range = () => {
  return (
    <input
      type="range"
      min={0}
      max={100}
      className="range range-sm w-[100px] range-warning"
    />
  );
};
export default Range;
