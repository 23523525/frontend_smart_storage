import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CategoriesPage from "./pages/CategoriesPage";
import ItemsByCategoryPage from "./pages/ItemsByCategoryPage";
import ItemsPage from "./pages/ItemsPage";
import ItemDetailsPage from "./pages/ItemDetailsPage";

export default function App() {
    const linkStyle = {
        color: "#e0e0e0",
        textDecoration: "none",
        display: "block",
        padding: "8px 12px",
        borderRadius: "8px",
        transition: "background-color 0.2s, transform 0.2s",
        marginBottom: "12px",
    };

    const handleHover = (e) => {
        e.currentTarget.style.backgroundColor = "#6200ee";
        e.currentTarget.style.transform = "scale(1.05)";
    };

    const handleLeave = (e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.transform = "scale(1)";
    };

    return (
        <BrowserRouter >
            <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", backgroundColor: "#121212", color: "#fff" }}>
                {/* Сайдбар слева */}
                <nav style={{
                    width: "220px",
                    backgroundColor: "#1e1e1e",
                    color: "#fff",
                    padding: "20px",
                    boxSizing: "border-box",
                    borderRadius: "0 12px 12px 0",
                    boxShadow: "2px 0 8px rgba(0,0,0,0.5)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start"
                }}>
                    <h2 style={{ color: "#fff", marginBottom: "24px", fontSize: "1.5rem", textAlign: "center" }}>SmartStorage</h2>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        <li>
                            <Link
                                to="/items"
                                style={linkStyle}
                                onMouseEnter={handleHover}
                                onMouseLeave={handleLeave}
                            >
                                Товары
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/categories"
                                style={linkStyle}
                                onMouseEnter={handleHover}
                                onMouseLeave={handleLeave}
                            >
                                Категории
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Основная часть сайта */}
                <main style={{ flex: 1, padding: "20px" }}>
                    <Routes>
                        <Route path="/" element={<h1>Главная</h1>} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/items" element={<ItemsPage />} />
                        <Route path="/items/:id" element={<ItemDetailsPage />} />
                        <Route path="/items/by-category/:categoryId" element={<ItemsByCategoryPage />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

