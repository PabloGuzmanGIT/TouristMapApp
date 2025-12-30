'use client'

type PillSelectorProps = {
    options: { value: string; label: string }[]
    selected: string
    onChange: (value: string) => void
}

export function PillSelector({ options, selected, onChange }: PillSelectorProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((option) => {
                const isSelected = selected === option.value
                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isSelected
                                ? 'bg-primary text-white'
                                : 'bg-foreground/10 text-foreground/70 hover:bg-foreground/20'
                            }`}
                    >
                        {option.label}
                    </button>
                )
            })}
        </div>
    )
}
