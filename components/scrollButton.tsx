import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import styles from './scrollButton.module.css'

export default function ScrollButton() {

    const [visible, setVisible] = useState<boolean>(false)

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300) {
            console.log('visible!')
            setVisible(true)
        }
        else if (scrolled <= 300) {
            setVisible(false)
        }
    }
    useEffect(() => {
        window.addEventListener('scroll', toggleVisible)
    }, [])

    return (
        <button
            className={styles.button}
            style={{ display: visible ? 'inline' : 'none' }}
            onClick={() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
            }}
        >
            <FaArrowUp />
        </button>
    );
}