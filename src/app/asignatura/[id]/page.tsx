"use client";
import { useEffect, useState } from "react";
import * as React from "react";
import { useRouter } from "next/navigation";
import styles from "../styles.module.css";

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

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const [asignatura, setAsignatura] = useState<AsignaturaDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch(`http://localhost:8080/api/asignaturas/${id}`)
            .then((r) => r.json())
            .then(setAsignatura)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className={styles.detailSection}>Cargando...</div>;
    if (!asignatura) return <div className={styles.detailSection}>No encontrada.</div>;

    return (
        <div className={styles.detailSection}>
            <button className={styles.goBackBtn} onClick={() => router.push("/asignatura")}>
                ← Volver al listado
            </button>
            <div className={styles.card} style={{ maxWidth: 700, margin: "0 auto" }}>
                <h2 className={styles.titulo}>Detalle de la Asignatura</h2>
                <table className={styles.table}>
                    <tbody>
                    <tr>
                        <th>Código</th>
                        <td>{asignatura.codigo}</td>
                    </tr>
                    <tr>
                        <th>Nombre</th>
                        <td>{asignatura.nombre}</td>
                    </tr>
                    <tr>
                        <th>Semestre</th>
                        <td>{asignatura.numeroSemestre}</td>
                    </tr>
                    <tr>
                        <th>Créditos</th>
                        <td>{asignatura.creditos}</td>
                    </tr>
                    <tr>
                        <th>Horas Teóricas</th>
                        <td>{asignatura.horasTeoricas}</td>
                    </tr>
                    <tr>
                        <th>Horas Prácticas</th>
                        <td>{asignatura.horasPracticas}</td>
                    </tr>
                    <tr>
                        <th>Descripción</th>
                        <td>{asignatura.descripcion}</td>
                    </tr>
                    <tr>
                        <th>Activa</th>
                        <td>{asignatura.activa ? "Sí" : "No"}</td>
                    </tr>
                    <tr>
                        <th>Estado</th>
                        <td>{asignatura.estado}</td>
                    </tr>
                    <tr>
                        <th>Prerrequisitos</th>
                        <td>
                            {asignatura.prerrequisitos && asignatura.prerrequisitos.length > 0
                                ? asignatura.prerrequisitos.join(", ")
                                : "Ninguno"}
                        </td>
                    </tr>
                    <tr>
                        <th>Horarios</th>
                        <td>
                            {asignatura.horarios && asignatura.horarios.length > 0
                                ? (
                                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                                        {asignatura.horarios.map((h, i) => <li key={i}>{h}</li>)}
                                    </ul>
                                )
                                : "Ninguno"}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}