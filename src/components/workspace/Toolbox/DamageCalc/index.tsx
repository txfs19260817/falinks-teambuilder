import { CalculatorIcon } from '@heroicons/react/solid';
import Link from 'next/link';

function DamageCalc() {
  return (
    <Link href="https://www.pikalytics.com/calc">
      <a target="_blank" className="border-none">
        <CalculatorIcon className="h-4 w-4 md:h-6 md:w-6" />
        <span>DamageCalc 🔗</span>
      </a>
    </Link>
  );
}

export default DamageCalc;
