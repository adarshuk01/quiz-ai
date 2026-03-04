import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  FileText,
  Users,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function StatsCards() {
  const [stats, setStats] = useState({
    activeQuizzes: 0,
    totalStudents: 0,
    completionRate: 0,
    avgTimePerQuiz: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const { data } = await axiosInstance.get(
          "/dashboard/stats"
        );

        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const cards = [
    {
      title: "Active Quizzes",
      value: stats.activeQuizzes,
      icon: FileText,
      bg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      bg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      icon: CheckCircle2,
      bg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Time per Quiz",
      value: `${stats.avgTimePerQuiz}m`,
      icon: Clock,
      bg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

 if (loading) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-sm border border-gray-300 p-6 flex justify-between items-start animate-pulse"
        >
          <div className="space-y-3 w-1/2">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>

          <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
        </div>
      ))}
    </div>
  );
}

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-300 p-6 flex justify-between items-start hover:shadow-md transition"
          >
            <div>
              <p className="text-3xl font-semibold text-gray-800">
                {card.value}
              </p>
              <p className="text-gray-500 mt-1">{card.title}</p>
            </div>

            <div
              className={`p-3 rounded-xl ${card.bg}`}
            >
              <Icon
                className={`w-6 h-6 ${card.iconColor}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}