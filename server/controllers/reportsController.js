const Report = require('../models/report');

// Get all reports
const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reportedUser', 'email')
      .populate('reportedBy', 'email')
      .sort({ date: -1 }); // Sort by date in descending order
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Mark a report as resolved
const resolveReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Mark the report as resolved
    report.resolved = true;
    await report.save();

    res.json({ message: 'Report marked as resolved' });
  } catch (error) {
    console.error('Error resolving report:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = { getReports, resolveReport };
