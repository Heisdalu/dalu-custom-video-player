import Backward from "../../public/icons/backward";
import Play from "../../public/icons/play";
import Forward from "../../public/icons/forward";
import Stop from "../../public/icons/stop";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import Pause from "../../public/icons/pause";
import { convertSecToStandardVideoDate } from "../../utils";
import VolumeSection from "../components/Volume/VolumeSection";
import FullScreen from "../components/FullScreen/FullScreen";
import PlayBackSpeed from "../components/PlayBack/PlayBackSpeed";

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
    ) {
      return;
    }

    videoPlayedTimeRef.current!.textContent = convertSecToStandardVideoDate(
      videoRef.current!.currentTime
    );

    rangeVideoTimeRef.current!.value = `${(
      (videoRef.current!.currentTime / videoRef.current!.duration) *
      100
    ).toFixed(2)}`;
  };

  const videoDurationFunc: ChangeEventHandler<HTMLInputElement> = (e) => {
    //readystate lower than zero means no video is available

    if (videoRef.current && videoRef.current?.readyState !== 0) {
      // get current time from range value slider..
      const value = Number(
        ((Number(e.target.value) * videoRef.current.duration) / 100).toFixed(2)
      );
      // assign new video stamp when dragged
      videoRef.current.currentTime = value;
      videoPlayedTimeRef.current!.textContent =
        convertSecToStandardVideoDate(value);
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

  const rewindVideo = () => {
    //  rewind video by 5 secs
    // do not rewind when video current time is less than 5 secs
    // rewind when when it is above 5 secs
    if (!videoRef.current || videoRef.current!?.currentTime < 5) return;

    videoRef.current!.currentTime = videoRef.current!.currentTime - 5;
  };
  const forwardVideo = () => {
    //  forward video by 5 secs
    // do not forward when video current time + 5 secs exceed video duration
    // forward video current time  + 5 secs is less than video duration

    if (
      !videoRef.current ||
      videoRef.current!?.currentTime + 5 > videoRef.current.duration
    )
      return;

    videoRef.current!.currentTime = videoRef.current!.currentTime + 5;
  };

  useEffect(() => {
    setMounted(true);

    if (videoRef.current && !mounted && rangeVideoTimeRef.current) {
      rangeVideoTimeRef.current.value = "0";
      const value = convertSecToStandardVideoDate(videoRef.current.duration);
      setVideoTime(value);
    }

    if (isPlayed && videoRef.current && videoRef.current?.paused) {
      videoRef.current.play();
    }

    if (!isPlayed && videoRef.current && !videoRef.current.paused) {

      videoRef.current.pause();
    }
  }, [isPlayed, mounted]);


  return (
    <div className={`px-[1rem] h-[100vh] flex justify-center items-center`}>
      <div className="flex flex-col items-center">
        <div className="max-w-[600px] h-[300px] bg-black w-[100%]">
          <video
            onEnded={endVideo}
            data-testid="video"
            onTimeUpdate={videoTimeUpdateFunc}
            ref={videoRef}
            className="h-[100%] w-[100%]"
          >
            <source src="/clip/rabbit.mp4" type="video/mp4" />
            <source src="/clip/rabbit.webm" type="video/webm" />
          </video>
        </div>

        <div className="md:space-x-[1rem] flex flex-col space-y-[1rem] border-[1px] px-[0.5rem] py-[1rem] items-center justify-between md:flex-row md:space-y-0">
          <div aria-label="video controls" className="flex space-x-[1rem]">
            <div
              className="tooltip"
              data-tip="rewind video"
              data-testid="custom_rewindtip"
            >
              <button onClick={rewindVideo} aria-label="rewind">
                <Backward />
              </button>
            </div>
            <div
              className="tooltip"
              data-testid="custom_playtip"
              data-tip={isPlayed ? "pause video" : "play video"}
            >
              <button
                onClick={playVideoFunc}
                aria-label={`${isPlayed ? "Pause" : "Play"}`}
              >
                {isPlayed ? <Pause /> : <Play />}
              </button>
            </div>
            <div
              className="tooltip"
              data-tip="forward video"
              data-testid="custom_forwardtip"
            >
              <button onClick={forwardVideo} aria-label="forward">
                <Forward />
              </button>
            </div>

            <div
              className="tooltip"
              data-tip="stop video"
              data-testid="custom_stoptip"
            >
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
              aria-label="video slider range"
              min={0}
              onChange={videoDurationFunc}
              max={100}
              className=" w-[130px] range range-xs range-warning"
            />
            <span className="text-[0.8rem]">
              <span
                data-testid="video-initial-timestamp"
                ref={videoPlayedTimeRef}
              >
                0:00
              </span>
              <span>
                {" "}
                / <span data-testid="video-end-timestamp">{videoTime}</span>
              </span>
            </span>
          </div>

          <VolumeSection videoRef={videoRef} />
          <FullScreen videoRef={videoRef} />
          <PlayBackSpeed videoRef={videoRef} />
        </div>
      </div>
    </div>
  );
}
