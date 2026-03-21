import maplibregl from 'maplibre-gl'

/**
 * Shared popup manager for all maps.
 *
 * Desktop: hover marker → show popup, leave marker+popup → hide after delay
 * Mobile:  tap marker → show popup, tap outside or another marker → hide
 */
export function createPopupManager(map: maplibregl.Map) {
    const popup = new maplibregl.Popup({
        offset: 14,
        closeButton: false,
        closeOnClick: false,
        closeOnMove: false,
        maxWidth: '260px',
    })

    let hideTimeout: ReturnType<typeof setTimeout> | null = null
    // Track the current popup element to avoid stacking listeners
    let wiredEl: HTMLElement | null = null

    function clearHide() {
        if (hideTimeout) {
            clearTimeout(hideTimeout)
            hideTimeout = null
        }
    }

    function scheduleHide() {
        clearHide()
        hideTimeout = setTimeout(() => popup.remove(), 350)
    }

    // Mobile: tap outside any marker closes popup
    map.on('click', () => {
        clearHide()
        popup.remove()
    })

    function wirePopupElement() {
        const el = popup.getElement()
        if (!el || el === wiredEl) return
        wiredEl = el
        el.addEventListener('mouseenter', clearHide)
        el.addEventListener('mouseleave', scheduleHide)
    }

    function show(lngLat: [number, number], html: string) {
        clearHide()
        popup.setLngLat(lngLat).setHTML(html).addTo(map)
        // Wire hover on popup DOM after it renders
        requestAnimationFrame(wirePopupElement)
    }

    function hide() {
        clearHide()
        popup.remove()
    }

    /**
     * Wire a marker element for hover (desktop) and tap (mobile).
     */
    function bindMarker(
        el: HTMLElement,
        lngLat: [number, number],
        html: string,
        onClick?: () => void,
    ) {
        // Desktop: hover shows popup
        el.addEventListener('mouseenter', () => {
            show(lngLat, html)
        })

        el.addEventListener('mouseleave', () => {
            scheduleHide()
        })

        // Mobile tap + Desktop click
        el.addEventListener('click', (e) => {
            e.stopPropagation() // prevent map.on('click') from closing immediately
            show(lngLat, html)
            onClick?.()
        })

        // Keyboard a11y
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                show(lngLat, html)
                onClick?.()
            }
        })
    }

    function destroy() {
        clearHide()
        popup.remove()
        wiredEl = null
    }

    return { show, hide, scheduleHide, clearHide, bindMarker, destroy, popup }
}
