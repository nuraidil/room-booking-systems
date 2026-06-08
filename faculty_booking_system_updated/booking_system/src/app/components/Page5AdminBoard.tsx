import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Check,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";

interface Props {
  onBack: () => void;
}

type Request = {
  id: string;
  room: string;
  floor: string;
  user: string;
  studentId: string;
  event: string;
  date: string;
  start: string;
  end: string;
  capacity: number;
  addOns: string[];
  priority: "high" | "normal" | "low";
};

const INITIAL_REQUESTS: Request[] = [
  { id: "REQ-001", room: "DK5 Lecture Hall", floor: "Level 5", user: "Ahmad Naqiuddin", studentId: "A22CS0045", event: "Workshop", date: "9 Jun 2025", start: "09:00", end: "11:00", capacity: 80, addOns: ["Projector", "Microphone"], priority: "high" },
  { id: "REQ-002", room: "Innovation Lab", floor: "Level 2", user: "Siti Rahmah", studentId: "A21IS0123", event: "Hackathon", date: "11 Jun 2025", start: "10:00", end: "18:00", capacity: 50, addOns: ["Projector", "Extension Wire", "Extra Chairs"], priority: "high" },
  { id: "REQ-003", room: "Meeting Room 3B", floor: "Level 3", user: "Lim Kah Wei", studentId: "A23CS0087", event: "Meeting", date: "12 Jun 2025", start: "14:00", end: "16:00", capacity: 15, addOns: [], priority: "normal" },
  { id: "REQ-004", room: "Seminar Room A", floor: "Level 4", user: "Nur Farah", studentId: "A22SE0034", event: "Seminar", date: "13 Jun 2025", start: "08:00", end: "12:00", capacity: 40, addOns: ["Microphone", "Projector"], priority: "normal" },
  { id: "REQ-005", room: "Computer Lab 1", floor: "Level 1", user: "Raj Kumar", studentId: "A21CS0212", event: "Workshop", date: "16 Jun 2025", start: "10:00", end: "13:00", capacity: 30, addOns: [], priority: "low" },
];

function SwipeCard({ request, onApprove, onDecline }: { request: Request; onApprove: () => void; onDecline: () => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const approveOpacity = useTransform(x, [0, 80], [0, 1]);
  const declineOpacity = useTransform(x, [-80, 0], [1, 0]);
  const isDragging = useRef(false);

  const handleDragEnd = () => {
    const val = x.get();
    if (val > 100) {
      animate(x, 500, { duration: 0.3, onComplete: onApprove });
    } else if (val < -100) {
      animate(x, -500, { duration: 0.3, onComplete: onDecline });
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 25 });
    }
    isDragging.current = false;
  };

  const priorityColor = request.priority === "high" ? "#EF4444" : request.priority === "normal" ? "#F59E0B" : "#8B5CF6";

  return (
    <div className="relative flex items-center justify-center">
      {/* Approve bg */}
      <motion.div
        className="absolute inset-0 rounded-2xl flex items-center pl-8"
        style={{ background: 'rgba(0,0,0,0.08)', opacity: approveOpacity }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#111' }}>
            <Check size={24} className="text-white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: '#111' }}>APPROVE</span>
        </div>
      </motion.div>
      {/* Decline bg */}
      <motion.div
        className="absolute inset-0 rounded-2xl flex items-center justify-end pr-8"
        style={{ background: 'rgba(0,0,0,0.08)', opacity: declineOpacity }}
      >
        <div className="flex items-center gap-3">
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: '#111' }}>DECLINE</span>
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#111' }}>
            <X size={24} className="text-white" />
          </div>
        </div>
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -250, right: 250 }}
        onDragStart={() => { isDragging.current = true; }}
        onDragEnd={handleDragEnd}
        style={{ x, rotate, opacity }}
        className="w-full bg-card rounded-2xl border border-border shadow-lg cursor-grab active:cursor-grabbing select-none relative overflow-hidden"
      >
        {/* Priority stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: priorityColor }} />

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted-foreground)' }}>{request.id}</span>
                <span
                  className="px-2 py-0.5 rounded"
                  style={{
                    background: `${priorityColor}22`,
                    color: priorityColor,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  {request.priority}
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--foreground)' }}>
                {request.room}
              </p>
              <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                {request.floor}
              </p>
            </div>
            <div className="text-right">
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', color: 'var(--foreground)' }}>
                {request.user}
              </p>
              <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                {request.studentId}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { icon: Calendar, label: request.date },
              { icon: Clock, label: `${request.start} – ${request.end}` },
              { icon: MapPin, label: request.floor },
              { icon: Users, label: `${request.capacity} pax` },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: 'var(--secondary)' }}>
                <Icon size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--foreground)' }}>{label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="px-2.5 py-1 rounded-lg text-white" style={{ background: 'var(--primary)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '12px' }}>
              {request.event}
            </span>
            {request.addOns.map((a) => (
              <span key={a} className="px-2.5 py-1 rounded-lg border" style={{ borderColor: 'var(--border)', fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--muted-foreground)' }}>
                {a}
              </span>
            ))}
          </div>

          <p className="text-muted-foreground text-center" style={{ fontFamily: 'var(--font-display)', fontSize: '12px' }}>
            ← Drag left to decline · Drag right to approve →
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export function Page5AdminBoard({ onBack }: Props) {
  const [requests, setRequests] = useState<Request[]>(INITIAL_REQUESTS);
  const [approved, setApproved] = useState<string[]>([]);
  const [declined, setDeclined] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  const pending = requests.filter((r) => !approved.includes(r.id) && !declined.includes(r.id));
  const current = pending[currentIdx] ?? null;

  const handleApprove = () => {
    if (!current) return;
    setApproved((prev) => [...prev, current.id]);
    setCurrentIdx((i) => Math.max(0, Math.min(i, pending.length - 2)));
  };

  const handleDecline = () => {
    if (!current) return;
    setDeclined((prev) => [...prev, current.id]);
    setCurrentIdx((i) => Math.max(0, Math.min(i, pending.length - 2)));
  };

  const remaining = pending.length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-sidebar px-8 py-4 flex items-center gap-4 shrink-0">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          <ArrowLeft size={18} className="text-sidebar-foreground" />
        </button>
        <div className="flex items-center gap-2.5">
          <Shield size={18} style={{ color: 'var(--accent)' }} />
          <div>
            <h1 className="text-white" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px' }}>
              Admin Swipe Board
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--sidebar-accent-foreground)' }}>
              FSKTM Faculty Venue Management
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(0,191,165,0.15)', border: '1px solid rgba(0,191,165,0.3)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)' }}>
              {remaining} pending
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Stats */}
        <aside className="w-56 bg-card border-r border-border p-5 flex flex-col gap-4 shrink-0">
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '12px', color: 'var(--muted-foreground)', letterSpacing: '0.05em' }}>
            SESSION STATS
          </p>
          {[
            { label: "Pending", value: remaining, color: '#F59E0B' },
            { label: "Approved", value: approved.length, color: 'var(--accent)' },
            { label: "Declined", value: declined.length, color: '#EF4444' },
            { label: "Total", value: requests.length, color: 'var(--primary)' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--secondary)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--foreground)' }}>{label}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color }}>{value}</span>
            </div>
          ))}

          <div className="mt-auto">
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: 8, letterSpacing: '0.05em' }}>
              PROCESSED
            </p>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {[...approved.map((id) => ({ id, status: 'approved' })), ...declined.map((id) => ({ id, status: 'declined' }))].map(({ id, status }) => (
                <div key={id} className="flex items-center gap-2 text-xs">
                  {status === 'approved' ? (
                    <Check size={11} style={{ color: 'var(--accent)' }} />
                  ) : (
                    <X size={11} style={{ color: '#EF4444' }} />
                  )}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted-foreground)' }}>{id}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main card area */}
        <main className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
          {current ? (
            <>
              {/* Navigation */}
              <div className="flex items-center gap-4 mb-2">
                <button
                  onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                  disabled={currentIdx === 0}
                  className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted-foreground)' }}>
                  {currentIdx + 1} / {pending.length}
                </span>
                <button
                  onClick={() => setCurrentIdx((i) => Math.min(pending.length - 1, i + 1))}
                  disabled={currentIdx >= pending.length - 1}
                  className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-30 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="w-full max-w-lg">
                <SwipeCard
                  key={current.id}
                  request={current}
                  onApprove={handleApprove}
                  onDecline={handleDecline}
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 w-full max-w-lg">
                <button
                  onClick={handleDecline}
                  className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
                  style={{ background: 'rgba(0,0,0,0.07)', border: '2px solid #111', color: '#111', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px' }}
                >
                  <X size={18} /> Decline
                </button>
                <button
                  onClick={handleApprove}
                  className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
                  style={{ background: '#111', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px' }}
                >
                  <Check size={18} /> Approve
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(0,191,165,0.1)' }}>
                <AlertCircle size={36} style={{ color: 'var(--accent)' }} />
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: 'var(--foreground)' }}>
                All caught up!
              </p>
              <p className="text-muted-foreground mt-2" style={{ fontFamily: 'var(--font-display)', fontSize: '14px' }}>
                No pending booking requests at this time.
              </p>
              <button
                onClick={onBack}
                className="mt-6 px-6 py-2.5 rounded-xl text-white transition-all hover:opacity-90"
                style={{ background: 'var(--primary)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px' }}
              >
                Back to Schedule
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
