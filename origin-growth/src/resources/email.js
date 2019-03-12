const sendgridMail = require('@sendgrid/mail')
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY)
const validator = require('validator')

const _growthModels = require('../models')
const _identityModels = require('origin-identity/src/models')
const db = { ..._growthModels, ..._identityModels }
const enums = require('../enums')
const logger = require('../logger')

// Do not allow referrer to blast invites to more than maxNumInvites recipients.
const maxNumInvites = 50

/**
 * Send invite codes by email.
 * @param {string} referrer - Eth address of the referrer.
 * @param {Array<string>>} recipients - List of email addresses.
 */
async function sendInvites(referrer, recipients) {
  if (recipients.length > maxNumInvites) {
    throw new Error(`Exceded number of invites limit.`)
  }

  // Load the invite code for the referrer.
  const code = db.GrowthInviteCode.findOne({
    where: { ethAddress: referrer.toLowerCase() }
  })
  if (!code) {
    throw new Error(`No invite code for ${referrer}`)
  }

  // Load the referrer's identity to get their name.
  const identity = await db.Identity.findOne({
    where: { ethAddress: referrer.toLowerCase() }
  })
  if (!identity) {
    throw new Error(`Failed loading identity for ${referrer}`)
  }
  const contactName =
    (identity.firstName || '') + ' ' + (identity.lastName || '')

  for (const recipient of recipients) {
    // Validate recipient is a proper email.
    if (!validator.isEmail(recipient)) {
      logger.error(`Skipping sending invite to invalid email ${recipient}`)
      continue
    }

    // Send the invite code to the recipient.
    // TODO: should we have an html version of the email ?
    const email = {
      to: recipient,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `${contactName} invited you to join Origin`,
      text: `Check out the Origin DApp at https://dapp.originprotocol.com/invite/${code}`,
      html: `Check out the <a href="https://dapp.originprotocol.com/invite/${code}">Origin Protocol DApp</a>`
    }
    try {
      await sendgridMail.send(email)
    } catch (error) {
      logger.error(`Failed sending invite: ${error}`)
      throw new Error(`Failed sending invite: ${error}`)
    }

    // Record the invite in the growth_invite table.
    await db.GrowthInvite.create({
      referrerEthAddress: referrer.toLowerCase(),
      refereeContactType: enums.GrowthInviteContactTypes.Email,
      refereeContact: recipient,
      status: enums.GrowthInviteStatuses.Sent
    })
  }
}

module.exports = { sendInvites }
