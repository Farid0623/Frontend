"use client";
import { useState } from "react";
import styles from "./styles.module.css";

type PlanEstudiosDTO = {
    _id?: string;
    nombre: string;
    codigo: string;
    duracionSemestres: number;
    descripcion: string;
    facultad: string;
    programa: string;
    activo: boolean;
    semestres: number[];
    semestreInput: string;
    asignaturasPorSemestre: { [semestre: number]: string[] };
    asignaturaInput: string;
    semestreAsignaturasSelect: number;
};

export default function PlanEstudiosPage() {
    const [form, setForm] = useState<PlanEstudiosDTO>({
        _id: "6857aee8590352475fed1322",
        nombre: "Ingeniería de Sistemas",
        codigo: "IS2025",
        duracionSemestres: 8,
        descripcion: "Plan de estudios para Ingeniería de Sistemas.",
        facultad: "Ingeniería",
        programa: "Sistemas",
        activo: true,
        semestres: [1,2,3,4,5,6,7,8],
        semestreInput: "",
        asignaturasPorSemestre: {
            1: ["MAT101", "QUI103"],
            2: ["FIS102", "BIO104"],
            3: [],
            4: [],
            5: [],
            6: [],
            7: [],
            8: [],
        },
        asignaturaInput: "",
        semestreAsignaturasSelect: 1,
    });

    // Manejo de semestres
    const handleSemestreKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === "Enter" || e.key === ",") && form.semestreInput.trim()) {
            e.preventDefault();
            const num = Number(form.semestreInput.trim());
            if (
                !isNaN(num) &&
                num > 0 &&
                num <= 20 &&
                !form.semestres.includes(num)
            ) {
                setForm((f) => ({
                    ...f,
                    semestres: [...f.semestres, num].sort((a, b) => a - b),
                    semestreInput: "",
                    asignaturasPorSemestre: {
                        ...f.asignaturasPorSemestre,
                        [num]: [],
                    },
                }));
            }
        }
        if (
            e.key === "Backspace" &&
            form.semestreInput === "" &&
            form.semestres.length > 0
        ) {
            const last = form.semestres[form.semestres.length - 1];
            const { [last]: omit, ...rest } = form.asignaturasPorSemestre;
            setForm((f) => ({
                ...f,
                semestres: f.semestres.slice(0, -1),
                asignaturasPorSemestre: rest,
                semestreAsignaturasSelect:
                    f.semestres.length > 1
                        ? f.semestres.filter((_, idx) => idx !== f.semestres.length - 1)[0]
                        : 1,
            }));
        }
    };
    const handleSemestreInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => setForm((f) => ({ ...f, semestreInput: e.target.value.replace(",", "") }));
    const removeSemestre = (i: number) => {
        const semestre = form.semestres[i];
        const { [semestre]: omit, ...rest } = form.asignaturasPorSemestre;
        setForm((f) => ({
            ...f,
            semestres: f.semestres.filter((_, idx) => idx !== i),
            asignaturasPorSemestre: rest,
            semestreAsignaturasSelect:
                f.semestres.length > 1
                    ? f.semestres.filter((_, idx) => idx !== i)[0]
                    : 1,
        }));
    };

    // Asignaturas por semestre
    const handleAsignaturaKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (
            (e.key === "Enter" || e.key === ",") &&
            form.asignaturaInput.trim()
        ) {
            e.preventDefault();
            const code = form.asignaturaInput.trim();
            const sem = form.semestreAsignaturasSelect;
            if (
                !form.asignaturasPorSemestre[sem]?.includes(code) &&
                code.length > 0
            ) {
                setForm((f) => ({
                    ...f,
                    asignaturasPorSemestre: {
                        ...f.asignaturasPorSemestre,
                        [sem]: [...(f.asignaturasPorSemestre[sem] || []), code],
                    },
                    asignaturaInput: "",
                }));
            }
        }
        if (
            e.key === "Backspace" &&
            form.asignaturaInput === "" &&
            form.asignaturasPorSemestre[form.semestreAsignaturasSelect]?.length > 0
        ) {
            const sem = form.semestreAsignaturasSelect;
            setForm((f) => ({
                ...f,
                asignaturasPorSemestre: {
                    ...f.asignaturasPorSemestre,
                    [sem]: f.asignaturasPorSemestre[sem].slice(
                        0,
                        f.asignaturasPorSemestre[sem].length - 1
                    ),
                },
            }));
        }
    };
    const handleAsignaturaInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => setForm((f) => ({
        ...f,
        asignaturaInput: e.target.value.replace(",", ""),
    }));
    const removeAsignatura = (i: number) => {
        const sem = form.semestreAsignaturasSelect;
        setForm((f) => ({
            ...f,
            asignaturasPorSemestre: {
                ...f.asignaturasPorSemestre,
                [sem]: f.asignaturasPorSemestre[sem].filter((_, idx) => idx !== i),
            },
        }));
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({
            ...f,
            [name]:
                type === "checkbox"
                    ? checked
                    : type === "number"
                        ? Number(value)
                        : value,
        }));
    };

    const handleSemestreAsignaturasSelect = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => setForm((f) => ({
        ...f,
        semestreAsignaturasSelect: Number(e.target.value),
        asignaturaInput: "",
    }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(
            "Plan de estudios guardado (simulación):\n" +
            JSON.stringify(
                {
                    ...form,
                    semestreInput: undefined,
                    asignaturaInput: undefined,
                    semestreAsignaturasSelect: undefined,
                },
                null,
                2
            )
        );
        // Aquí puedes conectar con tu API
    };

    return (
        <div className={styles.body}>
            <div className={styles.sectionHeader}>
                <h1 className={styles.title}>Plan de Estudios</h1>
            </div>
            <div className={styles.formContainer}>
                <form className={styles.card} onSubmit={handleSubmit}>
                    <section className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Datos generales</h2>
                        <div className={styles.formRow}>
                            <label>ID (sólo lectura)</label>
                            <input
                                type="text"
                                name="_id"
                                value={form._id ?? ""}
                                readOnly
                            />
                        </div>
                        <div className={styles.rowDouble}>
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
                                <label>Código</label>
                                <input
                                    type="text"
                                    name="codigo"
                                    value={form.codigo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.rowDouble}>
                            <div className={styles.formRow}>
                                <label>Facultad</label>
                                <input
                                    type="text"
                                    name="facultad"
                                    value={form.facultad}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formRow}>
                                <label>Programa</label>
                                <input
                                    type="text"
                                    name="programa"
                                    value={form.programa}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <label>Descripción</label>
                            <textarea
                                name="descripcion"
                                rows={3}
                                value={form.descripcion}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </section>
                    <section className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Estructura</h2>
                        <div className={styles.rowDouble}>
                            <div className={styles.formRow}>
                                <label>Duración (semestres)</label>
                                <input
                                    type="number"
                                    name="duracionSemestres"
                                    min={1}
                                    value={form.duracionSemestres}
                                    onChange={handleChange}
                                    required
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
                        </div>
                        <div className={styles.formRow}>
                            <label>
                                Semestres{" "}
                                <span className={styles.hint}>
                  (Enter o coma para agregar)
                </span>
                            </label>
                            <div className={styles.tagsInputWrapper}>
                                {form.semestres.map((num, idx) => (
                                    <span className={styles.tag} key={idx}>
                    {num}
                                        <button
                                            type="button"
                                            className={styles.removeTagBtn}
                                            onClick={() => removeSemestre(idx)}
                                            title="Quitar semestre"
                                        >
                      ×
                    </button>
                  </span>
                                ))}
                                <input
                                    className={styles.asignaturaInput}
                                    value={form.semestreInput}
                                    onChange={handleSemestreInputChange}
                                    onKeyDown={handleSemestreKeyDown}
                                    placeholder="Ej: 9"
                                    type="number"
                                    min={1}
                                    max={20}
                                />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <label>
                                Selecciona semestre para agregar sus asignaturas
                            </label>
                            <select
                                value={form.semestreAsignaturasSelect}
                                onChange={handleSemestreAsignaturasSelect}
                                className={styles.semestreSelect}
                            >
                                {form.semestres.map((num) => (
                                    <option key={num} value={num}>
                                        Semestre {num}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formRow}>
                            <label>
                                Asignaturas de semestre <b>{form.semestreAsignaturasSelect}</b>{" "}
                                <span className={styles.hint}>
                  (Enter o coma para agregar)
                </span>
                            </label>
                            <div className={styles.tagsInputWrapper}>
                                {(form.asignaturasPorSemestre[form.semestreAsignaturasSelect] ||
                                    []).map((cod, idx) => (
                                    <span className={styles.tag} key={idx}>
                    {cod}
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
                                    placeholder="Ej: MAT201"
                                />
                            </div>
                        </div>
                    </section>
                    <div className={styles.buttonRow}>
                        <button
                            className={styles.btn + " " + styles.btnPrimary}
                            type="submit"
                        >
                            Guardar plan de estudios
                        </button>
                    </div>
                </form>
            </div>
            <div className={styles.visualContainer}>
                <h2 className={styles.visualTitle}>Visualización del Plan</h2>
                <div className={styles.semestresGrid}>
                    {form.semestres.map((num) => (
                        <div className={styles.semestreCard} key={num}>
                            <div className={styles.semestreHeader}>
                                <div className={styles.semestreCircle}>{num}</div>
                                <span>Semestre {num}</span>
                            </div>
                            <ul className={styles.asignaturasList}>
                                {(form.asignaturasPorSemestre[num] || []).length === 0 ? (
                                    <li className={styles.sombra}>Sin asignaturas</li>
                                ) : (
                                    form.asignaturasPorSemestre[num].map((cod, idx) => (
                                        <li key={idx}>
                                            <span className={styles.asignaturaBullet}></span>
                                            {cod}
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}