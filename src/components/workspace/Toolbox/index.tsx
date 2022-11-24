import HelpTour from '@/components/workspace/Toolbox/HelpTour';
import LoadInShowdown from '@/components/workspace/Toolbox/LoadInShowdown';
import ShareLink from '@/components/workspace/Toolbox/ShareLink';
import { RedoButton, UndoButton } from '@/components/workspace/Toolbox/UndoManager';
import { AppConfig } from '@/utils/AppConfig';

const Toolbox = () => {
  return (
    <div className="navbar overflow-x-auto bg-base-100">
      <div className="navbar-center flex">
        <ul className="menu menu-compact menu-horizontal p-0">
          <li>
            <ShareLink />
          </li>
          <li>
            <LoadInShowdown />
          </li>
          <li>
            <UndoButton />
          </li>
          <li>
            <RedoButton />
          </li>
          {/* Dialog buttons */}
          {AppConfig.dialogProps.map(({ id, emoji, text, title }) => (
            <li key={id}>
              <label id={`${id}-btn`} htmlFor={id} className="modal-button rounded" title={title}>
                <span>{emoji}</span>
                <span>{text}</span>
              </label>
            </li>
          ))}
          <li>
            <HelpTour />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Toolbox;
