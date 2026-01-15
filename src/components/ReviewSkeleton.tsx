export default function ReviewSkeleton() {
    return (
        <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-2xl p-6 space-y-4 animate-pulse">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-foreground/10" />
                    <div>
                        <div className="h-4 w-32 bg-foreground/10 rounded mb-2" />
                        <div className="h-3 w-24 bg-foreground/10 rounded" />
                    </div>
                </div>
                <div className="h-6 w-24 bg-foreground/10 rounded" />
            </div>

            {/* Content */}
            <div className="space-y-2">
                <div className="h-4 bg-foreground/10 rounded w-3/4" />
                <div className="h-4 bg-foreground/10 rounded w-full" />
                <div className="h-4 bg-foreground/10 rounded w-2/3" />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-foreground/10">
                <div className="h-8 w-24 bg-foreground/10 rounded" />
                <div className="h-8 w-24 bg-foreground/10 rounded" />
            </div>
        </div>
    )
}
