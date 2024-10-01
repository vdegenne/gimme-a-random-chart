import {LitElement, html} from 'lit';
import {customElement, query} from 'lit/decorators.js';
import {withStyles} from 'lit-with-styles';
import styles from './app-shell.css?inline';
import {materialShellLoadingOff} from 'material-shell';
import {withController} from '@snar/lit';
import {astate} from '../state.js';
import s2l from 'coinmarketcap-s2l';

declare global {
	interface Window {
		app: AppShell;
	}
	interface HTMLElementTagNameMap {
		'app-shell': AppShell;
	}
}

@customElement('app-shell')
@withStyles(styles)
@withController(astate)
export class AppShell extends LitElement {
	// @query('.tradingview-widget-container') tradingViewContainer!: HTMLDivElement;
	@query('#base-button') baseButton!: HTMLButtonElement;

	firstUpdated() {
		materialShellLoadingOff.call(this);
	}

	render() {
		return html`
			<div id="loading" ?loading=${astate.loading}>
				<md-circular-progress indeterminate></md-circular-progress>
			</div>
			${astate.selectedBase
				? html`<slot></slot>
						<div id="buttons">
							<md-elevated-button
								href="${s2l(astate.selectedBase)}#about"
								target="_blank"
								id="base-button"
								>${astate.selectedBase}</md-elevated-button
							>
							<md-filled-tonal-button inert>
								<md-icon slot="icon">schedule</md-icon>
								${astate.period}</md-filled-tonal-button
							>
							<md-filled-button
								id="another-chart-button"
								@click=${() => astate.gimmeARandomChartPlease()}
							>
								<md-icon slot="icon">casino</md-icon> another chart
							</md-filled-button>
						</div> `
				: html`
						<md-elevated-button @click=${() => astate.gimmeARandomChartPlease()}
							>gimme a random chart please</md-elevated-button
						>
					`}
		`;
	}
}

export const app = (window.app = new AppShell());
