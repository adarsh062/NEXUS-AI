import { useState } from "react"
import { BarChart3, Users, Ticket, Clock, Activity, Coins, TrendingUp, Sparkles, MessageSquareDot } from "lucide-react"

// Mock statistics representing state-of-the-art support SaaS metrics
const METRICS = [
    {
        label: "Active Support Agents",
        value: "42",
        change: "+8% vs last week",
        trend: "up",
        icon: Users,
        color: "from-cyan-500/10 to-cyan-500/5 text-cyan-500 border-cyan-500/20",
    },
    {
        label: "Open Support Tickets",
        value: "18",
        change: "-12% vs yesterday",
        trend: "down",
        icon: Ticket,
        color: "from-rose-500/10 to-rose-500/5 text-rose-500 border-rose-500/20",
    },
    {
        label: "AI Response Accuracy",
        value: "98.4%",
        change: "+1.2% this month",
        trend: "up",
        icon: Sparkles,
        color: "from-amber-500/10 to-amber-500/5 text-amber-500 border-amber-500/20",
    },
    {
        label: "Avg. Resolution Time",
        value: "1.8m",
        change: "-24s optimization",
        trend: "down",
        icon: Clock,
        color: "from-emerald-500/10 to-emerald-500/5 text-emerald-500 border-emerald-500/20",
    },
    {
        label: "Live Conversions",
        value: "147",
        change: "+31 live connections",
        trend: "up",
        icon: Activity,
        color: "from-cyan-500/10 to-cyan-500/5 text-cyan-500 border-cyan-500/20",
    },
    {
        label: "LLM Token Usage",
        value: "84,921",
        change: "72% remaining quota",
        trend: "up",
        icon: Coins,
        color: "from-blue-500/10 to-blue-500/5 text-blue-500 border-blue-500/20",
    },
]

const TICKETS_LOG = [
    { id: "T-8922", customer: "Sarah Jenkins", category: "Billing & Invoices", priority: "High", status: "Open", time: "2 mins ago" },
    { id: "T-8921", customer: "Alex Mercer", category: "OAuth API Integration", priority: "Critical", status: "In Progress", time: "12 mins ago" },
    { id: "T-8920", customer: "Sophia Rodriguez", category: "Workspace Deletion", priority: "Low", status: "Resolved", time: "25 mins ago" },
    { id: "T-8919", customer: "Vikram Mehta", category: "Multilingual TTS System", priority: "Medium", status: "Resolved", time: "1 hour ago" },
]

export default function AdminDashboard() {
    const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d">("7d")

    return (
        <div className="flex-1 overflow-y-auto bg-background/30 p-6 space-y-6">
            {/* Top Heading */}
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">System Performance & AI Admin</h1>
                    <p className="text-sm text-muted-foreground">
                        Real-time telemetry, tickets SLA, and GenAI LLM token usage insights.
                    </p>
                </div>
                <div className="flex items-center gap-2 self-start md:self-auto mt-2 md:mt-0">
                    <button
                        onClick={() => setTimeframe("24h")}
                        className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${timeframe === "24h" ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                    >
                        24 Hours
                    </button>
                    <button
                        onClick={() => setTimeframe("7d")}
                        className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${timeframe === "7d" ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                    >
                        7 Days
                    </button>
                    <button
                        onClick={() => setTimeframe("30d")}
                        className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${timeframe === "30d" ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                    >
                        30 Days
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {METRICS.map((m) => {
                    const Icon = m.icon
                    return (
                        <div key={m.label} className="relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{m.label}</span>
                                <div className={`flex h-9 w-9 items-center justify-center rounded-lg border bg-gradient-to-br ${m.color}`}>
                                    <Icon className="size-4.5" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-baseline gap-2">
                                <span className="text-3xl font-bold tracking-tight">{m.value}</span>
                                <span className={`text-xs font-medium flex items-center gap-0.5 ${m.trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                                    {m.trend === "up" ? "▲" : "▼"} {m.change.split(" ")[0]}
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">{m.change.substring(m.change.indexOf(" ") + 1)}</p>
                        </div>
                    )
                })}
            </div>

            {/* Charts & Interactive Visualizations */}
            <div className="grid gap-6 lg:grid-cols-12">
                {/* SVG Live Token Allocation Line Chart */}
                <div className="rounded-xl border bg-card p-5 lg:col-span-8 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-base font-bold flex items-center gap-2">
                                <TrendingUp className="size-4.5 text-primary" />
                                GenAI Token Usage Velocity
                            </h2>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <span className="size-2 rounded-full bg-primary animate-pulse" />
                                Live tracking
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-6">
                            Average consumption of LLM input/output tokens dynamically optimized by cache management.
                        </p>
                    </div>

                    {/* SVG Analytics Graph */}
                    <div className="h-60 w-full relative">
                        <svg className="w-full h-full" viewBox="0 0 600 240" fill="none" preserveAspectRatio="none">
                            {/* Grid Lines */}
                            <line x1="0" y1="40" x2="600" y2="40" stroke="currentColor" className="text-muted/10" strokeDasharray="4 4" />
                            <line x1="0" y1="100" x2="600" y2="100" stroke="currentColor" className="text-muted/10" strokeDasharray="4 4" />
                            <line x1="0" y1="160" x2="600" y2="160" stroke="currentColor" className="text-muted/10" strokeDasharray="4 4" />
                            <line x1="0" y1="220" x2="600" y2="220" stroke="currentColor" className="text-muted/15" />

                            {/* Chart Area Gradient */}
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                                </linearGradient>
                            </defs>

                            {/* Area Path */}
                            <path
                                d="M 0 220 
                                   L 50 140 
                                   L 120 180 
                                   L 200 80 
                                   L 280 110 
                                   L 360 50 
                                   L 440 95 
                                   L 520 30 
                                   L 600 70 
                                   L 600 220 Z"
                                fill="url(#chartGradient)"
                            />

                            {/* Main Stroke Line */}
                            <path
                                d="M 0 220 
                                   L 50 140 
                                   L 120 180 
                                   L 200 80 
                                   L 280 110 
                                   L 360 50 
                                   L 440 95 
                                   L 520 30 
                                   L 600 70"
                                stroke="var(--primary)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            {/* Graph nodes */}
                            <circle cx="200" cy="80" r="5" fill="var(--primary)" stroke="white" strokeWidth="2" />
                            <circle cx="360" cy="50" r="5" fill="var(--primary)" stroke="white" strokeWidth="2" />
                            <circle cx="520" cy="30" r="5" fill="var(--primary)" stroke="white" strokeWidth="2" />
                        </svg>

                        {/* Custom Tooltip */}
                        <div className="absolute top-[15px] left-[320px] bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded shadow-lg flex flex-col pointer-events-none">
                            <span>Peak Consumption</span>
                            <span className="text-primary font-extrabold">92.4k tokens</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-2 border-t pt-3">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                    </div>
                </div>

                {/* AI Queue Categorization Card */}
                <div className="rounded-xl border bg-card p-5 lg:col-span-4 shadow-sm flex flex-col justify-between">
                    <div>
                        <h2 className="text-base font-bold flex items-center gap-2 mb-2">
                            <BarChart3 className="size-4.5 text-primary" />
                            Support Categories
                        </h2>
                        <p className="text-xs text-muted-foreground mb-6">
                            Auto-classified support categories via Gemini Zero-Shot routing models.
                        </p>
                    </div>

                    {/* Progress bars of ticket categories */}
                    <div className="space-y-4">
                        {[
                            { name: "Billing & Subscription", percent: 45, count: 68, color: "bg-cyan-500" },
                            { name: "Technical Bugs", percent: 32, count: 48, color: "bg-rose-500" },
                            { name: "Feature Requests", percent: 15, count: 22, color: "bg-amber-500" },
                            { name: "General Inquiries", percent: 8, count: 12, color: "bg-emerald-500" },
                        ].map((cat) => (
                            <div key={cat.name} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-medium">{cat.name}</span>
                                    <span className="text-muted-foreground font-semibold">{cat.count} ({cat.percent}%)</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                    <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.percent}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-4 mt-6 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Active Categorizer: Gemini Flash</span>
                        <span className="text-emerald-500 font-semibold flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
                            Active
                        </span>
                    </div>
                </div>
            </div>

            {/* Real-time Ticket SLA Pipeline */}
            <div className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold flex items-center gap-2">
                        <MessageSquareDot className="size-4.5 text-primary" />
                        Live Ticket Activity Queue
                    </h2>
                    <span className="text-xs font-semibold text-primary nexus-gradient-bg px-2.5 py-0.5 rounded-full text-white">
                        SLA Target: 5m Response
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
                            <tr>
                                <th className="p-3 font-semibold rounded-l-lg">Ticket ID</th>
                                <th className="p-3 font-semibold">Customer</th>
                                <th className="p-3 font-semibold">AI Auto-Classification</th>
                                <th className="p-3 font-semibold">Priority</th>
                                <th className="p-3 font-semibold">Status</th>
                                <th className="p-3 font-semibold rounded-r-lg">Elapsed Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {TICKETS_LOG.map((t) => (
                                <tr key={t.id} className="hover:bg-muted/10 transition-colors">
                                    <td className="p-3 font-mono font-bold text-primary">{t.id}</td>
                                    <td className="p-3 font-medium">{t.customer}</td>
                                    <td className="p-3">
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary/10 text-primary border border-primary/15">
                                            {t.category}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                            t.priority === "Critical" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                                            t.priority === "High" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                                            t.priority === "Medium" ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" :
                                            "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                        }`}>
                                            {t.priority}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                                            t.status === "Open" ? "text-rose-500" :
                                            t.status === "In Progress" ? "text-amber-500" :
                                            "text-emerald-500"
                                        }`}>
                                            <span className={`size-1.5 rounded-full ${
                                                t.status === "Open" ? "bg-rose-500 animate-pulse" :
                                                t.status === "In Progress" ? "bg-amber-500 animate-pulse" :
                                                "bg-emerald-500"
                                            }`} />
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-xs text-muted-foreground font-medium">{t.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
