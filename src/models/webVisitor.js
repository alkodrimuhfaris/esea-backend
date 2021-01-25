const connectToDB = require("../helpers/connectToDB");
const pagination = require("../helpers/pagination");

const queryGenerator = require("../helpers/queryGenerator");
const table = "webVisitor";
let query = "";

module.exports = {
  createVisitor: async (data = {}, tables = table) => {
    query = `INSERT INTO ${tables} SET ?`;
    return await connectToDB(query, data);
  },
  updateVisitor: async (data = {}, whereData = {}, tables = table) => {
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
  deleteVisitor: async (whereData = {}, tables = table) => {
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
  getVisitor: async (whereData = {}, tables = table) => {
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
  getAllVisitors: async (whereData = {}, reqQuery = {}, tables = table) => {
    const dataQuery = reqQuery.data ? reqQuery.data : {};
    const {
      searchArr,
      date,
      orderArr,
      dataArr,
      groupBy,
      prepStatement,
    } = queryGenerator({ ...reqQuery, data: { ...dataQuery, ...whereData } });

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
            ${groupBy}
            ORDER BY
              ${orderArr}
            ${limiter}`;

    const results = await connectToDB(query, prepStatement);

    query = `SELECT count(*) as count
            FROM
            (
              SELECT *
              FROM ${tables}
              ${where}
              ${additionalQuery}
              ${groupBy}
            )`;

    const [{ count }] = await connectToDB(query, prepStatement);

    return { results, count };
  },
};
