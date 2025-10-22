'use client';

import MultiStepFormPage from "@/containers/form/MultiStepFormPage";
import { use } from "react";

interface PageProps {
    params: Promise<{
        step: string;
        applicationNo: string;
    }>;
}

export default function NewAppPageWithApplicationNo({ params }: PageProps) {
    const resolvedParams = use(params);
    const stepIndex = parseInt(resolvedParams.step) - 1;
    return <MultiStepFormPage initialStep={stepIndex} initialApplicationNo={resolvedParams.applicationNo} />;
}
