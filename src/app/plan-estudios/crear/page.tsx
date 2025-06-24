"use client";
import { useState } from "react";

type PlanEstudiosDTO = {
    nombre: string;
    codigo: string;
    duracionSemestres: number;
    descripcion: string;
    facultad: string;
    programa: string;
    activo: boolean;
    semestres: string[]; // IDs de los semestres
};

export default function CrearPlanEstudios() {
    const [plan, setPlan] = useState<Omit<PlanEstudiosDTO, "semestres">>({
        nombre: "",
        codigo: "",
        duracionSemestres: 1,
        descripcion: "",
        facultad: "",
        programa: "",
        activo: true,
    });
    const [semestres, setSemestres] = useState<string>(""); // IDs separados por coma
    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type, checked } = e.target;
        setPlan((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensaje("");
        setLoading(true);

        try {
            const semestresArray = semestres
                .split(",")
                .map((id) => id.trim())
                .filter((id) => id.length > 0);

            const body: PlanEstudiosDTO = {
                ...plan,
                semestres: semestresArray,
            };

            const resp = await fetch("http://localhost:8080/api/planes-estudios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!resp.ok) throw new Error("No se pudo crear el plan de estudios");

            setMensaje("Plan de estudios creado correctamente.");
            setPlan({
                nombre: "",
                codigo: "",
                duracionSemestres: 1,
                descripcion: "",
                facultad: "",
                programa: "",
                activo: true,
            });
            setSemestres("");
        } catch (err: any) {
            setMensaje(err.message);
        }
        setLoading(false);
    };

    return (
        <div style={{
            maxWidth: 600, margin: "0 auto", padding: 32,
            background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #001a2c22"
        }}>
            <h2 style={{ color: "#0B2D5C", marginBottom: 20 }}>Crear Plan de Estudios</h2>
            <form onSubmit={handleSubmit}>
                <label>Nombre</label>
                <input
                    type="text"
                    name="nombre"
                    value={plan.nombre}
                    onChange={handleChange}
                    required
                    style={{ width: "100%", marginBottom: 12 }}
                />
                <label>Código</label>
                <input
                    type="text"
                    name="codigo"
                    value={plan.codigo}
                    onChange={handleChange}
                    required
                    style={{ width: "100%", marginBottom: 12 }}
                />
                <label>Duración (semestres)</label>
                <input
                    type="number"
                    name="duracionSemestres"
                    value={plan.duracionSemestres}
                    min={1}
                    onChange={handleChange}
                    required
                    style={{ width: "100%", marginBottom: 12 }}
                />
                <label>Facultad</label>
                <input
                    type="text"
                    name="facultad"
                    value={plan.facultad}
                    onChange={handleChange}
                    required
                    style={{ width: "100%", marginBottom: 12 }}
                />
                <label>Programa</label>
                <input
                    type="text"
                    name="programa"
                    value={plan.programa}
                    onChange={handleChange}
                    required
                    style={{ width: "100%", marginBottom: 12 }}
                />
                <label>Descripción</label>
                <textarea
                    name="descripcion"
                    value={plan.descripcion}
                    onChange={handleChange}
                    required
                    style={{ width: "100%", marginBottom: 12, minHeight: 60 }}
                />
                <label>
                    Activo
                    <input
                        type="checkbox"
                        name="activo"
                        checked={plan.activo}
                        onChange={handleChange}
                        style={{ marginLeft: 10 }}
                    />
                </label>
                <br /><br />
                <label>
                    IDs de Semestres <span style={{ color: "#666", fontSize: 13 }}>(separa por coma)</span>
                </label>
                <input
                    type="text"
                    value={semestres}
                    onChange={e => setSemestres(e.target.value)}
                    placeholder="Ej: id1,id2,id3"
                    style={{ width: "100%", marginBottom: 18 }}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        background: "#00509E", color: "#fff", fontWeight: 700, padding: "10px 32px",
                        border: "none", borderRadius: 6, cursor: "pointer", marginTop: 10
                    }}
                >
                    {loading ? "Creando..." : "Crear"}
                </button>
                {mensaje && (
                    <div style={{
                        marginTop: 18, fontWeight: 700,
                        color: mensaje.startsWith("Plan") ? "#0B7C10" : "#b71c1c"
                    }}>{mensaje}</div>
                )}
            </form>
        </div>
    );
}