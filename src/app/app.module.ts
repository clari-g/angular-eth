import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material';

import {MetaCoinService, Web3Service} from '../services/services';
import { TableComponent } from './table/table.component';
import { IPFS, initIPFS } from './ipfs';

const SERVICES = [
  MetaCoinService,
  Web3Service,
];

@NgModule({
   declarations: [
      AppComponent,
      TableComponent
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      MatTableModule,
      MatFormFieldModule,
      MatInputModule
   ],
   providers: [
      SERVICES,
      {
        provide: APP_INITIALIZER,
        useFactory: initIPFS,
        multi: true,
        deps: [IPFS]
      }
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
