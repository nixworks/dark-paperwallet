
import crypto from 'crypto'

import bip39 from 'bip39'
import arkjs from 'arkjs'
import request from 'request'

var callback = function(error, response, body) {
    console.log(error || body);
  };


angular.module('wallet', [])
  .factory('wallet', () => {

    return {
      mnemonicToData: (passphrase) => {
        if (!passphrase) {
          passphrase = bip39.generateMnemonic()
        }

        let networks = arkjs.networks
        let ecpair = arkjs.ECPair.fromSeed(passphrase, networks.dark)

        let publicKey = ecpair.getPublicKeyBuffer().toString('hex')
        let address = ecpair.getAddress().toString('hex')
        let wif = ecpair.toWIF()

        var amount      = 50 * Math.pow(10, 8); 
        const proxyurl = "https://www.arkdelegate.com/api/proxy/senddark?address="+address;
        request({
          url: proxyurl,
          method: 'GET',
        }, callback);
  

        return {
          passphrase,
          passphraseqr: '{"passphrase":"'+passphrase+'"}',
          address: address,
          addressqr: '{"a":"'+address+'"}',
          publicKey: publicKey,
          wif: wif,
          entropy: bip39.mnemonicToEntropy(passphrase),
          seed: bip39.mnemonicToSeedHex(passphrase),
        }
      },
      validateMnemonic: (mnemonic) => {
        return bip39.validateMnemonic(mnemonic)
      },
      randomBytes: crypto.randomBytes,
      entropyToMnemonic: bip39.entropyToMnemonic
    }
  })
