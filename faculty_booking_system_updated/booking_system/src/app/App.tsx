import { useState } from "react";
import { Page1Dashboard } from "./components/Page1Dashboard";
import { Page2SmartRecommend } from "./components/Page2SmartRecommend";
import { Page3BookingSummary } from "./components/Page3BookingSummary";
import { Page4Calendar } from "./components/Page4Calendar";
import { Page5AdminBoard } from "./components/Page5AdminBoard";
import { Page6DamageModal } from "./components/Page6DamageModal";
import type { RoomCard } from "./components/Page2SmartRecommend";

type Page = "dashboard" | "recommend" | "summary" | "calendar" | "admin";

const PAGE_LABELS = ["P1 Dashboard", "P2 Recommend", "P3 Summary", "P4 Calendar", "P5 Admin"];

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [selectedRoom, setSelectedRoom] = useState<RoomCard | null>(null);
  const [showDamage, setShowDamage] = useState(false);

  const handleConfirmBooking = () => {
    setPage("calendar");
    setTimeout(() => setShowDamage(true), 800);
  };

  const pageKeys: Page[] = ["dashboard", "recommend", "summary", "calendar", "admin"];
  const currentIdx = pageKeys.indexOf(page);

  return (
    /* MARKER-MAKE-KIT-INVOKED */
    <div className="size-full relative">
      {page === "dashboard" && (
        <Page1Dashboard
          onCreateBooking={() => setPage("recommend")}
          onViewCalendar={() => setPage("calendar")}
        />
      )}

      {page === "recommend" && (
        <Page2SmartRecommend
          onBack={() => setPage("dashboard")}
          onSelectRoom={(room) => {
            setSelectedRoom(room);
            setPage("summary");
          }}
        />
      )}

      {page === "summary" && (
        <Page3BookingSummary
          room={selectedRoom}
          onBack={() => setPage("recommend")}
          onConfirm={handleConfirmBooking}
        />
      )}

      {page === "calendar" && (
        <>
          <Page4Calendar
            onAdminMode={() => setPage("admin")}
            onCreateBooking={() => setPage("recommend")}
            showDamageModal={showDamage}
          />
          <Page6DamageModal
            isOpen={showDamage}
            onClose={() => setShowDamage(false)}
            roomName={selectedRoom?.name ?? "DK5 Lecture Hall"}
          />
        </>
      )}

      {page === "admin" && (
        <Page5AdminBoard
          onBack={() => setPage("calendar")}
        />
      )}

      {/* Status tracker pill — non-clickable, read-only */}
      <div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-2 rounded-full shadow-xl z-40"
        style={{ background: 'var(--primary)', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        {pageKeys.map((key, i) => (
          <div
            key={key}
            title={PAGE_LABELS[i]}
            className="flex items-center gap-1.5 px-2 h-8 rounded-full transition-all"
            style={{
              background: page === key ? 'var(--accent)' : 'rgba(255,255,255,0.12)',
              color: page === key ? 'white' : 'rgba(255,255,255,0.5)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {page === key ? (
              <>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-white"
                  style={{ opacity: 0.9 }}
                />
                {PAGE_LABELS[i]}
              </>
            ) : (
              `P${i + 1}`
            )}
          </div>
        ))}
        {page === "calendar" && showDamage && (
          <>
            <div className="w-px h-4 mx-1" style={{ background: 'rgba(255,255,255,0.2)' }} />
            <div
              className="flex items-center gap-1.5 px-2 h-8 rounded-full"
              style={{
                background: '#EF4444',
                color: 'white',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 600,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" style={{ opacity: 0.9 }} />
              P6 Report
            </div>
          </>
        )}
      </div>
    </div>
  );
}
