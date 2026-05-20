import { useEffect, useState } from "react"
import { X, MessageSquareText, Loader } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { messageApi } from "@/lib/api"
import type { Message } from "@/hooks/use-chat"
import type { User } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

interface ThreadDrawerProps {
    open: boolean
    onClose: () => void
    parentMessage: Message | null
    myId: string
    receiver: User | null
}

function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

interface ThreadData {
    parentMessage: Message
    replies: Message[]
}

export default function ThreadDrawer({ open, onClose, parentMessage, myId, receiver }: ThreadDrawerProps) {
    const [data, setData] = useState<ThreadData | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!open || !parentMessage) { setData(null); return }
        setLoading(true)
        messageApi.getThread<ThreadData>(parentMessage._id)
            .then(setData)
            .catch(() => setData(null))
            .finally(() => setLoading(false))
    }, [open, parentMessage])

    const getName = (senderId: string) => {
        if (senderId === myId) return "You"
        return receiver?.name ?? "Them"
    }

    const getPic = (senderId: string) => {
        if (senderId === myId) return undefined
        return receiver?.profilePic
    }

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

    const renderMessage = (msg: Message) => {
        const isMine = msg.senderId === myId
        return (
            <div key={msg._id} className={cn("flex gap-2.5 items-end", isMine ? "flex-row-reverse" : "flex-row")}>
                <Avatar className="size-7 shrink-0">
                    <AvatarImage src={getPic(msg.senderId)} />
                    <AvatarFallback className="text-[10px] bg-primary/15">
                        {getInitials(getName(msg.senderId))}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 max-w-[75%]">
                    <span className={cn("text-[10px] text-muted-foreground", isMine ? "text-right" : "text-left")}>
                        {getName(msg.senderId)}
                    </span>
                    <div className={cn(
                        "px-3 py-2 text-sm shadow-sm",
                        isMine ? "bubble-sent" : "bubble-received"
                    )}>
                        {msg.softDeleted ? (
                            <p className="text-xs italic opacity-60">This message was deleted</p>
                        ) : (
                            <>
                                {msg.imageUrl && (
                                    <img src={msg.imageUrl} alt="attachment"
                                        className="max-w-48 max-h-60 rounded-lg mb-1 object-cover" />
                                )}
                                {msg.text && <p className="leading-relaxed whitespace-pre-wrap break-all">{msg.text}</p>}
                            </>
                        )}
                        <span className={cn(
                            "block text-[10px] mt-0.5 leading-none",
                            isMine ? "text-white/60 text-right" : "text-muted-foreground"
                        )}>
                            {formatTime(msg.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Sheet open={open} onOpenChange={(v) => { if (!v) onClose() }}>
            <SheetContent side="right" className="w-full max-w-sm p-0 flex flex-col border-l border-border/50 bg-card">
                <SheetHeader className="px-4 py-3 border-b border-border/50 shrink-0">
                    <div className="flex items-center gap-2">
                        <MessageSquareText className="size-4 text-primary" />
                        <SheetTitle className="text-sm font-semibold">Thread</SheetTitle>
                        <button onClick={onClose} className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
                            <X className="size-4" />
                        </button>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto thin-scrollbar px-4 py-4 space-y-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-32 text-muted-foreground gap-2">
                            <Loader className="size-4 animate-spin" />
                            <span className="text-sm">Loading thread…</span>
                        </div>
                    ) : data ? (
                        <>
                            {/* Parent message */}
                            <div>
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Original message</p>
                                <div className="p-3 rounded-xl bg-primary/5 border border-primary/15">
                                    {data.parentMessage.softDeleted ? (
                                        <p className="text-xs italic text-muted-foreground">This message was deleted</p>
                                    ) : (
                                        <>
                                            {data.parentMessage.imageUrl && (
                                                <img src={data.parentMessage.imageUrl} alt="attachment"
                                                    className="max-w-48 max-h-60 rounded-lg mb-2 object-cover" />
                                            )}
                                            {data.parentMessage.text && (
                                                <p className="text-sm leading-relaxed">{data.parentMessage.text}</p>
                                            )}
                                        </>
                                    )}
                                    <span className="text-[10px] text-muted-foreground mt-1 block">
                                        {formatTime(data.parentMessage.createdAt)}
                                    </span>
                                </div>
                            </div>

                            {/* Replies */}
                            <div>
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                    {data.replies.length} {data.replies.length === 1 ? "reply" : "replies"}
                                </p>
                                {data.replies.length === 0 ? (
                                    <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                                        <MessageSquareText className="size-8 opacity-30" />
                                        <p className="text-sm">No replies yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {data.replies.map(renderMessage)}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                            <MessageSquareText className="size-8 opacity-30" />
                            <p className="text-sm">Could not load thread</p>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
