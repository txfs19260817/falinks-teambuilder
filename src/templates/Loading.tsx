import Image from 'next/image';

// Loading usually wrapped in a <Main> component
const Loading = () => {
  return (
    <div className="mx-auto h-[80vh] w-3/5">
      <figure>
        <Image title="Loading" alt="Loading" src={'/assets/images/loading.gif'} width={263} height={174} layout="responsive" priority={true} />
      </figure>
      <figcaption className="my-2 text-center text-neutral">Loading...</figcaption>
    </div>
  );
};

export default Loading;
