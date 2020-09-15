import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { DataService } from 'app/services/data.service';
import { ProfileService } from 'app/services/profile.service';
import { Profile } from 'app/schema';

@Component({
	selector: 'date-picker',
	templateUrl: 'date-picker.component.html',
	styleUrls: ['date-picker.component.scss']
})

export class DatePickerComponent implements OnInit {
	monthNames: string[] = ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"];

	params: Observable<Params>;
	profile: Observable<Profile>;
	
	months: { [year: number]: number[] } = {};
	years: number[] = [];

	currentYear: number;
	currentMonth: number;

	constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService, private profileService: ProfileService) { }

	ngOnInit() {
		this.profile = this.profileService.profile;
		this.params = this.route.params;
		this.profile.subscribe(profile => this.updateDates(profile.id))

		combineLatest(this.profile, this.params)
			.subscribe(([profile, params]) => {
				if (!profile || !params["rok"] || !params["mesic"]) return;
				this.currentYear = Number(params["rok"]);
				this.currentMonth = Number(params["mesic"]);
			});
	}

	selectYear(year: number): void {
		this.router.navigate(this.getYearLink(year), { relativeTo: this.route, replaceUrl: !this.currentYear });
	}
	selectMonth(year: number, month: number): void {
		this.router.navigate(this.getMonthLink(year, month), { relativeTo: this.route, replaceUrl: !this.currentYear || !this.currentMonth });
	}
	
	getYearLink(year: number): any {
		return this.getMonthLink(year, Math.min(...this.months[year]));
	}
	getMonthLink(year: number, month: number): any {
		return ["./", { "rok": year, "mesic": month }];
	}

	isMonthDisabled(year: number, month: number) {
		if (!this.months[year]) return true;
		if (this.months[year].indexOf(month) === -1) return true;
		return false;
	}

	async updateDates(profileId) {
		const months = await this.dataService.getProfilePaymentsMonths(profileId);
		this.months = {};

		months.forEach(month => {
			if (!month.month || !month.year) return;
			if (!this.months[month.year]) this.months[month.year] = [];
			this.months[month.year].push(month.month);
		});

		this.years = Object.keys(this.months).map(year => Number(year));
		this.years.sort((a, b) => b - a);

		if (!this.currentYear) this.selectMonth(this.years[0], Math.max(...this.months[this.years[0]]));
		else if (!this.currentMonth) this.selectMonth(this.currentYear, 1);
	}
}