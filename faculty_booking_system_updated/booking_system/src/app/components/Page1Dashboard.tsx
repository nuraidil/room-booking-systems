import {
  CalendarDays,
  Clock,
  MapPin,
  Plus,
  Users,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Bell,
  BookOpen,
  LayoutGrid,
  TrendingUp,
} from "lucide-react";

interface Props {
  onCreateBooking: () => void;
  onViewCalendar: () => void;
}

const activeBookings = [
  {
    id: "BK-2024-001",
    room: "DK5 Lecture Hall",
    floor: "Level 5",
    date: "Mon, 9 Jun 2025",
    start: "09:00",
    end: "11:00",
    start12: "9:00 AM",
    end12: "11:00 AM",
    capacity: 120,
    status: "confirmed",
    event: "Workshop",
    color: "#00BFA5",
  },
  {
    id: "BK-2024-002",
    room: "Meeting Room 3B",
    floor: "Level 3",
    date: "Wed, 11 Jun 2025",
    start: "14:00",
    end: "16:00",
    start12: "2:00 PM",
    end12: "4:00 PM",
    capacity: 20,
    status: "pending",
    event: "Meeting",
    color: "#F59E0B",
  },
  {
    id: "BK-2024-003",
    room: "Innovation Lab",
    floor: "Level 2",
    date: "Fri, 13 Jun 2025",
    start: "10:00",
    end: "18:00",
    start12: "10:00 AM",
    end12: "6:00 PM",
    capacity: 60,
    status: "confirmed",
    event: "Hackathon",
    color: "#8B5CF6",
  },
];

const recentActivity = [
  { action: "Booking confirmed", room: "DK5 Lecture Hall", time: "2 hrs ago", icon: CheckCircle2, color: "#00BFA5" },
  { action: "Room report submitted", room: "Meeting Room 2A", time: "Yesterday", icon: AlertCircle, color: "#F59E0B" },
  { action: "Booking cancelled", room: "Computer Lab 1", time: "2 days ago", icon: AlertCircle, color: "#EF4444" },
];

export function Page1Dashboard({ onCreateBooking, onViewCalendar }: Props) {
  const is24h = false;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-60 bg-sidebar flex flex-col shrink-0">
        <div className="px-6 pt-6 pb-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded bg-accent flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white leading-none" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px' }}>FSKTM</p>
              <p className="text-sidebar-accent-foreground leading-none mt-0.5" style={{ fontFamily: 'var(--font-display)', fontSize: '10px' }}>Venue Booking</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 pt-4 space-y-0.5">
          {[
            { label: "Dashboard", icon: LayoutGrid, active: true },
            { label: "My Bookings", icon: CalendarDays, active: false },
            { label: "Calendar", icon: Clock, active: false },
            { label: "Reports", icon: TrendingUp, active: false },
          ].map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              onClick={label === "Calendar" ? onViewCalendar : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-colors text-left ${
                active
                  ? "bg-sidebar-accent text-white"
                  : "text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-white"
              }`}
              style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: active ? 600 : 400 }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
              <span className="text-white" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '12px' }}>AN</span>
            </div>
            <div className="min-w-0">
              <p className="text-white truncate" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '12px' }}>Ahmad Naqiuddin</p>
              <p className="text-sidebar-accent-foreground truncate" style={{ fontFamily: 'var(--font-display)', fontSize: '10px' }}>A22CS0045</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col overflow-auto">
        {/* Topbar */}
        <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: 'var(--foreground)' }}>
              Good morning, Ahmad 👋
            </h1>
            <p className="text-muted-foreground mt-0.5" style={{ fontFamily: 'var(--font-display)', fontSize: '13px' }}>
              Sunday, 7 June 2026 · FSKTM Faculty of Computing
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell size={18} className="text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
            </button>
            <button
              onClick={onCreateBooking}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white transition-all hover:opacity-90 active:scale-95 shadow-sm"
              style={{ background: 'var(--primary)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px' }}
            >
              <Plus size={16} />
              Create New Booking
            </button>
          </div>
        </header>

        <div className="flex-1 p-8 space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Active Bookings", value: "3", sub: "This month", icon: CalendarDays, color: "var(--primary)" },
              { label: "Hours Booked", value: "14h", sub: "This week", icon: Clock, color: "var(--accent)" },
              { label: "Rooms Used", value: "5", sub: "All time", icon: MapPin, color: "#8B5CF6" },
            ].map(({ label, value, sub, icon: Icon, color }) => (
              <div key={label} className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-display)', fontSize: '12px' }}>{label}</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '22px', color: 'var(--foreground)', lineHeight: 1.2 }}>{value}</p>
                  <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Active Bookings */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--foreground)' }}>
                Active Bookings
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-white" style={{ background: 'var(--primary)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                {activeBookings.length}
              </span>
            </div>
            <div className="divide-y divide-border">
              {activeBookings.map((b) => (
                <div key={b.id} className="px-6 py-4 flex items-center gap-4 hover:bg-muted/40 transition-colors group">
                  <div
                    className="w-1 h-14 rounded-full shrink-0"
                    style={{ background: b.color }}
                  />
                  <div className="flex-1 min-w-0">
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
                          borderColor: b.status === "confirmed" ? "var(--accent)" : "#F59E0B",
                          color: b.status === "confirmed" ? "var(--accent)" : "#F59E0B",
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                        }}
                      >
                        {b.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span className="flex items-center gap-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                        <CalendarDays size={11} /> {b.date}
                      </span>
                      <span className="flex items-center gap-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                        <Clock size={11} />
                        {is24h ? `${b.start} – ${b.end}` : `${b.start12} – ${b.end12}`}
                      </span>
                      <span className="flex items-center gap-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                        <MapPin size={11} /> {b.floor}
                      </span>
                      <span className="flex items-center gap-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                        <Users size={11} /> {b.capacity} cap.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{b.id}</span>
                    <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Recent Activity */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--foreground)' }}>Recent Activity</h3>
              </div>
              <div className="divide-y divide-border">
                {recentActivity.map((a, i) => (
                  <div key={i} className="px-5 py-3 flex items-center gap-3">
                    <a.icon size={16} style={{ color: a.color, shrink: 0 }} />
                    <div className="flex-1 min-w-0">
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px', color: 'var(--foreground)' }}>{a.action}</p>
                      <p className="text-muted-foreground truncate" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{a.room}</p>
                    </div>
                    <span className="text-muted-foreground shrink-0" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{a.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Create CTA */}
            <div
              className="rounded-xl p-6 flex flex-col justify-between relative overflow-hidden"
              style={{ background: 'var(--primary)' }}
            >
              <div
                className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10"
                style={{ background: 'var(--accent)' }}
              />
              <div
                className="absolute -right-4 bottom-0 w-28 h-28 rounded-full opacity-10"
                style={{ background: 'white' }}
              />
              <div>
                <p className="text-white/60 mb-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em' }}>QUICK ACCESS</p>
                <h3 className="text-white" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', lineHeight: 1.3 }}>
                  Need a room<br />right now?
                </h3>
                <p className="text-white/60 mt-2" style={{ fontFamily: 'var(--font-display)', fontSize: '13px' }}>
                  Our smart engine matches you to the best available space in seconds.
                </p>
              </div>
              <button
                onClick={onCreateBooking}
                className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-lg text-primary w-fit transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px' }}
              >
                <Plus size={15} />
                Create New Booking
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
