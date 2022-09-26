import React from 'react';

import { AppConfig } from '@/utils/AppConfig';
import { fractionToPercentage } from '@/utils/Helpers';
import type { Usage } from '@/utils/Types';

function UsageStats({ pokeUsage }: { pokeUsage: Usage }) {
  return (
    <div className="flex items-center justify-center">
      <div className="stats stats-vertical shadow lg:stats-horizontal lg:grid-cols-2">
        {/* Rank */}
        <div className="stat">
          <div className="stat-figure hidden text-primary md:block">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div className="stat-title">Rank</div>
          <div className="stat-value"># {pokeUsage.rank + 1}</div>
          <div className="stat-desc">in format {AppConfig.defaultFormat}</div>
        </div>
        {/* Usage percent */}
        <div className="stat">
          <div className="stat-figure hidden text-secondary md:block">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Usage</div>
          <div className="stat-value">{fractionToPercentage(pokeUsage.usage)}</div>
          <div className="stat-desc">last month</div>
        </div>
      </div>
    </div>
  );
}

export default UsageStats;
