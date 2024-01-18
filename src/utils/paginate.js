
module.exports = (page, limit) =>{
  page = parseInt(page || 1);

  if (page === 1) {
    page = 0;
  } else {
    page = page - 1;
  }

  limit = parseInt(limit || 12);

  page = (page * limit);

  return {page, limit}
}
