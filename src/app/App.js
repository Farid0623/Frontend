import React, { useState } from "react";
import "./App.css";
import logo from "../../public/humboldt_logo.svg"; // Guarda la imagen como humboldt_logo.png en src

const initialForm = {
    codigo: "",
    nombre: "",
    creditos: 0,
    horasTeoricas: 0,
    horasPracticas: 0,
    descripcion: "",
    activa: true,
    estado: "ACTIVA",
    prerrequisitos: [],
    horarios: [],
    numeroSemestre: 1,
};

function App() {
    const [form, setForm] = useState(initialForm);
    const [horarioInput, setHorarioInput] = useState("");
    const [asignaturaCreada, setAsignaturaCreada] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : name === "creditos" || name === "horasTeoricas" || name === "horasPracticas" || name === "numeroSemestre"
                        ? Number(value)
                        : value,
        }));
    };

    const addHorario = () => {
        if (horarioInput.trim()) {
            setForm((prev) => ({
                ...prev,
                horarios: [...prev.horarios, horarioInput.trim()],
            }));
            setHorarioInput("");
        }
    };

    const removeHorario = (idx) => {
        setForm((prev) => ({
            ...prev,
            horarios: prev.horarios.filter((_, i) => i !== idx),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAsignaturaCreada(null);
        try {
            const response = await fetch("http://localhost:8080/api/asignaturas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await response.json();
            if (response.ok) {
                setAsignaturaCreada(data);
                setForm(initialForm);
            } else {
                alert(data.message || "Error al crear la asignatura");
            }
        } catch (err) {
            alert("Error al conectar con el backend");
        }
        setLoading(false);
    };

    return (
        <div className="App">
            <header>
                <img src={logo} alt="Logo Humboldt" className="logo" />
                <h1>Gestión de Asignaturas</h1>
            </header>
            <form className="card" onSubmit={handleSubmit}>
                <div className="form-row">
                    <label>Código</label>
                    <input name="codigo" value={form.codigo} onChange={handleChange} required />
                </div>
                <div className="form-row">
                    <label>Nombre</label>
                    <input name="nombre" value={form.nombre} onChange={handleChange} required />
                </div>
                <div className="form-row">
                    <label>Créditos</label>
                    <input type="number" name="creditos" value={form.creditos} onChange={handleChange} required min={0} />
                </div>
                <div className="form-row">
                    <label>Horas Teóricas</label>
                    <input type="number" name="horasTeoricas" value={form.horasTeoricas} onChange={handleChange} required min={0} />
                </div>
                <div className="form-row">
                    <label>Horas Prácticas</label>
                    <input type="number" name="horasPracticas" value={form.horasPracticas} onChange={handleChange} required min={0} />
                </div>
                <div className="form-row">
                    <label>Descripción</label>
                    <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required />
                </div>
                <div className="form-row">
                    <label>Activa</label>
                    <input type="checkbox" name="activa" checked={form.activa} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Estado</label>
                    <select name="estado" value={form.estado} onChange={handleChange}>
                        <option value="ACTIVA">ACTIVA</option>
                        <option value="INACTIVA">INACTIVA</option>
                    </select>
                </div>
                <div className="form-row">
                    <label>N° Semestre</label>
                    <input type="number" name="numeroSemestre" value={form.numeroSemestre} min={1} onChange={handleChange} required />
                </div>
                <div className="form-row">
                    <label>Prerrequisitos (IDs, separados por coma)</label>
                    <input
                        name="prerrequisitos"
                        value={form.prerrequisitos.join(",")}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                prerrequisitos: e.target.value.split(",").map((v) => v.trim()).filter(Boolean),
                            }))
                        }
                        placeholder="Ej: 123,456"
                    />
                </div>
                <div className="form-row">
                    <label>Horarios</label>
                    <div className="horarios-box">
                        <input
                            value={horarioInput}
                            onChange={(e) => setHorarioInput(e.target.value)}
                            placeholder="Ej: Lunes 10-12"
                        />
                        <button type="button" onClick={addHorario} className="add-btn">
                            Agregar
                        </button>
                    </div>
                    <ul className="horarios-list">
                        {form.horarios.map((h, idx) => (
                            <li key={idx}>
                                {h}
                                <button type="button" onClick={() => removeHorario(idx)} className="remove-btn">
                                    Quitar
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <button className="submit-btn" type="submit" disabled={loading}>
                    {loading ? "Enviando..." : "Crear Asignatura"}
                </button>
            </form>
            {asignaturaCreada && (
                <div className="card respuesta">
                    <h2>Asignatura creada correctamente</h2>
                    <pre>{JSON.stringify(asignaturaCreada, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default App;