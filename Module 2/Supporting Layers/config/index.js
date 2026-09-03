const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || "development";
const jwtSecret = process.env.JWT_SECRET;
const maxArticles = Number(process.env.MAX_ARTICLES || 50);

module.exports = {
  port,
  nodeEnv,
  jwtSecret,
  maxArticles,
};
