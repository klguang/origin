import React, { Component } from 'react'

import withTokenBalance from 'hoc/withTokenBalance'
import withWallet from 'hoc/withWallet'

import PageTitle from 'components/PageTitle'

import ForRentHousing from './listing-types/ForRentHousing/ForRentHousing'
import ForSaleOther from './listing-types/ForSaleOther/ForSaleOther'
import ForSaleBicycles from './listing-types/ForSaleBicycles/ForSaleBicycles'

import ChooseListingType from './ChooseListingType'

import Store from 'utils/store'
const store = Store('sessionStorage')

class CreateListing extends Component {

  // TODO: wait...should we even have a listing state here? it should be handled in the listing-type specific component!! e.g. <ForRentHousing/>
  constructor() {
    super()
    // this.state = {
    //   listing: {
    //     title: '',
    //     description: '',
    //     category: '',
    //     subCategory: '',
    //     location: '',
    //     boost: '50',
    //     boostLimit: '100',
    //     media: [],

    //     // Unit fields:
    //     quantity: '1',
    //     price: '',

    //     // HomeShare fields:
    //     weekendPrice: '',
    //     booked: [],
    //     customPricing: [],
    //     unavailable: [],

    //     ...store.get('create-listing', {})
    //   }
    // }
  }

  setListing(listing) {
    debugger;
    store.set('create-listing', listing)
    this.setState({ listing })
  }

  render() {
    let listingType = this.props.match.params.listingType

    // const { category, subCategory } = this.state.listing
    // let listingType = 'unit'
    // if (category === 'schema.forRent' && subCategory === 'schema.housing') {
    //   listingType = 'fractional'
    // }
    // if (category === 'schema.forRent' && subCategory === 'schema.jewelry') {
    //   listingType = 'fractional'
    // }

    const listingTypeMapping = {
      'forrenthousing' : ForRentHousing,
      'forsaleother' : ForSaleOther,
      'forsalebicycles' : ForSaleBicycles
    }
    if (listingType.toLowerCase()!='new') {
      if (listingType.toLowerCase() in listingTypeMapping) {
        const ListingTypeComponent = listingTypeMapping[listingType.toLowerCase()]
        return (
          <div className="container create-listing">
            <PageTitle>{listingType}</PageTitle>
            <ListingTypeComponent />
          </div>
        )
      }
      else {
        return (
          <div className="container create-listing">
            <div>Unkown listing type of "<code>{listingType}</code>". Something went wrong.</div>
          </div>
        )
      }
    }
    else if (listingType.toLowerCase()=='new') {
      return (
        <div className="container create-listing">
          <PageTitle>Add a Listing</PageTitle>
            <ChooseListingType />
        </div>
      )
    }
  }
}

export default withWallet(withTokenBalance(CreateListing))

require('react-styl')(`
  .create-listing
    padding-top: 3rem
    .gray-box
      border-radius: 5px
      padding: 2rem
      background-color: var(--pale-grey-eight)

    .step
      font-family: Lato
      font-size: 14px
      color: var(--dusk)
      font-weight: normal
      text-transform: uppercase
      margin-top: 0.75rem
    .step-description
      font-family: Poppins
      font-size: 24px
      font-weight: 300
      line-height: normal

    .actions
      margin-top: 2.5rem
      display: flex
      justify-content: space-between
      .btn
        min-width: 10rem
        border-radius: 2rem
        padding: 0.625rem
        font-size: 18px
`)
