type Params = Promise<{ id: string }>;

interface ObservationProps {
  params: Params;
}

export default async function Observation({ params }: ObservationProps) {
  const { id } = await params;
  return <>{JSON.stringify(id, null, 2)}</>;
}
