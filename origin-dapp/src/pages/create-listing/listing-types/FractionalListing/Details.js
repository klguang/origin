import React, { Component } from 'react'
import omit from 'lodash/omit'

import Steps from 'components/Steps'
import Wallet from 'components/Wallet'
import ImagePicker from 'components/ImagePicker'
import Price from 'components/Price'
import Redirect from 'components/Redirect'
import Link from 'components/Link'

import { formInput, formFeedback } from 'utils/formHelpers'

class Details extends Component {
  constructor(props) {
    super(props)
    this.state = omit(props.listing, 'valid')
  }

  componentDidMount() {
    if (this.titleInput) {
      this.titleInput.focus()
    }
  }

  render() {
    if (this.state.valid) {
      return <Redirect to={this.props.next} push />
    }

    const input = formInput(this.state, state => this.setState(state))
    const Feedback = formFeedback(this.state)

    return (
      <div className="row">
        <div className="col-md-8">
          <div className="create-listing-step-2">
            <div className="wrap">
              <div className="step">{`Step ${this.props.step}`}</div>
              <div className="step-description">Provide listing details</div>
              <Steps steps={this.props.steps} step={this.props.step} />

              <form
                onSubmit={e => {
                  e.preventDefault()
                  this.validate()
                }}
              >
                {this.state.valid !== false ? null : (
                  <div className="alert alert-danger">
                    Please fix the errors below...
                  </div>
                )}
                <div className="form-group">
                  <label>Title</label>
                  <input {...input('title')} ref={r => (this.titleInput = r)} />
                  {Feedback('title')}
                </div>
                <div className="form-group">
                  <label className="mb-0">Description</label>
                  <div className="help-text">
                    Make sure to include any product variant details here. Learn
                    more
                  </div>
                  <textarea {...input('description')} />
                  {Feedback('description')}
                </div>

                {/* BEGIN Homeshare specific code */}

                <div className="form-group">
                  <label>
                    Default Weekday Pricing (Sunday - Thursday nights)
                  </label>
                  <div className="d-flex">
                    <div style={{ flex: 1, marginRight: '1rem' }}>
                      <div className="with-symbol">
                        <input {...input('price')} />
                        <span className="eth">ETH</span>
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="with-symbol corner">
                        <Price
                          el="input"
                          amount={this.state.price}
                          className="form-control form-control-lg"
                        />
                        <span className="usd">USD</span>
                      </div>
                    </div>
                  </div>
                  {Feedback('price')}
                  <div className="help-text price">
                    Price is always in ETH, USD is an estimate.
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    Default Weekend Pricing (Friday &amp; Saturday nights)
                  </label>
                  <div className="d-flex">
                    <div style={{ flex: 1, marginRight: '1rem' }}>
                      <div className="with-symbol">
                        <input {...input('weekendPrice')} />
                        <span className="eth">ETH</span>
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="with-symbol corner">
                        <Price
                          el="input"
                          amount={this.state.weekendPrice}
                          className="form-control form-control-lg"
                        />
                        <span className="usd">USD</span>
                      </div>
                    </div>
                  </div>
                  {Feedback('weekendPrice')}
                </div>

                {/* END Homeshare specific code */}

                <div className="form-group">
                  <label>Select photos</label>
                  <ImagePicker
                    images={this.state.media}
                    onChange={media => this.setState({ media })}
                  >
                    <div className="add-photos">Select photos</div>
                  </ImagePicker>
                  <ul className="help-text photo-help list-unstyled">
                    <li>
                      Hold down &apos;command&apos; (⌘) to select multiple
                      images.
                    </li>
                    <li>Maximum 10 images per listing.</li>
                    <li>
                      First image will be featured - drag and drop images to
                      reorder.
                    </li>
                    <li>Recommended aspect ratio is 4:3</li>
                  </ul>
                </div>

                <div className="actions">
                  <Link
                    className="btn btn-outline-primary"
                    to={this.props.prev}
                  >
                    Back
                  </Link>
                  <button type="submit" className="btn btn-primary">
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-4 d-none d-md-block">
          <Wallet />
          <div className="gray-box">
            <h5>Add Listing Details</h5>
            Be sure to give your listing an appropriate title and description to
            let others know what you&apos;re offering. Adding some photos will
            increase the chances of selling your listing.
          </div>
        </div>
      </div>
    )
  }

  validate() {
    const newState = {}

    if (!this.state.title) {
      newState.titleError = 'Title is required'
    } else if (this.state.title.length < 3) {
      newState.titleError = 'Title is too short'
    } else if (this.state.title.length > 100) {
      // Limit from origin-validator/src/schemas/listing.json
      newState.titleError = 'Title is too long'
    }

    if (!this.state.description) {
      newState.descriptionError = 'Description is required'
    } else if (this.state.description.length < 10) {
      newState.descriptionError = 'Description is too short'
    } else if (this.state.description.length > 1024) {
      // Limit from origin-validator/src/schemas/listing.json
      newState.descriptionError = 'Description is too long'
    }

    if (!this.state.price) {
      newState.priceError = 'Price is required'
    } else if (!this.state.price.match(/^-?[0-9.]+$/)) {
      newState.priceError = 'Price must be a number'
    } else if (Number(this.state.price) <= 0) {
      newState.priceError = 'Price must be greater than zero'
    }

    if (!this.state.weekendPrice) {
      newState.weekendPriceError = 'Weekend pricing is required'
    } else if (!this.state.weekendPrice.match(/^-?[0-9.]+$/)) {
      newState.weekendPriceError = 'Weekend pricing must be a number'
    } else if (Number(this.state.weekendPrice) <= 0) {
      newState.weekendPriceError = 'Weekend pricing must be greater than zero'
    }

    newState.valid = Object.keys(newState).every(f => f.indexOf('Error') < 0)

    if (!newState.valid) {
      window.scrollTo(0, 0)
    } else if (this.props.onChange) {
      this.props.onChange(this.state)
    }
    this.setState(newState)
    return newState.valid
  }
}

export default Details

require('react-styl')(`
  .create-listing .create-listing-step-2
    max-width: 460px
    .step-description
      font-size: 28px
    label
      font-size: 18px;
      font-weight: normal;
      color: var(--dusk)
      margin-bottom: 0.25rem
    .form-control
      border-color: var(--light)
      font-size: 18px;
      &.is-invalid
        border-color: #dc3545
        background-image: none
      &::-webkit-input-placeholder
        color: var(--bluey-grey)
        font-size: 18px;
    .invalid-feedback
      font-weight: normal
    textarea
      min-height: 120px
    .image-picker label
      margin: 0
    .add-photos
      border: 1px dashed var(--light)
      font-size: 14px;
      font-weight: normal;
      color: var(--bluey-grey);
      height: 100%
      min-height: 9rem
      display: flex
      align-items: center
      justify-content: center
      flex-direction: column

      &::before
        content: ""
        background: url(images/camera-icon-circle.svg) no-repeat
        width: 5rem;
        height: 3rem;
        background-size: 100%;
        background-position: center;
        opacity: 0.4;
      &:hover::before
        opacity: 0.6
    .help-text
      font-size: 14px
      font-weight: normal
      margin-bottom: 0.5rem
      color: var(--dusk)
      &.price
        color: var(--bluey-grey)
        margin-top: 0.5rem
      &.photo-help
        font-weight: 300

  .with-symbol
    position: relative
    &.corner::before
      content: '';
      position: absolute;
      left: -8px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-top: 9px solid transparent;
      border-right: 9px solid var(--light);
      border-bottom: 9px solid transparent;
    &.corner::after
      content: '';
      position: absolute;
      left: -6px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-top: 7px solid transparent;
      border-right: 7px solid #e9ecef;
      border-bottom: 7px solid transparent;
    > span
      position: absolute
      right: 10px
      top: 50%
      transform: translateY(-50%)
      padding: 2px 9px 2px 9px
      border-radius: 12px
      background: var(--pale-grey)
      background-repeat: no-repeat
      background-position: 6px center
      background-size: 17px
      font-weight: bold
      font-size: 14px
      &.eth
        padding-left: 1.75rem
        color: var(--bluish-purple)
        background-image: url(images/eth-icon.svg)
      &.ogn
        padding-left: 1.75rem
        color: var(--clear-blue)
        background-image: url(images/ogn-icon.svg)
      &.usd
        &::before
          content: "$"
          margin-right: 0.25rem
`)
