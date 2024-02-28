import { convertSecToStandardVideoDate, setup } from ".";

describe("convertSecToStandardVideoDate", () => {
  test("should return 0:00 when totalSecs is not a number or less than equal to zero", () => {
    const totalSecs = null;
    const totalSecs1 = false;
    const totalSecs2 = 0;
    //@ts-ignore
    expect(convertSecToStandardVideoDate(totalSecs)).toBe("0:00");
    //@ts-ignore
    expect(convertSecToStandardVideoDate(totalSecs1)).toBe("0:00");
    //@ts-ignore
    expect(convertSecToStandardVideoDate(totalSecs2)).toBe("0:00");
  });

  test("should return 1:00 and 0:56 when totalSecs is 60secs and 56s", () => {
    const totalSecs = 60;
    const totalSecs56 = 56;
    expect(convertSecToStandardVideoDate(totalSecs)).toBe("1:00");
    expect(convertSecToStandardVideoDate(totalSecs56)).toBe("0:56");
  });

  test("should return 24:00:00 and 23:59:59 when totalSecs is 86400secs and 86399 respectively", () => {
    const totalSecs = 86400;
    const totalSecs1 = 86399;
    expect(convertSecToStandardVideoDate(totalSecs)).toBe("24:00:00");
    expect(convertSecToStandardVideoDate(totalSecs1)).toBe("23:59:59");
  });

  test("should return 36:51 and 6:51 when totalsecs is 2211.23 and 411 respectively", () => {
    const totalSecs = 2211.23;
    const totalSecs1 = 411;
    expect(convertSecToStandardVideoDate(totalSecs)).toBe("36:51");
    expect(convertSecToStandardVideoDate(totalSecs1)).toBe("6:51");
  });

  test("should return 2:00:05 and 59:59 when totalsecs is 7205 and 3599 respectively", () => {
    const totalSecs = 7205;
    const totalSecs1 = 3599;
    expect(convertSecToStandardVideoDate(totalSecs)).toBe("2:00:05");
    expect(convertSecToStandardVideoDate(totalSecs1)).toBe("59:59");
  });
});

describe("setup", () => {
  test("should render jsx element properly ", () => {
    const jsx = <div>hello divine</div>;

    const result = setup(jsx);

    expect(result).toHaveProperty("getByRole");
    expect(result).toHaveProperty("user");
    expect(result).toHaveProperty("findByRole");
    expect(result).toHaveProperty("queryByRole");
  });
});
