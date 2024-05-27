const Container = (react, textAlignment, text) => {
  return /*#__PURE__*/ react.createElement(
    "p",
    {
      style: {
        textAlign: textAlignment,
      },
    },
    text
  );
};
export default Container;
