export class ErrorType {
	
	messageArgs: string[] = [];

	constructor(
		public code: string,
		public messageKey: string,
		public statusCode: number,
	) {}

	withArgs(...args: string[]): ErrorType {
		this.messageArgs = args;
		return this;
	}

}