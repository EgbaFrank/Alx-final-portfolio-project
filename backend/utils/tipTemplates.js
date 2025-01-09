const tipTemplates = {
  deficient: {
    mild: [
      'You were slightly low on {nutrientName} last week. Consider adding more {foodSuggestion1} or {foodSuggestion2} to your diet this week.',
      'Your {nutrientName} intake was a bit low last week. Try incorporating {foodSuggestion1} or {foodSuggestion2} into your meals.',
      'It looks like your {nutrientName} levels were a little low recently. Boosting your intake with {foodSuggestion1} or {foodSuggestion2} could help.',
    ],
    moderate: [
      'You had a moderate deficiency in {nutrientName} last week. Adding {foodSuggestion1} or {foodSuggestion2} can help you improve.',
      'Your {nutrientName} levels were moderately low last week. Focus on including more {foodSuggestion1} and {foodSuggestion2} in your diet.',
      'A moderate lack of {nutrientName} was detected. Boost your intake this week with foods like {foodSuggestion1} and {foodSuggestion2}.',
    ],
    severe: [
      "You were severely low on {nutrientName} last week. It's crucial to increase your intake of {foodSuggestion1}, {foodSuggestion2}, and other {nutrientName}-rich foods.",
      'Your {nutrientName} levels were severely low last week. Prioritize adding more {foodSuggestion1} and {foodSuggestion2} to your diet.',
      "Your recent {nutrientName} levels are critically low. It's highly recommended to increase your intake of {foodSuggestion1} and {foodSuggestion2}.",
    ],
  },
  excess: {
    mild: [
      'You had slightly high {nutrientName} levels last week. Consider moderating your intake of {foodSuggestion1} and {foodSuggestion2}.',
      'Your {nutrientName} intake was a bit high last week. Try reducing your consumption of {foodSuggestion1} and {foodSuggestion2}.',
      'Your {nutrientName} levels were slightly elevated recently. Consider balancing your diet by reducing {foodSuggestion1} and {foodSuggestion2}.',
    ],
    moderate: [
      "You had moderately high {nutrientName} levels last week. It's advisable to reduce your intake of {foodSuggestion1} and {foodSuggestion2}.",
      'Your {nutrientName} intake was moderately high last week. Consider decreasing your consumption of {foodSuggestion1} and {foodSuggestion2}.',
      'Your {nutrientName} levels are moderately elevated. It is recommended to reduce your intake of {foodSuggestion1}, {foodSuggestion2} and similar foods.',
    ],
    severe: [
      "You had severely high {nutrientName} levels last week. It's important to significantly reduce your intake of {foodSuggestion1} and {foodSuggestion2}.",
      'Your {nutrientName} intake was severely high last week. Significantly decrease your consumption of {foodSuggestion1} and {foodSuggestion2}.',
      'Your {nutrientName} levels are severely elevated. It is crucial to significantly reduce your intake of {foodSuggestion1}, {foodSuggestion2} and related foods.',
    ],
  },
};

export default tipTemplates;
