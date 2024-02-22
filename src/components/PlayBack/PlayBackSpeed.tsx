import { ChangeEventHandler, FC } from "react";
import { VideoRefProps } from "../../../utils";

const PlayBackSpeed: FC<VideoRefProps> = ({ videoRef }) => {
  const playBackRange = [0.25, 0.5, 1, 1.25, 1.5, 2];

  const changeHandler: ChangeEventHandler<HTMLSelectElement> = (e) => {
    // range must be between 0.25 to 2
    if (
      !videoRef.current &&
      Number(e.target.value) >= 0.25 &&
      Number(e.target.value) <= 2
    )
      return;

    videoRef.current!.playbackRate = Number(e.target.value);
  };

  return (
    <select
      onChange={changeHandler}
      defaultValue="default"
      className="select select-bordered w-[120px]"
    >
      <option value="default" disabled>
        Video Speed
      </option>
      {playBackRange.map((el) => (
        <option value={el} key={el}>
          {el === 1 ? "Normal" : el + "X"}
        </option>
      ))}
    </select>
  );
};
export default PlayBackSpeed;
