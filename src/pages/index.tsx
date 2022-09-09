import { useForm } from 'react-hook-form';

import { WorkspaceProps } from '@/components/workspace';
import { supportedProtocols } from '@/providers';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { getRandomTrainerName, S4 } from '@/utils/Helpers';

type RoomForm = WorkspaceProps & {
  userName: string;
};

const Index = () => {
  const { register, handleSubmit, setValue } = useForm<RoomForm>({
    defaultValues: {
      roomName: `room_name_${S4()}`,
      protocolName: 'WebSocket',
    },
  });

  const gotoRoom = ({ roomName, protocolName, userName }: RoomForm) => {
    localStorage.setItem('username', userName);
    // use window.open instead of next/router to disable go back
    window.open(`/room/${encodeURIComponent(roomName)}?protocol=${encodeURIComponent(protocolName)}`, '_self');
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
          <div className="max-w-lg">
            <h1 className="mb-5 text-5xl font-bold">{AppConfig.title}</h1>
            <p className="mb-5">Build the next sweeping Pokémon team with the power of collaborative</p>
            <form
              className="flex flex-col items-center justify-center"
              onSubmit={handleSubmit((data) => {
                gotoRoom(data);
              })}
            >
              <div className="form-control flex-row-reverse justify-around">
                {supportedProtocols.map((protocol) => (
                  <div
                    id="protocol-radio-group"
                    key={protocol}
                    className="tooltip tooltip-info flex"
                    data-tip={`${protocol} Communication Protocol. Try another if one is not working.`}
                  >
                    <label className="badge-accent badge flex items-center" htmlFor={protocol}>
                      {protocol}
                    </label>
                    <input {...register('protocolName')} className="radio-accent radio" type="radio" id={protocol} key={protocol} value={protocol} />
                  </div>
                ))}
              </div>
              <div className="form-control tooltip tooltip-bottom tooltip-info flex-row" data-tip="Will be used in authors field">
                <input
                  type="text"
                  placeholder="Author Name"
                  required={true}
                  maxLength={50}
                  className="input-bordered input rounded-r-none text-base-content"
                  {...register('userName', { required: true })}
                />
                <button
                  className="btn rounded-l-none"
                  role="button"
                  type="button"
                  onClick={() => {
                    setValue('userName', getRandomTrainerName());
                  }}
                >
                  Draw a name
                </button>
              </div>
              <div className="form-control tooltip tooltip-bottom tooltip-info flex-row" data-tip="Give the room a name to create/join">
                <input
                  type="text"
                  placeholder="Room name here"
                  required={true}
                  maxLength={50}
                  className="input-bordered input rounded-r-none text-base-content"
                  {...register('roomName', { required: true })}
                />
                <button className="btn btn-primary rounded-l-none" role="button" type="submit">
                  Create / Join
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Index;
