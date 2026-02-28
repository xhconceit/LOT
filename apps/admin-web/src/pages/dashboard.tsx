import { useTranslation } from "react-i18next";

export function Dashboard() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("app.title")}</h1>
        <p className="text-lg text-gray-600">{t("app.description")}</p>
      </div>
    </div>
  );
}
