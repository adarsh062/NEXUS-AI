import { useState, useEffect, useRef } from "react"
import { Sparkles, MessageSquare, Volume2, Mic, MicOff, RefreshCw, Languages, PhoneCall, PhoneOff, Award, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { Message } from "@/hooks/use-chat"
import type { User } from "@/hooks/use-auth"

// SpeechRecognition Types for TypeScript
interface IWindow extends Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
}

interface Props {
    messages: Message[]
    receiver: User | null
    onClose: () => void
}

const RESPONSE_SUGGESTIONS = [
    {
        label: "Escalate OAuth issue",
        text: "Thank you for sharing that. I am escalating this OAuth callback authentication failure to our senior infrastructure desk. We will review your client keys and update you in under 5 minutes.",
    },
    {
        label: "Request debugging logs",
        text: "Could you please send us your backend authentication server log snippet? Specifically, the parameters being returned in your OAuth callback route would help us debug this quickly.",
    },
    {
        label: "Provide API Docs link",
        text: "You can find our step-by-step API integration guide and OAuth redirect configuration parameters at: https://docs.nexus.com/auth/oauth-setup",
    },
    {
        label: "Apologize for SLA delay",
        text: "Please accept our sincere apologies for the slight delay in resolving this support ticket. Our engineering team is currently tracing the database connection SLA metrics.",
    },
]

export default function AiCopilotPanel({ messages, receiver, onClose }: Props) {
    // ── AI Summary & Metadata states ────────────────────────────────────
    const [summary, setSummary] = useState("Loading AI analysis of active support session...")
    const [sentiment, setSentiment] = useState<{ label: string; score: number; emoji: string }>({ label: "Neutral", score: 50, emoji: "😐" })
    const [category, setCategory] = useState("Unassigned")
    const [leadScore, setLeadScore] = useState("Calculating...")
    const [generating, setGenerating] = useState(false)

    // ── Translation states ──────────────────────────────────────────────
    const [lang, setLang] = useState("en")

    // ── Web Speech API states ──────────────────────────────────────────
    const [isListening, setIsListening] = useState(false)
    const [dictationTranscript, setDictationTranscript] = useState("")
    const recognitionRef = useRef<any>(null)

    // ── AI Calling / Voice Agent Call simulator states ─────────────────
    const [isCallActive, setIsCallActive] = useState(false)
    const [callStatus, setCallStatus] = useState("Disconnected")
    const [callTimer, setCallTimer] = useState(0)
    const callIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const oscRef = useRef<OscillatorNode | null>(null)

    // ── Text-to-Speech synth states ─────────────────────────────────────
    const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null)

    // ── Effect: Generate ticket intelligence on message changes ───────
    useEffect(() => {
        if (messages.length === 0) {
            setSummary("No support session interactions detected yet. Awaiting customer issue description.")
            setSentiment({ label: "Neutral", score: 50, emoji: "😐" })
            setCategory("General Query")
            setLeadScore("N/A")
            return
        }

        setGenerating(true)
        const timer = setTimeout(() => {
            // High fidelity rule-based heuristics to fake premium live GenAI categorizations
            const textContent = messages.map(m => m.text || "").join(" ").toLowerCase()
            
            // 1. Summarization
            let generatedSummary = "Customer initiated support session. "
            if (textContent.includes("oauth") || textContent.includes("callback") || textContent.includes("api")) {
                generatedSummary = "Customer is experiencing callback/redirect validation issues on their backend API endpoint. Requested immediate integration support."
            } else if (textContent.includes("billing") || textContent.includes("payment") || textContent.includes("invoice")) {
                generatedSummary = "Customer query regarding enterprise support pricing SLAs, monthly invoices, or custom billing dashboard setup."
            } else {
                generatedSummary = `Customer described their ticket details. Focus: General customer inquiry about ${receiver?.name || "the system"} dashboard functionality.`
            }
            setSummary(generatedSummary)

            // 2. Sentiment analysis
            if (textContent.includes("slow") || textContent.includes("error") || textContent.includes("fail") || textContent.includes("delay")) {
                setSentiment({ label: "Frustrated Customer", score: 28, emoji: "😠" })
            } else if (textContent.includes("thanks") || textContent.includes("great") || textContent.includes("work") || textContent.includes("awesome")) {
                setSentiment({ label: "Satisfied / Positive", score: 88, emoji: "😊" })
            } else {
                setSentiment({ label: "Calm / Neutral", score: 56, emoji: "😐" })
            }

            // 3. Category
            if (textContent.includes("oauth") || textContent.includes("api") || textContent.includes("code")) {
                setCategory("Integration Support")
            } else if (textContent.includes("billing") || textContent.includes("pay")) {
                setCategory("Billing & Subscriptions")
            } else {
                setCategory("General Operations")
            }

            // 4. Lead Score
            if (receiver?.email?.endsWith(".org") || receiver?.email?.endsWith(".com")) {
                setLeadScore("Hot Lead (92/100)")
            } else {
                setLeadScore("Support Ticket")
            }

            setGenerating(false)
        }, 800)

        return () => clearTimeout(timer)
    }, [messages, receiver])

    // ── Dictation (Speech-to-Text) using Web Speech API ────────────────
    const startDictation = () => {
        const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow
        const Recognition = SpeechRecognition || webkitSpeechRecognition

        if (!Recognition) {
            toast.error("Web Speech API recognition is not supported in this browser.")
            return
        }

        const rec = new Recognition()
        rec.continuous = true
        rec.interimResults = true
        rec.lang = "en-US"

        rec.onstart = () => {
            setIsListening(true)
            toast.success("Voice recognition active. Start speaking...")
        }

        rec.onresult = (event: any) => {
            let finalResult = ""
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalResult += event.results[i][0].transcript
                }
            }
            if (finalResult) {
                // Dispatch event to append to MessageInput text
                window.dispatchEvent(new CustomEvent("append-ai-text", { detail: { text: finalResult } }))
            }
        }

        rec.onerror = (e: any) => {
            toast.error("Speech recognition error: " + e.error)
            stopDictation()
        }

        rec.onend = () => {
            setIsListening(false)
        }

        recognitionRef.current = rec
        rec.start()
    }

    const stopDictation = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
        }
        setIsListening(false)
        toast.info("Voice recognition disabled.")
    }

    const handleToggleDictation = () => {
        if (isListening) {
            stopDictation()
        } else {
            startDictation()
        }
    }

    // ── Vocal Synth (Text-to-Speech) using Browser SpeechSynthesis ─────
    const playTts = (msgId: string, text: string) => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel()

            if (speakingMsgId === msgId) {
                setSpeakingMsgId(null)
                return
            }

            const utterance = new SpeechSynthesisUtterance(text)
            utterance.onend = () => setSpeakingMsgId(null)
            utterance.onerror = () => setSpeakingMsgId(null)

            setSpeakingMsgId(msgId)
            window.speechSynthesis.speak(utterance)
            toast.success("Synthesizing premium agent voice playback...")
        } else {
            toast.error("Vocal synthesis is not supported on this browser.")
        }
    }

    // ── Translation dispatch (Simulated Translator) ───────────────────
    const handleTranslate = (targetLang: string) => {
        setLang(targetLang)
        toast.success(`Active multilingual translate target set to: ${targetLang.toUpperCase()}`)
    }

    // ── Simulated ElevenLabs AI voice call ─────────────────────────────
    const startVoiceCall = () => {
        setIsCallActive(true)
        setCallStatus("Dialing...")
        setCallTimer(0)

        // Simple synth ringback
        try {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
            const osc = audioContextRef.current.createOscillator()
            const gain = audioContextRef.current.createGain()
            osc.connect(gain)
            gain.connect(audioContextRef.current.destination)
            osc.frequency.setValueAtTime(440, audioContextRef.current.currentTime)
            gain.gain.setValueAtTime(0.15, audioContextRef.current.currentTime)
            osc.start()
            oscRef.current = osc
            setTimeout(() => {
                osc.stop()
            }, 600)
        } catch { /* AudioContext blocker */ }

        setTimeout(() => {
            setCallStatus("Active (Voice AI Live)")
            toast.success("Voice AI Connected. Start talking directly!")
            
            callIntervalRef.current = setInterval(() => {
                setCallTimer((prev) => prev + 1)
            }, 1000)
        }, 1200)
    }

    const stopVoiceCall = () => {
        if (callIntervalRef.current) clearInterval(callIntervalRef.current)
        if (oscRef.current) {
            try { oscRef.current.stop() } catch {}
        }
        setIsCallActive(false)
        setCallStatus("Disconnected")
        setCallTimer(0)
        toast.info("Voice call finished.")
    }

    const formatCallTime = (secs: number) => {
        const m = Math.floor(secs / 60)
        const s = secs % 60
        return `${m}:${s < 10 ? "0" : ""}${s}`
    }

    // ── Apply suggestions ───────────────────────────────────────────────
    const handleApplySuggestion = (text: string) => {
        window.dispatchEvent(new CustomEvent("insert-ai-text", { detail: { text } }))
        toast.success("Copilot template loaded into editor!")
    }

    return (
        <div className="w-80 border-l bg-card flex flex-col h-full shrink-0 select-none overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-muted/40">
                <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary animate-pulse" />
                    <span className="font-bold text-sm">Nexus AI Copilot</span>
                </div>
                <button
                    onClick={onClose}
                    className="text-xs text-muted-foreground hover:text-foreground border px-2 py-0.5 rounded-md hover:bg-muted transition-colors"
                >
                    Hide
                </button>
            </div>

            {/* Content Container */}
            <div className="p-4 space-y-5 flex-1 overflow-y-auto thin-scrollbar">
                
                {/* 1. Ticket classification & sentiment analytics */}
                <div className="rounded-lg border bg-muted/30 p-3 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-muted-foreground">SaaS Ticket Queue:</span>
                        <span className="font-mono font-bold text-primary">{category}</span>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                            <span className="text-muted-foreground">Customer Sentiment:</span>
                            <span className="font-semibold flex items-center gap-1 text-primary">
                                {sentiment.emoji} {sentiment.label}
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                    sentiment.score < 40 ? "bg-rose-500" : sentiment.score < 70 ? "bg-amber-500" : "bg-emerald-500"
                                }`}
                                style={{ width: `${sentiment.score}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-dashed">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Award className="size-3.5 text-primary" />
                            Lead Qualification:
                        </span>
                        <span className="font-bold text-emerald-500">{leadScore}</span>
                    </div>
                </div>

                {/* 2. AI Live ticket summary */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            AI Support Summary
                        </label>
                        {generating && <RefreshCw className="size-3.5 animate-spin text-primary" />}
                    </div>
                    <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg text-xs leading-relaxed text-foreground">
                        {summary}
                    </div>
                </div>

                {/* 3. Speech AI dictation panel */}
                <div className="space-y-2.5 border-t pt-4">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                        Voice Dictation Desk
                    </label>
                    <div className="flex gap-2">
                        <Button
                            variant={isListening ? "destructive" : "default"}
                            className="w-full text-xs font-semibold text-white hover:opacity-90 flex items-center justify-center gap-1.5 rounded-lg"
                            onClick={handleToggleDictation}
                        >
                            {isListening ? (
                                <>
                                    <MicOff className="size-4" />
                                    Stop Listening
                                </>
                            ) : (
                                <>
                                    <Mic className="size-4 animate-bounce" />
                                    Voice AI Input
                                </>
                            )}
                        </Button>
                    </div>
                    {isListening && (
                        <div className="flex items-center justify-center gap-1.5 py-1.5 bg-rose-500/10 rounded-lg border border-rose-500/20 text-rose-500 text-[10px] font-bold">
                            <span className="size-2 bg-rose-500 rounded-full animate-ping" />
                            Dictating speech live to editor...
                        </div>
                    )}
                </div>

                {/* 4. TTS Synthetic Playback widget */}
                {messages.length > 0 && (
                    <div className="space-y-2.5 border-t pt-4">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                            Synthetic Vocal desk
                        </label>
                        <div className="space-y-1.5">
                            {messages.filter(m => m.senderId !== receiver?._id).slice(-2).map((m) => (
                                <div key={m._id} className="flex items-center justify-between p-2 rounded-lg bg-muted/20 border text-xs">
                                    <span className="truncate max-w-[150px] italic">"{m.text || "Photo message"}"</span>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="size-7 hover:bg-primary/10 hover:text-primary shrink-0"
                                        onClick={() => playTts(m._id, m.text || "")}
                                        title="Speak message"
                                    >
                                        <Volume2 className={`size-3.5 ${speakingMsgId === m._id ? "text-primary animate-bounce" : ""}`} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. Multilingual replies */}
                <div className="space-y-2.5 border-t pt-4">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Languages className="size-4 text-primary" />
                        Multilingual translator
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                        {[
                            { code: "es", name: "Spanish" },
                            { code: "fr", name: "French" },
                            { code: "de", name: "German" },
                            { code: "hi", name: "Hindi" },
                        ].map((l) => (
                            <button
                                key={l.code}
                                onClick={() => handleTranslate(l.code)}
                                className={`px-2 py-1 text-[10px] font-semibold border rounded-lg transition-all ${
                                    lang === l.code ? "bg-primary text-white border-primary" : "bg-muted/40 hover:bg-muted text-muted-foreground"
                                }`}
                            >
                                {l.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 6. AI Voice Calling simulator widget */}
                <div className="space-y-2.5 border-t pt-4">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                        Voice Call Operator Desk
                    </label>
                    <div className="border rounded-xl p-3 bg-gradient-to-br from-sky-950/20 to-card flex flex-col items-center text-center space-y-2.5">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary">
                            {isCallActive ? <Volume2 className="size-5 animate-ping text-primary" /> : <PhoneCall className="size-5" />}
                        </div>
                        <div>
                            <p className="text-xs font-bold">Voice Call AI Operator</p>
                            <p className="text-[10px] text-muted-foreground font-semibold">{callStatus}</p>
                        </div>
                        {isCallActive ? (
                            <div className="w-full space-y-2">
                                <div className="text-xs font-mono font-bold text-primary animate-pulse">
                                    Call duration: {formatCallTime(callTimer)}
                                </div>
                                <Button
                                    variant="destructive"
                                    className="w-full text-xs font-bold text-white rounded-lg gap-1.5"
                                    onClick={stopVoiceCall}
                                >
                                    <PhoneOff className="size-4" />
                                    End Voice Session
                                </Button>
                            </div>
                        ) : (
                            <Button
                                className="w-full text-xs font-bold text-white rounded-lg gap-1.5"
                                onClick={startVoiceCall}
                            >
                                <PhoneCall className="size-4" />
                                Connect Voice Call
                            </Button>
                        )}
                    </div>
                </div>

                {/* 7. Auto Response Suggestions */}
                <div className="space-y-2.5 border-t pt-4">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                        Response Suggestion Chips
                    </label>
                    <div className="space-y-2">
                        {RESPONSE_SUGGESTIONS.map((s) => (
                            <button
                                key={s.label}
                                className="w-full text-left p-2.5 border rounded-lg text-[11px] leading-snug font-medium text-foreground bg-muted/10 hover:bg-primary/5 hover:border-primary/20 transition-all"
                                onClick={() => handleApplySuggestion(s.text)}
                            >
                                <span className="font-extrabold text-primary block mb-0.5">✦ {s.label}</span>
                                <span className="text-muted-foreground block line-clamp-2">{s.text}</span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}
