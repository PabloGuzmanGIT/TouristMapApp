'use client'

type ToggleSwitchProps = {
    label: string
    checked: boolean
    onChange: (checked: boolean) => void
    description?: string
}

export function ToggleSwitch({ label, checked, onChange, description }: ToggleSwitchProps) {
    return (
        <label className="flex items-center justify-between cursor-pointer group">
            <div>
                <span className="text-sm font-medium">{label}</span>
                {description && (
                    <p className="text-xs text-foreground/50">{description}</p>
                )}
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-foreground/20'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
        </label>
    )
}
