import CategoryNewsPage from "@/components/CategoryNews";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const decodedSlug = decodeURIComponent(slug);

  console.log("category is:", decodedSlug);

  return (
    <CategoryNewsPage
      category={decodedSlug}
      title={`${decodedSlug} समाचार`}
      gradient="from-green-50 to-blue-50"
    />
  );
}
