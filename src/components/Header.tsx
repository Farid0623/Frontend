"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

const navItems = [
    { name: "Asignaturas", path: "/asignatura" },
    { name: "Planes de Estudio", path: "/plan-estudios" },
    { name: "Semestres", path: "/semestre" },
];

export default function Header() {
    const pathname = usePathname();
    return (
        <header className={styles.header}>
            <div className={styles.headerBar}>
                <span className={styles.title}>Gestión Académica CUE</span>
                <nav className={styles.navMenu}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`${styles.navItem} ${pathname.startsWith(item.path) ? styles.active : ""}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className={styles.headerSub}>
                <div className={styles.logoBox}>
                    <img src="/logo.svg" alt="Logo" className={styles.logoImg} />
                </div>
            </div>
        </header>
    );
}