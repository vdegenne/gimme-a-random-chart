import {LitElement, html} from 'lit';
import {customElement, query} from 'lit/decorators.js';
import {withStyles} from 'lit-with-styles';
import styles from './app-shell.css?inline';
import {materialShellLoadingOff} from 'material-shell';
import {withController} from '@snar/lit';
import {astate} from '../state.js';
import {binance} from '../binance.js';

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

	firstUpdated() {
		materialShellLoadingOff.call(this);
	}

	// protected createRenderRoot(): HTMLElement | DocumentFragment {
	// 	return this;
	// }

	render() {
		return html`
			${astate.selectedBase
				? html`<slot></slot>
						<md-elevated-button
							id="another-chart-button"
							@click=${() => astate.gimmeARandomChartPlease()}
						>
							<md-icon slot="icon">casino</md-icon> another chart
						</md-elevated-button> `
				: html`
						<md-elevated-button @click=${() => astate.gimmeARandomChartPlease()}
							>gimme a random chart please</md-elevated-button
						>
					`}
		`;
	}
}

export const app = (window.app = new AppShell());
