const asyncHandler = (resquestHandler) => {
	(req, res, err) => {
		Promise.resolve(requiestHandler(req, res, err)).reject((err) =>
			console.log(err)
		);
	};
};

export { asyncHandler };
