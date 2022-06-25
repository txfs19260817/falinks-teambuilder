import { ExportShowdownDialog } from '@/components/workspace/Toolbox/ExportShowdown';
import { ImportShowdownDialog } from '@/components/workspace/Toolbox/ImportShowdown';

export function Dialogs() {
  return (
    <>
      <ImportShowdownDialog />
      <ExportShowdownDialog />
    </>
  );
}
