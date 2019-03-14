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
  const code = await db.GrowthInviteCode.findOne({
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

  logger.info(
    `Sending ${recipients.length} invitation emails on behalf of ${referrer}`
  )
  for (const recipient of recipients) {
    // Validate recipient is a proper email.
    if (!validator.isEmail(recipient)) {
      logger.error(`Skipping sending invite to invalid email ${recipient}`)
      continue
    }

    // Send the invite code to the recipient.
    const dappUrl = process.env.DAPP_URL || 'http://localhost:3000'
    const welcomeUrl = `${dappUrl}/${code}`
    const email = {
      to: recipient,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `${contactName} invited you to join Origin`,
      text: `Check out the Origin DApp at ${welcomeUrl}`,
      html: `Check out the <a href="${welcomeUrl}">Origin Protocol DApp</a>`
    }
    try {
      await sendgridMail.send(email)
    } catch (error) {
      logger.error(`Failed sending invite: ${error}`)
      throw new Error(`Failed sending invite: ${error}`)
    }

    // Make sure the entry is not a duplicate then
    // record an entry in the growth_invite table.
    const existing = await db.GrowthInvite.findOne({
      where: {
        referrerEthAddress: referrer.toLowerCase(),
        refereeContactType: enums.GrowthInviteContactTypes.Email,
        refereeContact: recipient
      }
    })
    if (!existing) {
      await db.GrowthInvite.create({
        referrerEthAddress: referrer.toLowerCase(),
        refereeContactType: enums.GrowthInviteContactTypes.Email,
        refereeContact: recipient,
        status: enums.GrowthInviteStatuses.Sent
      })
    }
    logger.info('Invites sent and recorded in DB.')
  }
}

module.exports = { sendInvites }
