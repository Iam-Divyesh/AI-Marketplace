const { GeminiService } = require('../services/gemini');
const gemini = new GeminiService();

exports.getSummary = async (req, res) => {
  try {
    const { productData, analysisType } = req.body;
    const result = await gemini.analyzeMarket({ productData, analysisType });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReportLink = (req, res) => {
  // Replace with your Looker Studio report URL or logic
  res.json({ url: 'https://lookerstudio.google.com/reporting/YOUR_REPORT_ID' });
};