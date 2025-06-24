"use client";
import { useEffect, useState } from "react";
import MainMenu from "@/components/MainMenu";
import styles from "./styles.module.css";

type SemestreDTO = {
    id?: string;
    numero: number;
    nombre: string;
    descripcion: string;
    asignaturas: string[]; // IDs de asignaturas
    planEstudiosId: string;
};

const emptyForm: SemestreDTO = {
    numero: 1,
    nombre: "",
    descripcion: "",
    asignaturas: [],
    planEstudiosId: "",
};

export default function SemestrePage() {
    const [semestres, setSemestres] = useState<SemestreDTO[]>([]);
    const [form, setForm] = useState<SemestreDTO>({ ...emptyForm });
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    const fetchSemestres = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/semestres");
            const data = await res.json();
            setSemestres(data);
        } catch {
            alert("No se pudieron cargar los semestres.");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSemestres();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleAsignaturasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setForm((prev) => ({
            ...prev,
            asignaturas: value
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
                await fetch(`http://localhost:8080/api/semestres/${editId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
            } else {
                await fetch("http://localhost:8080/api/semestres", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
            }
            setForm({ ...emptyForm });
            setEditId(null);
            fetchSemestres();
        } catch {
            alert("Error al guardar el semestre.");
        }
        setLoading(false);
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (!confirm("¿Seguro que deseas eliminar este semestre?")) return;
        setLoading(true);
        await fetch(`http://localhost:8080/api/semestres/${id}`, {
            method: "DELETE",
        });
        fetchSemestres();
        setLoading(false);
    };

    const handleEdit = (sem: SemestreDTO) => {
        setEditId(sem.id ?? null);
        setForm({ ...sem, asignaturas: sem.asignaturas ?? [] });
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setForm({ ...emptyForm });
    };

    return (
        <div className={styles.body}>
            <MainMenu />
            <h1 className={styles.headerTitle}>Gestión de Semestres</h1>
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    {editId ? "Editar semestre" : "Crear nuevo semestre"}
                </h2>
                <form className={styles.card} onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <label>Número</label>
                        <input
                            type="number"
                            name="numero"
                            value={form.numero}
                            onChange={handleChange}
                            min={1}
                            required
                        />
                    </div>
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
                        <label>Descripción</label>
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            rows={2}
                            maxLength={200}
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label>Asignaturas (IDs separados por coma)</label>
                        <input
                            name="asignaturas"
                            value={form.asignaturas.join(",")}
                            onChange={handleAsignaturasChange}
                            placeholder="Ej: MAT101,QUI103"
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label>ID del Plan de Estudios</label>
                        <input
                            name="planEstudiosId"
                            value={form.planEstudiosId}
                            onChange={handleChange}
                            required
                            maxLength={24}
                        />
                    </div>
                    <div className={styles.buttonRow}>
                        <button
                            className={styles.btn + " " + styles.btnPrimary}
                            type="submit"
                            disabled={loading}
                        >
                            {editId ? "Guardar cambios" : "Crear semestre"}
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
                <h2 className={styles.sectionTitle}>Listado de semestres</h2>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>Número</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Asignaturas</th>
                            <th>Plan de Estudios</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {semestres.length === 0 && (
                            <tr>
                                <td colSpan={6}>No hay semestres registrados.</td>
                            </tr>
                        )}
                        {semestres.map((sem) => (
                            <tr key={sem.id}>
                                <td>{sem.numero}</td>
                                <td>{sem.nombre}</td>
                                <td>{sem.descripcion}</td>
                                <td>
                                    {Array.isArray(sem.asignaturas)
                                        ? sem.asignaturas.join(", ")
                                        : ""}
                                </td>
                                <td>{sem.planEstudiosId}</td>
                                <td>
                                    <div className={styles.actionButtons}>
                                        <button
                                            className={styles.btn + " " + styles.btnEdit}
                                            onClick={() => handleEdit(sem)}
                                            disabled={loading}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className={styles.btn + " " + styles.btnSecondary}
                                            onClick={() => handleDelete(sem.id)}
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