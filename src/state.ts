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
	}

	async updated(changed: PropertyValues<this>) {
		if (changed.has('selectedBase') && this.selectedBase) {
			await app.updateComplete;
			app.innerHTML = '';
			const script = document.createElement('script');
			script.type = 'text/javascript';
			script.async = true;
			script.src =
				'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
			script.innerHTML = JSON.stringify({
				autosize: true,
				symbol: 'NASDAQ:AAPL',
				interval: 'D',
				timezone: 'Etc/UTC',
				theme: 'dark',
				style: '1',
				locale: 'en',
				hide_top_toolbar: false,
				hide_legend: true,
				allow_symbol_change: false,
				save_image: false,
				calendar: false,
				support_host: 'https://www.tradingview.com',
			});
			console.log(script);
			app.appendChild(script);
		}
	}
}

export const astate = new AppState();
