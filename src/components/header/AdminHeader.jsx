import "./adminheader.css"; // 스타일 불러오기

export default function AdminHeader() {
    return (
        <header className="admin-header">
            <div className="admin-left">
                <BarChart2 className="w-5 h-5" />
                <span>Dashboard</span>
            </div>

            <nav className="admin-nav">
                <a href="#">Projects</a>
                <a href="#">Users</a>
                <a href="#">Funding</a>
                <a href="#">Analytics</a>
            </nav>

            <div className="admin-right">
                <div className="admin-search-container">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="admin-search-input"
                    />
                    <span className="admin-search-icon">🔍</span>
                </div>
                <button className="admin-icon-button">
                    <Bell className="w-5 h-5 text-gray-600" />
                </button>
                <div className="admin-profile" />
            </div>
        </header>
    );
}
