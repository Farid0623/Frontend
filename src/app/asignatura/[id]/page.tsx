"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../styles.module.css";
import AsignaturaForm, { AsignaturaDTO } from "../AsignaturaForm";

export default function Page({ params }: { params: { id: string } }) {
    const [asignatura, setAsignatura] = useState<AsignaturaDTO>();
    const [loading, setLoading] = useState(true);
    const [respuesta, setRespuesta] = useState<any>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const editMode = !!searchParams.get("edit");

    useEffect(() => {
        fetch("http://localhost:8080/api/asignaturas/" + params.id)
            .then((r) => r.json())
            .then(setAsignatura)
            .finally(() => setLoading(false));
    }, [params.id]);

    const handleEdit = async (dto: AsignaturaDTO) => {
        setRespuesta(null);
        try {
            const res = await fetch("http://localhost:8080/api/asignaturas/" + params.id, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dto),
            });
            const data = await res.json();
            if (res.ok) {
                setRespuesta({ success: true, message: "Asignatura actualizada correctamente." });
                setTimeout(() => router.push("/asignaturas"), 1500);
            } else {
                setRespuesta({ error: data.message || "Error al actualizar la asignatura" });
            }
        } catch {
            setRespuesta({ error: "Error al conectar con el backend" });
        }
    };

    if (loading) return <div className={styles.detailSection}>Cargando...</div>;
    if (!asignatura) return <div className={styles.detailSection}>No encontrada.</div>;

    if (editMode) {
        return (
            <div className={styles.detailSection}>
                <button className={styles.goBackBtn} onClick={() => router.back()}>← Volver</button>
                <h2>Editar asignatura</h2>
                <AsignaturaForm initialData={asignatura} onSubmit={handleEdit} submitText="Guardar cambios" />
                {respuesta && (
                    <div className={styles.respuesta}>
                        <b>{respuesta.success ? "Éxito:" : "Error:"}</b> {respuesta.message || respuesta.error}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={styles.detailSection}>
            <button className={styles.goBackBtn} onClick={() => router.back()}>← Volver</button>
            <h2>Detalle de asignatura</h2>
            <div className={styles.card}>
                <b>Código:</b> {asignatura.codigo} <br />
                <b>Nombre:</b> {asignatura.nombre} <br />
                <b>Créditos:</b> {asignatura.creditos} <br />
                <b>Horas Teóricas:</b> {asignatura.horasTeoricas} <br />
                <b>Horas Prácticas:</b> {asignatura.horasPracticas} <br />
                <b>Descripción:</b> {asignatura.descripcion} <br />
                <b>Activa:</b> {asignatura.activa ? "Sí" : "No"} <br />
                <b>Estado:</b> {asignatura.estado} <br />
                <b>Semestre:</b> {asignatura.numeroSemestre} <br />
                <b>Prerrequisitos:</b> {asignatura.prerrequisitos?.join(", ") || "Ninguno"} <br />
                <b>Horarios:</b>
                <ul>
                    {asignatura.horarios && asignatura.horarios.length > 0
                        ? asignatura.horarios.map((h, i) => <li key={i}>{h}</li>)
                        : <li>Ninguno</li>}
                </ul>
            </div>
        </div>
    );
}