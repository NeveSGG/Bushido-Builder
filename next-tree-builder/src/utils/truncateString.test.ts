import truncateString from "./truncateString";

test("truncatets string from AAAAAAAAA to AAA...", () => {
  expect(truncateString("AAAAAAAAA", 3)).toBe("AAA...");
});
