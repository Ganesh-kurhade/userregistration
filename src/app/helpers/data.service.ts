import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { User } from './user.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService {

  constructor() { }

  //fake data base
  createDb() {
    let users:User[]= [
      { id: 100, title: 'Mr', firstName: 'Ganesh', lastName: 'Kurhade', dob: '1994-12-06', email: 'ganesh@gmail.com', password: '123456', acceptTerms: true },
      { id: 101, title: 'Ms', firstName: 'Simran', lastName: 'Joshi', dob: '1997-10-12', email: 'simran@gmail.com', password: '123456', acceptTerms: true },
      { id: 102, title: 'Mr', firstName: 'Rocky', lastName: 'Singh', dob: '2015-01-20', email: 'rocky@gmail.com', password: '123456', acceptTerms: true },
      { id: 103, title: 'Mr', firstName: 'Peter', lastName: 'Lee', dob: '2001-05-25', email: 'peter@gmail.com', password: '123456', acceptTerms: true },
    ]
    return { users };
  }
}
