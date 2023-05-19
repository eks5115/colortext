#!/usr/bin/env node --require ts-node/register
import os from 'os'
import yargs from 'yargs/yargs'
import readline from 'readline'
import { getConfig, Config } from './src/config'

const argv = yargs(process.argv.slice(2)).options({
  c: {
    alias: 'config',
    type: 'string',
    default: `${os.homedir()}/.crt/config.yaml`,
    describe: 'path of config file',
  }
}).argv

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const config = getConfig(argv.c)
const handleLine = (config: Config, line: string) => {
  const rules = config.rules
  rules.forEach((item) => {
    line = line.replace(new RegExp('(' + item.regex + ')', 'g'),
      config.color[item.color.toLowerCase()] + '$1' + config.endColor)
  })
  console.log(line)
}

const rl = readline.createInterface(process.stdin)
rl.on("line", (line) => {
  handleLine(config, line)
})
