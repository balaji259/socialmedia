import { useState, useEffect } from "react";

const faqCategories = [
  { id: "home", label: "Home" },
  { id: "getting-started", label: "Getting Started" },
  { id: "account-settings", label: "Account Settings" },
  { id: "privacy-security", label: "Privacy & Security" },
  { id: "posting-sharing", label: "Posting & Sharing" },
  { id: "friend-connections", label: "Friend Connections" },
  { id: "messaging", label: "Messaging" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "community-standards", label: "Community Standards" },
];

const FAQ = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Prevent horizontal scrolling on tablets
  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 overflow-hidden">
      {/* Header */}
      <header className="bg-[#3b5998] text-white px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg md:text-xl font-bold">Friendsbook</h1>
        <input
          type="text"
          placeholder="Search help topics..."
          className="bg-white text-gray-700 text-sm px-3 py-1 border border-gray-300 rounded-md w-40 md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </header>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row max-w-5xl mx-auto mt-6 bg-white shadow-lg border rounded-lg relative">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-white border-r transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform md:relative md:translate-x-0 md:w-1/4 p-4 shadow-lg md:shadow-none z-50 overflow-auto max-h-screen`}
        >
          <button
            className="md:hidden block text-blue-700 font-semibold mb-4"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? "Hide Menu" : "Show Menu"}
          </button>

          <nav>
            <h2 className="text-blue-700 font-bold text-sm mb-3">Help Categories</h2>
            <ul className="space-y-2">
              {faqCategories.map((category) => (
                <li key={category.id}>
                  <button
                    className={`w-full text-left px-2 py-1 text-sm rounded ${
                      activeSection === category.id ? "bg-blue-100 font-semibold" : "text-blue-700"
                    }`}
                    onClick={() => {
                      setActiveSection(category.id);
                      setSidebarOpen(false);
                    }}
                  >
                    {category.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Overlay for Sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-hidden">
          {activeSection === "home" && (
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-blue-700">Friendsbook Help Center</h2>
              <p className="text-gray-700 mt-2 text-sm md:text-base">
                Welcome to the Friendsbook Help Center! Choose a category from the menu on the left to get started.
              </p>
            </div>
          )}

          {activeSection === "account-settings" && (
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-blue-700">Account Settings</h2>
              <p className="text-gray-700 text-sm md:text-base mt-2">
                Manage your account settings and preferences.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-600 text-xs md:text-sm py-4 mt-6 border-t">
        &copy; 2025 Friendsbook.online | {" "}
        <a href="#" className="text-blue-600 hover:underline">
          Terms of Service
        </a>{" "}
        | {" "}
        <a href="#" className="text-blue-600 hover:underline">
          Privacy Policy
        </a>{" "}
        | {" "}
        <a href="#" className="text-blue-600 hover:underline">
          About
        </a>{" "}
        | {" "}
        <a href="#" className="text-blue-600 hover:underline">
          Help
        </a>
      </footer>
    </div>
  );
};

export default FAQ;
