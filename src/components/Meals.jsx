import { useState } from "react";
import supabase from "../utils/supabase";

export default function PotluckMeals() {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");

    // Fetch meals from Supabase
    async function handleFetchMeals() {
        try {
            setLoading(true);
            const { data, error } = await supabase.from("meals").select("*");
            if (error) throw error;
            setMeals(data);
        } catch (err) {
            console.error("Error fetching meals:", err.message);
        } finally {
            setLoading(false);
        }
    }

    // Add a new meal
    async function handleAddMeal(e) {
        e.preventDefault();
        setStatusMsg("Adding meal...");

        const form = e.target;
        const newMeal = {
            name: form.guestName.value.trim(),
            dish: form.mealName.value.trim(),
            feeds: form.serves.value ? parseInt(form.serves.value, 10) : null,
            type: form.kindOfDish.value,
        };

        const { error } = await supabase.from("meals").insert([newMeal]);

        if (error) {
            console.error("Error adding meal:", error);
            setStatusMsg(" Failed to add meal");
        } else {
            setStatusMsg("Meal added successfully!");
            form.reset();
            handleFetchMeals(); // refresh meals list
        }
    }

    return (
        <section className="container text-center mt-4">
            <h1 className="mb-3">Potluck Meals</h1>

            <button onClick={handleFetchMeals} className="btn btn-success mb-3">
                {loading ? "Loading..." : "Get Meal List"}
            </button>

            <ul className="text-start border rounded p-3">
                {meals.map((meal) => (
                    <li key={meal.id}>
                        <strong>{meal.name}</strong> is bringing{" "}
                        <em>{meal.dish}</em> for {meal.feeds} people (
                        {meal.type})
                    </li>
                ))}
            </ul>

            <form onSubmit={handleAddMeal} className="form-group mt-4">
                <div className="mb-2">
                    <label className="form-label">Meal Name:</label>
                    <input
                        className="form-control"
                        type="text"
                        name="mealName"
                        required
                    />
                </div>

                <div className="mb-2">
                    <label className="form-label">Guest Name:</label>
                    <input
                        className="form-control"
                        type="text"
                        name="guestName"
                        required
                    />
                </div>

                <div className="mb-2">
                    <label className="form-label">Serves:</label>
                    <input
                        className="form-control"
                        type="number"
                        name="serves"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Kind of Dish:</label>
                    <select className="form-control" name="kindOfDish" required>
                        <option value="">Select One</option>
                        <option value="Appetizer">Appetizer</option>
                        <option value="Main Course">Main Course</option>
                        <option value="Dessert">Dessert</option>
                    </select>
                </div>

                <button className="btn btn-success" type="submit">
                    Add Meal
                </button>
            </form>

            {statusMsg && <p className="mt-3">{statusMsg}</p>}
        </section>
    );
}
