import { ExternalLinkIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React from 'react';

import CopyLink from '@/components/workspace/Toolbox/Copylink';
import ExportShowdown from '@/components/workspace/Toolbox/ExportShowdown';
import ImportShowdown from '@/components/workspace/Toolbox/ImportShowdown';
import PostPokepaste from '@/components/workspace/Toolbox/PostPokepaste';
import { AppConfig } from '@/utils/AppConfig';

const Toolbox = () => {
  return (
    <div className="navbar overflow-x-auto bg-base-100">
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
          {AppConfig.usefulLinks.map((link) => (
            <li key={link.name} className="rounded bg-base-300">
              <Link href={link.url}>
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
