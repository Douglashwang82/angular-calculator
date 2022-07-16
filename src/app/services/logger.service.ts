import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }


  logObjectStates(object: any) {
    for (const property in object) {
      console.log(`${property} : ${object[property]}`);
    }
    console.log('-------------------------');
  }
  
  error(msg: any) { console.error(msg) };
  log(msg: any) { console.log(msg); }
  warn(msg: any) { console.log(msg); }


}
