"use client"
import { useRef, useState } from 'react'
import Image from 'next/image'

type Props = {
	title: string
	summary: string
	imageUrl?: string
	onSwipe: (dir: 'left' | 'right') => void
}

export default function SwipeCard({ title, summary, imageUrl, onSwipe }: Props) {
	const cardRef = useRef<HTMLDivElement>(null)
	const [start, setStart] = useState<{x:number,y:number}|null>(null)
	const [delta, setDelta] = useState<{x:number,y:number}>({x:0,y:0})

	function onTouchStart(e: React.TouchEvent) {
		const t = e.touches[0]
		setStart({ x: t.clientX, y: t.clientY })
	}
	function onTouchMove(e: React.TouchEvent) {
		if (!start) return
		const t = e.touches[0]
		setDelta({ x: t.clientX - start.x, y: t.clientY - start.y })
	}
	function onTouchEnd() {
		if (Math.abs(delta.x) > 80) {
			onSwipe(delta.x > 0 ? 'right' : 'left')
		}
		setStart(null)
		setDelta({x:0,y:0})
	}

	return (
		<div
			ref={cardRef}
			onTouchStart={onTouchStart}
			onTouchMove={onTouchMove}
			onTouchEnd={onTouchEnd}
			className="select-none rounded-2xl overflow-hidden bg-white/5 backdrop-blur border border-white/10"
			style={{ transform: `translate(${delta.x}px, ${delta.y}px) rotate(${delta.x/20}deg)`, transition: start ? 'none':'transform 0.2s ease' }}
		>
			{imageUrl && (
				<div className="relative w-full h-48">
					<Image src={imageUrl} alt="" fill className="object-cover" />
				</div>
			)}
			<div className="p-4">
				<h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
				<p className="text-sm text-slate-300 line-clamp-4">{summary}</p>
			</div>
		</div>
	)
}