'use client'

import { City, CityData, LatLng, Place } from "@/types"
import React from "react"
import CityMapInline from "./CityMapInline"
import HighlightsInline from "./HighlightsInline"



export default function ClientBridge({ meta }: { meta: City }) {

  const [focus, setFocus] = React.useState<string | undefined>(undefined)
  return (
    <>
      <CityMapInline
        city={meta}
        className="h-[60vh] w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
        focusPlaceSlug={focus}
      />
      <HighlightsInline citySlug={meta.slug} onFocus={setFocus} />
    </>
  )
}

