import { LinkIcon } from '@heroicons/react/solid';
import { toast } from 'react-hot-toast';

function CopyLink() {
  return (
    <button
      className="rounded"
      title="Copy the current room link to clipboard"
      onClick={() => {
        navigator.clipboard.writeText(window.location.href).then(() => toast('📋 Copied!'));
      }}
    >
      <LinkIcon className="h-4 w-4 md:h-6 md:w-6" />
      <span>Copy Link</span>
    </button>
  );
}

export default CopyLink;
