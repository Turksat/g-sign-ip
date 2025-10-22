// context/FormContext.tsx
"use client";

import {createContext, Dispatch, SetStateAction, useContext, useState} from "react";

const defaultFormData = {};

type FormContextType = {
    formData: Record<string, string | boolean | number | null | undefined>;
    setFormData: Dispatch<SetStateAction<object>>;
    resetFormData: () => void;
    clearApplicationContext: () => void; // Yeni fonksiyon
};

const FormContext = createContext<FormContextType | null>(null);

export function FormProvider({children}: { children: React.ReactNode }) {
    const [formData, setFormData] = useState(defaultFormData);

    const resetFormData = () => setFormData(defaultFormData);

    // Application context'ini tamamen temizle
    const clearApplicationContext = () => {
        // Session storage'ı temizle
        sessionStorage.removeItem('currentApplicationNo');
        
        // Form data'yı temizle
        setFormData(defaultFormData);
    };

    return (
        <FormContext.Provider value={{
            formData, 
            setFormData, 
            resetFormData, 
            clearApplicationContext
        }}>
            {children}
        </FormContext.Provider>
    );
}

export function useFormContext() {
    const context = useContext(FormContext);
    if (!context) throw new Error("useFormContext must be used inside FormProvider");
    return context;
}
