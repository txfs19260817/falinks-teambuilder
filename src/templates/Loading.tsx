import Image from 'next/image';

import { Main } from '@/templates/Main';

const Loading = ({ title }: { title: string }) => {
  return (
    <Main title={title}>
      <div className="mx-auto h-[80vh] w-3/5">
        <figure className="">
          <Image title="Loading" alt="Loading" src={'/assets/images/loading.gif'} width={263} height={174} layout="responsive" priority={true} />
        </figure>
        <figcaption className="my-2 text-center text-neutral">Loading...</figcaption>
      </div>
    </Main>
  );
};

export default Loading;
