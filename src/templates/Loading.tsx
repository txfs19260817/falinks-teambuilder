// Loading usually wrapped in a <Main> component
const Loading = () => {
  return (
    <div className="mx-auto h-[87vh] w-1/4">
      <figure>
        <img
          src="https://cdn.staticaly.com/gh/txfs19260817/falinks-teambuilder-assets@master/loading/loading.gif"
          alt="Loading"
          width={263}
          height={174}
          className="mx-auto"
        />
      </figure>
      <figcaption className="my-6 text-center text-2xl text-neutral">Loading......</figcaption>
    </div>
  );
};

export default Loading;
