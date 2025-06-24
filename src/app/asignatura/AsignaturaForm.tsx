"use client";
import { useState } from "react";
import styles from "./styles.module.css";

export type AsignaturaDTO = {
    id?: string;
    codigo: string;
    nombre: string;
    creditos: number;
    horasTeoricas: number;
    horasPracticas: number;
    descripcion: string;
    activa: boolean;
    estado: string;
    prerrequisitos: string[];
    horarios: string[];
    numeroSemestre: number;
};

export default function AsignaturaForm({
                                           initialData,
                                           onSubmit,
                                           loading,
                                           submitText = "Guardar",
                                       }: {
    initialData?: AsignaturaDTO;
    onSubmit: (dto: AsignaturaDTO) => Promise<void>;
    loading?: boolean;
    submitText?: string;
}) {
    const [form, setForm] = useState<AsignaturaDTO>(
        initialData ?? {
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
        }
    );
    const [horarioInput, setHorarioInput] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        // @ts-ignore
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : ["creditos", "horasTeoricas", "horasPracticas", "numeroSemestre"].includes(name)
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

    const removeHorario = (idx: number) => {
        setForm((prev) => ({
            ...prev,
            horarios: prev.horarios.filter((_, i) => i !== idx),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form className={styles.card} onSubmit={handleSubmit} autoComplete="off">
            <div className={styles.formRow}>
                <label>Código</label>
                <input name="codigo" value={form.codigo} onChange={handleChange} required />
            </div>
            <div className={styles.formRow}>
                <label>Nombre</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className={styles.formRow}>
                <label>Créditos</label>
                <input type="number" name="creditos" value={form.creditos} min={0} onChange={handleChange} required />
            </div>
            <div className={styles.formRow}>
                <label>Horas Teóricas</label>
                <input type="number" name="horasTeoricas" value={form.horasTeoricas} min={0} onChange={handleChange} required />
            </div>
            <div className={styles.formRow}>
                <label>Horas Prácticas</label>
                <input type="number" name="horasPracticas" value={form.horasPracticas} min={0} onChange={handleChange} required />
            </div>
            <div className={styles.formRow}>
                <label>Descripción</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required />
            </div>
            <div className={styles.formRow}>
                <label>Activa</label>
                <input type="checkbox" name="activa" checked={form.activa} onChange={handleChange} />
            </div>
            <div className={styles.formRow}>
                <label>Estado</label>
                <select name="estado" value={form.estado} onChange={handleChange}>
                    <option value="ACTIVA">ACTIVA</option>
                    <option value="INACTIVA">INACTIVA</option>
                </select>
            </div>
            <div className={styles.formRow}>
                <label>N° Semestre</label>
                <input type="number" name="numeroSemestre" value={form.numeroSemestre} min={1} onChange={handleChange} required />
            </div>
            <div className={styles.formRow}>
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
            <div className={styles.formRow}>
                <label>Horarios</label>
                <div className={styles.horariosBox}>
                    <input
                        value={horarioInput}
                        onChange={(e) => setHorarioInput(e.target.value)}
                        placeholder="Ej: Lunes 10-12"
                    />
                    <button type="button" onClick={addHorario} className={styles.btn + ' ' + styles['btn-secondary']}>
                        Agregar
                    </button>
                </div>
                <ul className={styles.horariosList}>
                    {form.horarios.map((h, idx) => (
                        <li key={idx}>
                            {h}
                            <button type="button" onClick={() => removeHorario(idx)} className={styles.removeBtn}>
                                Quitar
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <button className={styles.submitBtn} type="submit" disabled={loading}>
                {loading ? "Guardando..." : submitText}
            </button>
        </form>
    );
}