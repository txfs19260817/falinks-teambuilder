import { Field } from '@smogon/calc/src/field';
import { useContext, useState } from 'react';

import { CalculationsContext } from '@/components/calc/Context/CalculationsContext';

type GameType = Field['gameType'];
type WeatherType = Field['weather'];
type TerrainType = Field['terrain'];
type IsGravityType = Field['isGravity'];
type SideType = Field['attackerSide'];

export function FieldSetter() {
  // data
  const { field } = useContext(CalculationsContext);
  // states
  // const [attackerIndex, setAttackerIndex] = useState<1 | 2>(1);
  const [gameType, setGameType] = useState<GameType>('Singles');
  const [weather, setWeather] = useState<WeatherType>(field.weather);
  const [terrain, setTerrain] = useState<TerrainType>(field.terrain);
  const [isGravity, setIsGravity] = useState<IsGravityType>(field.isGravity);
  const [attackerSide, setAttackerSide] = useState<SideType>(field.attackerSide);
  const [defenderSide, setDefenderSide] = useState<SideType>(field.defenderSide);

  return (
    <section className="mockup-window border border-base-300">
      <h1 className="w-full text-center text-xl font-bold">Field</h1>
      <div className="flex flex-col border-t border-base-300 p-4">
        {/* Game Type */}
        <div className="btn-group justify-center py-1">
          <button
            className={`btn btn-xs ${gameType !== 'Doubles' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => {
              setGameType('Singles');
              field.gameType = 'Singles';
            }}
          >
            Singles
          </button>
          <button
            className={`btn btn-xs ${gameType === 'Doubles' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => {
              setGameType('Doubles');
              field.gameType = 'Doubles';
            }}
          >
            Doubles
          </button>
        </div>
        <div className="divider my-1" />
        {/* Terrain */}
        <div className="btn-group justify-center py-1">
          <button className={`btn btn-xs ${terrain ? 'btn-outline' : 'btn-primary'}`} onClick={() => setTerrain(undefined)}>
            None
          </button>
          {Array.from<TerrainType>(['Electric', 'Grassy', 'Psychic', 'Misty']).map((t) => (
            <button
              key={t}
              className={`btn btn-xs ${terrain === t ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => {
                setTerrain(t);
                field.terrain = t;
              }}
            >
              {t}
            </button>
          ))}
        </div>
        {/* Weather */}
        <div className="btn-group justify-center py-1">
          <button className={`btn btn-xs ${weather ? 'btn-outline' : 'btn-primary'}`} onClick={() => setWeather(undefined)}>
            None
          </button>
          {Array.from<WeatherType>(['Sand', 'Sun', 'Rain', 'Hail']).map((w) => (
            <button
              key={w}
              className={`btn btn-xs ${weather === w ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => {
                setWeather(w);
                field.weather = w;
              }}
            >
              {w}
            </button>
          ))}
        </div>
        {/* Gravity */}
        <div className="btn-group justify-center py-1">
          <button
            className={`btn btn-xs ${isGravity ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => {
              setIsGravity(!isGravity);
              field.isGravity = !isGravity;
            }}
          >
            Gravity
          </button>
        </div>
        <div className="divider my-1" />
        {/* Sides - Protect */}
        <div className="flex justify-between py-1">
          <button
            className={`btn btn-xs ${attackerSide.isProtected ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => {
              const newAttackerSide = attackerSide.clone();
              newAttackerSide.isProtected = !newAttackerSide.isProtected;
              setAttackerSide(newAttackerSide);
              field.attackerSide = newAttackerSide;
            }}
          >
            Protect
          </button>
          <button
            className={`btn btn-xs ${defenderSide.isProtected ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => {
              const newDefenderSide = defenderSide.clone();
              newDefenderSide.isProtected = !newDefenderSide.isProtected;
              setDefenderSide(newDefenderSide);
              field.defenderSide = newDefenderSide;
            }}
          >
            Protect
          </button>
        </div>
        {/* Sides - Reflect & Light Screen & Aurora Veil */}
        <div className="flex justify-between py-1">
          <div className="btn-group btn-group-vertical 2xl:btn-group-horizontal">
            <button
              className={`btn btn-xs ${attackerSide.isReflect ? 'btn-primary' : 'btn-outline'} px-1 tracking-tight`}
              onClick={() => {
                const newAttackerSide = attackerSide.clone();
                newAttackerSide.isReflect = !newAttackerSide.isReflect;
                setAttackerSide(newAttackerSide);
                field.attackerSide = newAttackerSide;
              }}
            >
              Reflect
            </button>
            <button
              className={`btn btn-xs ${attackerSide.isLightScreen ? 'btn-primary' : 'btn-outline'} px-1 tracking-tight`}
              onClick={() => {
                const newAttackerSide = attackerSide.clone();
                newAttackerSide.isLightScreen = !newAttackerSide.isLightScreen;
                setAttackerSide(newAttackerSide);
                field.attackerSide = newAttackerSide;
              }}
            >
              Light Screen
            </button>
            <button
              className={`btn btn-xs ${attackerSide.isAuroraVeil ? 'btn-primary' : 'btn-outline'} px-1 tracking-tight`}
              onClick={() => {
                const newAttackerSide = attackerSide.clone();
                newAttackerSide.isAuroraVeil = !newAttackerSide.isAuroraVeil;
                setAttackerSide(newAttackerSide);
                field.attackerSide = newAttackerSide;
              }}
            >
              Aurora Veil
            </button>
          </div>
          <div className="btn-group btn-group-vertical 2xl:btn-group-horizontal">
            <button
              className={`btn btn-xs ${defenderSide.isLightScreen ? 'btn-primary' : 'btn-outline'} px-1 tracking-tight`}
              onClick={() => {
                const newDefenderSide = defenderSide.clone();
                newDefenderSide.isLightScreen = !newDefenderSide.isLightScreen;
                setDefenderSide(newDefenderSide);
                field.defenderSide = newDefenderSide;
              }}
            >
              Light Screen
            </button>
            <button
              className={`btn btn-xs ${defenderSide.isReflect ? 'btn-primary' : 'btn-outline'} px-1 tracking-tight`}
              onClick={() => {
                const newDefenderSide = defenderSide.clone();
                newDefenderSide.isReflect = !newDefenderSide.isReflect;
                setDefenderSide(newDefenderSide);
                field.defenderSide = newDefenderSide;
              }}
            >
              Reflect
            </button>
            <button
              className={`btn btn-xs ${defenderSide.isAuroraVeil ? 'btn-primary' : 'btn-outline'} px-1 tracking-tight`}
              onClick={() => {
                const newDefenderSide = defenderSide.clone();
                newDefenderSide.isAuroraVeil = !newDefenderSide.isAuroraVeil;
                setDefenderSide(newDefenderSide);
                field.defenderSide = newDefenderSide;
              }}
            >
              Aurora Veil
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
