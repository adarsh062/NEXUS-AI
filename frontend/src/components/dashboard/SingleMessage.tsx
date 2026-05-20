import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Copy, Trash2, Check, CheckCheck, CheckCircle2, Circle, Star, Reply, Sparkles, MessageSquareText } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import type { Message, Reaction } from "@/hooks/use-chat"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"
import { emitReactMessage } from "@/lib/socket"

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥"]

interface Props {
    message: Message
    isMine: boolean
    isBot?: boolean
    receiverId: string
    myId: string
    receiverName: string
    onDelete: (messageId: string, scope: "me" | "everyone") => void
    onStar: (messageId: string) => void
    onReply: (message: Message) => void
    onOpenThread?: (message: Message) => void
    // select-mode props
    selectMode?: boolean
    selected?: boolean
    onToggleSelect?: (id: string) => void
    // highlight / jump-to
    highlighted?: boolean
}

function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function groupReactions(reactions: Reaction[] = []): { emoji: string; count: number; users: string[] }[] {
    const map = new Map<string, string[]>()
    for (const r of reactions) {
        if (!map.has(r.emoji)) map.set(r.emoji, [])
        map.get(r.emoji)!.push(r.userId)
    }
    return Array.from(map.entries()).map(([emoji, users]) => ({ emoji, count: users.length, users }))
}

export default function SingleMessage({
    message, isMine, isBot, receiverId, myId, receiverName,
    onDelete, onStar, onReply, onOpenThread,
    selectMode, selected, onToggleSelect, highlighted
}: Props) {
    const [hovered, setHovered] = useState(false)
    const [copied, setCopied] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const navigate = useNavigate()

    const isStarred = message.starredBy?.includes(myId)
    const reactionGroups = groupReactions(message.reactions)

    const handleCopy = () => {
        if (message.text) {
            navigator.clipboard.writeText(message.text)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        }
    }

    const handleRowClick = () => {
        if (selectMode) onToggleSelect?.(message._id)
    }

    const handleReact = (emoji: string) => {
        emitReactMessage({ messageId: message._id, conversationId: message.conversationId, emoji })
    }

    return (
        <>
            <div
                data-message-id={message._id}
                className={cn(
                    "group flex items-end gap-2",
                    isMine ? "ml-auto flex-row-reverse max-w-[75%]" : isBot ? "mr-auto max-w-[85%]" : "mr-auto max-w-[75%]",
                    selectMode && "cursor-pointer",
                    selectMode && selected && (isMine ? "pr-2" : "pl-2")
                )}
                onMouseEnter={() => { if (!selectMode) setHovered(true) }}
                onMouseLeave={() => { if (!selectMode) setHovered(false) }}
                onClick={handleRowClick}
            >
                {/* Checkbox in select mode */}
                {selectMode && (
                    <div className="flex items-center shrink-0">
                        {selected
                            ? <CheckCircle2 className="size-5 text-primary" />
                            : <Circle className="size-5 text-muted-foreground" />}
                    </div>
                )}

                {/* Bubble + reactions wrapper */}
                <div className="flex flex-col gap-1">
                    {/* Bubble */}
                    <div
                        className={cn(
                            "relative px-3.5 py-2 text-sm shadow-sm transition-shadow",
                            isMine
                                ? "bubble-sent"
                                : isBot
                                    ? "bubble-bot"
                                    : "bubble-received",
                            highlighted && "animate-highlight"
                        )}
                    >
                        {/* Bot sparkle prefix */}
                        {isBot && !isMine && (
                            <div className="flex items-center gap-1 mb-1">
                                <Sparkles className="size-3 text-primary" />
                                <span className="text-[10px] font-semibold text-primary">Nexus AI</span>
                            </div>
                        )}

                        {/* Reply preview */}
                        {message.replyTo && !message.softDeleted && (
                            <div
                                onClick={() => navigate(`/user/conversations/${message.conversationId}?highlight=${message.replyTo?._id}`)}
                                className={cn(
                                    "my-2 px-2 py-1 rounded border-l-2 text-xs space-y-0.5 max-w-full cursor-pointer",
                                    isMine
                                        ? "border-white/50 bg-white/10"
                                        : "border-primary/50 bg-primary/5 dark:bg-primary/10"
                                )}>
                                <p className={cn("font-semibold truncate", isMine ? "text-white/80" : "text-primary")}>
                                    {message.replyTo.senderId === myId ? "You" : receiverName}
                                </p>
                                <p className={cn("truncate", isMine ? "text-white/60" : "text-muted-foreground")}>
                                    {message.replyTo.softDeleted ? "This message was deleted" : message.replyTo.text || "🖼️ Photo"}
                                </p>
                            </div>
                        )}

                        {/* Tombstone */}
                        {message.softDeleted ? (
                            <p className="text-xs italic opacity-60 leading-relaxed select-none">This message was deleted</p>
                        ) : (
                            <>
                                {message.imageUrl && (
                                    <img src={message.imageUrl} alt="attachment"
                                        className="max-w-60 max-h-80 rounded-lg mb-1 object-cover" />
                                )}
                                {message.text && (
                                    isBot && !isMine ? (
                                        <div className="text-sm leading-relaxed break-all prose prose-sm max-w-none
                                            prose-p:my-1 prose-p:leading-relaxed
                                            prose-headings:font-semibold prose-headings:my-1
                                            prose-h1:text-base prose-h2:text-sm prose-h3:text-sm
                                            prose-ul:my-1 prose-ul:pl-4 prose-ol:my-1 prose-ol:pl-4 prose-li:my-0
                                            prose-pre:bg-black/10 prose-pre:rounded prose-pre:px-2 prose-pre:py-1 prose-pre:text-xs prose-pre:my-1
                                            prose-code:bg-black/10 prose-code:rounded prose-code:px-1 prose-code:text-xs prose-code:before:content-none prose-code:after:content-none
                                            prose-blockquote:border-l-2 prose-blockquote:pl-2 prose-blockquote:my-1 prose-blockquote:text-muted-foreground
                                            prose-strong:font-semibold dark:prose-invert">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p className="leading-relaxed whitespace-pre-wrap break-all">{message.text}</p>
                                    )
                                )}
                            </>
                        )}

                        {/* Timestamp + seen receipt */}
                        <span className={cn(
                            "flex items-center justify-end gap-1 text-[10px] mt-0.5 leading-none",
                            isMine ? "text-white/60" : "text-muted-foreground"
                        )}>
                            {formatTime(message.createdAt)}
                            {isMine && (() => {
                                const seen = message.seenBy?.some((s) => s.user === receiverId)
                                return seen
                                    ? <CheckCheck className="size-3 text-sky-300 shrink-0" />
                                    : <Check className="size-3 shrink-0" />
                            })()}
                        </span>
                    </div>

                    {/* Reaction badges */}
                    {reactionGroups.length > 0 && (
                        <div className={cn("flex flex-wrap gap-1", isMine ? "justify-end" : "justify-start")}>
                            {reactionGroups.map(({ emoji, count, users }) => (
                                <button
                                    key={emoji}
                                    onClick={() => handleReact(emoji)}
                                    className={cn(
                                        "reaction-badge",
                                        users.includes(myId) && "mine"
                                    )}
                                    title={`${count} reaction${count > 1 ? "s" : ""}`}
                                >
                                    <span>{emoji}</span>
                                    {count > 1 && <span className="text-muted-foreground">{count}</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Hover action buttons */}
                {!selectMode && (
                    <div className={cn(
                        "flex flex-col items-center gap-1 transition-opacity duration-150",
                        hovered ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}>
                        {/* Emoji reaction picker bar */}
                        {!message.softDeleted && (
                            <div className="emoji-picker-bar mb-1">
                                {REACTION_EMOJIS.map((emoji) => (
                                    <button
                                        key={emoji}
                                        onClick={() => handleReact(emoji)}
                                        className="text-base hover:scale-125 transition-transform px-0.5"
                                        title={`React with ${emoji}`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Action buttons row */}
                        <div className="flex items-center gap-1">
                            {!message.softDeleted && (
                                <Button size="icon" variant="secondary"
                                    onClick={() => onReply(message)} title="Reply"
                                    className="flex items-center justify-center size-7 rounded-full">
                                    <Reply className="size-3.5" />
                                </Button>
                            )}
                            {!message.softDeleted && onOpenThread && (
                                <Button size="icon" variant="secondary"
                                    onClick={() => onOpenThread(message)} title="View thread"
                                    className="flex items-center justify-center size-7 rounded-full">
                                    <MessageSquareText className="size-3.5" />
                                </Button>
                            )}
                            {!message.softDeleted && (
                                <Button size="icon" variant="secondary"
                                    onClick={() => onStar(message._id)}
                                    title={isStarred ? "Unstar" : "Star"}
                                    className={cn("flex items-center justify-center size-7 rounded-full", isStarred && "text-yellow-400")}>
                                    <Star className={cn("size-3.5", isStarred && "fill-yellow-400")} />
                                </Button>
                            )}
                            {message.text && !message.softDeleted && (
                                <Button size="icon" variant="secondary"
                                    onClick={handleCopy} title="Copy"
                                    className="flex items-center justify-center size-7 rounded-full">
                                    {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
                                </Button>
                            )}
                            {(!message.softDeleted || isMine) && (
                                <Button size="icon" variant="destructive"
                                    onClick={() => setDeleteOpen(true)} title="Delete"
                                    className="flex items-center justify-center size-7 rounded-full">
                                    <Trash2 className="size-3.5 text-muted-foreground group-hover:text-inherit" />
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Dialog */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete message</AlertDialogTitle>
                        <AlertDialogDescription>
                            {message.softDeleted
                                ? "This message is already deleted for everyone. Remove it from your view?"
                                : "Choose how you want to delete this message."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-col gap-2">
                        {isMine && !message.softDeleted && (
                            <AlertDialogAction
                                className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => { setDeleteOpen(false); onDelete(message._id, "everyone") }}>
                                Delete for everyone
                            </AlertDialogAction>
                        )}
                        <AlertDialogAction className="w-full"
                            onClick={() => { setDeleteOpen(false); onDelete(message._id, "me") }}>
                            Delete for me
                        </AlertDialogAction>
                        <AlertDialogCancel className="w-full mt-0">Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
