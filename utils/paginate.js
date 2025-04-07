const paginate = (page = 1, limit = 50) => {
  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 50;
  const offset = (currentPage - 1) * itemsPerPage;

  return {
    limit: itemsPerPage,
    offset,
    currentPage,
  };
};

module.exports = paginate;
