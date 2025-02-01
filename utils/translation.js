import { translate } from "@vitalets/google-translate-api";

export const translateText = async (text, targetLang) => {
  try {
    const res = await translate(text, { to: targetLang });
    return res.text;
  } catch (error) {
    console.error("Failed ", error);
    return text;
  }
};
