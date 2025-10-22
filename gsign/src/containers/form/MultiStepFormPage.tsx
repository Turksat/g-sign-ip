"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Step1 from "@/components/steps/Step1";
import Step2 from "@/components/steps/Step2";
import Step3 from "@/components/steps/Step3";
import Step4 from "@/components/steps/Step4";
import Step5 from "@/components/steps/Step5";
import Step6 from "@/components/steps/Step6";
import Step7 from "@/components/steps/Step7";
import { useFormContext } from "@/context/FormContext";
import { InputValue } from "@/types/CommonTypes";
import { useApi } from "@/hooks/useApi";
import { useApplicationSummary } from "@/hooks/useApplicationSummary";
import { transformApplicationSummaryToFormData } from "@/libs/dataTransformation";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

const steps = [
  "Applicant / Inventor Information",
  "Non-Provisional Utility Patent Application Information",
  "Detailed Description of the Invention",
  "First Inventor to File",
  "Authorization to Permit Access",
  "Application Summary",
  "Payment Information",
];

interface MultiStepFormPageProps {
  initialStep?: number;
  initialApplicationNo?: string;
}

export default function MultiStepFormPage({
  initialStep = 0,
  initialApplicationNo,
}: MultiStepFormPageProps) {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, redirectToLogin } = useApi();
  const { formData, setFormData, resetFormData, clearApplicationContext } =
    useFormContext();
  const { fetchApplicationSummary } = useApplicationSummary();

  // Session storage'dan applicationNo'yu oku
  const getApplicationNo = useCallback(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("currentApplicationNo");
    }
    return null;
  }, []);

  // Session storage'a applicationNo'yu yaz
  const setApplicationNo = useCallback((appNo: string | null) => {
    if (typeof window !== "undefined") {
      if (appNo) {
        sessionStorage.setItem("currentApplicationNo", appNo);
      } else {
        sessionStorage.removeItem("currentApplicationNo");
      }
    }
  }, []);

  // Session storage'dan form verilerini oku
  const getFormDataFromStorage = useCallback(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("currentFormData");
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  }, []);

  // Session storage'a form verilerini yaz
  const saveFormDataToStorage = useCallback((data: Record<string, unknown>) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("currentFormData", JSON.stringify(data));
    }
  }, []);

  // İstek kontrolü için ref
  const loadingRef = useRef<Set<string>>(new Set());

  // Application summary'den form data'yı yükle
  const loadApplicationData = useCallback(
    async (applicationNo: string) => {
      // Eğer bu applicationNo için zaten istek atıldıysa tekrar atma
      if (loadingRef.current.has(applicationNo)) {
        return;
      }

      // İstek başladığını işaretle
      loadingRef.current.add(applicationNo);
      setIsLoadingApplicationData(true);

      try {
        const summary = await fetchApplicationSummary(applicationNo);
        if (summary) {
          const newFormData = transformApplicationSummaryToFormData(
            summary as unknown as Record<string, unknown>
          );

          // Mevcut formData'yı al
          const currentFormData = formData;

          // Session storage'dan da mevcut veriyi al
          let sessionFormData: Record<string, unknown> = {};
          try {
            const stored = getFormDataFromStorage();
            if (stored) {
              sessionFormData = stored;
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {}

          // Mevcut uploadedFiles verisini koru
          const preservedData = {
            ...newFormData, // Backend'den gelen yeni veriler
            ...(currentFormData || {}), // Mevcut form verilerini ekle
            ...(sessionFormData || {}), // Session storage'dan gelen veriyi ekle
            // uploadedFiles'i özellikle koru
            uploadedFiles:
              (currentFormData as Record<string, unknown>)?.uploadedFiles ||
              sessionFormData?.uploadedFiles ||
              {},
            // checkoutTotal değerini koru
            checkoutTotal:
              (currentFormData as Record<string, unknown>)?.checkoutTotal ||
              sessionFormData?.checkoutTotal ||
              70.0,
          };

          // Form context'e yükle
          setFormData(preservedData);

          // Session storage'a kaydet
          saveFormDataToStorage(preservedData);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
      } finally {
        // İstek tamamlandığını işaretle
        loadingRef.current.delete(applicationNo);
        setIsLoadingApplicationData(false);
      }
    },
    [fetchApplicationSummary]
  ); // Sadece fetchApplicationSummary dependency olarak bırakıldı

  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isLoadingApplicationData, setIsLoadingApplicationData] =
    useState(false);

  // Güvenli stepIndex kontrolü - initialStep veya URL'den
  const rawStep = params?.step;
  const stepParam = Array.isArray(rawStep) ? rawStep[0] : rawStep;
  const urlStepIndex =
    stepParam && !isNaN(Number(stepParam)) ? parseInt(stepParam) - 1 : 0;
  const stepIndex = initialStep !== undefined ? initialStep : urlStepIndex;

  // Form validation için ref'ler - TÜM HOOK'LAR BURADA OLMALI
  const step1FormRef = useRef<{ trigger: () => Promise<boolean> }>(null);
  const step2FormRef = useRef<{ trigger: () => Promise<boolean> }>(null);
  const step3FormRef = useRef<{ trigger: () => Promise<boolean> }>(null);
  const step4FormRef = useRef<{ trigger: () => Promise<boolean> }>(null);
  const step5FormRef = useRef<{ trigger: () => Promise<boolean> }>(null);
  const step6FormRef = useRef<{ trigger: () => Promise<boolean> }>(null);
  const step7FormRef = useRef<{ trigger: () => Promise<boolean> }>(null);

  // Step3 için likelihood kontrol durumu
  const [isLikelihoodChecked, setIsLikelihoodChecked] = useState(false);

  // TÜM useEffect HOOK'LARI BURADA OLMALI
  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        redirectToLogin();
        return;
      }
      setIsAuthChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, redirectToLogin]);

  // initialApplicationNo varsa session storage'a set et ve application data'yı yükle
  useEffect(() => {
    if (initialApplicationNo) {
      setApplicationNo(initialApplicationNo);
      // Application data'yı yükle
      loadApplicationData(initialApplicationNo);
    } else {
      // Yeni başvuru için application context'i tamamen temizle
      clearApplicationContext();
      // Flag'leri sıfırla
      setIsLikelihoodChecked(false);
      setPendingApplicationNo(null); // Pending state'i de sıfırla

      // URL temizleme işlemini ikinci useEffect'e bırak
      // Burada router.replace çağırmıyoruz
    }
  }, [initialApplicationNo]); // Sadece initialApplicationNo dependency olarak bırakıldı

  // URL güncellemelerini takip etmek için ref kullan
  const urlUpdateRef = useRef<{
    applicationNo: string | null;
    stepIndex: number;
  }>({
    applicationNo: null,
    stepIndex: 0,
  });

  // applicationNo değişikliklerini tek bir useEffect'te yönet
  useEffect(() => {
    const currentApplicationNo = getApplicationNo();

    // Eğer aynı değerler için zaten URL güncellemesi yapıldıysa tekrar yapma
    if (
      urlUpdateRef.current.applicationNo === currentApplicationNo &&
      urlUpdateRef.current.stepIndex === stepIndex
    ) {
      return;
    }

    // Eğer applicationNo null ise (clearApplicationContext çağrıldıysa) URL'i temizle
    if (!currentApplicationNo) {
      const currentPath = window.location.pathname;
      if (currentPath.includes("/newapplication/step/1/")) {
        // Sadece bir kez URL temizleme yap
        router.replace("/newapplication/step/1");
        urlUpdateRef.current = { applicationNo: null, stepIndex };
      }
      return;
    }

    // applicationNo varsa ve Step1'deyse URL'i güncelle
    if (currentApplicationNo && stepIndex === 0) {
      const currentPath = window.location.pathname;

      if (!currentPath.includes(currentApplicationNo)) {
        // URL'i güncelle
        router.replace(`/newapplication/step/1/${currentApplicationNo}`);
        urlUpdateRef.current = {
          applicationNo: currentApplicationNo,
          stepIndex,
        };
      }
    }
  }, [stepIndex]); // Sadece stepIndex dependency olarak bırakıldı

  // Step1'den Step2'ye geçiş için applicationNo'yu bekleyen state
  const [pendingApplicationNo, setPendingApplicationNo] = useState<
    string | null
  >(null);

  // pendingApplicationNo değiştiğinde ve applicationNo mevcut olduğunda otomatik geçiş yap
  useEffect(() => {
    const currentApplicationNo = getApplicationNo();
    if (
      pendingApplicationNo === "pending" &&
      currentApplicationNo &&
      stepIndex === 0
    ) {
      setPendingApplicationNo(null); // Reset pending state
      router.push(`/newapplication/step/2/${currentApplicationNo}`);
    }
  }, [pendingApplicationNo, stepIndex]); // Sadece gerekli dependency'ler bırakıldı

  // Step1'den gelen applicationNo güncellemelerini dinle
  useEffect(() => {
    const handleApplicationNoUpdate = (event: CustomEvent) => {
      const newApplicationNo = event.detail;

      // Eğer pending state'deyse ve applicationNo geldiyse otomatik geçiş yap
      if (
        pendingApplicationNo === "pending" &&
        newApplicationNo &&
        stepIndex === 0
      ) {
        setPendingApplicationNo(null);
        router.push(`/newapplication/step/2/${newApplicationNo}`);
      }
    };

    window.addEventListener(
      "applicationNoUpdated",
      handleApplicationNoUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        "applicationNoUpdated",
        handleApplicationNoUpdate as EventListener
      );
    };
  }, [pendingApplicationNo, stepIndex]); // router dependency'den kaldırıldı

  // applicationNo null olduğunda pending state'i de temizle
  useEffect(() => {
    const currentApplicationNo = getApplicationNo();
    if (!currentApplicationNo) {
      setPendingApplicationNo(null);
    }
  }, []); // getApplicationNo dependency'den kaldırıldı - sonsuz döngüyü önlemek için

  // Form verilerini session storage'a kaydet
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      saveFormDataToStorage(formData);
    }
  }, [formData]); // saveFormDataToStorage dependency'den kaldırıldı

  // Component mount olduğunda session storage'dan form verilerini yükle
  useEffect(() => {
    const storedFormData = getFormDataFromStorage();
    if (Object.keys(storedFormData).length > 0) {
      // Mevcut formData ile birleştir (override etme)
      setFormData((prev) => ({ ...prev, ...storedFormData }));
    }
  }, []); // Sadece component mount'ta çalışsın

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isNaN(stepIndex) || stepIndex < 0 || stepIndex >= steps.length) {
        router.replace("/newapplication/step/1");
      }
    }
    // Step3'ten çıkıldığında likelihood durumunu sıfırla
    if (stepIndex !== 2) {
      setIsLikelihoodChecked(false);
    } else {
      // Step3'e döndüğünde, eğer likelihood rate varsa checked olarak işaretle
      if (formData.likelihoodRate) {
        setIsLikelihoodChecked(true);
      }
    }
  }, [stepIndex, formData.likelihoodRate]); // router dependency'den kaldırıldı

  // TÜM HOOK'LAR BURADA OLMALI - conditional rendering'den önce
  const handleChange = useCallback((name: string, value?: InputValue) => {
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [name]: value,
      };

      // Session storage'a da kaydet
      saveFormDataToStorage(newFormData);

      return newFormData;
    });
  }, []); // setFormData ve saveFormDataToStorage stable olduğu için dependency'den kaldırıldı

  // useApi hook'unu burada çağır
  const { post } = useApi();

  // Authentication kontrol edilirken loading göster
  if (isAuthChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Application data yüklenirken loading göster (Step 1'de)
  if (isLoadingApplicationData && stepIndex === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600">Loading application data...</p>
        </div>
      </div>
    );
  }

  const validateCurrentStep = async (): Promise<boolean> => {
    const formRefs = [
      step1FormRef,
      step2FormRef,
      step3FormRef,
      step4FormRef,
      step5FormRef,
      step6FormRef,
      step7FormRef,
    ];
    const currentFormRef = formRefs[stepIndex];

    if (currentFormRef?.current) {
      try {
        const isValid = await currentFormRef.current.trigger();
        return isValid;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return false;
      }
    }

    return true; // Form ref yoksa validation'ı geç
  };

  const nextStep = async () => {
    // Önce validation kontrolü yap
    const isValid = await validateCurrentStep();

    if (!isValid) {
      return; // Sadece return et, alert gösterme
    }

    // Step1'den sonra applicationNo ile navigation yap
    if (stepIndex === 0) {
      // Küçük bir delay ile applicationNo'nun session storage'a yazılmasını bekle
      await new Promise((resolve) => setTimeout(resolve, 150));

      const currentApplicationNo = getApplicationNo();

      // Step1'den Step2'ye geçerken applicationNo gerekli
      if (!currentApplicationNo) {
        // Eğer applicationNo henüz yoksa, pending state'e kaydet ve beklet
        setPendingApplicationNo("pending");
        return;
      }
      // Step1'den Step2'ye geçerken applicationNo ile URL oluştur
      router.push(`/newapplication/step/2/${currentApplicationNo}`);
    } else {
      const currentApplicationNo = getApplicationNo();
      if (currentApplicationNo) {
        // Diğer step'lerde applicationNo ile navigation
        router.push(
          `/newapplication/step/${stepIndex + 2}/${currentApplicationNo}`
        );
      } else {
        // applicationNo yoksa normal navigation
        router.push(`/newapplication/step/${stepIndex + 2}`);
      }
    }
  };

  const prevStep = () => {
    if (stepIndex === 1) {
      // Step2'den Step1'e dönerken applicationNo varsa URL'e ekle
      const currentApplicationNo = getApplicationNo();
      if (currentApplicationNo) {
        router.push(`/newapplication/step/1/${currentApplicationNo}`);
      } else {
        router.push(`/newapplication/step/1`);
      }
      // Step1'e dönüldüğünde flag'leri reset et
      setIsLikelihoodChecked(false);
    } else if (stepIndex > 1) {
      // Diğer step'lerde applicationNo ile navigation
      const currentApplicationNo = getApplicationNo();
      if (currentApplicationNo) {
        router.push(
          `/newapplication/step/${stepIndex}/${currentApplicationNo}`
        );
      } else {
        // Fallback
        router.push(`/newapplication/step/${stepIndex}`);
      }
    } else {
      // Fallback
      router.push(`/newapplication/step/${stepIndex}`);
    }
  };

  const handleSubmit = async () => {
    // Son step için de validation kontrolü yap
    const isValid = await validateCurrentStep();
    if (!isValid) {
      return; // Sadece return et, alert gösterme
    }

    // Step 7 (Payment) için 3D Secure sayfasına yönlendir
    if (stepIndex === 6) {
      const applicationNo = getApplicationNo();
      const amount = formData.checkoutTotal || 70.0; // Default amount

      if (applicationNo) {
        // 3D Secure payment sayfasına güvenli yönlendirme
        // Next.js router kullanarak Open Redirect saldırılarını önle
        router.push(
          `/payment/3d-secure?applicationNo=${applicationNo}&amount=${amount}`
        );
        return;
      } else {
        alert("Application number not found. Please try again.");
        return;
      }
    }

    // Diğer step'ler için normal submit işlemi
    try {
      const result = await post("/api/submit", formData);

      if (result.success) {
        alert("Success: " + JSON.stringify(result.data));
        resetFormData();
      } else {
        alert("Final Submission Failed: " + result.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Final submission failed: Network or server error.");
    }
  };

  return (
    <section className="flex-grow flex flex-col items-center justify-center px-4 py-20 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-7xl bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 overflow-x-auto">
        <div className="flex gap-6 mb-10 min-w-[900px] justify-between">
          {steps.map((label, index) => (
            <div key={index} className="text-center flex-1 min-w-[120px]">
              <div
                className={`w-10 h-10 mx-auto rounded-full text-sm flex items-center justify-center font-semibold ${
                  index === stepIndex
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {index + 1}
              </div>
              <div
                className={`text-xs mt-2 whitespace-normal ${
                  index === stepIndex
                    ? "text-blue-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {stepIndex === 0 ? (
                <Step1
                  ref={step1FormRef}
                  formData={formData}
                  handleChange={handleChange}
                />
              ) : stepIndex === 1 ? (
                <Step2
                  ref={step2FormRef}
                  formData={formData}
                  handleChange={handleChange}
                  applicationNo={getApplicationNo()}
                />
              ) : stepIndex === 2 ? (
                <Step3
                  ref={step3FormRef}
                  formData={formData}
                  handleChange={handleChange}
                  onLikelihoodChecked={setIsLikelihoodChecked}
                  applicationNo={getApplicationNo()}
                />
              ) : stepIndex === 3 ? (
                <Step4
                  ref={step4FormRef}
                  formData={formData}
                  handleChange={handleChange}
                  applicationNo={getApplicationNo()}
                />
              ) : stepIndex === 4 ? (
                <Step5
                  ref={step5FormRef}
                  formData={formData}
                  handleChange={handleChange}
                  applicationNo={getApplicationNo()}
                />
              ) : stepIndex === 5 ? (
                <Step6
                  ref={step6FormRef}
                  formData={formData}
                  handleChange={handleChange}
                  applicationNo={getApplicationNo()}
                />
              ) : (
                <Step7
                  ref={step7FormRef}
                  formData={formData}
                  handleChange={handleChange}
                  applicationNo={getApplicationNo()}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-end pt-4">
            {stepIndex > 0 && (
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Back
                </button>
                {stepIndex < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={
                      (stepIndex === 2 && !isLikelihoodChecked) ||
                      (stepIndex === 0 && pendingApplicationNo === "pending")
                    }
                    className={`px-4 py-2 rounded ${
                      (stepIndex === 2 && !isLikelihoodChecked) ||
                      (stepIndex === 0 && pendingApplicationNo === "pending")
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {stepIndex === 0 && pendingApplicationNo === "pending"
                      ? "Saving..."
                      : "Save and Continue"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    {formData.checkoutTotal
                      ? `Place Order ($${Number(formData.checkoutTotal).toFixed(
                          2
                        )})`
                      : "Submit"}
                  </button>
                )}
              </div>
            )}
            {stepIndex === 0 && (
              <button
                type="button"
                onClick={nextStep}
                disabled={pendingApplicationNo === "pending"}
                className={`px-4 py-2 rounded ${
                  pendingApplicationNo === "pending"
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {pendingApplicationNo === "pending"
                  ? "Saving..."
                  : "Save and Continue"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
