// import * as contract from 'truffle-contract';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Web3Service } from './web3.service';

const metaincoinArtifacts = require('../../build/contracts/Iotdata.json');
const contract = require('truffle-contract');

@Injectable()
export class MetaCoinService {

  Iotdata = contract(metaincoinArtifacts);

  constructor(
    private web3Ser: Web3Service,
  ) {
    // Bootstrap the MetaCoin abstraction for Use
    this.Iotdata.setProvider(web3Ser.web3.currentProvider);
  }

  testEth(account): Observable<any> {
    let meta;

    return Observable.create(observer => {
      this.Iotdata
        .deployed()
        .then(instance => {
          meta = instance;
          // we use call here so the call doesn't try and write, making it free
          return meta.get_testData.call({
            from: account
          });
        })
        .then(value => {
          observer.next(value);
          observer.complete();
        })
        .catch(e => {
          console.log(e);
          observer.error(e);
        });
    });
  }

  sendData(account, data): Observable<any> {

    let meta;
    return Observable.create(observer => {
      this.Iotdata
        .deployed()
        .then(instance => {
          meta = instance;
          return meta.set_data(data, {
            from: account
          });
        })
        .then(a => {
  		    observer.next(a);
  		    observer.complete();
        })
        .catch(e => {
          console.log(e);
          observer.error(e);
        });
    });
  }

}
