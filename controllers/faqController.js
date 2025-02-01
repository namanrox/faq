import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Faq } from "../models/faqModel.js";
import redis from "../config/Redis.js";
import { translateText } from "../utils/translation.js";

export const getFAQ = catchAsyncError(async (req, res, next) => {
  const lang = req.query.lang || "en";
  const cacheKey = `faq:${lang}`;

  redis.get(cacheKey, async (error, data) => {
    if (error) return next(new ErrorHandler(error.message, 500));
    if (data) {
      const cachedData = JSON.parse(data);
      return res.status(200).json({
        success: true,
        data: cachedData,
      });
    } else {
      const faqs = await Faq.find();
      if (!faqs || faqs.length === 0)
        return next(new ErrorHandler("Not found", 404));
      const translatedFaqs = faqs.map((faq) => {
        return faq.getTranslatedContent(lang);
      });

      redis.setex(cacheKey, 3600, JSON.stringify(translatedFaqs));
      return res.status(200).json({
        success: true,
        data: translatedFaqs,
      });
    }
  });
});

export const postFAQ = catchAsyncError(async (req, res, next) => {
  const { question, answer } = req.body;
  if (!question || !answer) {
    return next(new ErrorHandler("Question and answer are required", 400));
  }

  const targetLang = req.query.lang || "en";
  const translatedQuestion = await translateText(question, targetLang);
  const translatedAnswer = await translateText(answer, targetLang);

  const faq = await Faq.create({
    question,
    answer,
    translations: {
      [targetLang]: {
        question: translatedQuestion,
        answer: translatedAnswer,
      },
    },
  });
  return res.status(201).json({
    success: true,
    data: faq,
  });
});

export const deleteFAQ = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const faq = await Faq.findById(id);
  if (!faq) return next(new ErrorHandler("Not found", 404));
  await faq.deleteOne();
  return res.status(200).json({
    success: true,
    message: "FAQ deleted",
  });
});
