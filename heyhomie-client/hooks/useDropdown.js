import { useState, useRef, useEffect } from 'react';

const useDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const node = useRef();
    const dropdownRef = useRef();

    const handleOutsideClick = event => {
        if (node.current.contains(event.target)) {
            return;
        }
        setIsOpen(false);
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen]);

    return { isOpen, setIsOpen, node, dropdownRef };
};

export default useDropdown;
