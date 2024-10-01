import {ReactiveController, state} from '@snar/lit';
import {binance} from './binance.js';
import {app} from './app-shell/app-shell.js';
import {PropertyValues} from 'snar';

export class AppState extends ReactiveController {
	@state() selectedBase: string | null = null;

	script: HTMLScriptElement;

	async gimmeARandomChartPlease() {
		await binance.fetchComplete;
		const pairs = binance.getAllPairsOfQuote('USDT').map((p) => p.base);
		// .filter(base => base.includes(''))
		this.selectedBase = pairs[Math.floor(Math.random() * pairs.length)];
		this.script = document.createElement('script');
		this.script.type = 'text/javascript';
		this.script.async = true;
		this.script.src =
			'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
		this.script.innerHTML = JSON.stringify({
			autosize: true,
			symbol: `BINANCE:${this.selectedBase}USDT`,
			interval: 'D',
			timezone: 'Etc/UTC',
			theme: 'dark',
			style: '1',
			locale: 'en',
			allow_symbol_change: true,
			calendar: false,
			support_host: 'https://www.tradingview.com',
		});
		console.log(this.script);
	}

	async updated(changed: PropertyValues<this>) {
		if (changed.has('selectedBase') && this.selectedBase) {
			await app.updateComplete;
			app.innerHTML = '';
			app.appendChild(this.script);
		}
	}
}

export const astate = new AppState();
