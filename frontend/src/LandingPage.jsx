import React from "react";

const LandingPage = () => {
  return (
    <div className="bg-black-100 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-green-600">DailyNutri</h1>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            <a
              href="#features"
              className="text-gray-600 hover:text-green-600 transition font-medium"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-green-600 transition font-medium"
            >
              Testimonials
            </a>
            <a
              href="#cta"
              className="text-gray-600 hover:text-green-600 transition font-medium"
            >
              Get Started
            </a>
          </nav>

          {/* Call-to-action button */}
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition">
            Download App
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-600 to-green-400 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-4">
            Your Personal Nutrition Companion
          </h1>
          <p className="text-lg mb-8">
            Track your meals, monitor your nutrition, and achieve your health
            goals with ease.
          </p>
          <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Get Started for Free
          </button>
          <div className="mt-8">
            <img
              src="https://via.placeholder.com/800x400"
              alt="App Screenshot"
              className="mx-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <img
                src="https://via.placeholder.com/100"
                alt="Feature Icon"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                Meal Tracking
              </h3>
              <p className="text-gray-600">
                Easily log your meals and track your daily nutrient intake.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <img
                src="https://via.placeholder.com/100"
                alt="Feature Icon"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                Insights & Analytics
              </h3>
              <p className="text-gray-600">
                Get detailed insights into your dietary habits and health
                progress.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <img
                src="https://via.placeholder.com/100"
                alt="Feature Icon"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                Personalized Tips
              </h3>
              <p className="text-gray-600">
                Receive tailored recommendations to improve your diet and
                achieve your goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-100 rounded-lg shadow-lg p-6">
              <p className="text-gray-600 italic mb-4">
                "DailyNutri helped me achieve my fitness goals. The personalized
                tips are amazing!"
              </p>
              <h3 className="text-lg font-bold text-green-600">- Jane Doe</h3>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-gray-100 rounded-lg shadow-lg p-6">
              <p className="text-gray-600 italic mb-4">
                "A great app for meal tracking and understanding nutrition. I
                love the insights!"
              </p>
              <h3 className="text-lg font-bold text-green-600">- John Smith</h3>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-gray-100 rounded-lg shadow-lg p-6">
              <p className="text-gray-600 italic mb-4">
                "The best app I've used for nutrition tracking. Highly
                recommend!"
              </p>
              <h3 className="text-lg font-bold text-green-600">- Sarah Lee</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="py-20 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">Our Story</h2>
          <p className="text-gray-600 mb-6 text-lg">
            DailyNutri was born from a passion for health and nutrition. The app
            was designed to make tracking your meals and achieving your health
            goals easier than ever.
          </p>
          <p className="text-gray-600 mb-6 text-lg">
            This project was built by a dedicated team of developers:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-bold text-green-600 mb-2">
                Egba Frank
              </h3>
              <p className="text-gray-600">Back-End Developer</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-600 mb-2">
                Mabula Thakgatso Tevin
              </h3>
              <p className="text-gray-600">Full-Stack Developer</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-600 mb-2">
                Sebela Mmathapelo
              </h3>
              <p className="text-gray-600">Front-End Developer</p>
            </div>
          </div>
          <p className="text-gray-600 mt-6">
            Together, they perfected the app to bring you the best possible experience.
          </p>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section
        id="cta"
        className="py-20 bg-gradient-to-r from-green-500 to-green-400 text-white text-center"
      >
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-4">Start Your Journey Today</h2>
          <p className="text-lg mb-8">
            Download DailyNutri and take control of your health and nutrition.
          </p>
          <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Get Started
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8">
        <div className="container mx-auto text-center">
          <h3 className="text-xl font-bold text-white mb-2">DailyNutri</h3>
          <p>Track your nutrition and achieve your health goals.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a
              href="#"
              className="hover:text-gray-300"
              aria-label="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.407.593 24 1.324 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.891-4.788 4.657-4.788 1.324 0 2.462.099 2.795.143v3.243h-1.918c-1.503 0-1.794.715-1.794 1.763v2.31h3.588l-.467 3.622h-3.121V24h6.11C23.407 24 24 23.407 24 22.676V1.324C24 .593 23.407 0 22.676 0z" />
              </svg>
            </a>
            <a
              href="#"
              className="hover:text-gray-300"
              aria-label="Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.954 4.569c-.885.394-1.833.658-2.825.775a4.932 4.932 0 002.163-2.723c-.936.555-1.977.959-3.084 1.184a4.917 4.917 0 00-8.379 4.482A13.94 13.94 0 011.671 3.149a4.917 4.917 0 001.523 6.573 4.886 4.886 0 01-2.228-.616c-.054 2.28 1.581 4.415 3.946 4.89a4.897 4.897 0 01-2.224.084 4.923 4.923 0 004.6 3.419A9.867 9.867 0 010 21.542 13.944 13.944 0 007.548 24c9.142 0 14.307-7.721 13.995-14.646A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
          </div>
          <p className="text-sm mt-4">
            © {new Date().getFullYear()} DailyNutri. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
