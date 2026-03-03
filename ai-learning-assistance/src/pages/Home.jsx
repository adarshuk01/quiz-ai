import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* Hero Section */}
      <section className="bg-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Free AI Quiz Generator – Create MCQs from PDF & Text Instantly
        </h1>

        <p className="text-lg max-w-3xl mx-auto mb-8">
          Our AI Quiz Generator helps teachers and students create smart multiple-choice
          quizzes instantly. Upload PDFs, paste text, or generate questions automatically
          using advanced AI technology. Perfect for exams, mock tests, and smart learning.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Get Started Free
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
          Powerful AI Quiz Maker Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-3">
              AI Quiz Generator from PDF
            </h3>
            <p>
              Upload any PDF document and automatically generate accurate MCQ
              questions within seconds.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-3">
              Generate MCQs from Text
            </h3>
            <p>
              Paste notes, study materials, or articles and let AI convert them
              into structured quizzes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-3">
              Instant Results & Analytics
            </h3>
            <p>
              Attempt quizzes online and track scores instantly to improve
              performance.
            </p>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-center">
            What is an AI Quiz Generator?
          </h2>

          <p className="mb-4">
            An AI Quiz Generator is an intelligent tool that automatically creates
            quiz questions from PDFs, documents, or text content. Using advanced
            artificial intelligence, it analyzes the material and generates
            multiple-choice questions (MCQs) with accurate answer options.
          </p>

          <p className="mb-4">
            This tool is ideal for teachers preparing test papers, students
            revising for exams, and online educators building practice quizzes.
            Instead of manually creating questions, AI handles the heavy work
            instantly.
          </p>

          <p>
            Whether you need a free quiz maker, AI MCQ generator, or a smart test
            creator, this AI-powered solution saves time and improves learning efficiency.
          </p>
        </div>
      </section>

      {/* FAQ Section (SEO BOOSTER) */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">
                Is this AI Quiz Generator free?
              </h3>
              <p>
                Yes, you can generate quizzes for free without complicated setup.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Can I generate quizzes from PDF files?
              </h3>
              <p>
                Yes. Simply upload your PDF, and the AI will automatically create
                MCQ questions from the content.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Can I attempt quizzes online?
              </h3>
              <p>
                Absolutely. You can take quizzes instantly and view results with
                detailed feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 text-center bg-blue-600 text-white">
        <h2 className="text-3xl font-bold mb-4">
          Create Your First AI-Generated Quiz Today
        </h2>
        <p className="mb-6">
          Generate quizzes from PDF and text in seconds using smart AI.
        </p>

        <Link
          to="/signup"
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold"
        >
          Create Free Account
        </Link>
      </section>

      <footer className="bg-gray-900 text-gray-300 text-center py-6">
        <p>© 2026 AI Quiz Generator. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;