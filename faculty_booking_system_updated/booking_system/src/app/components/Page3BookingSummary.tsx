import { useState } from "react";
import {
  ArrowLeft,
  Mic,
  Monitor,
  Plug,
  ChevronUp,
  ChevronDown,
  Clock,
  Calendar,
  MapPin,
  Users,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Ban,
} from "lucide-react";
import type { RoomCard } from "./Page2SmartRecommend";

interface Props {
  room: RoomCard | null;
  onBack: () => void;
  onConfirm: () => void;
}

const ADD_ONS = [
  { id: "mic", label: "Microphone", icon: Mic, price: 0, desc: "Wired/wireless handset" },
  { id: "projector", label: "Projector", icon: Monitor, price: 0, desc: "HDMI + VGA input" },
  { id: "ext", label: "Extension Wire", icon: Plug, price: 0, desc: "5m multi-socket" },
  { id: "chairs", label: "Extra Chairs", icon: Users, price: 0, desc: "Folding chairs, 10 per unit" },
];

const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

// Existing bookings to check conflicts against
const EXISTING_BOOKINGS = [
  { room: "DK5 Lecture Hall", day: "Mon", start: "09:00", end: "11:00" },
  { room: "Meeting Room 3B", day: "Mon", start: "14:00", end: "16:00" },
  { room: "Innovation Lab", day: "Tue", start: "10:00", end: "18:00" },
  { room: "Seminar Room A", day: "Wed", start: "08:00", end: "10:00" },
  { room: "Computer Lab 1", day: "Wed", start: "13:00", end: "15:00" },
  { room: "DK5 Lecture Hall", day: "Thu", start: "09:00", end: "12:00" },
  { room: "Meeting Room 2A", day: "Fri", start: "14:00", end: "16:00" },
];

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekday(dateStr: string): string {
  const d = new Date(dateStr);
  return DAY_NAMES[d.getDay() === 0 ? 6 : d.getDay() - 1] ?? "Mon";
}

function isConflict(roomName: string, date: string, start: string, end: string): boolean {
  const day = getWeekday(date);
  return EXISTING_BOOKINGS.some(
    (b) =>
      b.room === roomName &&
      b.day === day &&
      !(end <= b.start || start >= b.end)
  );
}

function to12h(t: string) {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

export function Page3BookingSummary({ room, onBack, onConfirm }: Props) {
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, number>>({});
  const [is24h, setIs24h] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [date, setDate] = useState("2025-06-09");
  const [purpose, setPurpose] = useState("");
  const [emailNotify, setEmailNotify] = useState(true);
  const [confirming, setConfirming] = useState(false);

  const toggleAddOn = (id: string) =>
    setSelectedAddOns((prev) =>
      prev[id] !== undefined ? Object.fromEntries(Object.entries(prev).filter(([k]) => k !== id)) : { ...prev, [id]: 1 }
    );

  const adjustQty = (id: string, delta: number) =>
    setSelectedAddOns((prev) => {
      const cur = prev[id] ?? 1;
      const next = Math.max(1, cur + delta);
      return { ...prev, [id]: next };
    });

  const fmt = (t: string) => (is24h ? t : to12h(t));

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      onConfirm();
    }, 1200);
  };

  const defaultRoom = room ?? {
    id: "R001",
    name: "DK5 Lecture Hall",
    floor: "Level 5",
    capacity: 120,
    matchScore: 97,
    event: "Workshop",
    facilities: ["Projector", "Microphone", "Air-Con", "WiFi"],
    available: "09:00 – 12:00",
    image: "",
  };

  const conflict = isConflict(defaultRoom.name, date, startTime, endTime);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b border-border px-8 py-4 flex items-center gap-4 shrink-0">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft size={18} className="text-muted-foreground" />
        </button>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color: 'var(--foreground)' }}>
            Facility Add-Ons & Booking Summary
          </h1>
          <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-display)', fontSize: '13px' }}>
            Configure your reservation and confirm.
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2 rounded-full border border-border overflow-hidden">
          <button
            onClick={() => setIs24h(false)}
            className="px-3 py-1.5 transition-colors"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              background: !is24h ? 'var(--primary)' : 'transparent',
              color: !is24h ? 'white' : 'var(--muted-foreground)',
            }}
          >
            12h
          </button>
          <button
            onClick={() => setIs24h(true)}
            className="px-3 py-1.5 transition-colors"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              background: is24h ? 'var(--primary)' : 'transparent',
              color: is24h ? 'white' : 'var(--muted-foreground)',
            }}
          >
            24h
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6">

          {/* Left: Config */}
          <div className="col-span-2 space-y-5">

            {/* Room Info */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', color: 'var(--muted-foreground)', letterSpacing: '0.05em' }}>
                  SELECTED ROOM
                </p>
              </div>
              <div className="px-6 py-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--secondary)' }}>
                  <MapPin size={22} style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--foreground)' }}>
                    {defaultRoom.name}
                  </p>
                  <div className="flex gap-3 mt-1">
                    <span className="flex items-center gap-1 text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                      <MapPin size={11} /> {defaultRoom.floor}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                      <Users size={11} /> {defaultRoom.capacity} pax
                    </span>
                    <span className="px-2 py-0.5 rounded text-white" style={{ background: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                      Match {defaultRoom.matchScore}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', color: 'var(--muted-foreground)', letterSpacing: '0.05em' }}>
                  DATE & TIME
                </p>
              </div>
              <div className="px-6 py-4 grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1.5 text-muted-foreground" style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 600 }}>
                    <Calendar size={11} className="inline mr-1" /> Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border outline-none focus:border-accent transition-colors"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', background: 'var(--input-background)', color: 'var(--foreground)' }}
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-muted-foreground" style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 600 }}>
                    <Clock size={11} className="inline mr-1" /> Start
                  </label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border outline-none focus:border-accent transition-colors"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', background: 'var(--input-background)', color: 'var(--foreground)' }}
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{fmt(t)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5 text-muted-foreground" style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 600 }}>
                    <Clock size={11} className="inline mr-1" /> End
                  </label>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border outline-none focus:border-accent transition-colors"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', background: 'var(--input-background)', color: 'var(--foreground)' }}
                  >
                    {TIME_SLOTS.filter((t) => t > startTime).map((t) => (
                      <option key={t} value={t}>{fmt(t)}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Time preview strip */}
              <div className="mx-6 mb-4 px-4 py-3 rounded-lg flex items-center justify-between" style={{ background: 'var(--secondary)' }}>
                <div className="flex items-center gap-2">
                  <Clock size={14} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '14px', color: 'var(--primary)' }}>
                    {fmt(startTime)}
                  </span>
                </div>
                <div className="flex-1 mx-4 h-0.5 rounded-full" style={{ background: 'var(--border)' }} />
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '14px', color: 'var(--primary)' }}>
                    {fmt(endTime)}
                  </span>
                  <Clock size={14} style={{ color: 'var(--primary)' }} />
                </div>
              </div>
              {conflict && (
                <div className="mx-6 mb-4 flex items-center gap-2 px-4 py-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <Ban size={14} style={{ color: '#EF4444' }} />
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: '#991B1B', fontWeight: 600 }}>
                    Room is already booked during this time slot.
                  </span>
                </div>
              )}
            </div>

            {/* Add-Ons Grid */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', color: 'var(--muted-foreground)', letterSpacing: '0.05em' }}>
                  FACILITY ADD-ON REQUEST
                </p>
                <p className="text-muted-foreground mt-0.5" style={{ fontFamily: 'var(--font-display)', fontSize: '12px' }}>
                  Select equipment to attach to your booking.
                </p>
              </div>
              <div className="p-6 grid grid-cols-2 gap-3">
                {ADD_ONS.map(({ id, label, icon: Icon, desc }) => {
                  const active = id in selectedAddOns;
                  return (
                    <div
                      key={id}
                      className="rounded-xl border-2 p-4 transition-all cursor-pointer"
                      style={{
                        borderColor: active ? 'var(--accent)' : 'var(--border)',
                        background: active ? 'rgba(0,191,165,0.06)' : 'transparent',
                      }}
                      onClick={() => toggleAddOn(id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: active ? 'rgba(0,191,165,0.15)' : 'var(--muted)' }}>
                          <Icon size={18} style={{ color: active ? 'var(--accent)' : 'var(--muted-foreground)' }} />
                        </div>
                        {active && (
                          <CheckCircle2 size={16} style={{ color: 'var(--accent)' }} />
                        )}
                      </div>
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px', color: 'var(--foreground)' }}>{label}</p>
                      <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-display)', fontSize: '11px' }}>{desc}</p>
                      {active && (
                        <div className="flex items-center gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => adjustQty(id, -1)} className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-muted">
                            <ChevronDown size={12} />
                          </button>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>
                            {selectedAddOns[id]}
                          </span>
                          <button onClick={() => adjustQty(id, 1)} className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-muted">
                            <ChevronUp size={12} />
                          </button>
                          <span className="text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>unit{selectedAddOns[id] > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Purpose */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', color: 'var(--muted-foreground)', letterSpacing: '0.05em' }}>
                  EVENT DETAILS
                </p>
              </div>
              <div className="p-6">
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Describe the purpose or agenda of your event..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-border outline-none focus:border-accent transition-colors resize-none"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '13px', background: 'var(--input-background)', color: 'var(--foreground)' }}
                />
                <label className="flex items-center gap-3 mt-3 cursor-pointer">
                  <div
                    className="w-9 h-5 rounded-full transition-colors relative shrink-0"
                    style={{ background: emailNotify ? 'var(--accent)' : 'var(--switch-background)' }}
                    onClick={() => setEmailNotify(!emailNotify)}
                  >
                    <div
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                      style={{ transform: emailNotify ? 'translateX(17px)' : 'translateX(2px)' }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-muted-foreground" />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--foreground)' }}>
                      Send automated email reminder notification
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="col-span-1">
            <div className="bg-card rounded-xl border border-border overflow-hidden sticky top-6">
              <div className="px-5 py-4 border-b border-border" style={{ background: 'var(--primary)' }}>
                <p className="text-white" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px' }}>
                  Booking Summary
                </p>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-muted-foreground mb-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.06em' }}>ROOM</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px', color: 'var(--foreground)' }}>{defaultRoom.name}</p>
                  <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{defaultRoom.floor} · {defaultRoom.capacity} pax</p>
                </div>
                <div className="h-px bg-border" />
                <div>
                  <p className="text-muted-foreground mb-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.06em' }}>DATE</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px', color: 'var(--foreground)' }}>{date}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.06em' }}>TIME</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '14px', color: 'var(--primary)' }}>
                    {fmt(startTime)} – {fmt(endTime)}
                  </p>
                </div>
                {Object.keys(selectedAddOns).length > 0 && (
                  <>
                    <div className="h-px bg-border" />
                    <div>
                      <p className="text-muted-foreground mb-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.06em' }}>ADD-ONS</p>
                      {Object.entries(selectedAddOns).map(([id, qty]) => {
                        const addon = ADD_ONS.find((a) => a.id === id)!;
                        const Icon = addon.icon;
                        return (
                          <div key={id} className="flex items-center gap-2 mb-1.5">
                            <Icon size={12} className="text-muted-foreground" />
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: 'var(--foreground)' }}>{addon.label}</span>
                            <span className="ml-auto px-1.5 py-0.5 rounded" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', background: 'var(--secondary)', color: 'var(--primary)' }}>×{qty}</span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
                {emailNotify && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: 'rgba(0,191,165,0.08)' }}>
                    <Mail size={12} style={{ color: 'var(--accent)' }} />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--accent)' }}>Email reminder active</span>
                  </div>
                )}
                <div className="h-px bg-border" />
                <div className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: 'rgba(245,158,11,0.08)' }}>
                  <AlertTriangle size={13} style={{ color: '#F59E0B', marginTop: 2 }} />
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: '#92400E' }}>
                    Bookings must be cancelled 2 hours prior to avoid penalties.
                  </p>
                </div>
                {conflict && (
                  <div className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}>
                    <Ban size={13} style={{ color: '#EF4444', marginTop: 2 }} />
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: '#991B1B', fontWeight: 600 }}>
                      This room is already occupied at your selected time. Please choose a different time or room.
                    </p>
                  </div>
                )}
                <button
                  onClick={handleConfirm}
                  disabled={confirming || conflict}
                  className="w-full py-3 rounded-xl text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: conflict ? '#9CA3AF' : confirming ? 'var(--accent)' : 'var(--primary)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px' }}
                >
                  {confirming ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Confirming…
                    </>
                  ) : conflict ? (
                    <>
                      <Ban size={16} />
                      Room Unavailable
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Confirm Reservation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
