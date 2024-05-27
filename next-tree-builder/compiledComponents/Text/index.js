const Container = (react, textAlignment, text) => {
  return /*#__PURE__*/ react.createElement(
    "p",
    {
      style: {
        textAlign: textAlignment,
        flex: "1 1 100%",
      },
    },
    text
  );
};
export default Container;
