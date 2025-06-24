"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import AsignaturaForm, { AsignaturaDTO } from "./AsignaturaForm";
import AsignaturaList from "./AsignaturaList";
import Image from "next/image";
import logo from "./humboldt_logo.png";

export default function Page() {
    const [asignaturas, setAsignaturas] = useState<AsignaturaDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingDeleteId, setLoadingDeleteId] = useState<string>();
    const [respuesta, setRespuesta] = useState<any>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/asignaturas");
            const data = await res.json();
            setAsignaturas(data);
        } catch {
            // Nada
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (dto: AsignaturaDTO) => {
        setLoading(true);
        setRespuesta(null);
        try {
            const res = await fetch("http://localhost:8080/api/asignaturas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dto),
            });
            const data = await res.json();
            if (res.ok) {
                setRespuesta({ success: true, message: "Asignatura creada correctamente." });
                fetchData();
            } else {
                setRespuesta({ error: data.message || "Error al crear la asignatura" });
            }
        } catch {
            setRespuesta({ error: "Error al conectar con el backend" });
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        setLoadingDeleteId(id);
        try {
            await fetch("http://localhost:8080/api/asignaturas/" + id, { method: "DELETE" });
            fetchData();
        } catch {}
        setLoadingDeleteId(undefined);
    };

    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <div className={styles["logo-box"]}>
                    <Image src={logo} alt="Logo Humboldt" width={64} height={64} />
                    <div className={styles["logo-txt"]}>Humboldt</div>
                </div>
                <span className={styles["header-title"]}>Gestión de Asignaturas</span>
            </div>
            <div className={styles["main-content"]}>
                <h2>Crear nueva asignatura</h2>
                <AsignaturaForm onSubmit={handleCreate} loading={loading} submitText="Crear Asignatura" />
                {respuesta && (
                    <div className={styles.respuesta}>
                        <b>{respuesta.success ? "Éxito:" : "Error:"}</b> {respuesta.message || respuesta.error}
                    </div>
                )}
                <h2>Listado de asignaturas</h2>
                <AsignaturaList asignaturas={asignaturas} onDelete={handleDelete} loadingId={loadingDeleteId} />
            </div>
        </div>
    );
}