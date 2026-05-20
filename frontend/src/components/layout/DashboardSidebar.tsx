import { Link, useLocation, useNavigate } from "react-router-dom"
import { Bot, LogOut, MessagesSquare, Settings, Star, Zap, BarChart3 } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { useConversations } from "@/hooks/use-conversations"
import { cn } from "@/lib/utils"
import { Separator } from "../ui/separator"
import StatusPopover from "@/components/dashboard/StatusPopover"

const NAV_ITEMS = [
    {
        label: "Admin Analytics",
        href: "/user/dashboard",
        icon: BarChart3,
        tooltip: "System Analytics",
    },
    {
        label: "Support Sessions",
        href: "/user/conversations",
        icon: MessagesSquare,
        tooltip: "Support Sessions",
    },
    {
        label: "Starred Messages",
        href: "/user/starred",
        icon: Star,
        tooltip: "Starred Messages",
    },
]

export default function DashboardSidebar() {
    const { user, logout } = useAuth()
    const { conversationsList, aiChatbotConversationId } = useConversations()
    const { state, isMobile } = useSidebar()
    const location = useLocation()
    const navigate = useNavigate()

    const unreadChatsCount = conversationsList.filter((c) =>
        c.unreadCounts.some((u) => u.userId === user?._id && u.count > 0)
    ).length

    const handleLogout = () => {
        logout()
        navigate("/", { replace: true })
    }

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "?"

    const isExpanded = state === "expanded" || isMobile

    return (
        <Sidebar collapsible="icon">
            {/* ── Brand header (expanded only) ─────────────── */}
            {isExpanded && (
                <div className="px-4 pt-4 pb-2 flex items-center gap-2 shrink-0">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                        <Zap className="size-3.5 text-primary" />
                    </div>
                    <span className="font-extrabold text-lg tracking-tight leading-none nexus-gradient-text">
                        Nexus
                    </span>
                </div>
            )}

            {/* ── Nav ─────────────────────────────────────── */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className={"mt-1 w-full" + (!isMobile && state === "collapsed" ? " items-center" : "")}>
                            {NAV_ITEMS.map(({ label, href, icon: Icon, tooltip }) => {
                                const isActive =
                                    href === "/user/conversations"
                                        ? location.pathname.startsWith("/user/conversations")
                                        : location.pathname === href
                                const isConversations = href === "/user/conversations"
                                const showBadge = isConversations && unreadChatsCount > 0
                                return (
                                    <SidebarMenuItem key={label} className="min-w-10 min-h-10">
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            title={tooltip}
                                            className={cn(
                                                "min-w-10 min-h-10 p-4 transition-all",
                                                isActive
                                                    ? "bg-primary/15 text-primary border-l-2 border-primary rounded-l-none"
                                                    : "hover:bg-primary/8"
                                            )}
                                        >
                                            <Link to={href} className="flex items-center gap-2">
                                                <div className="relative shrink-0">
                                                    <Icon className={cn("mx-0.5 min-h-5 min-w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                                                    {showBadge && state === "collapsed" && (
                                                        <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full nexus-gradient-bg text-[9px] font-bold text-white leading-none">
                                                            {unreadChatsCount > 9 ? "9+" : unreadChatsCount}
                                                        </span>
                                                    )}
                                                </div>
                                                <span>{label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                        {showBadge && (
                                            <SidebarMenuBadge className="nexus-gradient-bg text-white! rounded-full">
                                                {unreadChatsCount > 99 ? "99+" : unreadChatsCount}
                                            </SidebarMenuBadge>
                                        )}
                                    </SidebarMenuItem>
                                )
                            })}
                            <Separator className="mt-1 mb-3 opacity-50" />
                            {/* AI Assistant button */}
                            <SidebarMenuItem title="AI Assistant" key="ai-assistant" className="min-w-10 min-h-10">
                                <SidebarMenuButton
                                    asChild
                                    className={cn(
                                        "min-w-10 min-h-10 p-4 nexus-gradient-bg hover:opacity-90 text-white hover:text-white transition-all nexus-glow",
                                        state === "collapsed" && "rounded-full"
                                    )}
                                >
                                    <Link to={`/user/conversations/${aiChatbotConversationId}`} className="flex items-center gap-2">
                                        <div className="relative shrink-0">
                                            <Bot className="mx relative min-h-5 min-w-5" />
                                        </div>
                                        <span>AI Assistant</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* ── Footer ──────────────────────────────────── */}
            <SidebarFooter>
                <SidebarMenu className={"w-full mb-1" + (!isMobile && state === "collapsed" ? " items-center" : "")}>
                    {/* Settings */}
                    <SidebarMenuItem key="Account Settings" className="flex min-w-10 min-h-10 items-center justify-center">
                        <SidebarMenuButton asChild title="Account Settings" className="min-w-9 min-h-9">
                            <Link to="/user/profile" className="flex items-center gap-2">
                                <div className="relative shrink-0">
                                    <Settings className="min-h-5 min-w-5 text-muted-foreground" />
                                </div>
                                <span>Account Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <Separator className="mb-2 opacity-50" />

                    {/* User info row — wrapped in StatusPopover */}
                    <SidebarMenuItem>
                        <StatusPopover>
                            <SidebarMenuButton
                                size="lg"
                                className="cursor-pointer hover:bg-primary/8 p-1 transition-all"
                                title="Set status"
                            >
                                <div className="relative shrink-0">
                                    <Avatar className="size-7 shrink-0 rounded-lg">
                                        <AvatarImage src={user?.profilePic} alt={user?.name} />
                                        <AvatarFallback className="rounded-lg bg-primary/20 text-xs font-semibold">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    {/* online dot */}
                                    <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-green-500 ring-2 ring-sidebar" />
                                </div>
                                <div className="flex min-w-0 flex-col">
                                    <span className="truncate text-sm font-medium leading-tight">{user?.name}</span>
                                    {isExpanded && (
                                        user?.statusText || user?.statusEmoji ? (
                                            <span className="truncate text-xs text-muted-foreground italic leading-tight">
                                                {user.statusEmoji} {user.statusText}
                                            </span>
                                        ) : (
                                            <span className="truncate text-xs text-muted-foreground leading-tight opacity-60">
                                                Set a status…
                                            </span>
                                        )
                                    )}
                                </div>
                            </SidebarMenuButton>
                        </StatusPopover>
                    </SidebarMenuItem>

                    {/* Logout */}
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            title="Log out"
                            onClick={handleLogout}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 active:bg-destructive/10 min-h-10 min-w-10"
                        >
                            <LogOut className="min-h-5 min-w-5" />
                            <span>Log out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}