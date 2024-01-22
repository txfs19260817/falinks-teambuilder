// Loading usually wrapped in a <Main> component
import { useRouter } from 'next/router';

const Loading = () => {
  const { basePath } = useRouter();
  return (
    <div className="mx-auto h-[87vh] w-1/4">
      <figure>
        <img src={`${basePath}/assets/images/loading.gif`} alt="Loading" width={263} height={174} className="mx-auto" />
      </figure>
      <figcaption className="my-6 text-center text-2xl text-neutral">Loading......</figcaption>
    </div>
  );
};

export default Loading;
