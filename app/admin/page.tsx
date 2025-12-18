"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";

interface Article {
  _id: string;
  title: string;
  author: { username: string };
  createdAt: string;
  views: number;
  status: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    totalViews: 0,
    todayArticles: 0,
  });

  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    category: "स्थानीय तह",
  });

  useEffect(() => {
    fetchArticles();
    fetchStats();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/articles");
      if (res.data.success) {
        setArticles(res.data.articles.slice(0, 10));
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    // Mock stats - replace with actual API call
    setStats({
      totalArticles: 156,
      publishedArticles: 142,
      totalViews: 12850,
      todayArticles: 8,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("के तपाईं यो समाचार हटाउन निश्चित हुनुहुन्छ?")) {
      try {
        await axiosInstance.delete(`/articles/${id}`);
        setArticles(articles.filter(article => article._id !== id));
        alert("समाचार सफलतापूर्वक हटाइयो");
      } catch (error) {
        alert("समाचार हटाउन असफल");
      }
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await axiosInstance.put(`/articles/${id}`, { status: "published" });
      alert("समाचार प्रकाशित गरियो");
      fetchArticles();
    } catch (error) {
      alert("प्रकाशन असफल");
    }
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/articles", newArticle);
      if (res.data.success) {
        alert("नयाँ समाचार सिर्जना सफल");
        setNewArticle({ title: "", content: "", category: "स्थानीय तह" });
        fetchArticles();
      }
    } catch (error) {
      alert("समाचार सिर्जना असफल");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ne-NP");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin dashboard</h1>
              <p className="text-gray-600 text-sm">समाचार व्यवस्थापन प्रणाली</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/")}
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
               Website
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700">
                logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">कुल समाचार</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalArticles}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-blue-600">📰</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">प्रकाशित</p>
                <p className="text-3xl font-bold text-green-600">{stats.publishedArticles}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-green-600">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">कुल दृश्य</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalViews.toLocaleString()}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-purple-600">👁️</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">आजका समाचार</p>
                <p className="text-3xl font-bold text-orange-600">{stats.todayArticles}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <span className="text-orange-600">🆕</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Create New Article */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">नयाँ समाचार थप्नुहोस्</h2>
              <form onSubmit={handleCreateArticle} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    शीर्षक
                  </label>
                  <input
                    type="text"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="समाचारको शीर्षक"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    समाचार
                  </label>
                  <textarea
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 h-40"
                    placeholder="समाचारको विवरण"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    श्रेणी
                  </label>
                  <select
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="स्थानीय तह">स्थानीय तह</option>
                    <option value="राजनीति">राजनीति</option>
                    <option value="खेलकुद">खेलकुद</option>
                    <option value="मनोरञ्जन">मनोरञ्जन</option>
                    <option value="अर्थ">अर्थ</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 transition-colors"
                >
                  समाचार प्रकाशित गर्नुहोस्
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Articles List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">हालका समाचारहरू</h2>
                  <Link
                    href="/admin/articles"
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    सबै हेर्नुहोस्
                  </Link>
                </div>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">लोड हुँदैछ...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          शीर्षक
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          लेखक
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          मिति
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          कार्य
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {articles.map((article) => (
                        <tr key={article._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="max-w-xs truncate">
                              {article.title}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {article.author?.username}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {formatDate(article.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => router.push(`/admin/articles/edit/${article._id}`)}
                                className="text-blue-600 hover:text-blue-700 text-sm"
                              >
                                सम्पादन
                              </button>
                              <button
                                onClick={() => handleDelete(article._id)}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                हटाउनुहोस्
                              </button>
                              {article.status !== "published" && (
                                <button
                                  onClick={() => handlePublish(article._id)}
                                  className="text-green-600 hover:text-green-700 text-sm"
                                >
                                  प्रकाशित
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!loading && articles.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-gray-500">कुनै समाचार छैन</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Link
                href="/admin/articles"
                className="bg-white border p-4 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <span className="text-blue-600">📝</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">सबै समाचार</h3>
                    <p className="text-sm text-gray-600">सम्पादन र व्यवस्थापन</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/admin/users"
                className="bg-white border p-4 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded">
                    <span className="text-purple-600">👥</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">प्रयोगकर्ता</h3>
                    <p className="text-sm text-gray-600">प्रयोगकर्ता व्यवस्थापन</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}