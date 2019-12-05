import { Component, HostListener, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableComponent } from './table/table.component';
import {Buffer} from 'buffer';
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient('http://localhost:5001');
import {Web3Service, MetaCoinService} from '../services/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  @ViewChild(TableComponent, {static: false}) table;

 account: any;
 accounts: any;

 message: string;

 fileData = '';
 fileTableName = 'Estaciones:';
 date1: any;
 date2: any;

 ipfsHash: string;
 ethHash: string;

 request = new XMLHttpRequest();

 constructor(
   private http: HttpClient,
   private _ngZone: NgZone,
   private web3Service: Web3Service,
   private metaCoinService: MetaCoinService,
   ) {
   //this.onReady();
 }

 async ngOnInit() {
  /*const version = await this.ipfs.version();
  console.log(version.version);*/
  // this.onReady();

  this.web3Service.getAccounts().subscribe(accs => {
    this.accounts = accs;
    this.account = this.accounts[0];
  }, err => alert(err));

  this.testContract();
}

 ngAfterViewInit(){}

 testContract = () => {
  this.metaCoinService.testEth(this.account)
    .subscribe(value => {
      this.message = value;
    }, e => {console.log('Error getting balance; see log.'); });
  }

  ethSendData = (m) => {
    this.metaCoinService.sendData(this.account, m)
     .subscribe(a => {
      // console.log('Transaction Hash: ' + a.tx);
      this.ethHash = a.tx;

      // añadir nueva entrada a la tabla
      this.table.addNewItem(this.fileTableName, this.date1, this.ethHash, this.date2);
     }, e => console.log('Transaction error; see log.'));
  }

 getAPI() {
  console.log('Llamar API');
  this.fileTableName = 'Estaciones:';
  this.fileData = '';
  this.http.get('https://apitransporte.buenosaires.gob.ar/ecobici/gbfs/stationStatus?client_id=617771e49d8846bfb7a7f1a24e76ac46&client_secret=99bEe0E6075F47678B24d77a6c6c14A2').subscribe(
    data => {
      this.date1 = this.getTime(1);
      this.date2 = this.getTime(2);

      const response = JSON.stringify(data);
      const a = JSON.parse(response);
      for(let i=12; i<=17; i++){
        this.fileData += "ID Estacion: "+a.data.stations[i].station_id+" |Estado: "+a.data.stations[i].status+" |Cantidad bicicletas: "+a.data.stations[i].num_bikes_available+"\n";
        this.fileTableName += " "+a.data.stations[i].station_id;
      }
      console.log(this.fileData + ' ' + this.fileTableName);

      // TODO: crear archivo
      this.createFile(this.date2, this.fileData);

    },
    error => console.error('There was an error!', error)
  );
 }

 public async ipfsAdd(path: string, value: string) {
  const content = Buffer.from(value);
  const filesAdded = await ipfs.add({path, content});
  this.ipfsHash = filesAdded[0].hash;
  console.log(this.ipfsHash);

  // subir hash a Ethereum
  this.ethSendData(this.ipfsHash);
}

 public async ipfsCat() {
  ipfs.cat(this.ipfsHash, (err, data) => {
    if (err) throw err
  console.log('Resultado de hash en IPFS: '+data);
  });
}

 getTime(n) {
  const currentdate = new Date();
  if (n === 1) {
    // 25/05/2019 15:30:11
    const datetime = currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/"
    + currentdate.getFullYear() + " "
    + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":"
    + currentdate.getSeconds();
console.log(datetime);
return (datetime);
  } else {
    // 25-05-2019_15-30-11
    const datetime2 = currentdate.getDate() + "-"
    + (currentdate.getMonth()+1)  +  "-"
    + currentdate.getFullYear() +  "_"
    + currentdate.getHours() +  "-"
    + currentdate.getMinutes() + "-"
    + currentdate.getSeconds();
console.log(datetime2);
return(datetime2);
  }
}

 createFile(path: string, content: string) {
  path += '.txt';
  const data = new FormData();
  data.append('fileName' , path);
  data.append('data' , content);
  this.request.open('POST', 'http://localhost/test/HelloWorld/upload', true);
  this.request.send(data);

  // subir archivo a IPFS
  this.ipfsAdd(path, content);
 }

}
