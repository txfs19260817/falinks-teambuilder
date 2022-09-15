import Image from 'next/image';

import { Main } from '@/templates/Main';

const Loading = ({ title }: { title: string }) => {
  return (
    <Main title={title}>
      <div className="mx-auto w-3/5">
        <figure>
          <Image title="Loading" alt="Loading" src={'/assets/images/loading.gif'} width={296} height={220} layout="responsive" />
        </figure>
        <figcaption className="my-2 text-center text-neutral">Loading...</figcaption>
      </div>
    </Main>
  );
};

export default Loading;
