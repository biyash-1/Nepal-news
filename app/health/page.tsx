
import CategoryNewsPage from "@/components/CategoryNews";
export default function HealthPage() {
  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CategoryNewsPage
          category="स्वास्थ्य"
          title="स्वास्थ्य समाचार"
          gradient="from-blue-50 to-indigo-50"
        />
      </div>
    </>
  );
}
