import { useState } from "react";
import supabase from "../utils/supabase";

export default function PotluckDrinks() {
    const [meals, setDrinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");

    const drinkDisplay = [];
    for (let i = 0; i < drinks.length; i++) {
        drinkDisplay.push(
            <li>
                {drinks[i].name} is bringing {drinks[i].drink}, and has enough
                for {drinks[i].serves}
            </li>
        );
    }

    // Fetch meals from Supabase
    async function handleFetchDrinks() {
        try {
            setLoading(true);
            const { data, error } = await supabase.from("drinks").select("*");
            if (error) throw error;
            setDrinks(data);
        } catch (err) {
            console.error("Error fetching meals:", err.message);
        } finally {
            setLoading(false);
        }
    }

    // Add a new drink
    async function handleAddDrinks(e) {
        e.preventDefault();
        setStatusMsg("Adding drink...");

        const form = e.target;
        const newDrinks = {
            name: form.guestName.value.trim(),
            dish: form.drinkName.value.trim(),
            feeds: form.serves.value ? parseInt(form.serves.value, 10) : null,
        };

        const { error } = await supabase.from("drinks").insert([newDrinks]);

        if (error) {
            console.error("Error adding drink:", error);
            setStatusMsg(" Failed to add drink");
        } else {
            setStatusMsg("drink added successfully!");
            form.reset();
            handleFetchDrink(); // refresh meals list
        }
    }

    return (
        <section className="container text-center mt-4">
            <h1 className="mb-3">Potluck Drinks</h1>

            <button
                onClick={handleFetchDrinks}
                className="btn btn-success mb-3"
            >
                {loading ? "Loading..." : "Get Meal List"}
            </button>

            <ul className="text-start border rounded p-3">
                {meals.map((drinks) => (
                    <li key={drinks.id}>
                        <strong>{drinks.name}</strong> is bringing{" "}
                        <em>{drinks.drink}</em> for {drinks.serves} people.
                    </li>
                ))}
            </ul>

            <form onSubmit={handleAddDrinks} className="form-group mt-4">
                <div className="mb-2">
                    <label className="form-label">Drink Name:</label>
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

                <button className="btn btn-success" type="submit">
                    Add Drinks
                </button>
            </form>

            {statusMsg && <p className="mt-3">{statusMsg}</p>}
        </section>
    );
}
