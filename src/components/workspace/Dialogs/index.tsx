import { ExportShowdownDialog } from '@/components/workspace/Toolbox/ExportShowdown';
import { ImportShowdownDialog } from '@/components/workspace/Toolbox/ImportShowdown';
import { SetMetadataDialog } from '@/components/workspace/Toolbox/SetMetadata';

export function Dialogs() {
  return (
    <>
      <ImportShowdownDialog />
      <ExportShowdownDialog />
      <SetMetadataDialog />
    </>
  );
}
