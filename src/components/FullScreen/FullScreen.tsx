import { FC, RefObject, useEffect, useState } from "react";
import FullscreenIcon from "../../../public/icons/fullscreenIcon";

interface Props {
  videoref: RefObject<HTMLVideoElement | null>;
}

const Fullscreen: FC<Props> = ({ videoref }) => {
  const [isClicked, setIsClicked] = useState(false);

  const clickHandler = () => {
    if (!videoref.current) return;

    videoref.current.requestFullscreen();

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
    <button
      title="press enter or escape key to exit fullscreen
      "
      onClick={clickHandler}
      className="active:bg-gray-600"
    >
      <FullscreenIcon />
    </button>
  );
};
export default Fullscreen;
