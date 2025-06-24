"use client";
import { useState } from "react";
import styles from "./styles.module.css";

type SemestreDTO = {
    _id: string;
    numero: number;
    nombre: string;
    descripcion: string;
    asignaturas: string[];
    asignaturaInput: string;
    planEstudiosId: string;
};

export default function SemestrePage() {
    const [form, setForm] = useState<SemestreDTO>({
        _id: "6857aefa590352475fed1327",
        numero: 1,
        nombre: "Primer Semestre",
        descripcion: "Semestre inicial para todos los estudiantes.",
        asignaturas: ["MAT101", "QUI103"],
        asignaturaInput: "",
        planEstudiosId: "IS2025",
    });

    // Manejo de tags de asignaturas
    const handleAsignaturaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === "Enter" || e.key === ",") && form.asignaturaInput.trim()) {
            e.preventDefault();
            if (!form.asignaturas.includes(form.asignaturaInput.trim())) {
                setForm((prev) => ({
                    ...prev,
                    asignaturas: [...prev.asignaturas, form.asignaturaInput.trim()],
                    asignaturaInput: "",
                }));
            }
        }
        if (e.key === "Backspace" && form.asignaturaInput === "" && form.asignaturas.length > 0) {
            setForm((prev) => ({
                ...prev,
                asignaturas: prev.asignaturas.slice(0, -1),
            }));
        }
    };
    const handleAsignaturaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, asignaturaInput: e.target.value.replace(",", "") }));
    };
    const removeAsignatura = (i: number) => {
        setForm((prev) => ({
            ...prev,
            asignaturas: prev.asignaturas.filter((_, idx) => idx !== i),
        }));
    };

    // Manejo de campos normales
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Semestre guardado (simulación):\n" + JSON.stringify({
            ...form,
            asignaturaInput: undefined,
        }, null, 2));
        // Aquí puedes conectar con tu API
    };

    return (
        <div className={styles.body}>
            <div className={styles.sectionHeader}>
                <h1 className={styles.title}>Gestión de Semestres</h1>
            </div>
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Editar semestre</h2>
                <form className={styles.card} onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <label>ID (sólo lectura)</label>
                        <input type="text" name="_id" value={form._id} readOnly />
                    </div>
                    <div className={styles.formRow}>
                        <label>Número</label>
                        <input
                            type="number"
                            name="numero"
                            min={1}
                            value={form.numero}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label>Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label>Descripción</label>
                        <textarea
                            name="descripcion"
                            rows={2}
                            value={form.descripcion}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label>Asignaturas (código, presiona Enter o coma para agregar)</label>
                        <div className={styles.tagsInputWrapper}>
                            {form.asignaturas.map((tag, idx) => (
                                <span className={styles.tag} key={idx}>
                  {tag}
                                    <button
                                        type="button"
                                        className={styles.removeTagBtn}
                                        onClick={() => removeAsignatura(idx)}
                                        title="Quitar asignatura"
                                    >
                    ×
                  </button>
                </span>
                            ))}
                            <input
                                className={styles.asignaturaInput}
                                value={form.asignaturaInput}
                                onChange={handleAsignaturaInputChange}
                                onKeyDown={handleAsignaturaKeyDown}
                                placeholder="Ej: MAT101"
                            />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <label>Plan de Estudios ID</label>
                        <input
                            type="text"
                            name="planEstudiosId"
                            value={form.planEstudiosId}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.buttonRow}>
                        <button className={styles.btn + " " + styles.btnPrimary} type="submit">
                            Guardar semestre
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}