const Res = require("async-api-response")
const mongoose = require("mongoose");
const discord_bot = require("../func/discord-bot");

const AsyncMiddleware = function (handler, useTransaction = false, enableLog = false) {
  if (useTransaction) {
    return async (req, res, next) => {
      const session = await mongoose.startSession();
      session.startTransaction();
      const resp = new Res(res);
      try {
        const opts = { session };
        async function commit() {
          await session.commitTransaction();
          session.endSession();
        }
        await handler(req, res, next, opts, commit);
      } catch (ex) {
        discord_bot({ error:ex, req })
        await session.abortTransaction();
        session.endSession();
        return resp.catch({ error: ex });
      }
    };
  } else {
    return async (req, res, next) => {
      const resp = new Res(res);
      try {
        await handler(req, res, next);
      } catch (ex) {
        discord_bot({ error:ex, req })
        return resp.catch({ error: ex });
      }
    };
  }
};

module.exports = AsyncMiddleware;
