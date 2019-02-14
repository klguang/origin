import React, { Component } from 'react'

import { Switch, Route } from 'react-router-dom'
import Redirect from 'components/Redirect'

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
      step: 0,
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

    // this.createSequence = [
    //   <Details />,
    //   <Availability/>
    // ]
  }

  setListing(listing, step) {
    store.set('create-listing', listing)
    this.setState({ listing, step: step })
  }

  render() {
    switch (this.state.step) {
      case 0:
        return (
          <Details
            listing={this.state.listing}
            onPrev={
              <Redirect to={`/`} />
            }
            onChange={listing => this.setListing(listing, 1)}
          />
        )
      case 1:
        return (
          <Availability
            listing={this.state.listing}
            tokenBalance={this.props.tokenBalance}
            onPrev={() => this.setState({step: 0})}
            onChange={listing => this.setListing(listing, 2)}
          />
        )
      default:
        return (
          <div>Something went wrong</div>
        )
    }

    // return this.createSequence[this.state.step]

    // return (
    //   <Switch>
    //     <Route
    //       path="/create/ForRentHousing/HouseDetails"
    //       render={() => (
    //         <Step2
    //           listing={this.state.listing}
    //           listingType={listingType}
    //           onChange={listing => this.setListing(listing)}
    //         />
    //       )}
    //     />
    //     <Route
    //       path="/create/boost"
    //       render={() => (
    //         <Boost
    //           listing={this.state.listing}
    //           listingType={listingType}
    //           tokenBalance={this.props.tokenBalance}
    //           onChange={listing => this.setListing(listing)}
    //         />
    //       )}
    //     />
    //     <Route
    //       path="/create/review"
    //       render={() => (
    //         <Review
    //           tokenBalance={this.props.tokenBalance}
    //           listingType={listingType}
    //           listing={this.state.listing}
    //         />
    //       )}
    //     />
    //     <Route
    //       path="/create/ForRentHousing/availability"
    //       render={() => (
    //         <Availability
    //           tokenBalance={this.props.tokenBalance}
    //           listing={this.state.listing}
    //           onChange={listing => this.setListing(listing)}
    //         />
    //       )}
    //     />
    //     <Route
    //       render={() => (
    //         <Details
    //           listing={this.state.listing}
    //           nextPath='/create/ForRentHousing/availability'
    //           onChange={listing => this.setListing(listing)}
    //         />
    //       )}
    //     />
    //   </Switch>
    // )
  }
}

export default ForRentHousing
