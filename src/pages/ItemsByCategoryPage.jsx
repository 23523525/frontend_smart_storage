import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ItemsApi } from "../api/items";
import { CategoriesApi } from "../api/categories";

export default function ItemsByCategoryPage() {
    const { categoryId } = useParams();
    const [items, setItems] = useState([]);
    const [category, setCategory] = useState(null);
    const [itemCount, setItemCount] = useState(0);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showItemForm, setShowItemForm] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [itemName, setItemName] = useState("");
    const [itemDescription, setItemDescription] = useState("");
    const [itemCountInput, setItemCountInput] = useState(0);

    const navigate = useNavigate();

    // Загрузка данных
    const fetchItems = () => {
        ItemsApi.getByCategory(categoryId)
            .then(r => setItems(Array.isArray(r.data) ? r.data : []))
            .catch(() => setItems([]));
    };

    const fetchCategory = () => {
        CategoriesApi.getById(categoryId)
            .then(r => {
                setCategory(r.data);
                setName(r.data.name);
                setDescription(r.data.description || "");
            })
            .catch(() => setCategory(null));

        CategoriesApi.getItemCount(categoryId)
            .then(r => setItemCount(r.data))
            .catch(() => setItemCount(0));
    };

    useEffect(() => {
        fetchItems();
        fetchCategory();
    }, [categoryId]);

    const handleUpdateCategory = (e) => {
        e.preventDefault();
        const dto = { name, description };
        CategoriesApi.update(categoryId, dto)
            .then(r => {
                setCategory(r.data);
                setShowCategoryForm(false);
            })
            .catch(console.error);
    };

    const handleDeleteCategory = () => {
        if (!window.confirm(`Вы уверены, что хотите удалить категорию "${category.name}"? Все товары в ней (${itemCount}) будут удалены!`)) return;
        CategoriesApi.delete(categoryId)
            .then(() => navigate("/categories"))
            .catch(console.error);
    };

    const handleCreateItem = (e) => {
        e.preventDefault();
        const dto = {
            name: itemName,
            description: itemDescription,
            categoryId: Number(categoryId),
            count: Number(itemCountInput)
        };
        ItemsApi.create(dto)
            .then(() => {
                fetchItems();
                setShowItemForm(false);
                setItemName("");
                setItemDescription("");
                setItemCountInput(0);
            })
            .catch(console.error);
    };

    if (!category) return <p style={{ color: "#aaa" }}>Загрузка категории...</p>;

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
            <h1 style={{ color: "#fff", marginBottom: "12px" }}>Категория: {category.name}</h1>
            <p style={{ color: "#ccc", marginBottom: "16px" }}>{category.description || "Описание отсутствует"}</p>

            {/* Действия с категорией */}
            <div style={{ marginBottom: "20px" }}>
                <button onClick={() => setShowCategoryForm(!showCategoryForm)} style={buttonStyle("#28a745")}>
                    {showCategoryForm ? "Отмена" : "Обновить категорию"}
                </button>
                <button onClick={handleDeleteCategory} style={buttonStyle("#dc3545")}>Удалить категорию</button>
            </div>

            {/* Форма редактирования категории */}
            {showCategoryForm && (
                <form onSubmit={handleUpdateCategory} style={{ marginBottom: "24px", display: "flex", flexDirection: "column" }}>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Название категории" required style={inputStyle} />
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Описание категории" style={inputStyle} />
                    <button type="submit" style={buttonStyle("#646cff")}>Сохранить</button>
                </form>
            )}

            {/* Добавление нового товара */}
            <button onClick={() => setShowItemForm(!showItemForm)} style={buttonStyle("#17a2b8")}>
                {showItemForm ? "Отмена" : "Добавить товар"}
            </button>

            {showItemForm && (
                <form onSubmit={handleCreateItem} style={{ marginBottom: "24px", display: "flex", flexDirection: "column" }}>
                    <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} placeholder="Название товара" required style={inputStyle} />
                    <textarea value={itemDescription} onChange={e => setItemDescription(e.target.value)} rows={3} placeholder="Описание товара" style={inputStyle} />
                    <input type="number" value={itemCountInput} onChange={e => setItemCountInput(e.target.value)} placeholder="Количество" min={0} required style={inputStyle} />
                    <button type="submit" style={buttonStyle("#28a745")}>Добавить</button>
                </form>
            )}

            {/* Список товаров */}
            <h2 style={{ color: "#fff", marginBottom: "12px" }}>Товары категории</h2>
            {items.length === 0 ? (
                <p style={{ color: "#aaa" }}>Список товаров пуст</p>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                    {items.map(item => (
                        <div key={item.id} style={{ border: "1px solid #333", borderRadius: "12px", padding: "16px", width: "220px", boxShadow: "0 2px 8px rgba(0,0,0,0.5)", backgroundColor: "#1e1e2a" }}>
                            <h3 style={{ color: "#fff" }}>{item.name}</h3>
                            <p style={{ color: "#ccc" }}>Количество: {item.count}</p>
                            <button onClick={() => navigate(`/items/${item.id}`)} style={buttonStyle("#646cff")}>
                                Подробнее
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Назад к категориям */}
            <button onClick={() => navigate("/categories")} style={{ ...buttonStyle("#6c757d"), marginTop: "20px" }}>Назад к категориям</button>
        </div>
    );
}




