import { Sidebar } from "../components/sidebar/Sidebar";
import { Header } from "../components/header/Header";
import { ChatTranscript } from "../components/chat/ChatTranscript";
import { Composer } from "../components/composer/Composer";

export default function Page() {
  return (
    <div className="page-grid">
      <Sidebar />
      <main className="main-column">
        <Header />
        <ChatTranscript />
        <Composer />
      </main>
    </div>
  );
}
