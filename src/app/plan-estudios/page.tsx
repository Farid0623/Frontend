"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import MainMenu from "@/components/MainMenu";

type PlanEstudiosDTO = {
    id?: string;
    nombre: string;
    codigo: string;
    duracionSemestres: number;
    descripcion: string;
    facultad: string;
    programa: string;
    activo: boolean;
    semestres: (string | number)[];
};

const emptyForm: PlanEstudiosDTO = {
    nombre: "",
    codigo: "",
    duracionSemestres: 1,
    descripcion: "",
    facultad: "",
    programa: "",
    activo: true,
    semestres: [],
};

export default function PlanEstudiosPage() {
    const [planes, setPlanes] = useState<PlanEstudiosDTO[]>([]);
    const [form, setForm] = useState<PlanEstudiosDTO>({ ...emptyForm });
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    const fetchPlanes = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/planes-estudios");
            const data = await res.json();
            setPlanes(data);
        } catch (e) {
            alert("No se pudieron cargar los planes de estudio.");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPlanes();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : type === "number"
                        ? Number(value)
                        : value,
        }));
    };

    const handleSemestresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setForm((prev) => ({
            ...prev,
            semestres: value
                .split(",")
                .map((v) => v.trim())
                .filter((v) => v !== ""),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editId) {
                await fetch(`http://localhost:8080/api/planes-estudios/${editId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
            } else {
                await fetch("http://localhost:8080/api/planes-estudios", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
            }
            setForm({ ...emptyForm });
            setEditId(null);
            fetchPlanes();
        } catch {
            alert("Error al guardar el plan de estudios.");
        }
        setLoading(false);
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (!confirm("¿Seguro que deseas eliminar este plan de estudios?")) return;
        setLoading(true);
        await fetch(`http://localhost:8080/api/planes-estudios/${id}`, {
            method: "DELETE",
        });
        fetchPlanes();
        setLoading(false);
    };

    const handleEdit = (plan: PlanEstudiosDTO) => {
        setEditId(plan.id ?? null);
        setForm({ ...plan, semestres: plan.semestres ?? [] });
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setForm({ ...emptyForm });
    };

    return (
        <div className={styles.body}>
            <nav className={styles.navbar}>
                <Link href="/asignatura" className={styles.navlink}>Asignaturas</Link>
                <Link href="/plan-estudios" className={`${styles.navlink} ${styles.active}`}>Planes de Estudio</Link>
            </nav>
            <h1 className={styles.headerTitle}>Gestión de Planes de Estudio</h1>
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    {editId ? "Editar plan de estudios" : "Crear nuevo plan de estudios"}
                </h2>
                <form className={styles.card} onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <label>Nombre</label>
                        <input
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            required
                            maxLength={60}
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label>Código</label>
                        <input
                            name="codigo"
                            value={form.codigo}
                            onChange={handleChange}
                            required
                            maxLength={15}
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label>Duración (semestres)</label>
                        <input
                            type="number"
                            name="duracionSemestres"
                            value={form.duracionSemestres}
                            onChange={handleChange}
                            min={1}
                            max={20}
                            required
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label>Facultad</label>
                        <input
                            name="facultad"
                            value={form.facultad}
                            onChange={handleChange}
                            required
                            maxLength={40}
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label>Programa</label>
                        <input
                            name="programa"
                            value={form.programa}
                            onChange={handleChange}
                            required
                            maxLength={40}
                        />
                    </div>
                    <div className={styles.formRowCheckbox}>
                        <label>Activo</label>
                        <input
                            type="checkbox"
                            name="activo"
                            checked={form.activo}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label>Semestres (IDs o números, separados por coma)</label>
                        <input
                            name="semestres"
                            value={form.semestres.join(",")}
                            onChange={handleSemestresChange}
                            placeholder="Ej: 1,2,3,4,5..."
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label>Descripción</label>
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            rows={3}
                            maxLength={200}
                        />
                    </div>
                    <div className={styles.buttonRow}>
                        <button
                            className={styles.btn + " " + styles.btnPrimary}
                            type="submit"
                            disabled={loading}
                        >
                            {editId ? "Guardar cambios" : "Crear plan"}
                        </button>
                        {editId && (
                            <button
                                className={styles.btn + " " + styles.btnSecondary}
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Listado de planes de estudios</h2>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Código</th>
                            <th>Duración</th>
                            <th>Facultad</th>
                            <th>Programa</th>
                            <th>Activo</th>
                            <th>Semestres</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {planes.length === 0 && (
                            <tr>
                                <td colSpan={8}>No hay planes de estudio registrados.</td>
                            </tr>
                        )}
                        {planes.map((plan) => (
                            <tr key={plan.id}>
                                <td>{plan.nombre}</td>
                                <td>{plan.codigo}</td>
                                <td>{plan.duracionSemestres}</td>
                                <td>{plan.facultad}</td>
                                <td>{plan.programa}</td>
                                <td>
                    <span className={plan.activo ? styles.activeYes : styles.activeNo}>
                      {plan.activo ? "Sí" : "No"}
                    </span>
                                </td>
                                <td>{Array.isArray(plan.semestres) ? plan.semestres.join(", ") : ""}</td>
                                <td>
                                    <div className={styles.actionButtons}>
                                        <button
                                            className={styles.btn + " " + styles.btnEdit}
                                            onClick={() => handleEdit(plan)}
                                            disabled={loading}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className={styles.btn + " " + styles.btnSecondary}
                                            onClick={() => handleDelete(plan.id)}
                                            disabled={loading}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}