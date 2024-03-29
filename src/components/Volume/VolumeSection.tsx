import {
  useState,
  MouseEventHandler,
  ChangeEventHandler,
  FC,
  useEffect,
  useRef,
} from "react";
import Volume from "../../../public/icons/volume";
import { VideoRefProps } from "../../../utils";

const VolumeSection: FC<VideoRefProps> = ({ videoRef }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volumeCount, setVolumeCount] = useState(1);
  const volumeRangeRef = useRef<HTMLInputElement | null>(null);

  let timeout: NodeJS.Timeout;

  const volumeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    clearTimeout(timeout);
    if (
      !videoRef.current &&
      Number(e.target.value) >= 0 &&
      Number(e.target.value) <= 1
    )
      return;

    videoRef.current!.volume = Number(e.target.value);
    timeout = setTimeout(() => {
      if (Number(e.target.value) === 0) {
        setIsMuted(true);
        setVolumeCount(0);
      } else {
        setIsMuted(false);
      }
    }, 50);
  };

  const muteHandler: MouseEventHandler<HTMLButtonElement> = () => {
    if (!videoRef.current) return;
    setVolumeCount(videoRef.current.volume);
    // console.log(volumeCount, isMuted);

    // volumecount is taken to 0 and isMuted to true.. don't toggle
    if (volumeCount === 0 && isMuted) return;
    setIsMuted((prev) => !prev);
  };

  useEffect(() => {
    //inital render,  input range value to be 1
    if (volumeRangeRef.current) {
      volumeRangeRef.current.value = `${volumeCount}`;
    }
  }, []);

  useEffect(() => {
    //when muted is clicked, mute the volume
    if (!videoRef.current?.muted && isMuted && volumeRangeRef.current) {
      videoRef.current!.muted = true;
      volumeRangeRef.current.value = "0";
    }

    // when volume is unmuted when it was previously muted.. input the previous volume count before it was muted
    if (videoRef.current?.muted && !isMuted && volumeRangeRef.current) {
      videoRef.current!.muted = false;
      volumeRangeRef.current.value = `${volumeCount}`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMuted]);

  return (
    <div className="flex items-center space-x-[0.5rem]">
      <div
        className="tooltip"
        data-testid="custom_tooltip"
        data-tip={isMuted ? "muted" : "mute"}
      >
        <button className={`${isMuted && "muted"}`} onClick={muteHandler}>
          <Volume />
        </button>
      </div>
      <input
        ref={volumeRangeRef}
        aria-label="volume range"
        type="range"
        onChange={volumeHandler}
        min={0}
        step={0.01}
        max={1}
        className="range range-xs w-[50px] range-warning"
      />
    </div>
  );
};
export default VolumeSection;
