import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    translations: {
      type: Map,
      of: {
        question: { type: String },
        answer: { type: String },
      },
    },
  },
  { timestamps: true }
);

schema.methods.getTranslatedContent = function (lang) {
  return {
    question: this.translations.get(lang)?.question || this.question,
    answer: this.translations.get(lang)?.answer || this.answer,
  };
};

export const Faq = mongoose.model("Faq", schema);
