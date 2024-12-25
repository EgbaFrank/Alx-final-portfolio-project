function validateDates(req, res, next) {
  const { startDate, endDate } = req.query;

  if (startDate && Number.isNaN(Date.parse(startDate))) {
    return res.status(400).json({ error: 'Invalid startDate format' });
  }

  if (endDate && Number.isNaN(Date.parse(endDate))) {
    return res.status(400).json({ error: 'Invalid endDate format' });
  }

  return next();
}

export default validateDates;
