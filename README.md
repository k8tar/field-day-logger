# field-day-logger
hsmm-field-day-logger
 This field day logger for HSMM/MESH via [Aredn)[https://www.arednmesh.org/] or [Broadband-Hamnet](http://broadband-hamnet.org) runs CouchDB and ExpressJS. 
 
 The idea is to run this on a raspberry pi using pi server for network booting the pis (no SD card required). Each pi acts as it's own replicating database and webserver node. Should the node go down, the user can continue logging on their own pi and CouchDB will automatically sync with all other nodes when it comes back online. 

 Radio frequency / mode reading is supported via rigctl. See /config page for configuration options.

 One raspbian node is required (and can be run on VirtualBox) running Pi Server to network boot the other Pis. setup.js should be run on this server to setup the initial CouchDB. All the pi nodes should replicate that copy once they connect to the node.  

 You can also run this on a single laptop on Windows or Linux. Make sure couchdb is installed (available via source or packages) and hamlibs is installed. Rigctl should be in your path.

Please excuse the mess, I'm still working on this.