import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  X,
  Send,
  SkipForward,
  CheckCircle2,
  Wifi,
  Monitor,
  Mic,
  Wind,
  Plug,
  Lightbulb,
  Armchair,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  roomName?: string;
}

const ISSUE_CHIPS = [
  { id: "projector", label: "Projector issue", icon: Monitor },
  { id: "mic", label: "Mic not working", icon: Mic },
  { id: "ac", label: "A/C malfunction", icon: Wind },
  { id: "power", label: "Power/socket issue", icon: Plug },
  { id: "wifi", label: "No WiFi", icon: Wifi },
  { id: "lights", label: "Lighting problem", icon: Lightbulb },
  { id: "furniture", label: "Broken furniture", icon: Armchair },
];

export function Page6DamageModal({ isOpen, onClose, roomName = "DK5 Lecture Hall" }: Props) {
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleChip = (id: string) =>
    setSelectedChips((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedChips([]);
      setDetails("");
      onClose();
    }, 1800);
  };

  const handleSkip = () => {
    setSelectedChips([]);
    setDetails("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(13, 27, 62, 0.72)', backdropFilter: 'blur(6px)' }}
        >
          <motion.div
            initial={{ scale: 0.88, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.88, y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="w-full max-w-md mx-4 bg-card rounded-2xl overflow-hidden shadow-2xl"
          >
            {!submitted ? (
              <>
                {/* Header */}
                <div className="px-6 pt-6 pb-4" style={{ background: 'var(--primary)' }}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
                        <AlertTriangle size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-white/70" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.07em' }}>
                          POST-USE CHECK
                        </p>
                        <p className="text-white" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px' }}>
                          Room Condition Report
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleSkip}
                      className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                    >
                      <X size={16} className="text-white/60" />
                    </button>
                  </div>
                  <p className="text-white/70 mt-3" style={{ fontFamily: 'var(--font-display)', fontSize: '13px' }}>
                    Your booking for <span className="text-white font-semibold">{roomName}</span> has ended. Help us keep the space in great condition.
                  </p>
                </div>

                <div className="p-6 space-y-5">
                  {/* Survey prompt */}
                  <div>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--foreground)', marginBottom: 12 }}>
                      Is there any broken equipment or room issues to report?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ISSUE_CHIPS.map(({ id, label, icon: Icon }) => {
                        const active = selectedChips.includes(id);
                        return (
                          <button
                            key={id}
                            onClick={() => toggleChip(id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all"
                            style={{
                              background: active ? 'var(--destructive)' : 'transparent',
                              borderColor: active ? 'var(--destructive)' : 'var(--border)',
                              color: active ? 'white' : 'var(--muted-foreground)',
                              fontFamily: 'var(--font-display)',
                              fontSize: '12px',
                              fontWeight: active ? 600 : 400,
                            }}
                          >
                            <Icon size={12} />
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Text area */}
                  <div>
                    <label className="block mb-1.5" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '12px', color: 'var(--muted-foreground)' }}>
                      Additional details (optional)
                    </label>
                    <textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Describe the issue in more detail, e.g. 'Projector remote is missing'..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-destructive transition-colors resize-none"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '13px',
                        background: 'var(--input-background)',
                        color: 'var(--foreground)',
                      }}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={handleSkip}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors"
                      style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px', color: 'var(--muted-foreground)' }}
                    >
                      <SkipForward size={14} />
                      No issues, skip
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={selectedChips.length === 0 && details.trim() === ""}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
                      style={{ background: 'var(--destructive)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px' }}
                    >
                      <Send size={14} />
                      Submit Report
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(0,191,165,0.12)' }}>
                  <CheckCircle2 size={32} style={{ color: 'var(--accent)' }} />
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color: 'var(--foreground)' }}>
                  Report Submitted!
                </p>
                <p className="text-muted-foreground mt-2" style={{ fontFamily: 'var(--font-display)', fontSize: '13px' }}>
                  Thank you for helping keep FSKTM facilities in great shape.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
