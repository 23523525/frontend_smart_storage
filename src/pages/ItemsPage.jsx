import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ItemsApi } from "../api/items";
import { CategoriesApi } from "../api/categories";

export default function ItemsPage() {
    const [items, setItems] = useState([]);
    const [query, setQuery] = useState(""); // поиск
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [count, setCount] = useState(0);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const fetchItems = () => {
        if (query.trim() === "") {
            ItemsApi.getAll()
                .then(r => setItems(Array.isArray(r.data) ? r.data : []))
                .catch(() => setItems([]));
        } else {
            ItemsApi.search(query)
                .then(r => setItems(Array.isArray(r.data) ? r.data : []))
                .catch(() => setItems([]));
        }
    };

    const fetchCategories = () => {
        CategoriesApi.getAll()
            .then(r => setCategories(Array.isArray(r.data) ? r.data : []))
            .catch(() => setCategories([]));
    };

    useEffect(() => {
        fetchItems();
        fetchCategories();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchItems();
    };

    const handleCreateItem = (e) => {
        e.preventDefault();
        const dto = { name, description, categoryId: Number(categoryId), count: Number(count) };
        ItemsApi.create(dto)
            .then(() => {
                fetchItems();
                setShowForm(false);
                setName("");
                setDescription("");
                setCategoryId("");
                setCount(0);
            })
            .catch(err => console.error("Ошибка при создании товара:", err));
    };

    return (
        <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#121212" }}>
            <h1 style={{ marginBottom: "20px", color: "#fff" }}>Товары</h1>

            {/* Форма поиска */}
            <form onSubmit={handleSearch} style={{ marginBottom: "20px", display: "flex", gap: "8px" }}>
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Поиск по названию..."
                    style={{
                        padding: "8px 12px",
                        borderRadius: "12px",
                        border: "1px solid #333",
                        backgroundColor: "#1e1e2a",
                        color: "#fff",
                        flex: 1
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: "8px 16px",
                        borderRadius: "12px",
                        border: "none",
                        backgroundColor: "#646cff",
                        color: "#fff",
                        cursor: "pointer",
                        transition: "all 0.2s"
                    }}
                >
                    Найти
                </button>
            </form>

            {/* Кнопка добавления */}
            <button
                onClick={() => setShowForm(!showForm)}
                style={{
                    marginBottom: "16px",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    border: "none",
                    backgroundColor: showForm ? "#dc3545" : "#28a745",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "all 0.2s"
                }}
            >
                {showForm ? "Отмена" : "Добавить товар"}
            </button>

            {/* Форма добавления товара */}
            {showForm && (
                <form onSubmit={handleCreateItem} style={{ marginBottom: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Название"
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
                        placeholder="Описание"
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
                    <select
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                        required
                        style={{
                            padding: "8px 12px",
                            borderRadius: "12px",
                            border: "1px solid #333",
                            backgroundColor: "#1e1e2a",
                            color: "#fff"
                        }}
                    >
                        <option value="">Выберите категорию</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={count}
                        onChange={e => setCount(e.target.value)}
                        min={0}
                        required
                        placeholder="Количество"
                        style={{
                            padding: "8px 12px",
                            borderRadius: "12px",
                            border: "1px solid #333",
                            backgroundColor: "#1e1e2a",
                            color: "#fff"
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: "8px 16px",
                            borderRadius: "12px",
                            border: "none",
                            backgroundColor: "#646cff",
                            color: "#fff",
                            cursor: "pointer"
                        }}
                    >
                        Сохранить
                    </button>
                </form>
            )}

            {/* Список товаров */}
            {items.length === 0 ? (
                <p style={{ color: "#aaa" }}>Список товаров пуст</p>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                    {items.map(item => (
                        <div
                            key={item.id}
                            className="card"
                            style={{
                                borderRadius: "16px",
                                padding: "16px",
                                width: "200px",
                                background: "linear-gradient(145deg, #1e1e2a, #121121)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                                transition: "transform 0.2s, box-shadow 0.2s"
                            }}
                        >
                            <h3>{item.name}</h3>
                            <p>Количество: {item.count}</p>
                            <button
                                onClick={() => navigate(`/items/${item.id}`)}
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
                                Подробнее
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}



