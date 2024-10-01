interface BinanceExchangeInfoResponse {
	symbols: [{baseAsset: string; quoteAsset: string}];
}

type Pair = {
	/**
	 * Base of the Pair
	 * e.g. base of BTC/USD is BTC
	 */
	base: string;
	/**
	 * Quote of the Pair
	 * e.g. quote of BTC/USD is USD
	 */
	quote: string;
};

class BinanceAPI {
	#exchangeInfo: BinanceExchangeInfoResponse | undefined;
	#fetchPromise: Promise<Response> | undefined = undefined;

	constructor() {
		this.fetchExchangeInfo();
	}

	async fetchExchangeInfo() {
		this.#fetchPromise = fetch(`https://api.binance.com/api/v3/exchangeInfo`);
		const response = await this.#fetchPromise;
		this.#exchangeInfo = (await response.json()) as BinanceExchangeInfoResponse;
	}

	get fetchComplete() {
		return this.#fetchPromise;
	}

	get availablePairs(): Pair[] {
		if (this.#exchangeInfo === undefined) {
			throw new Error('exchange info not available.');
		}
		return this.#exchangeInfo.symbols.map((s) => ({
			base: s.baseAsset,
			quote: s.quoteAsset,
		}));
	}

	doesPairExist(base: string, quote: string) {
		if (this.#exchangeInfo === undefined) {
			throw new Error('exchange info not available.');
		}
		return this.availablePairs.some(
			(pair) => pair.base === base && pair.quote === quote,
		);
	}

	/**
	 * e.g. quote USDT will return all pairs USDT tradable pairs such as BTC/USDT, ETH/USDT, etc...
	 */
	getAllPairsOfQuote(quote: string) {
		return this.availablePairs.filter((pair) => pair.quote === quote);
	}
}

export const binance = new BinanceAPI();
