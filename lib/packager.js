
/*
  packager
  Author: PerterPon<PerterPon@gmail.com>
  Create: Wed May 11 2016 12:01:35 GMT+0800 (CST)
*/

"use strict";

const defaultOptions = {
  header : '|||||',
  // TCP's default data buffer is 8k, '8388608'.length = 8;
  bodyRecoder : 8
};

function fillStringLeft( s, totalLength, content ) {
  s = `${s}`;
  let arr = new Buffer( totalLength - s.length );
  return `${arr.fill( content )}${s}`;
}

class Packager {

  constructor( options ) {
    this.options = Object.assign( {}, defaultOptions, options );
  }

  packageData( content ) {
    let header      = this.options.header;
    let bodyRecoder = this.options.bodyRecoder;

    if ( false === content instanceof Buffer ) {
      content = new Buffer( content );
    }

    let bodyLength = fillStringLeft( content.length, bodyRecoder, '0' );
    let headerData = new Buffer( `${header}${bodyLength}` );

    return Buffer.concat( [ headerData, content ] );
  }

}

module.exports = Packager;
