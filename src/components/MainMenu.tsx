"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./MainMenu.module.css";

const items = [
    { name: "Asignaturas", path: "/asignatura" },
    { name: "Planes de Estudio", path: "/plan-estudios" },
    { name: "Semestres", path: "/semestre" },
];

export default function MainMenu() {
    const pathname = usePathname();
    return (
        <nav className={styles.menu}>
            {items.map((item) => (
                <Link
                    key={item.path}
                    href={item.path}
                    className={`${styles.menuItem} ${pathname.startsWith(item.path) ? styles.active : ""}`}
                >
                    {item.name}
                </Link>
            ))}
        </nav>
    );
}