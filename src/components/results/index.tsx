import Image from "next/image";
import { QueryProps, Result } from "@/components/results/types";
import { getImageBySize, objectToSearchParams } from "@/lib/utils";
import Link from "next/link";

interface Response {
  total_results: number;
  page: number;
  per_page: number;
  results: Array<Result>;
}

const fetchQuery = async ({
  query,
  ...props
}: QueryProps): Promise<Response> => {
  const params = objectToSearchParams({ q: query, ...props });
  const uri = `https://api.inaturalist.org/v1/observations?${params}`;

  console.log(uri);
  const response = await fetch(uri, {
    cache: "force-cache",
  });
  return response.json();
};

export const Results = async (props: QueryProps) => {
  const response = await fetchQuery(props);
  return (
    <div className="flex flex-col gap-4">
      <div className="">Total: {response.total_results}</div>
      <GridLayout response={response} />
    </div>
  );
};

const GridLayout = ({ response }: { response: Response }) => {
  const photos = response.results.flatMap((result) => result.photos);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => {
        const [image] = getImageBySize({
          url: photo.url,
          id: photo.id,
        });

        const observation = response.results.find((result) =>
          result.photos.find(({ id }) => id === photo.id)
        );

        return (
          <div
            key={photo.id}
            className="w-full h-auto aspect-square relative overflow-hidden group"
          >
            <Link
              className="absolute left-0 right-0 bottom-0 p-4 bg-black/50 z-40 group-hover:opacity-100 opacity-0 transition-all flex items-center justify-center hover:bg-blue-600"
              href={observation?.uri || ""}
              target="_blank"
            >
              View observation
            </Link>
            <Image
              className="group-hover:scale-110 transition-transform"
              fill
              src={image}
              alt={photo.id}
              style={{ objectFit: "cover" }}
            />
          </div>
        );
      })}
    </div>
  );
};

// const StandardLayout = ({ response }: { response: Response }) => {
//   return (
//     <div className="flex flex-col gap-8">
//       {response.results?.map((result: Result) => {
//         return (
//           <div key={result.id} className="flex flex-col gap-8 items-center">
//             <div className="flex flex-col md:flex-row gap-2 md:items-end">
//               <h1 className="text-3xl italic">{result.taxon.name}</h1>
//               <span className="text-lg">({result.species_guess})</span>
//             </div>

//             <div className="flex gap-4 overflow-auto">
//               {result.photos?.map((photo) => {
//                 const [image, size] = getImageBySize({
//                   url: photo.url,
//                   id: photo.id,
//                   size: "small",
//                 });

//                 return image ? (
//                   <div
//                     key={photo.id}
//                     className="w-[240] h-[240] relative overflow-hidden"
//                   >
//                     {/* <pre>{JSON.stringify({ image, size }, null, 2)}</pre> */}
//                     <Image
//                       key={photo.id}
//                       src={image}
//                       alt={result.species_guess || result.taxon.name}
//                       width={size}
//                       height={size}
//                       style={{ objectFit: "cover" }}
//                     />
//                   </div>
//                 ) : null;
//               })}
//             </div>

//             <div className="flex gap-4 items-center">
//               {result.user.icon_url ? (
//                 <div className="relative w-12 h-12 rounded-full overflow-hidden">
//                   <Image
//                     src={result.user.icon_url}
//                     alt={result.user.login}
//                     fill
//                     style={{ objectFit: "cover" }}
//                   />
//                 </div>
//               ) : null}

//               <div>
//                 Observed by <span className="italic">{result.user.login}</span>
//               </div>
//             </div>

//             <ButtonLink
//               className="bg-blue-700 w-fit p-4 hover:bg-blue-600 transition-colors"
//               href={result.uri}
//               target="_blank"
//             >
//               View observation
//             </ButtonLink>
//           </div>
//         );
//       })}

//       {/* <pre>{JSON.stringify(response, null, 2)}</pre> */}
//     </div>
//   );
// };
