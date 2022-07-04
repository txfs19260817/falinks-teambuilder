import Link from 'next/link';
import React from 'react';

import CopyLink from '@/components/workspace/Toolbox/Copylink';
import ExportShowdown from '@/components/workspace/Toolbox/ExportShowdown';
import ImportShowdown from '@/components/workspace/Toolbox/ImportShowdown';
import PostPokepaste from '@/components/workspace/Toolbox/PostPokepaste';
import { AppConfig } from '@/utils/AppConfig';

const Toolbox = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-center flex">
        <ul className="menu menu-horizontal p-0">
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
            <PostPokepaste />
          </li>
          <li tabIndex={1}>
            <a>
              Links (New tab)
              <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </a>
            <ul className="z-40 bg-base-100 p-2">
              {AppConfig.usefulLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.url}>
                    <a target="_blank" className="border-none">
                      {link.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Toolbox;
