"use client";

import {ReactNode, useState} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {EDKUIProvider} from "@edk/ui-react";

const Providers = ({children}: { children: ReactNode }) => {
    const [client] = useState(() => new QueryClient());
    
    return (
        <QueryClientProvider client={client}>
            <EDKUIProvider value={{ locale: "tr" }}>
                {children}
            </EDKUIProvider>
        </QueryClientProvider>
    );
}

export default Providers;