import Link from 'next/link';
import React, { SVGProps } from 'react';

import HelpTour from '@/components/workspace/Toolbox/HelpTour';
import LoadInShowdown from '@/components/workspace/Toolbox/LoadInShowdown';
import ShareLink from '@/components/workspace/Toolbox/ShareLink';
import { AppConfig } from '@/utils/AppConfig';

const ExternalLinkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg enableBackground="new 0 0 26 26" viewBox="0 0 26 26" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M18,17.759v3.366C18,22.159,17.159,23,16.125,23H4.875C3.841,23,3,22.159,3,21.125V9.875   C3,8.841,3.841,8,4.875,8h3.429l3.001-3h-6.43C2.182,5,0,7.182,0,9.875v11.25C0,23.818,2.182,26,4.875,26h11.25   C18.818,26,21,23.818,21,21.125v-6.367L18,17.759z"
      fill="#7e7e7e"
    />
    <path
      d="m22.581 0h-10.259c-1.886 2e-3 -1.755 0.51-0.76 1.504l3.22 3.22-5.52 5.519c-1.145 1.144-1.144 2.998 0 4.141l2.41 2.411c1.144 1.141 2.996 1.142 4.14-1e-3l5.52-5.52 3.16 3.16c1.101 1.1 1.507 1.129 1.507-0.757l1e-3 -10.258c-1e-3 -3.437 0.024-3.42-3.419-3.419z"
      fill="#7e7e7e"
    />
  </svg>
);

const Toolbox = () => {
  return (
    <div className="navbar overflow-x-auto bg-base-100">
      <div className="navbar-center flex">
        <ul className="menu menu-horizontal p-0">
          <li>
            <ShareLink />
          </li>
          <li>
            <LoadInShowdown />
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
          {/* Help */}
          <li>
            <HelpTour />
          </li>
          {/* Useful links */}
          {AppConfig.usefulLinks.map((link) => (
            <li key={link.name} className="rounded bg-base-300">
              <Link href={link.url} referrerPolicy={'no-referrer'}>
                <a target="_blank" className="border-none">
                  {link.name}
                  <ExternalLinkIcon width={20} height={20} />
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Toolbox;
