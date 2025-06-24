import Link from "next/link";
import styles from "./styles.module.css";
import type { AsignaturaDTO } from "./AsignaturaForm";

export default function AsignaturaList({
                                           asignaturas,
                                           onDelete,
                                           loadingId
                                       }: {
    asignaturas: AsignaturaDTO[];
    onDelete: (id: string) => void;
    loadingId?: string;
}) {
    return (
        <table className={styles.table}>
            <thead>
            <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Créditos</th>
                <th>Semestre</th>
                <th>Activa</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {asignaturas.length === 0 && (
                <tr>
                    <td colSpan={6}>No hay asignaturas registradas.</td>
                </tr>
            )}
            {asignaturas.map((a) => (
                <tr key={a.id}>
                    <td>{a.codigo}</td>
                    <td>{a.nombre}</td>
                    <td>{a.creditos}</td>
                    <td>{a.numeroSemestre}</td>
                    <td>{a.activa ? "Sí" : "No"}</td>
                    <td>
                        <Link href={`/asignaturas/${a.id}`}>
                            <button className={styles.btn + " " + styles["btn-view"]}>Ver</button>
                        </Link>
                        <Link href={`/asignaturas/${a.id}?edit=1`}>
                            <button className={styles.btn + " " + styles["btn-edit"]}>Editar</button>
                        </Link>
                        <button
                            className={styles.btn + " " + styles["btn-secondary"]}
                            onClick={() => onDelete(a.id!)}
                            disabled={loadingId === a.id}
                        >
                            {loadingId === a.id ? "Eliminando..." : "Eliminar"}
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}