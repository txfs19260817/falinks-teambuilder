import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { WorkspaceProps } from '@/components/workspace';
import { PokePaste } from '@/models/PokePaste';
import { supportedProtocols } from '@/providers';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { getRandomTrainerName, S4 } from '@/utils/Helpers';

type RoomForm = WorkspaceProps & {
  userName: string;
  pokePasteUrl?: string;
};

const Index = () => {
  const { register, handleSubmit, setValue } = useForm<RoomForm>({
    defaultValues: {
      roomName: `room_name_${S4()}${S4()}`,
      protocolName: 'WebSocket',
    },
  });

  const gotoRoom = ({ roomName, protocolName, userName, pokePasteUrl }: RoomForm) => {
    localStorage.setItem('username', userName);
    // use window.open instead of next/router to disable go back
    const targetRoomRoute = `/room/${encodeURIComponent(roomName)}?protocol=${encodeURIComponent(protocolName)}${
      pokePasteUrl && PokePaste.isValidPokePasteURL(pokePasteUrl) ? `&pokepaste=${encodeURIComponent(pokePasteUrl)}` : ''
    }`;
    window.open(targetRoomRoute, '_self');
  };

  useEffect(() => {
    setValue('userName', localStorage.getItem('username') || '');
  }, []);

  return (
    <Main title={'Home'}>
      <div
        className="hero min-h-[88vh]"
        style={{
          backgroundImage: 'url(assets/images/hero.jpg)',
        }}
      >
        <div className="hero-overlay bg-opacity-75"></div>
        <div className="hero-content flex-col text-neutral-content lg:flex-row">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">{AppConfig.title}</h1>
            <p className="py-6">Build the next sweeping Pokémon team with the power of collaborative </p>
          </div>
          <div className="card w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
            <form
              className="card-body"
              onSubmit={handleSubmit((data) => {
                gotoRoom(data);
              })}
            >
              <div className="form-control">
                <label className="label" htmlFor={'userName'}>
                  <span className="label-text after:text-error after:content-['_*']">Author Name</span>
                </label>
                <div className="flex">
                  <input
                    id={'userName'}
                    type="text"
                    placeholder="Author Name"
                    required={true}
                    maxLength={18}
                    className="input-bordered input rounded-r-none text-base-content"
                    {...register('userName', { required: true })}
                  />
                  <button
                    className="btn text-2xs rounded-l-none"
                    role="button"
                    type="button"
                    onClick={() => {
                      setValue('userName', getRandomTrainerName());
                    }}
                  >
                    Draw a name
                  </button>
                </div>
                <p className="text-xs text-base-content/50">No registration required. It will be used to identify you in the room.</p>
              </div>
              <div className="form-control">
                <label className="label" htmlFor={'pokePasteUrl'}>
                  <span className="label-text">PokéPaste Link</span>
                </label>
                <input
                  id={'pokePasteUrl'}
                  type="url"
                  placeholder="https://pokepast.es/a00ca5bc26cda7e9"
                  maxLength={72}
                  className="input-bordered input text-base-content"
                  {...register('pokePasteUrl')}
                />
                <p className="text-xs text-base-content/50">Start your team with a PokéPaste link.</p>
              </div>
              <div className="form-control">
                <label className="label" htmlFor={'roomName'}>
                  <span className="label-text after:text-error after:content-['_*']">Room Name</span>
                </label>
                <input
                  id={'roomName'}
                  type="text"
                  placeholder="Room name here"
                  required={true}
                  maxLength={50}
                  className="input-bordered input text-base-content"
                  {...register('roomName', { required: true })}
                />
                <p className="text-xs text-base-content/50">You can share this room name to invite others.</p>
              </div>
              <div className="form-control">
                <label className="label" htmlFor={'Protocol'}>
                  <span className="label-text after:text-error after:content-['_*']">Protocol</span>
                </label>
                <div id={'Protocol'} className="form-control flex-row-reverse justify-between">
                  {supportedProtocols.map((protocol) => (
                    <div id="protocol-radio-group" key={protocol} className="flex">
                      <label className="badge flex" htmlFor={protocol}>
                        {protocol}
                      </label>
                      <input {...register('protocolName')} className="radio" type="radio" id={protocol} key={protocol} value={protocol} />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-base-content/50">Communication Protocol. Try another if one is not working.</p>
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary">Create / Join</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Index;
