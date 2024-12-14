# DailyNutri

**DailyNutri** is a web application designed to help users track their daily nutrient intake. By logging meals and analyzing nutrient data, the app provides insights into macro and micronutrient consumption, empowering users to make informed dietary decisions.

---

## Features

- **User Authentication:** Secure signup, login, and logout functionality.
- **Food Logging:** Log meals with details like food name and portion size.
- **Nutrient Tracking:** Analyze daily macro and micronutrient intake using visually appealing charts.
- **Personalized Dashboard:** View daily nutrient breakdown and track progress over time.
- **Responsive Design:** Optimized for both desktop and mobile devices.

---

## Technologies Used

- **Frontend:** React, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Charts:** Chart.js
- **API Integration:** External API for food nutrient data

---

## Project Setup

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v14 or above)
- [MongoDB](https://www.mongodb.com/)
- A code editor like [VS Code](https://code.visualstudio.com/) or vi

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/EgbaFrank/Alx-final-portfolio-project.git
   cd Alx-final-portfolio-project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   API_KEY=your_food_api_key
   ```

4. **Run the application**:
   ```bash
   npm start
   ```

5. **Access the app**:
   Open your browser and navigate to `http://localhost:5000`.

## How It Works

1. **User Registration & Login:**  
   Users can create an account or log in securely to access their personalized dashboard.  

2. **Meal Logging:**  
   Users log their meals through a simple interface that supports manual input with autocomplete suggestions for food items.  

3. **Nutrient Analysis:**  
   The app fetches detailed nutrient data for each logged food item via an external API. This data is aggregated to show the user’s total daily intake.  

4. **Visual Insights:**  
   Nutrient data is presented on the dashboard using visually engaging charts (e.g., doughnut or bar charts), showing progress toward recommended daily values for macronutrients and micronutrients.  

5. **Track Progress Over Time:**  
   Users can review historical data and trends, enabling them to identify patterns in their dietary habits and make more informed nutrition decisions.  

---

## Contributing  

We welcome contributions from the community! Here’s how you can help:  

1. **Fork the repository** and create a new branch for your feature or bugfix.  
2. **Commit your changes** with clear and descriptive messages.  
3. **Push to your branch** and open a pull request (PR).  
4. Ensure your code adheres to our coding standards and passes all tests.  

Refer to our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.  

---

## Roadmap  

- [x] Set up project environment and GitHub repo  
- [x] Create basic React app structure  
- [ ] Implement user authentication  
- [ ] Integrate external API for nutrient data  
- [ ] Develop meal logging interface  
- [ ] Create dynamic charts for data visualization  
- [ ] Add progress tracking over time  
- [ ] Conduct usability testing  
- [ ] Deploy the application  

---

## Known Issues  

- Nutrient database may lack regional food variations.  
- Portion sizes are estimated and may require user refinement.  
- Mobile responsiveness needs additional optimization.  

Please report issues in the [GitHub Issues section](https://github.com/EgbaFrank/DailyNutri/issues).  

---

## License  

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.  

---

## Contact  

For questions, suggestions, or feedback, reach out to:  

- **Project Maintainer:** Egba Frank (EgbaFrank.com)  
- **GitHub Repository:** [DailyNutri](https://github.com/EgbaFrank/DailyNutri)  

We appreciate your support and look forward to collaborating with you!  
