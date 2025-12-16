import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ItemsApi } from "../api/items";
import { MovementsApi } from "../api/movements";
import { CategoriesApi } from "../api/categories";

export default function ItemDetailsPage() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [movements, setMovements] = useState([]);
    const [showMovementForm, setShowMovementForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [movementType, setMovementType] = useState("add");
    const [quantity, setQuantity] = useState(0);
    const [comment, setComment] = useState("");
    const [qrCode, setQrCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [count, setCount] = useState(0);
    const [categoryId, setCategoryId] = useState(null);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    // Загрузка данных
    const fetchItem = () => {
        ItemsApi.getById(id)
            .then(r => {
                const data = r.data;
                setItem(data);
                setName(data.name);
                setDescription(data.description || "");
                setCount(data.count);
                setCategoryId(data.categoryId || data.category?.id);
            })
            .catch(() => setItem(null));
    };

    const fetchMovements = () => {
        MovementsApi.getByItemId(id)
            .then(r => setMovements(Array.isArray(r.data) ? r.data : []))
            .catch(() => setMovements([]));
    };

    const fetchCategories = () => {
        CategoriesApi.getAll()
            .then(r => setCategories(Array.isArray(r.data) ? r.data : []))
            .catch(() => setCategories([]));
    };

    useEffect(() => {
        fetchItem();
        fetchMovements();
        fetchCategories();
    }, [id]);

    const handleAddMovement = (e) => {
        e.preventDefault();
        const dto = { amount: Number(quantity), comment };
        const apiCall = movementType === "add" ? MovementsApi.addStock(id, dto) : MovementsApi.removeStock(id, dto);
        apiCall.then(() => {
            fetchItem();
            fetchMovements();
            setShowMovementForm(false);
            setQuantity(0);
            setComment("");
        }).catch(console.error);
    };

    const handleUpdateItem = (e) => {
        e.preventDefault();
        const dto = { name, description, count: Number(count), categoryId: Number(categoryId) };
        ItemsApi.update(id, dto)
            .then(() => {
                fetchItem();
                setShowEditForm(false);
            })
            .catch(console.error);
    };

    const handleDeleteItem = () => {
        if (!window.confirm(`Вы уверены, что хотите удалить предмет "${item.name}"?`)) return;
        ItemsApi.delete(id)
            .then(() => navigate("/items"))
            .catch(console.error);
    };

    const handleGetQr = () => {
        ItemsApi.getQr(id)
            .then(r => setQrCode(r.data))
            .catch(console.error);
    };

    if (!item) return <p style={{ color: "#aaa" }}>Загрузка предмета...</p>;

    const inputStyle = {
        width: "100%",
        padding: "8px 12px",
        marginBottom: "8px",
        borderRadius: "12px",
        border: "1px solid #333",
        backgroundColor: "#1e1e2a",
        color: "#fff",
        boxSizing: "border-box"
    };

    const buttonStyle = (bgColor) => ({
        padding: "8px 16px",
        borderRadius: "12px",
        border: "none",
        backgroundColor: bgColor,
        color: "#fff",
        cursor: "pointer",
        marginRight: "8px",
        marginBottom: "8px",
        transition: "all 0.2s"
    });

    return (
        <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#121212" }}>
            <h1 style={{ color: "#fff", marginBottom: "20px" }}>Детали предмета: {item.name}</h1>

            <div style={{ marginBottom: "16px" }}>
                <p><strong>ID:</strong> {item.id}</p>
                <p><strong>Название:</strong> {item.name}</p>
                <p><strong>Описание:</strong> {item.description || "-"}</p>
                <p><strong>Количество:</strong> {item.count}</p>
                <p>
                    <strong>Категория:</strong>{" "}
                    {item.categoryName || item.category?.name ? (
                        <button
                            onClick={() => navigate(`/items/by-category/${item.categoryId || item.category?.id}`)}
                            style={{ border: "none", background: "none", color: "#646cff", textDecoration: "underline", cursor: "pointer", padding: 0, font: "inherit" }}
                        >
                            {item.categoryName || item.category?.name}
                        </button>
                    ) : "—"}
                </p>
            </div>

            {/* Основные действия */}
            <div style={{ marginBottom: "20px" }}>
                <button onClick={() => setShowEditForm(!showEditForm)} style={buttonStyle("#ffc107")}>
                    {showEditForm ? "Отмена редактирования" : "Редактировать"}
                </button>
                <button onClick={handleDeleteItem} style={buttonStyle("#dc3545")}>Удалить</button>
                <button onClick={handleGetQr} style={buttonStyle("#646cff")}>Показать QR-код</button>
            </div>

            {/* Форма редактирования */}
            {showEditForm && (
                <form onSubmit={handleUpdateItem} style={{ marginBottom: "24px", display: "flex", flexDirection: "column" }}>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Название" required style={inputStyle} />
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Описание" style={inputStyle} />
                    <input type="number" value={count} onChange={e => setCount(e.target.value)} placeholder="Количество" required style={inputStyle} />
                    <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required style={inputStyle}>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button type="submit" style={buttonStyle("#28a745")}>Сохранить изменения</button>
                </form>
            )}

            {/* QR-код */}
            {qrCode && (
                <div style={{ marginBottom: "16px" }}>
                    <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" style={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }} />
                </div>
            )}

            {/* Движения */}
            <h2 style={{ color: "#fff", marginBottom: "12px" }}>Движения товара</h2>
            <button
                onClick={() => setShowMovementForm(!showMovementForm)}
                style={buttonStyle("#28a745")}
            >
                {showMovementForm ? "Отмена" : "Добавить движение"}
            </button>

            {showMovementForm && (
                <form onSubmit={handleAddMovement} style={{ marginBottom: "24px", display: "flex", flexDirection: "column" }}>
                    <select value={movementType} onChange={e => setMovementType(e.target.value)} style={inputStyle}>
                        <option value="add">Добавление</option>
                        <option value="remove">Списание</option>
                    </select>
                    <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Количество" required style={inputStyle} />
                    <input type="text" value={comment} onChange={e => setComment(e.target.value)} placeholder="Комментарий" style={inputStyle} />
                    <button type="submit" style={buttonStyle("#646cff")}>Сохранить</button>
                </form>
            )}

            {/* Таблица движений */}
            {movements.length === 0 ? (
                <p style={{ color: "#aaa" }}>Нет движений для этого товара</p>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px", color: "#fff" }}>
                        <thead>
                        <tr>
                            <th style={{ padding: "8px", borderBottom: "2px solid #333" }}>ID</th>
                            <th style={{ padding: "8px", borderBottom: "2px solid #333" }}>Тип</th>
                            <th style={{ padding: "8px", borderBottom: "2px solid #333" }}>Количество</th>
                            <th style={{ padding: "8px", borderBottom: "2px solid #333" }}>Дата</th>
                            <th style={{ padding: "8px", borderBottom: "2px solid #333" }}>Комментарий</th>
                        </tr>
                        </thead>
                        <tbody>
                        {movements.map(m => (
                            <tr key={m.id} style={{ borderBottom: "1px solid #333" }}>
                                <td style={{ padding: "8px" }}>{m.id}</td>
                                <td style={{ padding: "8px" }}>{m.type}</td>
                                <td style={{ padding: "8px" }}>{m.amount}</td>
                                <td style={{ padding: "8px" }}>{new Date(m.createdAt).toLocaleString()}</td>
                                <td style={{ padding: "8px" }}>{m.comment || "-"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}




