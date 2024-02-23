import { render, screen, waitFor, act } from "@testing-library/react";
import Fullscreen from "./FullScreen";
import { setup } from "../../../utils";

describe("<Fullscreen/>", () => {
  const videoRefMock: React.RefObject<HTMLVideoElement> = {
    current: {
      requestFullscreen: jest.fn(),
    },
  } as unknown as React.RefObject<HTMLVideoElement>;

  beforeEach(() => {
    jest.restoreAllMocks;

    Object.defineProperty(document, "fullscreenElement", {
      writable: true,
      value: { tagName: "VIDEO" }, // This will make the condition true
    });
  });

  afterEach(() => {
    // Clean up after each test
    Object.defineProperty(document, "fullscreenElement", {
      writable: true,
      value: null, // Reset to original state
    });
  });

  test("fullscreen button should be present", async () => {
    render(<Fullscreen videoRef={videoRefMock} />);
    const btn = await screen.findByRole("button");

    await waitFor(() => {
      expect(btn).toBeInTheDocument();
    });
    // screen.debug();
  });

  test("fullscreen should trigger once when clicked", async () => {
    const { user } = setup(<Fullscreen videoRef={videoRefMock} />);
    const btn = screen.getByRole("button");

    user.click(btn);

    await waitFor(() => {
      expect(videoRefMock.current!.requestFullscreen).toHaveBeenCalled();
    });
  });

  test("exit fullscreen mode when enter or escape key is clicked", async () => {
    document.exitFullscreen = jest.fn();

    const { user } = setup(<Fullscreen videoRef={videoRefMock} />);

    const btn = screen.getByRole("button");

    // click btn to inital fullscreen
    user.click(btn);

    // type esc
    user.keyboard("{Escape}");

    //must be a video element
    expect(document.fullscreenElement?.tagName).toBe("VIDEO");

    await waitFor(() => {
      expect(document.exitFullscreen).toHaveBeenCalled();
    });

    // test when enter is clicked
    user.keyboard("{Enter}");

    await waitFor(() => {
      expect(document.exitFullscreen).toHaveBeenCalledTimes(2);
    });
  });
});
