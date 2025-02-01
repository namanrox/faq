import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import redis from "../config/Redis.js";

describe("FAQ API Tests", () => {
  let faqId;
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
  beforeEach(() => {
    redis.flushdb();
  });

  describe("POST /api/v1/postfaq", () => {
    it("should create a new FAQ", async () => {
      const res = await request(app).post("/api/v1/postfaq").send({
        question: "What is Node.js?",
        answer: "<p>Node.js is a runtime environment.</p>",
      });

      expect(res.status).to.equal(201);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property("question");
      expect(res.body.data).to.have.property("answer");
      faqId = res.body.data._id;
    });

    it("should return error if question or answer is missing", async () => {
      const res = await request(app).post("/api/v1/postfaq").send({});

      expect(res.status).to.equal(400);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal("Question and answer are required");
    });
  });

  describe("GET /api/v1/getfaq", () => {
    it("should return FAQs with translation for given language (e.g., en)", async () => {
      const res = await request(app)
        .get("/api/v1/getfaq?lang=en")
        .set("Accept", "application/json");

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.be.an("array");
      expect(res.body.data[0]).to.have.property("question");
      expect(res.body.data[0]).to.have.property("answer");
    });

    it("should return FAQs with translation for a language (e.g., fr)", async () => {
      const res = await request(app)
        .get("/api/v1/getfaq?lang=fr")
        .set("Accept", "application/json");

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.be.an("array");
      expect(res.body.data[0]).to.have.property("question");
      expect(res.body.data[0]).to.have.property("answer");
    });

    it("should return cached FAQs when available", async () => {
      await request(app).get("/api/v1/getfaq?lang=en");

      const res = await request(app).get("/api/v1/getfaqslang=en");

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.be.an("array");
    });
  });
});
