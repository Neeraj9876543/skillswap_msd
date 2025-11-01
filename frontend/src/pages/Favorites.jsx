import { useState, useEffect } from "react";
import SkillCard from "../components/SkillCard";
import { favoritesAPI } from "../utils/api";
function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [requiresLogin, setRequiresLogin] = useState(false);
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("skillSwapToken");
      if (!token) {
        setRequiresLogin(true);
        setFavorites([]);
        return;
      }
      try {
        const data = await favoritesAPI.list();
        const favs = (data?.favorites || []).map((f) => ({
          id: f.externalId,
          title: f.title,
          category: f.category,
          level: f.level,
          desc: f.desc,
          teacher: f.teacher,
          avatar: f.avatar,
          rating: f.rating,
          sessions: f.sessions,
          rate: f.rate,
        }));
        setFavorites(favs);
      } catch (err) {
        console.error("Failed to load favorites from server:", err);
        setFavorites([]);
      }
    };
    load();
  }, []);

  const handleToggleFavorite = (card, isFavorite) => {
    if (!isFavorite) {
      setFavorites((prev) => prev.filter((item) => String(item.id) !== String(card.id)));
    } else {
      setFavorites((prev) => {
        const idx = prev.findIndex((p) => String(p.id) === String(card.id));
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = card;
          return copy;
        }
        return [card, ...prev];
      });
    }
  };
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Your Favorites ❤️</h2>
      {requiresLogin ? (
        <p className="text-gray-500">Please log in to view your favorites.</p>
      ) : favorites.length === 0 ? (
        <p className="text-gray-500">No favorites yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((card) => (
            <SkillCard
              key={card.id}
              c={card}
              onToggleFavorite={handleToggleFavorite}
              initialFavorite={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
export default FavoritesPage;
