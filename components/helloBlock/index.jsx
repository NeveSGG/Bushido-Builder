const HelloBlock = (react) => {
  return <h1 onClick={() => console.log("wow")}>Hello, world!</h1>;
};

const Container = (react) => {
  return (
    <div>
      child1
      <HelloBlock react={react} />
    </div>
  );
};

export default Container;
