import { useState } from "react";

export const useSider = () => {
    const [showSider, setShowSider] = useState(false);
    const [collapsed, setCollapsed] = useState(true);
    const [siderName, setSiderName] = useState('Home');
    const [content, setContent] = useState("");


    return [
        collapsed, setCollapsed,
        showSider, setShowSider,
        siderName, setSiderName,
        content, setContent,
    ];
}
