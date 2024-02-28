import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import VolumeSection from "./VolumeSection";
import { setup } from "../../../utils";

describe("VolumeSection Component", () => {
  let videoMockRef: any;

  beforeEach(() => {
    videoMockRef = {
      current: {
        volume: 1,
        muted: false,
      },
    };
  });

  test("volume range should have an initial of 1, min of 0, max of 1 and step of 0.01", () => {
    render(<VolumeSection videoRef={videoMockRef} />);
    const volumeRange: HTMLInputElement = screen.getByRole("slider");

    expect(volumeRange.value).toBe("1");
    expect(volumeRange.min).toBe("0");
    expect(volumeRange.max).toBe("1");
    expect(volumeRange.step).toBe("0.01");
  });

  test("mute button should be present and custom tooltip should have initial of mute", () => {
    render(<VolumeSection videoRef={videoMockRef} />);

    const mutedBtn = screen.getByRole("button");
    const tooltip = screen.getByTestId("custom_tooltip");

    expect(mutedBtn).toBeInTheDocument();
    expect(tooltip.dataset.tip).toBe("mute");
    expect(mutedBtn).not.toHaveClass("muted");
  });

  test("volume range slider should update correctly when it changes", () => {
    render(<VolumeSection videoRef={videoMockRef} />);
    const volumeRangeSlider: HTMLInputElement = screen.getByRole("slider");
    const mutedBtn = screen.getByRole("button");
    const tooltip = screen.getByTestId("custom_tooltip");

    fireEvent.change(volumeRangeSlider, { target: { value: 0.5 } });

    expect(volumeRangeSlider).toHaveValue("0.5");
    expect(videoMockRef.current.volume).toBe(0.5);
    // since not muted.. should remain the same
    expect(tooltip.dataset.tip).toBe("mute");
    expect(mutedBtn).not.toHaveClass("muted");
  });

  test("volume is muted when slider changes to zero", async () => {
    render(<VolumeSection videoRef={videoMockRef} />);
    const volumeRangeSlider: HTMLInputElement = screen.getByRole("slider");
    const mutedBtn = screen.getByRole("button");
    const tooltip = screen.getByTestId("custom_tooltip");

    fireEvent.change(volumeRangeSlider, { target: { value: 0 } });

    expect(volumeRangeSlider).toHaveValue("0");
    expect(videoMockRef.current.volume).toBe(0);

    await waitFor(
      () => {
        expect(tooltip.dataset.tip).toBe("muted");
      },
      { timeout: 1000 }
    );

    expect(mutedBtn).toHaveClass("muted");
  });

  test("return the initial of 1 when volume range slider changes to an invalid value", () => {
    // valid values ranges from  0 to 1
    render(<VolumeSection videoRef={videoMockRef} />);
    const volumeRangeSlider: HTMLInputElement = screen.getByRole("slider");

    // changes to an invalid value of 3
    fireEvent.change(volumeRangeSlider, { target: { value: 3 } });

    // default back to the initial
    expect(videoMockRef.current.volume).toBe(1);
  });

  test("sets volume to muted and slider value to 0 when mute button is clicked", async () => {
    const { user } = setup(<VolumeSection videoRef={videoMockRef} />);

    const volumeRangeSlider: HTMLInputElement = screen.getByRole("slider");
    const muteBtn = screen.getByRole("button");
    const mutedBtn = screen.getByRole("button");
    const tooltip = screen.getByTestId("custom_tooltip");

    // must have initial of 1
    expect(videoMockRef.current.volume).toBe(1);
    expect(volumeRangeSlider).toHaveValue("1");

    user.click(muteBtn);

    // when volume is muted and slider value chnages to zero but volume retains the same as 1 cuz it was at 1 before it was muted...
    await waitFor(() => {
      expect(videoMockRef.current.muted).toBe(true);
    });

    expect(videoMockRef.current.volume).toBe(1);
    expect(volumeRangeSlider).toHaveValue("0");
    expect(tooltip.dataset.tip).toBe("muted");
    expect(mutedBtn).toHaveClass("muted");
  });

  test("sets volume to unmuted and slider value to default(1) or to where it was changed(0.01 - 1) when mute button is clicked twice", async () => {
    //e.g when volume is muted when button is clicked and unmuted when button is clicked again

    render(<VolumeSection videoRef={videoMockRef} />);
    const volumeRangeSlider: HTMLInputElement = screen.getByRole("slider");
    const muteBtn = screen.getByRole("button");
     const mutedBtn = screen.getByRole("button");
     const tooltip = screen.getByTestId("custom_tooltip");

    // slider value should be 0.7
    fireEvent.change(volumeRangeSlider, { target: { value: 0.7 } });

    // double click muteBtn to unmuted volume
    fireEvent.click(muteBtn);

    //click to mute
    await waitFor(() => {
      expect(videoMockRef.current.muted).toBe(true);
      expect(volumeRangeSlider).toHaveValue("0");
    });

    expect(tooltip.dataset.tip).toBe("muted");
    expect(mutedBtn).toHaveClass("muted");

    // click again to unmute
    fireEvent.click(muteBtn);

    // when button is clicked twice, it returns muted as false and return slider to the previous value and volume is also the previous value (0.7)

    await waitFor(() => {
      expect(videoMockRef.current.muted).toBe(false);
    });

    expect(volumeRangeSlider).toHaveValue("0.7");
    expect(videoMockRef.current.volume).toBe(0.7);
    expect(tooltip.dataset.tip).toBe("mute");
    expect(mutedBtn).not.toHaveClass("muted");
  });
});


