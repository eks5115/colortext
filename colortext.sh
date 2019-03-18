#!/usr/bin/env bash

#set -x
set -e

black="\033[30m"
red="\033[31m"
green="\033[32m"
yellow="\033[33m"
blue="\033[34m"
magenta="\033[35m"
cyan="\033[36m"
gray="\033[37m"

rcFile=${HOME}/.colortextrc
if [[ -f ${rcFile} ]];then
  source ${rcFile}
else
  WORD_COLOR="
    ERROR:$red
    WARN:$yellow
    INFO:$green
    DEBUG:$blue
  "
fi

WORD_COLOR=`echo $WORD_COLOR | tr "\n" " "`

command='
function addColor(word, color) {
  sub(word, color word endColor);
}

BEGIN {
  endColor="\033[0m"
  WORD_COLOR="'${WORD_COLOR}'"

  split(WORD_COLOR, arr, " ")
  for (a in arr) {
    split(arr[a], keyValue, ":")
    colorMap[keyValue[1]]=keyValue[2]
  }
}
{
  for (word in colorMap) {
    addColor(word, colorMap[word])
  }
  print $0
}
'

awk "${command}" $1
