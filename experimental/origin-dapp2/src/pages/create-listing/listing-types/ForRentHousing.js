import React, { Component } from 'react'

import { Switch, Route } from 'react-router-dom'

import Details from '../creation-steps/Details'
import Step1 from '../Step1'
import Step2 from '../Step2'
import Boost from '../Boost'
import Availability from '../Availability'
import Review from '../Review'

import Store from 'utils/store'
const store = Store('sessionStorage')

class ForRentHousing extends Component {

  constructor() {
    super()
    this.state = {
      listing: {
        title: '',
        description: '',
        category: '',
        subCategory: '',
        location: '',
        boost: '50',
        boostLimit: '100',
        media: [],

        // Unit fields:
        quantity: '1',
        price: '',

        // HomeShare fields:
        weekendPrice: '',
        booked: [],
        customPricing: [],
        unavailable: [],

        ...store.get('create-listing', {})
      }
    }
  }

  setListing(listing) {
    store.set('create-listing', listing)
    this.setState({ listing })
  }

  render() {
    return (
      <Switch>
        <Route
          path="/create/ForRentHousing/HouseDetails"
          render={() => (
            <Step2
              listing={this.state.listing}
              listingType={listingType}
              onChange={listing => this.setListing(listing)}
            />
          )}
        />
        <Route
          path="/create/boost"
          render={() => (
            <Boost
              listing={this.state.listing}
              listingType={listingType}
              tokenBalance={this.props.tokenBalance}
              onChange={listing => this.setListing(listing)}
            />
          )}
        />
        <Route
          path="/create/review"
          render={() => (
            <Review
              tokenBalance={this.props.tokenBalance}
              listingType={listingType}
              listing={this.state.listing}
            />
          )}
        />
        <Route
          path="/create/ForRentHousing/availability"
          render={() => (
            <Availability
              tokenBalance={this.props.tokenBalance}
              listing={this.state.listing}
              onChange={listing => this.setListing(listing)}
            />
          )}
        />
        <Route
          render={() => (
            <Details
              listing={this.state.listing}
              nextPath='/create/ForRentHousing/availability'
              onChange={listing => this.setListing(listing)}
            />
          )}
        />
      </Switch>
    )
  }
}

export default ForRentHousing
