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
      <span>🔗</span>
      <span>Copy Link</span>
    </button>
  );
}

export default CopyLink;
