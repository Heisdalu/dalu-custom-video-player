import { FC, RefObject, useEffect, useState } from "react";
import FullscreenIcon from "../../../public/icons/fullscreenIcon";
import { VideoRefProps } from "../../../utils";

const Fullscreen: FC<VideoRefProps> = ({ videoRef }) => {
  const [isClicked, setIsClicked] = useState(false);

  const clickHandler = () => {
    if (!videoRef.current) return;

    videoRef.current.requestFullscreen();

    setIsClicked(true);
  };

  useEffect(() => {
    const keydownFunc = (e: KeyboardEvent) => {
      // deacivate fullscreen with escape or enter key
      if (
        document.fullscreenElement?.tagName === "VIDEO" &&
        (e.key === "Enter" || e.key === "Escape")
      ) {
        document.exitFullscreen();
        setIsClicked(false);
      }
    };
    window.addEventListener("keydown", keydownFunc);

    return () => window.removeEventListener("keydown", keydownFunc);
  }, [isClicked]);

  return (
    <div
      className="tooltip"
      data-tip="press enter or escape key to exit fullscreen"
    >
      <button
        onClick={clickHandler}
        className="border-[1px] border-gray-200 active:bg-gray-600"
      >
        <FullscreenIcon />
      </button>
    </div>
  );
};
export default Fullscreen;
