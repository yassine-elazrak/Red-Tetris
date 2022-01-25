import React, { useState } from "react";

export const useCollapsible = () => {
    const [useCollapsible, setCollapsible] = useState(false);

    return useCollapsible;
}

