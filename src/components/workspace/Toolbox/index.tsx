import CopyLink from '@/components/workspace/Toolbox/Copylink';
import DamageCalc from '@/components/workspace/Toolbox/DamageCalc';
import ExportShowdown from '@/components/workspace/Toolbox/ExportShowdown';
import ImportShowdown from '@/components/workspace/Toolbox/ImportShowdown';
import PostPokepaste from '@/components/workspace/Toolbox/PostPokepaste';
import SetMetadata from '@/components/workspace/Toolbox/SetMetadata';

const Toolbox = () => {
  return (
    <div className="dropdown">
      <label tabIndex={0} className="tab tab-lifted tab-md rounded-lg bg-base-content md:tab-lg">
        ⚙️
        <span className="hidden text-primary-content md:inline-block">Tools</span>
      </label>
      <ul tabIndex={0} className="dropdown-content menu rounded-box w-[90vw] border border-current bg-base-100 p-4 text-base-content">
        <li>
          <CopyLink />
        </li>
        <li>
          <ImportShowdown />
        </li>
        <li>
          <ExportShowdown />
        </li>
        <li>
          <SetMetadata />
        </li>
        <li>
          <PostPokepaste />
        </li>
        <li>
          <DamageCalc />
        </li>
      </ul>
    </div>
  );
};

export default Toolbox;
