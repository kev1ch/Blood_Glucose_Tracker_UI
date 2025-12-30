import React, { useState } from 'react'
import './HandSelector.css'
import leftHand from '../assets/images/left_hand_placeholder.png'
import rightHand from '../assets/images/right_hand_placeholder.png'
import { left as leftPositions, right as rightPositions } from './handSpots'

type Hand = 'left' | 'right'

interface Props {
  initialHand?: Hand | null
  onHandSelect?: (hand: Hand) => void
  selectedSpot?: string | null
  onSpotSelect?: (spot: string | null) => void
}

// small helper to build codes like L1L, R3R etc - using narrow literal types for safety
const buildCode = (handChar: 'L' | 'R', finger: 1 | 2 | 3 | 4 | 5, side: 'L' | 'R') => `${handChar}${finger}${side}`

const HandSelector: React.FC<Props> = ({ initialHand = null, onHandSelect, selectedSpot = null, onSpotSelect }) => {
  const [selectedHand, setSelectedHand] = useState<Hand | null>(initialHand)

  const handleSelect = (hand: Hand) => {
    setSelectedHand(hand)
    onHandSelect?.(hand)
  }

  const handleKey = (e: React.KeyboardEvent, hand: Hand) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSelect(hand)
    }
  }

  // positions are imported from `handSpots.ts` so they can be calibrated independently

  // only left and right sides (no center spots)
  const sides = ['L', 'R'] as const

  const renderHand = (hand: Hand) => {
    const handChar = hand === 'left' ? 'L' : 'R'
    const positions = hand === 'left' ? leftPositions : rightPositions

    return (
      <div
        role="button"
        tabIndex={0}
        aria-pressed={selectedHand === hand}
        aria-label={`Select ${hand} hand`}
        className={`hg-hand-container ${hand} ${selectedHand === hand ? 'selected' : selectedHand ? 'off' : ''}`}
        onClick={() => handleSelect(hand)}
        onKeyDown={e => handleKey(e, hand)}
      >
        <div className="hg-hand-clip">
          <img src={hand === 'left' ? leftHand : rightHand} alt={`${hand} hand`} className="hg-hand-img" />

          {/* overlay spots */}
          {positions.map((pos, idx) => (
            <React.Fragment key={idx}>
              {sides.map(side => {
                const code = buildCode(handChar as 'L' | 'R', (idx + 1) as 1 | 2 | 3 | 4 | 5, side)
                // adjust x offset slightly for side: L -> -6, R -> +6
                const sideOffset = side === 'L' ? -6 : 6
                const left = `calc(${pos.x}% + ${sideOffset}px)`
                const top = `${pos.y}%`
                const isSelected = selectedSpot === code

                return (
                  <button
                    key={code}
                    type="button"
                    className={`hg-spot ${isSelected ? 'selected' : ''}`}
                    aria-pressed={isSelected}
                    aria-label={`Puncture spot ${code}`}
                    style={{ left, top }}
                    onClick={e => {
                      e.stopPropagation()
                      onSpotSelect?.(code)
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        onSpotSelect?.(code)
                      }
                    }}
                  />
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="hg-hand-selector">
      <div className={`hg-hands-row ${selectedHand ? 'has-selection' : ''}`}>
        {renderHand('left')}
        {renderHand('right')}
      </div>
    </div>
  )
}

export default HandSelector
