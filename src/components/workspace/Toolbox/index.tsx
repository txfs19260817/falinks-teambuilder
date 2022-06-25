import { ExternalLinkIcon } from '@heroicons/react/solid';
import Link from 'next/link';

import CopyLink from '@/components/workspace/Toolbox/Copylink';
import ExportShowdown from '@/components/workspace/Toolbox/ExportShowdown';
import ImportShowdown from '@/components/workspace/Toolbox/ImportShowdown';
import PostPokepaste from '@/components/workspace/Toolbox/PostPokepaste';
import { AppConfig } from '@/utils/AppConfig';

const Toolbox = () => {
  return (
    <div className="dropdown">
      <label tabIndex={0} className="tab tab-lifted tab-md rounded-lg bg-base-content md:tab-lg">
        ⚙️
        <span className="hidden text-primary-content md:inline-block">Tools</span>
      </label>
      <ul tabIndex={0} className="dropdown-content menu rounded-box w-60 border border-current bg-base-100 p-2 text-base-content">
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
        <li tabIndex={0}>
          <span>
            <ExternalLinkIcon className="inline-block h-4 w-4 md:h-6 md:w-6" />
            Useful links 🡆
          </span>
          <ul className="rounded-box menu-compact border border-current bg-base-100 p-1">
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
  );
};

export default Toolbox;
