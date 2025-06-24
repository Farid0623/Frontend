"use client";
import { useState } from "react";
import styles from "./styles.module.css";

export default function AsignaturaPage() {
    const [form, setForm] = useState({
        codigo: "",
        nombre: "",
        creditos: 0,
        horasTeoricas: 0,
        horasPracticas: 0,
        semestre: 1,
        activa: true,
        estado: "ACTIVA",
        descripcion: "",
        prerrequisitos: [],
        prerreqInput: "",
        horarios: [],
        horarioInput: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
        }));
    };

    // Tags de prerrequisitos
    const handlePrerreqKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === "Enter" || e.key === ",") && form.prerreqInput.trim()) {
            e.preventDefault();
            if (!form.prerrequisitos.includes(form.prerreqInput.trim())) {
                setForm((prev) => ({
                    ...prev,
                    prerrequisitos: [...prev.prerrequisitos, form.prerreqInput.trim()],
                    prerreqInput: "",
                }));
            }
        }
        if (e.key === "Backspace" && form.prerreqInput === "" && form.prerrequisitos.length > 0) {
            setForm((prev) => ({
                ...prev,
                prerrequisitos: prev.prerrequisitos.slice(0, -1),
            }));
        }
    };
    const handlePrerreqInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, prerreqInput: e.target.value.replace(",", "") }));
    };
    const removePrerrequisito = (i: number) => {
        setForm((prev) => ({
            ...prev,
            prerrequisitos: prev.prerrequisitos.filter((_, idx) => idx !== i),
        }));
    };

    // Tags de horarios
    const handleHorarioKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === "Enter" || e.key === ",") && form.horarioInput.trim()) {
            e.preventDefault();
            if (!form.horarios.includes(form.horarioInput.trim())) {
                setForm((prev) => ({
                    ...prev,
                    horarios: [...prev.horarios, form.horarioInput.trim()],
                    horarioInput: "",
                }));
            }
        }
        if (e.key === "Backspace" && form.horarioInput === "" && form.horarios.length > 0) {
            setForm((prev) => ({
                ...prev,
                horarios: prev.horarios.slice(0, -1),
            }));
        }
    };
    const handleHorarioInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, horarioInput: e.target.value.replace(",", "") }));
    };
    const removeHorario = (i: number) => {
        setForm((prev) => ({
            ...prev,
            horarios: prev.horarios.filter((_, idx) => idx !== i),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Materia creada (simulación).");
        setForm({
            codigo: "",
            nombre: "",
            creditos: 0,
            horasTeoricas: 0,
            horasPracticas: 0,
            semestre: 1,
            activa: true,
            estado: "ACTIVA",
            descripcion: "",
            prerrequisitos: [],
            prerreqInput: "",
            horarios: [],
            horarioInput: "",
        });
    };

    return (
        <div className={styles.body}>
            <div className={styles.sectionHeader}>
                <h1 className={styles.title}>Gestión de Asignaturas</h1>
            </div>
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Crear nueva asignatura</h2>
                <form className={styles.card} onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <label>Código</label>
                        <input type="text" name="codigo" value={form.codigo} onChange={handleChange} required />
                    </div>
                    <div className={styles.formRow}>
                        <label>Nombre</label>
                        <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
                    </div>
                    <div className={styles.formRow}>
                        <label>Créditos</label>
                        <input type="number" name="creditos" min={0} value={form.creditos} onChange={handleChange} required />
                    </div>
                    <div className={styles.formRow}>
                        <label>Horas Teóricas</label>
                        <input type="number" name="horasTeoricas" min={0} value={form.horasTeoricas} onChange={handleChange} required />
                    </div>
                    <div className={styles.formRow}>
                        <label>Horas Prácticas</label>
                        <input type="number" name="horasPracticas" min={0} value={form.horasPracticas} onChange={handleChange} required />
                    </div>
                    <div className={styles.formRow}>
                        <label>Semestre</label>
                        <input type="number" name="semestre" min={1} value={form.semestre} onChange={handleChange} required />
                    </div>
                    <div className={styles.formRowCheckbox}>
                        <label>Activa</label>
                        <input type="checkbox" name="activa" checked={form.activa} onChange={handleChange} />
                    </div>
                    <div className={styles.formRow}>
                        <label>Estado</label>
                        <input type="text" name="estado" value={form.estado} readOnly />
                    </div>
                    <div className={styles.formRow}>
                        <label>Descripción</label>
                        <textarea name="descripcion" rows={2} value={form.descripcion} onChange={handleChange} maxLength={200} />
                    </div>
                    <div className={styles.formRow}>
                        <label>Prerrequisitos (IDs, presiona Enter o coma para agregar)</label>
                        <div className={styles.tagsInputWrapper}>
                            {form.prerrequisitos.map((tag, idx) => (
                                <span className={styles.tag} key={idx}>
                  {tag}
                                    <button type="button" className={styles.removeTagBtn} onClick={() => removePrerrequisito(idx)} title="Quitar prerrequisito">
                    ×
                  </button>
                </span>
                            ))}
                            <input
                                className={styles.asignaturaInput}
                                value={form.prerreqInput}
                                onChange={handlePrerreqInputChange}
                                onKeyDown={handlePrerreqKeyDown}
                                placeholder="Ej: 1,2,3"
                            />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <label>Horarios (presiona Enter o coma para agregar)</label>
                        <div className={styles.tagsInputWrapper}>
                            {form.horarios.map((tag, idx) => (
                                <span className={styles.tag} key={idx}>
                  {tag}
                                    <button type="button" className={styles.removeTagBtn} onClick={() => removeHorario(idx)} title="Quitar horario">
                    ×
                  </button>
                </span>
                            ))}
                            <input
                                className={styles.asignaturaInput}
                                value={form.horarioInput}
                                onChange={handleHorarioInputChange}
                                onKeyDown={handleHorarioKeyDown}
                                placeholder="Ej: Lunes 8-10"
                            />
                        </div>
                    </div>
                    <div className={styles.buttonRow}>
                        <button className={styles.btn + " " + styles.btnPrimary} type="submit">
                            Crear materia
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}