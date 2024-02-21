import Image from "next/image";
import { Inter } from "next/font/google";
import Backward from "../../public/icons/backward";
import Play from "../../public/icons/play";
import Forward from "../../public/icons/forward";
import Stop from "../../public/icons/stop";
import Volume from "../../public/icons/volume";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import Pause from "../../public/icons/pause";
import { convertSecToStandardVideoDate } from "../../utils";

const inter = Inter({ subsets: ["latin"] });
/// todo--correct video ormat or hours also

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
      // get current time from range value..
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

  const volumeHandler = () => {
    
  }

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
    <div className="border-[10px] h-[100vh] flex justify-center items-center">
      <div>
        <div className="max-w-[500px] h-[300px] bg-black">
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
            <button title="rewind video">
              <Backward />
            </button>
            <button
              onClick={playVideoFunc}
              title={isPlayed ? "pause video" : "play video"}
            >
              {isPlayed ? <Pause /> : <Play />}
            </button>
            <button title="forward video">
              <Forward />
            </button>
            <button
              aria-label="stop video"
              onClick={stopVideoFunc}
              title="stop video"
            >
              <Stop />
            </button>
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

          <div className="flex items-center space-x-[0.5rem]">
            <Volume />
            <input
              type="range"
              onChange={volumeHandler}
              min={0}
              max={100}
              className="range range-xs w-[50px] range-warning"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
