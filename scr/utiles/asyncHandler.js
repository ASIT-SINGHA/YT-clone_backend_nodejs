const asyncHandler = (resquestHandler) => {
	  return  (req, res, err) => {
		Promise.resolve(resquestHandler(req, res, err)).catch((err) =>
			console.log(err)
		);
	};
};

export { asyncHandler };
