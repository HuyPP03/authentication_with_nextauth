const ResponseData = (
	data: any,
	statusCode?: number,
	message?: string,
	limit?: number,
	page?: number,
	total?: number,
) => {
	return {
		data,
		meta: {
			statusCode: statusCode || 200,
			message: message || 'Success!',
			limit,
			page,
			total,
		},
	};
};

export default ResponseData;
