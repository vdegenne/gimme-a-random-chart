import {ReactiveController, state} from '@snar/lit';
import {binance} from './binance.js';
import {app} from './app-shell/app-shell.js';
import {PropertyValues} from 'snar';
import {saveToLocalStorage} from 'snar-save-to-local-storage';
import {AUDIO_SWITCH} from './assets/assets.js';
import {speakEnglish} from '@vdegenne/speech';
import {sleep} from './utils.js';

const periods = ['1D', '1W'] as const;
const periodNames = {
	'1D': '1 day',
	'1W': '1 week',
};
type Period = (typeof periods)[number];

@saveToLocalStorage('garcp:state')
export class AppState extends ReactiveController {
	@state() selectedBase: string | null = null;
	@state() period: Period = '1D';
	@state() loading = false;

	async gimmeARandomChartPlease() {
		this.loading = true;
		AUDIO_SWITCH.currentTime = 0;
		AUDIO_SWITCH.play();
		await sleep(500);
		await binance.fetchComplete;
		const pairs = binance.getAllPairsOfQuote('USDT').map((p) => p.base);
		// .filter(base => base.includes(''))
		this.selectedBase = pairs[Math.floor(Math.random() * pairs.length)];
	}

	selectNextPeriod() {
		const index = periods.indexOf(this.period);
		const next = (index + 1) % periods.length;
		this.period = periods[next];
		speakEnglish(periodNames[this.period]);
	}

	async updated(changed: PropertyValues<this>) {
		if (
			(changed.has('selectedBase') && this.selectedBase) ||
			changed.has('period')
		) {
			await app.updateComplete;
			app.innerHTML = '';
			const script = document.createElement('script');
			script.type = 'text/javascript';
			script.async = true;
			script.src =
				'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
			script.innerHTML = JSON.stringify({
				autosize: true,
				symbol: `BINANCE:${this.selectedBase}USDT`,
				interval: this.period,
				timezone: 'Etc/UTC',
				theme: 'dark',
				style: '1',
				locale: 'en',
				hide_top_toolbar: true,
				hide_legend: true,
				allow_symbol_change: false,
				save_image: false,
				calendar: false,
				support_host: 'https://www.tradingview.com',
			});
			console.log(script);
			app.appendChild(script);
			setTimeout(() => {
				this.loading = false;
				if (changed.has('selectedBase')) {
					speakEnglish(astate.selectedBase!);
				}
			}, 1000);
		}
	}
}

export const astate = new AppState();
