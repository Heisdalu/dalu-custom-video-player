import { render, screen, waitFor, act } from "@testing-library/react";
import PlayBackSpeed from "./PlayBackSpeed";
import { setup } from "../../../utils";

describe("PlaybackSpeed Component", () => {
  const videoMockRef: any = {
    current: {
      playbackRate: 1,
    },
  };

  afterEach(() => {
    //cleanup playback to inital
    videoMockRef.current.playbackRate = 1;
  });

  test("playspeed select tag should be present and has a initial value of default ", () => {
    render(<PlayBackSpeed videoRef={videoMockRef} />);
    const selectElement: HTMLSelectElement = screen.getByRole("combobox");

    expect(selectElement).toBeInTheDocument();
    // daisy ui class must be present
    expect(selectElement).toHaveClass("select select-bordered");
    expect(selectElement).toHaveValue("default");
  });
  test("playspeed select tag should have correct options", () => {
    render(<PlayBackSpeed videoRef={videoMockRef} />);
    const options = ["default", 0.25, 0.5, 1, 1.25, 1.5, 2];
    const optionsTextContextList = [
      "Video Speed",
      "0.25X",
      "0.5X",
      "Normal",
      "1.25X",
      "1.5X",
      "2X",
    ];

    const selectElement: HTMLOptionElement[] = screen.getAllByRole("option");

    //assert same length
    expect(selectElement).toHaveLength(options.length);

    // same value
    const lol = selectElement.map((optionsElement) =>
      optionsElement.value !== "default"
        ? Number(optionsElement.value)
        : optionsElement.value
    );

    const mappedValue = selectElement.map((optionsElement) =>
      optionsElement.value !== "default"
        ? Number(optionsElement.value)
        : optionsElement.value
    );
    // assert option value
    expect(mappedValue).toEqual(options);

    const mappedText = selectElement.map((optionElement) =>
      optionElement.value === "default"
        ? "Video Speed"
        : Number(optionElement.value) === 1
        ? "Normal"
        : `${optionElement.value}X`
    );

    // assert same textContext
    expect(mappedText).toEqual(optionsTextContextList);
  });

  test("playback select tag should update correctly when playback speed option is selected", async () => {
    const { user } = setup(<PlayBackSpeed videoRef={videoMockRef} />);
    const selectElement: HTMLSelectElement = await screen.findByRole(
      "combobox"
    );

    // test for 0.25 playback speed option
    user.selectOptions(selectElement, "0.25");

    await waitFor(() => {
      expect(selectElement.value).toBe("0.25");
    });

    // test for 1.5 playback speed option
    user.selectOptions(selectElement, "1.5");

    await waitFor(() => {
      expect(selectElement.value).toBe("1.5");
    });
  });

  test("playback speed rate  changes when playback select rate", async () => {
    const { user } = setup(<PlayBackSpeed videoRef={videoMockRef} />);
    const selectElem = screen.getByRole("combobox");

    user.selectOptions(selectElem, "1.5");

    await waitFor(() => {
      expect(videoMockRef.current.playbackRate).toBe(1.5);
    });
  });
});
