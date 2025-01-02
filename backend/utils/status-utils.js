export default function determineStatus(totalValue, recommendedValue) {
  if (totalValue < recommendedValue * 0.8) return 'deficient';
  if (totalValue > recommendedValue * 1.2) return 'excess';
  return 'onTrack';
}
