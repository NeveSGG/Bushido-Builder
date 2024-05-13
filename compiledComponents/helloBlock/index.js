const HelloBlock = (react) => {
  return /*#__PURE__*/ react.createElement(
    "h1",
    {
      onClick: () => console.log("wow"),
    },
    "Hello, world!"
  );
};
const Container = (react) => {
  return /*#__PURE__*/ react.createElement(
    "div",
    null,
    "child1",
    /*#__PURE__*/ react.createElement(() => HelloBlock(react), null)
  );
};
export default Container;
