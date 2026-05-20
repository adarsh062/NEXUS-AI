import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { emitSetStatus } from "@/lib/socket"
import { useAuth } from "@/hooks/use-auth"
import { Smile } from "lucide-react"

const STATUS_EMOJIS = ["🟢", "🎧", "📚", "🍕", "😴", "🏃", "💼", "🚫", "🎮", "✈️"]
const QUICK_STATUSES = [
    { emoji: "🟢", text: "Available" },
    { emoji: "🎧", text: "In a meeting" },
    { emoji: "📚", text: "Studying" },
    { emoji: "😴", text: "Sleeping" },
    { emoji: "🚫", text: "Do not disturb" },
    { emoji: "🏃", text: "Be right back" },
]

interface StatusPopoverProps {
    children: React.ReactNode
}

export default function StatusPopover({ children }: StatusPopoverProps) {
    const { user, setUser } = useAuth()
    const [open, setOpen] = useState(false)
    const [text, setText] = useState(user?.statusText ?? "")
    const [emoji, setEmoji] = useState(user?.statusEmoji ?? "🟢")

    const handleSave = () => {
        emitSetStatus({ statusText: text.slice(0, 60), statusEmoji: emoji })
        setUser((prev) => prev ? { ...prev, statusText: text, statusEmoji: emoji } : prev)
        setOpen(false)
    }

    const handleClear = () => {
        setText("")
        setEmoji("")
        emitSetStatus({ statusText: "", statusEmoji: "" })
        setUser((prev) => prev ? { ...prev, statusText: "", statusEmoji: "" } : prev)
        setOpen(false)
    }

    const handleQuick = (s: { emoji: string; text: string }) => {
        setEmoji(s.emoji)
        setText(s.text)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className="w-72 p-4" side="top" align="start">
                <div className="flex flex-col gap-3">
                    <p className="text-sm font-semibold">Set your status</p>

                    {/* Emoji row */}
                    <div className="flex flex-wrap gap-1.5">
                        {STATUS_EMOJIS.map((e) => (
                            <button
                                key={e}
                                onClick={() => setEmoji(e)}
                                className={`text-lg rounded-lg p-1 transition-all hover:scale-110 ${emoji === e ? "bg-primary/20 ring-1 ring-primary/50" : "hover:bg-muted"}`}
                            >
                                {e}
                            </button>
                        ))}
                    </div>

                    {/* Text input */}
                    <div className="flex gap-2 items-center">
                        <span className="text-lg shrink-0">{emoji || <Smile className="size-5 text-muted-foreground" />}</span>
                        <Input
                            placeholder="What's on your mind?"
                            value={text}
                            onChange={(e) => setText(e.target.value.slice(0, 60))}
                            className="text-sm h-8"
                            onKeyDown={(e) => e.key === "Enter" && handleSave()}
                        />
                    </div>

                    {/* Quick statuses */}
                    <div className="flex flex-col gap-1">
                        {QUICK_STATUSES.map((s) => (
                            <button
                                key={s.text}
                                onClick={() => handleQuick(s)}
                                className="flex items-center gap-2 px-2 py-1 rounded-lg text-sm text-left hover:bg-muted transition-colors"
                            >
                                <span>{s.emoji}</span>
                                <span className="text-muted-foreground">{s.text}</span>
                            </button>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        {(user?.statusText || user?.statusEmoji) && (
                            <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={handleClear}>
                                Clear status
                            </Button>
                        )}
                        <Button size="sm" className="flex-1 text-xs nexus-gradient-bg text-white hover:opacity-90" onClick={handleSave}>
                            Save
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
