import * as path from 'path'
import * as childProcess from 'node:child_process'

const CHECKLY_PATH = path.resolve(path.dirname(__filename), '../bin/run')

export function runChecklyCli (options: {
  directory?: string,
  args?: string[],
  apiKey?: string,
  accountId?: string,
}) {
  const {
    directory,
    args = [],
    apiKey,
    accountId,
  } = options
  return childProcess.spawnSync(CHECKLY_PATH, args, {
    env: {
      PATH: process.env.PATH,
      CHECKLY_API_KEY: apiKey,
      CHECKLY_ACCOUNT_ID: accountId,
    },
    cwd: directory ? path.resolve(__dirname, directory) : process.cwd(),
    encoding: 'utf-8',
  })
}