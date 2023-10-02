import styles from "./pagination.module.css"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function Pagination({ pageCount, currentPage, setCurrentPage }: { pageCount: number, currentPage: number | undefined, setCurrentPage: (page: number) => void }) {
    return (
        <div className={styles.container}>
            <button
                className={styles.button}
                onClick={() => {
                    if (currentPage && currentPage !== 1) {
                        setCurrentPage(currentPage - 1)
                    }
                }}
            >
                <FaArrowLeft />
            </button>
            <div className={styles.currentPage}>
                Page <span className={styles.number}>{currentPage?.toString()}</span> of <span className={styles.number}>{pageCount.toString()}</span>
            </div>
            <button
                className={styles.button}
                onClick={() => {
                    if (currentPage && currentPage !== pageCount) {
                        setCurrentPage(currentPage + 1)
                    }
                }}
            >
                <FaArrowRight />
            </button>
        </div>
    )
}
