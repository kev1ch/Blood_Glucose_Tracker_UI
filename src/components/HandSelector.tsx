import React, { useState } from 'react'
import './HandSelector.css'
import leftHand from '../assets/images/left_hand_placeholder.png'
import rightHand from '../assets/images/right_hand_placeholder.png'

type Hand = 'left' | 'right'

interface Props {
  initialHand?: Hand | null
  onHandSelect?: (hand: Hand) => void
}

const HandSelector: React.FC<Props> = ({ initialHand = null, onHandSelect }) => {
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

  return (
    <div className="hg-hand-selector">
      <div className={`hg-hands-row ${selectedHand ? 'has-selection' : ''}`}>
        <div
          role="button"
          tabIndex={0}
          aria-pressed={selectedHand === 'left'}
          aria-label="Select left hand"
          className={`hg-hand-container left ${selectedHand === 'left' ? 'selected' : selectedHand ? 'off' : ''}`}
          onClick={() => handleSelect('left')}
          onKeyDown={e => handleKey(e, 'left')}
        >
          <img src={leftHand} alt="Left hand" className="hg-hand-img" />
        </div>

        <div
          role="button"
          tabIndex={0}
          aria-pressed={selectedHand === 'right'}
          aria-label="Select right hand"
          className={`hg-hand-container right ${selectedHand === 'right' ? 'selected' : selectedHand ? 'off' : ''}`}
          onClick={() => handleSelect('right')}
          onKeyDown={e => handleKey(e, 'right')}
        >
          <img src={rightHand} alt="Right hand" className="hg-hand-img" />
        </div>
      </div>
    </div>
  )
}

export default HandSelector
