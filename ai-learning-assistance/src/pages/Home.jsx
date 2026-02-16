import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* Hero Section */}
      <section className="bg-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          AI Quiz Generator for Smarter Learning
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Upload PDFs, generate AI-powered quizzes instantly, and test your knowledge with an intelligent learning assistant.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Key Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-3">
              AI-Powered Quiz Generation
            </h3>
            <p>
              Instantly create quizzes from text or PDFs using advanced AI technology.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-3">
              Smart Question Analysis
            </h3>
            <p>
              Get accurate and well-structured questions with intelligent difficulty levels.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-3">
              Instant Results & Review
            </h3>
            <p>
              View scores instantly and review answers to improve learning outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 px-6">
        <h2 className="text-3xl font-semibold text-center mb-12">
          How It Works
        </h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-3">1</div>
            <h3 className="font-semibold mb-2">Upload Content</h3>
            <p>Upload a PDF or enter text to generate quiz questions.</p>
          </div>

          <div>
            <div className="text-3xl font-bold text-blue-600 mb-3">2</div>
            <h3 className="font-semibold mb-2">Generate Quiz</h3>
            <p>AI creates questions automatically with smart logic.</p>
          </div>

          <div>
            <div className="text-3xl font-bold text-blue-600 mb-3">3</div>
            <h3 className="font-semibold mb-2">Take & Review</h3>
            <p>Attempt the quiz and get instant results with explanations.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 text-center bg-blue-600 text-white">
        <h2 className="text-3xl font-bold mb-4">
          Start Learning Smarter Today
        </h2>
        <p className="mb-6">
          Create your first AI-generated quiz in seconds.
        </p>

        <Link
          to="/signup"
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold"
        >
          Create Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 text-center py-6">
        <p>© 2026 AI Learning Assistant. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
