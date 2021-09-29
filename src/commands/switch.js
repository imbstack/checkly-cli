const chalk = require('chalk')
const consola = require('consola')
const { prompt } = require('inquirer')
const { Command, flags } = require('@oclif/command')

const api = require('./../services/api')
const config = require('./../services/config')
const { output } = require('./../services/flags')
const { isUuid } = require('./../services/validator')

class SwitchCommand extends Command {
  async run() {
    const { flags } = this.parse(SwitchCommand)
    const { accountId } = flags

    if (accountId) {
      if (!isUuid(accountId)) {
        consola.error('-a (--accountId) is not a valid uuid')
        process.exit(1)
      }

      // TODO: Retrieve and validate account id with the public API
      // and store account name in config
      config.data.set('accountId', accountId)
      consola.success(`Account switched to ${chalk.bold.blue(accountId)}`)
      process.exit(0)
    }

    const { data: accounts } = await api.accounts.find()

    const { selectedAccountName } = await prompt([
      {
        name: 'selectedAccountName',
        type: 'list',
        choices: accounts.map((account) => account.name),
        message: 'Select a new Checkly account',
      },
    ])

    const { id, name } = accounts.find(
      (account) => account.name === selectedAccountName
    )

    config.data.set('accountId', id)
    config.data.set('accountName', name)

    consola.success(`Account switched to ${chalk.bold.blue(name)}`)
  }
}

SwitchCommand.description = 'Switch user account'

SwitchCommand.flags = {
  output,
  accountId: flags.string({
    char: 'a',
    name: 'accountId',
    description: 'The id of the account you want to switch.',
  }),
}

module.exports = SwitchCommand