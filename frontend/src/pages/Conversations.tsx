import { MessageSquareText, Sparkles, Zap } from "lucide-react"

const Conversations = () => {
    return (
        <div className="w-full h-full flex items-center justify-center mesh-bg">
            <div className="text-center space-y-4 max-w-xs px-6">
                <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl nexus-gradient-bg nexus-glow">
                            <MessageSquareText className="h-8 w-8 text-white" />
                        </div>
                        <Sparkles className="absolute -top-1 -right-1 size-4 text-primary animate-pulse" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-extrabold nexus-gradient-text tracking-tight">
                        Nexus
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Select a conversation from the sidebar to start chatting
                    </p>
                </div>
                <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground/60 mt-2">
                    <Zap className="size-3 text-primary" />
                    <span>Real-time · AI-powered · Private</span>
                </div>
            </div>
        </div>
    )
}

export default Conversations