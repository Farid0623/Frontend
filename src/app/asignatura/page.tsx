"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles.module.css";

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

export default function Page() {
    const [asignaturas, setAsignaturas] = useState<AsignaturaDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<AsignaturaDTO>({ ...emptyForm });

    const fetchAsignaturas = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/asignaturas");
            setAsignaturas(await res.json());
        } catch {}
        setLoading(false);
    };

    useEffect(() => { fetchAsignaturas(); }, []);

    const handleDelete = async (id: string) => {
        await fetch(`http://localhost:8080/api/asignaturas/${id}`, { method: "DELETE" });
        fetchAsignaturas();
    };

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleArrayChange = (e: any) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value.split(",").map((v: string) => v.trim()).filter((v: string) => v),
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        await fetch("http://localhost:8080/api/asignaturas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        setForm({ ...emptyForm });
        fetchAsignaturas();
    };

    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <div className={styles["logo-box"]}>
                    <Image
                        src="/humboldt_logo.png"
                        alt="Logo Humboldt"
                        width={52}
                        height={52}
                        priority
                    />
                    <div className={styles["logo-txt"]}>Humboldt</div>
                </div>
                <span className={styles["header-title"]}>Gestión de Asignaturas</span>
            </div>
            <div className={styles["main-content"]}>
                <h2 className={styles.titulo}>Crear nueva asignatura</h2>
                <form className={styles.card} style={{ marginBottom: 32 }} onSubmit={handleSubmit}>
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
                        <input type="number" name="creditos" value={form.creditos} onChange={handleChange} required />
                    </div>
                    <div className={styles.formRow}>
                        <label>Horas Teóricas</label>
                        <input type="number" name="horasTeoricas" value={form.horasTeoricas} onChange={handleChange} required />
                    </div>
                    <div className={styles.formRow}>
                        <label>Horas Prácticas</label>
                        <input type="number" name="horasPracticas" value={form.horasPracticas} onChange={handleChange} required />
                    </div>
                    <div className={styles.formRow}>
                        <label>Semestre</label>
                        <input type="number" name="numeroSemestre" value={form.numeroSemestre} onChange={handleChange} required />
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
                        <label>Descripción</label>
                        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} />
                    </div>
                    <div className={styles.formRow}>
                        <label>Prerrequisitos (IDs separados por coma)</label>
                        <input
                            name="prerrequisitos"
                            value={form.prerrequisitos.join(",")}
                            onChange={handleArrayChange}
                            placeholder="Ej: 1,2,3"
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label>Horarios (separados por coma)</label>
                        <input
                            name="horarios"
                            value={form.horarios.join(",")}
                            onChange={handleArrayChange}
                            placeholder="Ej: Lunes 8-10, Miércoles 10-12"
                        />
                    </div>
                    <button className={styles.btn + " " + styles["btn-primary"]} type="submit" disabled={loading}>
                        Crear materia
                    </button>
                </form>

                <h2 className={styles.titulo}>Listado de asignaturas</h2>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Créditos</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {asignaturas.length === 0 && (
                        <tr>
                            <td colSpan={4}>No hay asignaturas registradas.</td>
                        </tr>
                    )}
                    {asignaturas.map((a) => (
                        <tr key={a.id}>
                            <td>{a.codigo}</td>
                            <td>{a.nombre}</td>
                            <td>{a.creditos}</td>
                            <td>
                                <Link href={`/asignatura/${a.id}`}>
                                    <button className={styles.btn + " " + styles["btn-view"]}>Ver</button>
                                </Link>
                                <Link href={`/asignatura/${a.id}/editar`}>
                                    <button className={styles.btn + " " + styles["btn-edit"]}>Editar</button>
                                </Link>
                                <button className={styles.btn + " " + styles["btn-secondary"]} onClick={() => handleDelete(a.id!)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}