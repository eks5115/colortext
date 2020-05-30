#!/usr/bin/env node

const readline = require('readline')

/**
 * read config
 */
process.env["NODE_CONFIG_DIR"] = "/usr/local/etc/colortext";
const config = require('config')

/**
 * args define
 */
const argv = require("yargs")
  .options({
    'k': {
      alias: 'keycolor',
      describe: 'keyword:color',
      type: 'string'
    },
    'c': {
      alias: 'case',
      default: false,
      describe: 'case sensitive, false or true',
      type: 'boolean'
    },
    'g': {
      alias: 'global',
      default: true,
      describe: 'global match, false or true',
      type: 'boolean'
    }
  })
  .scriptName("colortext")
  .usage("$0 -k debug:magenta -k the:cyan")
  .help()
  .argv

/*
 * color
 */
const color = config['color']

const endColor = '\033[0m'

/**
 * key
 * @return {[{}]}
 */
function getKeyMap() {
  let configKey = getKeyMapFromConfig()
  let inputKey = getKeyMapFromInput()
  return configKey.concat(inputKey)
}
/**
 *
 * @return {{}}
 */
function getKeyMapFromInput() {
  const key = argv.k
  let keys = []
  if (key !== undefined) {
    if (typeof key === 'string') {
      keys = new Array(key)
    } else {
      keys = key
    }
  }
  return keys2KeyColor(keys)
}

/**
 *
 * info:green => {key: 'info', color: 'green'}
 * @param keys
 * @return {{}}
 */
function keys2KeyColor(keys) {
  if (!keys) {
    return [];
  }
  return keys.map(item => {
    let split = item.split(':')
    if (split.length !== 2) {
      return undefined
    } else {
      return {
        'key': split[0],
        'color': split[1]
      }
    }
  }).filter(item => item !== undefined)
}

function getKeyMapFromConfig() {
  if (!config['keyword']) {
    return [];
  }
  return keys2KeyColor(config['keyword'])
}

function handleLine(keys, line) {
  keys.forEach((item) => {
    let flags = '';
    if (!argv.c) {
      flags += 'i'
    }
    if (argv.g) {
      flags += 'g'
    }
    line = line.replace(new RegExp('(' + item.key + ')', flags),
      color[item.color.toLowerCase()] + '$1' + endColor)
  })
  console.log(line)
}

const keyMap = getKeyMap()

const rl = readline.createInterface(process.stdin)
rl.on("line", (line) => {
  handleLine(keyMap, line)
})
