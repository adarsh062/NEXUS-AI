import { useEffect, useState, useRef } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"
import { authApi } from "@/lib/api"
import { toast } from "sonner"
import { Zap, Smile, ShieldCheck, ArrowRight, Send, Eye, EyeOff, RotateCcw, ArrowLeft } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Types for the mock simulator
interface MockMessage {
    id: string
    text: string
    sender: "user" | "agent"
    time: string
}

const MOCK_MESSAGES_SOURCE = [
    { text: "Hi! I need help with my order.", sender: "user" as const, time: "10:30 AM" },
    { text: "Hello 👋 Sure, I'd be happy to help you.", sender: "agent" as const, time: "10:30 AM" },
    { text: "Can you tell me where my package is?", sender: "user" as const, time: "10:31 AM" },
    { text: "Yes! It's expected to arrive tomorrow by 5 PM.", sender: "agent" as const, time: "10:31 AM" },
]

interface HomeProps {
    initialView?: "chat" | "login" | "signup"
}

export default function Home({ initialView = "chat" }: HomeProps) {
    const { user, login, loginWithOtp, register } = useAuth()
    const navigate = useNavigate()

    // View State (Single Page experience)
    const [view, setView] = useState<"chat" | "login" | "signup">(initialView)

    // Sync state with prop if it changes via routing
    useEffect(() => {
        setView(initialView)
    }, [initialView])

    // Simulator State
    const [messages, setMessages] = useState<MockMessage[]>([])
    const [typingText, setTypingText] = useState("")
    const [isAgentTyping, setIsAgentTyping] = useState(false)
    const chatScrollRef = useRef<HTMLDivElement>(null)

    // Login Form State
    const [pwEmail, setPwEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [pwLoading, setPwLoading] = useState(false)

    // OTP State
    const [otpEmail, setOtpEmail] = useState("")
    const [otpCode, setOtpCode] = useState("")
    const [otpSent, setOtpSent] = useState(false)
    const [otpCountdown, setOtpCountdown] = useState(0)
    const [otpLoading, setOtpLoading] = useState(false)
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // SignUp State
    const [suName, setSuName] = useState("")
    const [suEmail, setSuEmail] = useState("")
    const [suPassword, setSuPassword] = useState("")
    const [suConfirmPassword, setSuConfirmPassword] = useState("")
    const [suShowPass, setSuShowPass] = useState(false)
    const [suShowConfirm, setSuShowConfirm] = useState(false)
    const [suLoading, setSuLoading] = useState(false)

    // Looping chat simulation effect
    useEffect(() => {
        let isCancelled = false
        const delays = [0, 800, 2400, 3400, 4800, 5600, 7200, 8200, 9600, 14000]
        const timers: ReturnType<typeof setTimeout>[] = []

        const runSimulation = () => {
            if (isCancelled) return

            // Reset
            setMessages([])
            setTypingText("")
            setIsAgentTyping(false)

            // Step 1: User starts typing first message
            timers.push(setTimeout(() => {
                if (isCancelled) return
                let current = ""
                const target = MOCK_MESSAGES_SOURCE[0].text
                let idx = 0
                const typeInterval = setInterval(() => {
                    if (isCancelled || idx >= target.length) {
                        clearInterval(typeInterval)
                        return
                    }
                    current += target[idx]
                    setTypingText(current)
                    idx++
                }, 45)
            }, delays[1]))

            // Step 2: User sends first message
            timers.push(setTimeout(() => {
                if (isCancelled) return
                setTypingText("")
                setMessages(prev => [...prev, {
                    id: "msg-1",
                    text: MOCK_MESSAGES_SOURCE[0].text,
                    sender: "user",
                    time: MOCK_MESSAGES_SOURCE[0].time
                }])
            }, delays[2]))

            // Step 3: Agent shows typing indicator
            timers.push(setTimeout(() => {
                if (isCancelled) return
                setIsAgentTyping(true)
            }, delays[3]))

            // Step 4: Agent sends first reply
            timers.push(setTimeout(() => {
                if (isCancelled) return
                setIsAgentTyping(false)
                setMessages(prev => [...prev, {
                    id: "msg-2",
                    text: MOCK_MESSAGES_SOURCE[1].text,
                    sender: "agent",
                    time: MOCK_MESSAGES_SOURCE[1].time
                }])
            }, delays[4]))

            // Step 5: User types second message
            timers.push(setTimeout(() => {
                if (isCancelled) return
                let current = ""
                const target = MOCK_MESSAGES_SOURCE[2].text
                let idx = 0
                const typeInterval = setInterval(() => {
                    if (isCancelled || idx >= target.length) {
                        clearInterval(typeInterval)
                        return
                    }
                    current += target[idx]
                    setTypingText(current)
                    idx++
                }, 45)
            }, delays[5]))

            // Step 6: User sends second message
            timers.push(setTimeout(() => {
                if (isCancelled) return
                setTypingText("")
                setMessages(prev => [...prev, {
                    id: "msg-3",
                    text: MOCK_MESSAGES_SOURCE[2].text,
                    sender: "user",
                    time: MOCK_MESSAGES_SOURCE[2].time
                }])
            }, delays[6]))

            // Step 7: Agent shows typing indicator
            timers.push(setTimeout(() => {
                if (isCancelled) return
                setIsAgentTyping(true)
            }, delays[7]))

            // Step 8: Agent sends second reply
            timers.push(setTimeout(() => {
                if (isCancelled) return
                setIsAgentTyping(false)
                setMessages(prev => [...prev, {
                    id: "msg-4",
                    text: MOCK_MESSAGES_SOURCE[3].text,
                    sender: "agent",
                    time: MOCK_MESSAGES_SOURCE[3].time
                }])
            }, delays[8]))

            // Step 9: Wait and restart the loop
            timers.push(setTimeout(() => {
                if (isCancelled) return
                runSimulation()
            }, delays[9]))
        }

        runSimulation()

        return () => {
            isCancelled = true
            timers.forEach(t => clearTimeout(t))
        }
    }, [])

    // Keep chat scrolled to bottom inside the inner chat container only (fixes window scrolling bug!)
    useEffect(() => {
        const container = chatScrollRef.current
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: "smooth"
            })
        }
    }, [messages, isAgentTyping])

    // OTP Countdown
    useEffect(() => {
        if (otpCountdown > 0) {
            countdownRef.current = setInterval(() => {
                setOtpCountdown((c) => {
                    if (c <= 1) { clearInterval(countdownRef.current!); return 0 }
                    return c - 1
                })
            }, 1000)
        }
        return () => clearInterval(countdownRef.current!)
    }, [otpCountdown])

    if (user) return <Navigate to="/user/conversations" replace />

    // Handlers
    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!pwEmail || !password) { toast.error("Please fill in all fields."); return }
        setPwLoading(true)
        try {
            await login(pwEmail.trim(), password)
            navigate("/user/conversations", { replace: true })
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Login failed. Try again.")
        } finally { setPwLoading(false) }
    }

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!otpEmail) { toast.error("Please enter your email address."); return }
        setOtpLoading(true)
        try {
            await authApi.sendOtp(otpEmail.trim())
            setOtpSent(true); setOtpCountdown(60)
            toast.success("OTP sent! Check your inbox.")
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to send OTP.")
        } finally { setOtpLoading(false) }
    }

    const handleOtpLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (otpCode.length !== 6) { toast.error("Please enter the complete 6-digit OTP."); return }
        setOtpLoading(true)
        try {
            await loginWithOtp(otpEmail.trim(), otpCode)
            navigate("/user/conversations", { replace: true })
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Invalid OTP. Try again.")
        } finally { setOtpLoading(false) }
    }

    const handleResendOtp = async () => {
        if (otpCountdown > 0) return
        setOtpCode(""); setOtpLoading(true)
        try {
            await authApi.sendOtp(otpEmail.trim())
            setOtpCountdown(60)
            toast.success("OTP resent! Check your inbox.")
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to resend OTP.")
        } finally { setOtpLoading(false) }
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!suName.trim()) { toast.error("Please enter your name."); return }
        if (!suEmail.trim()) { toast.error("Please enter your email address."); return }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(suEmail)) { toast.error("Please enter a valid email address."); return }
        if (suPassword.length < 6) { toast.error("Password must be at least 6 characters."); return }
        if (suPassword !== suConfirmPassword) { toast.error("Passwords do not match."); return }
        
        setSuLoading(true)
        try {
            await register(suName.trim(), suEmail.trim().toLowerCase(), suPassword)
            navigate("/user/conversations", { replace: true })
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Registration failed. Try again.")
        } finally { setSuLoading(false) }
    }

    const suPasswordStrength = () => {
        if (!suPassword) return null
        if (suPassword.length < 6) return { level: 1, label: "Weak", color: "bg-rose-500" }
        if (suPassword.length < 10 || !/[A-Z]/.test(suPassword) || !/[0-9]/.test(suPassword))
            return { level: 2, label: "Fair", color: "bg-amber-400" }
        return { level: 3, label: "Strong", color: "bg-emerald-400" }
    }
    const strength = suPasswordStrength()

    // Helper functions for state swaps
    const showLogin = () => {
        setView("login")
        window.history.pushState(null, "", "/login")
    }

    const showSignUp = () => {
        setView("signup")
        window.history.pushState(null, "", "/signup")
    }

    const showChat = () => {
        setView("chat")
        window.history.pushState(null, "", "/")
    }

    return (
        <div className="h-full overflow-y-auto overflow-x-hidden thin-scrollbar landing-bg relative flex flex-col font-sans select-none">
            
            {/* ── Top Header Brand ── */}
            <div className="w-full max-w-7xl mx-auto px-8 py-6 flex items-center justify-between z-20 shrink-0">
                <div className="flex items-center gap-2 cursor-pointer" onClick={showChat}>
                    <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/10 border border-white/20 shrink-0">
                        <Zap className="size-4 text-cyan-300" />
                    </div>
                    <span className="font-extrabold text-xl tracking-tight leading-none text-white">
                        Nexus
                    </span>
                </div>
                {view === "chat" ? (
                    <button 
                        onClick={showLogin}
                        className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                    >
                        Login
                    </button>
                ) : (
                    <button 
                        onClick={showChat}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                    >
                        <ArrowLeft className="size-3.5" />
                        <span>Back</span>
                    </button>
                )}
            </div>

            {/* ── Main Landing Hero Section ── */}
            <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-6 gap-12 min-h-[85vh] w-full">
                
                {/* Left Column (Main Brand info) */}
                <div className="flex-1 w-full max-w-lg lg:max-w-xl h-auto lg:h-[580px] flex items-center justify-center relative">
                    <div className={`w-full flex flex-col space-y-8 transition-all duration-700 cubic-bezier(0.25, 1, 0.5, 1) ${
                        view === "chat" 
                            ? "opacity-100 translate-x-0 pointer-events-auto scale-100" 
                            : "opacity-0 -translate-x-12 pointer-events-none scale-95 absolute"
                    }`}>
                        <div className="space-y-3">
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
                                Live chat.<br />
                                Real connections.
                            </h1>
                            <p className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-lg font-normal pt-2">
                                Talk to your visitors in real time, solve their problems instantly, and build lasting trust.
                            </p>
                        </div>

                        {/* Left Pane Actions change dynamically to keep it extremely clean */}
                        <div className="flex items-center gap-6">
                            <button 
                                onClick={showLogin}
                                className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-900 font-semibold px-8 py-4 rounded-2xl text-base tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] active:scale-98"
                            >
                                <span>Login</span>
                                <ArrowRight className="size-4 stroke-[2.5]" />
                            </button>
                            <button 
                                onClick={showSignUp}
                                className="group flex items-center gap-1.5 text-white/90 hover:text-white font-semibold text-base transition-colors"
                            >
                                <span>Sign up today</span>
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>

                        {/* Translucent Features row */}
                        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
                            <div className="space-y-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/20">
                                    <Zap className="h-5 w-5 text-cyan-300" />
                                </div>
                                <p className="font-semibold text-sm text-white leading-snug">Instant<br />Responses</p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/20">
                                    <Smile className="h-5 w-5 text-cyan-300" />
                                </div>
                                <p className="font-semibold text-sm text-white leading-snug">Happy<br />Customers</p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/20">
                                    <ShieldCheck className="h-5 w-5 text-cyan-300" />
                                </div>
                                <p className="font-semibold text-sm text-white leading-snug">Secure &<br />Reliable</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Sliding Absolute Transition Pane - Chat vs Login vs SignUp) */}
                <div className="flex-1 w-full max-w-lg lg:max-w-xl h-auto lg:h-[580px] flex items-center justify-center relative">
                    
                    {/* ── 1. Live Simulating Chat Panel ── */}
                    <div className={`absolute w-full max-w-[480px] h-[560px] p-6 flex flex-col justify-between select-none chat-mockup-window transition-all duration-700 cubic-bezier(0.25, 1, 0.5, 1) transform ${
                        view === "chat" 
                            ? "opacity-100 scale-100 translate-x-0 pointer-events-auto z-10" 
                            : "opacity-0 scale-95 pointer-events-none lg:opacity-100 lg:scale-100 lg:-translate-x-[calc(100%+3rem)] lg:pointer-events-auto z-10"
                    }`}>
                        {/* Mock Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
                            <div className="flex items-center gap-3">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                </span>
                                <div>
                                    <h3 className="text-base font-bold text-white leading-tight">Live Chat</h3>
                                    <p className="text-[11px] text-white/60">We typically reply in a few seconds</p>
                                </div>
                            </div>
                            
                            {/* Stacked avatars */}
                            <div className="flex items-center">
                                <div className="flex -space-x-2.5">
                                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" 
                                         alt="Avatar 1" className="size-7 rounded-full border-2 border-slate-900 object-cover" />
                                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" 
                                         alt="Avatar 2" className="size-7 rounded-full border-2 border-slate-900 object-cover" />
                                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop" 
                                         alt="Avatar 3" className="size-7 rounded-full border-2 border-slate-900 object-cover" />
                                </div>
                                <div className="flex items-center justify-center size-7 rounded-full bg-blue-500/80 text-[10px] font-bold text-white border-2 border-slate-900 ml-1">
                                    +2
                                </div>
                            </div>
                        </div>

                        {/* Simulator Chat Body */}
                        <div ref={chatScrollRef} className="flex-1 py-4 space-y-4 overflow-y-auto thin-scrollbar text-xs">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex gap-2.5 items-end max-w-[85%] transition-all duration-300 transform scale-100 ${
                                        msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                    }`}
                                >
                                    <img
                                        src={
                                            msg.sender === "user"
                                                ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop"
                                                : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"
                                        }
                                        alt="Avatar"
                                        className="size-8 rounded-full object-cover shrink-0"
                                    />
                                    <div
                                        className={`px-3.5 py-2.5 shadow-sm space-y-0.5 ${
                                            msg.sender === "user"
                                                ? "chat-bubble-mock-agent" // user sent messages aligned on right (cyan bubble)
                                                : "chat-bubble-mock-user" // agent received messages aligned on left (white bubble)
                                        }`}
                                    >
                                        <p className="leading-relaxed font-medium">{msg.text}</p>
                                        <span className={`flex items-center gap-1 text-[9px] ${
                                            msg.sender === "user" ? "text-white/70 justify-end" : "text-slate-400 justify-start"
                                        }`}>
                                            <span>{msg.time}</span>
                                            {msg.sender === "user" && (
                                                <svg className="size-3 text-cyan-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                    <path d="M2 12l5 5L20 4M6 17l5-5 4 4" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {/* Agent Typing Indicator */}
                            {isAgentTyping && (
                                <div className="flex gap-2.5 items-end max-w-[85%] mr-auto animate-pulse">
                                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop" 
                                         alt="Agent" className="size-8 rounded-full object-cover shrink-0" />
                                    <div className="chat-bubble-mock-user px-4 py-3 shadow-sm flex items-center justify-center gap-1">
                                        <span className="size-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0s" }} />
                                        <span className="size-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0.15s" }} />
                                        <span className="size-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0.3s" }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Interactive Input Footer */}
                        <div className="pt-3 border-t border-white/10 flex items-center gap-3 shrink-0">
                            <div className="flex-1 bg-white/10 border border-white/10 rounded-full px-4 py-2.5 flex items-center justify-between">
                                {typingText ? (
                                    <span className="text-white font-medium text-xs border-r-2 border-cyan-400 pr-0.5 animate-pulse leading-none">
                                        {typingText}
                                    </span>
                                ) : (
                                    <span className="text-white/40 text-xs font-normal">Type a message...</span>
                                )}
                                <Smile className="size-4.5 text-white/60 shrink-0" />
                            </div>
                            <div className={`flex items-center justify-center size-9.5 rounded-full transition-all duration-300 ${
                                typingText ? "bg-cyan-400 scale-110 shadow-lg" : "bg-blue-500"
                            }`}>
                                <Send className={`size-4 text-white transition-all ${
                                    typingText ? "translate-x-0.5 -translate-y-0.5 rotate-45 text-slate-900" : ""
                                }`} />
                            </div>
                        </div>
                    </div>

                    {/* ── 2. Login Form Panel ── */}
                    <div className={`absolute w-full max-w-[420px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl transition-all duration-700 cubic-bezier(0.25, 1, 0.5, 1) transform z-20 ${
                        view === "login" 
                            ? "opacity-100 scale-100 translate-x-0 pointer-events-auto" 
                            : "opacity-0 scale-95 translate-x-12 pointer-events-none"
                    }`}>
                        <div className="mb-6 flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-white">Welcome back</h2>
                                <p className="text-xs text-white/50 mt-1">Select your preferred login method</p>
                            </div>
                            <button onClick={showChat} className="text-white/40 hover:text-white transition-colors text-xs flex items-center gap-1">
                                <ArrowLeft className="size-3.5" />
                                <span>Cancel</span>
                            </button>
                        </div>

                        <Tabs defaultValue="password" className="w-full">
                            <TabsList className="w-full grid grid-cols-2 mb-6 bg-white/5 border border-white/10 rounded-xl p-1">
                                <TabsTrigger value="password" className="rounded-lg text-white/60 data-[state=active]:bg-white/15 data-[state=active]:text-white font-semibold transition-all">Password</TabsTrigger>
                                <TabsTrigger value="otp" className="rounded-lg text-white/60 data-[state=active]:bg-white/15 data-[state=active]:text-white font-semibold transition-all">OTP Login</TabsTrigger>
                            </TabsList>

                            <TabsContent value="password">
                                <form onSubmit={handlePasswordLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="pw-email" className="text-white/80 font-medium">Email address</Label>
                                        <Input id="pw-email" type="email" placeholder="you@example.com"
                                            autoComplete="email" value={pwEmail}
                                            onChange={(e) => setPwEmail(e.target.value)} disabled={pwLoading}
                                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-cyan-500/30" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pw-password" className="text-white/80 font-medium">Password</Label>
                                        <div className="relative">
                                            <Input id="pw-password" type={showPass ? "text" : "password"}
                                                placeholder="••••••••" autoComplete="current-password"
                                                value={password} onChange={(e) => setPassword(e.target.value)}
                                                disabled={pwLoading} className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-cyan-500/30" />
                                            <button type="button" tabIndex={-1}
                                                onClick={() => setShowPass((v) => !v)}
                                                className="absolute inset-y-0 right-3 flex items-center text-white/40 hover:text-white transition-colors">
                                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <button type="submit" disabled={pwLoading}
                                        className="w-full bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-900 font-bold py-3 rounded-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
                                        {pwLoading && <Spinner className="w-4 h-4 text-slate-900" />}
                                        {pwLoading ? "Signing in…" : "Sign in"}
                                    </button>
                                </form>
                            </TabsContent>

                            <TabsContent value="otp">
                                <div className="space-y-4">
                                    {!otpSent ? (
                                        <form onSubmit={handleSendOtp} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="otp-email" className="text-white/80 font-medium">Email address</Label>
                                                <Input id="otp-email" type="email" placeholder="you@example.com"
                                                    autoComplete="email" value={otpEmail}
                                                    onChange={(e) => setOtpEmail(e.target.value)} disabled={otpLoading}
                                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-cyan-500/30" />
                                            </div>
                                            <p className="text-xs text-white/50 leading-relaxed">
                                                We'll send a one-time password to your email. Valid for 5 minutes.
                                            </p>
                                            <button type="submit" disabled={otpLoading}
                                                className="w-full bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-900 font-bold py-3 rounded-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
                                                {otpLoading && <Spinner className="w-4 h-4 text-slate-900" />}
                                                {otpLoading ? "Sending OTP…" : "Send OTP"}
                                            </button>
                                        </form>
                                    ) : (
                                        <form onSubmit={handleOtpLogin} className="space-y-4">
                                            <div className="space-y-2.5">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-white/80 font-medium">Enter OTP</Label>
                                                    <span className="text-[10px] text-white/50">
                                                        Sent to <span className="font-semibold text-white">{otpEmail}</span>
                                                    </span>
                                                </div>
                                                <div className="flex justify-center pt-1">
                                                    <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} disabled={otpLoading}>
                                                        <InputOTPGroup className="gap-2">
                                                            <InputOTPSlot index={0} className="border-white/10 text-white bg-white/5 focus-visible:ring-cyan-500/30 rounded-lg size-10" />
                                                            <InputOTPSlot index={1} className="border-white/10 text-white bg-white/5 focus-visible:ring-cyan-500/30 rounded-lg size-10" />
                                                            <InputOTPSlot index={2} className="border-white/10 text-white bg-white/5 focus-visible:ring-cyan-500/30 rounded-lg size-10" />
                                                            <InputOTPSlot index={3} className="border-white/10 text-white bg-white/5 focus-visible:ring-cyan-500/30 rounded-lg size-10" />
                                                            <InputOTPSlot index={4} className="border-white/10 text-white bg-white/5 focus-visible:ring-cyan-500/30 rounded-lg size-10" />
                                                            <InputOTPSlot index={5} className="border-white/10 text-white bg-white/5 focus-visible:ring-cyan-500/30 rounded-lg size-10" />
                                                        </InputOTPGroup>
                                                    </InputOTP>
                                                </div>
                                            </div>
                                            <button type="submit" disabled={otpLoading || otpCode.length !== 6}
                                                className="w-full bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-900 font-bold py-3 rounded-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
                                                {otpLoading && <Spinner className="w-4 h-4 text-slate-900" />}
                                                {otpLoading ? "Verifying…" : "Login with OTP"}
                                            </button>
                                            <div className="flex items-center justify-between text-xs pt-1">
                                                <button type="button" onClick={() => { setOtpSent(false); setOtpCode("") }}
                                                    className="text-white/50 hover:text-white transition-colors">
                                                    ← Change email
                                                </button>
                                                <button type="button" onClick={handleResendOtp}
                                                    disabled={otpCountdown > 0 || otpLoading}
                                                    className="flex items-center gap-1 text-white/50 hover:text-white disabled:opacity-30 transition-opacity">
                                                    <RotateCcw className="w-3 h-3" />
                                                    {otpCountdown > 0 ? `Resend in ${otpCountdown}s` : "Resend OTP"}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="mt-6 pt-5 border-t border-white/5 text-center text-sm text-white/60">
                            Don't have an account?{" "}
                            <button onClick={showSignUp} className="font-semibold text-cyan-300 hover:underline transition-all">
                                Create one
                            </button>
                        </div>
                    </div>

                    {/* ── 3. SignUp Form Panel ── */}
                    <div className={`absolute w-full max-w-[420px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl transition-all duration-700 cubic-bezier(0.25, 1, 0.5, 1) transform z-20 ${
                        view === "signup" 
                            ? "opacity-100 scale-100 translate-x-0 pointer-events-auto" 
                            : "opacity-0 scale-95 translate-x-12 pointer-events-none"
                    }`}>
                        <div className="mb-6 flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-white">Create an account</h2>
                                <p className="text-xs text-white/50 mt-1">Fill in the details below to get started</p>
                            </div>
                            <button onClick={showChat} className="text-white/40 hover:text-white transition-colors text-xs flex items-center gap-1">
                                <ArrowLeft className="size-3.5" />
                                <span>Cancel</span>
                            </button>
                        </div>

                        <form onSubmit={handleSignUp} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="su-name" className="text-white/80 font-medium">Full name</Label>
                                <Input id="su-name" type="text" placeholder="Jane Doe" autoComplete="name"
                                    value={suName} onChange={(e) => setSuName(e.target.value)} disabled={suLoading}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-cyan-500/30" />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="su-email" className="text-white/80 font-medium">Email address</Label>
                                <Input id="su-email" type="email" placeholder="you@example.com" autoComplete="email"
                                    value={suEmail} onChange={(e) => setSuEmail(e.target.value)} disabled={suLoading}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-cyan-500/30" />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="su-password" className="text-white/80 font-medium">Password</Label>
                                <div className="relative">
                                    <Input id="su-password" type={suShowPass ? "text" : "password"}
                                        placeholder="Min. 6 characters" autoComplete="new-password"
                                        value={suPassword} onChange={(e) => setSuPassword(e.target.value)}
                                        disabled={suLoading} className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-cyan-500/30" />
                                    <button type="button" tabIndex={-1} onClick={() => setSuShowPass((v) => !v)}
                                        className="absolute inset-y-0 right-3 flex items-center text-white/40 hover:text-white transition-colors">
                                        {suShowPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {strength && (
                                    <div className="space-y-1 pt-1">
                                        <div className="flex gap-1">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength.level ? strength.color : "bg-white/10"}`} />
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-white/50">
                                            Strength: <span className="font-semibold text-white">{strength.label}</span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="su-confirmPassword" className="text-white/80 font-medium">Confirm password</Label>
                                <div className="relative">
                                    <Input id="su-confirmPassword" type={suShowConfirm ? "text" : "password"}
                                        placeholder="Repeat your password" autoComplete="new-password"
                                        value={suConfirmPassword} onChange={(e) => setSuConfirmPassword(e.target.value)}
                                        disabled={suLoading}
                                        className={`pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-cyan-500/30 ${
                                            suConfirmPassword && suConfirmPassword !== suPassword ? "border-rose-500 focus-visible:ring-rose-500/20" : ""
                                        }`} />
                                    <button type="button" tabIndex={-1} onClick={() => setSuShowConfirm((v) => !v)}
                                        className="absolute inset-y-0 right-3 flex items-center text-white/40 hover:text-white transition-colors">
                                        {suShowConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={suLoading}
                                className="w-full bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-900 font-bold py-3 rounded-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
                                {suLoading && <Spinner className="w-4 h-4 text-slate-900" />}
                                {suLoading ? "Creating account…" : "Create account"}
                            </button>
                        </form>

                        <div className="mt-4 pt-4 border-t border-white/5 text-center text-sm text-white/60">
                            Already have an account?{" "}
                            <button onClick={showLogin} className="font-semibold text-cyan-300 hover:underline transition-all">
                                Sign in
                            </button>
                        </div>
                    </div>

                </div>

            </div>

            {/* ── Realistic Product Features Row Below Fold ── */}
            <div className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-md py-16">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center space-y-3 mb-12">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                            Designed for modern real-time teamwork
                        </h2>
                        <p className="text-white/60 text-sm sm:text-base max-w-lg mx-auto">
                            Powerful enterprise features built into a streamlined, high-performance platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Col 1 */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/10 transition-colors">
                            <div className="size-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/25">
                                <Smile className="size-5 text-cyan-300" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Live Emoji Reactions</h3>
                            <p className="text-white/70 text-xs leading-relaxed">
                                Instantly react to team messages with multiple emojis to speed up workflows and stay responsive.
                            </p>
                        </div>

                        {/* Col 2 */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/10 transition-colors">
                            <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/25">
                                <Zap className="size-5 text-emerald-300" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Custom Status Badges</h3>
                            <p className="text-white/70 text-xs leading-relaxed">
                                Let teammates know if you are busy, away, or in a deep work session with custom emojis and text.
                            </p>
                        </div>

                        {/* Col 3 */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/10 transition-colors">
                            <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/25">
                                <ShieldCheck className="size-5 text-blue-300" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Security & Reliability</h3>
                            <p className="text-white/70 text-xs leading-relaxed">
                                Complete industry standard cryptographic password hashing, private direct chats, and safe JWT authorization tokens.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 py-8 text-center text-xs text-white/40 border-t border-white/5 bg-slate-950/40">
                <p>© 2026 Nexus. Crafted with premium dark-neon aesthetics for high-performance communication.</p>
            </div>
        </div>
    )
}