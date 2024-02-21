import Image from "next/image";
import { Inter } from "next/font/google";
import Backward from "../../public/icons/backward";
import Play from "../../public/icons/play";
import Forward from "../../public/icons/forward";
import Stop from "../../public/icons/stop";
import Volume from "../../public/icons/volume";
import { useEffect, useRef, useState } from "react";
import Pause from "../../public/icons/pause";
import { convertSecToStandardVideoDate } from "../../utils";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlayed, setIsPlayed] = useState(false);
  const [videoTime, setVideoTime] = useState("0:00");
  const [mounted, setMounted] = useState(false);
  const videoPlayedTimeRef = useRef<HTMLSpanElement | null>(null);

  console.log();

  const playVideoFunc = () => {
    console.dir(videoRef.current);
    setIsPlayed((prev) => !prev);
  };

  const videoTimeUpdateFunc = () => {
    if (!videoPlayedTimeRef.current && !videoRef.current) return;
    videoPlayedTimeRef.current!.textContent = convertSecToStandardVideoDate(
      videoRef.current!.currentTime
    );
    // console.log(videoRef.current.currentTime);
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

  const lol = () => {
    console.log(
      "eeee",
      convertSecToStandardVideoDate(videoRef.current!.currentTime)
    );
  };

  useEffect(() => {
    setMounted(true);

    if (videoRef.current && !mounted) {
      console.log("ddhdh");

      const value = convertSecToStandardVideoDate(videoRef.current.duration);
      console.log(videoRef.current.duration);

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

  return (
    <div className="border-[10px] h-[100vh] flex justify-center items-center">
      <div>
        <div className="max-w-[500px] h-[300px] bg-black">
          <video
            onEnded={endVideo}
            onTimeUpdate={videoTimeUpdateFunc}
            onPause={lol}
            controls
            ref={videoRef}
            className="h-[100%] w-[100%]"
          >
            <source src="/clip/lol.mp4" type="video/mp4" />
            <source src="/clip/lol.webm" type="video/webm" />
          </video>
        </div>

        <div className="flex flex-col space-y-[1rem] border-[1px] px-[0.5rem] py-[1rem] items-center justify-between md:flex-row md:space-y-0">
          <div aria-label="video controls" className="flex space-x-[1rem]">
            <button>
              <Backward />
            </button>
            <button
              onClick={playVideoFunc}
              title={isPlayed ? "pause video" : "play video"}
            >
              {isPlayed ? <Pause /> : <Play />}
            </button>
            <button>
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
            <div
              aria-label="video direction"
              className="bg-[#D8D8D8] overflow-hidden rounded-[1rem] h-[10px] w-[150px]"
            >
              <div
                role="progressbar"
                className="bg-[#F5A623] w-[50%] h-[100%]"
              ></div>
            </div>
            <span className="text-[0.8rem]">
              <span ref={videoPlayedTimeRef}>10:35</span>
              <span> / {videoTime}</span>
            </span>
          </div>

          <div>
            <progress></progress>
            <input type="range" name="" id="" />
          </div>

          <div className="flex items-center space-x-[0.5rem]">
            <Volume />
            <div className="overflow-hidden rounded-[1rem] h-[5px] w-[50px] bg-[#D8D8D8]">
              <div
                role="progressbar"
                className="bg-[#F5A623] h-[100%] w-[20%]"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
