require('dotenv').config()
const inquirer = require('inquirer')
const admin = require('firebase-admin')
const { getAuth } = require('firebase-admin/auth')
const { applicationDefault } = require('firebase-admin/app')

availablePermissions = [
  'CAN_VIEW_ALL_BOOKINGS',
  'CAN_EDIT_BOOKING_DETAILS'
]

async function main() {
  if(!process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    const { confirmed } = await inquirer.prompt([{
      type: 'confirm',
      message: 'YOU ARE ABOUT TO CONNECT TO A LIVE FIREBASE PROJECT! PLEASE CONFIRM',
      name: 'confirmed',
      default: false
    }])
    if(!confirmed) process.exit(1)
  }
  admin.initializeApp({
    credential: applicationDefault()
  });

  let user
  while(!user) {
    let {email} = await inquirer.prompt([{
      message:`User email address: `,
      name: 'email'
    }])  
    try {
      user = await getAuth().getUserByEmail(email)
    } catch (e) {
      console.log(e.errorInfo.message)
    }
  }
  if(user.emailVerified) {
    var {permissions} = await inquirer.prompt([{
      question: 'Permissions: ',
      name: 'permissions',
      type: 'checkbox',
      choices: availablePermissions.map(p => ({
        name: p,
        value: p,
        checked: !!(user.customClaims || {})[p]
      }))
    }])
    return getAuth().setCustomUserClaims(user.uid, 
      availablePermissions.reduce((o,p) => ({ ...o, [p]: permissions.includes(p) }),{}))
  }
}

main()
  .then(() => process.exit(1))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
