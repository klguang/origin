import React from 'react'

const CoinPrice = ({ price, coin }) => (
  <div className={`coin-price ${coin}`}>
    {price}
    <span>{coin}</span>
  </div>
)

export default CoinPrice

require('react-styl')(`
  .coin-price
    display: inline-block
    padding-left: 1.625rem
    background-size: 1.25rem
    background-repeat: no-repeat
    background-position: 0px 3px
    font-weight: bold
    span
      margin-left: 0.25rem
      font-size: 14px
      text-transform: uppercase
    &.eth
      background-image: url(images/eth-icon.svg)
      span
        color: var(--dark-purple)
    &.ogn
      background-image: url(images/ogn-icon.svg)
      span
        color: #007bff
`)
