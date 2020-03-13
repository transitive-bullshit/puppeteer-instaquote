'use strict'

const dataURI = require('datauri').promise
const isUrl = require('is-url-superb')

exports.getImage = async (fileOrUrl) => {
  if (isUrl(fileOrUrl)) {
    return fileOrUrl
  } else {
    return dataURI(fileOrUrl)
  }
}
