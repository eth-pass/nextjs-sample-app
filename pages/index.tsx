import { CameraIcon, TicketIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

const features = [
  {
    name: "Scanner",
    route: "/scanner",
    description: "Web camera module for scanning passes",
    icon: <CameraIcon className="h-6 w-6 text-white" />,
  },
  {
    name: "Generate Pass",
    route: "/create",
    description: "Using traditional web3 wallet",
    icon: (
      <TicketIcon
        className="h-6 w-6 text-white"
        style={{ transform: "rotate(270deg)" }}
      />
    ),
  },
  {
    name: "Magic Link",
    route: "/magiclink",
    description: "Using Magic Link custodial wallet",
    icon: (
      <svg
        className="h-6"
        width="26"
        height="31"
        viewBox="0 0 26 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.8533 0C14.1947 1.64317 15.6741 3.16914 17.274 4.56019C16.2081 8.01821 15.6342 11.6921 15.6342 15.5C15.6342 19.308 16.2081 22.9818 17.274 26.4399C15.6742 27.8309 14.1947 29.3568 12.8533 31C11.5121 29.357 10.0328 27.8312 8.43313 26.4403C9.49916 22.9821 10.0731 19.3081 10.0731 15.5C10.0731 11.6919 9.49916 8.01785 8.43312 4.55968C10.0328 3.16877 11.5121 1.64297 12.8533 0Z"
          fill="#ffffff"
        />
        <path
          d="M5.37476 24.049C3.68158 22.8621 1.88466 21.8131 0.000297072 20.9184C0.523041 19.2046 0.804248 17.3854 0.804248 15.5005C0.804248 13.6153 0.522934 11.7958 0 10.0817C1.88446 9.18693 3.68148 8.13791 5.37474 6.95092C6.02224 9.69542 6.36486 12.5577 6.36486 15.5C6.36486 18.4423 6.02225 21.3046 5.37476 24.049Z"
          fill="#ffffff"
        />
        <path
          d="M19.3416 15.5C19.3416 18.4423 19.6842 21.3046 20.3317 24.0492C22.0252 22.862 23.8224 21.8129 25.7071 20.9181C25.1845 19.2043 24.9033 17.3853 24.9033 15.5005C24.9033 13.6155 25.1846 11.7961 25.7074 10.0821C23.8226 9.18729 22.0253 8.1381 20.3317 6.95089C19.6842 9.6954 19.3416 12.5577 19.3416 15.5Z"
          fill="#ffffff"
        />
      </svg>
    ),
  },
  {
    name: "Crossmint",
    route: "/crossmint",
    description: "Using Crossmint custodial wallet",
    icon: (
      <svg
        className="h-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 995.87"
      >
        <path
          fill="#ffffff"
          d="M970.31,889.5s9.6-.12,16,4.63c0,0,19.09-38.79-49.46-107.81,0,0,9.49-4.27,21.94-.12,0,0-1.93-59.1-73.09-113.18,0,0,10.47-3.84,15.69-1.86,0,0-27.63-52.78-99.5-81a52.06,52.06,0,0,1,24.19-5.86s-53.61-63.72-146.75-58.19c0,0,4.9-5.69,14.87-9.25,0,0-15-10.19-50.85-14.64-19.07-4.25-43.24-5.36-43.24-5.36,7.79-.22,24.11-4.81,33.63-7.68,39.34-4.22,77.39-14.39,95.74-36.48,0,0-7.91,2.53-19.21-8.3,0,0,81.51-7.83,141-85.95,0,0-20.56,8.19-32.83-.41,0,0,73.83-29.59,91.38-83.68,0,0-14,9-30.3,7.06,0,0,45.12-31.13,62-84.74,0,0-13.88,7.39-24.79,3,0,0,52-37,45-92.39,0,0-8.19,12.57-25.26,8.18,0,0,54.35-59.34,31.42-115.16,0,0-40.32-5.22-76.85,29.41,0,0-.12-9.6,4.63-16,0,0-38.78-19.09-107.81,49.46,0,0-4.27-9.49-.12-21.94,0,0-59.1,1.93-113.18,73.09,0,0-3.84-10.47-1.86-15.69,0,0-52.78,27.63-81,99.5a52,52,0,0,1-5.85-24.19S522,227.52,527.55,320.66c0,0-5.69-4.9-9.25-14.87,0,0-7.46,11-12.41,36.61-4.85,22.51-7.14,54-7.14,54,.13-16.77-8.69-46.09-12.27-57.29C481.16,307.3,471,278.5,452.7,263.28c0,0,2.53,7.9-8.3,19.21,0,0-7.83-81.52-85.95-141,0,0,8.19,20.56-.41,32.84,0,0-29.59-73.83-83.68-91.39,0,0,9,14,7.06,30.31,0,0-31.13-45.13-84.74-62,0,0,7.39,13.87,3,24.79,0,0-37-51.95-92.39-44.95,0,0,12.57,8.18,8.18,25.26C115.44,56.4,56.1,2,.28,25c0,0-5.22,40.32,29.41,76.85,0,0-9.6.12-16-4.62,0,0-19.09,38.78,49.46,107.8,0,0-9.49,4.27-21.94.12,0,0,1.93,59.1,73.09,113.19,0,0-10.47,3.83-15.69,1.85,0,0,27.63,52.78,99.5,81A52,52,0,0,1,173.91,407s53.61,63.73,146.75,58.19c0,0-4.9,5.69-14.87,9.25,0,0,7.12,4.82,23.18,9.28,21.27,8,91.82,10.59,91.82,10.59-10.91,1.84-27,6.31-43.7,11.44-42.68,3.55-85.62,13.49-105.47,37.4,0,0,7.9-2.53,19.21,8.3,0,0-81.52,7.83-141,85.95,0,0,20.56-8.19,32.84.41,0,0-73.83,29.59-91.39,83.67,0,0,14-9,30.31-7,0,0-45.13,31.13-62,84.74,0,0,13.87-7.4,24.79-3,0,0-52,37-45,92.39,0,0,8.18-12.57,25.26-8.18,0,0-54.36,59.34-31.43,115.16,0,0,40.32,5.22,76.85-29.41,0,0,.12,9.6-4.62,16,0,0,38.78,19.09,107.8-49.46,0,0,4.27,9.49.12,21.94,0,0,59.1-1.94,113.19-73.1,0,0,3.83,10.48,1.85,15.7,0,0,52.78-27.63,81-99.51a52,52,0,0,1,5.85,24.2s63.73-53.61,58.19-146.75c0,0,5.69,4.9,9.25,14.87,0,0,19.18-28.29,16.39-99.78,3.85,14.84,7.89,29.14,11.61,41.73,4.2,39.44,14.36,77.63,36.5,96,0,0-2.53-7.91,8.3-19.22,0,0,7.83,81.52,85.95,141,0,0-8.18-20.56.41-32.83,0,0,29.59,73.83,83.68,91.38,0,0-9-14-7.06-30.3,0,0,31.13,45.12,84.74,62,0,0-7.39-13.87-3-24.78,0,0,37,51.94,92.39,45,0,0-12.57-8.19-8.18-25.26,0,0,59.34,54.35,115.16,31.42C999.72,966.35,1004.94,926,970.31,889.5ZM499.57,517.66C381.15,592.75,144.65,854.75,144.65,854.75c34-84.53,218.09-288.31,342.57-358.25C410.92,377.61,151,143,151,143,235.42,177,438.56,360.41,508.88,484.87c126.6-72,353.7-341.72,353.7-341.72-10.58,66.61-228.87,298-342.5,362.62C590.76,632.07,862.64,861,862.64,861,795.87,850.35,563.52,631.06,499.57,517.66Z"
        />
      </svg>
    ),
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
