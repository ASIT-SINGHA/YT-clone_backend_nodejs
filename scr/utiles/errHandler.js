class errorHandler extends Error {
	constructor(
		statusCode,
		message = `something is went wrong`,
		error = [],
		stack = ""
	) {
		super(message);
		this.statusCode = statusCode;
		this.Error = error;
		this.stack = stack;
		this.data = null;
		this.message = message;
		this.success = false;

		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor)();
		}
	}
}
