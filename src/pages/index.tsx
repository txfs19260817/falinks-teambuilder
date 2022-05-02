import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { Main } from '@/templates/Main';
import { S4 } from '@/utils/Helpers';

const Index = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      roomName: `room_${S4()}`,
    },
  });

  const gotoRoom = (data: { roomName: string }) => {
    router.push(`/room/${encodeURIComponent(data.roomName)}`);
  };

  return (
    <Main title={'Home'}>
      <div
        className="hero min-h-[88vh]"
        style={{
          backgroundImage: 'url(assets/images/hero.png)',
        }}
      >
        <div className="hero-overlay bg-opacity-75"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
            <p className="mb-5">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
            </p>
            <form
              className="flex items-center"
              onSubmit={handleSubmit((data) => {
                gotoRoom(data);
              })}
            >
              <input
                type="text"
                placeholder="Room name here"
                required={true}
                maxLength={50}
                className="input-bordered input w-full max-w-xs text-base-content"
                {...register('roomName')}
              />
              <button className="btn btn-primary">Create/Join</button>
            </form>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Index;
