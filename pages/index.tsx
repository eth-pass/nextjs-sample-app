import { CameraIcon, TicketIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

const features = [
  {
    name: "Generate Pass",
    route: "/create",
    description: "Start by creating your creating your first pass",
    icon: (
      <TicketIcon
        className="h-6 w-6 text-white"
        style={{ transform: "rotate(270deg)" }}
      />
    ),
  },
  {
    name: "Scanner",
    route: "/scanner",
    description: "Web camera module for scanning passes",
    icon: <CameraIcon className="h-6 w-6 text-white" />,
  },
];

export default function Example() {
  const router = useRouter();

  return (
    <div className="relative bg-white py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-base font-semibold uppercase tracking-wider text-indigo-600">
          ethpass.xyz
        </h2>
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Sample integrations
        </p>
        <p className="mx-auto mt-5 max-w-prose text-xl text-gray-500">
          Here are some examples you can use to get started with integrating our
          API.
        </p>
        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 justify-center">
            {features.map((feature) => (
              <button
                key={feature.name}
                className="pt-6"
                onClick={() => router.push(feature.route)}
              >
                <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-3 shadow-lg">
                        {feature.icon}
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                      {feature.name}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
