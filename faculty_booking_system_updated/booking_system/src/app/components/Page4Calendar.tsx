import { useState } from "react";
import {
  Shield,
  Plus,
  Clock,
  X,
  CheckCircle2,
  RefreshCcw,
  CalendarDays,
  MapPin,
  Users,
} from "lucide-react";

interface Props {
  onAdminMode: () => void;
  onCreateBooking: () => void;
  showDamageModal: boolean;
}

const ROOMS = ["DK5 Hall", "Meeting 3B", "Innovation Lab", "Seminar A", "Lab 1", "Meeting 2A"];
const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

type BookingStatus = "confirmed" | "pending";

type Booking = {
  id: string;
  room: string;
  day: string;
  start: string;
  end: string;
  event: string;
  user: string;
  color: string;
  status: BookingStatus;
};

const INITIAL_BOOKINGS: Booking[] = [
  { id: "b1", room: "DK5 Hall", day: "Mon", start: "09:00", end: "11:00", event: "Workshop", user: "Ahmad N.", color: "#1B2A6B", status: "confirmed" },
  { id: "b2", room: "Meeting 3B", day: "Mon", start: "14:00", end: "16:00", event: "Meeting", user: "Siti R.", color: "#8B5CF6", status: "confirmed" },
  { id: "b3", room: "Innovation Lab", day: "Tue", start: "10:00", end: "18:00", event: "Hackathon", user: "Dev Club", color: "#00BFA5", status: "confirmed" },
  { id: "b4", room: "Seminar A", day: "Wed", start: "08:00", end: "10:00", event: "Lecture", user: "Prof. Ali", color: "#F59E0B", status: "confirmed" },
  { id: "b5", room: "Lab 1", day: "Wed", start: "13:00", end: "15:00", event: "Workshop", user: "CS3 Class", color: "#1B2A6B", status: "confirmed" },
  { id: "b6", room: "DK5 Hall", day: "Thu", start: "09:00", end: "12:00", event: "Seminar", user: "ITMC", color: "#EF4444", status: "confirmed" },
  { id: "b7", room: "Meeting 2A", day: "Fri", start: "14:00", end: "16:00", event: "Meeting", user: "FYP Group", color: "#8B5CF6", status: "pending" },
  { id: "b8", room: "Seminar A", day: "Thu", start: "13:00", end: "15:00", event: "Seminar", user: "Ahmad N.", color: "#00BFA5", status: "pending" },
];

function hourIndex(t: string) {
  return HOURS.indexOf(t);
}

type MyBookingsTab = "active" | "pending" | "history";

export function Page4Calendar({ onAdminMode, onCreateBooking }: Props) {
  const [is24h, setIs24h] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [selectedSlot, setSelectedSlot] = useState<{ room: string; day: string; hour: string } | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [view, setView] = useState<"calendar" | "myBookings">("calendar");
  const [myBookingsTab, setMyBookingsTab] = useState<MyBookingsTab>("active");

  function to12h(t: string) {
    const [h] = t.split(":").map(Number);
    const p = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}${p}`;
  }
  const fmt = (t: string) => (is24h ? t : to12h(t));

  const getBookingAt = (room: string, day: string, hour: string) =>
    bookings.find((b) => b.room === room && b.day === day && b.start <= hour && b.end > hour);

  const getBookingStart = (room: string, day: string, hour: string) =>
    bookings.find((b) => b.room === room && b.day === day && b.start === hour);

  const isSlotOccupied = (room: string, day: string, hour: string) =>
    !!getBookingAt(room, day, hour);

  const handleSlotClick = (room: string, day: string, hour: string) => {
    const existing = getBookingAt(room, day, hour);
    if (existing) {
      setSelectedBooking(existing);
      setSelectedSlot(null);
    } else {
      setSelectedSlot({ room, day, hour });
      setSelectedBooking(null);
    }
  };

  const handleQuickBook = () => {
    if (!selectedSlot) return;
    // Check if the slot is occupied before booking
    if (isSlotOccupied(selectedSlot.room, selectedSlot.day, selectedSlot.hour)) return;
    const endIdx = Math.min(hourIndex(selectedSlot.hour) + 2, HOURS.length - 1);
    const newBooking: Booking = {
      id: `b${Date.now()}`,
      room: selectedSlot.room,
      day: selectedSlot.day,
      start: selectedSlot.hour,
      end: HOURS[endIdx],
      event: "Meeting",
      user: "Ahmad N.",
      color: "#00BFA5",
      status: "pending",
    };
    setBookings((prev) => [...prev, newBooking]);
    setSelectedSlot(null);
  };

  const handleCancel = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setSelectedBooking(null);
  };

  // My bookings grouped by tab
  const myUser = "Ahmad N.";
  const myBookings = bookings.filter((b) => b.user === myUser);
  const activeBookings = myBookings.filter((b) => b.status === "confirmed");
  const pendingBookings = myBookings.filter((b) => b.status === "pending");
  const historyBookings: Booking[] = []; // Placeholder for cancelled/past

  const tabBookings: Record<MyBookingsTab, Booking[]> = {
    active: activeBookings,
    pending: pendingBookings,
    history: historyBookings,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header — now inside main pane, no < > navigation */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center gap-4 shrink-0">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: 'var(--foreground)' }}>
            Faculty Venue Booking
          </h1>
          <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
            Real-time space availability · Self-service booking
          </p>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {/* 12/24h toggle */}
          <div className="flex items-center rounded-lg border border-border overflow-hidden">
            {["12h", "24h"].map((label) => (
              <button
                key={label}
                onClick={() => setIs24h(label === "24h")}
                className="px-3 py-1.5 transition-colors"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  background: (label === "24h") === is24h ? 'var(--primary)' : 'transparent',
                  color: (label === "24h") === is24h ? 'white' : 'var(--muted-foreground)',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-border overflow-hidden">
            {([["calendar", "Calendar"], ["myBookings", "My Bookings"]] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className="px-3 py-1.5 transition-colors"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '12px',
                  fontWeight: 600,
                  background: view === key ? 'var(--primary)' : 'transparent',
                  color: view === key ? 'white' : 'var(--muted-foreground)',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={onCreateBooking}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white transition-all hover:opacity-90"
            style={{ background: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px' }}
          >
            <Plus size={14} /> New Booking
          </button>

          <button
            onClick={onAdminMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all hover:bg-muted"
            style={{ borderColor: 'var(--border)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px', color: 'var(--foreground)' }}
          >
            <Shield size={14} style={{ color: 'var(--primary)' }} />
            Admin Mode
          </button>
        </div>
      </header>

      {view === "calendar" && (
        <>
          {/* Week label row — no < > nav buttons */}
          <div className="bg-card border-b border-border px-6 py-2.5 flex items-center gap-3 shrink-0">
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--foreground)' }}>
              Week of 9 – 13 Jun 2025
            </span>
            <div className="ml-auto flex items-center gap-3">
              {[
                { label: "Available", color: "#EEF1F8" },
                { label: "Booked", color: "var(--primary)" },
                { label: "Pending", color: "#F59E0B" },
                { label: "Your Booking", color: "var(--accent)" },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm border border-border" style={{ background: color }} />
                  <span className="text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 overflow-auto p-0">
            <div className="min-w-[900px]">
              {/* Column headers */}
              <div className="grid border-b border-border" style={{ gridTemplateColumns: `80px repeat(${ROOMS.length}, 1fr)` }}>
                <div className="py-3 px-2" />
                {ROOMS.map((room) => (
                  <div key={room} className="py-3 px-2 border-l border-border text-center">
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '12px', color: 'var(--foreground)' }}>{room}</p>
                  </div>
                ))}
              </div>

              {/* Day groups */}
              {DAYS.map((day) => (
                <div key={day}>
                  <div className="py-2 px-3 border-b border-border" style={{ background: 'var(--secondary)' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '12px', color: 'var(--primary)' }}>{day}</span>
                  </div>
                  {HOURS.slice(0, -1).map((hour) => (
                    <div
                      key={hour}
                      className="grid border-b border-border"
                      style={{ gridTemplateColumns: `80px repeat(${ROOMS.length}, 1fr)` }}
                    >
                      {/* Time label */}
                      <div className="py-2 px-2 flex items-center justify-end pr-3">
                        <span className="text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{fmt(hour)}</span>
                      </div>
                      {ROOMS.map((room) => {
                        const booking = getBookingAt(room, day, hour);
                        const isStart = getBookingStart(room, day, hour);
                        const isSelected = selectedSlot?.room === room && selectedSlot?.day === day && selectedSlot?.hour === hour;
                        const occupied = !!booking;

                        return (
                          <div
                            key={room}
                            className="border-l border-border h-10 relative transition-colors"
                            style={{
                              background: booking
                                ? booking.status === "pending"
                                  ? `rgba(245,158,11,0.15)`
                                  : `${booking.color}22`
                                : isSelected
                                ? 'rgba(0,191,165,0.12)'
                                : 'transparent',
                              cursor: occupied ? 'default' : 'pointer',
                            }}
                            onClick={() => {
                              if (occupied) {
                                setSelectedBooking(booking!);
                                setSelectedSlot(null);
                              } else {
                                setSelectedSlot({ room, day, hour });
                                setSelectedBooking(null);
                              }
                            }}
                          >
                            {booking && isStart && (
                              <div
                                className="absolute left-0 top-0 bottom-0 w-1 rounded-r"
                                style={{ background: booking.status === "pending" ? "#F59E0B" : booking.color }}
                              />
                            )}
                            {isStart && booking && (
                              <div className="absolute inset-0 flex items-center pl-2">
                                <span
                                  className="truncate"
                                  style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    color: booking.status === "pending" ? "#F59E0B" : booking.color,
                                  }}
                                >
                                  {booking.event}{booking.status === "pending" ? " ⏳" : ""}
                                </span>
                              </div>
                            )}
                            {isSelected && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Plus size={12} style={{ color: 'var(--accent)' }} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {view === "myBookings" && (
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto">
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color: 'var(--foreground)', marginBottom: 20 }}>
              My Bookings
            </h2>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: 'var(--secondary)' }}>
              {([
                ["active", "Active", activeBookings.length],
                ["pending", "Pending", pendingBookings.length],
                ["history", "History", historyBookings.length],
              ] as const).map(([key, label, count]) => (
                <button
                  key={key}
                  onClick={() => setMyBookingsTab(key)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '13px',
                    fontWeight: myBookingsTab === key ? 700 : 500,
                    background: myBookingsTab === key ? 'var(--card)' : 'transparent',
                    color: myBookingsTab === key ? 'var(--foreground)' : 'var(--muted-foreground)',
                    boxShadow: myBookingsTab === key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  {label}
                  {count > 0 && (
                    <span
                      className="px-1.5 py-0.5 rounded-full text-white"
                      style={{
                        fontSize: '10px',
                        background: key === "pending" ? '#F59E0B' : key === "active" ? 'var(--accent)' : 'var(--muted-foreground)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Booking list */}
            {myBookingsTab === "pending" && (
              <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
                <Clock size={14} style={{ color: '#F59E0B' }} />
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: '#92400E' }}>
                  These bookings are awaiting admin approval. You'll be notified once confirmed.
                </p>
              </div>
            )}

            {tabBookings[myBookingsTab].length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-display)', fontSize: '14px' }}>
                  {myBookingsTab === "history" ? "No booking history yet." : `No ${myBookingsTab} bookings.`}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tabBookings[myBookingsTab].map((b) => (
                  <div key={b.id} className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
                    <div className="w-1 h-14 rounded-full shrink-0" style={{ background: b.status === "pending" ? "#F59E0B" : b.color }} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--foreground)' }}>
                          {b.room}
                        </p>
                        <span
                          className="px-2 py-0.5 rounded text-white"
                          style={{ background: b.color, fontFamily: 'var(--font-mono)', fontSize: '10px' }}
                        >
                          {b.event}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded border"
                          style={{
                            borderColor: b.status === "pending" ? "#F59E0B" : "var(--accent)",
                            color: b.status === "pending" ? "#F59E0B" : "var(--accent)",
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                          }}
                        >
                          {b.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                          <CalendarDays size={11} /> {b.day}
                        </span>
                        <span className="flex items-center gap-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                          <Clock size={11} /> {fmt(b.start)} – {fmt(b.end)}
                        </span>
                        <span className="flex items-center gap-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                          <MapPin size={11} /> {b.room}
                        </span>
                      </div>
                    </div>
                    {b.status !== "pending" && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="px-3 py-1.5 rounded-lg border hover:bg-muted transition-colors"
                        style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 600, color: 'var(--destructive)', borderColor: 'var(--border)' }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slot action panel (calendar view only) */}
      {view === "calendar" && (selectedSlot || selectedBooking) && (
        <div
          className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-card rounded-2xl border border-border shadow-xl p-5 w-80 z-20"
        >
          {selectedSlot && (
            <>
              <div className="flex items-center justify-between mb-3">
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--foreground)' }}>
                  Book this slot?
                </p>
                <button onClick={() => setSelectedSlot(null)} className="p-1 hover:bg-muted rounded">
                  <X size={14} />
                </button>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={13} className="text-muted-foreground" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--foreground)' }}>
                  {selectedSlot.day} · {fmt(selectedSlot.hour)} · {selectedSlot.room}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleQuickBook}
                  className="flex-1 py-2 rounded-lg text-white flex items-center justify-center gap-1.5 transition-all hover:opacity-90"
                  style={{ background: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px' }}
                >
                  <CheckCircle2 size={14} /> Quick Book
                </button>
                <button
                  onClick={onCreateBooking}
                  className="flex-1 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px', color: 'var(--foreground)' }}
                >
                  Full Setup
                </button>
              </div>
            </>
          )}
          {selectedBooking && (
            <>
              <div className="flex items-center justify-between mb-3">
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--foreground)' }}>
                  {selectedBooking.event}
                </p>
                <button onClick={() => setSelectedBooking(null)} className="p-1 hover:bg-muted rounded">
                  <X size={14} />
                </button>
              </div>
              <p className="text-muted-foreground mb-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                {selectedBooking.room} · {selectedBooking.day}
              </p>
              <p className="mb-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--foreground)', fontWeight: 600 }}>
                {fmt(selectedBooking.start)} – {fmt(selectedBooking.end)} · {selectedBooking.user}
              </p>
              <span
                className="inline-block px-2 py-0.5 rounded border mb-4"
                style={{
                  borderColor: selectedBooking.status === "pending" ? "#F59E0B" : "var(--accent)",
                  color: selectedBooking.status === "pending" ? "#F59E0B" : "var(--accent)",
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                }}
              >
                {selectedBooking.status}
              </span>
              {selectedBooking.status === "pending" && (
                <p className="text-muted-foreground mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '12px' }}>
                  Awaiting admin approval.
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleCancel(selectedBooking.id)}
                  className="flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all hover:opacity-90"
                  style={{ background: 'var(--destructive)', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px' }}
                >
                  <X size={13} /> Cancel
                </button>
                <button
                  className="flex-1 py-2 rounded-lg border border-border hover:bg-muted transition-colors flex items-center justify-center gap-1.5"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px', color: 'var(--foreground)' }}
                >
                  <RefreshCcw size={13} /> Reschedule
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
