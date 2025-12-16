import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoriesApi } from "../api/categories";

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    // Загрузка категорий
    const fetchCategories = () => {
        CategoriesApi.getAll()
            .then(r => {
                const data = Array.isArray(r.data) ? r.data : [];
                setCategories(data);
            })
            .catch(() => setCategories([]));
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Создание новой категории
    const handleCreateCategory = (e) => {
        e.preventDefault();
        const dto = { name, description };
        CategoriesApi.create(dto)
            .then(() => {
                fetchCategories();
                setShowForm(false);
                setName("");
                setDescription("");
            })
            .catch(err => console.error("Ошибка при создании категории:", err));
    };

    return (
        <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#121212" }}>
            <h1 style={{ marginBottom: "20px", color: "#fff" }}>Категории</h1>

            {/* Кнопка открытия формы */}
            <button
                onClick={() => setShowForm(!showForm)}
                style={{
                    marginBottom: "16px",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    border: "none",
                    backgroundColor: showForm ? "#dc3545" : "#646cff",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "all 0.2s"
                }}
            >
                {showForm ? "Отмена" : "Добавить категорию"}
            </button>

            {/* Форма добавления категории */}
            {showForm && (
                <form onSubmit={handleCreateCategory} style={{ marginBottom: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Название категории"
                        required
                        style={{
                            padding: "8px 12px",
                            borderRadius: "12px",
                            border: "1px solid #333",
                            backgroundColor: "#1e1e2a",
                            color: "#fff"
                        }}
                    />
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Описание категории"
                        rows={3}
                        style={{
                            padding: "8px 12px",
                            borderRadius: "12px",
                            border: "1px solid #333",
                            backgroundColor: "#1e1e2a",
                            color: "#fff",
                            resize: "vertical"
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: "8px 16px",
                            borderRadius: "12px",
                            border: "none",
                            backgroundColor: "#28a745",
                            color: "#fff",
                            cursor: "pointer"
                        }}
                    >
                        Сохранить
                    </button>
                </form>
            )}

            {/* Список категорий */}
            {categories.length === 0 ? (
                <p style={{ color: "#aaa" }}>Список категорий пуст</p>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                    {categories.map(cat => (
                        <div
                            key={cat.id}
                            style={{
                                borderRadius: "16px",
                                padding: "16px",
                                width: "220px",
                                background: "linear-gradient(145deg, #1e1e2a, #121121)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                                transition: "transform 0.2s, box-shadow 0.2s"
                            }}
                        >
                            <h3 style={{ color: "#fff" }}>{cat.name}</h3>
                            {cat.description && <p style={{ color: "#ccc" }}>{cat.description}</p>}
                            <button
                                onClick={() => navigate(`/items/by-category/${cat.id}`)}
                                style={{
                                    marginTop: "8px",
                                    padding: "6px 12px",
                                    border: "none",
                                    borderRadius: "12px",
                                    backgroundColor: "#646cff",
                                    color: "#fff",
                                    cursor: "pointer"
                                }}
                            >
                                Посмотреть товары
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


