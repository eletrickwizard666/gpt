import { Sidebar } from "../components/sidebar/Sidebar";
import { Header } from "../components/header/Header";
import { ChatTranscript } from "../components/chat/ChatTranscript";
import { Composer } from "../components/composer/Composer";
import { CommandPalette } from "../components/command/CommandPalette";
import { SettingsModal } from "../components/settings/SettingsModal";

export default function Page() {
  return (
    <div className="page-grid">
      <Sidebar />
      <main className="main-column">
        <Header />
        <ChatTranscript />
        <Composer />
      </main>
      <CommandPalette />
      <SettingsModal />
    </div>
  );
}
