const createLogger = require("../../utils/logging")
const keywordRepo = require("./../../repositories/keyword_repo")

module.exports.listing = async (status= null, search= "", page, limit = 100) => {

  try {
    // let dbResponse = await keywordRepo.allKeyword(status, search, page, limit);
    // let count = await keywordRepo.countAll(status, search);
    //
    // let totalpages = 0;
    // let totalPage = 0;
    //
    // if(count < limit){
    //   totalPage = 1
    // } else {
    //   totalpages = Math.floor(count / limit);
    //   totalPage = (count % limit);
    // }
    //
    // if(totalPage > 0){
    //   totalpages += 1;
    // }

    return {
      "status": "success",
      "data": [],
    };
  } catch (err) {
    console.log(err);
    return {
      "status": "error",
      "data": "error"
    };
  }

}
