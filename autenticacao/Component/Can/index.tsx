import { ReactNode } from "react";
import { useCan } from "../../Hooks/useCan";

interface CanProps {
    children: ReactNode;
    permissions?: string[];
    roles?: string[];
}

export function Can({children, permissions, roles}: CanProps){
    const userCanSeeComponent = useCan({permissions, roles});

    if(!userCanSeeComponent){
        return null;
    }

    return(
        <>
        {children}
        </>
    )
}