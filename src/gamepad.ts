import gamecontroller, {XBoxButton} from 'esm-gamecontroller.js';
import {astate} from './state.js';
import {app} from './app-shell/app-shell.js';

gamecontroller.on('connect', (gamepad) => {
	gamepad.before(XBoxButton.START, () => {
		astate.gimmeARandomChartPlease();
	});

	gamepad.before(XBoxButton.BACK, () => {
		app.baseButton?.click();
	});

	gamepad.before(XBoxButton.RIGHT_BUMPER, () => {
		astate.selectNextPeriod();
	});
});
