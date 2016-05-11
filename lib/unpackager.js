
/*
  unpackager
  Author: PerterPon<PerterPon@gmail.com>
  Create: Wed May 11 2016 12:00:55 GMT+0800 (CST)
*/

"use strict";
const EventEmitter = require( 'events' ).EventEmitter;

// options
// {
//   // buffer header, string or buffer
//   header: '||||',
//   // body length's length, e.g: body<12345>, bodyRecoder: 5, body<123456>, bodyRecoder: 6.
//   bodyRecoder: 5,

// }

const defaultOptions = {
  header : '|||||',
  // TCP's default data buffer is 8k, '8388608'.length = 8;
  bodyRecoder : 8
};

class UnPackager extends EventEmitter {

  constructor( options ) {
    super();
    this.options = Object.assign( {}, defaultOptions, options );

    this.buffer  = new Buffer( 0 );
    if ( false === this.options.header instanceof Buffer ) {
      this.options.header = new Buffer( this.options.header );
    }
    this.header = this.options.header;
    this.bodyRecoder = this.options.bodyRecoder;
    this._calHeadLength();
  }

  addBuffer( data ) {
    this.buffer = Buffer.concat( [ this.buffer, data ] );
    this._checkDataEnough();
  }

  _calHeadLength() {
    let header      = this.header;
    let bodyRecoder = this.bodyRecoder;

    if ( void( 0 ) == header || void( 0 ) == bodyRecoder ) {
      let error = new Error( '[HBB] param: header or bodyRecoder could not be null!' );
      this.emit( 'error', error );
    }
    this.headerLength = header.length + bodyRecoder;
  }

  _checkDataEnough() {
    let buffer = this.buffer;

    // if current has no buffer
    if ( this.headerLength > buffer.length ) {
      return;
    }

    // if buffer's length is header's length
    // 1. it's an empty package.
    // 2. the left part was in the next package
    if ( buffer.length === this.headerLength ) {
      //TODO:
    }

    let checkHeader = buffer.slice( 0, this.header.length );
    let header      = buffer.slice( 0, this.headerLength );
    let bodyLength  = buffer.slice( this.header.length, this.headerLength );

    if ( false === checkHeader.equals( this.header ) ) {
      let error = new Error( `[HDD] header: [${header.toString()}] invalid!` );
      this.emit( 'error', error );
      return;
    }

    let bodyLengthNum = Number( bodyLength.toString() );

    this.currentBodyLength = bodyLengthNum;

    // enough data
    if ( buffer.length >= this.headerLength + bodyLengthNum ) {
      let totalLength = this.headerLength + bodyLengthNum;
      let body    = buffer.slice( this.headerLength, totalLength );
      this.buffer = buffer.slice( totalLength );

      this.emit( 'package', body );

      process.nextTick( this._checkDataEnough.bind( this ) );
    }

  }

}

module.exports = UnPackager;
