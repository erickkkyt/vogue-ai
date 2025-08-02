import Worker from "@/components/replicate/image-edit/worker";

export default async function WorkerWrapper(params: { 
  model: string, 
  effect_link_name: string, 
  version: string, 
  credit: number, 
  promptTips?: string 
}) {
  return (
    <div className="flex flex-col w-full max-w-7xl mt-6">
      <Worker
        model={params.model}
        effect_link_name={params.effect_link_name}
        version={params.version}
        credit={params.credit}
        promptTips={params.promptTips}
        defaultImage={"https://media.seedanceai.io/volcano-images/seedreamai_20.webp"}
      />
    </div>
  );
}
