import fs from 'fs'
import yaml from 'js-yaml'
import deepmerge from 'deepmerge'

interface Rule {
  regex: string
  color: string
}

type Color = {
  [key: string]: string
}

export interface Config {
  rules: Rule[]
  color: Color,
  endColor: string
}

const config: Config = {
  rules: [],
  color: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    gray: '\x1b[37m' ,
  },
  endColor: '\x1b[0m'
}

export const getConfig = (configPath?: string) => {
  if (!configPath || !fs.existsSync(configPath)) {
    return config
  }

  const userConfig = yaml.load(fs.readFileSync(configPath, 'utf-8')) as Config
  return deepmerge(config, userConfig)
}
