type Params = { id: string };

interface ObservationProps {
  params: Params;
}

export default async function Observation({ params }: ObservationProps) {
  const { id } = params;
  return <>{JSON.stringify(id, null, 2)}</>;
}
