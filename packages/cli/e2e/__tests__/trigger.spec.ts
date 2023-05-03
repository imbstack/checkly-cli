import * as path from 'path'
import * as uuid from 'uuid'
import * as config from 'config'

import { runChecklyCli } from '../run-checkly'

describe('trigger', () => {
  const executionId = uuid.v4()

  beforeAll(() => {
    runChecklyCli({
      args: ['deploy', '--force'],
      apiKey: config.get('apiKey'),
      accountId: config.get('accountId'),
      directory: path.join(__dirname, 'fixtures', 'trigger-project'),
      env: { EXECUTION_ID: executionId },
    })
  })

  afterAll(() => {
    runChecklyCli({
      args: ['destroy', '--force'],
      apiKey: config.get('apiKey'),
      accountId: config.get('accountId'),
      directory: path.join(__dirname, 'fixtures', 'trigger-project'),
      env: { EXECUTION_ID: executionId },
    })
  })

  test('Should run checks successfully', () => {
    const secretEnv = uuid.v4()
    const result = runChecklyCli({
      args: [
        'trigger',
        '-e',
        `SECRET_ENV=${secretEnv}`,
        '--verbose',
        '--tags',
        `production,backend,${executionId}`,
        '--tags',
        `production,frontend,${executionId}`,
      ],
      apiKey: config.get('apiKey'),
      accountId: config.get('accountId'),
    })
    
    expect(result.stdout).toContain(secretEnv)
    expect(result.stdout).toContain('Prod Backend Check')
    expect(result.stdout).toContain('Prod Frontend Check')
    expect(result.stdout).not.toContain('Staging Backend Check')
    expect(result.status).toBe(0)
  })
})