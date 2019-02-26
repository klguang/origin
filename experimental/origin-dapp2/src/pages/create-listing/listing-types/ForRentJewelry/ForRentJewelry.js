import React, { Component } from 'react'

import { Switch, Route } from 'react-router-dom'
import Redirect from 'components/Redirect'

import Details from './Details'
import Boost from './Boost'
import Availability from './Availability'
import Review from './Review'

import Store from 'utils/store'
const store = Store('sessionStorage')

class ForRentJewelry extends Component {

  constructor() {
    super()
    this.state = {
      step: 1,
      listing: {
        title: '',
        description: '',
        category: '',
        subCategory: '',
        location: '',
        boost: '50',
        boostLimit: '100',
        media: [],

        // HomeShare fields:
        weekendPrice: '',
        booked: [],
        customPricing: [],
        unavailable: [],

        ...store.get('create-listing', {})
      }
    }
  }

  setListing(listing, step) {
    this.setState({listing})
    store.set('create-listing', listing)
  }

  render() {
    const steps=4
    switch (this.state.step) {
      case 0:
        return (
          <Redirect to={`/create/new`} />
        )
      case 1:
        return (
          <Details
            listing={this.state.listing}
            steps = {steps}
            step = {1}
            onPrev={() => this.setState({step: 0})}
            onNext={() => this.setState({step: 2})}
            onChange={listing => this.setListing(listing)}
          />
        )
      case 2:
        return (
          <Availability
            listing={this.state.listing}
            steps = {steps}
            step = {2}
            tokenBalance={this.props.tokenBalance}
            onPrev={() => this.setState({step: 1})}
            onNext={() => this.setState({step: 3})}
            onChange={listing => this.setListing(listing)}
          />
        )
      case 3:
        return (
          <Boost
            listing={this.state.listing}
            steps = {steps}
            step = {3}
            tokenBalance={this.props.tokenBalance}
            onPrev={() => this.setState({step: 2})}
            onNext={() => this.setState({step: 4})}
            onChange={listing => this.setListing(listing)}
          />
        )
      case 4:
        return (
          <Review
            listing={this.state.listing}
            steps = {steps}
            step = {4}
            tokenBalance={this.props.tokenBalance}
            onPrev={() => this.setState({step: 3})}
            onNext={() => this.setState({step: 5})}
            onChange={listing => this.setListing(listing)}
          />
        )
      default:
        return (
          <div>Something went wrong</div>
        )
    }
  }
}

export default ForRentJewelry
