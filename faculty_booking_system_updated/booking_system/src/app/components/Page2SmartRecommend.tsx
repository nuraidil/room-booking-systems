import { useState } from "react";
import {
  ArrowLeft,
  Users,
  MapPin,
  Star,
  Wifi,
  Monitor,
  Mic,
  Plug,
  Wind,
  ChevronRight,
  Sliders,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface Props {
  onBack: () => void;
  onSelectRoom: (room: RoomCard) => void;
}

export interface RoomCard {
  id: string;
  name: string;
  floor: string;
  capacity: number;
  matchScore: number;
  event: string;
  facilities: string[];
  available: string;
  image: string;
}

const EVENT_TYPES = ["Workshop", "Hackathon", "Meeting", "Lecture", "Seminar"];
const FACILITIES = ["Projector", "Microphone", "Whiteboard", "Air-Con", "WiFi", "HDMI"];
const FLOORS = ["Any Floor", "Level 1", "Level 2", "Level 3", "Level 4", "Level 5"];

const ALL_ROOMS: RoomCard[] = [
  {
    id: "R001",
    name: "DK5 Lecture Hall",
    floor: "Level 5",
    capacity: 120,
    matchScore: 97,
    event: "Workshop",
    facilities: ["Projector", "Microphone", "Air-Con", "WiFi"],
    available: "09:00 – 12:00",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=200&fit=crop&auto=format",
  },
  {
    id: "R002",
    name: "Innovation Lab",
    floor: "Level 2",
    capacity: 60,
    matchScore: 91,
    event: "Hackathon",
    facilities: ["Projector", "Whiteboard", "WiFi", "HDMI"],
    available: "10:00 – 18:00",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop&auto=format",
  },
  {
    id: "R003",
    name: "Meeting Room 3B",
    floor: "Level 3",
    capacity: 20,
    matchScore: 85,
    event: "Meeting",
    facilities: ["Projector", "Whiteboard", "Air-Con"],
    available: "14:00 – 17:00",
    image: "https://images.unsplash.com/photo-1560264280-88b68371db39?w=400&h=200&fit=crop&auto=format",
  },
  {
    id: "R004",
    name: "Seminar Room A",
    floor: "Level 4",
    capacity: 45,
    matchScore: 78,
    event: "Seminar",
    facilities: ["Microphone", "WiFi", "Air-Con"],
    available: "08:00 – 13:00",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=200&fit=crop&auto=format",
  },
  {
    id: "R005",
    name: "Computer Lab 1",
    floor: "Level 1",
    capacity: 35,
    matchScore: 72,
    event: "Workshop",
    facilities: ["Projector", "WiFi", "HDMI"],
    available: "11:00 – 14:00",
    image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400&h=200&fit=crop&auto=format",
  },
];

const facilityIcon = (f: string) => {
  switch (f) {
    case "Projector": return Monitor;
    case "Microphone": return Mic;
    case "WiFi": return Wifi;
    case "Air-Con": return Wind;
    case "HDMI": return Plug;
    case "Whiteboard": return CheckCircle2;
    default: return CheckCircle2;
  }
};

export function Page2SmartRecommend({ onBack, onSelectRoom }: Props) {
  const [capacity, setCapacity] = useState(30);
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["Workshop"]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(["Projector", "WiFi"]);
  const [selectedFloor, setSelectedFloor] = useState("Any Floor");

  const toggleEvent = (e: string) =>
    setSelectedEvents((prev) => prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]);

  const toggleFacility = (f: string) =>
    setSelectedFacilities((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);

  const filtered = ALL_ROOMS
    .filter((r) => r.capacity >= capacity)
    .filter((r) => selectedEvents.length === 0 || selectedEvents.includes(r.event))
    .filter((r) => selectedFacilities.length === 0 || selectedFacilities.every((f) => r.facilities.includes(f)))
    .filter((r) => selectedFloor === "Any Floor" || r.floor === selectedFloor)
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-8 py-4 flex items-center gap-4 shrink-0">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft size={18} className="text-muted-foreground" />
        </button>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color: 'var(--foreground)' }}>
            Smart Room Recommender
          </h1>
          <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-display)', fontSize: '13px' }}>
            Tell us what you need — we'll find the best match.
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(0,191,165,0.1)', border: '1px solid rgba(0,191,165,0.3)' }}>
          <Sparkles size={14} style={{ color: 'var(--accent)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)' }}>AI-Powered Engine</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Filters Panel */}
        <aside className="w-72 bg-card border-r border-border overflow-y-auto p-6 space-y-6 shrink-0">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Sliders size={14} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '12px', letterSpacing: '0.06em' }}>FILTERS</span>
          </div>

          {/* Capacity Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px', color: 'var(--foreground)' }}>
                <Users size={13} className="inline mr-1.5" />
                Min. Capacity
              </label>
              <span className="px-2 py-0.5 rounded" style={{ background: 'var(--primary)', color: 'white', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                {capacity}
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={150}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: '#000000' }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }}>5</span>
              <span className="text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }}>150</span>
            </div>
          </div>

          {/* Event Type */}
          <div>
            <label className="block mb-3" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px', color: 'var(--foreground)' }}>
              Event Type
            </label>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((e) => (
                <button
                  key={e}
                  onClick={() => toggleEvent(e)}
                  className="px-3 py-1.5 rounded-lg border transition-all"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '12px',
                    fontWeight: selectedEvents.includes(e) ? 600 : 400,
                    background: selectedEvents.includes(e) ? 'var(--primary)' : 'transparent',
                    color: selectedEvents.includes(e) ? 'white' : 'var(--muted-foreground)',
                    borderColor: selectedEvents.includes(e) ? 'var(--primary)' : 'var(--border)',
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div>
            <label className="block mb-3" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px', color: 'var(--foreground)' }}>
              Required Facilities
            </label>
            <div className="space-y-2">
              {FACILITIES.map((f) => {
                const Icon = facilityIcon(f);
                return (
                  <label
                    key={f}
                    className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-muted"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div
                      className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors"
                      style={{
                        borderColor: selectedFacilities.includes(f) ? 'var(--accent)' : 'var(--border)',
                        background: selectedFacilities.includes(f) ? 'var(--accent)' : 'transparent',
                      }}
                      onClick={() => toggleFacility(f)}
                    >
                      {selectedFacilities.includes(f) && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <Icon size={14} className="text-muted-foreground" />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--foreground)' }}>{f}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Floor */}
          <div>
            <label className="block mb-3" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px', color: 'var(--foreground)' }}>
              <MapPin size={13} className="inline mr-1.5" />
              Preferred Floor
            </label>
            <div className="space-y-1">
              {FLOORS.map((fl) => (
                <button
                  key={fl}
                  onClick={() => setSelectedFloor(fl)}
                  className="w-full text-left px-3 py-2 rounded-lg transition-colors"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '12px',
                    background: selectedFloor === fl ? 'var(--secondary)' : 'transparent',
                    color: selectedFloor === fl ? 'var(--primary)' : 'var(--muted-foreground)',
                    fontWeight: selectedFloor === fl ? 600 : 400,
                  }}
                >
                  {fl}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--foreground)' }}>
                {filtered.length} room{filtered.length !== 1 ? "s" : ""} matched
              </p>
              <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                Ranked by compatibility score
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-display)', fontSize: '14px' }}>
                  No rooms match your current filters. Try adjusting your requirements.
                </p>
              </div>
            )}
            {filtered.map((room, idx) => (
              <button
                key={room.id}
                onClick={() => onSelectRoom(room)}
                className="w-full bg-card rounded-xl border border-border overflow-hidden hover:border-accent transition-all hover:shadow-md group text-left"
                style={{ borderWidth: idx === 0 ? '2px' : '1px', borderColor: idx === 0 ? 'var(--accent)' : undefined }}
              >
                <div className="flex">
                  <div className="w-44 h-32 shrink-0 overflow-hidden bg-muted">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 p-4 flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {idx === 0 && (
                          <span className="px-2 py-0.5 rounded text-white" style={{ background: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                            BEST MATCH
                          </span>
                        )}
                        <span className="text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }}>{room.id}</span>
                      </div>
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--foreground)' }}>
                        {room.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-muted-foreground">
                        <span className="flex items-center gap-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                          <MapPin size={11} /> {room.floor}
                        </span>
                        <span className="flex items-center gap-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                          <Users size={11} /> {room.capacity} pax
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {room.facilities.map((f) => {
                          const Ic = facilityIcon(f);
                          return (
                            <span key={f} className="flex items-center gap-1 px-2 py-0.5 rounded bg-secondary" style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--secondary-foreground)' }}>
                              <Ic size={10} /> {f}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center gap-1">
                        <Star size={13} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: 'var(--foreground)' }}>
                          {room.matchScore}
                        </span>
                        <span className="text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }}>/100</span>
                      </div>
                      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${room.matchScore}%`, background: room.matchScore > 90 ? 'var(--accent)' : room.matchScore > 75 ? '#F59E0B' : '#EF4444' }} />
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground group-hover:text-accent transition-colors mt-2" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
