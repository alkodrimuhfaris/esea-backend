const connectToDB = require("../helpers/connectToDB");
const pagination = require("../helpers/pagination");

const queryGenerator = require("../helpers/queryGenerator");
const table = "categories";
let query = "";

module.exports = {
  creteCategories: async (data = {}, tables = table) => {
    query = `INSERT INTO ${tables} SET ?`;
    return await connectToDB(query, data);
  },
  updateCategories: async (data = {}, whereData = {}, tables = table) => {
    const { dataArr, prepStatement } = queryGenerator({ data: whereData });

    // query for where
    const additionalQuery = [dataArr]
      .filter((item) => item)
      .map((item) => `(${item})`);

    // query for where (if it exist)
    const where = additionalQuery ? " WHERE " : "";

    query = `UPDATE ${tables} SET ?
            ${where}
            ${additionalQuery}`;
    return await connectToDB(query, [data, ...prepStatement]);
  },
  deleteCategory: async (whereData = {}, tables = table) => {
    const { dataArr, prepStatement } = queryGenerator({ data: whereData });

    // query for where
    const additionalQuery = [dataArr]
      .filter((item) => item)
      .map((item) => `(${item})`);

    // query for where (if it exist)
    const where = additionalQuery ? " WHERE " : "";

    query = `DELETE FROM ${tables}
            ${where}
            ${additionalQuery}`;
    return await connectToDB(query, prepStatement);
  },
  getCategory: async (whereData = {}, tables = table) => {
    const { dataArr, prepStatement } = queryGenerator({ data: whereData });

    const additionalQuery = [dataArr]
      .filter((item) => item)
      .map((item) => `(${item})`);

    const where = additionalQuery ? " WHERE " : "";

    query = `SELECT *
            FROM ${tables}
            ${where}
            ${additionalQuery}`;
    return await connectToDB(query, prepStatement);
  },
  getAllCategories: async (whereData = {}, reqQuery = {}, tables = table) => {
    const {
      searchArr,
      date,
      orderArr,
      dataArr,
      prepStatement,
    } = queryGenerator({ ...reqQuery, data: whereData });

    // query for search and limit
    const additionalQuery = [searchArr, date, dataArr]
      .filter((item) => item)
      .map((item) => `(${item})`)
      .join(" AND ");

    // query for where (if it exist)
    const where = additionalQuery ? " WHERE " : "";

    const { limiter } = pagination.pagePrep(reqQuery);

    query = `SELECT *
            FROM ${tables}
            ${where}
            ${additionalQuery}
            ORDER BY
              ${orderArr}
            ${limiter}`;

    const results = await connectToDB(query, prepStatement);

    query = `SELECT count(*) as count
            FROM ${tables}
            ${where}
            ${additionalQuery}`;

    const [{ count }] = await connectToDB(query, prepStatement);

    return { results, count };
  },
  searchOrCreateCategory: async (whereData = {}, tables = table) => {
    const { dataArr, prepStatement } = queryGenerator({ data: whereData });

    // query for search and limit
    const additionalQuery = [dataArr]
      .filter((item) => item)
      .map((item) => `(${item})`);

    // query for where (if it exist)
    const where = additionalQuery ? " WHERE " : "";

    query = `SELECT * 
            FROM ${tables}
            ${where}
            ${additionalQuery}`;
    let results = await connectToDB(query, prepStatement);

    const created = !results.length;

    if (created) {
      query = `INSERT INTO ${tables} SET ?`;
      await connectToDB(query, whereData);

      query = `SELECT * 
              FROM ${tables}
              ${where}
              ${additionalQuery}`;
      results = await connectToDB(query, prepStatement);
    }
    return { results, created };
  },
};
