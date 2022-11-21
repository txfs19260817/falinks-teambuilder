import Link from 'next/link';

import HelpTour from '@/components/workspace/Toolbox/HelpTour';
import ShareLink from '@/components/workspace/Toolbox/ShareLink';
import { AppConfig } from '@/utils/AppConfig';

const Toolbox = () => {
  return (
    <div className="navbar overflow-x-auto bg-base-100">
      <div className="navbar-center flex">
        <ul className="menu menu-horizontal p-0">
          <li>
            <ShareLink />
          </li>
          {/* <li> */}
          {/*  <LoadInShowdown /> */}
          {/* </li> */}
          {/* Dialog buttons */}
          {AppConfig.dialogProps.map(({ id, emoji, text, title }) => (
            <li key={id}>
              <label id={`${id}-btn`} htmlFor={id} className="modal-button rounded" title={title}>
                <span>{emoji}</span>
                <span>{text}</span>
              </label>
            </li>
          ))}
          {/* Help */}
          <li>
            <HelpTour />
          </li>
          {/* Useful links */}
          {AppConfig.usefulLinks.map((link) => (
            <li key={link.name} className="rounded bg-base-300">
              <Link href={link.url} target="_blank" className="border-none" rel="noopener noreferrer">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Toolbox;
