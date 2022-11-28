import { deleteDB, openDB } from 'idb';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { WorkspaceProps } from '@/components/workspace';
import { supportedProtocols } from '@/providers';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { S4 } from '@/utils/Helpers';
import { getRandomTrainerName, isValidPokePasteURL } from '@/utils/PokemonUtils';
import { IndexedDBTeam } from '@/utils/Types';

type RoomFormProps = WorkspaceProps & {
  userName: string;
  pokePasteUrl?: string;
};

const RoomForm = () => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'home']);
  const { register, handleSubmit, setValue } = useForm<RoomFormProps>({
    defaultValues: {
      roomName: `room_name_${S4()}${S4()}`,
      protocolName: 'WebSocket',
    },
  });

  const gotoRoom = ({ roomName, protocolName, userName, pokePasteUrl }: RoomFormProps) => {
    localStorage.setItem('username', userName);
    // use window.open instead of next/router to disable go back
    const targetRoomRoute = `/${router.locale}/room/${encodeURIComponent(roomName)}?protocol=${encodeURIComponent(protocolName)}${
      isValidPokePasteURL(pokePasteUrl) ? `&pokepaste=${encodeURIComponent(pokePasteUrl!)}` : ''
    }`;
    window.open(targetRoomRoute, '_self');
  };

  useEffect(() => {
    setValue('userName', localStorage.getItem('username') || '');
  }, []);

  return (
    <form
      role="form"
      aria-label="Create Room Form"
      className="card-body"
      onSubmit={handleSubmit((data) => {
        gotoRoom(data);
      })}
    >
      <div className="form-control">
        <label className="label" htmlFor={'userName'}>
          <span className="label-text after:text-error after:content-['_*']">{t('home:form.author.label')}</span>
        </label>
        <div className="flex">
          <input
            id={'userName'}
            role="textbox"
            aria-label="Author Name"
            type="text"
            placeholder={t('home:form.author.placeholder')}
            required={true}
            maxLength={18}
            className="input-bordered input rounded-r-none text-base-content placeholder:text-base-content/50"
            {...register('userName', { required: true })}
          />
          <button
            title={t('home:form.author.button_title')}
            className="btn rounded-l-none tracking-tighter"
            role="button"
            aria-label="Draw a name randomly"
            type="button"
            onClick={() => {
              setValue('userName', getRandomTrainerName());
            }}
          >
            {t('home:form.author.button')}
          </button>
        </div>
        <p className="text-xs text-base-content/50">{t('home:form.author.description')}</p>
      </div>
      <div className="form-control">
        <label className="label" htmlFor={'pokePasteUrl'}>
          <span className="label-text">{t('home:form.pokepaste.label')}</span>
        </label>
        <input
          id={'pokePasteUrl'}
          type="url"
          role="textbox"
          aria-label="PokePaste URL"
          placeholder="https://pokepast.es/a00ca5bc26cda7e9"
          maxLength={72}
          className="input-bordered input text-base-content placeholder:text-base-content/50"
          {...register('pokePasteUrl')}
        />
        <p className="text-xs text-base-content/50">{t('home:form.pokepaste.description')}</p>
      </div>
      <div className="form-control">
        <label className="label" htmlFor={'roomName'}>
          <span className="label-text after:text-error after:content-['_*']">{t('home:form.room.label')}</span>
        </label>
        <input
          id={'roomName'}
          type="text"
          role="textbox"
          aria-label="Room Name"
          placeholder={t('home:form.room.placeholder')}
          required={true}
          maxLength={50}
          className="input-bordered input text-base-content placeholder:text-base-content/50"
          {...register('roomName', { required: true })}
        />
        <p className="text-xs text-base-content/50">{t('home:form.room.description')}</p>
      </div>
      <div className="form-control">
        <label className="label" htmlFor={'Protocol'}>
          <span className="label-text after:text-error after:content-['_*']">{t('home:form.protocol.label')}</span>
        </label>
        <div id={'Protocol'} className="form-control flex-row-reverse justify-between">
          {supportedProtocols.map((protocol) => (
            <div id="protocol-radio-group" key={protocol} className="flex">
              <label className="badge flex" htmlFor={protocol}>
                {protocol}
              </label>
              <input
                {...register('protocolName')}
                className="radio"
                type="radio"
                id={protocol}
                key={protocol}
                value={protocol}
                role="radio"
                aria-label={protocol}
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-base-content/50">{t('home:form.protocol.description')}</p>
      </div>
      <div className="form-control mt-6">
        <button className="btn-primary btn" role={'button'} aria-label={'Create Room Submit Button'}>
          {t('home:form.submit')}
        </button>
      </div>
    </form>
  );
};

const RoomHistory = () => {
  const router = useRouter();
  const { t } = useTranslation(['home']);
  // roomName to room history
  const [roomHistory, setRoomHistory] = useState<Record<string, IndexedDBTeam>[]>([]);

  useEffect(() => {
    const roomDbNamesValue = localStorage.getItem('roomNames');
    if (!roomDbNamesValue) return;
    const roomDbNames = roomDbNamesValue.split(',');
    // list indexedDB
    Promise.all<Record<string, IndexedDBTeam> | undefined>(
      roomDbNames.map((name) =>
        openDB(name).then((db) =>
          db
            .getAll('custom', undefined, 1)
            .then((v) => ({
              [name]: JSON.parse(v[0]),
            }))
            .catch(() => undefined)
        )
      )
    ).then((arr) => {
      setRoomHistory(arr.filter((v) => v != null) as Record<string, IndexedDBTeam>[]);
    });
  }, []);

  const handleClearHistory = () => {
    const roomDbNamesValue = localStorage.getItem('roomNames');
    if (!roomDbNamesValue) return;
    const roomDbNames = roomDbNamesValue.split(',');
    Promise.all(roomDbNames.map((name) => deleteDB(name))).then(() => {
      localStorage.removeItem('roomNames');
    });
    setRoomHistory([]);
  };

  const handleDeleteRoom = (roomName: string) => {
    deleteDB(roomName).then(() => {
      const roomDbNamesValue = localStorage.getItem('roomNames');
      if (!roomDbNamesValue) return;
      const roomDbNames = roomDbNamesValue.split(',');
      const newRoomDbNames = roomDbNames.filter((n) => n !== roomName);
      if (newRoomDbNames.length === 0) {
        localStorage.removeItem('roomNames');
      } else {
        localStorage.setItem('roomNames', newRoomDbNames.join(','));
      }
    });
    setRoomHistory((prev) => prev.filter((s) => Object.keys(s)[0] !== roomName));
  };

  return roomHistory.length === 0 ? (
    <div className="text-base-content text-center my-2 md:my-auto" role="alert" aria-label="No room history">
      {t('home:history.empty', {
        defaultValue: 'No room visited, enjoy a cup of coffee ☕',
      })}
    </div>
  ) : (
    <>
      <div className="card-body max-h-[492px] overflow-y-auto">
        {roomHistory.reverse().map((v) => {
          const key = Object.keys(v)[0]!;
          const room = v[key];
          return (
            <div key={key} className="flex justify-center items-center gap-1">
              {/* Room button */}
              <button
                role="link"
                aria-label={`Room ${key} link`}
                className="btn no-animation normal-case text-xs flex-1"
                onClick={() => router.push(`/room/${key}`)}
              >
                <div className="flex flex-col justify-between">
                  <span className="whitespace-nowrap">{`[${room?.format}] ${key}`}</span>
                  <span>
                    {room?.species.map((s, i) => (
                      <PokemonIcon speciesId={s} key={i} />
                    ))}
                  </span>
                </div>
              </button>
              {/* Delete Button */}
              <button
                role="button"
                aria-label={`Delete ${key} room`}
                title={t('home:history.delete', { defaultValue: 'Delete' })}
                className="btn btn-error flex-shrink-0 btn-sm"
                onClick={() => {
                  handleDeleteRoom(key);
                }}
              >
                🗑️
              </button>
            </div>
          );
        })}
        {/* Clear History button */}
      </div>
      <div className="flex justify-end px-2 py-4">
        <button
          role="button"
          aria-label="Clear History"
          title={t('home:history.clear', { defaultValue: 'Clear History' })}
          className="btn btn-primary btn-sm"
          onClick={handleClearHistory}
        >
          {t('home:history.clear', { defaultValue: 'Clear History' })}
        </button>
      </div>
    </>
  );
};

const tabs = ['new room', 'room history'] as const;
type Tab = typeof tabs[number];

const Index = () => {
  const { t } = useTranslation(['common', 'home']);
  const [tab, setTab] = useState<Tab>(tabs[0]);

  return (
    <Main title={t('home')}>
      <div
        className="hero h-main"
        style={{
          background: 'url(/assets/images/hero.jpg) no-repeat center center fixed',
          backgroundSize: 'cover',
        }}
      >
        <div className="hero-overlay bg-opacity-75"></div>
        <div className="hero-content flex-col text-neutral-content lg:flex-row">
          <div className="text-center lg:text-left min-w-fit">
            <h1 aria-label="Applicaton Name" aria-level={1} className="text-4xl font-bold md:text-5xl">
              {AppConfig.title}
            </h1>
            <p className="py-6">{t('home:slogan')}</p>
          </div>

          {/* Room Panel */}
          <div className="w-full max-w-md flex-shrink-0">
            <div className="tabs">
              {tabs.map((tabName) => (
                <a
                  role="tab"
                  aria-label={`Tab ${tabName}`}
                  key={tabName}
                  onClick={() => setTab(tabName)}
                  className={`tab tab-lg tab-lifted ${tab === tabName ? 'tab-active' : 'bg-base-100'} capitalize`}
                >
                  {t(`home:tabs.${tabName}`, {
                    defaultValue: tabName.toUpperCase(),
                  })}
                </a>
              ))}
            </div>
            <div className="card bg-base-100 shadow-2xl md:min-h-[588px] rounded-tl-none">{tab === 'new room' ? <RoomForm /> : <RoomHistory />}</div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'home'])),
    },
  };
}

export default Index;
