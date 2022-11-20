import Image from 'next/legacy/image';

// Loading usually wrapped in a <Main> component
const Loading = () => {
  return (
    <div className="mx-auto h-[87vh] w-1/4">
      <figure>
        <Image title="Loading" alt="Loading" src={'/assets/images/loading.gif'} width={263} height={174} layout="responsive" priority={true} />
      </figure>
      <figcaption className="my-6 text-center text-2xl text-neutral">Loading......</figcaption>
    </div>
  );
};

export default Loading;
