import React from 'react'
import get from 'lodash/get'

import EventTick from 'components/EventTick'

const SaleStages = [
  { title: 'Offer Placed', event: 'createdEvent' },
  { title: 'Offer Accepted', event: 'acceptedEvent' },
  { title: 'Sale Completed', event: 'finalizedEvent' }
]

const DisputeStages = [
  { title: 'Offer Placed', event: 'createdEvent' },
  { title: 'Offer Accepted', event: 'acceptedEvent' },
  { title: 'Dispute Started', event: 'disputedEvent', className: 'danger' },
  { title: 'Ruling Made', event: 'rulingEvent' }
]

const CanceledStages = [
  { title: 'Offer Placed', event: 'createdEvent' },
  {
    title: 'Offer Withdrawn',
    ifSeller: 'Offer Rejected',
    event: 'withdrawnEvent'
  }
]

const TransactionStages = ({ offer }) => {
  let stages = SaleStages
  if (offer.status === 3 || offer.status === 5) {
    stages = DisputeStages
  } else if (offer.status === 0) {
    stages = CanceledStages
  }

  const events = stages.map((stage, idx) => {
    const className = [],
      nextStage = stages[idx + 1],
      prevStage = stages[idx - 1]

    if (offer[stage.event]) {
      className.push('active')
      if ((nextStage && offer[nextStage.event]) || !nextStage) {
        className.push('bg')
      } else if (prevStage) {
        className.push('bgl')
      }
    }

    const event = offer[stage.event]
    if (stage.className) {
      className.push(stage.className)
    }

    const party = get(event, 'returnValues.party')
    const seller = get(offer, 'listing.seller.id')
    const isSeller = party === seller

    const title = stage.ifSeller && isSeller ? stage.ifSeller : stage.title

    return (
      <EventTick key={idx} className={className.join(' ')} event={event}>
        {title}
      </EventTick>
    )
  })

  return <div className="stages">{events}</div>
}

export default TransactionStages

require('react-styl')(`
  .stages
    width: 100%
    display: flex
    justify-content: space-evenly
    align-items: flex-start
    font-size: 14px
    color: var(--dark)
    font-weight: normal
    position: relative
    > div
      flex: 1
      display: flex
      flex-direction: column
      align-items: center
      position: relative
      text-align: center
      line-height: normal
      padding: 0 0.25rem
      &::before
        content: ""
        background-color: var(--pale-grey-two)
        background-size: 0.75rem
        border-radius: 2rem
        width: 1.2rem
        height: 1.2rem
        margin-bottom: 0.25rem
        z-index: 5
      &::after
        content: ""
        background-color: var(--pale-grey-two)
        height: 5px
        left: 0
        right: 0
        top: 0.45rem
        position: absolute
        z-index: 4
      &.active::before
        background: var(--greenblue) url(images/checkmark.svg) center no-repeat
      &.danger::before
        background: var(--orange-red)
        content: "!";
        font-weight: 900;
        color: var(--white);
        text-align: center;
        font-size: 14px;
        line-height: 19px;
      &:first-child::after
        left: 50%
      &:last-child::after
        right: 50%
      &.bg::after
        background: var(--greenblue)
      &.bgl::after
        background-image: linear-gradient(to right, var(--greenblue), var(--greenblue) 50%, var(--pale-grey-two) 50%, var(--pale-grey-two))
`)
