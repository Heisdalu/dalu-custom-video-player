import { setup } from "../../utils";
import Home from "../pages/index";
import React from "react";
import { screen, render, waitFor, fireEvent } from "@testing-library/react";
describe("<Home />", () => {
  beforeEach(() => {
    Object.defineProperty(HTMLMediaElement.prototype, "paused", {
      get: () => true,
    });

    Object.defineProperty(HTMLMediaElement.prototype, "currentTime", {
      get: () => 0,
    });
    Object.defineProperty(HTMLMediaElement.prototype, "duration", {
      get: () => 0,
    });

    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("video tag should be present", () => {
    render(<Home />);
    const videoElem = screen.getByTestId("video");
    expect(videoElem).toBeInTheDocument();
  });

  test("should play the video when play button is clicked", async () => {
    const { user } = setup(<Home />);
    const videoPlayMock = jest
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockImplementation();

    const playBtn = screen.getByRole("button", { name: /play/i });
    const custom_playtip = screen.getByTestId("custom_playtip");

    // must have play or playvideo in it
    expect(playBtn).toBeInTheDocument();
    expect(custom_playtip.dataset.tip).toBe("play video");

    await user.click(playBtn);

    await waitFor(() => {
      expect(videoPlayMock).toHaveBeenCalledTimes(1);
    });

    //clicked play btn now has arial-label of pause to show
    expect(screen.getByRole("button", { name: /pause/i })).toBeInTheDocument();
    expect(custom_playtip.dataset.tip).toBe("pause video");
  });

  test("should pause the video when play/pause button is clicked twice", async () => {
    const { user } = setup(<Home />);
    const videoPauseMock = jest
      .spyOn(HTMLMediaElement.prototype, "pause")
      .mockImplementation();

    const playBtn = screen.getByRole("button", { name: /play/i });
    const custom_playtip = screen.getByTestId("custom_playtip");

    // play video
    await user.click(playBtn);

    // edit HTMLMediaElement.prototype.paused to false since JSDOM doesn't play in node environs
    /*  HTMLMediaElement.prototype.paused returns false by default.. then tweak it this condition
    if (!isPlayed && videoRef.current && !videoRef.current.paused) to trigger
    */
    Object.defineProperty(HTMLMediaElement.prototype, "paused", {
      get: () => false,
    });

    // pause video
    await user.click(screen.getByRole("button", { name: /pause/i }));

    await waitFor(() => {
      expect(videoPauseMock).toHaveBeenCalledTimes(1);
    });

    // play button should be visible
    expect(screen.getByRole("button", { name: /play/i })).toBeInTheDocument();
    expect(custom_playtip.dataset.tip).toBe("play video");
  });

  test("should pause video and set video current time to 0 when stop button is clicked", async () => {
    const { user } = setup(<Home />);

    const videoPauseMock = jest
      .spyOn(HTMLMediaElement.prototype, "pause")
      .mockImplementation();

    Object.defineProperty(HTMLMediaElement.prototype, "currentTime", {
      value: 1550,
      writable: true,
    });

    const videoElem: HTMLVideoElement = screen.getByTestId("video");
    const stopBtn = screen.getByRole("button", { name: /stop video/i });

    //inital current time set to 1550
    expect(videoElem.currentTime).toBe(1550);

    // stops video
    user.click(stopBtn);

    await waitFor(() => {
      expect(videoPauseMock).toHaveBeenCalledTimes(1);
      expect(videoElem.currentTime).toBe(0);
    });
  });

  test("should rewind video by 5 secs when rewind button is clicked and video duration is more than 5secs", async () => {
    const { user } = setup(<Home />);
    // set 10 secs
    Object.defineProperty(HTMLMediaElement.prototype, "currentTime", {
      value: 10,
      writable: true,
    });

    const videoElem: HTMLVideoElement = screen.getByTestId("video");
    const rewindBtn = screen.getByRole("button", { name: /rewind/i });
    const rewindTip = screen.getByTestId("custom_rewindtip");

    // custom tip should be present
    expect(rewindTip.dataset.tip).toBe("rewind video");
    expect(rewindTip).toHaveClass("tooltip");

    await user.click(rewindBtn);

    // console.log(videoElem.currentTime, "soilllllllllllllll");
    await waitFor(() => {
      // console.log(videoElem.currentTime);
      expect(videoElem.currentTime).toBe(5);
    });
  });

  test("should not rewind video when rewind button is clicked and video duration is less than 5secs", async () => {
    const { user } = setup(<Home />);
    // set to 3 secs
    Object.defineProperty(HTMLMediaElement.prototype, "currentTime", {
      value: 3,
      writable: true,
    });

    const videoElem: HTMLVideoElement = screen.getByTestId("video");
    const rewindBtn = screen.getByRole("button", { name: /rewind/i });

    await user.click(rewindBtn);

    await waitFor(() => {
      // retain previous current time
      expect(videoElem.currentTime).toBe(3);
    });
  });

  test("should forward video by 5secs when forward button is clicked and video duration is 5 secs less than video total duration", async () => {
    //e.g curent time ===  40 secs and duration === 50secs
    // forward button clicked, 40 + 5.... current time == 45secs

    const { user } = setup(<Home />);
    Object.defineProperty(HTMLMediaElement.prototype, "currentTime", {
      value: 40,
      writable: true,
    });

    Object.defineProperty(HTMLMediaElement.prototype, "duration", {
      value: 50,
      writable: true,
    });

    const videoElem: HTMLVideoElement = screen.getByTestId("video");
    const rewindBtn = screen.getByRole("button", { name: /forward/i });

    const forwardTip = screen.getByTestId("custom_forwardtip");

    // custom tip should be present
    expect(forwardTip.dataset.tip).toBe("forward video");
    expect(forwardTip).toHaveClass("tooltip");

    await user.click(rewindBtn);

    await waitFor(() => {
      expect(videoElem.currentTime).toBe(45);
    });
  });

  test("should not forward video when forward button is clicked and video duration is 5 secs greater than video total duration", async () => {
    //e.g curent time ===  47 secs and duration === 50secs
    // forward button clicked, current time == 47secs

    const { user } = setup(<Home />);
    Object.defineProperty(HTMLMediaElement.prototype, "currentTime", {
      value: 47,
      writable: true,
    });

    Object.defineProperty(HTMLMediaElement.prototype, "duration", {
      value: 50,
      writable: true,
    });

    const videoElem: HTMLVideoElement = screen.getByTestId("video");
    const rewindBtn = screen.getByRole("button", { name: /forward/i });

    await user.click(rewindBtn);

    await waitFor(() => {
      // retain current time
      expect(videoElem.currentTime).toBe(47);
    });
  });

  test("should pause the video when video ends", async () => {
    render(<Home />);

    const videoPauseMock = jest
      .spyOn(HTMLMediaElement.prototype, "pause")
      .mockImplementation();

    Object.defineProperty(HTMLMediaElement.prototype, "duration", {
      value: 50,
      writable: true,
    });

    const videoElem: HTMLVideoElement = screen.getByTestId("video");
    const playBtn = screen.getByRole("button", { name: /play/i });

    //play video
    fireEvent.click(playBtn);

    Object.defineProperty(HTMLMediaElement.prototype, "currentTime", {
      value: 50,
      writable: true,
    });

    // video.paused === false
    Object.defineProperty(HTMLMediaElement.prototype, "paused", {
      get: () => false,
    });

    //video ends
    fireEvent.ended(videoElem);

    await waitFor(() => {
      expect(videoPauseMock).toHaveBeenCalledTimes(1);
      expect(playBtn).toBeInTheDocument(); //play button is visible
      expect(screen.queryByRole("button", { name: /pause/i })).toBeNull(); //pause button is nott visible
    });
  });

  test("should have initial of 0:00 and 0:36(when video duration is 36secs) on video timestamp start and end respectively", async () => {
    // video duration is 36 secs on initial load// should be  0:36 on end time stamp
    Object.defineProperty(HTMLMediaElement.prototype, "duration", {
      value: 36,
      writable: true,
    });
    render(<Home />);

    const initalTimeStamp = screen.getByTestId("video-initial-timestamp");
    const endTimeStamp = await screen.findByTestId("video-end-timestamp");
    const videoRange: HTMLInputElement = screen.getByRole("slider", {
      name: "video slider range",
    });

    await waitFor(() => {
      expect(initalTimeStamp).toHaveTextContent("0:00");
      expect(endTimeStamp).toHaveTextContent("0:36");
      expect(videoRange).toHaveValue("0"); // video slider range must be 0
    });
  });

  test("should have 5:01 and 10:45 on video timestamp start and end respectively when video timeUpdate is triggered", async () => {
    // when videotimeUpdate is triggered, video start on 301 secs and 645 secs for duration..it could be dynmaic
    // just hardcoding

    Object.defineProperty(HTMLMediaElement.prototype, "duration", {
      value: 645,
      writable: true,
    });

    render(<Home />);

    const videoElem: HTMLVideoElement = screen.getByTestId("video");

    const initalTimeStamp = screen.getByTestId("video-initial-timestamp");
    const endTimeStamp = await screen.findByTestId("video-end-timestamp");
    const videoRange: HTMLInputElement = screen.getByRole("slider", {
      name: "video slider range",
    });

    Object.defineProperty(HTMLMediaElement.prototype, "currentTime", {
      value: 301,
      writable: true,
    });

    //timeupdate triggers on video
    fireEvent.timeUpdate(videoElem);

    await waitFor(() => {
      expect(initalTimeStamp).toHaveTextContent("5:01"); // 5:01
      expect(endTimeStamp).toHaveTextContent("10:45"); // 5:01
      expect(videoRange).toHaveValue("46.67"); // video slider range must have 46.47 as the value
    });
  });

  test("should return when htmlMedia is null", async () => {
    
  });
});
