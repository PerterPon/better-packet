
## BetterPackger

用于解决TCP网络编程中的粘包和半包问题。

```

const net = require( 'net' );

const app = net.createServer( connect => {

  connect.on( 'data', function ( data ) {
    // Hi, server!Hi, server!
    console.log( data.toString() ); 
  } );

} );

app.on( 'error', error => {} );

app.listen( 8080, '0.0.0.0' );

```

```

const net = require( 'net' );

const client = net.connect( { port : 8080, host: '127.0.0.1' } );

client.write( 'Hi, server!' );

client.write( 'Hi, server!' );

```


## usage


server.js

```
const net = require( 'net' );

const betterPacket = require( './index' );

const app = net.createServer( ( connect ) => {
  
  let unpackager = new betterPacket.UnPackager();

  connect.on( 'data', unpackager.addBuffer.bind( unpackager ) );

  connect.on( 'error', () => {} );

  unpackager.on( 'package', function ( data ) {

    // Hi, server!
    // Hi, server!
    console.log( data.toString() );

  } );

} );

app.on( 'error', error => {} );

app.listen( '8080', '0.0.0.0' );

```

client.js

```
const net = require( 'net' );

const betterPacket = require( './index' );

const client = net.connect( { port: 8080, host: '127.0.0.1' } );

const packager = new betterPacket.Packager();

let sendData = packager.packageData( 'Hi, server!' );

client.write( sendData );

client.write( sendData );

```