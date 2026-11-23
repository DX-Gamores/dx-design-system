/**
 * @title A sidebar in a dialog
 * @description A settings dialog with its own section navigation. On phones the sections become a list above the content.
 * @route /settings
 */
import { SettingsDialog } from "./components/settings-dialog";

export default function Page() {
  return (
    <main id="main" className="grid min-h-svh place-items-center bg-canvas p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-heading-h2">Settings in a dialog</h1>
        <p className="max-w-sm text-body-small text-fg-secondary">Open the dialog to see a sidebar used for section navigation.</p>
        <SettingsDialog />
      </div>
    </main>
  );
}
