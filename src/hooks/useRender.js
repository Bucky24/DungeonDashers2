import { useState } from "react"

export default function useRender() {
    const [count, setCount] = useState(0);

    return () => {
        setCount((count) => {
            if (count > 100) {
                return 0;
            }

            return count + 1;
        });
    }
}