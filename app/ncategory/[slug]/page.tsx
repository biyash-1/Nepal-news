import NcategoryNewsPage from "@/components/Ncategory";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const decodedSlug = decodeURIComponent(slug);
  const dict: Record<string, string> = {
    bollywood: "बलिउड",
    gossip: "गपशप",
    music: "सङ्गीत",
    special: "विशेष",
  };

  const nepaliWord = dict[decodedSlug]


  return (
    <NcategoryNewsPage
      category={nepaliWord}
      title={`${nepaliWord} समाचार`}
      gradient="from-green-50 to-blue-50"
    />
  );
}
