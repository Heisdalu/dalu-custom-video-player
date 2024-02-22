import { Inter } from "next/font/google";
import Backward from "../../public/icons/backward";
import Play from "../../public/icons/play";
import Forward from "../../public/icons/forward";
import Stop from "../../public/icons/stop";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import Pause from "../../public/icons/pause";
import { convertSecToStandardVideoDate } from "../../utils";
import VolumeSection from "@/components/Volume/VolumeSection";
import FullScreen from "@/components/FullScreen/FullScreen";

const inter = Inter({ subsets: ["latin"] });
/// todo--correct video format or hours also

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlayed, setIsPlayed] = useState(false);
  const [videoTime, setVideoTime] = useState("0:00");
  const [mounted, setMounted] = useState(false);
  const videoPlayedTimeRef = useRef<HTMLSpanElement | null>(null);
  const rangeVideoTimeRef = useRef<HTMLInputElement | null>(null);

  const playVideoFunc = () => {
    setIsPlayed((prev) => !prev);
  };

  const videoTimeUpdateFunc = () => {
    if (
      !videoPlayedTimeRef.current &&
      !videoRef.current &&
      !rangeVideoTimeRef.current
    )
      return;

    videoPlayedTimeRef.current!.textContent = convertSecToStandardVideoDate(
      videoRef.current!.currentTime
    );

    rangeVideoTimeRef.current!.value = `${(
      (videoRef.current!.currentTime / videoRef.current!.duration) *
      100
    ).toFixed(2)}`;
  };

  const videoDurationFunc: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (videoRef.current) {
      // get current time from range value slider..
      const value = Number(
        ((Number(e.target.value) * videoRef.current.duration) / 100).toFixed(2)
      );
      // assign new video stamp when dragged
      videoRef.current.currentTime = value;
      videoPlayedTimeRef.current!.textContent =
        convertSecToStandardVideoDate(value);
      console.log(convertSecToStandardVideoDate(value));
    }
  };

  const endVideo = () => {
    setIsPlayed(false);
  };

  const stopVideoFunc = () => {
    if (!videoRef.current) return;
    setIsPlayed(false);
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  };

  const toggleFullScreenShot = () => {};

  useEffect(() => {
    setMounted(true);

    if (videoRef.current && !mounted && rangeVideoTimeRef.current) {
      console.log("ddhdh");
      rangeVideoTimeRef.current.value = "0";
      const value = convertSecToStandardVideoDate(videoRef.current.duration);
      setVideoTime(value);
    }

    if (isPlayed && videoRef.current && videoRef.current?.paused) {
      videoRef.current.play();
    }

    if (!isPlayed && videoRef.current && !videoRef.current.paused) {
      console.log(videoRef.current.currentTime);
      videoRef.current.pause();
    }
  }, [isPlayed, mounted]);

  console.log(videoRef.current?.duration);

  return (
    <div className="px-[1rem] h-[100vh] flex justify-center items-center">
      <div>
        <div className="max-w-[600px] h-[300px] bg-black">
          <video
            controls
            onEnded={endVideo}
            onTimeUpdate={videoTimeUpdateFunc}
            ref={videoRef}
            className="h-[100%] w-[100%]"
          >
            <source src="/clip/lol.mp4" type="video/mp4" />
            <source src="/clip/lol.webm" type="video/webm" />
          </video>
        </div>

        <div className="md:space-x-[1rem] flex flex-col space-y-[1rem] border-[1px] px-[0.5rem] py-[1rem] items-center justify-between md:flex-row md:space-y-0">
          <div aria-label="video controls" className="flex space-x-[1rem]">
            <div className="tooltip" data-tip="rewind video">
              <button>
                <Backward />
              </button>
            </div>
            <div
              className="tooltip"
              data-tip={isPlayed ? "pause video" : "play video"}
            >
              <button onClick={playVideoFunc}>
                {isPlayed ? <Pause /> : <Play />}
              </button>
            </div>
            <div className="tooltip" data-tip="forward video">
              <button>
                <Forward />
              </button>
            </div>

            <div className="tooltip" data-tip="stop video">
              <button aria-label="stop video" onClick={stopVideoFunc}>
                <Stop />
              </button>
            </div>
          </div>

          <div className="items-center flex space-x-[0.5rem]">
            <input
              type="range"
              step={0.01}
              ref={rangeVideoTimeRef}
              min={0}
              onChange={videoDurationFunc}
              max={100}
              className=" w-[130px] range range-xs range-warning"
            />
            <span className="text-[0.8rem]">
              <span ref={videoPlayedTimeRef}>0:00</span>
              <span> / {videoTime}</span>
            </span>
          </div>

          <VolumeSection videoRef={videoRef} />
          <FullScreen videoref={videoRef} />
          <button>1.5X</button>
        </div>
      </div>
    </div>
  );
}
