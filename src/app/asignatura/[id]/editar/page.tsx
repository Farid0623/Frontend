"use client";
import { useEffect, useState } from "react";
import * as React from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles.module.css";

type AsignaturaDTO = {
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

const emptyForm: AsignaturaDTO = {
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

export default function EditarPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const [form, setForm] = useState<AsignaturaDTO>({ ...emptyForm });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch(`http://localhost:8080/api/asignaturas/${id}`)
            .then((r) => r.json())
            .then((data) => {
                setForm({
                    ...data,
                    prerrequisitos: Array.isArray(data.prerrequisitos) ? data.prerrequisitos : [],
                    horarios: Array.isArray(data.horarios) ? data.horarios : [],
                });
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value.split(",").map((v) => v.trim()).filter((v) => v),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        await fetch(`http://localhost:8080/api/asignaturas/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        setSaving(false);
        router.push(`/asignatura/${id}`);
    };

    if (loading) return <div className={styles.detailSection}>Cargando...</div>;

    return (
        <div className={styles.detailSection}>
            <button className={styles.goBackBtn} onClick={() => router.push(`/asignatura/${id}`)}>
                ← Volver al detalle
            </button>
            <div className={styles.card} style={{ maxWidth: 700, margin: "0 auto" }}>
                <h2 className={styles.titulo}>Editar Asignatura</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px" }}>
                        <div className={styles.formRow}>
                            <label>Código</label>
                            <input
                                name="codigo"
                                value={form.codigo}
                                onChange={handleChange}
                                required
                                maxLength={15}
                                autoComplete="off"
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
                                autoComplete="off"
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>Créditos</label>
                            <input
                                type="number"
                                name="creditos"
                                value={form.creditos}
                                onChange={handleChange}
                                required
                                min={0}
                                max={20}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>Semestre</label>
                            <input
                                type="number"
                                name="numeroSemestre"
                                value={form.numeroSemestre}
                                onChange={handleChange}
                                required
                                min={1}
                                max={12}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>Horas Teóricas</label>
                            <input
                                type="number"
                                name="horasTeoricas"
                                value={form.horasTeoricas}
                                onChange={handleChange}
                                required
                                min={0}
                                max={30}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>Horas Prácticas</label>
                            <input
                                type="number"
                                name="horasPracticas"
                                value={form.horasPracticas}
                                onChange={handleChange}
                                required
                                min={0}
                                max={30}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>Estado</label>
                            <select name="estado" value={form.estado} onChange={handleChange}>
                                <option value="ACTIVA">ACTIVA</option>
                                <option value="INACTIVA">INACTIVA</option>
                            </select>
                        </div>
                        <div className={styles.formRow}>
                            <label>
                                <input
                                    type="checkbox"
                                    name="activa"
                                    checked={form.activa}
                                    onChange={handleChange}
                                    style={{ marginRight: 8 }}
                                />
                                Activa
                            </label>
                        </div>
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
                    <div className={styles.formRow}>
                        <label>Prerrequisitos (IDs separados por coma)</label>
                        <input
                            name="prerrequisitos"
                            value={form.prerrequisitos.join(", ")}
                            onChange={handleArrayChange}
                            placeholder="Ej: 1,2,3"
                            autoComplete="off"
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label>Horarios (separados por coma)</label>
                        <input
                            name="horarios"
                            value={form.horarios.join(", ")}
                            onChange={handleArrayChange}
                            placeholder="Ej: Lunes 8-10, Miércoles 10-12"
                            autoComplete="off"
                        />
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                        <button
                            className={`${styles.btn} ${styles["btn-primary"]}`}
                            type="submit"
                            disabled={saving}
                        >
                            Guardar Cambios
                        </button>
                        <button
                            className={`${styles.btn} ${styles["btn-secondary"]}`}
                            type="button"
                            onClick={() => router.push(`/asignatura/${id}`)}
                            style={{ marginLeft: 8 }}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}