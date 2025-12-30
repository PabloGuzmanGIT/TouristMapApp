'use client'

type CheckboxGridProps = {
    options: { value: string; label: string; icon?: string }[]
    selected: string[]
    onChange: (selected: string[]) => void
    columns?: 2 | 3 | 4
}

export function CheckboxGrid({ options, selected, onChange, columns = 3 }: CheckboxGridProps) {
    const toggleOption = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value))
        } else {
            onChange([...selected, value])
        }
    }

    const gridClass = {
        2: 'grid-cols-2',
        3: 'grid-cols-2 md:grid-cols-3',
        4: 'grid-cols-2 md:grid-cols-4',
    }[columns]

    return (
        <div className={`grid ${gridClass} gap-2`}>
            {options.map((option) => {
                const isSelected = selected.includes(option.value)
                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleOption(option.value)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${isSelected
                                ? 'bg-primary/10 border-primary text-primary'
                                : 'bg-background border-foreground/20 text-foreground/70 hover:border-foreground/40'
                            }`}
                    >
                        <span
                            className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'border-foreground/30'
                                }`}
                        >
                            {isSelected && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </span>
                        {option.icon && <span>{option.icon}</span>}
                        <span>{option.label}</span>
                    </button>
                )
            })}
        </div>
    )
}
