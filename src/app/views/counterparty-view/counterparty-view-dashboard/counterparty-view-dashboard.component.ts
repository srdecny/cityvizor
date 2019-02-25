import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'counterparty-view-dashboard',
  templateUrl: './counterparty-view-dashboard.component.html',
  styleUrls: ['./counterparty-view-dashboard.component.scss']
})
export class CounterpartyViewDashboardComponent implements OnInit {

  years = [
    { year: 2017, amount: 3000000 },
    { year: 2018, amount: 2000000 },
    { year: 2016, amount: 1000000 }
  ];

  year = 2018;

  profiles = [
    { profile: { name: "Brno" }, amount: 4500000 },
    { profile: { name: "Ostrava" }, amount: 2500000 },
    { profile: { name: "Horní dolní" }, amount: 450000 },
    { profile: { name: "Horní dolní" }, amount: 400000 },
    { profile: { name: "Horní dolní" }, amount: 380000 },
    { profile: { name: "Horní dolní" }, amount: 300000 },
  ]

  maxYearAmount = 3000000;
  maxProfileAmount = 4500000;

  constructor() { }

  ngOnInit() {
  }

}
