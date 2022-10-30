import { memo } from 'react';

const HpSetters = memo(
  ({
    dynamax,
    setDynamax,
    totalHP,
    currentHP,
    setCurrentHP,
  }: {
    totalHP: number;
    currentHP: number;
    setCurrentHP: (h: number) => void;
    dynamax: boolean;
    setDynamax: (d: boolean) => void;
  }) => (
    <div className="input-group-xs input-group flex">
      <span title="Current HP" className="input-addon border border-neutral">
        HP
      </span>
      <input
        className="input-bordered input input-xs"
        type="number"
        min="0"
        max="255"
        value={currentHP}
        onChange={(e) => setCurrentHP(parseInt(e.target.value, 10))}
      />
      <span>/{totalHP}</span>
      <input
        className="input-bordered input input-xs"
        type="text"
        value={(currentHP / totalHP) * 100}
        onChange={(e) => setCurrentHP(~~((+e.target.value / 100) * totalHP))}
      />
      <span>%</span>
      <button className={`btn btn-xs ${dynamax ? '' : 'btn-outline'}`} onClick={() => setDynamax(!dynamax)}>
        Dynamax
      </button>
    </div>
  )
);
HpSetters.displayName = 'HpSetters';

export { HpSetters };
