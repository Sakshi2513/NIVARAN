'use client'

import { LoadingSkeleton } from '../components/ui/LoadingSkeleton'

export default function Loading() {
  return (
    <div className="p-6 w-full h-full flex flex-col items-center justify-center">
      <LoadingSkeleton type="chart" />
    </div>
  )
}